# Settlebrook — AI Agent Instructions

## Project Overview
Settlebrook is a legal settlement calculator hub at settlebrook.com.
Built with Next.js 14 + Tailwind CSS + TypeScript, deployed on Vercel.
Monetized via Google AdSense + future legal affiliate links.
Target audience: USA adults researching personal injury settlements.

## Owner Preferences
- Always read files before editing them
- Always write complete files — never truncate output
- Never change styling, colors, or theme unless explicitly asked
- Never change calculator formula logic without explicit instruction
- Add inline comments explaining non-obvious code decisions
- Mobile-first always
- No paid libraries or APIs ever
- No placeholder or lorem ipsum content ever

## Design System (design v2, 25 September 2026)
Cool, clean, financial-trust. Soft blue-grey page, white surfaces, ONE primary
blue for every action, ONE green reserved for money / success, amber for
deadlines, red for errors. Exactly three gradients exist (hero band background,
primary button, the thin accent line on the result card) — nothing else may use
one. No glassmorphism, no floating or scroll-driven animation. The canonical
values are CSS custom properties in app/globals.css; use `var(--token)` inline
or the matching Tailwind alias (text-ink, bg-surface, border-line, text-primary,
text-money, …). The v1 names (--paper, --accent, …) are aliased to the v2 values
in :root so old markup still resolves, but new code must use the v2 names.

Color tokens (all text pairs measured WCAG 2.1 AA; ratio on --bg unless noted):
--bg            #F6F8FB   page background
--bg-2          #EEF3FF   alt bands, hero gradient end, table headers
--surface       #FFFFFF   cards, inputs, calculator panel, header, footer
--line          #E2E8F0   hairlines / dividers (decorative)
--line-strong   #CBD5E1   input borders, slider tracks
--ink           #0F1B2D   headings, strong, amounts                    16.3:1 (17.3:1 on surface)
--ink-2         #334155   body prose                                    9.7:1 (10.4:1 on surface, 9.3:1 on bg-2)
--ink-3         #5B6776   labels, helper text, captions                 5.4:1 (5.8:1 on surface, 5.2:1 on bg-2)
                          (the brief's #64748B measures 4.47:1 on --bg — under AA — so it was darkened one step)
--primary       #1D4ED8   links, primary buttons, focus ring, nav active  6.3:1; white on primary 6.7:1
--primary-deep  #1E3A8A   button hover, navy bands                      white on it 10.4:1
--primary-tint  #EAF0FF   selected states, info notes, focus glow       primary on tint 5.9:1
--primary-line  #C7D7FE   info note / selected borders
--money         #047857   result figures, success, breakdown P&S swatch   5.2:1 (5.5:1 on surface)
--money-deep    #065F46   money text on tints, total row
--money-tint    #E7F6EF   range-bar track, success notes                money on tint 4.9:1
--amber         #B45309   deadline + caution text                       4.7:1 (5.0:1 on surface, 4.6:1 on amber-tint)
--amber-tint    #FFF4E5   caution note background
--danger        #B91C1C   validation errors, recovery-barred warnings   6.1:1 (6.5:1 on surface, 5.7:1 on danger-tint)
--danger-tint   #FDECEC   error note background
Gradients: --grad-hero (180deg #FFFFFF → #EEF3FF), --grad-primary (180deg #1D4ED8 → #1E40AF;
white on #1E40AF 8.7:1), --grad-accent (90deg primary → money, 4px line only).

Typography (free Google Fonts via next/font, self-hosted, variable):
Font display:  Plus Jakarta Sans 700/800 — H1–H3, wordmark, next-step titles (--font-display)
Font body:     Inter — body, UI, labels, inputs, nav (--font-body)
Money/stats:   Inter 800 with font-variant-numeric: tabular-nums (.tabular-nums, .result-amount)
Scale:         H1 clamp(36px,5vw,60px)/1.08 800 · H2 clamp(28px,3.4vw,40px)/1.18 · H3 22px/1.3
               body 18px/1.7 (17px under 480px) · labels 16px · inputs 18px · small 15px · caption 14px
               eyebrow 14px uppercase 0.08em · result amount clamp(44px,7vw,64px)/1.02
               Nothing renders below 14px: Tailwind text-xs = 14px, text-sm = 16px, text-base = 18px.

Spacing / radii / depth:
4px base. Card padding 22px mobile / 28px desktop. Section rhythm 48px mobile / 72px desktop.
Controls 52px tall (buttons, inputs); .btn-sm is 44px; touch targets never below 44px.
Page container max 1360px, 16px gutter mobile / 24px from 640px (.container-page).
Prose column max 760px (.editorial). Editorial pages are three columns from 1200px
(.editorial-grid): sticky TOC 224px · prose 760px · sticky rail 320px; one column below.
Tool/state pages: calculator 7/12 + sticky live result 5/12 from 1024px.
Radii: 10px inputs+buttons (--radius-sm), 14px cards (--radius), 18px panels (--radius-lg), 999px pills.
Shadows: --shadow-card 0 1px 2px rgba(15,27,45,.05), 0 8px 24px rgba(15,27,45,.06)
         --shadow-hover (card lift) · --shadow-pop (state picker, chooser card)
Focus: 2px primary outline, 2px offset, plus a 6px --primary-tint glow, everywhere.
Motion (all disabled under prefers-reduced-motion): card hover lift translateY(-2px) + shadow;
step content fade/slide 150ms (.fade-in); result count-up 450ms rAF; range-bar fill 500ms;
chip / segment press scale(.97–.98). No parallax, autoplay or scroll-jacking.

## Card Pattern (apply to all cards/panels)
background:    var(--surface)
border:        1px solid var(--line)
border-radius: 14px
box-shadow:    var(--shadow-card)      (.card; .card-flat omits the shadow; add .card-hover for the lift)
Notes: .note / .note-info / .note-caution / .note-danger / .note-success (tinted, 10px radius).
Chips: .fact-chip (label + value + optional note, tones is-amber/is-danger/is-money/is-primary;
.chip-press when a link). The damage-cap chip and the result-card cap notice come from
lib/damageCaps.ts, which records whether each state's cap is general or med-mal/punitive only.
Icons: lucide-react (ISC, tree-shaken) — import individual icons, aria-hidden, 16–26px.

## Brand mark
Rounded primary-blue tile (#1D4ED8, 22% radius) with a white "S" ribbon.
Source of truth: components/ui/Brand.tsx and app/icon.svg (same geometry).
Icon set in public/: favicon.ico (16/32/48), favicon-16x16/32x32/48x48.png,
icon-192.png, icon-512.png, apple-touch-icon.png (180, square bleed),
logo.png (800×200 wordmark, used by Organization JSON-LD), og-image.png (1200×630).
Regenerate with design-review/v2/make-icons.mjs (Playwright, no paid tools).

## Calculator UX contract
- Estimate is live: recomputes ~250ms after typing stops; "Show my estimate" only
  reveals validation and scrolls to the result. Formulas never move out of lib/calculations/.
- Result card: likely amount (count-up, --money); on the multiplier method only, the
  "If severity were rated one level lower / higher" range — the same calculateMultiplierMethod()
  run at the adjacent SEVERITY_CONFIGS levels (lib/severityRange.ts; the ±0.5 rangeLow/rangeHigh
  fields are not shown); breakdown rows, "How this was calculated" → /methodology/,
  Copy / Print. Next-step cards (lib/nextSteps.ts) render under the calculator on every load,
  three across, large.
- GA4 events (lib/analytics.ts, no personal data): calculator_start, calculator_complete,
  next_step_click {card_id}, result_copy, result_print.
- Every tool/state page, in this order: HeroBand (breadcrumb → H1 → one-line promise →
  TrustLine: Last reviewed · Settlebrook Editorial · N sources · Editorial policy → three
  key-fact chips → "Start calculating") → calculator + live result (full container width) →
  (on phones the band is compact — 28px H1, two-line promise, single-line trust row, chips as a
  horizontal snap row, no CTA — so the first input is on screen at 375×812) →
  next-step cards → EditorialLayout (sticky TOC auto-built from H2s · prose · tools rail) →
  sources, FAQ, state grid, disclaimer. The "Back to calculator" pill is position:sticky
  inside the editorial column (never fixed) and hidden ≥1200px where the TOC carries the link,
  so AdSense anchor ads can never overlap it.

## Project Structure
app/
  layout.tsx                               Root layout, GA4, fonts
  page.tsx                                 Homepage tool hub
  globals.css                              Global styles
  sitemap.ts                               Auto-generated sitemap
  pain-and-suffering-calculator/
    page.tsx                               Main calculator (Tool #1 — LIVE)
    [state]/page.tsx                       State landing pages — 14 states, full editorial content
  car-accident-settlement-calculator/
    page.tsx                               Main calculator (Tool #2 — LIVE)
    [state]/page.tsx                       State landing pages — 14 states, full editorial content
  workers-comp-settlement-calculator/
    page.tsx                               Main calculator (Tool #3 — LIVE)
    [state]/page.tsx                       State landing pages — 15 states, full editorial content
  methodology/page.tsx                     Editorial standards, formulas, sources, review cadence
  about/page.tsx
  contact/page.tsx
  privacy-policy/page.tsx
  terms-of-use/page.tsx

components/
  calculator/
    PainSufferingCalculator.tsx            Main calculator component (Tool #1)
    CalculatorResult.tsx                   Results display (Tool #1)
    CalculatorInput.tsx                    Input fields — reused across tools
    MethodToggle.tsx                       Multiplier/Per Diem toggle — reused across tools
    MultiplierSelector.tsx                 Severity selector — reused across tools
    DisclaimerBanner.tsx                   Legal disclaimer — reused across tools
    CarAccidentCalculator.tsx              Main calculator component (Tool #2)
    CarAccidentResult.tsx                  Results display (Tool #2)
    PolicyLimitInput.tsx                   Policy limit advisory input (Tool #2)
    WorkersCompCalculator.tsx              Main calculator component (Tool #3)
    WorkersCompResult.tsx                  Results display (Tool #3)
    BodyPartSelector.tsx                   AMA scheduled body part selector (Tool #3)
    ImpairmentSlider.tsx                   Impairment percentage slider (Tool #3)
  layout/
    Header.tsx                             Site header + nav
    Footer.tsx                             Site footer
  seo/
    FAQAccordion.tsx                       FAQ accordion component
    BreadcrumbNav.tsx                      Breadcrumb navigation

lib/
  calculations/
    painSuffering.ts                       ALL calculator math (Tool #1) — DO NOT MODIFY WITHOUT INSTRUCTION
    carAccident.ts                         Thin wrapper around painSuffering.ts (Tool #2)
    workersComp.ts                         Workers comp benefit formulas (Tool #3)
    types.ts                               TypeScript interfaces shared across tools
  data/
    states.ts                              State legal data (14 states, Tool #1)
    faqContent.ts                          FAQ content (Tool #1)
    carAccidentStates.ts                   Car-accident-specific state data (Tool #2)
    carAccidentFaqs.ts                     FAQ content (Tool #2)
    workersCompStates.ts                   Workers comp state data — stateRate, weeklyCap, ppdMethod flag (Tool #3)
    bodyParts.ts                           AMA scheduled weeks map by body part (Tool #3)
    workersCompFaqs.ts                     FAQ content (Tool #3)

public/
  og-image.png                            1200x630 social share image
  logo.png                                Settlebrook wordmark (Playfair Display)
  robots.txt

## Calculator Formula — DO NOT MODIFY WITHOUT INSTRUCTION
Multiplier method:
  multiplierBase   = medicalBills + futureMedical + lostWages + futureLostWages
  specialDamages   = multiplierBase + propertyDamage
  painAndSuffering = multiplierBase × multiplier
  totalEstimate    = specialDamages + painAndSuffering
  adjustedTotal    = totalEstimate × ((100 - plaintiffFaultPercent) / 100)

Per diem method:
  painAndSuffering = dailyRate × recoveryDays
  totalEstimate    = specialDamages + painAndSuffering

Multiplier ranges:
  Minor        1.5x
  Moderate     2.5x
  Serious      3.5x
  Severe       4.5x
  Catastrophic 5.0x

## Tool #2 Architecture — Car Accident Settlement Calculator
URL: /car-accident-settlement-calculator/
Status: LIVE — 14 states, full calculator and editorial content
New inputs vs Tool #1:
- propertyDamage — vehicle repair or total loss (already in formula)
- insurancePolicyLimit — advisory display field, triggers warning if estimate exceeds it
New files:
- lib/calculations/carAccident.ts — thin wrapper around painSuffering.ts
- lib/data/carAccidentStates.ts — car-accident-specific state data
- lib/data/carAccidentFaqs.ts — FAQ content
- components/calculator/CarAccidentCalculator.tsx
- components/calculator/CarAccidentResult.tsx
- components/calculator/PolicyLimitInput.tsx
Reused from Tool #1 unchanged:
CalculatorInput, MultiplierSelector, MethodToggle, DisclaimerBanner, FAQAccordion, BreadcrumbNav
State page priority:
Tier 1 (launch): California ($23.67 CPC), Texas ($14.50 CPC)
Tier 2 (30 days after): Florida, New York
Tier 3 (90 days after): Illinois, Pennsylvania, Georgia, Ohio, Arizona
Schema: WebApplication + FAQPage on main page. FAQPage + BreadcrumbList + WebPage with areaServed on state pages.

## Tool #3 Architecture — Workers Comp Settlement Calculator
URL: /workers-comp-settlement-calculator/
Status: LIVE — 15 states, full calculator and editorial content
Key difference from Tools #1 and #2:
- No-fault system — negligence irrelevant
- Pain and suffering NOT recoverable
- Formula based on: AWW × state_rate × impairment_weeks × (impairment_pct / 100)
Benefit types:
- TTD: weeklyBenefit × treatmentWeeks
- PPD: scheduledWeeks × (impairmentPct / 100) × weeklyBenefit
- PTD: annualBenefit × lifeExpectancyYears × discountFactor (0.85)
- weeklyBenefit = Math.min(AWW × stateRate, stateWeeklyCap)
- Attorney adjustment: × 1.25 if hasAttorney
New files:
- lib/calculations/workersComp.ts
- lib/data/workersCompStates.ts (stateRate, weeklyCap, ppdMethod flag)
- lib/data/bodyParts.ts (AMA scheduled weeks map)
- lib/data/workersCompFaqs.ts
- components/calculator/WorkersCompCalculator.tsx
- components/calculator/WorkersCompResult.tsx
- components/calculator/BodyPartSelector.tsx
- components/calculator/ImpairmentSlider.tsx
Reused from Tool #1 unchanged:
CalculatorInput, DisclaimerBanner, FAQAccordion, BreadcrumbNav
State page priority:
Tier 1 (launch): California, Texas, Florida
Tier 2: New York, Illinois, Pennsylvania
Tier 3: Georgia, Ohio, Michigan, North Carolina, Arizona
Skip: Washington, Wyoming (monopolistic state funds)
Special flags:
- Texas: non-subscriber employers → personal injury claim not workers comp
- Illinois: ppdMethod = percentage_of_person not AMA schedule
- New York: highest weekly cap nationally, updates annually
Schema: WebApplication + FAQPage on main page. FAQPage + BreadcrumbList + WebPage with areaServed on state pages.

## Pending Tasks — Complete In This Order
1. Blog posts — 4 foundation posts targeting long-tail keywords
2. Backlink acquisition
3. AdSense resubmission — after content and E-E-A-T layer are deployed

## SEO Keywords
Tool #1: "pain and suffering calculator"        KD 14%, 1.9K/mo, $7.37 CPC
Tool #2: "car accident settlement calculator"   KD 19%, 1.6K/mo, $11.40 CPC
Tool #3: "workers comp settlement calculator"   KD 14%, 1.3K/mo, $2.99 CPC

## Domain and Deployment
Domain:     settlebrook.com (canonical: https://www.settlebrook.com — always www)
Hosting:    Vercel (free tier)
Repo:       github.com/ab-554/settlebrook
Analytics:  Google Analytics 4 — G-K3PV0YLHFG
AdSense:    Pending approval — placeholder in layout.tsx

## NEVER Do These
- Modify painSuffering.ts formula without explicit instruction
- Change any color values without explicit instruction
- Add paid dependencies or APIs
- Create pages at /pain-and-suffering-calculator/states/
- Truncate file output
- Add lorem ipsum or placeholder content
- Remove legal disclaimers from calculator pages
- Use next.config.mjs — project uses next.config.js