import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = language => JSON.parse(readFileSync(new URL(`../locale/${language}.json`, import.meta.url), 'utf8'))
const zh = read('zh'), en = read('en')

test('中英文字典覆盖相同文案，保留相同插值参数，英文无中文残留', () => {
  assert.deepEqual(Object.keys(zh.ui).sort(), Object.keys(en.ui).sort())
  const parameters = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
  for (const key of Object.keys(zh.ui)) {
    assert.ok(zh.ui[key].trim(), key)
    assert.ok(en.ui[key].trim(), key)
    assert.deepEqual(parameters(zh.ui[key]), parameters(en.ui[key]), key)
    assert.equal(/[\u3400-\u9fff]/u.test(en.ui[key]), false, key)
  }
  assert.equal(zh.meta.title, 'OpenAI 用量')
  assert.equal(en.meta.title, 'OpenAI Usage')
  assert.equal(zh.ui.nav, zh.meta.title)
  assert.equal(en.ui.nav, en.meta.title)
})
