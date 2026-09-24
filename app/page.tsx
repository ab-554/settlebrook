// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Homepage hub
// Expanded 2026-09-24 (Sprint B2, item 8): added prose sections explaining
// what each calculator does and when to use which, how estimates are
// calculated, per-tool state guide lists (indexed states only), a feature
// callout for the workers-comp max-benefits table, and an auto-pulled latest
// blog posts section. Hero, tool cards, and the 3-icon "how it works" grid
// are unchanged from the prior version.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPriorityStates, ALL_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'
import { getLatestBlogPosts } from '@/lib/data/blogPosts'

export const metadata: Metadata = {
  title: 'Free Personal Injury Settlement Calculators — Settlebrook',
  description:
    'Free personal injury settlement calculators for USA accident victims. Estimate pain and suffering damages, car accident settlements, and workers comp settlements instantly.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free Personal Injury Settlement Calculators — Settlebrook',
    description: 'Estimate your injury settlement in seconds. Free tools for pain and suffering, car accident, and workers comp claims, built for any US state.',
    url: 'https://www.settlebrook.com/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Settlebrook — Free Personal Injury Settlement Calculators' }],
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
    description: 'Estimate your total car accident settlement including vehicle damage, medical bills, lost wages, and pain and suffering. Works for any US state, with dedicated guides for select states.',
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
  { icon: '🔒', label: 'Your Inputs Never Leave Your Browser' },
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

// Only indexed state pages are linked — Michigan, Colorado, Georgia, New
// Jersey, Virginia, and Minnesota workers-comp pages are noindexed stub
// templates (see NOINDEXED_WORKERS_COMP_SLUGS) and shouldn't be promoted here.
const painSufferingStates = getPriorityStates()
const carAccidentStates = CAR_ACCIDENT_STATES.filter((s) => s.slug === 'california' || s.slug === 'texas' || s.slug === 'florida' || s.slug === 'new-york')
const workersCompStates = WORKERS_COMP_STATES.filter((s) => !NOINDEXED_WORKERS_COMP_SLUGS.has(s.slug))

const latestPosts = getLatestBlogPosts(5)

const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Settlebrook',
  url: 'https://www.settlebrook.com',
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
                Free · No Signup · Works for Any US State
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
              Get a calm, straightforward estimate of your settlement in minutes, using the same formulas insurance adjusters and plaintiff attorneys use. No pressure, no spam.
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

        {/* ── WHICH CALCULATOR SHOULD YOU USE ── */}
        <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <h2 className="heading-gradient text-center mb-8" style={{ fontSize: 28, fontWeight: 700 }}>
            Which Calculator Should You Use?
          </h2>
          <div className="flex flex-col gap-6 text-base leading-relaxed" style={{ color: '#94A3B8' }}>
            <p>
              All three tools share the same underlying settlement math, but each one answers a different question, and picking the wrong one will leave money out of your estimate.
            </p>
            <p>
              <strong style={{ color: '#E2E8F0' }}>Pain &amp; Suffering</strong> is the general-purpose tool: use it any time you have medical bills, lost wages, and a physical injury but no vehicle involved &mdash; a slip and fall, a dog bite, a workplace injury outside the workers&rsquo; comp system, or any other personal injury claim. It calculates non-economic damages using the multiplier method (the industry standard) or the per diem method, and adds them to your economic damages for a total estimate.
            </p>
            <p>
              <strong style={{ color: '#E2E8F0' }}>Car Accident</strong> is a wrapper around that same pain-and-suffering math, built specifically for collision claims. Use it instead of the general calculator whenever a vehicle is involved &mdash; it adds vehicle damage as a separate line item that&rsquo;s included in your economic total but deliberately excluded from the pain-and-suffering multiplier base, and it lets you enter the at-fault driver&rsquo;s insurance policy limit to see whether your estimate exceeds what their coverage can actually pay.
            </p>
            <p>
              <strong style={{ color: '#E2E8F0' }}>Workers Comp</strong> is a genuinely different system, not a variant of the other two. If you were hurt on the job, workers&rsquo; compensation is a no-fault system where pain and suffering generally isn&rsquo;t recoverable at all &mdash; instead you receive wage-replacement and impairment-based benefits (TTD, PPD, or PTD) set by your state&rsquo;s statutory schedule. Use this calculator, not the general one, for any workplace injury.
            </p>
            <p>
              All three run entirely in your browser &mdash; nothing you type is sent to a server, stored, or sold, and none of them require an email address or signup to see a result. If your state isn&rsquo;t one of the ones we&rsquo;ve published a dedicated guide for, the general calculators still work: the underlying formulas aren&rsquo;t state-specific, only the surrounding legal context (caps, fault rules, deadlines) is.
            </p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
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
            <p className="text-center text-sm mt-8" style={{ color: '#94A3B8' }}>
              Every formula, source, and review date behind these numbers is disclosed on our{' '}
              <Link href="/methodology/" className="underline transition-colors" style={{ color: '#60A5FA' }}>
                methodology page
              </Link>
              . We don&rsquo;t use a black-box score &mdash; you can see exactly how each figure is calculated and where the legal figures come from.
            </p>
          </div>
        </section>

        {/* ── STATE GUIDES ── */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
          <h2 className="heading-gradient text-center mb-3" style={{ fontSize: 28, fontWeight: 700 }}>
            State-Specific Guides
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-10 text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
            Fault rules, damage caps, and benefit schedules vary by state. These pages account for local law on top of the general formula.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Pain &amp; Suffering</h3>
              <ul className="flex flex-col gap-2 mb-4">
                {painSufferingStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="text-sm transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                      {state.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/pain-and-suffering-calculator/" className="text-xs transition-colors hover:opacity-80" style={{ color: '#94A3B8' }}>
                See all {ALL_STATES.length} states →
              </Link>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Car Accident</h3>
              <ul className="flex flex-col gap-2 mb-4">
                {carAccidentStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/car-accident-settlement-calculator/${state.slug}/`} className="text-sm transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                      {state.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/car-accident-settlement-calculator/" className="text-xs transition-colors hover:opacity-80" style={{ color: '#94A3B8' }}>
                See all {CAR_ACCIDENT_STATES.length} states →
              </Link>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Workers Comp</h3>
              <ul className="flex flex-col gap-2 mb-4">
                {workersCompStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/workers-comp-settlement-calculator/${state.slug}/`} className="text-sm transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                      {state.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/workers-comp-settlement-calculator/" className="text-xs transition-colors hover:opacity-80" style={{ color: '#94A3B8' }}>
                See all indexed states →
              </Link>
            </div>
          </div>
        </section>

        {/* ── MAX BENEFITS TABLE FEATURE ── */}
        <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <div className="glass-card p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div>
              <h2 className="heading-gradient mb-2" style={{ fontSize: 24, fontWeight: 700 }}>
                Know Your State&rsquo;s Maximum Weekly Benefit
              </h2>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#94A3B8' }}>
                Every state caps workers&rsquo; comp benefits at a maximum weekly rate, no matter how high your wages were. We sourced the current max and min weekly TTD rate for all 50 states and DC directly from each state&rsquo;s own agency &mdash; see the full table, methodology, and downloadable CSV.
              </p>
            </div>
            <Link
              href="/workers-comp-maximum-weekly-benefits-by-state/"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap"
            >
              View the Full Table →
            </Link>
          </div>
        </section>

        {/* ── LATEST FROM THE BLOG ── */}
        {latestPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-gradient" style={{ fontSize: 28, fontWeight: 700 }}>
                Latest From the Blog
              </h2>
              <Link href="/blog/" className="text-sm transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                All guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={post.slug}
                  className="glass-card block p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <time dateTime={post.dateTime} className="text-xs font-medium uppercase tracking-widest" style={{ color: '#60A5FA' }}>
                    {post.date}
                  </time>
                  <h3 className="mt-3 font-bold leading-snug" style={{ fontSize: 18, color: '#E2E8F0', letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  )
}
