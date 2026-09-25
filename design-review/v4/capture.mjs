// design-review/v4/capture.mjs — review captures + fault-rule regression for
// the design-refresh final pass (25 September 2026).
//
//   npx next build && npx next start -p 3100 &
//   node design-review/v4/capture.mjs http://localhost:3100 [path-to-playwright-index.mjs]
//
// Writes the review PNGs into design-review/v4/ and runs the fault-rule
// regression on CA / NC / FL / GA for Tools #1 and #2 — the warning a user
// sees must come from the state's own faultRule (lib/faultRules.ts):
//   • California (pure comparative)      → no bar warning at 30% fault
//   • North Carolina (contributory)      → "Critical" bar on any fault (1%)
//   • Florida (modified, 51% bar)        → bar at 51%, none at 50%
//   • Georgia (modified, 50% bar)        → bar at 50%, none at 49%
// Also asserts the Ohio result-card cap notice follows R.C. 2315.18 (greater
// of $250k or 3× economic, max $350k) and that every grid rendered with the
// balanced-grid rule has no part-filled last row at 375 / 768 / 1280 / 1440.
// Exits non-zero on any failed assertion. No paid tools — Playwright's bundled
// Chromium.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] || 'http://localhost:3100'
const pwPath = process.argv[3] || 'playwright'
const { chromium } = await import(pwPath)
const outDir = path.dirname(fileURLToPath(import.meta.url))

const failures = []
const pass = (label) => console.log('  ✓', label)
const fail = (label, detail = '') => { failures.push(label); console.log('  ✗', label, detail) }
const check = (cond, label, detail) => (cond ? pass(label) : fail(label, detail))

const browser = await chromium.launch()

async function open(url, width, height = width < 500 ? 812 : 900) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.goto(base + url, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  return page
}

// ── 1. Review screenshots ────────────────────────────────────────────────────
console.log('\nScreenshots')
const SHOTS = [
  ['home-1440.png', '/', 1440, 'full'],
  ['home-375.png', '/', 375, 'full'],
  ['blog-1440.png', '/blog/', 1440, 'full'],
  ['states-cards-1440.png', '/', 1440, 'clip', 'section[aria-labelledby=states-heading]'],
  ['states-cards-375.png', '/', 375, 'clip', 'section[aria-labelledby=states-heading]'],
  ['pain-and-suffering-michigan-1440.png', '/pain-and-suffering-calculator/michigan/', 1440, 'full'],
  ['pain-and-suffering-ohio-375-first-screen.png', '/pain-and-suffering-calculator/ohio/', 375, 'first'],
]
for (const [file, url, width, mode, sel] of SHOTS) {
  const page = await open(url, width)
  const target = path.join(outDir, file)
  if (mode === 'clip') await page.locator(sel).first().screenshot({ path: target })
  else await page.screenshot({ path: target, fullPage: mode === 'full' })
  console.log('  wrote', file)
  await page.close()
}

// ── 2. Balanced grids: no part-filled last row at any breakpoint ───────────
console.log('\nBalanced grids (every .bgrid on /, /blog/, and a state page)')
for (const url of ['/', '/blog/', '/pain-and-suffering-calculator/california/']) {
  for (const width of [375, 768, 1280, 1440]) {
    const page = await open(url, width)
    const grids = await page.$$eval('.bgrid', (els) => els.map((el) => {
      const kids = Array.from(el.children)
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
      // group children by their top offset → rows; the last row must be full
      const rows = new Map()
      for (const k of kids) { const t = Math.round(k.getBoundingClientRect().top); rows.set(t, (rows.get(t) || 0) + 1) }
      const rowCounts = Array.from(rows.entries()).sort((a, b) => a[0] - b[0]).map(([, n]) => n)
      const featured = kids.length && getComputedStyle(kids[0]).gridColumnStart === '1' && getComputedStyle(kids[0]).gridColumnEnd === '-1'
      return { label: el.getAttribute('aria-label') || el.className.split(' ').slice(0, 1).join(''), n: kids.length, cols, rowCounts, featured }
    }))
    for (const g of grids) {
      const last = g.rowCounts[g.rowCounts.length - 1]
      const ok = g.n === 0 || last === g.cols || (g.rowCounts.length === 1 && g.featured)
      check(ok, `${url} @${width}: ${g.n} items → ${g.cols} col${g.featured ? ' (featured)' : ''}, rows ${g.rowCounts.join('/')}`)
    }
    await page.close()
  }
}

// ── 3. State lists show every state ─────────────────────────────────────────
console.log('\nState lists')
{
  const page = await open('/', 1440)
  const counts = await page.$$eval('.state-list-card', (cards) => cards.map((c) => ({
    title: c.querySelector('h3')?.textContent?.trim(), badge: c.querySelector('.count-badge')?.textContent?.trim(), chips: c.querySelectorAll('.state-chip').length,
  })))
  for (const c of counts) check(c.badge === `${c.chips} states`, `${c.title}: ${c.chips} chips, badge "${c.badge}"`)
  check(counts.find((c) => c.title === 'Workers Comp')?.chips === 15, 'Workers Comp card lists 15 states')
  check(!(await page.content()).includes('See all'), 'no "See all N states" truncation on the homepage')
  await page.close()
}

// ── 4. Fault-rule regression (Tools #1 and #2) ──────────────────────────────
console.log('\nFault-rule regression')
async function runCalc(url, faultPct) {
  const page = await open(url, 1280)
  await page.fill('input[name=medicalBills]', '20000')
  await page.fill('input[name=lostWages]', '5000')
  // FaultSlider's number box is the only type=number input on the page (CalculatorInput uses type=text)
  await page.locator('input[type=number]').first().fill(String(faultPct))
  await page.click('button[type=submit]')
  await page.waitForTimeout(700)
  const text = await page.locator('main').innerText()
  await page.close()
  return text
}
const CASES = [
  // [tool path, state, fault %, expect bar?]
  ['/pain-and-suffering-calculator/california/', 30, false],
  ['/car-accident-settlement-calculator/california/', 30, false],
  ['/pain-and-suffering-calculator/north-carolina/', 1, true],
  ['/car-accident-settlement-calculator/north-carolina/', 1, true],
  ['/pain-and-suffering-calculator/florida/', 50, false],
  ['/pain-and-suffering-calculator/florida/', 51, true],
  ['/car-accident-settlement-calculator/florida/', 51, true],
  ['/pain-and-suffering-calculator/georgia/', 49, false],
  ['/pain-and-suffering-calculator/georgia/', 50, true],
  ['/car-accident-settlement-calculator/georgia/', 50, true],
]
for (const [url, pct, expectBar] of CASES) {
  const text = await runCalc(url, pct)
  const barred = /completely bars recovery|would not be able to recover|exceeds the \d+% threshold|Contributory Negligence/i.test(text)
  check(barred === expectBar, `${url} at ${pct}% fault → ${expectBar ? 'barred' : 'no bar'}`)
}

// ── 5. Ohio cap notice follows R.C. 2315.18 ─────────────────────────────────
console.log('\nOhio cap notice (R.C. 2315.18)')
{
  // $100k economic → cap = min(max(250k, 300k), 350k) = $300k; Catastrophic 5.0× → P&S $500k > cap → notice
  const page = await open('/pain-and-suffering-calculator/ohio/', 1280)
  await page.fill('input[name=medicalBills]', '100000')
  await page.getByRole('radio', { name: /catastrophic/i }).first().click()
  await page.click('button[type=submit]')
  await page.waitForTimeout(700)
  const text = await page.locator('main').innerText()
  check(/greater of \$250,000 or three times/.test(text) && /that cap is \$300,000/.test(text), 'Ohio notice states the formula and the $300,000 cap for $100k economic')
  await page.close()
  // $20k economic, Minor 1.5× → P&S $30k < $250k → no notice
  const page2 = await open('/pain-and-suffering-calculator/ohio/', 1280)
  await page2.fill('input[name=medicalBills]', '20000')
  await page2.click('button[type=submit]')
  await page2.waitForTimeout(700)
  const text2 = await page2.locator('main').innerText()
  check(!/Damage Cap Notice/.test(text2), 'no Ohio cap notice when pain & suffering is under the cap')
  const chip = await page2.locator('.fact-chip-value').allTextContents()
  check(chip.some((t) => t.includes('$250k–$350k non-economic cap')), 'Ohio cap chip reads "$250k–$350k non-economic cap"')
  await page2.close()
}

// ── 6. Michigan chip + JSON-LD ──────────────────────────────────────────────
console.log('\nMichigan')
{
  const page = await open('/pain-and-suffering-calculator/michigan/', 1280)
  const chips = await page.locator('.fact-chip').allTextContents()
  check(chips.some((t) => /No general cap/.test(t) && /med-mal cap applies/.test(t)), 'Michigan cap chip reads "No general cap (med-mal cap applies)"')
  const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent).join('\n'))
  check(/medical malpractice cases only/.test(ld) && /500\.3135/.test(ld), 'Michigan FAQPage JSON-LD carries the med-mal-only cap + MCL 500.3135 threshold')
  check(!/Yes\. Michigan caps noneconomic damages/.test(ld), 'old "Yes. Michigan caps…" answer is gone from JSON-LD')
  await page.close()
}

// ── 7. Cite block present ───────────────────────────────────────────────────
console.log('\nCite this page')
for (const url of ['/pain-and-suffering-calculator/', '/car-accident-settlement-calculator/texas/', '/blog/injury-claim-calculator/', '/workers-comp-maximum-weekly-benefits-by-state/']) {
  const page = await open(url, 1280)
  const n = await page.locator('.cite-block').count()
  const hasUrl = (await page.locator('.cite-block .cite-url').textContent().catch(() => '')).startsWith('https://www.settlebrook.com')
  check(n === 1 && hasUrl, `${url}: one cite block with canonical www URL`)
  await page.close()
}

await browser.close()
console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL PASSED')
process.exit(failures.length ? 1 : 0)
