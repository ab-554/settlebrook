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
    [state]/page.tsx                       State landing pages (14 states active)
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

## Pending Tasks — Complete In This Order
1. Swap Bitter → Playfair Display in app/layout.tsx and tailwind.config.ts
2. Fix fault percentage slider styling in PainSufferingCalculator.tsx
3. Fix spacing between Step 2 and Step 3 in calculator form
4. Remove ALL links to /pain-and-suffering-calculator/states/ sitewide
5. Update Header.tsx — use logo.png replacing current text/emoji
6. Content rewrite — landing page copy (1200+ words, empathetic tone)
7. Blog posts — 4 foundation SEO posts
8. Expand states.ts from 14 to all 50 states

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