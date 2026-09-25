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

## Design System (design-refresh, September 2026)
Light, calm, credible. Warm paper background, deep ink type, ONE accent
(deep teal-green = settled money), one amber for deadlines/caution. No
gradients, no glassmorphism, no floating animations. The canonical values
are CSS custom properties in app/globals.css; use `var(--token)` inline or
the matching Tailwind alias (text-ink, bg-paper, border-line, …).

Color tokens (all text pairs measured WCAG 2.1 AA, ratio on paper unless noted):
--paper         #FAF7F2   page background
--paper-2       #F3EEE6   header bands, alt sections
--surface       #FFFFFF   cards, inputs, calculator panel
--line          #E3DCD0   hairlines / dividers (decorative)
--line-strong   #CFC6B8   input borders, bar tracks
--ink           #1B2430   headings, strong, amounts       14.7:1
--ink-2         #334151   body prose                       9.8:1
--ink-3         #5B6774   labels, helper text, captions    5.4:1 (5.0:1 on paper-2)
--accent        #0E5E52   links, primary buttons, focus ring, result amount   7.2:1; white on accent 7.7:1
--accent-deep   #0A4A41   button hover                     white on it 10.2:1
--accent-tint   #E6F1EC   selected states, info notes      accent on tint 6.6:1
--accent-line   #BFDBD1   info note / selected borders
--amber         #8A5200   deadline + caution text          6.0:1 (5.8:1 on amber-tint)
--amber-tint    #FFF3DB   caution note background
--danger        #B3261E   validation errors, recovery-barred warnings   6.1:1 (5.6:1 on danger-tint)
--danger-tint   #FBEAE8   error note background

Typography (free Google Fonts via next/font, self-hosted, variable):
Font display:  Source Serif 4 600/700 — H1–H3, brand wordmark (--font-display)
Font body:     Inter — body, UI, labels, inputs, nav (--font-body)
Money/stats:   Inter 700 with font-variant-numeric: tabular-nums (.tabular-nums)
Scale:         H1 clamp(30px,5vw,44px)/1.15 · H2 clamp(24px,3.4vw,30px)/1.25 · H3 20px/1.35
               body 17px/1.7 (16px under 480px) · small 14px · caption 13px · eyebrow 12px uppercase 0.08em
               result amount clamp(36px,7vw,52px)/1.05

Spacing / radii / depth:
4px base. Card padding 20px mobile / 24px desktop. Section rhythm 40px mobile / 64px desktop.
Prose column max 720px (.editorial / .prose-col). Page container max 1200px, 16px gutter (.container-page).
Radii: 8px inputs+buttons (--radius-sm), 12px cards (--radius), 999px pills.
Shadows: --shadow-card 0 1px 2px rgba(27,36,48,.06), 0 6px 20px rgba(27,36,48,.06)
         --shadow-pop  0 12px 32px rgba(27,36,48,.14) (state picker, sticky pill)
Focus: 2px accent outline, 2px offset, everywhere. Touch targets 44px minimum.
Motion: CSS transitions ≤ 0.4s and a 450ms rAF count-up only; prefers-reduced-motion disables both.

## Card Pattern (apply to all cards/panels)
background:    var(--surface)
border:        1px solid var(--line)
border-radius: 12px
box-shadow:    var(--shadow-card)      (.card; .card-flat omits the shadow)
Notes: .note / .note-info / .note-caution / .note-danger (tinted, 8px radius).

## Brand mark
Rounded deep-green tile (#0E5E52, 22% radius) with a cream (#FAF7F2) "S" ribbon.
Source of truth: components/ui/Brand.tsx and app/icon.svg (same geometry).
Icon set in public/: favicon.ico (16/32/48), favicon-16x16/32x32/48x48.png,
icon-192.png, icon-512.png, apple-touch-icon.png (180, square bleed),
logo.png (800×200 wordmark, used by Organization JSON-LD), og-image.png (1200×630).

## Calculator UX contract
- Estimate is live: recomputes ~250ms after typing stops; "Show my estimate" only
  reveals validation and scrolls to the result. Formulas never move out of lib/calculations/.
- Result card: likely amount (count-up), low/likely/high range bar ONLY where the math
  produces one (multiplier method), breakdown rows, "How this was calculated" → /methodology/,
  Copy / Print, then 2–3 next-step cards from lib/nextSteps.ts.
- GA4 events (lib/analytics.ts, no personal data): calculator_start, calculator_complete,
  next_step_click {card_id}, result_copy, result_print.
- Every tool/state page: breadcrumb → H1 → one-line promise → TrustLine (Last reviewed ·
  Settlebrook Editorial · Editorial policy) → calculator, then editorial with the sticky
  "Back to calculator" pill (top-right, never bottom, so AdSense anchor ads can't overlap it).

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