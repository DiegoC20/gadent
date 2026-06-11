import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/odontogram/symbols')
const htmlPath = path.join(__dirname, 'odontogram-menu.html')

fs.mkdirSync(outDir, { recursive: true })

const html = fs.readFileSync(htmlPath, 'utf8')

function urlToFilename(url) {
  const decoded = decodeURIComponent(url.split('?')[0])
  const base = decoded.split('/').pop() || 'icon.svg'
  return base.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function localPath(url) {
  return `/odontogram/symbols/${urlToFilename(url)}`
}

async function download(url) {
  const filename = urlToFilename(url)
  const dest = path.join(outDir, filename)
  if (fs.existsSync(dest)) return
  try {
    const res = await fetch(url)
    if (!res.ok) return
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
    console.log('downloaded', filename)
  } catch {
    /* ignore */
  }
}

// Shortcuts
const shortcutBlock = html.match(/app-shortcut-dental-findings[\s\S]*?<\/app-shortcut-dental-findings>/)
const shortcutUrls = [...(shortcutBlock?.[0].matchAll(/src="(https:\/\/[^"]+)"/g) ?? [])].map((m) => m[1])
const shortcuts = [
  { id: 'caries', label: 'Caries', icon: localPath(shortcutUrls[0] ?? '') },
  { id: 'restau-ok', label: 'Restauración buen estado', icon: localPath(shortcutUrls[1] ?? '') },
  { id: 'restau-nok', label: 'Restauración mal estado', icon: localPath(shortcutUrls[2] ?? '') },
]

// Findings rows
const rowRegex =
  /<div appstoppropation="" class="tw-w-2\/3[^"]*">([^<]+)<\/div>[\s\S]*?<div class="tw-w-1\/3[\s\S]*?<\/div>\s*<\/div>/g

const findings = []
let match
let idx = 0
while ((match = rowRegex.exec(html)) !== null) {
  const label = match[1].trim()
  const block = match[0]
  const icons = [...block.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => localPath(m[1]))
  const actions = icons.map((icon, i) => ({
    variant: icons.length === 1 ? 'single' : i === 0 ? 'blue' : 'red',
    icon,
  }))
  if (icons.length === 0) {
    actions.push({ variant: 'single', icon: '' })
  }
  findings.push({
    id: `finding-${idx++}`,
    label,
    actions,
  })
}

const allUrls = [
  ...shortcutUrls,
  ...findings.flatMap((f) => f.actions.map((a) => {
    const name = a.icon.replace('/odontogram/symbols/', '')
    return [...html.matchAll(/src="(https:\/\/[^"]+)"/g)]
      .map((m) => m[1])
      .find((u) => urlToFilename(u) === name)
  })).filter(Boolean),
]

for (const url of new Set(allUrls)) {
  await download(url)
}

const ts = `// Auto-generated - do not edit manually
export interface FindingAction {
  variant: 'blue' | 'red' | 'single'
  icon: string
}

export interface DentalShortcut {
  id: string
  label: string
  icon: string
}

export interface DentalFinding {
  id: string
  label: string
  actions: FindingAction[]
}

export const dentalShortcuts: DentalShortcut[] = ${JSON.stringify(shortcuts, null, 2)}

export const dentalFindings: DentalFinding[] = ${JSON.stringify(findings, null, 2)}
`

fs.writeFileSync(path.join(__dirname, '../src/data/dentalFindings.ts'), ts)
console.log(`Generated ${findings.length} findings, ${shortcuts.length} shortcuts`)
