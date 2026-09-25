# Design v2 — final pass (v4), 25 September 2026

Captures from the local production build (`next build` + `next start`, Playwright's
bundled Chromium, `capture.mjs`). Regenerate with:

```
npx next build && npx next start -p 3100 &
node design-review/v4/capture.mjs http://localhost:3100 [path-to-playwright-index.mjs]
```

`capture.mjs` also runs the regression checks and exits non-zero on any failure.

| Capture | File |
|---|---|
| Homepage, 1440 full page | `home-1440.png` |
| Homepage, 375 full page | `home-375.png` |
| /blog/, 1440 full page | `blog-1440.png` |
| Homepage state-guide cards (the three tool cards), 1440 | `states-cards-1440.png` |
| Homepage state-guide cards, 375 | `states-cards-375.png` |
| /pain-and-suffering-calculator/michigan/, 1440 full page | `pain-and-suffering-michigan-1440.png` |
| /pain-and-suffering-calculator/ohio/, 375×812 first screen | `pain-and-suffering-ohio-375-first-screen.png` |

## What changed in this pass

**Design**
- Every list of a tool's state pages now shows ALL published states (14 / 14 / 15),
  alphabetical, as a 2–3 column chip list with a count badge — homepage state-guide
  cards, the "by state" section on each hub and state page, the hub / state-page
  rails, and a new footer "State guides" band. No "See all N states" truncation
  anywhere (`components/ui/StateList.tsx`).
- One reusable balanced-grid rule (`components/ui/BalancedGrid.tsx`, `.bgrid` in
  `globals.css`) applied to the homepage tool cards, state-guide cards and latest
  guides, the /blog/ index and the next-step cards under every calculator. Rows are
  full at every breakpoint for any item count (4 → 2×2, 5 → 1 featured + 4,
  7 → 1 featured + 6, 3 on a tablet → 1 featured + 2). `capture.mjs` asserts no
  part-filled last row on /, /blog/ and a state page at 375 / 768 / 1280 / 1440.

**Accuracy**
- Ohio cap chip: "$250k–$350k non-economic cap · catastrophic injuries exempt"
  (Ohio R.C. 2315.18). The result-card cap notice now compares the pain & suffering
  figure with the cap that actually applies — the greater of $250,000 or 3× economic
  damages, up to $350,000 per plaintiff — instead of comparing the total estimate
  with a flat $350,000 (`lib/damageCaps.ts`).
- Michigan: MCL 600.1483 is presented as a medical-malpractice-only cap; ordinary
  injury and auto negligence claims have no general cap and auto claims are gated by
  the MCL 500.3135 tort threshold. Chip reads "No general cap · med-mal cap applies".
  Key facts, editorial, FAQ answers, `damageCapNotes` and `sources.json` updated.
- The key-facts card on every pain & suffering state page now labels a med-mal-only
  or punitive-only cap as "No General Damage Cap" (California, Texas, Florida,
  Michigan, Nevada, North Carolina) instead of "Damage Cap".
- FAQPage JSON-LD on the pain & suffering and car accident state pages is now
  emitted by the visible `<FAQAccordion schema>` for exactly the questions on the
  page (previously the JSON-LD carried the generic FAQ list, not the state's own).

**Copy**
- Every claim about what insurers, adjusters, attorneys or courts "use" / "actually
  calculate" / "use internally", "industry standard", "accurately reflects the math",
  "professional settlement valuations", "internal evaluation process is known",
  "realistic starting point" and the Colossus-specific claims were rewritten as
  neutral statements (the multiplier and per diem methods are the two most common
  ways to estimate pain and suffering; insurers' valuations vary and are not
  published). SEO question headings kept; "negotiated between attorneys and
  insurance adjusters" kept.

**Citation block**
- "Cite this page" (`components/ui/CiteThisPage.tsx`) at the end of each calculator
  hub, state page, blog post and the benefits table: title · Settlebrook Editorial ·
  canonical www URL · Last reviewed date · copy button.

## Regression results (capture.mjs, local build)

- Balanced grids: 20/20 grid × breakpoint checks pass.
- State lists: 14 / 14 / 15 chips with matching badges; no "See all" on the homepage.
- Fault rules (Tools #1 and #2): California 30% → no bar; North Carolina 1% → barred;
  Florida 50% → no bar, 51% → barred; Georgia 49% → no bar, 50% → barred. 10/10.
- Ohio notice states the formula and the $300,000 cap for $100k economic damages;
  no notice when pain & suffering is under the cap; chip text as specified.
- Michigan chip and FAQPage JSON-LD as specified.
- One cite block with the canonical www URL on a hub, a state page, a blog post
  and the benefits table.
- `next build`, `next lint` clean; `vitest run` 10/10 (PPD state module).
