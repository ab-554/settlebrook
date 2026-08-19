# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Settlebrook is a legal settlement calculator hub at https://www.settlebrook.com — Next.js 14 (App Router) + TypeScript + Tailwind, deployed on Vercel, monetized via Google AdSense. Audience: USA adults researching personal injury settlements.

`AGENTS.md` is the other agent-facing doc in this repo (shared with Gemini/Antigravity). Its rules are merged into this file; if the two ever disagree, treat `AGENTS.md` as the source for editorial/SEO tier plans and this file as the source for engineering rules.

## Commands

```bash
npm install          # Node 18+
npm run dev          # http://localhost:3000
npm run build        # next build — the verification gate (see below)
npm run lint         # next lint
npm start            # serve the production build
```

There is **no test framework** in this project — no `test` script, no test runner dependency. `npx next build` is the only automated verification available: it runs type checking, ESLint, and statically prerenders every route including all `[state]` pages. Treat a clean build as the pass/fail signal.

Deployment is push-to-`main` on GitHub; Vercel auto-deploys. There are no environment variables.

## Non-negotiable rules

These come from the owner and override default behavior:

- **Never modify the formula logic in `lib/calculations/painSuffering.ts`** without explicit instruction. Tools #1 and #2 both depend on it; changing it silently changes published settlement figures.
- **Never change colors, styling, or theme** unless explicitly asked. The design system below is fixed.
- **Never truncate file output.** Always write complete files. Read a file before editing it.
- **One file at a time, with `npx next build` between each.** Do not batch multiple file rewrites and verify once at the end.
- **No paid dependencies, libraries, or APIs. Ever.**
- **No placeholder or lorem ipsum content. Ever.** Every state page ships real editorial copy.
- **Use `next.config.js`, not `next.config.mjs`.** The project uses the CommonJS config; do not convert it.
- **Canonical domain is `https://www.settlebrook.com` — always `www`.** Every absolute URL (metadata, JSON-LD, sitemap, robots) must include the `www` subdomain.
- Never remove legal disclaimers from calculator pages.
- Never create pages at `/pain-and-suffering-calculator/states/` — state pages live at `/[tool]/[state]/`.
- Mobile-first always. Add inline comments explaining non-obvious decisions.

## Architecture

### Three calculators, one shared math core

All three tools are the same shape: a server-rendered page + a `'use client'` calculator component + a pure-function calculation module in `lib/calculations/` + a state-data module in `lib/data/`. No API routes, no database — every calculation runs client-side from static data.

| Tool | Route | Math module | State data |
|---|---|---|---|
| #1 Pain & Suffering | `/pain-and-suffering-calculator/` | `painSuffering.ts` | `states.ts` |
| #2 Car Accident | `/car-accident-settlement-calculator/` | `carAccident.ts` | `carAccidentStates.ts` |
| #3 Workers Comp | `/workers-comp-settlement-calculator/` | `workersComp.ts` | `workersCompStates.ts` |

`carAccident.ts` is a **thin wrapper** — it strips `insurancePolicyLimit` off the inputs, delegates all math to `calculateMultiplierMethod` / `calculatePerDiemMethod` in `painSuffering.ts`, and only adds the policy-limit advisory string. Tool #2 features belong in the wrapper, never in `painSuffering.ts`.

`workersComp.ts` is genuinely independent — workers comp is a no-fault system where pain and suffering is not recoverable, so it shares nothing with the other two beyond `types.ts`.

All calculation modules are pure: no React, no side effects, no I/O. Every shared type lives in `lib/calculations/types.ts`.

### Tool #1 formula (the protected one)

```
multiplierBase   = medicalBills + futureMedical + lostWages + futureLostWages
specialDamages   = multiplierBase + propertyDamage
painAndSuffering = multiplierBase * multiplier
totalEstimate    = specialDamages + painAndSuffering
adjustedTotal    = totalEstimate * ((100 - plaintiffFaultPercent) / 100)

Per diem: painAndSuffering = dailyRate * recoveryDays
```

Two deliberate subtleties that look like bugs but are not:

1. **`propertyDamage` is excluded from the multiplier base** (`sumMultiplierBase`) but included in `specialDamages` (`sumSpecialDamages`). Property loss is economic but must not be amplified by the severity multiplier. Do not collapse these two functions into one.
2. **Range boundaries use an absolute floor of 1.0 and ceiling of 6.0**, not `MULTIPLIER_MIN`/`MULTIPLIER_MAX` (1.5/5.0), so `rangeLow < totalEstimate < rangeHigh` still holds when the user picks an endpoint multiplier.

`plaintiffFaultPercent` is clamped to 0–99; 100% bars recovery entirely and the UI surfaces that as a contributory-negligence warning instead.

Severity multipliers: Minor 1.5 / Moderate 2.5 / Serious 3.5 / Severe 4.5 / Catastrophic 5.0.

### Tool #3 formula

```
weeklyBenefit = min(AWW * state.benefitRate, state.weeklyCapAmount)
TTD  = weeklyBenefit * treatmentWeeks               (capped at state.maxWeeksTTD)
PPD  = scheduledWeeks * (impairmentPct/100) * weeklyBenefit   [AMA schedule]
PPD  = weeklyBenefit * 500 * (impairmentPct/100)              [percentage-of-person]
PTD  = weeklyBenefit * 52 * lifeExpectancyYears * 0.85
final = base * 1.25 if hasAttorney
```

`calculateWorkersComp` is the orchestrator: it resolves state + body-part data, guards on unknown state and monopolistic-fund states (WA, WY — skipped by design), then dispatches by `benefitType`. It **returns a zero result with warnings rather than throwing** on bad input; mirror that pattern in any new tool.

State-specific branches you will hit:

- **Texas** — `hasNonSubscriberSystem`: employers can opt out of the WC system, making the claim a personal injury suit instead. Every benefit type appends this warning.
- **Illinois** — `ppdMethod: 'percentage_of_person'` (500 whole-body weeks × pct) instead of the AMA schedule.
- **Non-scheduled body parts** (back/spine, whole body) force percentage-of-person *regardless* of the state's `ppdMethod`.
- **New York** — highest weekly cap nationally, updates annually.

### State pages

Each tool has one `app/<tool>/[state]/page.tsx` that generates every state page statically:

- `generateStaticParams()` → `getAll*StateSlugs()` from the tool's data module
- `generateMetadata()` → per-state title, description, OG, Twitter, and a **relative** canonical path (`metadataBase` in `app/layout.tsx` supplies the `https://www.settlebrook.com` prefix)
- Three JSON-LD blocks inline: `WebApplication` with `areaServed`, `FAQPage`, and a 3-level `BreadcrumbList`
- Unknown slug → `notFound()`

Adding a state means adding an entry to the tool's `lib/data/*States.ts` array plus its editorial content in the state page — nothing else. `app/sitemap.ts` maps over the same arrays, so new states appear in the sitemap automatically.

Keep the three state pages structurally parallel. When changing one, check whether the other two need the same change.

### Shared components

`CalculatorInput`, `MultiplierSelector`, `MethodToggle`, `DisclaimerBanner`, `FAQAccordion`, `BreadcrumbNav` are reused across tools **unchanged**. If a tool needs different behavior, add a prop with a default — do not fork the component or change its existing defaults.

Calculator components are `'use client'`; pages, data, and calculation modules stay server-side.

### Global concerns in `app/layout.tsx`

Organization JSON-LD, GA4 (`G-K3PV0YLHFG`), the AdSense script (`ca-pub-9642525412838279`), fonts, `metadataBase`, and the default metadata template all live here. `next.config.js` sets `trailingSlash: true` (so every canonical path ends in `/`) and a CSP whose `script-src` / `connect-src` / `frame-src` must be extended before adding any new third-party script.

## Design system — do not change without instruction

```
Background        #050A18                 Body text     #E2E8F0
Card background   rgba(255,255,255,0.04) + backdrop-blur 16px
Card border       rgba(99,179,237,0.15)
Primary accent    #60A5FA                 Muted text    #94A3B8
Secondary accent  #34D399                 Gold/amounts  #FBBF24
Button gradient   linear-gradient(135deg, #3B82F6, #06B6D4)
Font display      Playfair Display (--font-display) — headings, logo, H1–H3
Font body         Inter (--font-body) — body text, labels, inputs, nav
```

Glassmorphism for all cards/panels: the card background + blur + border above, `border-radius: 16px`, `box-shadow: 0 8px 32px rgba(0,0,0,0.3)`.

Note that `tailwind.config.ts` defines a `brand.*` palette with slightly different hex values than the list above, and most pages set the design-system colors inline instead. Match whatever the surrounding file already does rather than converting between the two.

## SEO targets

| Tool | Keyword | KD | Volume | CPC |
|---|---|---|---|---|
| #1 | pain and suffering calculator | 3% | 1.9K/mo | $7.37 |
| #2 | car accident settlement calculator | 19% | 1.6K/mo | $11.40 |
| #3 | workers comp settlement calculator | 14% | 1.3K/mo | $2.99 |

## E-E-A-T layer

`/methodology/` (`app/methodology/page.tsx`) is the transparency page: formulas, primary sources, review cadence, and editorial boundaries. `/about/` links to it with the anchor text "our methodology", the footer Site column links to it, and `app/sitemap.ts` lists it.

The three main tool pages and all three `[state]` templates render a review stamp under the H1, driven by a `const LAST_REVIEWED = 'August 2026'` declared at the top of each of those six files. Re-verifying a page against current law is a one-line edit to that constant. The stamp lives in the page files, never in calculator components.

## Pending work (from AGENTS.md, in order)

1. Blog posts — 4 foundation posts targeting long-tail keywords
2. Backlink acquisition
3. AdSense resubmission — after content and E-E-A-T layer are deployed

All three calculators are LIVE: Pain & Suffering (14 states), Car Accident (14 states), Workers Comp (15 states).
