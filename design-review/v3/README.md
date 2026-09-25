# Design v2 — review-fix pack (v3), 25 September 2026

375px captures (Playwright, local production build). `*-first-screen.png` is the
375×812 viewport before any scroll — the first calculator control is on screen
on every tool and state page (verified programmatically on 9 pages). `*-375.png`
is the full page, captured after scrolling back to the top so the sticky header
paints once, at the top.

| Page | First screen | Full page |
|---|---|---|
| Homepage | `home-375-first-screen.png` | `home-375.png` |
| /pain-and-suffering-calculator/california/ (sample inputs) | `pain-and-suffering-california-375-first-screen.png` | `pain-and-suffering-california-375.png` |
| /workers-comp-settlement-calculator/california/ | `workers-comp-california-375-first-screen.png` | `workers-comp-california-375.png` |
| /car-accident-settlement-calculator/north-carolina/ (sample inputs) | `car-accident-north-carolina-375-first-screen.png` | `car-accident-north-carolina-375.png` |

Changes in this pass: compact phone hero; header verified at real scroll offsets;
range bar now shows the adjacent severity levels (lib/severityRange.ts) instead of
the ±0.5 band; damage-cap chip and cap notice derived from lib/damageCaps.ts;
approved copy edits removing "used by adjusters/attorneys" claims.
