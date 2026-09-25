// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Homepage hub
// Design-refresh (2026-09): the full-viewport dark hero is gone. The page now
// opens with a short H1 + promise and a "What happened?" chooser that sends
// the visitor straight into the right calculator. Every prose section from
// the 2026-09-24 rewrite (which calculator, how estimates work, state guides,
// benefits-table callout, latest guides) is kept with its wording unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPriorityStates, ALL_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'
import { getLatestBlogPosts, getPostDisplayDate } from '@/lib/data/blogPosts'

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

// "What happened?" chooser — one card per calculator. Descriptions are the
// same tool descriptions the previous tool-card grid carried.
const CHOICES = [
  {
    kicker: 'Car accident',
    href: '/car-accident-settlement-calculator/',
    title: 'Car Accident Settlement Calculator',
    description: 'Estimate your total car accident settlement including vehicle damage, medical bills, lost wages, and pain and suffering. Works for any US state, with dedicated guides for select states.',
    stats: 'Economic + non-economic damages',
  },
  {
    kicker: 'Workplace injury',
    href: '/workers-comp-settlement-calculator/',
    title: 'Workers Comp Settlement Calculator',
    description: 'Estimate your workers compensation settlement based on injury type, wage loss, and permanent impairment rating. State benefit schedules included.',
    stats: 'PPD, PTD, and wage loss benefits',
  },
  {
    kicker: 'Other injury',
    href: '/pain-and-suffering-calculator/',
    title: 'Pain & Suffering Calculator',
    description: 'Estimate non-economic damages using the multiplier method or per diem method — the same formulas used by insurance adjusters and plaintiff attorneys.',
    stats: 'Multiplier (1.5×–5×) + Per Diem methods',
  },
]

const TRUST_BADGES = [
  'No signup required',
  'Your inputs never leave your browser',
  'Updated for 2026 state laws',
  'Instant results',
]

const HOW_IT_WORKS = [
  {
    title: 'Industry Formulas',
    body: 'Our calculators use the multiplier method and per diem method — the same approaches used by insurance adjusters and plaintiff attorneys.',
  },
  {
    title: 'State-Specific Laws',
    body: 'Fault rules, damage caps, and statutes of limitations vary by state. Each state calculator reflects current local law.',
  },
  {
    title: 'Estimates Only',
    body: 'Results are informed estimates, not legal advice. Actual settlements depend on your specific evidence, insurance limits, and negotiation.',
  },
]

// Only indexed state pages are linked — see NOINDEXED_WORKERS_COMP_SLUGS.
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

      <main className="min-h-screen">

        {/* ── HERO + CHOOSER ── */}
        <section className="page-band" aria-labelledby="home-heading">
          <div className="container-page py-10 sm:py-14">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">Free · No signup · Works for any US state</p>
              <h1 id="home-heading" style={{ fontSize: 'clamp(32px, 5.5vw, 52px)' }}>
                Know what your injury claim is really worth
              </h1>
              <p className="lede mt-4 max-w-2xl">
                Get a calm, straightforward estimate of your settlement in minutes, using the same formulas insurance adjusters and plaintiff attorneys use. No pressure, no spam.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="heading-serif mb-4" style={{ fontSize: 22 }}>What happened?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CHOICES.map((choice) => (
                  <Link key={choice.href} href={choice.href} className="choice-card">
                    <span className="choice-kicker">{choice.kicker}</span>
                    <span className="choice-title">{choice.title}</span>
                    <span className="choice-desc">{choice.description}</span>
                    <span className="text-xs" style={{ color: 'var(--ink-3)' }}>{choice.stats}</span>
                    <span className="choice-cta">Start the calculator →</span>
                  </Link>
                ))}
              </div>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="What to expect">
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ink-2)' }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} style={{ color: 'var(--accent)' }}><path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── WHICH CALCULATOR SHOULD YOU USE ── */}
        <section className="container-page py-12 sm:py-16" aria-labelledby="which-heading">
          <div className="editorial">
            <h2 id="which-heading" style={{ marginTop: 0 }}>Which Calculator Should You Use?</h2>
            <p>
              All three tools share the same underlying settlement math, but each one answers a different question, and picking the wrong one will leave money out of your estimate.
            </p>
            <p>
              <strong>Pain &amp; Suffering</strong> is the general-purpose tool: use it any time you have medical bills, lost wages, and a physical injury but no vehicle involved &mdash; a slip and fall, a dog bite, a workplace injury outside the workers&rsquo; comp system, or any other personal injury claim. It calculates non-economic damages using the multiplier method (the industry standard) or the per diem method, and adds them to your economic damages for a total estimate.
            </p>
            <p>
              <strong>Car Accident</strong> is a wrapper around that same pain-and-suffering math, built specifically for collision claims. Use it instead of the general calculator whenever a vehicle is involved &mdash; it adds vehicle damage as a separate line item that&rsquo;s included in your economic total but deliberately excluded from the pain-and-suffering multiplier base, and it lets you enter the at-fault driver&rsquo;s insurance policy limit to see whether your estimate exceeds what their coverage can actually pay.
            </p>
            <p>
              <strong>Workers Comp</strong> is a genuinely different system, not a variant of the other two. If you were hurt on the job, workers&rsquo; compensation is a no-fault system where pain and suffering generally isn&rsquo;t recoverable at all &mdash; instead you receive wage-replacement and impairment-based benefits (TTD, PPD, or PTD) set by your state&rsquo;s statutory schedule. Use this calculator, not the general one, for any workplace injury.
            </p>
            <p>
              All three run entirely in your browser &mdash; nothing you type is sent to a server, stored, or sold, and none of them require an email address or signup to see a result. If your state isn&rsquo;t one of the ones we&rsquo;ve published a dedicated guide for, the general calculators still work: the underlying formulas aren&rsquo;t state-specific, only the surrounding legal context (caps, fault rules, deadlines) is.
            </p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="how-heading">
          <div className="card card-pad">
            <h2 id="how-heading" className="heading-serif mb-6" style={{ fontSize: 26 }}>
              How Settlement Estimates Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <span className="calc-step-badge" aria-hidden="true">{i + 1}</span>
                  <h3 className="font-body font-semibold" style={{ fontSize: 16 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>{item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-6 pt-5" style={{ color: 'var(--ink-2)', borderTop: '1px solid var(--line)' }}>
              Every formula, source, and review date behind these numbers is disclosed on our{' '}
              <Link href="/methodology/" className="text-link">methodology page</Link>
              . We don&rsquo;t use a black-box score &mdash; you can see exactly how each figure is calculated and where the legal figures come from.
            </p>
          </div>
        </section>

        {/* ── MAX BENEFITS TABLE FEATURE ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="benefits-heading">
          <div className="card card-pad flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between" style={{ background: 'var(--accent-tint)', borderColor: 'var(--accent-line)' }}>
            <div>
              <p className="eyebrow mb-2">Reference table</p>
              <h2 id="benefits-heading" className="heading-serif mb-2" style={{ fontSize: 24 }}>
                Know Your State&rsquo;s Maximum Weekly Benefit
              </h2>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--ink-2)' }}>
                Every state caps workers&rsquo; comp benefits at a maximum weekly rate, no matter how high your wages were. We sourced the current max and min weekly TTD rate for all 50 states and DC directly from each state&rsquo;s own agency &mdash; see the full table, methodology, and downloadable CSV.
              </p>
            </div>
            <Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="btn-primary whitespace-nowrap">
              View the full table →
            </Link>
          </div>
        </section>

        {/* ── STATE GUIDES ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="states-heading">
          <h2 id="states-heading" className="heading-serif mb-2" style={{ fontSize: 26 }}>
            State-Specific Guides
          </h2>
          <p className="text-sm max-w-2xl mb-6 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            Fault rules, damage caps, and benefit schedules vary by state. These pages account for local law on top of the general formula.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-flat card-pad">
              <h3 className="font-body font-semibold mb-3" style={{ fontSize: 15 }}>Pain &amp; Suffering</h3>
              <ul className="flex flex-col">
                {painSufferingStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="text-link inline-block py-1.5 text-sm">{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/pain-and-suffering-calculator/" className="inline-block mt-3 text-xs font-semibold" style={{ color: 'var(--ink-3)' }}>
                See all {ALL_STATES.length} states →
              </Link>
            </div>

            <div className="card-flat card-pad">
              <h3 className="font-body font-semibold mb-3" style={{ fontSize: 15 }}>Car Accident</h3>
              <ul className="flex flex-col">
                {carAccidentStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/car-accident-settlement-calculator/${state.slug}/`} className="text-link inline-block py-1.5 text-sm">{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/car-accident-settlement-calculator/" className="inline-block mt-3 text-xs font-semibold" style={{ color: 'var(--ink-3)' }}>
                See all {CAR_ACCIDENT_STATES.length} states →
              </Link>
            </div>

            <div className="card-flat card-pad">
              <h3 className="font-body font-semibold mb-3" style={{ fontSize: 15 }}>Workers Comp</h3>
              <ul className="flex flex-col">
                {workersCompStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/workers-comp-settlement-calculator/${state.slug}/`} className="text-link inline-block py-1.5 text-sm">{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/workers-comp-settlement-calculator/" className="inline-block mt-3 text-xs font-semibold" style={{ color: 'var(--ink-3)' }}>
                See all indexed states →
              </Link>
            </div>
          </div>
        </section>

        {/* ── LATEST FROM THE BLOG ── */}
        {latestPosts.length > 0 && (
          <section className="container-page pb-16 sm:pb-20" aria-labelledby="blog-heading">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 id="blog-heading" className="heading-serif" style={{ fontSize: 26 }}>
                Latest From the Blog
              </h2>
              <Link href="/blog/" className="text-link text-sm whitespace-nowrap">All guides →</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={post.slug} className="card card-pad block">
                  <time dateTime={post.publishDate} className="eyebrow">
                    {getPostDisplayDate(post)}
                  </time>
                  <h3 className="heading-serif mt-2" style={{ fontSize: 20 }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                    {post.description}
                  </p>
                  <span className="inline-block mt-3 text-sm font-semibold" style={{ color: 'var(--accent)' }}>Read the guide →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  )
}
