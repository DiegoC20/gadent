import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/odontogram/symbols')
const htmlPath = path.join(__dirname, 'odontogram-menu.html')

fs.mkdirSync(outDir, { recursive: true })

const html = fs.readFileSync(htmlPath, 'utf8')
const urlRegex = /src="(https:\/\/doctocliq-prod\.s3\.amazonaws\.com\/odontogram\/[^"]+)"/g
const urls = [...new Set([...html.matchAll(urlRegex)].map((m) => m[1]))]

function urlToFilename(url) {
  const decoded = decodeURIComponent(url.split('?')[0])
  const parts = decoded.split('/')
  const name = parts[parts.length - 1].replace(/[^a-zA-Z0-9._-]/g, '_')
  return name.endsWith('.svg') ? name : `${name}.svg`
}

const mapping = {}

for (const url of urls) {
  const filename = urlToFilename(url)
  const dest = path.join(outDir, filename)
  mapping[url] = `/odontogram/symbols/${filename}`
  if (fs.existsSync(dest)) continue
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`FAIL ${res.status}: ${filename}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buf)
    console.log(`OK ${filename}`)
  } catch (e) {
    console.warn(`ERR ${filename}:`, e.message)
  }
}

fs.writeFileSync(
  path.join(__dirname, '../src/data/odontogram-url-map.json'),
  JSON.stringify(mapping, null, 2),
)
console.log(`Mapped ${Object.keys(mapping).length} icons`)
