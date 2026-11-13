const DAY = 86400
const API = 'https://api.openai.com/v1'

export class AccountError extends Error {
  constructor(code, message) { super(message); this.code = code }
}

export function timeRange(range, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
  // Costs omits today's daily bucket when end_time falls inside it.
  // Use the next UTC midnight (exclusive) to include today's recorded costs.
  const endTime = today + DAY
  const starts = { month: Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000, '7d': today - 6 * DAY, '30d': today - 29 * DAY }
  if (!Object.hasOwn(starts, range)) throw new AccountError('INVALID_RANGE', '请选择本月、近 7 天或近 30 天。')
  return { startTime: starts[range], endTime, timezone: 'UTC' }
}

function malformed() { return new AccountError('INVALID_RESPONSE', 'OpenAI 返回的数据格式不完整，本项未计入统计。请重试或查看官方用量页。') }
function count(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw malformed()
  return value
}
function rows(buckets) {
  return buckets.flatMap(bucket => {
    if (!Number.isSafeInteger(bucket.start_time) || !Array.isArray(bucket.results)) throw malformed()
    return bucket.results.map(result => ({ day: new Date(bucket.start_time * 1000).toISOString().slice(0, 10), result }))
  })
}

export function summarizeUsage(buckets) {
  const total = { inputTokens: 0, cachedTokens: 0, outputTokens: 0, requests: 0 }
  const models = new Map()
  for (const { result } of rows(buckets)) {
    const model = typeof result.model === 'string' ? result.model : '未分组模型'
    const row = models.get(model) ?? { model, inputTokens: 0, cachedTokens: 0, outputTokens: 0, requests: 0 }
    const values = { inputTokens: count(result.input_tokens), outputTokens: count(result.output_tokens), requests: count(result.num_model_requests), cachedTokens: result.input_cached_tokens == null ? null : count(result.input_cached_tokens) }
    for (const field of Object.keys(values)) {
      for (const target of [total, row]) target[field] = target[field] === null || values[field] === null ? null : target[field] + values[field]
    }
    models.set(model, row)
  }
  return { ...total, models: [...models.values()].sort((a, b) => b.inputTokens + b.outputTokens - a.inputTokens - a.outputTokens) }
}

export function summarizeCosts(buckets) {
  const totals = new Map(), daily = new Map(), items = new Map()
  for (const { day, result } of rows(buckets)) {
    const amount = result.amount
    if (!amount || !Number.isFinite(amount.value) || typeof amount.currency !== 'string' || !/^[a-z]{3}$/i.test(amount.currency)) throw malformed()
    const currency = amount.currency.toLowerCase()
    const lineItem = typeof result.line_item === 'string' ? result.line_item : '未分组费用'
    const projectId = typeof result.project_id === 'string' ? result.project_id : null
    const dailyKey = `${day}:${currency}`
    const itemKey = JSON.stringify([currency, lineItem, projectId])
    totals.set(currency, (totals.get(currency) ?? 0) + amount.value)
    const dateRow = daily.get(dailyKey) ?? { day, currency, value: 0 }
    dateRow.value += amount.value
    daily.set(dailyKey, dateRow)
    const itemRow = items.get(itemKey) ?? { currency, lineItem, projectId, value: 0 }
    itemRow.value += amount.value
    items.set(itemKey, itemRow)
  }
  return {
    totals: [...totals].map(([currency, value]) => ({ currency, value })),
    daily: [...daily.values()].sort((a, b) => a.day.localeCompare(b.day)),
    items: [...items.values()].sort((a, b) => b.value - a.value),
  }
}

export function safeError(error) {
  if (error instanceof AccountError) return { code: error.code, message: error.message }
  if (error?.name === 'AbortError') return { code: 'CANCELLED', message: '查询已取消。' }
  if (error?.name === 'TimeoutError') return { code: 'TIMEOUT', message: '查询超时，请稍后重试。' }
  return { code: 'NETWORK', message: '无法连接 OpenAI，请检查网络或代理设置后重试。' }
}

export class OpenAIAccount {
  constructor({ fetch: request = globalThis.fetch } = {}) { this.fetch = request }

  async get(path, params, key, signal) {
    signal.throwIfAborted()
    const url = new URL(API + path)
    for (const [name, value] of Object.entries(params)) if (value !== undefined && value !== '') {
      for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(name, String(item))
    }
    const response = await this.fetch(url, { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' }, signal, redirect: 'error' })
    if (!response.ok) {
      await response.body?.cancel()
      const messages = {
        401: ['AUTH', '管理员密钥无效、已过期或已撤销。请重新配置 Admin API Key。'],
        403: ['PERMISSION', '此密钥无权查询本项。请确认 Admin API Key 及组织权限。'],
        404: ['UNAVAILABLE', '当前账户或接口不提供本项信息。'],
        429: ['RATE_LIMIT', 'OpenAI 查询频率受限，请稍后点击刷新。'],
        400: ['QUERY_REJECTED', 'OpenAI 未接受查询条件。请检查项目 ID，或移除筛选后重试。'],
      }
      const [code, message] = messages[response.status] ?? ['UPSTREAM', 'OpenAI 暂时无法提供本项数据，请稍后重试。']
      throw new AccountError(code, message)
    }
    try { return await response.json() } catch (error) {
      if (signal.aborted) throw signal.reason
      throw malformed()
    }
  }

  async pages(path, params, key, signal) {
    const buckets = [], seen = new Set()
    let cursor
    do {
      const response = await this.get(path, { ...params, page: cursor }, key, signal)
      if (!response || !Array.isArray(response.data) || typeof response.has_more !== 'boolean') throw malformed()
      buckets.push(...response.data)
      if (!response.has_more) return buckets
      cursor = response.next_page
      if (typeof cursor !== 'string' || !cursor || seen.has(cursor) || seen.size >= 100) throw new AccountError('PAGINATION', '分页查询未完整结束，本项不显示不完整的合计。请重试或缩短时间范围。')
      seen.add(cursor)
    } while (true)
  }

  async overview(query, key, signal, now = new Date()) {
    if (!query || typeof query !== 'object') throw new AccountError('INVALID_QUERY', '查询参数无效。')
    const range = timeRange(query.range ?? 'month', now)
    const projectId = query.projectId ?? ''
    if (typeof projectId !== 'string' || (projectId !== '' && !/^proj_[a-zA-Z0-9_-]{1,150}$/.test(projectId))) throw new AccountError('INVALID_PROJECT', '项目 ID 应以 proj_ 开头；留空查询整个组织。')
    const params = { start_time: range.startTime, end_time: range.endTime, bucket_width: '1d', 'project_ids[]': projectId }
    const section = async task => {
      try { return { status: 'ready', data: await task() } }
      catch (error) { return { status: 'error', error: safeError(error) } }
    }
    const [usage, costs, limit] = await Promise.all([
      section(async () => summarizeUsage(await this.pages('/organization/usage/completions', { ...params, limit: 31, 'group_by[]': 'model' }, key, signal))),
      section(async () => summarizeCosts(await this.pages('/organization/costs', { ...params, limit: 31, 'group_by[]': ['line_item', 'project_id'] }, key, signal))),
      section(async () => {
        const result = await this.get('/organization/spend_limit', {}, key, signal)
        if (!Number.isSafeInteger(result?.threshold_amount) || result.threshold_amount < 0 || result.currency !== 'USD' || result.interval !== 'month' || !['inactive', 'enforcing'].includes(result.enforcement?.status)) throw malformed()
        return { amount: result.threshold_amount / 100, currency: result.currency, interval: result.interval, enforcement: result.enforcement.status }
      }),
    ])
    return { range, projectId, fetchedAt: new Date().toISOString(), usage, costs, limit, balance: { status: 'unsupported', message: '尚无已核实的公开余额查询接口，请前往 OpenAI 账单页查看。' } }
  }
}
