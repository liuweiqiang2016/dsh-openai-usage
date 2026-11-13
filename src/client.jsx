import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { styles } from './styles.js'
import zh from '../locale/zh.json'
import en from '../locale/en.json'

export const inject = ['slots', 'connection', 'locale']
const namespace = 'openai-account'
const links = {
  admin: 'https://platform.openai.com/settings/organization/admin-keys',
  usage: 'https://platform.openai.com/usage',
  billing: 'https://platform.openai.com/settings/organization/billing/overview',
}
export const money = (value, currency, language = 'zh-CN') => `${new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value)} ${currency.toUpperCase()}`
const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>
const errorMessage = (error, t) => t(Object.hasOwn(en.ui, `error.${error?.code}`) ? `error.${error.code}` : 'error.UNKNOWN')
const Problem = ({ section, t }) => section?.status === 'error' ? <p className="oa-error" role="alert">{errorMessage(section.error, t)}</p> : null

function Metric({ title, value, detail }) {
  return <div className="oa-metric"><div className="oa-label">{title}</div><strong>{value}</strong><div className="oa-muted">{detail}</div></div>
}

export function AccountPanel({ rpc, t, locale }) {
  const { active } = useSyncExternalStore(locale.subscribe, locale.getSnapshot)
  const language = active.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
  const number = value => value == null ? t('notProvided') : new Intl.NumberFormat(language).format(value)
  const formatMoney = (value, currency) => money(value, currency, language)
  const dayLabel = day => new Intl.DateTimeFormat(language, { month: '2-digit', day: '2-digit', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`))
  const [range, setRange] = useState('month')
  const [projectDraft, setProjectDraft] = useState('')
  const [projectId, setProjectId] = useState('')
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState({ loading: true, data: null, error: '' })
  const [editing, setEditing] = useState(false)
  const [key, setKey] = useState('')
  const [save, setSave] = useState({ pending: false, error: '' })
  const saveAbort = useRef(null)
  useEffect(() => () => saveAbort.current?.abort(), [])

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, data: null, error: '' })
    rpc('overview', { range, projectId }, controller.signal).then(result => {
      if (controller.signal.aborted) return
      if (!result.ok) setState({ loading: false, data: null, error: result.error })
      else setState({ loading: false, data: result.value, error: '' })
    }).catch(() => {
      if (!controller.signal.aborted) setState({ loading: false, data: null, error: { code: 'CONNECTION' } })
    })
    return () => controller.abort()
  }, [rpc, range, projectId, revision])

  async function saveKey(event) {
    event.preventDefault()
    saveAbort.current?.abort()
    const controller = new AbortController()
    saveAbort.current = controller
    setSave({ pending: true, error: '' })
    try {
      const result = await rpc('save-key', { key }, controller.signal)
      if (controller.signal.aborted) return
      if (!result.ok) { setSave({ pending: false, error: result.error }); return }
      setKey('')
      setEditing(false)
      setSave({ pending: false, error: '' })
      setRevision(value => value + 1)
    } catch {
      if (!controller.signal.aborted) setSave({ pending: false, error: { code: 'SAVE_FAILED' } })
    }
  }

  const data = state.data
  const overview = data?.overview
  const usage = overview?.usage.status === 'ready' ? overview.usage.data : null
  const costs = overview?.costs.status === 'ready' ? overview.costs.data : null
  const limit = overview?.limit.status === 'ready' ? overview.limit.data : null
  const showSetup = editing || data?.configured === false
  const currencies = [...new Set(costs?.daily.map(row => row.currency) ?? [])]
  const updated = overview ? new Date(overview.fetchedAt).toLocaleString(language, { hour12: false }) : ''

  return <section className="oa-panel" aria-label={t('nav')} lang={language}>
    <style>{styles}</style>
    <header className="oa-header">
      <div><span className="oa-eyebrow">OPENAI USAGE</span><h2>{t('title')}</h2><p className="oa-muted">{t('subtitle')}</p></div>
      <button className="oa-button" onClick={() => { setEditing(!editing); setKey(''); setSave({ pending: false, error: '' }) }} disabled={save.pending}>{t(editing ? 'closeSetup' : 'configure')}</button>
    </header>

    {showSetup && <div className="oa-card oa-setup">
      <h3>{t(data?.configured ? 'replaceKey' : 'connect')}</h3>
      <p>{t('keyHelp')}</p>
      <ol>
        <li>{t('setupOrganization')} <External href={links.admin}>{t('openAdmin')}</External></li>
        <li>{t('setupCreate')}</li>
        <li>{t('setupSave')}</li>
      </ol>
      <form onSubmit={saveKey} className="oa-key-form">
        <label htmlFor="oa-admin-key">Admin API Key</label>
        <div className="oa-inline"><input id="oa-admin-key" type="password" autoComplete="off" spellCheck={false} placeholder="sk-admin-…" value={key} onChange={event => setKey(event.target.value)} disabled={save.pending || data?.writable === false} required /><button className="oa-button oa-primary" type="submit" disabled={save.pending || !key.trim() || data?.writable === false}>{t(save.pending ? 'saving' : 'save')}</button></div>
      </form>
      {data?.writable === false && <p className="oa-error">{t('storageReadOnly', { ref: data.credentialRef })}</p>}
      {save.error && <p role="alert" className="oa-error">{errorMessage(save.error, t)}</p>}
      <p className="oa-muted">{t('replaceNote')}</p>
    </div>}

    <div className="oa-toolbar">
      <div className="oa-ranges" role="group" aria-label={t('range')}>{['month', '7d', '30d'].map(value => <button key={value} aria-pressed={range === value} onClick={() => setRange(value)}>{t(value)}</button>)}</div>
      <button className="oa-button" disabled={state.loading} onClick={() => setRevision(value => value + 1)}>{t(state.loading ? 'querying' : 'refresh')}</button>
    </div>
    <form className="oa-project-form" onSubmit={event => { event.preventDefault(); setProjectId(projectDraft.trim()) }}>
      <label htmlFor="oa-project">{t('project')}</label><input id="oa-project" placeholder={t('projectPlaceholder')} value={projectDraft} onChange={event => setProjectDraft(event.target.value)} /><button className="oa-button" type="submit">{t('apply')}</button>
    </form>
    <div className="oa-status" aria-live="polite">{state.loading ? t('loading') : state.error ? errorMessage(state.error, t) : overview ? t('scope', { project: projectId || t('organization'), updated }) : t('setupRequired')}</div>

    {overview && <>
      <div className="oa-metrics">
        <Metric title={t('periodCosts')} value={costs ? costs.totals.length ? costs.totals.map(row => <span key={row.currency}>{formatMoney(row.value, row.currency)}<br /></span>) : t('noCosts') : t('unavailable')} detail={t('officialCosts')} />
        <Metric title={t('inputTokens')} value={usage ? number(usage.inputTokens) : '—'} detail={usage ? t('cachedDetail', { count: number(usage.cachedTokens) }) : t('waitingUsage')} />
        <Metric title={t('outputTokens')} value={usage ? number(usage.outputTokens) : '—'} detail={usage ? t('requestsDetail', { count: number(usage.requests) }) : t('waitingUsage')} />
      </div>
      <Problem section={overview.costs} t={t} /><Problem section={overview.usage} t={t} />

      <div className="oa-card">
        <div className="oa-card-title"><h3>{t('limits')}</h3><External href={links.billing}>{t('openBilling')}</External></div>
        <div className="oa-limits"><div><div className="oa-label">{t('monthlyLimit')}</div><strong>{limit ? formatMoney(limit.amount, limit.currency) : t('limitUnavailable')}</strong><p className="oa-muted">{t(limit ? limit.enforcement === 'enforcing' ? 'enforcing' : 'notEnforcing' : 'limitHelp')}</p></div><div><div className="oa-label">{t('balance')}</div><strong>{t('viewBilling')}</strong><p className="oa-muted">{t('balanceHelp')}</p></div></div>
        <Problem section={overview.limit} t={t} />
      </div>

      {costs && <div className="oa-card"><h3>{t('dailyCosts')}</h3>{!costs.daily.length ? <p className="oa-muted">{t('noDailyCosts')}</p> : currencies.map(currency => {
        const daily = costs.daily.filter(row => row.currency === currency)
        const max = Math.max(...daily.map(row => Math.abs(row.value)), 0.000001)
        return <div key={currency} className="oa-trend" aria-label={t('dailyLabel', { currency: currency.toUpperCase() })}>{daily.map(row => <div key={row.day} className="oa-trend-row"><time dateTime={row.day}>{dayLabel(row.day)}</time><div className="oa-track"><div className={row.value < 0 ? 'oa-bar oa-adjustment' : 'oa-bar'} style={{ width: `${Math.abs(row.value) / max * 100}%` }} /></div><span>{formatMoney(row.value, currency)}</span></div>)}</div>
      })}</div>}

      {usage && <div className="oa-card"><h3>{t('modelUsage')}</h3><p className="oa-muted">{t('modelHelp')}</p><div className="oa-table-wrap"><table><thead><tr>{['model', 'input', 'cached', 'output', 'requests'].map(key => <th key={key}>{t(key)}</th>)}</tr></thead><tbody>{usage.models.map(row => <tr key={row.model}><td>{row.model === '未分组模型' ? t('ungroupedModel') : row.model}</td><td>{number(row.inputTokens)}</td><td>{number(row.cachedTokens)}</td><td>{number(row.outputTokens)}</td><td>{number(row.requests)}</td></tr>)}</tbody></table></div>{!usage.models.length && <p className="oa-muted">{t('noUsage')}</p>}</div>}

      {costs && costs.items.length > 0 && <details className="oa-card"><summary>{t('costDetails', { count: number(costs.items.length) })}</summary><div className="oa-table-wrap"><table><thead><tr>{['lineItem', 'projectId', 'amount'].map(key => <th key={key}>{t(key)}</th>)}</tr></thead><tbody>{costs.items.map((row, index) => <tr key={index}><td>{row.lineItem === '未分组费用' ? t('ungroupedCosts') : row.lineItem}</td><td>{row.projectId ?? t('unassigned')}</td><td>{formatMoney(row.value, row.currency)}</td></tr>)}</tbody></table></div></details>}
      <p className="oa-note">{t('costNote')}</p>
    </>}
    <footer className="oa-footer"><External href={links.usage}>{t('usagePage')}</External><External href={links.billing}>{t('billingPage')}</External><span>{t('readOnly')}</span></footer>
  </section>
}

export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(namespace, { zh: zh.ui, en: en.ui }))
  const t = ctx.locale.bind(namespace)
  const locale = { subscribe: listener => ctx.locale.subscribe(listener), getSnapshot: () => ctx.locale.getSnapshot() }
  const rpc = (endpoint, payload, signal) => ctx.connection.rpc.call('/api', `openai-account/${endpoint}`, payload, signal)
  ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'openai-account', label: () => t('nav'), locale: namespace, order: 85,
  }, () => <AccountPanel rpc={rpc} t={t} locale={locale} />)))
}
