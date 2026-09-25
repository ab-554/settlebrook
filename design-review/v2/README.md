# Design v2 review pack — 25 September 2026

Branch `design-refresh`. Same content as v1, new presentation: cool financial-trust
palette, Plus Jakarta Sans + Inter, 18px body, 1360px container, hero band with key-fact
chips, calculator 7/12 + sticky live result 5/12, next-step cards on every load, and a
three-column editorial (sticky TOC · prose · tools rail) from 1200px.

## Screenshots (full page, Playwright, local production build)

| Page | 1440px | 375px |
|---|---|---|
| Homepage | `home-1440.png` | `home-375.png` |
| /pain-and-suffering-calculator/california/ (with sample inputs: $12,000 medical, $4,000 wages) | `pain-and-suffering-california-1440.png` | `pain-and-suffering-california-375.png` |
| /workers-comp-settlement-calculator/ | `workers-comp-hub-1440.png` | `workers-comp-hub-375.png` |
| /blog/injury-claim-calculator/ | `blog-injury-claim-calculator-1440.png` | `blog-injury-claim-calculator-375.png` |
| /workers-comp-maximum-weekly-benefits-by-state/ | `workers-comp-max-weekly-benefits-1440.png` | `workers-comp-max-weekly-benefits-375.png` |

## Lighthouse — mobile, simulated throttling, local `next start` (GA4 / AdSense hosts unreachable from the build container, so third-party cost is excluded for both)

| Page | Version | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Homepage | v1 | 93 | 100 | 96 | 100 | 2.9 s | 140 ms | 0 |
| Homepage | v2 | 94 | 100 | 96 | 100 | 2.9 s | 100 ms | 0 |
| California P&S | v1 | 92 | 100 | 96 | 100 | 3.2 s | 140 ms | 0 |
| California P&S | v2 | 94 | 100 | 96 | 100 | 3.0 s | 30 ms | 0 |

## Contrast (WCAG 2.1, measured)

| Pair | Ratio | AA |
|---|---|---|
| --ink #0F1B2D on --bg #F6F8FB | 16.25 | ✓ |
| --ink on --surface #FFFFFF | 17.28 | ✓ |
| --ink-2 #334155 on --bg | 9.73 | ✓ |
| --ink-2 on --bg-2 #EEF3FF (hero end) | 9.32 | ✓ |
| --ink-3 #5B6776 on --bg | 5.41 | ✓ |
| --ink-3 on --surface | 5.76 | ✓ |
| --ink-3 on --bg-2 | 5.18 | ✓ |
| (brief's --ink-3 #64748B on --bg) | 4.47 | ✗ — replaced by #5B6776 |
| --primary #1D4ED8 on --bg | 6.30 | ✓ |
| --primary on --primary-tint #EAF0FF | 5.87 | ✓ |
| white on --primary | 6.70 | ✓ |
| white on #1E40AF (button gradient end) | 8.72 | ✓ |
| white on --primary-deep #1E3A8A | 10.36 | ✓ |
| --money #047857 on --surface | 5.48 | ✓ |
| --money on --money-tint #E7F6EF | 4.92 | ✓ |
| --amber #B45309 on --surface | 5.02 | ✓ |
| --amber on --amber-tint #FFF4E5 | 4.62 | ✓ |
| --danger #B91C1C on --surface | 6.47 | ✓ |
| --danger on --danger-tint #FDECEC | 5.66 | ✓ |

## Assets
`make-icons.mjs` regenerates favicon.ico (16/32/48), the PNG icon set, apple-touch-icon,
logo.png and og-image.png from the mark in `components/ui/Brand.tsx` using Playwright's
Chromium and the self-hosted next/font files. Run after `next build`:
`CHROME_PATH=<chromium> node design-review/v2/make-icons.mjs <path to playwright/index.mjs>`
