import Schema from '@deepseek-ai/schemastery'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { OpenAIAccount, AccountError, safeError } from './account.js'

export const name = 'openai-account'
export const inject = ['connection', 'credentials']
export const Config = Schema.object({
  adminKeyRef: Schema.string().pattern(/^[A-Za-z_][A-Za-z0-9_]*$/).default('OPENAI_ACCOUNT_ADMIN_KEY').description('管理员密钥的凭据引用名；不填写密钥本身。'),
  timeoutMs: Schema.number().min(1000).max(120000).step(1).default(30000).description('账户查询超时（毫秒）。'),
})

export function createHandler(credentials, config, lifetime, account = new OpenAIAccount()) {
  const ref = credentialRef(config.adminKeyRef)
  return async (endpoint, payload, signal, peer) => {
    if (peer?.principal?.kind !== 'owner') return { ok: false, error: { code: 'FORBIDDEN', message: '仅 Harness 所有者可以查看或配置账户信息。', details: {} } }
    try {
      const operationSignal = AbortSignal.any([signal, lifetime, AbortSignal.timeout(config.timeoutMs)])
      operationSignal.throwIfAborted()
      if (endpoint === 'save-key') {
        const key = typeof payload?.key === 'string' ? payload.key.trim() : ''
        if (!/^sk-admin-\S{1,1000}$/.test(key)) throw new AccountError('INVALID_KEY', '请填写 Admin API Key（以 sk-admin- 开头），普通模型密钥无法查询组织账务。')
        const info = await credentials.describe(ref)
        if (!info.writable) throw new AccountError('READ_ONLY', '当前凭据存储不可写，请在 Harness 的凭据配置中设置管理员密钥。')
        try { await credentials.set(ref, key) }
        catch { throw new AccountError('CREDENTIAL_STORAGE', '无法保存管理员密钥，请检查 Harness 凭据存储的写入权限。') }
        return { ok: true, value: { saved: true } }
      }
      if (endpoint !== 'overview') throw new AccountError('NOT_FOUND', '未知的账户操作。')
      const info = await credentials.describe(ref)
      const credential = await credentials.resolve(ref)
      const status = { configured: Boolean(credential?.value), writable: info.writable, credentialRef: config.adminKeyRef }
      if (!credential?.value) return { ok: true, value: { ...status, overview: null } }
      const overview = await account.overview(payload, credential.value, operationSignal)
      return { ok: true, value: { ...status, overview } }
    } catch (error) {
      return { ok: false, error: { ...safeError(error), details: {} } }
    }
  }
}

export function apply(ctx, config) {
  const lifetime = new AbortController()
  const connection = ctx.connection
  const handler = createHandler(ctx.credentials, config, lifetime.signal)
  ctx.effect(() => {
    // DSH 0.2.2-rc.1 standalone RPC registration loses the webServer injection context.
    // Exact routes use the authenticated shared /api carrier instead.
    const disposers = ['overview', 'save-key'].map(endpoint => connection.fetch.register({
      path: `/api/openai-account/${endpoint}`,
      methods: ['POST'],
      requestBody: 'buffered',
      async fetch(request) {
        const admission = connection.admit(request)
        if ('rejection' in admission) return new Response('unauthorized', { status: admission.rejection })

        const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
        if (contentType !== 'application/json') return new Response('unsupported content type', { status: 415 })

        let body
        try { body = await request.json() }
        catch { return new Response('invalid JSON', { status: 400 }) }
        if (body?.type !== 'client-request' || typeof body.rpcId !== 'string' || body.method !== `openai-account/${endpoint}`) {
          return new Response('invalid RPC envelope', { status: 400 })
        }

        const result = await handler(endpoint, body.payload, request.signal, admission.peer)
        return Response.json({ type: 'server-response', rpcId: body.rpcId, result })
      },
    }))
    return async () => { lifetime.abort(); await Promise.all(disposers.map(dispose => dispose())) }
  })
}
