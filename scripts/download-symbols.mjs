import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/odontogram/symbols')
fs.mkdirSync(outDir, { recursive: true })

const BASE = 'https://doctocliq-prod.s3.amazonaws.com/odontogram/symbol'
const entries = JSON.parse(fs.readFileSync(path.join(__dirname, 'symbol-urls.json'), 'utf8'))

for (const entry of entries) {
  const { name } = entry
  const url = entry.url ?? `${BASE}/${entry.path}`
  const dest = path.join(outDir, name)
  if (fs.existsSync(dest)) {
    console.log('skip', name)
    continue
  }
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn('fail', name, res.status)
      continue
    }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
    console.log('ok', name)
  } catch (e) {
    console.warn('err', name, e.message)
  }
}
