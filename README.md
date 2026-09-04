# Settlebrook

Free legal settlement calculators for USA personal injury victims.
Live at: https://www.settlebrook.com

## What This Is
A calculator hub targeting USA adults researching personal injury
settlements. Three tools, all live:

- Tool #1: Pain & Suffering Calculator — LIVE (14 states)
- Tool #2: Car Accident Settlement Calculator — LIVE (14 states)
- Tool #3: Workers Comp Settlement Calculator — LIVE (15 states)

Monetized through Google AdSense and legal affiliate links.

## Tech Stack
- Framework:  Next.js 14 (App Router)
- Styling:    Tailwind CSS
- Language:   TypeScript
- Hosting:    Vercel (free tier)
- Analytics:  Google Analytics 4
- Fonts:      Playfair Display (headings) + Inter (body)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
cd settlebrook
npm install
npm run dev

Open http://localhost:3000

### Deploy
Push to main branch on GitHub.
Vercel auto-deploys on every push.

## Project Structure
See AGENTS.md for complete file structure and AI agent instructions.

Routes (source of truth: app/sitemap.ts):
- /                                        Homepage tool hub
- /pain-and-suffering-calculator/          Tool #1, plus /[state]/ (14 states)
- /pain-and-suffering-calculator/guide/    Long-form guide
- /car-accident-settlement-calculator/     Tool #2, plus /[state]/ (14 states)
- /workers-comp-settlement-calculator/     Tool #3, plus /[state]/ (15 states)
- /methodology/                            E-E-A-T page: calculation formulas,
                                           state law verification sources, review cadence
- /blog/                                   Blog index (1 post live, 3 more planned)
- /blog/state-farm-pain-and-suffering-calculator/
- /about/  /contact/  /privacy-policy/  /terms-of-use/

## Environment Variables
No environment variables required for current build.
AdSense publisher ID in app/layout.tsx: ca-pub-9642525412838279

## SEO Strategy
Primary keyword: "pain and suffering calculator" (KD 14%)
State pages: /pain-and-suffering-calculator/[state]/ (14 states live)
Roadmap: 50-state coverage is a long-term goal, not current state.
Supporting content: Blog posts targeting long-tail legal keywords (1 live, 3 planned)

## Revenue Model
- Google AdSense (primary — pending approval)
- Legal affiliate links (secondary — planned month 3+)
- Target: $500/mo by month 12

## Calculator Formula
See lib/calculations/painSuffering.ts and AGENTS.md for formula details.
Do not modify formula logic without reading AGENTS.md first.

## AI Agents
This project uses multiple AI agents (Claude, Gemini, Antigravity).
All agents must read AGENTS.md before making any changes.

## Legal
All calculator results are estimates only — not legal advice.
See /terms-of-use and /privacy-policy for full disclaimers.