// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Homepage hub
// Design v2 (2026-09-25): hero band with the H1 + promise on the left and a
// large "What happened?" chooser card on the right; then the three tool
// cards, the "which calculator" prose, the benefits-table highlight, how it
// works (three steps, big numerals), state guides and the latest guides.
// Every prose section from the 2026-09-24 rewrite is kept with its wording
// unchanged — only the presentation changed.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Car, Check, HardHat, HeartPulse, Landmark, MapPin, FileText } from 'lucide-react'
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

// "What happened?" chooser + tool cards — one entry per calculator. The
// descriptions are the same tool descriptions the previous tool-card grid carried.
const CHOICES = [
  {
    id: 'car',
    kicker: 'Car accident',
    chooser: 'I was in a car accident',
    chooserDesc: 'Vehicle damage, injuries and the other driver’s policy limit',
    href: '/car-accident-settlement-calculator/',
    title: 'Car Accident Settlement Calculator',
    description: 'Estimate your total car accident settlement including vehicle damage, medical bills, lost wages, and pain and suffering. Works for any US state, with dedicated guides for select states.',
    stats: 'Economic + non-economic damages',
    Icon: Car,
  },
  {
    id: 'work',
    kicker: 'Workplace injury',
    chooser: 'I was hurt at work',
    chooserDesc: 'Wage-replacement and impairment benefits by state',
    href: '/workers-comp-settlement-calculator/',
    title: 'Workers Comp Settlement Calculator',
    description: 'Estimate your workers compensation settlement based on injury type, wage loss, and permanent impairment rating. State benefit schedules included.',
    stats: 'PPD, PTD, and wage loss benefits',
    Icon: HardHat,
  },
  {
    id: 'other',
    kicker: 'Other injury',
    chooser: 'Another kind of injury',
    chooserDesc: 'Slip and fall, dog bite, or any other personal injury claim',
    href: '/pain-and-suffering-calculator/',
    title: 'Pain & Suffering Calculator',
    description: 'Estimate non-economic damages using the multiplier method or per diem method — the same formulas used by insurance adjusters and plaintiff attorneys.',
    stats: 'Multiplier (1.5×–5×) + Per Diem methods',
    Icon: HeartPulse,
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

const latestPosts = getLatestBlogPosts(6)

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

        {/* ── HERO BAND: H1 + promise (left) · "What happened?" chooser (right) ── */}
        <section className="hero-band" aria-labelledby="home-heading">
          <div className="container-page section">
            <div className="hero-grid">
              <div>
                <p className="eyebrow mb-4">Free · No signup · Works for any US state</p>
                <h1 id="home-heading">
                  Know what your injury claim is really worth
                </h1>
                <p className="lede mt-5 max-w-2xl">
                  Get a calm, straightforward estimate of your settlement in minutes, using the same formulas insurance adjusters and plaintiff attorneys use. No pressure, no spam.
                </p>
                <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3" aria-label="What to expect">
                  {TRUST_BADGES.map((badge) => (
                    <li key={badge} className="flex items-center gap-2.5" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>
                      <span className="inline-flex items-center justify-center flex-shrink-0 rounded-full" style={{ width: 24, height: 24, background: 'var(--money-tint)', color: 'var(--money-deep)' }}>
                        <Check aria-hidden="true" size={14} strokeWidth={3} />
                      </span>
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chooser" aria-labelledby="chooser-heading">
                <h2 id="chooser-heading" className="heading-display" style={{ fontSize: 26, marginBottom: 6 }}>What happened?</h2>
                <p className="mb-5" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>Pick the closest match. You can switch calculators at any time.</p>
                <div className="flex flex-col gap-3">
                  {CHOICES.map(({ id, href, chooser, chooserDesc, Icon }) => (
                    <Link key={id} href={href} className="chooser-option">
                      <span className="icon-tile">
                        <Icon aria-hidden="true" size={26} strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className="chooser-title">{chooser}</span>
                        <span className="chooser-desc">{chooserDesc}</span>
                      </span>
                      <ArrowRight aria-hidden="true" size={22} strokeWidth={2.2} className="chooser-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THREE TOOL CARDS ── */}
        <section className="container-page section" aria-labelledby="tools-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="eyebrow mb-2">Free calculators</p>
              <h2 id="tools-heading">Three calculators, one transparent method</h2>
            </div>
            <Link href="/methodology/" className="text-link font-semibold whitespace-nowrap" style={{ fontSize: 'var(--label)' }}>See how the math works →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CHOICES.map(({ id, href, kicker, title, description, stats, Icon }) => (
              <Link key={id} href={href} className="tool-card card-hover">
                <span className="icon-tile">
                  <Icon aria-hidden="true" size={26} strokeWidth={2} />
                </span>
                <span className="choice-kicker">{kicker}</span>
                <span className="choice-title">{title}</span>
                <span className="choice-desc">{description}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 'var(--caption)' }}>{stats}</span>
                <span className="choice-cta">
                  Start the calculator
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── WHICH CALCULATOR SHOULD YOU USE ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="which-heading">
          <div className="editorial mx-auto">
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

        {/* ── MAX BENEFITS TABLE HIGHLIGHT ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="benefits-heading">
          <div className="card card-pad flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between" style={{ background: 'var(--primary-tint)', borderColor: 'var(--primary-line)' }}>
            <div className="flex items-start gap-5">
              <span className="icon-tile hidden sm:inline-flex" style={{ background: 'var(--surface)' }}>
                <Landmark aria-hidden="true" size={26} strokeWidth={2} />
              </span>
              <div>
                <p className="eyebrow mb-2">Reference table</p>
                <h2 id="benefits-heading" className="heading-display mb-3" style={{ fontSize: 30 }}>
                  Know Your State&rsquo;s Maximum Weekly Benefit
                </h2>
                <p className="leading-relaxed max-w-2xl" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>
                  Every state caps workers&rsquo; comp benefits at a maximum weekly rate, no matter how high your wages were. We sourced the current max and min weekly TTD rate for all 50 states and DC directly from each state&rsquo;s own agency &mdash; see the full table, methodology, and downloadable CSV.
                </p>
              </div>
            </div>
            <Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="btn-primary whitespace-nowrap flex-shrink-0">
              View the full table
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
            </Link>
          </div>
        </section>

        {/* ── HOW IT WORKS — three steps, big numerals ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="how-heading">
          <div className="card card-pad">
            <p className="eyebrow mb-2">How it works</p>
            <h2 id="how-heading" className="heading-display mb-8" style={{ fontSize: 32 }}>
              How Settlement Estimates Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <span className="step-numeral" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-body font-bold" style={{ fontSize: 20 }}>
                    <span className="sr-only">Step {i + 1}: </span>{item.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 pt-6 flex items-start gap-3" style={{ color: 'var(--ink-2)', borderTop: '1px solid var(--line)', fontSize: 'var(--label)' }}>
              <FileText aria-hidden="true" size={20} strokeWidth={2} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
              <span>
                Every formula, source, and review date behind these numbers is disclosed on our{' '}
                <Link href="/methodology/" className="text-link">methodology page</Link>
                . We don&rsquo;t use a black-box score &mdash; you can see exactly how each figure is calculated and where the legal figures come from.
              </span>
            </p>
          </div>
        </section>

        {/* ── STATE GUIDES ── */}
        <section className="container-page pb-12 sm:pb-16" aria-labelledby="states-heading">
          <div className="flex items-start gap-4 mb-7">
            <span className="icon-tile hidden sm:inline-flex">
              <MapPin aria-hidden="true" size={26} strokeWidth={2} />
            </span>
            <div>
              <h2 id="states-heading" className="heading-display mb-2" style={{ fontSize: 32 }}>
                State-Specific Guides
              </h2>
              <p className="max-w-2xl leading-relaxed" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>
                Fault rules, damage caps, and benefit schedules vary by state. These pages account for local law on top of the general formula.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card-flat card-pad">
              <h3 className="font-body font-bold mb-3" style={{ fontSize: 18 }}>Pain &amp; Suffering</h3>
              <ul className="flex flex-col">
                {painSufferingStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="text-link inline-block py-1.5" style={{ fontSize: 'var(--label)' }}>{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/pain-and-suffering-calculator/" className="inline-flex items-center gap-1.5 mt-4 font-semibold" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>
                See all {ALL_STATES.length} states <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
              </Link>
            </div>

            <div className="card-flat card-pad">
              <h3 className="font-body font-bold mb-3" style={{ fontSize: 18 }}>Car Accident</h3>
              <ul className="flex flex-col">
                {carAccidentStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/car-accident-settlement-calculator/${state.slug}/`} className="text-link inline-block py-1.5" style={{ fontSize: 'var(--label)' }}>{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/car-accident-settlement-calculator/" className="inline-flex items-center gap-1.5 mt-4 font-semibold" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>
                See all {CAR_ACCIDENT_STATES.length} states <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
              </Link>
            </div>

            <div className="card-flat card-pad">
              <h3 className="font-body font-bold mb-3" style={{ fontSize: 18 }}>Workers Comp</h3>
              <ul className="flex flex-col">
                {workersCompStates.map((state) => (
                  <li key={state.slug}>
                    <Link href={`/workers-comp-settlement-calculator/${state.slug}/`} className="text-link inline-block py-1.5" style={{ fontSize: 'var(--label)' }}>{state.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/workers-comp-settlement-calculator/" className="inline-flex items-center gap-1.5 mt-4 font-semibold" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>
                See all indexed states <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── LATEST GUIDES ── */}
        {latestPosts.length > 0 && (
          <section className="container-page pb-16 sm:pb-24" aria-labelledby="blog-heading">
            <div className="flex items-baseline justify-between gap-4 mb-7">
              <h2 id="blog-heading" className="heading-display" style={{ fontSize: 32 }}>
                Latest Guides
              </h2>
              <Link href="/blog/" className="text-link font-semibold whitespace-nowrap" style={{ fontSize: 'var(--label)' }}>All guides →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={post.slug} className="card card-pad card-hover flex flex-col" style={{ textDecoration: 'none' }}>
                  <time dateTime={post.publishDate} className="eyebrow">
                    {getPostDisplayDate(post)}
                  </time>
                  <h3 className="heading-display mt-3" style={{ fontSize: 22 }}>
                    {post.title}
                  </h3>
                  <p className="mt-3 leading-relaxed" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-auto pt-4 font-semibold" style={{ color: 'var(--primary)', fontSize: 'var(--label)' }}>
                    Read the guide <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  )
}
