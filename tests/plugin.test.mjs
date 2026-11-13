import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { once } from 'node:events'
import { Context, Service } from '@deepseek-ai/cordis'
import * as connectionPlugin from '@deepseek-ai/dsh-client-connection'
import * as plugin from '../src/index.js'

const config = { adminKeyRef: 'OPENAI_ACCOUNT_ADMIN_KEY', timeoutMs: 30000 }
const owner = { principal: { kind: 'owner' } }
const signal = () => new AbortController().signal

function memoryCredentials(initial) {
  let value = initial
  return {
    describe: async () => ({ configured: Boolean(value), writable: true }),
    resolve: async () => value ? { value, source: 'test' } : undefined,
    set: async (ref, next) => { assert.equal(ref, config.adminKeyRef); value = next },
  }
}

test('未配置时返回引导信息，账户密钥不进入响应', async () => {
  const handler = plugin.createHandler(memoryCredentials(), config, signal())
  const result = await handler('overview', { range: 'month' }, signal(), owner)
  assert.equal(result.ok, true)
  assert.equal(result.value.configured, false)
  assert.equal(result.value.overview, null)
})

test('非 owner 无法查询或写入管理员密钥', async () => {
  const credentials = { describe: () => { throw new Error('must not access') } }
  const handler = plugin.createHandler(credentials, config, signal())
  for (const endpoint of ['overview', 'save-key']) {
    const result = await handler(endpoint, { key: 'sk-admin-test' }, signal(), { principal: { kind: 'api' } })
    assert.equal(result.error.code, 'FORBIDDEN')
  }
})

test('普通模型密钥不能被保存；更换管理员密钥后下一次查询使用新值', async () => {
  const observed = []
  const handler = plugin.createHandler(memoryCredentials('sk-admin-old'), config, signal(), { overview: async (_query, key) => { observed.push(key); return {} } })
  assert.equal((await handler('save-key', { key: 'sk-proj-model-key' }, signal(), owner)).error.code, 'INVALID_KEY')
  await handler('overview', {}, signal(), owner)
  assert.equal((await handler('save-key', { key: 'sk-admin-new' }, signal(), owner)).ok, true)
  const result = await handler('overview', {}, signal(), owner)
  assert.deepEqual(observed, ['sk-admin-old', 'sk-admin-new'])
  assert.ok(!JSON.stringify(result).includes('sk-admin'))
})

test('插件卸载信号会中止查询', async () => {
  const lifetime = new AbortController()
  const handler = plugin.createHandler(memoryCredentials('sk-admin-test'), config, lifetime.signal, {
    overview: async (_query, _key, operationSignal) => {
      lifetime.abort()
      operationSignal.throwIfAborted()
    },
  })
  const result = await handler('overview', {}, signal(), owner)
  assert.equal(result.error.code, 'CANCELLED')
})

async function createHarness(t) {
  const root = new Context(), routes = new Map(), services = []
  t.after(async () => { for (const service of services.reverse()) await service.dispose() })
  services.push(await root.plugin({ apply(ctx) {
    class WebServer extends Service {
      constructor() { super(ctx, 'webServer'); this.host = '127.0.0.1'; this.protocol = 'http:' }
      register(route) {
        assert.equal(routes.has(route.path), false)
        routes.set(route.path, route)
        return () => routes.delete(route.path)
      }
    }
    new WebServer()
  } }))
  // Match desktop composition: these services belong to separate plugin contexts.
  services.push(await root.plugin({ apply(ctx) {
    const records = new Map()
    ctx.provide('credentials', {
      ...memoryCredentials(),
      async modifyRecord(key, update) {
        const next = await update(records.get(key))
        if (next !== undefined) records.set(key, next)
        return records.get(key)
      },
    })
  } }))
  services.push(await root.plugin(connectionPlugin, { maxRequestBodyBytes: 4096 }))
  const connection = root.get('connection')
  const shared = connection.createSharedFetchHandler('/api')
  function cookieFor(authority = '127.0.0.1') {
    const url = new URL(connection.authenticatedUrl(`http://${authority}/`))
    let cookie
    assert.equal(connection.authorizeIndex({ method: 'GET', url: url.pathname + url.search, headers: { host: authority } }, {
      writeHead(status, headers) { assert.equal(status, 303); cookie = headers['set-cookie'].split(';')[0] },
      end() {},
    }), false)
    assert.ok(cookie)
    return cookie
  }
  const cookie = cookieFor()
  function request(endpoint = 'overview', { headers, body, method = 'POST' } = {}) {
    return new Request(`http://127.0.0.1/api/openai-account/${endpoint}`, {
      method, headers: { host: '127.0.0.1', cookie, 'content-type': 'application/json', ...headers },
      ...(method === 'POST' ? { body: body ?? JSON.stringify({ type: 'client-request', rpcId: 'test-request', method: `openai-account/${endpoint}`, payload: {} }) } : {}),
    })
  }
  return { root, routes, shared, cookieFor, request }
}

test('独立服务上下文能加载插件；卸载移除两个精确路由并允许重新加载', async t => {
  const { root, routes, shared, request } = await createHarness(t)
  const fiber = await root.plugin(plugin, {})
  try {
    const response = await shared.fetch(request(), owner)
    assert.equal(response.status, 200)
    assert.equal((await response.json()).result.value.configured, false)
    assert.equal((await shared.fetch(request('unknown'), owner)).status, 404)
    assert.equal((await shared.fetch(request('overview', { method: 'GET' }), owner)).status, 404)
    await fiber.dispose()
    for (const endpoint of ['overview', 'save-key']) assert.equal((await shared.fetch(request(endpoint), owner)).status, 404)
    assert.ok(routes.has('/api'))
    const reloaded = await root.plugin(plugin, {})
    try { assert.equal((await shared.fetch(request(), owner)).status, 200) }
    finally { await reloaded.dispose() }
  } finally { await fiber.dispose() }
})

test('共享通道拒绝非 owner、错误内容类型、非法 JSON 及不匹配的 RPC envelope', async t => {
  const { root, shared, request } = await createHarness(t)
  const fiber = await root.plugin(plugin, {})
  try {
    for (const endpoint of ['overview', 'save-key']) {
      assert.equal((await shared.fetch(request(endpoint), { principal: { kind: 'api' } })).status, 403)
      assert.equal((await shared.fetch(request(endpoint, { headers: { 'content-type': 'text/plain' } }), owner)).status, 415)
      assert.equal((await shared.fetch(request(endpoint, { body: '{' }), owner)).status, 400)
      for (const envelope of [null, {}, { type: 'client-request', rpcId: 1, method: `openai-account/${endpoint}` }, { type: 'client-request', rpcId: 'test', method: 'openai-account/wrong' }]) {
        assert.equal((await shared.fetch(request(endpoint, { body: JSON.stringify(envelope) }), owner)).status, 400)
      }
    }
  } finally { await fiber.dispose() }
})

test('真实 Connection HTTP 桥接保留签名认证与 Host/Origin 检查，保存密钥不回传', async t => {
  const { root, routes, cookieFor } = await createHarness(t)
  const fiber = await root.plugin(plugin, {})
  t.after(() => fiber.dispose())
  const server = createServer((request, response) => {
    routes.get('/api').handler(request, response).catch(() => { response.writeHead(500); response.end() })
  })
  t.after(async () => {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const authority = `127.0.0.1:${server.address().port}`
  const url = `http://${authority}/api/openai-account/`
  const cookie = cookieFor(authority)
  // Native HTTP avoids Fetch's forbidden-port list when Windows assigns a low ephemeral port.
  const request = (method, payload, headers = {}) => new Promise((resolve, reject) => {
    const outgoing = httpRequest(url + method, { method: 'POST', headers: { 'content-type': 'application/json', ...headers } }, response => {
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('error', reject)
      response.on('end', () => resolve({ status: response.statusCode, json: () => JSON.parse(Buffer.concat(chunks).toString('utf8')) }))
    })
    outgoing.on('error', reject)
    outgoing.end(JSON.stringify({ type: 'client-request', rpcId: 'test-request', method: `openai-account/${method}`, payload }))
  })
  for (const endpoint of ['overview', 'save-key']) {
    assert.equal((await request(endpoint, {})).status, 401)
    assert.equal((await request(endpoint, {}, { cookie: cookie + 'tampered' })).status, 401)
    assert.equal((await request(endpoint, {}, { cookie, Origin: 'https://untrusted.example' })).status, 403)
    assert.equal((await request(endpoint, {}, { cookie, Host: 'untrusted.example' })).status, 403)
  }
  const initial = (await request('overview', {}, { cookie })).json()
  assert.equal(initial.type, 'server-response')
  assert.equal(initial.rpcId, 'test-request')
  assert.equal(initial.result.value.configured, false)
  const saved = (await request('save-key', { key: 'sk-admin-test-only' }, { cookie })).json()
  assert.equal(saved.result.ok, true)
  assert.ok(!JSON.stringify(saved).includes('sk-admin'))
})
