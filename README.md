# Settlebrook

Free legal settlement calculators for USA personal injury victims.
Live at: https://settlebrook.com

## What This Is
A calculator hub targeting USA adults researching personal injury
settlements. Three tools planned:

- Tool #1: Pain & Suffering Calculator — LIVE
- Tool #2: Car Accident Settlement Calculator — coming month 2
- Tool #3: Workers Comp Settlement Calculator — coming month 3

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

## Environment Variables
No environment variables required for current build.
AdSense publisher ID is a placeholder in app/layout.tsx —
replace ca-pub-ADSENSE_PUBLISHER_ID with real ID after approval.

## SEO Strategy
Primary keyword: "pain and suffering calculator" (KD 3%)
State pages: /pain-and-suffering-calculator/[state]/ for all 50 states
Supporting content: Blog posts targeting long-tail legal keywords

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