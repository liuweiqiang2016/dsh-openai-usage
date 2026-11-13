import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const preview = await build({ entryPoints: ['tests/preview-entry.jsx'], bundle: true, platform: 'browser', format: 'iife', write: false, define: { 'process.env.NODE_ENV': '"production"' } })
const plugin = await readFile('lib/client.js', 'utf8')
// Optionally exercise the exact LocaleRuntime bundled with the installed Harness.
const localeRuntime = process.argv[2] ? await readFile(process.argv[2], 'utf8') : ''
await mkdir('artifacts', { recursive: true })
const escapeScript = value => value.replaceAll('</script', '<\\/script')
await writeFile('artifacts/preview.html', `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OpenAI Usage · Preview</title><style>body{margin:0;background:#f6f8fa;padding:24px;font-family:system-ui,"Microsoft YaHei",sans-serif}.demo-label{max-width:1000px;margin:0 auto 18px;color:#805e15;background:#fff4d6;border:1px solid #ecd9a5;padding:10px 16px;border-radius:8px;font-size:13px}#root{max-width:1000px;margin:auto}#preview-nav{width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;margin-bottom:12px}@media(prefers-color-scheme:dark){body{background:#171d25}.demo-label{background:#3b3321;color:#f3d48c;border-color:#66532e}}@media(max-width:640px){body{padding:12px}}</style><div class="demo-label">Preview · Mock data only · No OpenAI requests or key storage</div><div id="preview-nav"></div><div id="root"></div><script>${escapeScript(preview.outputFiles[0].text)}</script><script>${escapeScript(localeRuntime)}</script><script>${escapeScript(plugin)}</script></html>`, 'utf8')
console.log('artifacts/preview.html')
