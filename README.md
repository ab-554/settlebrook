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

## Environment Variables
No environment variables required for current build.
AdSense publisher ID in app/layout.tsx: ca-pub-9642525412838279

## SEO Strategy
Primary keyword: "pain and suffering calculator" (KD 14%)
State pages: /pain-and-suffering-calculator/[state]/ (14 states live)
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