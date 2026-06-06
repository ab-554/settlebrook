// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Homepage hub
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Personal Injury Settlement Calculators — Settlebrook',
  description:
    'Free personal injury settlement calculators for USA accident victims. Estimate pain and suffering damages, car accident settlements, and workers comp settlements instantly.',
  alternates: { canonical: 'https://settlebrook.com/' },
  openGraph: {
    title: 'Free Personal Injury Settlement Calculators — Settlebrook',
    description: 'Estimate your injury settlement in seconds. Free tools for pain and suffering, car accident, and workers comp claims across all 50 states.',
    url: 'https://settlebrook.com/',
  },
}

const TOOLS = [
  {
    href: '/pain-and-suffering-calculator/',
    title: 'Pain & Suffering Calculator',
    description: 'Estimate non-economic damages using the multiplier method or per diem method — the same formulas used by insurance adjusters and plaintiff attorneys.',
    stats: 'Multiplier (1.5×–5×) + Per Diem methods',
    badge: 'Most Popular',
    available: true,
    icon: '⚖️',
  },
  {
    href: '/car-accident-settlement-calculator/',
    title: 'Car Accident Settlement Calculator',
    description: 'Estimate your total car accident settlement including vehicle damage, medical bills, lost wages, and pain and suffering. Covers all 50 states.',
    stats: 'Economic + non-economic damages',
    badge: 'Live',
    available: true,
    icon: '🚗',
  },
  {
    href: '/workers-comp-settlement-calculator/',
    title: 'Workers Comp Settlement Calculator',
    description: 'Estimate your workers compensation settlement based on injury type, wage loss, and permanent impairment rating. State benefit schedules included.',
    stats: 'PPD, PTD, and wage loss benefits',
    badge: 'Live',
    available: true,
    icon: '🏗️',
  },
]

const TRUST_BADGES = [
  { icon: '🛡️', label: 'No Signup Required' },
  { icon: '🔒', label: 'No Personal Data Collected' },
  { icon: '✅', label: 'Updated for 2026 State Laws' },
  { icon: '⚡', label: 'Instant Results' },
]

const HOW_IT_WORKS = [
  {
    icon: '🧮',
    title: 'Industry Formulas',
    body: 'Our calculators use the multiplier method and per diem method — the same approaches used by insurance adjusters and plaintiff attorneys.',
  },
  {
    icon: '⚖️',
    title: 'State-Specific Laws',
    body: 'Fault rules, damage caps, and statutes of limitations vary by state. Each state calculator reflects current local law.',
  },
  {
    icon: '📋',
    title: 'Estimates Only',
    body: 'Results are informed estimates, not legal advice. Actual settlements depend on your specific evidence, insurance limits, and negotiation.',
  },
]

const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Settlebrook',
  url: 'https://settlebrook.com',
  description: 'Free personal injury settlement calculators for USA accident victims.',
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }} />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4"
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)',
          }}
        >
          {/* Orbs */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div
              className="orb-1 absolute rounded-full"
              style={{
                width: 480,
                height: 480,
                top: '-10%',
                left: '-8%',
                background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)',
                filter: 'blur(48px)',
              }}
            />
            <div
              className="orb-2 absolute rounded-full"
              style={{
                width: 380,
                height: 380,
                bottom: '5%',
                right: '-5%',
                background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)',
                filter: 'blur(48px)',
              }}
            />
            <div
              className="orb-3 absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                top: '45%',
                left: '55%',
                background: 'radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto py-24 sm:py-28 flex flex-col items-center gap-8">

            {/* Eyebrow */}
            <div className="animate-fade-in-up">
              <span className="trust-pill">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#34D399', animation: 'pulseGlow 2s infinite' }}
                />
                Free · No Signup · All 50 States
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Know what your injury claim<br />is really worth
            </h1>

            {/* Sub */}
            <p
              className="animate-fade-in-up-d2 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Get a calm, data-backed estimate of your settlement in minutes — built from real personal injury outcomes. No pressure, no spam.
            </p>

            {/* Trust badges */}
            <div className="animate-fade-in-up-d3 flex flex-wrap justify-center gap-3">
              {TRUST_BADGES.map((badge) => (
                <span key={badge.label} className="trust-pill">
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up-d4">
              <Link
                href="/pain-and-suffering-calculator/"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                Start with Pain &amp; Suffering Calculator →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TOOL CARDS ── */}
        <section
          className="max-w-7xl mx-auto px-6 sm:px-8 py-16"
          aria-label="Available calculators"
        >
          <h2
            className="heading-gradient text-center mb-10"
            style={{ fontSize: 32, fontWeight: 700 }}
          >
            Choose Your Calculator
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TOOLS.map((tool) => (
              <article
                key={tool.href}
                className="glass-card flex flex-col overflow-hidden"
              >
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{tool.icon}</span>
                      <h3
                        className="text-base font-bold leading-snug"
                        style={{ color: tool.available ? '#F1F5F9' : '#64748B', fontSize: 16 }}
                      >
                        {tool.title}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={
                        tool.available
                          ? { background: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.30)' }
                          : { background: 'rgba(148,163,184,0.08)', color: '#64748B', border: '1px solid rgba(148,163,184,0.15)' }
                      }
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: tool.available ? '#94A3B8' : '#475569' }}>
                    {tool.description}
                  </p>
                  <p className="text-xs" style={{ color: '#475569' }}>{tool.stats}</p>
                </div>
                <div className="px-6 pb-6">
                  {tool.available ? (
                    <Link
                      href={tool.href}
                      className="btn-primary block w-full text-center py-3 px-4 text-sm font-semibold rounded-xl"
                    >
                      Use Calculator →
                    </Link>
                  ) : (
                    <div
                      className="block w-full text-center rounded-xl text-sm font-semibold py-3 px-4 cursor-default"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#475569' }}
                    >
                      Coming Soon
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="heading-gradient text-center mb-8"
              style={{ fontSize: 28, fontWeight: 700 }}
            >
              How Settlement Estimates Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-4 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: 'rgba(96,165,250,0.10)',
                      border: '1px solid rgba(96,165,250,0.20)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: '#F1F5F9', fontSize: 15 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
