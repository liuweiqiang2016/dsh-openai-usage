import React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client'

const params = new URLSearchParams(location.search)
let configured = !params.has('setup')
window.testCalls = []
let HarnessLocaleRuntime
function createPreviewLocale() {
  let snapshot = { active: params.get('lang') === 'en' ? 'en' : 'zh', revision: 0 }
  const listeners = new Set(), dictionaries = new Map()
  return {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    register: (namespace, values) => { dictionaries.set(namespace, values); return () => dictionaries.delete(namespace) },
    bind: namespace => (key, values = {}) => (dictionaries.get(namespace)?.[snapshot.active]?.[key] ?? dictionaries.get(namespace)?.en?.[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => name in values ? String(values[name]) : match),
    setLocale: active => { snapshot = { active, revision: snapshot.revision + 1 }; listeners.forEach(listener => listener()) },
  }
}
const demo = {
  range: { startTime: 1793491200, endTime: 1794564000, timezone: 'UTC' }, projectId: '', fetchedAt: '2026-11-13T10:20:00Z',
  usage: { status: 'ready', data: {
    inputTokens: 1245800, cachedTokens: 820000, outputTokens: 168400, requests: 386,
    models: [
      { model: 'demo-model-a', inputTokens: 1000000, cachedTokens: 700000, outputTokens: 140000, requests: 300 },
      { model: 'demo-model-b', inputTokens: 245800, cachedTokens: 120000, outputTokens: 28400, requests: 86 },
    ],
  } },
  costs: { status: 'ready', data: {
    totals: [{ currency: 'usd', value: 28.42 }],
    daily: [2.3, 1.8, 4.1, 3.2, 6.1, 4.2, 6.72].map((value, i) => ({ day: `2026-11-${String(i + 7).padStart(2, '0')}`, currency: 'usd', value })),
    items: [{ lineItem: 'demo-model-a, input tokens', projectId: 'proj_demo', value: 19.42, currency: 'usd' }, { lineItem: 'demo-model-b, output tokens', projectId: null, value: 9, currency: 'usd' }],
  } },
  limit: { status: 'ready', data: { amount: 100, currency: 'USD', interval: 'month', enforcement: 'enforcing' } },
  balance: { status: 'unsupported' },
}
window.__ModuleLoader__ = { load({ id, factory }) {
  if (id === '@deepseek-ai/dsh-client-locale') {
    HarnessLocaleRuntime = factory(name => {
      if (name === 'react') return React
      if (name === 'react/jsx-runtime') return jsxRuntime
      // Settings-row widgets are not rendered by these LocaleRuntime tests.
      if (['@deepseek-ai/dsh-client-ui-primitives', '@deepseek-ai/dsh-client-store'].includes(name)) return {}
      throw new Error(`Unexpected locale external: ${name}`)
    }).LocaleRuntime
    return
  }
  if (id !== 'dsh-openai-account') throw new Error('Wrong package id')
  const module = factory(name => { if (name === 'react') return React; throw new Error(`Unexpected external: ${name}`) })
  const locale = HarnessLocaleRuntime ? new HarnessLocaleRuntime({ emit() {} }, undefined, { languages: ['zh'], preference: params.get('lang') === 'en' ? 'en' : 'zh' }) : createPreviewLocale()
  window.usesHarnessLocale = Boolean(HarnessLocaleRuntime)
  window.setTestLocale = language => locale.setLocale(language)
  const disposers = []
  const ctx = {
    locale,
    effect: setup => { const dispose = setup(); disposers.push(dispose); return dispose },
    connection: { rpc: { call: async (channel, endpoint, payload, signal) => {
      if (channel !== '/api' || !['openai-account/overview', 'openai-account/save-key'].includes(endpoint)) throw new Error('Wrong RPC target')
      endpoint = endpoint.slice('openai-account/'.length)
      // Only mock requests; this page never connects to OpenAI or stores a key.
      window.testCalls.push({ endpoint, range: payload?.range, projectId: payload?.projectId })
      signal?.throwIfAborted()
      if (endpoint === 'save-key') {
        if (payload.key === 'invalid') return { ok: false, error: { code: 'INVALID_KEY', message: '测试中文错误' } }
        configured = true; return { ok: true, value: { saved: true } }
      }
      if (params.has('error')) return { ok: false, error: { code: 'AUTH', message: '测试中文错误' } }
      const overview = structuredClone(demo)
      overview.projectId = payload.projectId
      if (params.has('partial')) overview.costs = { status: 'error', error: { code: 'PERMISSION', message: '此密钥无权查询费用。请确认 Admin API Key 及组织权限。' } }
      if (params.has('partial')) overview.limit = { status: 'error', error: { code: 'UNAVAILABLE', message: '测试中文错误' } }
      return { ok: true, value: { configured, writable: true, credentialRef: 'OPENAI_ACCOUNT_ADMIN_KEY', overview: configured ? overview : null } }
    } } },
    slots: {
      inject: (name, register) => { if (name !== 'settings.section') throw new Error('Wrong slot'); return register() },
      register: (options, Component) => {
        if (options.id !== 'openai-account') throw new Error('Wrong settings section')
        const updateLabel = () => {
          document.getElementById('preview-nav').textContent = typeof options.label === 'function' ? options.label() : options.label
          document.documentElement.lang = locale.getSnapshot().active
        }
        updateLabel()
        const unsubscribe = locale.subscribe(updateLabel)
        const root = createRoot(document.getElementById('root'))
        root.render(<Component />)
        return () => { unsubscribe(); root.unmount() }
      },
    },
  }
  module.apply(ctx)
  window.disposeTestPlugin = () => { for (const dispose of disposers.reverse()) dispose?.() }
} }
