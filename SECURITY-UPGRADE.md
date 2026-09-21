security: upgrade Next.js 14.2.35 -> 15.5.25 (closes critical RCE advisories)

Critical unauthenticated RCE in the Image Optimization API when AVIF files are
processed (GHSA-2xp9-vwfh-vxw4). Vulnerable range is >= 10.0.0, < 15.5.24 with
no 14.x patch available, so the 14 line is permanently exposed. This site
confirmed live exposure: /_next/image?url=%2Flogo.png&w=64&q=75 served image/avif.

The same bump also closes GHSA-p293-qw3h-jr36 (RCE on Windows-hosted servers,
range >= 13.4.0, < 15.5.24). That advisory does not apply to our Linux/Vercel
hosting; it is noted only for completeness.

Target version: 15.5.25 (newest published 15.5.x). The 2026-09-22 security
release (15.5.26 / 16.3.6, GHSA-vcvr-r3jv-pc5j) had NOT shipped at the time of
this work - verified: registry.npmjs.org/next/15.5.26 returns 404 and the
advisory ID is absent from the GitHub advisory database.

Next 15 breaking changes that actually applied:

- next 14.2.35 -> 15.5.25
- react / react-dom 18.3.1 -> 19.3.0 (required by the Next 15 App Router)
- eslint-config-next 14.2.35 -> 15.5.25; @types/react, @types/react-dom -> ^19
- Async request APIs: `params` is now a Promise in all 3 dynamic [state] routes.
  Awaited in both generateMetadata and the page component. No cookies(),
  headers(), draftMode() or searchParams usage exists in this codebase.
- @next/next/no-html-link-for-pages: @next/eslint-plugin-next 15 added App Router
  scanning (v14 only scanned pages/, so the rule was inert here). 13 internal <a>
  elements were converted to <Link> from next/link across 4 files. Rendered HTML
  is unchanged because <Link> emits an <a> element. External (target="_blank"),
  mailto: and #hash anchors were deliberately left as <a>.
- tsconfig.json: Next 15 auto-rewrote it, adding "target": "ES2017" (plus JSON
  reformatting). Next-managed file.

No calculator formula logic, styling, theme, layout or content was changed.
No directory or config key removals were required; next.config.js is unchanged.

Verification performed:
- npm ci on the old tree: exit 0 (lockfile was in sync). Audit: 9 vulns incl. 1 critical.
- npm install after the bump: exit 0. Audit: 6 vulns, 0 critical.
- npx next build: exit 0, 0 warnings, 0 errors, 59/59 static pages generated.
- npx tsc --noEmit: exit 0 (zero TypeScript errors).
- Local smoke test against the built app (next start, 16 routes): all HTTP 200
  with known calculator content strings asserted present.
- Image optimizer re-probed: serves image/avif (the patched AVIF code path).

NOT pushed. NOT merged. NOT deployed.
