// ─────────────────────────────────────────────────────────────────────────────
// scripts/check-noindex.mjs
// Post-build gate, run by `npm run build` right after `next build`. Fails the
// build (exit 1) if any URL that sitemap.xml advertises prerendered with a
// robots / googlebot meta tag containing noindex or nofollow.
//
// Why it reads the built sitemap instead of importing getIndexablePaths():
// that function lives in TypeScript behind the "@/" alias, which plain Node
// can't load. app/sitemap.ts is built from getIndexablePaths() and throws at
// build time if its output ever drifts from that list, so the prerendered
// sitemap IS getIndexablePaths(), just in a form Node can read.
//
// It checks the rendered HTML rather than page metadata exports so it also
// catches a bad inherited default in app/layout.tsx. The companion vitest
// (app/indexability.test.ts) gives a faster, more readable failure for the
// per-page case; this is the backstop that looks at what actually ships.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs'
import path from 'node:path'

const APP_OUT = path.join('.next', 'server', 'app')
const SITEMAP = path.join(APP_OUT, 'sitemap.xml.body')

function fail(message) {
  console.error(`\ncheck-noindex: FAILED — ${message}\n`)
  process.exit(1)
}

if (!fs.existsSync(SITEMAP)) {
  fail(`${SITEMAP} not found. Run after \`next build\`; refusing to pass without checking anything.`)
}

const urls = [...fs.readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (urls.length === 0) fail('sitemap.xml contains no <loc> entries.')

// '/blog/foo/' → .next/server/app/blog/foo.html ; '/' → index.html
function htmlFileFor(url) {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '')
  return path.join(APP_OUT, pathname === '' ? 'index.html' : `${pathname}.html`)
}

const BLOCKING = /noindex|nofollow|\bnone\b/i
const offenders = []

for (const url of urls) {
  const file = htmlFileFor(url)
  if (!fs.existsSync(file)) {
    offenders.push(`${url} — no prerendered HTML at ${file}`)
    continue
  }
  const html = fs.readFileSync(file, 'utf8')
  // Next emits <meta name="robots" .../> and <meta name="googlebot" .../>.
  for (const tag of html.matchAll(/<meta\s+name="(robots|googlebot)"\s+content="([^"]*)"/gi)) {
    if (BLOCKING.test(tag[2])) offenders.push(`${url} — <meta name="${tag[1]}" content="${tag[2]}">`)
  }
}

if (offenders.length > 0) {
  fail(`${offenders.length} sitemap URL(s) render with a blocking robots tag:\n  ${offenders.join('\n  ')}`)
}

console.log(`check-noindex: OK — ${urls.length} sitemap URLs, none render noindex/nofollow.`)
