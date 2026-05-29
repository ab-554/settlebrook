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

## Design System
Background:        #050A18
Card background:   rgba(255,255,255,0.04) with backdrop-blur-16px
Card border:       rgba(99,179,237,0.15)
Primary accent:    #60A5FA
Secondary accent:  #34D399
Gold/amounts:      #FBBF24
Body text:         #E2E8F0
Muted text:        #94A3B8
Button gradient:   linear-gradient(135deg, #3B82F6, #06B6D4)
Font display:      Playfair Display (headings, logo, H1-H3)
Font body:         Inter (body text, labels, inputs, nav)

## Glassmorphism Pattern (apply to all cards/panels)
background:    rgba(255,255,255,0.04)
backdrop-filter: blur(16px)
border:        1px solid rgba(99,179,237,0.15)
border-radius: 16px
box-shadow:    0 8px 32px rgba(0,0,0,0.3)

## Project Structure
app/
  layout.tsx                               Root layout, GA4, fonts
  page.tsx                                 Homepage tool hub
  globals.css                              Global styles
  sitemap.ts                               Auto-generated sitemap
  pain-and-suffering-calculator/
    page.tsx                               Main calculator (Tool #1 — LIVE)
    [state]/page.tsx                       State landing pages — all active states carry full editorial content
  car-accident-settlement-calculator/
    page.tsx                               Stub page (Tool #2 — coming soon)
  workers-comp-settlement-calculator/
    page.tsx                               Stub page (Tool #3 — coming soon)
  about/page.tsx
  contact/page.tsx
  privacy-policy/page.tsx
  terms-of-use/page.tsx

components/
  calculator/
    PainSufferingCalculator.tsx            Main calculator component
    CalculatorResult.tsx                   Results display
    CalculatorInput.tsx                    Input fields
    MethodToggle.tsx                       Multiplier/Per Diem toggle
    MultiplierSelector.tsx                 Severity selector
    DisclaimerBanner.tsx                   Legal disclaimer
  layout/
    Header.tsx                             Site header + nav
    Footer.tsx                             Site footer
  seo/
    FAQAccordion.tsx                       FAQ accordion component
    BreadcrumbNav.tsx                      Breadcrumb navigation

lib/
  calculations/
    painSuffering.ts                       ALL calculator math
    types.ts                               TypeScript interfaces
  data/
    states.ts                              State legal data (14 states)
    faqContent.ts                          FAQ content

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
Status: Building
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

## Pending Tasks — Complete In This Order
1. Tool #2 — Car Accident Settlement Calculator architecture and build
2. Tool #3 — Workers Comp Settlement Calculator architecture and build
3. Blog posts — 4 foundation posts targeting long-tail keywords
4. Internal linking audit — ensure all state pages link to each other correctly
5. AdSense — replace placeholder divs with real ad units after approval

## SEO Keywords
Tool #1: "pain and suffering calculator"        KD 3%,  1.9K/mo, $7.37 CPC
Tool #2: "car accident settlement calculator"   KD 19%, 1.6K/mo, $11.40 CPC
Tool #3: "workers comp settlement calculator"   KD 14%, 1.3K/mo, $2.99 CPC

## Domain and Deployment
Domain:     settlebrook.com
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