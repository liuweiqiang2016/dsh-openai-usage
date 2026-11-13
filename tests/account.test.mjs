import test from 'node:test'
import assert from 'node:assert/strict'
import { OpenAIAccount, AccountError, timeRange, summarizeUsage, summarizeCosts } from '../src/account.js'

const now = new Date('2026-11-13T10:20:00Z')
const bucket = results => ({ start_time: 1793491200, end_time: 1793577600, results })
const page = (results, next = null) => Response.json({ data: [bucket(results)], has_more: next !== null, next_page: next })
const usage = (extra = {}) => ({ object: 'organization.usage.completions.result', model: 'test-model', input_tokens: 1000, input_cached_tokens: 600, output_tokens: 200, num_model_requests: 2, ...extra })

test('统计使用 UTC 日边界，本月与近 7 天包含今天', () => {
  assert.equal(timeRange('month', now).startTime, Date.parse('2026-11-01T00:00:00Z') / 1000)
  assert.equal(timeRange('7d', now).startTime, Date.parse('2026-11-07T00:00:00Z') / 1000)
  for (const range of ['month', '7d', '30d']) assert.equal(timeRange(range, now).endTime, Date.parse('2026-11-14T00:00:00Z') / 1000)
  assert.throws(() => timeRange('all', now), AccountError)
})

test('日桶截止边界覆盖 UTC 月末、跨年、闰日及本地时区跨日', () => {
  for (const [at, nextDay] of [
    ['2026-11-01T00:00:00Z', '2026-11-02T00:00:00Z'],
    ['2026-11-30T23:59:59Z', '2026-12-01T00:00:00Z'],
    ['2026-12-31T23:59:59Z', '2027-01-01T00:00:00Z'],
    ['2028-02-29T12:00:00Z', '2028-03-01T00:00:00Z'],
    ['2026-11-14T00:30:00+08:00', '2026-11-14T00:00:00Z'],
  ]) {
    for (const range of ['month', '7d', '30d']) {
      const result = timeRange(range, new Date(at))
      assert.equal(result.endTime, Date.parse(nextDay) / 1000)
      assert.ok(result.endTime > result.startTime)
      assert.equal((result.endTime - result.startTime) % 86400, 0)
    }
  }
})

test('费用接口按完整日桶返回时，今天费用进入每日列表及期间合计', async () => {
  const day = 86400
  const today = Date.parse('2026-11-13T00:00:00Z') / 1000
  const buckets = [
    { start_time: today - day, end_time: today, results: [{ amount: { value: 4.25, currency: 'usd' } }] },
    { start_time: today, end_time: today + day, results: [{ amount: { value: 0.625, currency: 'usd' } }] },
  ]
  const account = new OpenAIAccount({ fetch: async url => {
    if (url.pathname.endsWith('/costs')) {
      // Observed Costs API behavior: an intraday end_time omits today's daily bucket.
      const start = Number(url.searchParams.get('start_time'))
      const end = Number(url.searchParams.get('end_time'))
      return Response.json({ data: buckets.filter(bucket => bucket.start_time >= start && bucket.end_time <= end), has_more: false })
    }
    if (url.pathname.endsWith('/spend_limit')) return new Response(null, { status: 404 })
    return Response.json({ data: [], has_more: false })
  } })
  for (const range of ['month', '7d', '30d']) {
    const result = await account.overview({ range }, 'sk-admin-test', new AbortController().signal, now)
    assert.equal(result.costs.status, 'ready')
    assert.deepEqual(result.costs.data.daily.find(row => row.day === '2026-11-13'), { day: '2026-11-13', currency: 'usd', value: 0.625 })
    assert.ok(Math.abs(result.costs.data.totals[0].value - 4.875) < 1e-10)
  }
})

test('输入总量已经包含缓存；缓存缺失保持未知', () => {
  const result = summarizeUsage([bucket([usage(), usage({ model: 'second', input_tokens: 50, input_cached_tokens: 0 })])])
  assert.equal(result.inputTokens, 1050)
  assert.equal(result.cachedTokens, 600)
  assert.equal(result.outputTokens, 400)
  assert.equal(result.requests, 4)
  assert.equal(summarizeUsage([bucket([usage({ input_cached_tokens: undefined })])]).cachedTokens, null)
})

test('费用按币种汇总，保留负数调整，不混算或截断小额费用', () => {
  const result = summarizeCosts([bucket([
    { amount: { value: 0.000001, currency: 'usd' }, line_item: 'a' },
    { amount: { value: -0.02, currency: 'usd' }, line_item: 'adjustment' },
    { amount: { value: 2, currency: 'eur' }, line_item: 'other' },
  ])])
  assert.ok(Math.abs(result.totals.find(x => x.currency === 'usd').value + 0.019999) < 1e-12)
  assert.equal(result.totals.find(x => x.currency === 'eur').value, 2)
  assert.equal(result.items.length, 3)
})

test('费用金额缺失与 token 格式异常不能成为零或 NaN', () => {
  assert.throws(() => summarizeCosts([bucket([{ amount: null }])]), AccountError)
  assert.throws(() => summarizeUsage([bucket([usage({ input_tokens: -1 })])]), AccountError)
  assert.throws(() => summarizeUsage([bucket([usage({ input_tokens: '100' })])]), AccountError)
})

test('跟随全部分页，使用固定官方地址且不发送模型调用请求', async () => {
  const calls = []
  const account = new OpenAIAccount({ fetch: async (url, options) => {
    calls.push({ url: new URL(url), options })
    return new URL(url).searchParams.has('page') ? page([usage()]) : page([usage()], 'next cursor')
  } })
  const rows = await account.pages('/organization/usage/completions', { start_time: 10, 'project_ids[]': 'proj_123' }, 'sk-admin-test', new AbortController().signal)
  assert.equal(summarizeUsage(rows).requests, 4)
  assert.equal(calls.length, 2)
  assert.equal(calls[1].url.searchParams.get('page'), 'next cursor')
  assert.equal(calls[1].url.origin, 'https://api.openai.com')
  assert.equal(calls[1].url.searchParams.get('project_ids[]'), 'proj_123')
  assert.equal(calls[1].options.headers.Authorization, 'Bearer sk-admin-test')
  assert.equal(calls[1].options.redirect, 'error')
})

test('分页缺失 cursor 或循环时明确失败，避免漏算及无限请求', async () => {
  for (const next of [null, 'same']) {
    let calls = 0
    const account = new OpenAIAccount({ fetch: async () => {
      calls++
      return Response.json({ data: [], has_more: true, next_page: next })
    } })
    await assert.rejects(account.pages('/organization/costs', {}, 'key', new AbortController().signal), AccountError)
    assert.ok(calls <= 2)
  }
})

test('费用查询被拒绝时保留成功用量，上限以分转美元且不当成余额', async () => {
  const account = new OpenAIAccount({ fetch: async url => {
    if (url.pathname.endsWith('/costs')) return new Response('private error sk-admin-secret', { status: 403 })
    if (url.pathname.endsWith('/spend_limit')) return Response.json({ threshold_amount: 10000, currency: 'USD', interval: 'month', enforcement: { status: 'enforcing' } })
    return page([usage()])
  } })
  const result = await account.overview({ range: 'month', projectId: '' }, 'sk-admin-test', new AbortController().signal, now)
  assert.equal(result.usage.status, 'ready')
  assert.equal(result.costs.status, 'error')
  assert.equal(result.limit.data.amount, 100)
  assert.equal(result.balance.status, 'unsupported')
  assert.ok(!JSON.stringify(result).includes('sk-admin'))
})

test('429/401/网络错误都有明确状态且不暴露上游正文或异常密钥', async () => {
  for (const status of [401, 429, 500]) {
    const account = new OpenAIAccount({ fetch: async () => new Response('secret body', { status }) })
    const result = await account.overview({ range: '7d' }, 'key', new AbortController().signal, now)
    assert.equal(result.costs.status, 'error')
    assert.ok(!JSON.stringify(result).includes('secret body'))
  }
  const account = new OpenAIAccount({ fetch: async () => { throw new Error('sk-admin-secret') } })
  const result = await account.overview({ range: '7d' }, 'key', new AbortController().signal, now)
  assert.equal(result.costs.error.code, 'NETWORK')
  assert.ok(!JSON.stringify(result).includes('sk-admin'))
})

test('取消可中止分页，不再发出下一页请求', async () => {
  const abort = new AbortController()
  let calls = 0
  const account = new OpenAIAccount({ fetch: async () => {
    calls++
    abort.abort()
    return page([usage()], 'next')
  } })
  await assert.rejects(account.pages('/organization/costs', {}, 'key', abort.signal))
  assert.equal(calls, 1)
})
