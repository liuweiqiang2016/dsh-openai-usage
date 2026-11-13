import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await build({ entryPoints: ['src/index.js'], outfile: 'lib/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node24', packages: 'external' })
const client = await build({ entryPoints: ['src/client.jsx'], bundle: true, platform: 'browser', format: 'cjs', target: 'es2022', external: ['react'], write: false })
await writeFile('lib/client.js', `window.__ModuleLoader__.load({id:"dsh-openai-account",factory:(require)=>{const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;}});\n`, 'utf8')
