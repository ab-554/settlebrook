// design-review/v2/make-icons.mjs
// Regenerates the Settlebrook icon set from the brand mark geometry in
// components/ui/Brand.tsx using Playwright's bundled Chromium (no paid tools).
//   node design-review/v2/make-icons.mjs [path-to-playwright-index.mjs]
// Writes: public/favicon-16x16.png, favicon-32x32.png, favicon-48x48.png,
//         favicon.ico (16/32/48 PNG entries), icon-192.png, icon-512.png,
//         apple-touch-icon.png (180, square bleed), logo.png (800×200),
//         og-image.png (1200×630), and app/icon.svg.
import fs from 'node:fs'
import path from 'node:path'

const pwPath = process.argv[2] || 'playwright'
const { chromium } = await import(pwPath)

const TILE = '#1D4ED8'
const RIBBON = '#FFFFFF'
const INK = '#0F1B2D'
const RIBBON_PATH = 'M45 19.5c-2.5-4-9-6-15.5-4.5C23 16.5 18.5 20 18.5 25c0 5.5 5 8 13.5 9.5S46 38 46 43.5c0 5.5-5.5 9-13.5 9-6 0-11.5-2-14-6'

/** The mark. `bleed` drops the corner radius (iOS masks its own). `stroke` thickens the ribbon for tiny sizes. */
const markSvg = (size, { bleed = false, stroke = 7 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${bleed ? 0 : 14}" fill="${TILE}"/>
  <path d="${RIBBON_PATH}" fill="none" stroke="${RIBBON}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// Fonts: prefer the self-hosted woff2 files next/font emitted at build time
// (every unicode-range subset of the family, so Latin glyphs resolve); fall
// back to system sans if the build output is not present.
function fontFaces(family, alias) {
  const dir = path.join(process.cwd(), '.next', 'static', 'css')
  if (!fs.existsSync(dir)) return ''
  const blocks = new Set()
  for (const f of fs.readdirSync(dir)) {
    const css = fs.readFileSync(path.join(dir, f), 'utf8')
    for (const m of css.matchAll(/@font-face\{[^}]*\}/g)) {
      const block = m[0]
      if (!block.includes(`font-family:${family};`)) continue
      const url = /src:url\(([^)]+\.woff2)\)/.exec(block)?.[1]
      if (!url) continue
      const file = path.join(process.cwd(), '.next', url.replace(/^\/?_next\//, ''))
      if (!fs.existsSync(file)) continue
      const data = 'data:font/woff2;base64,' + fs.readFileSync(file).toString('base64')
      blocks.add(block.replace(`font-family:${family};`, `font-family:${alias};`).replace(url, data))
    }
  }
  return Array.from(blocks).join('\n')
}
const jakartaCss = fontFaces('Plus Jakarta Sans', 'PJS')
const interCss = fontFaces('Inter', 'InterX')
const fontCss = `
  ${jakartaCss}
  ${interCss}
  .display{font-family:${jakartaCss ? "'PJS'," : ''} 'Plus Jakarta Sans', Inter, system-ui, sans-serif;}
  .body{font-family:${interCss ? "'InterX'," : ''} Inter, system-ui, sans-serif;}
`
console.log('font subsets: Plus Jakarta Sans', (jakartaCss.match(/@font-face/g) || []).length, '· Inter', (interCss.match(/@font-face/g) || []).length)

const wordmark = (markPx, fontPx) => `
  <span style="display:inline-flex;align-items:center;gap:${Math.round(markPx * 0.09)}px">
    ${markSvg(markPx)}
    <span class="display" style="font-size:${fontPx}px;font-weight:700;letter-spacing:-0.025em;color:${INK};line-height:1">Settle<span style="color:${TILE}">brook</span></span>
  </span>`

function ico(pngs) {
  // ICO container with PNG-compressed entries (supported by every modern browser).
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4)
  const dir = []; let offset = 6 + 16 * pngs.length; const bodies = []
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0); e.writeUInt8(size >= 256 ? 0 : size, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12)
    dir.push(e); bodies.push(buf); offset += buf.length
  }
  return Buffer.concat([header, ...dir, ...bodies])
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function shot(width, height, html, { transparent = false } = {}) {
  await page.setViewportSize({ width, height })
  await page.setContent(`<!doctype html><html><head><style>${fontCss}html,body{margin:0;padding:0;${transparent ? 'background:transparent' : ''}}</style></head><body>${html}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  return page.screenshot({ type: 'png', omitBackground: transparent, clip: { x: 0, y: 0, width, height } })
}

const out = (f, buf) => { fs.writeFileSync(path.join(process.cwd(), f), buf); console.log('wrote', f, buf.length, 'bytes') }

const pngs = []
for (const size of [16, 32, 48]) {
  const buf = await shot(size, size, markSvg(size, { stroke: size <= 16 ? 9 : 7.5 }), { transparent: true })
  out(`public/favicon-${size}x${size}.png`, buf); pngs.push({ size, buf })
}
out('public/favicon.ico', ico(pngs))
out('public/icon-192.png', await shot(192, 192, markSvg(192), { transparent: true }))
out('public/icon-512.png', await shot(512, 512, markSvg(512), { transparent: true }))
out('public/apple-touch-icon.png', await shot(180, 180, markSvg(180, { bleed: true })))
out('app/icon.svg', Buffer.from(markSvg(64).trim() + '\n'))

// logo.png — 800×200 wordmark on white (Organization JSON-LD logo).
out('public/logo.png', await shot(800, 200, `<div style="width:800px;height:200px;display:flex;align-items:center;justify-content:center;background:#fff">${wordmark(128, 104)}</div>`))

// og-image.png — 1200×630 social card: hero gradient, wordmark, promise, three true fact chips.
const chip = (label, value) => `<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px 22px;box-shadow:0 8px 24px rgba(15,27,45,.06);min-width:300px">
  <div class="body" style="font-size:16px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#5B6776">${label}</div>
  <div class="body" style="font-size:24px;font-weight:700;color:${INK};margin-top:4px">${value}</div></div>`
out('public/og-image.png', await shot(1200, 630, `
  <div style="width:1200px;height:630px;background:linear-gradient(180deg,#FFFFFF 0%,#EEF3FF 100%);padding:64px 72px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
    <div>${wordmark(64, 52)}</div>
    <div>
      <div class="display" style="font-size:66px;font-weight:800;letter-spacing:-0.025em;line-height:1.08;color:${INK};max-width:960px">Estimate what your injury claim could be worth</div>
      <div class="body" style="font-size:28px;color:#334155;margin-top:20px;max-width:900px">Free settlement calculators. Open formulas, official sources, no signup.</div>
    </div>
    <div style="display:flex;gap:20px">${chip('Pain &amp; suffering', 'Multiplier + per diem')}${chip('Car accident', 'Vehicle damage + policy limits')}${chip('Workers comp', 'TTD · PPD · PTD by state')}</div>
  </div>`))

await browser.close()
