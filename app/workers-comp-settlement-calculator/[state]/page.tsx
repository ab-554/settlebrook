// ─────────────────────────────────────────────────────────────────────────────
// app/workers-comp-settlement-calculator/[state]/page.tsx
// Tool #3 — dynamic state pages for the Workers Comp Settlement Calculator.
// Structure mirrors car-accident-settlement-calculator/[state]/page.tsx:
//   • generateStaticParams → getAllWorkersCompStateSlugs()
//   • generateMetadata    → state-specific title, description, OG, Twitter
//   • Three JSON-LD schemas: WebApplication (with areaServed), FAQPage,
//     BreadcrumbList (3-level: Home → tool root → state page)
//   • Hero header: H1 with state name, badge row, BreadcrumbNav
//   • Two-column layout: state law callout + WorkersCompCalculator left,
//     sidebar right (guide CTA + other state links)
//   • State-specific editorial articles for CA, TX, FL (Tier 1 launch states)
//   • Generic template article for all other states (Tier 2/3 rollout)
//   • FAQ accordion — using WORKERS_COMP_FAQS
//   • DisclaimerBanner footer variant
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkersCompCalculator from '@/components/calculator/WorkersCompCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import WorkedExampleWorkersComp from '@/components/seo/WorkedExampleWorkersComp'
import SourcesSection from '@/components/seo/SourcesSection'
import StatePPDSection from '@/components/calculator/StatePPDSection'
import {
  getWorkersCompStateBySlug,
  getAllWorkersCompStateSlugs,
  WORKERS_COMP_STATES,
  NOINDEXED_WORKERS_COMP_SLUGS,
  NON_GENERIC_PPD_SLUGS,
} from '@/lib/data/workersCompStates'
import { getWorkersCompFaqsForState, buildWorkersCompFAQSchema } from '@/lib/data/workersCompFaqs'
import sourcesData from '@/lib/data/sources.json'
import type { ScheduledLossStateSlug } from '@/lib/data/ppdSchedules2026'

// States with a real state-specific PPD module (StatePPDSection) instead of
// the generic AMA-schedule calculator's estimate. Georgia is included even
// though it isn't in NON_GENERIC_PPD_SLUGS (Georgia's generic AMA-schedule
// estimate isn't "wrong" the way MI/MN/NJ/VA's is, but Georgia has its own
// real statutory schedule now — see PPD-MODULE-SPEC.md item 8). Colorado
// added 2026-09-25 per PPD-SPEC-ADDENDUM-COLORADO.md — its generic PPD
// output applied a wage-based rate that's wrong for Colorado's flat
// statutory scheduled-loss rate.
const PPD_MODULE_SLUGS = new Set<ScheduledLossStateSlug | 'minnesota'>([
  'michigan', 'minnesota', 'new-jersey', 'virginia', 'georgia', 'colorado',
])

// Sprint C1 (2026-09-25) per-state metadata overrides — title/description
// pulled verbatim from each draft's frontmatter in
// research/2026-09-24/wc-states/<state>.md. States not listed here keep the
// generic template built in generateMetadata() below.
const STATE_METADATA: Partial<Record<string, { title: string; description: string }>> = {
  georgia: {
    title: "Georgia Workers' Comp Settlement Guide (2026)",
    description:
      "How Georgia workers' comp settlements work in 2026: TTD/PPD rates, the 400-week cap, deadlines, and a worked settlement example. Sourced to Georgia law.",
  },
  michigan: {
    title: "Michigan Workers' Comp Settlement Calculator 2026",
    description:
      'Estimate Michigan workers\' comp settlements: 2026 weekly rates, PPD schedule, redemption process, deadlines, and a worked example.',
  },
  'new-jersey': {
    title: "NJ Workers' Comp Settlement Calculator (2026)",
    description:
      "Estimate NJ workers' comp settlements: 2026 TTD rates, the state's PPD weeks schedule, deadlines, and a worked example.",
  },
  virginia: {
    title: "Virginia Workers' Comp Settlement Calculator",
    description:
      "See Virginia's 2026 workers' comp weekly rates, PPD schedule, deadlines, and settlement rules — then estimate your case below.",
  },
  colorado: {
    title: "Colorado Workers' Comp Settlement Calculator",
    description:
      "Colorado workers' comp guide: 2026 TTD/PPD rates, the state's schedule vs. whole-person PPD rules, settlement steps, deadlines, and a worked example.",
  },
  minnesota: {
    title: "Minnesota Workers' Comp Benefits & Settlement Guide",
    description:
      "How Minnesota calculates workers' comp weekly benefits, PPD payouts, and settlements in 2026, with a worked example and official sources.",
  },
}

// E-E-A-T review stamp. Bump this one string when state law is re-verified
// - it stamps every state page generated from this template.
// Updated 2026-09-24: legal accuracy sprint touched every state's content.
const LAST_REVIEWED = 'September 2026'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllWorkersCompStateSlugs()
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  // Next.js 15: dynamic route params are now async (Promise-wrapped).
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const stateData = getWorkersCompStateBySlug(state)
  if (!stateData) return { title: 'Page Not Found', robots: { index: false, follow: false } }

  const canonicalUrl = `/workers-comp-settlement-calculator/${stateData.slug}/`

  const stateMetadata = STATE_METADATA[stateData.slug]

  // Title: "[State] Workers Comp Settlement Calculator — Free Tool", unless
  // Sprint C1 gave this state its own draft title/description.
  const pageTitle = stateMetadata?.title ?? `${stateData.name} Workers Comp Settlement Calculator — Free Tool`

  // State-specific description (~155 chars)
  const description =
    stateMetadata?.description ??
    `Free ${stateData.name} workers compensation settlement calculator. Estimate TTD and PPD benefits under ${stateData.name} law. Enter weekly wages for an instant estimate.`.slice(0, 155)

  return {
    title: pageTitle,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${pageTitle} | Settlebrook`,
      description,
      url: canonicalUrl,
      siteName: 'Settlebrook',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${stateData.name} Workers Comp Settlement Calculator — Settlebrook`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@settlebrook',
      title: `${pageTitle} | Settlebrook`,
      description,
      images: ['/og-image.png'],
    },
    // Tier 3 stub states are noindexed until they get real state-specific
    // editorial content — see NOINDEXED_WORKERS_COMP_SLUGS in workersCompStates.ts.
    robots: NOINDEXED_WORKERS_COMP_SLUGS.has(stateData.slug)
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

// ─── Reusable sidebar card (glassmorphism) ─────────────────────────────────────

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(99,179,237,0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function StateWorkersCompPage({ params }: { params: Promise<{ state: string }> }) {
  // Next.js 15: params must be awaited before use.
  const { state } = await params
  const stateData = getWorkersCompStateBySlug(state)
  if (!stateData) notFound()

  const stateSources =
    (sourcesData['workers-comp'] as Record<string, { label: string; url: string; supports: string; tier: 'primary' | 'secondary' }[]>)[stateData.slug] ?? []

  const canonicalUrl = `/workers-comp-settlement-calculator/${stateData.slug}/`

  // ── JSON-LD schemas ──

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${stateData.name} Workers Comp Settlement Calculator`,
    url: canonicalUrl,
    description: `Free ${stateData.name} workers compensation settlement calculator. Estimate TTD and PPD benefits under ${stateData.name} law.`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    areaServed: {
      '@type': 'State',
      name: stateData.name,
      containedInPlace: { '@type': 'Country', name: 'United States' },
    },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Settlebrook', url: 'https://www.settlebrook.com' },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.settlebrook.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Workers Comp Settlement Calculator',
        item: 'https://www.settlebrook.com/workers-comp-settlement-calculator/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${stateData.name} Workers Comp Settlement Calculator`,
        item: canonicalUrl,
      },
    ],
  }

  const activeFaqs = getWorkersCompFaqsForState(stateData.slug)
  const faqSchema = buildWorkersCompFAQSchema(activeFaqs)

  // Tier-1 launch state link list — CA, TX, and FL (excluding current state)
  const tier1States = WORKERS_COMP_STATES.filter(
    (s) => (s.slug === 'california' || s.slug === 'texas' || s.slug === 'florida') && s.slug !== stateData.slug,
  )

  return (
    <>
      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER / HERO ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Workers Comp Settlement Calculator', href: '/workers-comp-settlement-calculator/' },
              { label: stateData.name, href: `/workers-comp-settlement-calculator/${stateData.slug}/` },
            ]} />
            <div className="mt-4">
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.02em' }}
              >
                {stateData.name} Workers Comp Settlement Calculator
              </h1>
              <p className="mt-3 text-sm" style={{ color: '#94A3B8' }}>
                Last reviewed: {LAST_REVIEWED} · Settlebrook Editorial ·{' '}
                <Link href="/methodology/" className="underline transition-colors" style={{ color: '#60A5FA' }}>
                  How we verify
                </Link>
              </p>
              <p className="mt-3 text-base leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your {stateData.name} workers compensation benefits. Covers Temporary Total Disability (TTD), Permanent Partial Disability (PPD), and Permanent Total Disability (PTD) benefits based on 2026 laws.
              </p>
            </div>
            {/* State law badge row */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="state-badge state-badge-green">
                {(stateData.benefitRate * 100).toFixed(1)}% Benefit Rate
              </span>
              <span className="state-badge state-badge-muted">
                ${stateData.weeklyCapAmount.toLocaleString()}/wk Cap ({stateData.weeklyCapEffectivePeriod})
              </span>
              <span className="state-badge state-badge-blue">
                {NON_GENERIC_PPD_SLUGS.has(stateData.slug)
                  ? `${stateData.name}'s Own PPD Schedule`
                  : stateData.ppdMethod === 'ama_schedule' ? 'AMA Scheduled Weeks' : 'Percentage of Person'}
              </span>
              <span className="state-badge state-badge-muted">
                {Number.isFinite(stateData.maxWeeksTTD)
                  ? `Max TTD: ${stateData.maxWeeksTTD} Weeks`
                  : 'Max TTD: No Fixed Limit'}
              </span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">

          {/* Texas non-subscriber warning box */}
          {stateData.hasNonSubscriberSystem && (
            <div
              className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.28)' }}
            >
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <p className="text-sm leading-relaxed" style={{ color: '#FBBF24' }}>
                <strong>Texas Non-Subscriber Notice:</strong> Texas does not require private employers to carry workers comp. If your employer is a non-subscriber, you may have a personal injury claim instead. In this scenario, you can sue your employer for negligence in civil court for full damages (including pain and suffering). If this applies to you, use our <Link href="/pain-and-suffering-calculator/" className="underline font-semibold hover:opacity-80" style={{ color: '#FBBF24' }}>Pain &amp; Suffering Calculator</Link> instead.
              </p>
            </div>
          )}

          {/* Illinois percentage of person info box */}
          {stateData.ppdMethod === 'percentage_of_person' && (
            <div
              className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
              style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.28)' }}
            >
              <span style={{ fontSize: '18px' }}>ℹ️</span>
              <p className="text-sm leading-relaxed" style={{ color: '#60A5FA' }}>
                <strong>PPD Method Notice:</strong> {stateData.name} calculates Permanent Partial Disability (PPD) benefits using a percentage-of-person method (relying on whole-body impairment) rather than a rigid body-part scheduled weeks table. Your benefit is determined as: <em>Weekly Benefit × 500 Weeks × Impairment %</em>.
              </p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: Calculator */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>
              <WorkersCompCalculator
                stateSlug={stateData.slug}
                stateName={stateData.name}
              />
            </div>

            {/* Sidebar Column */}
            <aside aria-label="Related state information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              {/* Guide CTA */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  How Are {stateData.name} Workers&apos; Comp Settlements Calculated?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Learn how AWW, state rates, impairment ratings, and benefit caps determine your settlement value under {stateData.name} rules.
                </p>
                <Link
                  href="/pain-and-suffering-calculator/guide/"
                  style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}
                >
                  Read the Complete Guide →
                </Link>
              </div>

              {/* Max weekly benefits reference table */}
              <nav aria-label="Workers comp benefit rate reference">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                    Benefit Rate Reference
                  </h2>
                  <Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="flex flex-col gap-0.5 group">
                    <span className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                      Max Weekly Benefits by State (2026)
                    </span>
                    <span className="text-xs" style={{ color: '#475569' }}>See {stateData.name}&apos;s official max/min TTD rate alongside every other state</span>
                  </Link>
                </SideCard>
              </nav>

              {/* Other state calculators — CA, TX, FL (excluding current) */}
              {tier1States.length > 0 && (
                <nav aria-label="Other state workers comp calculators">
                  <SideCard>
                    <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                      Other State Calculators
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {tier1States.map((state) => (
                        <li key={state.slug}>
                          <Link
                            href={`/workers-comp-settlement-calculator/${state.slug}/`}
                            className="text-sm transition-colors hover:opacity-80"
                            style={{ color: '#60A5FA' }}
                          >
                            {state.name} Workers Comp Calculator
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
                        <Link
                          href="/workers-comp-settlement-calculator/"
                          className="text-xs transition-colors hover:opacity-80"
                          style={{ color: '#94A3B8' }}
                        >
                          ← All states calculator
                        </Link>
                      </li>
                    </ul>
                  </SideCard>
                </nav>
              )}

              {/* Other calculators */}
              <nav aria-label="Other settlement calculators">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Other Calculators</h2>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <Link
                        href="/pain-and-suffering-calculator/"
                        className="text-sm hover:opacity-80 transition-colors"
                        style={{ color: '#60A5FA' }}
                      >
                        Pain &amp; Suffering Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/car-accident-settlement-calculator/"
                        className="text-sm hover:opacity-80 transition-colors"
                        style={{ color: '#60A5FA' }}
                      >
                        Car Accident Calculator
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>

            </aside>
          </div>

          {/* ── STATE-SPECIFIC EDITORIAL CONTENT ── */}
          {stateData.slug === 'california' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Introduction ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Introduction
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You were doing your job, suffered a serious injury, and now you are stuck dealing with insurance adjusters, confusing paperwork from the Division of Workers&apos; Compensation (DWC), and mounting household bills. Trying to figure out what your workplace accident is actually worth should not feel like learning a foreign language. Whether you suffered a herniated disc lifting heavy cargo in a Los Angeles warehouse or sustained repetitive stress injuries at a tech desk in San Jose, understanding the financial value of your claim is your critical first step toward protecting your family. The California workers&apos; compensation system is notoriously complex, filled with rigid statutory formulas and strict filing deadlines that favor prepared insurance companies. This comprehensive guide breaks down the exact legal mechanics and wage calculations used across the state. You can also plug your specific earnings and injury details directly into our interactive workers comp settlement calculator to get an immediate baseline estimate of your potential financial recovery.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How California Workers Comp Benefits Work ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How California Workers&apos; Comp Benefits Work
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Unlike standard civil personal injury lawsuits, California workers&apos; compensation operates as a strict no-fault legal system administered by the state Division of Workers&apos; Compensation (DWC), with disputed claims adjudicated before the Workers&apos; Compensation Appeals Board (WCAB). You do not need to prove your employer was negligent or reckless to receive financial support. In exchange for this absolute no-fault protection, state law significantly restricts the categories of monetary damages you can claim. Your financial indemnity is broken down into three primary streams: Temporary Total Disability (TTD) to replace lost paychecks during active recovery, Permanent Partial Disability (PPD) to compensate you for lasting physical impairment, and Permanent Total Disability (PTD) for catastrophic, career-ending trauma.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In addition to regular wage replacement checks, the system guarantees 100% coverage for all authorized medical care without deductibles or co-pays, alongside a $6,000 Supplemental Job Displacement Benefit voucher for educational retraining if your injury prevents you from returning to your former occupation. One critical limitation that shocks many injured employees is that California workers&apos; compensation strictly prohibits financial recovery for physical pain, emotional trauma, or diminished enjoyment of life. If you want to understand how standard civil claims outside the workplace evaluate human loss, our{' '}
                <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>
                {' '}illustrates how traditional tort damages differ from administrative workers&apos; compensation awards.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── California TTD Benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California TTD Benefits — Temporary Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When an authorized treating physician places you completely off work to heal, Temporary Total Disability (TTD) benefits step in to keep your household afloat. Under California Labor Code formulas, your weekly tax-free check equals exactly 66.67% (two-thirds) of your pre-tax Average Weekly Wage (AWW). Your baseline AWW is established by calculating your total gross earnings during the exact 52 weeks immediately preceding your injury date, which includes overtime pay, production bonuses, shift differentials, and verifiable wages from second jobs.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To maintain economic balance, the California Department of Industrial Relations enforces statutory income floors and ceilings. For workplace injuries occurring in 2026, your weekly TTD benefit is strictly capped at a maximum of <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()} per week</strong> ({stateData.weeklyCapEffectivePeriod}). Consider a real dollar example: if you earned $1,800 per week as a union ironworker before shattering your ankle, two-thirds of your wage equals $1,200. Because this amount falls below the state threshold, you will receive $1,200 every week. However, if you earned $3,000 per week as a specialized commercial pilot, two-thirds of your wage equals $2,000. Because this calculated figure exceeds the statutory ceiling, your actual payments will be restricted to the ${stateData.weeklyCapAmount.toLocaleString()} weekly cap. Under state law, TTD payments are legally restricted to a maximum duration of <strong style={{ color: '#E2E8F0' }}>104 weeks within a five-year window</strong> from your injury date.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', fontSize: '14px' }}>
                <em>Certain severe injuries — including acute and chronic hepatitis B or C, amputations, severe burns, HIV, high-velocity eye injuries, chronic lung disease, and pulmonary or heart disease — extend that limit up to 240 weeks (Lab. Code § 4656(c)).</em>
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── California PPD Benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California PPD Benefits — Permanent Partial Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once your treating physician determines your physical condition has stabilized and reached Maximum Medical Improvement (MMI), your temporary disability checks permanently cease. If your workplace accident leaves you with lingering physical or mental deficits, your claim transitions to Permanent Partial Disability (PPD). This specific phase represents the single most important component driving your ultimate settlement payout.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your permanent disability assessment begins with a comprehensive forensic medical evaluation. Either your primary treating doctor, a Qualified Medical Evaluator (QME) assigned by the state medical unit, or an Agreed Medical Evaluator (AME) jointly selected by both legal teams will examine your injuries. The evaluator measures your physical loss using the strict standards of the <strong style={{ color: '#E2E8F0' }}>American Medical Association (AMA) Guides to the Evaluation of Permanent Impairment, 5th Edition</strong>. This detailed medical report translates your physical damage into a raw Whole Person Impairment (WPI) score.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The state of California does not pay settlements based on raw WPI percentages. Instead, your medical score is processed through the state&apos;s <strong style={{ color: '#E2E8F0' }}>Permanent Disability Rating Schedule (PDRS)</strong>. This statutory formula modifies your raw rating based on the exact anatomical body part injured, your age on the date of the accident, and your specific occupational classification. A 55-year-old roof framing contractor with a severe lumbar spine injury receives a substantially higher final disability rating than a 25-year-old accountant with the exact same spinal impairment, because manual heavy construction demands intense physical capacity. Each final percentage point of permanent disability corresponds to a fixed number of benefit weeks set by law, paying between $160 and $290 per week depending on the severity of your rating.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Compromise and Release vs Stipulated Award ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Compromise and Release vs Stipulated Award
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you reach the stage of resolving your claim before a WCAB administrative law judge, you face a pivotal fork in the road. You must decide between two completely different legal settlement structures: a Compromise and Release or a Stipulated Findings and Award.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A <strong style={{ color: '#E2E8F0' }}>Compromise and Release (C&amp;R)</strong> is the most widely utilized settlement contract. In a C&amp;R agreement, the workers&apos; compensation insurance company issues you a single lump-sum check. In exchange for this immediate cash transfer, you agree to close your workers&apos; compensation claim forever. This means you surrender your legal right to have the insurance company pay for any future surgeries, physical therapy sessions, or prescription medications related to that injury. Insurance adjusters aggressively push for this structure because it permanently eliminates their financial exposure, while injured workers frequently choose it because it provides immediate liquid capital and total independence from restrictive medical networks.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A <strong style={{ color: '#E2E8F0' }}>Stipulated Findings and Award (Stip)</strong> functions under a completely different framework. Under a Stipulated Award, the judge signs a binding order agreeing on your exact permanent disability percentage. The insurance company pays out your permanent disability indemnity over time in bi-weekly checks rather than one lump sum. Crucially, a Stipulated Award keeps your legal right to future medical care wide open for life. If your orthopedic surgeon concludes four years down the road that your industrial knee injury requires a complete joint replacement, the insurance carrier remains legally bound to pay the entire surgical bill.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Factors That Affect Settlements ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Factors That Affect California Workers&apos; Comp Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Several distinct variables dictate whether an insurance carrier offers you $15,000 or $150,000 to resolve your case. Beyond your official PDRS disability rating percentage, the projected cost of your future medical care is the primary negotiating lever in lump-sum contracts. If a QME physician concludes you will require lifetime pain management, joint injections, and future spinal fusion surgery, the estimated present cash value of that lifelong medical care is calculated and added directly onto a Compromise and Release offer.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Another massive financial factor is <strong style={{ color: '#E2E8F0' }}>third-party liability</strong>. While workers&apos; compensation statutes legally bar you from suing your direct employer, you retain the absolute right to file a traditional civil lawsuit against negligent third parties who caused your accident. If you were driving a company van and got rear-ended by a distracted corporate delivery driver, or tripped over unprotected wiring left by an outside sub-contractor on a construction site, you can pursue simultaneous claims. Third-party civil lawsuits allow you to recover full emotional damages and 100% of your lost wages. You can review{' '}
                <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated in civil courts</Link>
                {' '}to see why pursuing both legal tracks is vital to maximizing your household&apos;s total recovery.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Statute of Limitations ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California Workers&apos; Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Navigating the California workers&apos; compensation claims process requires rigid adherence to statutory clocks. Missing a filing deadline will permanently forfeit your legal right to monetary benefits and medical care, regardless of how devastating your physical injuries might be. Under <strong style={{ color: '#E2E8F0' }}>California Labor Code Section 5400</strong>, you must formally notify your employer of your job-related injury within <strong style={{ color: '#E2E8F0' }}>30 days</strong> of the incident. Furthermore, you have exactly <strong style={{ color: '#E2E8F0' }}>one year</strong> from the date of your accident to officially submit a Workers&apos; Compensation Claim Form (DWC 1) to your employer to initiate the formal adjudication process.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If the insurance company has been voluntarily paying your medical bills or issuing temporary wage checks without a formal court order, you generally have <strong style={{ color: '#E2E8F0' }}>five years</strong> from the original date of injury to formally resolve your claim or file an Application for Adjudication of Claim to request a trial before a WCAB judge. Additionally, California enforces powerful anti-retaliation protections under <strong style={{ color: '#E2E8F0' }}>Labor Code Section 132a</strong>. It is strictly illegal for your employer to terminate, demote, or harass you simply for exercising your legal right to file a workers&apos; compensation claim.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              {/* ── FAQ ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-ca-faq-1',
                  question: 'How is workers comp calculated in California?',
                  answer: 'California workers\u2019 compensation is calculated by combining two distinct indemnity streams: temporary lost wage payments and permanent disability ratings. Temporary disability pays two-thirds of your average weekly earnings over the prior 52 weeks, subject to statutory maximums. Permanent partial disability is calculated by taking your doctor\u2019s medical impairment rating and running it through the state rating schedule, which assigns a specific dollar value based on your age, pre-injury earnings, and diminished future earning capacity.',
                  schemaAnswer: 'California workers\u2019 compensation is calculated by combining two distinct indemnity streams: temporary lost wage payments and permanent disability ratings. Temporary disability pays two-thirds of your average weekly earnings over the prior 52 weeks, subject to statutory maximums. Permanent partial disability is calculated by taking your doctor\u2019s medical impairment rating and running it through the state rating schedule, which assigns a specific dollar value based on your age, pre-injury earnings, and diminished future earning capacity.',
                },
                {
                  id: 'wc-ca-faq-2',
                  question: 'What is the maximum workers comp settlement in California?',
                  answer: `There is no statutory maximum dollar cap on a total workers\u2019 compensation settlement in California. While temporary disability weekly paychecks are strictly capped at $${stateData.weeklyCapAmount.toLocaleString()} per week (${stateData.weeklyCapEffectivePeriod}), overall settlement values depend entirely on your final permanent disability rating percentage and the projected lifetime cost of your medical care. Workers who suffer 100% total permanent disability qualify for lifetime bi-weekly pension payments that can accumulate to well over $1 million.`,
                  schemaAnswer: `There is no statutory maximum dollar cap on a total workers\u2019 compensation settlement in California. Temporary disability weekly paychecks are capped at $${stateData.weeklyCapAmount.toLocaleString()} per week (${stateData.weeklyCapEffectivePeriod}). Overall settlement values depend on your permanent disability rating and projected lifetime medical costs.`,
                },
                {
                  id: 'wc-ca-faq-3',
                  question: 'How long does California workers comp last?',
                  answer: 'Active wage replacement under Temporary Total Disability is strictly limited by California Labor Code to a cumulative maximum of 104 weeks within a five-year window from your injury date (up to 240 weeks for certain severe injuries under Lab. Code \u00a7 4656(c), including chronic hepatitis, amputations, severe burns, HIV, and heart or pulmonary disease). However, medical coverage for approved job injuries can last for the remainder of your life if you resolve your claim via a Stipulated Award. If you elect a Compromise and Release settlement, all workers\u2019 compensation benefits terminate immediately upon cashing your lump-sum check.',
                  schemaAnswer: 'Active wage replacement under Temporary Total Disability is strictly limited by California Labor Code to a cumulative maximum of 104 weeks within a five-year window from your injury date (up to 240 weeks for certain severe injuries under Lab. Code \u00a7 4656(c)). However, medical coverage for approved job injuries can last for the remainder of your life if you resolve your claim via a Stipulated Award. If you elect a Compromise and Release settlement, all workers\u2019 compensation benefits terminate immediately upon cashing your lump-sum check.',
                },
                {
                  id: 'wc-ca-faq-4',
                  question: 'What is a Compromise and Release in California?',
                  answer: 'A Compromise and Release is a binding legal settlement agreement where an injured worker agrees to permanently close their workers\u2019 compensation claim in exchange for a single lump-sum cash payment. By signing this legal contract, you release the employer and their insurance company from any future liability, meaning you assume full personal financial responsibility for paying for all future medical care related to your workplace injury.',
                  schemaAnswer: 'A Compromise and Release is a binding legal settlement agreement where an injured worker agrees to permanently close their workers\u2019 compensation claim in exchange for a single lump-sum cash payment. By signing this legal contract, you release the employer and their insurance company from any future liability, meaning you assume full personal financial responsibility for paying for all future medical care related to your workplace injury.',
                },
                {
                  id: 'wc-ca-faq-5',
                  question: 'How are permanent disability ratings calculated in California?',
                  answer: 'Permanent disability ratings are calculated by taking a raw Whole Person Impairment percentage assigned by a Qualified Medical Evaluator or Agreed Medical Evaluator under the AMA Guides 5th Edition. This raw medical score is entered into the California Permanent Disability Rating Schedule. The statutory formula applies specific mathematical adjustment multipliers based on the exact anatomical body part injured, your age at the time of injury, and your specific Department of Labor occupational code.',
                  schemaAnswer: 'Permanent disability ratings are calculated by taking a raw Whole Person Impairment percentage assigned by a Qualified Medical Evaluator or Agreed Medical Evaluator under the AMA Guides 5th Edition. This raw medical score is entered into the California Permanent Disability Rating Schedule. The statutory formula applies specific mathematical adjustment multipliers based on the exact anatomical body part injured, your age at the time of injury, and your specific Department of Labor occupational code.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── CTA ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Get Your California Workers&apos; Comp Estimate Now
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Insurance carriers employ dedicated teams of adjusters and defense attorneys whose sole professional objective is to minimize your financial recovery. You do not have to navigate this hostile administrative bureaucracy on your own. Take control of your financial future right now by utilizing our free{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}to estimate the baseline legal value of your wage loss and permanent impairment. If you are struggling with denied medical treatment requests, lowball settlement offers, or disputed medical evaluator ratings, connect with an experienced California workers&apos; compensation attorney today to protect your rights and demand the maximum financial compensation you deserve.
              </p>

            </article>
          ) : stateData.slug === 'texas' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Introduction ── */}
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                Imagine you are working a shift on a Dallas loading dock. A defective pallet snaps, dropping six hundred pounds of industrial supplies onto your shoulder. You hear the bone crunch, and within hours, an orthopedic surgeon is explaining that you need a complex rotator cuff reconstruction. Suddenly, you are staring down $65,000 in hospital bills and facing six months of zero income. The human resources manager hands you a stack of paperwork and tells you that the company will &quot;take care of it.&quot;
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you just sign whatever the insurance adjuster puts in front of you, you are flying blind. You might be leaving tens of thousands of dollars on the table, or worse, signing away your right to file a massive civil lawsuit. Texas is completely unique when it comes to workplace injuries. We operate under a dual system that drastically changes the value of your case depending on one single piece of paper: whether your employer purchased official workers&apos; compensation insurance or opted out.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Before you accept any offer, you need to understand the exact statutory math that governs your payout. Running your numbers through a{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}is a smart first step, but to truly protect your financial future, you have to understand the hard rules of the Texas Labor Code.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How Texas Workers Comp Works ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Texas Workers&apos; Comp Works
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most crucial fact about the Texas system is that it is the ONLY state in the entire country where private employers are not legally required to carry workers&apos; compensation insurance. The Texas Department of Insurance oversees the Texas Division of Workers Compensation, which regulates this incredibly complex framework.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you get hurt on the job, your employer falls into one of two distinct categories. Employers who purchase state-approved insurance are called <strong style={{ color: '#E2E8F0' }}>subscribers</strong>. If you work for a subscriber, you are funneled into the traditional administrative system. Your medical bills are covered, and you receive formula-based wage replacement. However, you are entirely barred from suing your employer for negligence.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Employers who choose to opt out of this system are called <strong style={{ color: '#E2E8F0' }}>non-subscribers</strong>. If you work for a Texas non-subscriber employer, the entire playbook flips. You are no longer trapped by the administrative caps of the state system, and you gain the powerful right to drag your employer into civil court.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Texas TTD Benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Texas TTD Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your employer is a subscriber, your immediate financial lifeline is Temporary Income Benefits, commonly referred to as TTD (Temporary Total Disability). These benefits kick in when your injury forces you to miss more than seven days of work.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The state strictly limits what you can recover. Your TTD benefit rate is <strong style={{ color: '#E2E8F0' }}>70 percent</strong> of your Average Weekly Wage (AWW) for the first 26 weeks of your disability. If your lost wages extend beyond that six-month mark, your benefit shifts to 75 percent of your spendable income.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let&apos;s put concrete math to this statute. Suppose you are an electrician earning $1,400 a week. For the first 26 weeks of your recovery, the insurance company will pay you 70 percent of that wage, which equals <strong style={{ color: '#FBBF24' }}>$980 per week</strong>. You must also factor in the state-mandated caps. For the current period ({stateData.weeklyCapEffectivePeriod}), the maximum weekly benefit is <strong style={{ color: '#FBBF24' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong>. Because your $980 calculation falls below the maximum cap, you receive your full calculated rate. If you were earning $2,000 a week, your 70 percent calculation would be $1,400, but the insurance company would legally cap your checks at exactly ${stateData.weeklyCapAmount.toLocaleString()} per week.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Impairment Income Benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Impairment Income Benefits (IIBs)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most important phase of a subscriber claim begins when your treating physician determines that your condition is as good as it is going to get. This milestone is legally defined as Texas Maximum Medical Improvement (MMI). Reaching MMI triggers the permanent disability phase of your claim, shifting your payments from temporary wage replacement to Texas Impairment Income Benefits.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once you reach MMI, a certified doctor will evaluate your permanent physical damage using the AMA Guides to the Evaluation of Permanent Impairment. The doctor assigns you an impairment rating, represented as a strict percentage. This single number dictates the entire value of your Texas workers&apos; comp permanent disability settlement.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas law mandates that you receive exactly <strong style={{ color: '#E2E8F0' }}>three weeks</strong> of Texas IIB benefits for every single percentage point of your impairment rating. These benefits are paid at 70 percent of your Average Weekly Wage, strictly capped at ${stateData.weeklyCapAmount.toLocaleString()} per week ({stateData.weeklyCapEffectivePeriod}).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let&apos;s look at how a seemingly small rating translates into concrete settlement dollars. Imagine you suffered a severe back injury, and your pre-injury AWW was $1,500. Your IIB rate is 70 percent of your AWW, which equals <strong style={{ color: '#FBBF24' }}>$1,050 per week</strong>. After a spinal fusion surgery, the doctor assigns you a 15 percent impairment rating.
              </p>

              {/* IIB calculation table */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settlement Variable</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statutory Calculation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Impairment Rating</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>15 percent</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Duration Formula</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>3 weeks per percentage point</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Total Weeks Paid</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>45 weeks</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly IIB Rate</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$1,050</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Total IIB Payout</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$47,250</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In this scenario, the insurance company owes you a guaranteed <strong style={{ color: '#FBBF24' }}>$47,250</strong> for the permanent damage to your spine. If your injury is so severe that you cannot return to work even after your IIBs run out, you may qualify for Supplemental Income Benefits (SIBs) to cover ongoing wage loss. For the most catastrophic, life-altering injuries — such as paralysis or severe brain trauma — the state provides Lifetime Income Benefits (LIBs) to ensure you are never left destitute.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Non-Subscriber System ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Non-Subscriber System
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you discover that your company is a Texas workers&apos; comp non-subscriber, you are stepping into an entirely different legal arena. Many massive corporations, big-box retailers, and regional hospital networks choose to opt out of the state system to save on premium costs. While they often set up their own internal injury benefit plans, these plans do not provide the legal protections of the official state system.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because your employer opted out, they forfeit the legal shield that protects subscriber employers from lawsuits. You have the right to file a civil personal injury lawsuit directly against your company for negligence.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas Labor Code Section 406.033 makes this exceptionally dangerous for the employer. This statute actively strips the non-subscriber of their common law defenses. They cannot argue that you were partially responsible for your own injury, they cannot blame a coworker, and they cannot claim you assumed the risk of a dangerous job. If they are even one percent at fault for an unsafe working condition, they are fully liable for your damages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Most importantly, civil lawsuits allow you to recover damages that the DWC administrative system outright bans. Workers&apos; comp does NOT cover pain and suffering for subscribers. If you lose a limb in a subscriber factory, you get your medical bills paid and a formulaic IIB check. If you lose a limb in a non-subscriber factory, a jury can award you millions of dollars for the sheer physical agony and emotional devastation of the accident. Evaluating this massive difference is why many injured workers utilize a{' '}
                <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link>
                {' '}to understand their true civil case value.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Factors Affecting Settlement Value ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Factors Affecting Your Settlement Value
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your final take-home amount depends on several interlocking variables that attorneys and adjusters negotiate aggressively.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Your pre-injury wages</strong> form the baseline for everything. A worker earning $20 an hour will simply mathematically receive a smaller settlement than a worker earning $40 an hour, because all state benefits are calculated as a percentage of your Average Weekly Wage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Your impairment rating</strong> is the primary battleground in a subscriber case. The insurance company will frequently send you to their own doctors, who have a notorious habit of assigning artificially low impairment ratings. A single percentage point drop costs you exactly three weeks of income. Fighting a low rating by requesting a Designated Doctor exam is often the most lucrative move you can make.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you need legal help, the state heavily regulates <strong style={{ color: '#E2E8F0' }}>Texas workers&apos; comp attorney fees</strong>. By law, an attorney handling a subscriber claim cannot charge you by the hour or take a massive chunk of your medical benefits. They are limited to a maximum of 25 percent of your income benefits recovered, and the DWC must approve their fees. This ensures that you can afford top-tier representation without going out of pocket.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Statute of Limitations ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Texas Workers&apos; Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Time is the ultimate enemy of an injured worker. The Texas workers&apos; comp statute of limitations is completely unforgiving. You must report your injury to your employer within <strong style={{ color: '#E2E8F0' }}>30 days</strong> of the accident.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                More critically, you have exactly <strong style={{ color: '#E2E8F0' }}>one year</strong> from the date of injury to officially file your claim with the Texas Division of Workers Compensation. This is accomplished by filing DWC Form-041. Do not rely on your employer or the old TWCC Texas legacy systems to do this for you. If your HR department promises they filed the paperwork but fails to submit the official DWC form within that one-year window, your claim will be permanently barred. You will lose all rights to medical care and wage replacement, no matter how catastrophic your injuries are.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Subscriber vs. Non-Subscriber Outcomes
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because of the dual system, outcomes look structurally different depending on your employer&apos;s insurance status. For <strong style={{ color: '#E2E8F0' }}>subscribers</strong>, the system runs on the statutory formula above — a rigid math equation rather than a windfall. For <strong style={{ color: '#E2E8F0' }}>non-subscribers</strong>, your claim is a personal injury lawsuit instead, where a civil jury can award pain and suffering damages the workers&apos; comp formula never includes.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              {/* ── FAQ ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-tx-faq-1',
                  question: 'Does a Texas workers comp settlement cover pain and suffering?',
                  answer: 'If your employer is a subscriber to the state system, absolutely not. The administrative system strictly forbids payouts for physical pain or emotional distress. You are limited purely to medical bill coverage and wage replacement formulas. However, if your employer is a non-subscriber, you can sue in civil court and recover full pain and suffering damages.',
                  schemaAnswer: 'If your employer is a subscriber to the state system, absolutely not. The administrative system strictly forbids payouts for physical pain or emotional distress. You are limited purely to medical bill coverage and wage replacement formulas. However, if your employer is a non-subscriber, you can sue in civil court and recover full pain and suffering damages.',
                },
                {
                  id: 'wc-tx-faq-2',
                  question: 'What does Maximum Medical Improvement mean in Texas?',
                  answer: 'Maximum Medical Improvement (MMI) is the specific medical and legal point where your doctor determines that your work-related injury has healed as much as it possibly can. Reaching this point means your condition is stable and further medical treatment will not substantially improve your physical recovery. This milestone stops your temporary benefits and triggers your permanent impairment rating.',
                  schemaAnswer: 'Maximum Medical Improvement (MMI) is the specific medical and legal point where your doctor determines that your work-related injury has healed as much as it possibly can. Reaching this point means your condition is stable and further medical treatment will not substantially improve your physical recovery. This milestone stops your temporary benefits and triggers your permanent impairment rating.',
                },
                {
                  id: 'wc-tx-faq-3',
                  question: 'How do I know if my employer is a non-subscriber?',
                  answer: "Texas employers are required by law to post a notice in the workplace, usually in a breakroom or near the time clock, explicitly stating whether they carry workers' compensation coverage. Additionally, you can verify their coverage status directly on the Texas Department of Insurance website using their employer search tool.",
                  schemaAnswer: "Texas employers are required by law to post a notice in the workplace, usually in a breakroom or near the time clock, explicitly stating whether they carry workers' compensation coverage. Additionally, you can verify their coverage status directly on the Texas Department of Insurance website using their employer search tool.",
                },
                {
                  id: 'wc-tx-faq-4',
                  question: 'What happens if I miss the statute of limitations deadline?',
                  answer: 'If you fail to file DWC Form-041 within one year of your injury date, you will almost certainly forfeit your right to claim any benefits. There are incredibly rare exceptions for workers who are physically or mentally incapable of filing, but for the vast majority of cases, missing the one-year deadline destroys your case entirely.',
                  schemaAnswer: 'If you fail to file DWC Form-041 within one year of your injury date, you will almost certainly forfeit your right to claim any benefits. There are incredibly rare exceptions for workers who are physically or mentally incapable of filing, but for the vast majority of cases, missing the one-year deadline destroys your case entirely.',
                },
                {
                  id: 'wc-tx-faq-5',
                  question: 'How much will a lawyer take from my settlement?',
                  answer: "Under the subscriber system, Texas law protects injured workers by capping attorney fees. A lawyer can only take up to 25 percent of the income benefits they help you recover, and their fees must be actively approved by the Division of Workers Compensation. In a non-subscriber civil lawsuit, attorneys typically charge a standard personal injury contingency fee, which usually ranges from 33 to 40 percent of the total civil settlement.",
                  schemaAnswer: "Under the subscriber system, Texas law protects injured workers by capping attorney fees. A lawyer can only take up to 25 percent of the income benefits they help you recover, and their fees must be actively approved by the Division of Workers Compensation. In a non-subscriber civil lawsuit, attorneys typically charge a standard personal injury contingency fee, which usually ranges from 33 to 40 percent of the total civil settlement.",
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── CTA ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Maximize Your Texas Injury Claim Today
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You cannot afford to guess when dealing with the complexities of subscriber caps and non-subscriber civil lawsuits. One missed deadline or one accepted lowball impairment rating can cost you tens of thousands of dollars. Use our{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}to establish a baseline for your potential IIB payout, and then seek aggressive legal representation to hold the insurance company accountable for every single dollar you are legally owed.
              </p>

            </article>
          ) : stateData.slug === 'florida' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Introduction ── */}
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                When you suffer a devastating injury on the job in the Sunshine State, the physical pain is quickly overshadowed by a tidal wave of financial anxiety. You are suddenly unable to work, the medical bills are piling up, and the insurance adjuster treating your claim acts like every authorized treatment is coming out of their own pocket. You need to know exactly how much your case is worth, but the insurance company is using complex statutory formulas to minimize their payout. By utilizing a reliable{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {', '}you can strip away the adjuster&apos;s advantage and gain a clear, mathematical understanding of the dollars you are legally owed.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Florida labor laws are notoriously strict and heavily favor the insurance industry, meaning you cannot rely on goodwill to get a fair payout. Your financial survival depends on understanding the exact mechanics of lost wage benefits, impairment ratings, and the rigid caps placed on your recovery. This guide will walk you through the precise calculations governing your claim, empowering you to negotiate a settlement that actually covers the true cost of your injury.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How FL System Works ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How the Florida Workers&apos; Comp System Actually Works
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Before you can calculate your potential payout, you have to understand the specific rules of the playing field. Under Chapter 440 of the Florida Statutes, the state mandates that most employers with four or more employees must carry workers&apos; compensation coverage. If you work in the construction industry, that threshold drops dramatically — construction companies must provide coverage if they have even one employee.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The entire system is administered by the Florida Division of Workers&apos; Compensation, often referred to as the Florida DWC. This agency monitors employer compliance and tracks injury data, but they do not act as your personal advocate. When the insurance company inevitably denies a crucial surgery or attempts to cut off your weekly checks prematurely, your dispute will be heard by the Office of Judges of Compensation Claims. The Florida OJCC operates as a specialized administrative court system strictly for workplace injuries. You will not stand before a traditional civil jury; instead, an administrative judge will hear your medical evidence and issue binding rulings based purely on the text of the Florida statutes.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── TTD Benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Calculating Your Temporary Total Disability (TTD) Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In the immediate aftermath of your accident, your primary concern is replacing your missing paycheck. If your authorized treating physician states you cannot perform any work whatsoever while you heal, you are entitled to Temporary Total Disability benefits. The math here is strictly defined by statute: your TTD checks will equal <strong style={{ color: '#E2E8F0' }}>66.67 percent</strong> of your Average Weekly Wage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let&apos;s look at a concrete example. If you earn an average of $1,200 per week as a heavy machinery operator in Jacksonville, your weekly TTD check will be <strong style={{ color: '#FBBF24' }}>$800</strong>. The state does impose a hard ceiling on these wages. For the current period ({stateData.weeklyCapEffectivePeriod}), the absolute maximum weekly TTD rate is <strong style={{ color: '#FBBF24' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong>. Even if you are a high-earning executive making $4,000 a week, your weekly workers&apos; comp check cannot exceed that statutory cap. Furthermore, the insurance company will not pay you these temporary benefits forever. Florida law strictly limits TTD payments to a maximum of <strong style={{ color: '#E2E8F0' }}>104 weeks</strong>. Once you hit that two-year mark of temporary benefits, the checks stop, regardless of whether you have fully recovered.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Impairment Income Benefits and MMI ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Navigating Florida Impairment Income Benefits and MMI
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Eventually, your medical recovery will plateau. Your doctor will declare that you have reached Florida Maximum Medical Improvement, commonly known as MMI. Reaching MMI does not mean you are completely healed or pain-free; it simply means that further medical intervention is not expected to significantly improve your underlying condition. At this critical juncture, your temporary wage replacement checks stop, and the focus shifts to compensating you for any lasting physical damage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you reach MMI, your doctor will evaluate your residual bodily damage using the AMA Guides to the Evaluation of Permanent Impairment. Based on this evaluation, you will receive a specific Florida workers&apos; comp impairment rating. This percentage is the most important number in your entire claim, as it dictates exactly how much money you will receive in Florida impairment income benefits.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The statutory math for these impairment benefits is precise. You are entitled to <strong style={{ color: '#E2E8F0' }}>two weeks of benefits for every single percentage point</strong> of your assigned impairment rating. Furthermore, these specific checks are paid at <strong style={{ color: '#E2E8F0' }}>75 percent of your average weekly wage</strong>. Imagine you are a nurse in Orlando earning an average weekly wage of $1,000. You suffer a severe spinal injury lifting a patient. At MMI, your doctor assigns you a 15 percent impairment rating. Because you receive two weeks of pay per percentage point, you are entitled to 30 weeks of impairment checks. Since your average weekly wage was $1,000, your impairment benefit rate is <strong style={{ color: '#FBBF24' }}>$750 per week</strong>. Over those 30 weeks, you will receive a total of <strong style={{ color: '#FBBF24' }}>$22,500</strong> in impairment income benefits.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent Total Disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Harsh Reality of Florida Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Many severely injured workers assume that if they can never return to their old profession, they will automatically qualify for lifetime wage replacement. This is a dangerous misconception. Under current statutes, securing Florida permanent disability workers&apos; comp is incredibly difficult. Florida severely restricts permanent total disability benefits, reserving them only for the most catastrophic, life-altering injuries.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To qualify for Florida permanent total disability, your condition must fit into a highly restricted, scheduled list of catastrophic injuries. You essentially must prove you have suffered the amputation or functional loss of both hands, both feet, both eyes, or a combination thereof. Total paraplegia, severe traumatic brain injuries resulting in severe sensory or motor disturbances, and second or third-degree burns over 25 percent of your body also make the list.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you do not fit cleanly into one of these catastrophic categories, your path to lifetime benefits is nearly impossible. A massive herniated disc requiring a three-level spinal fusion might leave you in chronic pain and permanently unable to do heavy labor, but under Florida law, it rarely qualifies for permanent total disability. You will likely be restricted to your standard impairment rating payout and whatever temporary benefits you already exhausted. This incredibly strict standard is why accurately calculating the future cost of your medical care during settlement negotiations is absolutely vital.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Key Factors ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Key Factors Driving Your Florida Workers&apos; Comp Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you and the insurance company finally decide to close out your case, you will negotiate a lump-sum Florida workers&apos; comp settlement. This settlement completely buys out your future rights to wage replacement and, usually, your right to future medical care on the insurance company&apos;s dime. A baseline{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}will look at two main buckets of money: your projected future wage loss and the projected cost of your future medical treatment.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Future medical costs often represent the largest portion of your payout. If your doctor states you will need joint replacement surgery in ten years, the projected cost of that surgery, the hospital stay, and the subsequent physical therapy must be calculated and added to your settlement total. If you are eligible for Medicare, federal law requires the creation of a Medicare Set-Aside account to ensure Medicare does not get billed for your work-related injury. The insurance company will fund this account as part of your settlement, which can significantly drive up the total dollar amount.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                It is absolutely crucial to understand that the workers&apos; comp system does not care about your emotional trauma. Workers&apos; comp explicitly does <strong style={{ color: '#E2E8F0' }}>not</strong> cover pain and suffering. If you lose a finger in a machine press, you are compensated for the anatomical loss and the medical bills, but you receive zero dollars for the sheer agony of the experience.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, there is a major exception. If your workplace injury was caused by the negligence of a third party — such as a reckless delivery driver who rear-ended your company truck, or the manufacturer of a defective power tool — you possess the right to file a separate civil personal injury lawsuit against that specific third party. In that civil lawsuit, you can demand massive financial compensation for your physical agony, emotional distress, and loss of enjoyment of life. To see how a third-party civil claim could drastically expand your overall financial recovery, you can run your scenario through a specialized{' '}
                <Link href="/pain-and-suffering-calculator/florida/" style={{ color: '#60A5FA' }}>Florida pain and suffering calculator</Link>.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Attorney Fees ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Understanding Statutory Attorney Fee Caps
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Do not let the fear of expensive legal bills intimidate you into facing a multi-billion dollar insurance carrier alone. To protect injured workers from price gouging, Florida workers&apos; comp attorney fees are strictly regulated and capped by state statute. You do not hand a lawyer a retainer fee, and you never pay out of pocket. Instead, your attorney is paid a percentage of the settlement they secure for you, and that percentage is locked into a rigid sliding scale.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                By law, an attorney can charge <strong style={{ color: '#E2E8F0' }}>20 percent of the first $5,000</strong> in benefits secured, <strong style={{ color: '#E2E8F0' }}>15 percent of the next $5,000</strong>, and <strong style={{ color: '#E2E8F0' }}>10 percent of any remaining settlement amount</strong>. If your lawyer aggressively negotiates a $100,000 settlement on your behalf, their fee is mathematically limited to <strong style={{ color: '#FBBF24' }}>$10,750</strong>. You walk away with the vast majority of the funds. Because lawyers operate on this contingency fee basis, they are financially motivated to maximize your exact settlement amount.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Statute of Limitations ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Unforgiving Florida Workers&apos; Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In the realm of personal injury law, missing a deadline is fatal to your case. The Florida workers&apos; comp statute of limitations dictates that you have exactly <strong style={{ color: '#E2E8F0' }}>two years</strong> from the specific date of your workplace accident to file a formal Petition for Benefits.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you fall off scaffolding on October 10, 2024, your absolute deadline to formally file is October 10, 2026. If you file on October 11, the judge will dismiss your claim entirely, and the insurance company will legally owe you nothing. There is a slight exception if the insurance company has been actively providing authorized medical treatment or paying out wage benefits; in those scenarios, the statute of limitations is generally extended to one year from the date of your last authorized medical appointment or your last compensation check. Regardless, playing games with these deadlines is a guaranteed way to lose your financial rights.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              {/* ── FAQ ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-fl-faq-1',
                  question: 'Can my employer fire me for filing a workers compensation claim in Florida?',
                  answer: "Florida law strictly prohibits employers from firing, demoting, or retaliating against an employee simply because they filed a valid workers' compensation claim. However, Florida is an at-will employment state. Your employer can still legally terminate you if you are entirely unable to perform the core duties of your job, or if they are laying off a larger group of employees for separate financial reasons. If you believe your termination was direct retaliation for reporting your injury, you may have grounds for a separate civil wrongful termination lawsuit against your former employer.",
                  schemaAnswer: "Florida law strictly prohibits employers from firing, demoting, or retaliating against an employee simply because they filed a valid workers' compensation claim. However, Florida is an at-will employment state, so termination for inability to perform job duties or business-wide layoffs is still permitted.",
                },
                {
                  id: 'wc-fl-faq-2',
                  question: 'Will I have to pay taxes on my Florida workers comp settlement?',
                  answer: 'No, the money you receive from a standard workers compensation settlement is entirely tax-free at both the state and federal levels. You do not have to report your settlement payout or your weekly wage replacement checks as gross income to the IRS. The only time taxes become complicated is if you are simultaneously receiving Social Security Disability benefits, as a large workers comp settlement can occasionally reduce your allowable Social Security payments if the settlement is not drafted correctly by an attorney.',
                  schemaAnswer: 'No, standard workers compensation settlements are entirely tax-free at both the state and federal levels. Complications can arise if you also receive Social Security Disability benefits, as a large settlement may reduce your SSDI payments if not structured correctly.',
                },
                {
                  id: 'wc-fl-faq-3',
                  question: "What happens if I refuse the insurance company's settlement offer?",
                  answer: "You are never legally required to settle your workers' compensation case. If the adjuster offers you a lowball sum that does not cover your future medical needs, you can reject it and simply keep your medical claim open indefinitely. By keeping the case open, the insurance carrier remains legally obligated to pay for your authorized medical care related to the injury for the rest of your life, provided you seek authorized treatment at least once a year to keep the statute of limitations from expiring.",
                  schemaAnswer: "You are never legally required to settle. By rejecting the offer and keeping your claim open, the insurance carrier remains obligated to pay for your authorized medical care for life, provided you seek authorized treatment at least once a year.",
                },
                {
                  id: 'wc-fl-faq-4',
                  question: 'Can I choose my own doctor under the Florida system?',
                  answer: 'Unfortunately, the Florida system gives the insurance company near-total control over your medical care. You cannot simply walk into your private primary care physician\'s office and demand the insurance company foot the bill. You must treat exclusively with the physicians specifically authorized by the workers comp carrier. If you absolutely despise the doctor the insurance company selects, Florida law grants you the right to request a one-time change of physician. However, the insurance company still gets to pick the replacement doctor.',
                  schemaAnswer: "The Florida system gives the insurance company near-total control over your medical care. You must treat with their authorized physicians. Florida law grants you one-time right to request a physician change, but the insurer still selects the replacement.",
                },
                {
                  id: 'wc-fl-faq-5',
                  question: 'How long does it take for a judge to approve a settlement?',
                  answer: "Unlike standard civil lawsuits that require lengthy court hearings for approval, Florida workers' comp settlements are generally private contracts. If you are represented by a lawyer, the settlement typically does not even need to be formally approved by an OJCC judge unless it involves complex child support arrears or an unrepresented claimant. Once you sign the final settlement paperwork, the insurance carrier is legally required to mail your settlement check within a strict timeframe, usually just a matter of weeks.",
                  schemaAnswer: "Florida workers' comp settlements are generally private contracts and typically do not require OJCC judge approval if you have an attorney. Once paperwork is signed, the insurer must mail your check within a strict statutory timeframe, usually weeks.",
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── CTA ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Take Control of Your Financial Future Today
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The insurance adjuster analyzing your file has an entire team of actuaries and corporate lawyers dedicated to minimizing your payout. You cannot afford to guess at the value of your shattered knee or your spinal fusion. You need concrete numbers. Use our{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}to establish your baseline worth, document every single medical bill, and never let the insurance company bully you into accepting a fraction of what Florida law mandates you are owed. Protect your rights, demand total financial accountability, and secure the capital you need to rebuild your life.
              </p>

            </article>
          ) : stateData.slug === 'new-york' ? (
            /* ─────────────────────────────────────────────────────────────────
               NEW YORK — converted from public/wc-new-york-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Much Is Your New York Workers Comp Claim Worth?
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Picture this: you are working a high-speed packing line at a distribution warehouse in Queens when a jammed conveyor catches your right arm. You spend the afternoon at Elmhurst Hospital with a severe radius fracture and a torn wrist tendon. Over the next six months, your orthopedic surgeon bills <strong style={{ color: '#FBBF24' }}>$28,400</strong> for structural realignment and physical therapy, and you lose <strong style={{ color: '#FBBF24' }}>$19,200</strong> in wages while totally unable to lift packages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you try to type your injury into a generic online workers comp settlement calculator, the numbers it spits out will be completely wrong. That is because New York does not use traditional personal injury math. There are no multipliers for your emotional distress, and insurance adjusters do not care how much the ordeal disrupted your personal life.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Instead, every dollar you receive is governed by strict statutory formulas enforced by the New York Workers Compensation Board (WCB). To understand what your case is actually worth, you have to look at how New York weaves together your average weekly wage, the specific body part you injured, and your long-term capacity to return to the workforce.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How New York Workers Comp Works: The Grand Bargain
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you get hurt on the job in New York, you enter into a legal compromise known as the &quot;exclusive remedy&quot; rule. Under the New York Workers&apos; Compensation Law, you give up the right to sue your employer in civil court. In exchange, your employer&apos;s insurance company must pay for 100% of your causally related medical care and a portion of your lost wages, regardless of who caused the accident.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, this grand bargain comes with a massive financial catch: workers comp does not cover pain and suffering in New York. If your fractured wrist leaves you with a dull ache every rainy morning, or the stress of the accident keeps you awake at night, the WCB assigns a legal value of zero dollars to those hardships. To learn how pain and suffering is calculated using traditional legal multipliers, you would need to look outside the workers&apos; compensation system entirely — our{' '}
                <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>pain and suffering multiplier guide</Link>{' '}
                explains how that math works in civil personal injury claims.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There is one major exception that could transform your financial recovery. If a negligent third party — such as a delivery driver from another company, a reckless subcontractor on your job site, or the manufacturer of a defective industrial machine — caused your injury, you can file a separate personal injury lawsuit against them in civil court. In that parallel lawsuit, you can demand full compensation for your physical pain, mental anguish, and 100% of your lost income.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Calculating Your Lost Wages: TTD Benefits and the 2026 Cap
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                While you are actively recovering and your doctor declares you completely unable to work, you receive Temporary Total Disability (TTD) benefits. The New York statutory formula for TTD is straightforward: you receive <strong style={{ color: '#E2E8F0' }}>66.67% (two-thirds)</strong> of your Average Weekly Wage (AWW), subject to a strict statutory ceiling.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your AWW is calculated by taking your total gross earnings from the 52 weeks immediately preceding your accident and dividing that number by 52. Once the WCB determines your baseline wage, they apply the state cap. For {stateData.weeklyCapEffectivePeriod}, the New York maximum weekly benefit sits at <strong style={{ color: '#FBBF24' }}>${stateData.weeklyCapAmount.toLocaleString()} per week</strong>. This figure updates annually every July 1st based on the statewide average weekly wage, and it represents one of the highest benefit ceilings in the entire country.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To see how this works in practice, let&apos;s look at two different New York workers:
              </p>

              {/* TTD comparison table */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Worker Profile</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pre-Accident Gross Wage</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statutory 66.67% Rate</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actual Weekly TTD Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Worker A: Retail Supervisor</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>$1,200 / week ($62,400/yr)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.04</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.04 (Fully paid under the cap)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Worker B: Union Electrician</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>$2,400 / week ($124,800/yr)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$1,600.08</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>${stateData.weeklyCapAmount.toLocaleString()} (Capped at current maximum)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Notice the financial reality facing Worker B. Even though the electrician earned $2,400 a week before the crash, New York law slashes their wage replacement by more than half. Over a six-month recovery period, Worker B loses <strong style={{ color: '#FBBF24' }}>$11,832</strong> in uncompensated income due to the statutory cap.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Big Payout: Schedule Loss of Use (SLU) Awards
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once your medical condition stabilizes and your doctor declares you have reached Maximum Medical Improvement (MMI), your temporary wage checks stop. If your injury involves a limb, eye, or ear, your claim pivots to a New York SLU award.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Unlike most states that rely on the American Medical Association (AMA) Guides to rate permanent damage, the New York Workers Compensation Board uses its own rigid, statutory medical guidelines. Under Section 15(3) of the law, the state assigns a definitive &quot;value&quot; in weeks to every major extremity:
              </p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '6px' }}>Arm: <strong style={{ color: '#E2E8F0' }}>312 weeks</strong></li>
                <li style={{ marginBottom: '6px' }}>Leg: <strong style={{ color: '#E2E8F0' }}>288 weeks</strong></li>
                <li style={{ marginBottom: '6px' }}>Hand: <strong style={{ color: '#E2E8F0' }}>244 weeks</strong></li>
                <li style={{ marginBottom: '6px' }}>Foot: <strong style={{ color: '#E2E8F0' }}>205 weeks</strong></li>
                <li style={{ marginBottom: '6px' }}>Eye: <strong style={{ color: '#E2E8F0' }}>160 weeks</strong></li>
                <li style={{ marginBottom: '6px' }}>Thumb: <strong style={{ color: '#E2E8F0' }}>75 weeks</strong></li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To calculate your New York workers comp permanent disability payout, your doctor evaluates your residual loss of range of motion, strength, and bone integrity to assign a percentage of permanent impairment. The insurance company will then send you to a mandatory New York IME (Independent Medical Exam). The insurance doctor&apos;s entire job is to minimize your injury, and they will almost certainly assign a lower percentage than your treating physician. Eventually, a WCB judge or a negotiated agreement meets in the middle.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let&apos;s run the concrete math on a Queens warehouse worker who suffers a permanent injury to their right arm. Suppose the treating doctor rates the arm at a 30% loss of use, the IME doctor rates it at 10%, and your attorney successfully negotiates a binding SLU settlement at 20% permanent impairment.
              </p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Find the statutory base: A full arm equals <strong style={{ color: '#E2E8F0' }}>312 weeks</strong>.</li>
                <li style={{ marginBottom: '8px' }}>Multiply by the impairment rating: 312 weeks &times; 20% = <strong style={{ color: '#FBBF24' }}>62.4 weeks</strong> of compensation.</li>
                <li style={{ marginBottom: '8px' }}>Multiply by the worker&apos;s compensation rate: If your TTD rate was $800 a week, your gross SLU award is 62.4 &times; $800 = <strong style={{ color: '#FBBF24' }}>$49,920</strong>.</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, the insurance company does not simply hand you a check for $49,920. Under New York law, the insurer gets to take a dollar-for-dollar credit for all the TTD wage replacement checks they already paid you while you were out of work. If you collected $19,200 in temporary disability checks over six months, that amount is deducted from your award. Your final, net lump-sum SLU check equals <strong style={{ color: '#FBBF24' }}>$30,720</strong>.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Non-Schedule Injuries and Section 32 Lump Sum Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you injure your spine, neck, skull, or internal organs, you do not qualify for an SLU award. The WCB classifies these as &quot;non-schedule&quot; injuries. Instead of measuring range of motion in a single limb, the state evaluates your loss of wage-earning capacity (LWEC). You are graded on a spectrum from permanent partial disability to permanent total disability, which dictates how many total weeks of benefit checks you can receive (ranging from 225 weeks for mild disability up to 525 weeks for severe impairment).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because living on weekly checks for years keeps your medical files open and exposes the insurance company to endless administrative costs, both sides usually prefer to part ways. This is accomplished through a New York <strong style={{ color: '#E2E8F0' }}>Section 32 settlement</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A Section 32 settlement is a voluntary lump-sum agreement that closes your workers&apos; compensation case forever. Once a WCB commissioner approves the contract, the insurance company cuts you one large check. In exchange, you forfeit your right to ever demand another lost wage check or medical reimbursement for that accident again.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Imagine a 45-year-old construction worker with a herniated L4-L5 lumbar disc. The WCB classifies him with a 50% permanent loss of wage-earning capacity, entitling him to $500 a week for up to 300 remaining weeks (<strong style={{ color: '#FBBF24' }}>$150,000 total</strong>). The worker also needs an estimated <strong style={{ color: '#FBBF24' }}>$40,000</strong> in future pain management injections and physical therapy.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                An adjuster will not pay the full $190,000 sticker price because of the time value of money. Instead, they will offer a discounted present-value lump sum. A realistically negotiated Section 32 settlement for this scenario would settle around <strong style={{ color: '#FBBF24' }}>$135,000</strong>. The worker walks away with immediate financial security, but takes on the responsibility of paying for any future back care out of that settlement fund.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                4 Critical Factors Affecting Your New York WCB Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you sit down at the negotiating table, your final payout will swing tens of thousands of dollars based on four distinct leverage points:
              </p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px' }}>
                1. The IME Battle
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your treating doctor is your advocate; the New York IME doctor is a defense witness. If your doctor says you need a <strong style={{ color: '#FBBF24' }}>$45,000</strong> spinal fusion and the IME doctor claims you just have mild arthritis that requires over-the-counter ibuprofen, your settlement value stalls. Winning a high settlement requires hiring legal counsel who can cross-examine the IME physician on their flawed orthopedic testing methods during WCB depositions.
              </p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px' }}>
                2. Medicare Set-Aside (MSA) Requirements
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you are currently a Medicare beneficiary, or you expect to enroll within 30 months of settlement, federal law prevents you from shifting your future accident-related medical bills onto the taxpayers. Your Section 32 agreement must include a legally structured Medicare Set-Aside account. This isolates a specific portion of your settlement cash — say, <strong style={{ color: '#FBBF24' }}>$25,000</strong> — that can only be used to buy Medicare-approved medications and treatments for your work injury.
              </p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px' }}>
                3. Return to Work Capacity
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Adjusters aggressively monitor your social media profiles and surveillance footage. If you claim you cannot lift 10 pounds due to a lumbar injury, but investigators videotape you carrying bags of fertilizer into your garage, your negotiating leverage evaporates instantly. Conversely, if vocational experts prove your physical restrictions permanently bar you from your trade and you lack the education for desk work, your case value skyrockets.
              </p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px' }}>
                4. Outstanding Medical Liens
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your health insurance (like Blue Cross Blue Shield) or state Medicaid mistakenly paid for your initial emergency room visits before your employer&apos;s workers comp carrier accepted the claim, those entities will assert a legal lien against your settlement. Your attorney must aggressively negotiate these liens downward before you sign a Section 32 contract, ensuring the cash stays in your pocket rather than going to health conglomerates.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Don&apos;t Miss the Clock: New York Workers Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In workers&apos; compensation, missing a deadline by a single day destroys your claim permanently. Under Section 28 of the New York Workers&apos; Compensation Law, the New York workers comp statute of limitations requires you to formally file a claim (Form C-3) with the WCB within <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of your accident.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Simply reporting the injury to your supervisor or filling out an internal company incident report does not stop the legal clock. You must ensure the state board receives your official documentation.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, New York law grants a vital lifeline known as the &quot;advance payment&quot; exception. If your employer or their insurance carrier voluntarily paid for your causally related medical bills, or provided you with wage replacement checks knowing your injury was work-related, the legal clock resets. In those scenarios, you have two years from the date of the last payment of compensation to formally register your claim with the board.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For occupational diseases that develop slowly over time — such as repetitive stress carpal tunnel syndrome or mesothelioma from inhaling job site asbestos — the rules adjust slightly. You have two years from the date of your disablement, or two years from the date you knew (or should have known) that the disease was caused by your employment, whichever is later.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <em>Any settlement figure is a gross valuation before deducting prior temporary wage payments, attorney fees (typically capped at 10% to 15% by WCB judges), and medical liens.</em>
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-ny-faq-1',
                  question: 'Can my employer fire me for filing a workers comp claim in New York?',
                  answer: 'No. Under Section 120 of the New York Workers\' Compensation Law, it is strictly illegal for an employer to discharge, demote, or discriminate against you simply because you filed a claim or testified at a WCB hearing. If your employer retaliates against you, the board can order them to reinstate your job and pay you back wages.',
                  schemaAnswer: 'No. Under Section 120 of the New York Workers\' Compensation Law, it is strictly illegal for an employer to discharge, demote, or discriminate against you for filing a claim or testifying at a WCB hearing. The board can order reinstatement and back wages.',
                },
                {
                  id: 'wc-ny-faq-2',
                  question: 'Do I have to pay state or federal taxes on my NY workers comp settlement?',
                  answer: 'No. Under Internal Revenue Code (IRC) Section 104(a)(1), workers\' compensation settlements and weekly disability benefit checks are fully exempt from federal, state, and local income taxes. If you settle your case for $100,000, you do not owe the IRS or the New York Department of Taxation and Finance a single penny of it.',
                  schemaAnswer: 'No. Under IRC Section 104(a)(1), workers\' compensation settlements and weekly disability checks are fully exempt from federal, state, and local income taxes.',
                },
                {
                  id: 'wc-ny-faq-3',
                  question: 'What happens if I refuse to attend the insurance company\'s IME appointment?',
                  answer: 'Refusing to attend a properly scheduled New York IME is a catastrophic mistake. Under WCB regulations, the insurance carrier has the legal right to immediately suspend your weekly lost wage checks if you fail to appear without a valid, documented emergency. Always attend the exam, but take precise notes on when the doctor walked into the room and how long the actual physical examination lasted.',
                  schemaAnswer: 'Refusing a properly scheduled New York IME allows the insurance carrier to immediately suspend your weekly lost wage checks under WCB regulations. Always attend, but document the duration and scope of the examination carefully.',
                },
                {
                  id: 'wc-ny-faq-4',
                  question: 'How long does it take to get my check after signing a Section 32 agreement?',
                  answer: 'Once you and the insurance carrier sign the Section 32 paperwork, you must wait for a formal WCB approval hearing. After the board commissioner approves the settlement, New York enforces a mandatory 10-day statutory cooling-off period where either side can back out. Once day 11 passes, the insurance company has exactly 10 calendar days to mail your check. If they pay late, you can demand a mandatory 20% statutory penalty check.',
                  schemaAnswer: 'After WCB commissioner approval of a Section 32 settlement, a mandatory 10-day cooling-off period applies. After day 11, the insurer has 10 calendar days to mail your check. Late payment triggers a mandatory 20% statutory penalty.',
                },
                {
                  id: 'wc-ny-faq-5',
                  question: 'Can I reopen my workers comp case after I settle?',
                  answer: 'It depends entirely on how you settled. If you resolved your case via a standard Schedule Loss of Use (SLU) award, your medical care technically remains open for life if the exact same injury worsens. However, if you signed a Section 32 lump-sum settlement that explicitly closed your medical benefits, your case is sealed forever. You can never reopen it, even if you eventually require an emergency amputation or paralysis surgery.',
                  schemaAnswer: 'SLU awards keep medical care open for life if the same injury worsens. However, a Section 32 lump-sum settlement that closes medical benefits is sealed forever — you cannot reopen it under any circumstances.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Secure Every Dollar You Are Owed Under New York Law
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You did not ask to get hurt on the job, and you should not have to spend your recovery decoding dense statutory medical schedules while an insurance adjuster tries to starve you out of your weekly wage checks. New York workers&apos; compensation law provides some of the strongest financial protections in America, but those dollars are never handed over voluntarily.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Before you agree to an impairment rating, attend an aggressive IME, or sign away your lifetime medical rights in a Section 32 contract, let our network of verified New York legal advocates review your file. Use our interactive New York Workers Comp Settlement Calculator now to verify your true statutory baseline, or request a free, confidential case evaluation with an experienced WCB attorney today.
              </p>

            </article>

          ) : stateData.slug === 'illinois' ? (
            /* ─────────────────────────────────────────────────────────────────
               ILLINOIS — converted from public/wc-illinois-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                When you get hurt on the job in Illinois, your financial reality changes between your morning clock-in and your afternoon trip to the emergency room. Suddenly, you are trying to heal from a physical trauma while dealing with an insurance adjuster whose primary professional goal is to minimize your corporate payout. You might plug your basic wage numbers into an online illinois workers comp settlement calculator to get a quick baseline figure, but standard national calculators often fail to capture the aggressive, unique statutory formulas enforced across the Prairie State.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Illinois does not evaluate an injured worker using the standard insurance frameworks seen in neighboring states. Whether you suffered a severe spinal injury slinging freight in a Bedford Park warehouse or tore your rotator cuff lifting patients in a Peoria hospital, your final payout depends entirely on specific state legislative math. To secure every dollar you are owed, you need to understand how local labor laws value your body, how insurance companies manipulate your average weekly wage, and how to build a claim that survives scrutiny.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Illinois Workers Comp Works
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The entire state compensation system is governed by the Illinois Workers Compensation Commission, an administrative body that functions as the judge and jury for your workplace injury. Under the Illinois Workers&apos; Compensation Act, this operates as a strict no-fault system. You do not need to prove that your foreman was reckless or that your employer ignored OSHA safety standards to qualify for benefits. If you were performing your job duties when your body gave out, the injury is covered.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, that no-fault protection comes with a massive statutory catch: traditional workers compensation entirely excludes noneconomic damages. You cannot claim financial compensation for the mental anguish, physical agony, or missed family moments caused by your accident. Because the system strips away these subjective damages, the insurance adjuster will attempt to treat your claim like a simple administrative receipt.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When your employer&apos;s insurance carrier disputes your need for surgery or refuses to pay your weekly checks, your case bypasses traditional civil courts and goes before an Illinois arbitrator. These arbitrators hear disputed cases at specific regional trial sites across the state. If the arbitrator issues an unfavorable ruling, your attorney must file a formal appeal to have a panel of IWCC commissioners review the trial record. Throughout this adversarial process, the insurer will almost certainly demand that you submit to an Illinois IME, an Independent Medical Examination conducted by a corporate-backed physician paid specifically to testify that your injury is minor or pre-existing.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                TTD Benefits: Your Immediate Wage Replacement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Before you even begin negotiating a lump-sum settlement, your immediate financial survival depends on Temporary Total Disability payments. These wage replacement checks are authorized under Illinois Section 8 benefits and are designed to keep a roof over your head while your treating physician keeps you entirely off work.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                By statutory law, your weekly TTD check equals exactly <strong style={{ color: '#E2E8F0' }}>66.67 percent</strong> of your Average Weekly Wage. To calculate your actual AWW, the insurance company must look at your gross earnings from the 52 weeks immediately preceding your accident, including mandatory overtime. Say you worked as a union carpenter earning an average of $1,800 per week over the past year. Under the two-thirds statutory formula, your baseline TTD benefit comes out to <strong style={{ color: '#FBBF24' }}>$1,200 per week</strong>, and these checks are entirely exempt from state and federal income taxes.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because Illinois historically maintains strong labor protections, the state caps these payments at some of the highest statutory thresholds in the entire country. For {stateData.weeklyCapEffectivePeriod}, the maximum weekly TTD benefit is capped at <strong style={{ color: '#FBBF24' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong>. If you are an executive or specialized heavy equipment operator earning $3,500 a week, your weekly disability check cannot legally exceed that statutory ceiling regardless of your actual lost wages. Adjusters frequently miscalculate your AWW by excluding earned bonuses or regular overtime, artificially starving your household budget to pressure you into a cheap, premature settlement.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Illinois PPD Percentage of Person Method
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once your doctor declares that you have reached Maximum Medical Improvement, your temporary wage benefits end and your case transitions to Permanent Partial Disability evaluation. This is the stage where the vast majority of settlement money is negotiated. While many states rely strictly on the American Medical Association Guides to assign a rigid value to an injured limb, Illinois is unique: arbitrators heavily favor the <strong style={{ color: '#E2E8F0' }}>Illinois PPD percentage of person method</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Under Section 8(d)(2) of the Act, the state values the human body as a whole person equal to <strong style={{ color: '#E2E8F0' }}>500 statutory weeks</strong> of compensation. Instead of looking solely at an isolated joint, the commission evaluates how your permanent physical impairment degrades your overall ability to function as a whole person. The legal formula used to calculate your permanent disability payout requires multiplying three distinct figures: 60 percent of your Average Weekly Wage, the 500 statutory weeks assigned to the whole person, and your assigned impairment percentage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To see how this math plays out in a real negotiation, imagine you suffer a two-level lumbar disc herniation while lifting heavy machinery. You undergo a spinal fusion surgery and eventually return to light-duty work. Your pre-injury Average Weekly Wage was $1,500. Sixty percent of that wage equals <strong style={{ color: '#FBBF24' }}>$900</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your orthopedic surgeon and your attorney evaluate your permanent bending limitations and argue that you have suffered a 30 percent impairment of the person as a whole. The baseline statutory valuation of your injury is calculated by multiplying your $900 statutory PPD rate by the 500 maximum whole-person weeks, yielding a total body value of <strong style={{ color: '#FBBF24' }}>$450,000</strong>. Taking your 30 percent impairment rating from that $450,000 baseline results in a permanent disability settlement value of <strong style={{ color: '#FBBF24' }}>$135,000</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When you run those same basic figures through a standard national workers comp settlement calculator, the algorithm often misses these nuances entirely. In the real world, the insurance company will fight this math ruthlessly. They will fly in an IME doctor to claim your spinal fusion only warrants a 10 percent whole-person rating. If the adjuster successfully forces that 10 percent rating onto your claim, your settlement offer immediately collapses from $135,000 down to <strong style={{ color: '#FBBF24' }}>$45,000</strong> — robbing your family of $90,000 in legitimate statutory compensation.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Critical Factors Affecting Your Settlement Value
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Beyond the raw mathematical formula, several real-world legal variables dictate whether an insurance carrier will offer you maximum dollar value or force you into a lengthy trial before an arbitrator.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your future medical requirements represent the largest hidden variable in any settlement contract. If your spinal fusion or joint replacement will require revision surgeries, ongoing pain management injections, or daily physical therapy ten years down the road, your settlement must include funds to cover that care. If you are a Medicare beneficiary or reasonably expect to become one within 30 months, federal law requires the creation of a formal Medicare Set-Aside. The insurer must calculate the exact cost of your future accident-related treatments and place those funds into a dedicated account, preventing you from shifting the corporate insurance burden onto taxpayers.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Vocational displacement also drastically alters your case worth. If your permanent restrictions prevent you from returning to your heavy construction trade, the insurer faces massive financial exposure under Section 8(d)(1) wage differential laws. If you are forced to take a sedentary desk job paying half your previous salary, Illinois law requires the insurance company to pay you two-thirds of the difference between your old wage and your new wage until you reach age 67. Faced with decades of ongoing wage differential liability, insurance companies will often pay a massive upfront lump sum just to close your file forever.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Furthermore, you must investigate whether a negligent third party contributed to your accident. If you were injured on a multi-contractor job site by a careless crane operator from another company, or if your delivery van was rear-ended by a drunk driver while you were on the clock, you are not trapped exclusively inside the workers compensation system. You can file a separate civil lawsuit against the negligent third party alongside your IWCC claim. Because civil personal injury lawsuits allow you to recover uncapped subjective damages, you will want to cross-reference your civil claim using an{' '}
                <Link href="/pain-and-suffering-calculator/illinois/" style={{ color: '#60A5FA' }}>Illinois pain and suffering calculator</Link>{' '}
                to understand the true combined value of your legal actions.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Chicago vs Downstate Settlement Realities
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Where your accident occurs within Illinois plays an undeniable role in how much money lands in your bank account. An Illinois workers comp settlement negotiated inside Cook County routinely settles for 15 to 30 percent more than an identical medical injury occurring downstate in cities like Effingham, Quincy, or Carbondale.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This geographic disparity is driven by basic economic and legal realities. Chicago and the surrounding collar counties maintain significantly higher median wages and denser union representation, which naturally drives up Average Weekly Wage calculations across the board. Furthermore, Chicago workers comp settlement values are heavily influenced by local trial venues. Defense attorneys know that arbitrators assigned to the Chicago trial district hear high-dollar, catastrophic industrial accidents daily and are generally more accustomed to awarding significant permanent partial disability percentages. Downstate defense venues tend to reflect more conservative, rural economic standards where arbitrators apply stricter scrutiny to subjective impairment ratings.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Illinois Workers Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most brilliant legal strategy and severe physical injury mean nothing if you allow the statutory clock to expire. The Illinois workers comp statute of limitations is unforgiving and strictly enforced by the commission.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Under Section 6(d) of the Act, you must formally file your Application for Adjustment of Claim (Form IC8) with the IWCC within <strong style={{ color: '#E2E8F0' }}>three years</strong> from the exact date of your workplace accident, or within <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date you received your last temporary compensation or medical payment — whichever date is later. Simply reporting the injury to your human resources department or receiving casual informal checks from your employer does not stop this legal clock. If you fail to file your formal application with the state commission before the deadline passes, your right to secure a settlement or demand future medical care is permanently extinguished.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-il-faq-1',
                  question: 'Can my employer fire me for filing a workers compensation claim in Illinois?',
                  answer: 'No. Under Illinois common law and statutory protections, terminating an employee in retaliation for exercising their rights under the Workers\' Compensation Act is strictly illegal. If your employer fires you, demotes you, or cuts your hours simply because you filed an IWCC claim, you can file a separate civil wrongful termination lawsuit against them to recover punitive damages and lost back wages.',
                  schemaAnswer: 'No. Terminating an employee in retaliation for filing a workers\' compensation claim is strictly illegal under Illinois law. You can file a separate civil wrongful termination lawsuit to recover punitive damages and lost back wages.',
                },
                {
                  id: 'wc-il-faq-2',
                  question: 'Do I have to pay state or federal income taxes on my Illinois workers comp settlement?',
                  answer: 'No. Lump-sum workers compensation settlements and weekly disability checks are entirely exempt from federal income taxes under Internal Revenue Code Section 104(a)(1). Similarly, the Illinois Department of Revenue does not tax workers compensation proceeds. The amount listed on your IWCC settlement contract is the exact gross amount you retain before your agreed legal fees and unpaid medical liens are deducted.',
                  schemaAnswer: 'No. Workers\' compensation settlements and weekly disability checks are exempt from federal income taxes under IRC Section 104(a)(1) and are not taxed by the Illinois Department of Revenue.',
                },
                {
                  id: 'wc-il-faq-3',
                  question: 'How long does it take the IWCC to approve a settlement contract once we agree on a number?',
                  answer: 'Once you, your attorney, and the insurance carrier sign the formal settlement contract (known as the green sheet), the document must be submitted to an Illinois arbitrator for statutory review. In jurisdictions like Chicago, approval typically takes between 14 and 30 days. Once the arbitrator signs the order, Illinois law gives the insurance company 30 days to issue the physical check before mandatory statutory interest penalties begin accruing.',
                  schemaAnswer: 'After all parties sign the settlement contract (green sheet), an Illinois arbitrator must review it. Chicago-area approval typically takes 14 to 30 days. The insurer then has 30 days to issue your check before statutory interest penalties apply.',
                },
                {
                  id: 'wc-il-faq-4',
                  question: 'Does repetitive trauma like carpal tunnel syndrome qualify for an Illinois PPD settlement?',
                  answer: 'Yes. Illinois law explicitly covers repetitive trauma injuries caused by performing everyday job duties, such as assembly line typing, factory packing, or jackhammer operation. For statute of limitations purposes, your accident date is legally established as the manifestation date — the exact day a reasonable person would have known their physical injury was directly caused by their workplace duties.',
                  schemaAnswer: 'Yes. Illinois law explicitly covers repetitive trauma injuries from workplace duties. The statute of limitations clock starts on the manifestation date — when a reasonable person would have known their injury was caused by their work.',
                },
                {
                  id: 'wc-il-faq-5',
                  question: 'Will my workers compensation settlement be reduced if I owe back child support?',
                  answer: 'Yes. Under Illinois law, unpaid child support judgments create an automatic statutory lien against any workers compensation settlement. Before the insurance company issues your settlement funds, they must perform a mandatory state database search. If an active child support arrearage exists, the insurer is legally required to intercept those funds and redirect them to the Illinois State Disbursement Unit before paying out your remaining balance.',
                  schemaAnswer: 'Yes. Unpaid child support creates an automatic statutory lien against your workers\' comp settlement in Illinois. The insurer must search the state database and intercept any arrearage, redirecting it to the Illinois State Disbursement Unit before paying you.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Do Not Face the Insurance Company Alone
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The mathematical difference between an insurance adjuster&apos;s initial lowball offer and the maximum statutory value of your Illinois workers comp claim routinely spans tens of thousands of dollars. When your physical recovery, your household income, and your future medical security are on the line, you cannot afford to let a corporate actuary dictate your worth. Use our state-specific settlement tools to calculate your baseline value, secure all necessary medical documentation from your treating doctors, and demand the full financial compensation authorized under Illinois law.
              </p>

            </article>

          ) : stateData.slug === 'pennsylvania' ? (
            /* ─────────────────────────────────────────────────────────────────
               PENNSYLVANIA — converted from public/wc-pennsylvania-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                Getting crushed by machinery in a Pittsburgh warehouse or blowing out your lumbar spine on a Philadelphia construction site flips your financial life upside down in an instant. The physical shock fades, but the financial terror begins when your paycheck stops and the insurance adjuster starts dodging your phone calls. Navigating a Pennsylvania workers comp settlement means stepping into a hostile legal arena where the insurance carrier&apos;s primary goal is to minimize your payout. You need to know the true dollar value of your case before you sign away your future. While using a pennsylvania workers comp settlement calculator gives you a critical baseline for negotiations, extracting the maximum financial recovery requires understanding exactly how the state defines your wages, caps your benefits, and judges your permanent physical damage.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Pennsylvania Workers Comp Works
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The state system is strictly overseen by the Pennsylvania Bureau of Workers Compensation, which enforces every regulation written into the Pennsylvania Workers Compensation Act. This is a purely no-fault system. You do not have to prove that your boss was negligent, that the company failed to maintain equipment, or that safety protocols were ignored. You simply need to prove that you were performing your job duties when the injury occurred.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In exchange for this streamlined no-fault protection, you forfeit the right to sue your employer directly for personal injury. From the moment you report the accident, a massive administrative machine activates. You and your employer must immediately file the required Pennsylvania LIBC forms to formalize your claim with the state. Whether you are dealing with a routine factory injury or negotiating a complex Philadelphia workers comp settlement, the insurance carrier will assign an adjuster to look for any legal excuse to deny your care. Understanding the specific benefits you are owed is your only defense against lowball offers.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Total Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When a workplace injury completely takes you off the schedule, you are entitled to Temporary Total Disability benefits. Under state law, your weekly check is standardly calculated at 66.67 percent of your pre-injury Average Weekly Wage. Lower-wage earners might receive a higher percentage, up to 90 percent, to ensure they can still afford basic survival. However, the state imposes a strict statutory ceiling on these payments, adjusted annually based on the statewide average weekly wage. While the maximum weekly benefit was <strong style={{ color: '#FBBF24' }}>$1,325 in 2024</strong>, the ceiling for injuries occurring in 2026 is currently set at <strong style={{ color: '#FBBF24' }}>$1,394 per week</strong>, subject to annual adjustment by the state.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Consider a real-world scenario. You work as a union electrician earning <strong style={{ color: '#FBBF24' }}>$1,800 per week</strong>. A scaffolding collapse shatters your femur, leaving you bedridden. Two-thirds of your $1,800 wage equals <strong style={{ color: '#FBBF24' }}>$1,200</strong>. Because your calculated rate falls below the 2026 statutory cap of $1,394, your tax-free weekly workers comp check will be exactly $1,200. The distinct advantage of Pennsylvania law is that there is no arbitrary time limit on total disability. If your injury is so catastrophic that you can never perform any kind of work again, you can theoretically collect that $1,200 every week for the rest of your life.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Pennsylvania IRE System and Partial Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because insurance companies loathe paying lifetime benefits, they rely on a unique legal mechanism to cap their financial bleeding: the Pennsylvania IRE impairment rating evaluation. This evaluation is the most critical pivot point in any long-term Pennsylvania workers comp permanent disability case. After you have received 104 weeks of total disability benefits, the insurance carrier has the legal right to force you to attend an exam with a state-appointed physician. This doctor uses the American Medical Association guidelines to assign a mathematical percentage to your whole-body physical impairment.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The financial stakes of this single exam are massive. If the doctor concludes your impairment rating is 35 percent or higher, you retain your total disability status, and your weekly checks continue without a timeline. But if the doctor assigns a rating of less than 35 percent — which happens in the overwhelming majority of insurance-demanded evaluations — the carrier will petition the state to officially change your status from total disability to partial disability.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your weekly check amount might remain exactly the same after this status change, but a deadly clock starts ticking. The state strictly caps partial disability benefits at a maximum of <strong style={{ color: '#E2E8F0' }}>500 weeks</strong>, which equates to roughly nine and a half years. Once you consume those 500 weeks, your wage loss benefits vanish permanently, even if your spine is still fused and you cannot physically tolerate sitting at a desk. When adjusters calculate a Pennsylvania impairment rating workers comp settlement, they are hyper-focused on this 500-week cap. They will never voluntarily offer a settlement that exceeds their remaining financial exposure under that 500-week limit.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Pennsylvania Specific Loss Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Not all workplace devastation is measured by missed paychecks. If a job site accident results in an amputation or the permanent loss of use of a body part, your sight, or your hearing, you are entitled to Pennsylvania specific loss benefits. This is a scheduled payout system that operates entirely separate from your standard wage loss claim. The state has predetermined exactly how many weeks of compensation a specific body part is worth, and you receive this money even if you return to work the very next day.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Imagine you are a machinist earning an average weekly wage that translates to an <strong style={{ color: '#FBBF24' }}>$800 weekly compensation rate</strong>. A press malfunction crushes your index finger, requiring surgical amputation. The state schedule dictates that the loss of an index finger commands 50 weeks of compensation. You are legally owed an automatic <strong style={{ color: '#FBBF24' }}>$40,000</strong> specific loss payment, plus an additional state-mandated healing period payout. The insurance company will inevitably try to dispute the extent of a &apos;loss of use&apos; claim by demanding a Pennsylvania IME, or Independent Medical Examination. They hire doctors trained to argue that you still have partial functionality, requiring an aggressive legal defense to secure your full scheduled payout.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Compromise and Release (C&amp;R) Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The ultimate goal for most injured workers is to sever ties with a hostile insurance carrier and secure their financial future through a lump-sum payout. In this state, a lump-sum settlement is legally executed through a Compromise and Release agreement. When you sign a C&amp;R, you are making a binding agreement to permanently close your case in exchange for a single, tax-free check.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Securing maximum value in a C&amp;R requires brutal financial calculus. If you are currently drawing <strong style={{ color: '#FBBF24' }}>$1,000 per week</strong> and you were recently downgraded to partial disability with 400 weeks remaining on your cap, your maximum future wage exposure is <strong style={{ color: '#FBBF24' }}>$400,000</strong>. No insurance company will simply hand you a check for $400,000 today because money depreciates over time. They will reduce the offer to its present value, often countering with <strong style={{ color: '#FBBF24' }}>$280,000</strong>. To bridge that gap, an aggressive negotiator will calculate the astronomical costs of your future medical care — decades of prescription pain medication, joint replacements, and physical therapy — using that leverage to force the lump sum substantially higher.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Factors Affecting Your Settlement and Third-Party Lawsuits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A harsh reality of the workers compensation system is that it does not care about your trauma. You cannot recover financial damages for your physical agony, emotional distress, or the fact that you can no longer play catch with your children. If you want to understand what those non-economic damages are worth in a civil courtroom, you can review a{' '}
                <Link href="/pain-and-suffering-calculator/pennsylvania/" style={{ color: '#60A5FA' }}>Pennsylvania pain and suffering calculator</Link>
                {', '}but those damages are strictly barred from workers comp claims.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There is one major exception. If your catastrophic injury was caused by a third party — such as a defective forklift manufacturer, a reckless driver who T-boned your delivery truck, or a negligent subcontractor on your job site — you can file a traditional personal injury lawsuit against them while simultaneously collecting workers comp benefits. Third-party lawsuits unlock the right to demand massive pain and suffering compensation. However, if you win that civil lawsuit, the workers comp insurance carrier holds a legal lien against your settlement. They will demand reimbursement for the medical bills and wages they already paid you. In certain complex administrative disputes where a carrier overpays benefits that a judge later determines were unearned, the insurance company can seek reimbursement directly from the Pennsylvania supersedeas fund rather than seizing the money out of your personal bank account.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Pennsylvania Workers Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Time is the ultimate weapon used against injured workers. The Pennsylvania workers comp statute of limitations demands that you file a formal Claim Petition with the state within exactly <strong style={{ color: '#E2E8F0' }}>three years</strong> from the date of your injury. Many workers fall into a trap where they notify their boss, accept some initial medical treatment paid by the company clinic, and assume their claim is secure. It is not. If an insurance adjuster strings you along with delays and you fail to file the official state petition before that three-year anniversary hits, your claim is permanently destroyed. You will never receive a settlement, and the financial burden of your medical care will fall entirely on your own shoulders.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-pa-faq-1',
                  question: 'What is the maximum weekly benefit rate in Pennsylvania?',
                  answer: 'The state automatically adjusts the maximum benefit rate every single year based on fluctuations in the statewide average weekly wage. For severe injuries occurring in 2026, the absolute maximum weekly benefit rate is capped at $1,394. This means that even if you were earning a massive corporate salary before the accident, your weekly tax-free compensation check simply cannot exceed this statutory ceiling.',
                  schemaAnswer: 'The maximum weekly benefit rate in Pennsylvania for 2026 injuries is $1,394, adjusted annually based on the statewide average weekly wage. Regardless of pre-injury salary, your weekly compensation check cannot exceed this statutory ceiling.',
                },
                {
                  id: 'wc-pa-faq-2',
                  question: 'Can my employer force me to accept a Compromise and Release?',
                  answer: 'No. A settlement is an entirely voluntary legal contract. Your employer and their insurance carrier have zero authority to force you into a lump-sum payout. If their financial offer fails to adequately cover your future medical needs and lost wages, you have the absolute right to reject the paperwork and continue drawing your weekly checks. Furthermore, a workers compensation judge must review and approve the settlement at a formal hearing to ensure you fully understand the rights you are surrendering.',
                  schemaAnswer: 'No. A Compromise and Release is voluntary — your employer cannot force you into it. You can reject any offer and continue drawing weekly checks. A workers compensation judge must also review and approve the settlement at a formal hearing.',
                },
                {
                  id: 'wc-pa-faq-3',
                  question: 'What happens if I return to work but make less money?',
                  answer: 'If your treating physician clears you for light-duty work but the new restricted role pays significantly less than your pre-injury average weekly wage, you do not simply lose your benefits. You are legally entitled to partial disability payments. The insurance carrier is required to pay you two-thirds of the exact difference between your old wage and your new lower wage, subject to the state maximum caps and the strict 500-week time limit.',
                  schemaAnswer: 'If you return to work at a lower wage, you are entitled to partial disability payments equal to two-thirds of the difference between your old and new wages, subject to state caps and the 500-week time limit.',
                },
                {
                  id: 'wc-pa-faq-4',
                  question: 'Does signing a settlement mean my medical coverage ends permanently?',
                  answer: 'It depends entirely on the specific language drafted into your Compromise and Release agreement. The majority of lump-sum settlements close out both the wage loss and the medical portions of your claim, meaning you take the cash and assume full responsibility for all future surgeries and prescriptions. However, skilled negotiators can often structure a settlement that pays out a large lump sum for your wages while legally forcing the insurance company to keep your medical claim open indefinitely for injury-related care.',
                  schemaAnswer: 'Most Compromise and Release agreements close both wage loss and medical portions. However, skilled negotiators can sometimes structure a settlement that closes wage loss while keeping the medical claim open indefinitely.',
                },
                {
                  id: 'wc-pa-faq-5',
                  question: 'How long do I actually have to report my injury to my employer?',
                  answer: 'While the absolute statute of limitations to file a formal claim petition is three years, Pennsylvania law imposes a much faster preliminary deadline. You are required to notify your employer that you suffered a work-related injury within exactly 120 days of the accident. If you try to tough it out and fail to inform a manager or supervisor before that 120-day window slams shut, you completely forfeit your right to claim any workers compensation benefits whatsoever.',
                  schemaAnswer: 'Pennsylvania requires you to notify your employer of a work-related injury within 120 days of the accident. Missing this window forfeits all workers compensation benefits, even though the formal claim petition deadline is three years.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Protect Your Future
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Fighting a multi-billion dollar insurance conglomerate on your own is the fastest way to bankrupt your family. Adjusters are highly trained corporate negotiators whose sole directive is to close your file for pennies on the dollar. Before you give a recorded statement, submit to an independent medical exam, or consider signing a Compromise and Release, you need a precise accounting of your future losses. Use a{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}to establish the baseline mathematics of your wages and impairment rating, then demand the maximum financial compensation that Pennsylvania law mandates.
              </p>

            </article>

          ) : stateData.slug === 'ohio' ? (
            /* ─────────────────────────────────────────────────────────────────
               OHIO — converted from public/wc-ohio-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                When you hear a sudden, sickening snap in your shoulder on the factory floor, your first thought is the blinding physical pain. By the third week, however, that physical pain is eclipsed by financial panic. You are staring at an MRI bill you cannot afford, your rent is due in three days, and the claims examiner assigned to your case is suddenly very difficult to reach. You do not just need a rough estimate of what your claim might be worth; you need to understand exactly how the state values your injury and your future. If you are searching for an accurate Ohio workers comp settlement calculator, you must first realize that Ohio does not calculate workplace injuries like most of the rest of the country. This is a highly specialized legal battlefield, and knowing the state-specific math is the only way to protect your financial survival.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Ohio BWC Monopolistic System
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In most states, if you get hurt on the job, you deal with your employer&apos;s private insurance company — a massive corporate entity like Liberty Mutual or Travelers. Ohio operates under a completely different statutory framework. It is one of only four states with a monopolistic state fund system. This means private workers comp insurance is simply not available on the open market. Almost every business in the state must purchase their coverage directly through the Ohio Bureau of Workers Compensation, widely known as the Ohio BWC.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There is a limited exception for massive corporations and hospital networks that qualify as self-insured employers, but even those massive companies must strictly adhere to the rules, procedures, and payment schedules set by the state legislature. You are not fighting a standard insurance corporation; you are navigating a massive state bureaucracy. This dynamic dictates exactly how an Ohio BWC settlement is negotiated, funded, and ultimately approved.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Understanding Your TTD Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Before you even think about negotiating a final settlement, you must survive the immediate financial crisis of being unable to clock in. Temporary Total Disability, or TTD, is the lifeline that keeps your household afloat. Under Ohio law, the calculation actually changes depending on how long you are forced out of work. For the first twelve weeks of your disability, you receive <strong style={{ color: '#E2E8F0' }}>seventy-two percent</strong> of your full weekly wage. Starting on week thirteen, your compensation shifts downward to the standard TTD rate, which equals <strong style={{ color: '#E2E8F0' }}>66.67% of your average weekly wage</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let&apos;s look at the concrete math. If you averaged <strong style={{ color: '#FBBF24' }}>$1,200 a week</strong> before a forklift crushed your foot, your standard TTD checks will be roughly <strong style={{ color: '#FBBF24' }}>$800 a week</strong>. The state does, however, impose a strict statutory ceiling. For injuries occurring in 2026, the maximum weekly TTD rate is capped at <strong style={{ color: '#FBBF24' }}>$1,281</strong>, though this figure is subject to annual adjustment by the state based on statewide economic metrics. The state fund pays this wage replacement only until a designated doctor declares that you have reached maximum medical improvement, meaning your condition has stabilized and will not significantly improve with further active treatment — there is no fixed week limit on TTD itself, though R.C. 4123.56(A) requires a medical examination after 200 weeks of continuous total disability to check whether you have reached that point.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Ohio PPD Awards and Scheduled Losses
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once you reach maximum medical improvement, the legal focus shifts from your immediate recovery to your permanent damage. This is where the Ohio Industrial Commission steps in. While the BWC handles the administrative side and initial claim payments, the Industrial Commission is the separate, adjudicative body that conducts hearings and determines the monetary value of your permanent impairment. If your injury leaves you with lasting physical limitations, you have the right to seek an Ohio permanent partial disability award.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Unlike some states that simply assign a flat dollar value to a specific medical diagnosis, an Ohio permanent partial disability is calculated based on a percentage of impairment to your whole person. A state-sanctioned doctor will physically examine you and assign an impairment rating. If the doctor determines your crushed foot results in a <strong style={{ color: '#E2E8F0' }}>ten percent whole person impairment</strong>, state statutes dictate exactly how many weeks of pay that percentage represents. You receive two weeks of compensation for every one percent of impairment. Therefore, a ten percent rating equals twenty weeks of pay at a statutorily capped weekly rate.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Ohio also maintains a parallel system of scheduled awards for catastrophic injuries involving amputations or total loss of use. If you lose an arm, a leg, or an eye, the statute bypasses the percentage system and assigns a strict, predetermined number of weeks of compensation. For example, the total amputation or loss of use of a hand guarantees <strong style={{ color: '#E2E8F0' }}>one hundred and seventy-five weeks</strong> of pay at the maximum weekly rate, regardless of your actual historical wage history.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Negotiating an Ohio Workers Comp Lump Sum Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Receiving ongoing weekly wage checks or staggered impairment awards is standard procedure, but eventually, you or the state may want to close the books on the claim entirely. In this state, an Ohio workers comp lump sum settlement is formally known as a C-240 settlement, or simply a settlement agreement. When you sign a C-240, you are permanently trading your right to any future wage loss payments and medical coverage related to the injury for a single, final financial payout.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                State administrators love lump sum settlements because it permanently caps their financial exposure to your medical future. You must approach an Ohio lump sum settlement with extreme caution. If your settlement check is <strong style={{ color: '#FBBF24' }}>$40,000</strong>, but your physician determines you require a <strong style={{ color: '#FBBF24' }}>$60,000</strong> spinal fusion surgery three years from now, you will be paying for that operation entirely out of your own pocket. The state will not reopen a fully settled claim simply because your condition worsened.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Trap of Ohio Allowed Conditions
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Perhaps the most dangerous legal trap in the entire state system is the concept of Ohio allowed conditions. The Ohio BWC does not simply accept that you hurt your back at work and agree to pay for everything related to your spine. They only cover the exact, specific medical diagnoses that they formally &quot;allow&quot; in your official claim file.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Imagine you fall off a ladder and suffer a devastating herniated disc. The emergency room doctor quickly jots down that you have a lumbar sprain. The BWC swiftly approves the claim for a lumbar sprain and pays for a few weeks of physical therapy. But when the pain refuses to subside and an MRI reveals the herniated disc requiring surgery, the BWC will flatly deny the surgical request. Why? Because a herniated disc is not an allowed condition on your claim. Disputes over allowed conditions are the most common battleground at the Industrial Commission. If you do not legally force the state to add the more severe diagnoses to your official file, your future settlement value will be anchored to a minor sprain, not a major surgical injury.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Statute of Limitations and Filing the FROI
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Time is your absolute worst enemy after a workplace injury. The Ohio workers comp statute of limitations is ruthlessly strict. You have exactly <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of your injury to officially file your claim. This is accomplished by submitting the First Report of Injury, commonly referred to as the Ohio FROI. If you simply notify your shift supervisor but fail to ensure the Ohio FROI is actually filed with the state within that two-year window, your claim will be permanently barred. You will lose all rights to medical coverage, wage replacement, and settlement negotiations, no matter how severe your injuries are or how obviously the accident occurred at work.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability Applications
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                While a standard settlement closes out a claim for a single check, some catastrophic injuries completely destroy your earning capacity forever. If your workplace injury is so severe that it prevents you from engaging in any sustained remunerative employment for the rest of your life, you can file an Ohio PTD application. Permanent Total Disability is not a single settlement check; it is a lifetime pension. Winning a PTD claim is incredibly difficult, requiring extensive vocational and medical expert testimony to prove that your specific allowed conditions make it impossible for you to hold even a sedentary, minimum-wage job.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Leveraging Settlement Calculators
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Accurately pricing a final buyout requires projecting decades of future medical inflation and lost earning potential. When you use a reliable{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {', '}you gain a baseline understanding of what your future wage loss and medical care actually cost in today&apos;s dollars.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, you must remember a critical legal truth: workers comp does not cover pain and suffering. If you are looking to be compensated for the emotional trauma, the physical agony of the accident itself, or the loss of enjoyment of your life, you are looking in the wrong venue. You can explore our{' '}
                <Link href="/pain-and-suffering-calculator/ohio/" style={{ color: '#60A5FA' }}>Ohio pain and suffering calculator</Link>
                {' '}for third-party personal injury claims against negligent outsiders, but inside the BWC system, your settlement is based strictly on concrete medical bills, impairment ratings, and mathematical wage loss figures.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-oh-faq-1',
                  question: 'Does an Ohio BWC settlement close my medical coverage forever?',
                  answer: 'Yes, if you sign a full C-240 lump sum settlement agreement, it permanently closes your claim. The state will pay you a single check, and in exchange, you agree to take on all future medical expenses related to your workplace injury. You cannot go back to the BWC five years later and ask them to cover a sudden surgery.',
                  schemaAnswer: 'Yes. A full C-240 lump sum settlement permanently closes your claim. You receive a single check and assume all future medical expenses. You cannot reopen the claim for future surgeries or treatment.',
                },
                {
                  id: 'wc-oh-faq-2',
                  question: 'Can I get fired while on workers comp in Ohio?',
                  answer: 'Ohio is an at-will employment state, meaning your employer can terminate your employment at almost any time. However, it is strictly illegal for an employer to terminate you specifically in retaliation for filing a workers compensation claim. If they lay you off due to broader company downsizing while you are recovering, your BWC wage benefits generally continue, but your actual job does not.',
                  schemaAnswer: 'Ohio is at-will, so employers can generally terminate employment. However, it is illegal to fire you in retaliation for filing a workers comp claim. BWC wage benefits typically continue during layoffs unrelated to the claim.',
                },
                {
                  id: 'wc-oh-faq-3',
                  question: 'How long does an Ohio BWC settlement take to get approved?',
                  answer: 'Once you and the BWC agree on a final settlement number and sign the C-240 paperwork, the agreement must be submitted to the Ohio Industrial Commission. The state mandates a strict thirty-day waiting period, which acts as a cooling-off window where either party can back out of the deal. After those thirty days expire without an objection, it typically takes another two to three weeks for the final settlement check to actually arrive in your mail.',
                  schemaAnswer: 'After signing the C-240 paperwork, the Ohio Industrial Commission mandates a 30-day cooling-off period. After expiration without objection, expect an additional 2-3 weeks for the settlement check to arrive.',
                },
                {
                  id: 'wc-oh-faq-4',
                  question: 'Do I pay taxes on an Ohio workers comp lump sum settlement?',
                  answer: 'Under state and federal tax codes, workers compensation settlements are generally not considered taxable income. The IRS views these funds as compensation for physical injuries and lost wages rather than standard earned income. However, if you are also receiving Social Security Disability benefits, the way your settlement agreement is drafted can heavily impact your federal tax liabilities, which requires highly specialized legal structuring.',
                  schemaAnswer: 'Workers compensation settlements are generally not taxable income under state and federal tax codes. However, if you receive Social Security Disability benefits simultaneously, the settlement structure can impact your federal tax liabilities and requires specialized legal drafting.',
                },
                {
                  id: 'wc-oh-faq-5',
                  question: 'Does an Ohio workers comp settlement include pain and suffering?',
                  answer: 'No. The monopolistic state system is designed as a no-fault compromise. You do not have to prove your employer was negligent to get your medical bills paid, but in exchange for that ease, you forfeit the legal right to sue your employer for pain, suffering, emotional distress, or loss of enjoyment of life. Your payout is strictly calculated using medical expenses, wage loss figures, and standardized impairment ratings.',
                  schemaAnswer: 'No. Ohio workers comp settlements do not include pain and suffering. The no-fault system covers medical expenses, wage loss, and impairment ratings, but you forfeit the right to sue your employer for non-economic damages.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Take Control of Your Claim Today
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You only get one chance to settle your Ohio workplace injury claim. The massive state bureaucracy is perfectly content to let you walk away with a fraction of what your future medical care will actually cost. Do not let unrepresented allowed conditions or aggressive claims examiners ruin your long-term financial stability. You must review your exact medical records, forcefully calculate your true long-term wage loss, and relentlessly demand the maximum compensation that Ohio law dictates you deserve.
              </p>

            </article>

          ) : stateData.slug === 'north-carolina' ? (
            /* ─────────────────────────────────────────────────────────────────
               NORTH CAROLINA — converted from public/wc-north-carolina-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                Getting hurt on the job in North Carolina flips your financial world upside down in an instant. One moment you are pulling a shift at a manufacturing plant in Charlotte or framing a house in Raleigh, and the next, you are facing mounting medical bills and a sudden halt to your weekly paycheck. When the dust settles and you reach the point of maximum medical recovery, you are left staring at a complicated legal landscape administered by the North Carolina Industrial Commission, commonly referred to as the NC IC. You need to know exactly what your claim is worth, how the insurance company is valuing your physical permanent damage, and whether you should accept a lump sum payout to close your case forever.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                While a baseline north carolina workers comp settlement calculator can give you a rough estimate of your potential payout, the actual math dictating your financial recovery is strictly controlled by state statutes. The insurance adjuster is not pulling numbers out of thin air. They are using a rigid formula based on your pre-injury wages, the specific body part you injured, and the exact percentage of permanent impairment assigned by your doctor. Understanding how this statutory math works is the only way to protect yourself from accepting a lowball offer that leaves you financially exposed down the road.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How the North Carolina Workers Comp System Operates
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                North Carolina workers compensation is fundamentally a grand compromise between labor and management. When you are injured in the scope of your employment, you do not have to prove that your boss was negligent, careless, or at fault. Even if you tripped over your own two feet while carrying a box of supplies, your injuries are covered. In exchange for this no-fault coverage, you give up the right to sue your employer directly in civil court for personal injury damages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because you cannot file a traditional personal injury lawsuit against your boss, the workers comp system entirely excludes compensation for your emotional distress and physical agony. Workers comp does not cover pain and suffering. If your workplace injury was caused by a negligent third party, such as an outside delivery driver who backed into you on the loading dock or a subcontractor who dropped a tool on your head, you can step outside the workers comp system and file a third-party lawsuit against that specific person or company. In those specific third-party scenarios, you can pursue damages for your physical agony, and running your numbers through a{' '}
                <Link href="/pain-and-suffering-calculator/north-carolina/" style={{ color: '#60A5FA' }}>North Carolina pain and suffering calculator</Link>
                {' '}becomes highly relevant. But if your claim is strictly against your employer, your financial recovery is limited to medical coverage and wage replacement.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A major concern for many injured workers is the fear of losing their livelihood. North Carolina is notoriously an at-will employment state, meaning an employer can generally terminate an employee for almost any reason. However, state law draws a hard line when it comes to workplace injuries. Firing you in retaliation for filing a workers compensation claim is strictly illegal. If your employer terminates you simply because you exercised your right to seek medical treatment and wage replacement under the NC IC rules, you have grounds for a separate retaliatory employment discrimination lawsuit.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Calculating Your Temporary Total Disability (TTD) Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When the doctor writes you completely out of work to heal, you are entitled to Temporary Total Disability benefits, known as TTD. Under North Carolina law, your TTD rate is strictly set at <strong style={{ color: '#E2E8F0' }}>66.67 percent</strong> of your Average Weekly Wage. To find your Average Weekly Wage, the insurance company will look at your gross earnings over the 52 weeks immediately preceding your injury, including overtime and bonuses, and divide that total by 52.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Consider a concrete mathematical scenario. Imagine you work as a heavy equipment operator making a gross average of <strong style={{ color: '#FBBF24' }}>$1,200 per week</strong>. If you suffer a severe herniated disc and require spinal fusion surgery, your TTD compensation rate will be exactly <strong style={{ color: '#FBBF24' }}>$800 per week</strong>. These checks are completely tax-free. However, North Carolina law imposes a cap on these wage replacement benefits to protect the insurance system from astronomical payouts to high-income earners. For {stateData.weeklyCapEffectivePeriod}, the maximum weekly benefit is capped at <strong style={{ color: '#FBBF24' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong>, subject to annual adjustment by the state. If you are an executive making <strong style={{ color: '#FBBF24' }}>$4,000 a week</strong>, you will not receive two-thirds of your actual wage; you will hit that statutory ceiling and receive the maximum allowable weekly rate.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', fontSize: '14px' }}>
                <em>Standard TTD is limited to 500 weeks, but extended compensation may be available beyond that for total and permanent disability once the injured worker has received 425 weeks of benefits (G.S. 97-29).</em>
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Your North Carolina PPD Rating and the Body Part Schedule
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most critical phase of a North Carolina workers comp settlement occurs when your treating physician declares that you have reached Maximum Medical Improvement. This simply means your healing has plateaued. You are as good as you are going to get with medical intervention. If you are not completely back to your pre-injury physical baseline, the doctor will assign you a North Carolina workers comp rating, officially known as a Permanent Partial Disability rating.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                North Carolina uses the AMA Guides to the Evaluation of Permanent Impairment to determine this percentage. This rating represents the permanent loss of use of a specific body part. To translate this medical percentage into actual dollars, the state utilizes a strict schedule of injuries that assigns a maximum number of weeks of compensation to every major body part. Under this schedule, your back is worth <strong style={{ color: '#E2E8F0' }}>300 weeks</strong>. Your arm is valued at <strong style={{ color: '#E2E8F0' }}>240 weeks</strong>. Your leg is worth <strong style={{ color: '#E2E8F0' }}>200 weeks</strong>, your hand is worth <strong style={{ color: '#E2E8F0' }}>200 weeks</strong>, and your thumb alone represents <strong style={{ color: '#E2E8F0' }}>75 weeks</strong> of compensation.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let us run the concrete math on a North Carolina workers comp permanent partial disability payout. We will return to our heavy equipment operator making an Average Weekly Wage of $1,200, which results in a TTD compensation rate of $800 per week. Imagine his spinal fusion is successful, but he is left with chronic stiffness. His doctor assigns a 15 percent North Carolina PPD rating to his back. The law states the back is worth 300 weeks. We multiply those 300 weeks by the 15 percent impairment rating, which results in 45 weeks of owed compensation. We then multiply those 45 weeks by his $800 weekly compensation rate. The insurance company owes him exactly <strong style={{ color: '#FBBF24' }}>$36,000</strong> for his permanent physical damage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                When the insurance company agrees to pay out this specific rating, the transaction is typically formalized using a North Carolina Form 26A. This specific document is the Agreement to Compensation. Signing a Form 26A means you agree with the impairment rating and accept the corresponding payout, but importantly, it usually leaves your right to future medical treatment open for a specified period, typically two years from your last medical payment. It is a structured payout for your impairment, not a final closure of your entire file.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                North Carolina Clincher Agreements for a Full Lump Sum
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Many injured workers do not want to keep dealing with the workers comp insurance adjuster for years to come. They want to settle everything, close the medical coverage, and walk away with a single, large check. In this state, a full and final North Carolina workers comp lump sum settlement is known as a clincher agreement.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A clincher agreement completely severs your relationship with the workers comp insurance company. You are cashing out your permanent partial disability rating, plus the estimated cost of all your future medical care, plus any potential future wage loss, in exchange for closing the claim forever. If your surgically repaired back fails three years down the road and requires another operation, the insurance company will not pay a single dime if you have signed a clincher. You bear the future risk entirely.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because you are signing away your right to future medical care, every single North Carolina clincher agreement must be heavily scrutinized and formally approved by the NC IC. The Commission acts as a safeguard to ensure the insurance company is not taking advantage of a desperate worker by offering pennies on the dollar for a severe injury.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To visualize a clincher calculation, let us look at our equipment operator with the <strong style={{ color: '#FBBF24' }}>$36,000</strong> impairment rating on his back. If his doctor estimates he will need <strong style={{ color: '#FBBF24' }}>$15,000</strong> in medication and physical therapy over the next ten years, and perhaps another <strong style={{ color: '#FBBF24' }}>$30,000</strong> for a potential hardware removal surgery, his attorney might negotiate a final clincher agreement of <strong style={{ color: '#FBBF24' }}>$81,000</strong>. This single check pays for the permanent damage and transfers the burden of funding his future medical needs directly to him.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Strict North Carolina Workers Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Time is the ultimate enemy in the legal world. The North Carolina workers comp statute of limitations requires you to formally file your claim within exactly <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of your injury. Many workers make the tragic mistake of assuming their claim is officially filed just because they told their supervisor about the accident or because the company doctor treated them at the occupational health clinic. Reporting the injury to your boss does not stop the legal clock.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To protect your rights, you or your attorney must file a Form 18 Notice of Accident directly with the North Carolina Industrial Commission. If you simply treat conservatively through the company clinic for two and a half years, and then your knee suddenly gives out requiring major surgery, you will discover that your claim is entirely barred. The insurance company will legally deny the surgery, and the NC IC will uphold that denial because you missed the two-year statutory window to lock in your jurisdiction.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Navigating Attorney Fees
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you are negotiating a six-figure clincher agreement involving future surgical risks, handling the adjuster alone is incredibly dangerous. Hiring a legal professional levels the playing field, but you need to understand how the money works. A North Carolina workers comp attorney operates on a strict contingency fee basis, meaning they only get paid if they secure a settlement or a beneficial ruling for you. State law strictly caps these attorney fees at a maximum of <strong style={{ color: '#E2E8F0' }}>25 percent</strong> of your recovery. Furthermore, the NC IC must independently review and approve all attorney fees to ensure they are fair and legally compliant. If your attorney negotiates an <strong style={{ color: '#FBBF24' }}>$80,000</strong> clincher agreement, the maximum fee they can collect is <strong style={{ color: '#FBBF24' }}>$20,000</strong>, leaving you with a net recovery of <strong style={{ color: '#FBBF24' }}>$60,000</strong>. You never pay hourly rates out of your own pocket.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because every single body part has a different statutory value, and every worker has a different Average Weekly Wage, it is impossible to state a generic average settlement amount. The dollar figures are always driven by your pre-injury earning power and the severity of the permanent anatomical damage — see the worked example below for how the underlying formula produces a number.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-nc-faq-1',
                  question: 'Does North Carolina workers comp pay for my pain and suffering?',
                  answer: 'No, the workers compensation system completely prohibits financial recovery for physical pain, emotional trauma, or diminished quality of life. The system strictly pays for your authorized medical treatment and a portion of your lost wages. The only way to recover pain and suffering damages for an on-the-job injury is if you can prove a negligent third party, such as an independent contractor or a defective product manufacturer, caused your accident, allowing you to file a separate civil lawsuit outside the workers comp system.',
                  schemaAnswer: 'No. Workers comp prohibits recovery for pain and suffering. It covers authorized medical treatment and lost wages only. Pain and suffering is only recoverable via a separate civil lawsuit against a negligent third party who caused the workplace injury.',
                },
                {
                  id: 'wc-nc-faq-2',
                  question: 'Can my employer legally fire me for reporting my workplace injury?',
                  answer: 'North Carolina is an at-will employment state, but terminating your employment in retaliation for asserting your workers compensation rights is a direct violation of state law. The Retaliatory Employment Discrimination Act protects you from being fired or demoted simply because you reported an injury or hired an attorney to file a claim with the North Carolina Industrial Commission.',
                  schemaAnswer: 'No. While North Carolina is at-will, the Retaliatory Employment Discrimination Act prohibits firing or demoting an employee for reporting a workplace injury or filing a claim with the NC Industrial Commission.',
                },
                {
                  id: 'wc-nc-faq-3',
                  question: 'Who actually decides what my permanent impairment rating will be?',
                  answer: 'Your authorized treating physician is responsible for assigning your permanent partial disability rating once you reach Maximum Medical Improvement. The doctor must calculate this percentage using the specific guidelines established by the state. If you feel the company-chosen doctor gave you an artificially low impairment rating to save the insurance company money, you have the legal right to request a second opinion regarding your rating from a physician of your own choosing.',
                  schemaAnswer: 'Your authorized treating physician assigns your permanent partial disability rating at Maximum Medical Improvement using state guidelines. If you believe the rating is artificially low, you have the legal right to seek a second opinion from a physician of your own choosing.',
                },
                {
                  id: 'wc-nc-faq-4',
                  question: 'Do I have to sign a clincher agreement if the insurance adjuster offers one?',
                  answer: 'No, a clincher agreement is an entirely voluntary legal contract. The insurance company cannot force you to accept a lump sum settlement, and you cannot force the insurance company to offer one. If you prefer to keep your right to future medical treatment open, you can simply accept payment for your PPD rating through a Form 26A and decline the final clincher.',
                  schemaAnswer: 'No. A clincher agreement is entirely voluntary. Neither side can force the other to sign. If you prefer to preserve future medical coverage, you can accept PPD payment via Form 26A without signing a final clincher.',
                },
                {
                  id: 'wc-nc-faq-5',
                  question: 'How much will it cost me to hire a lawyer for my North Carolina claim?',
                  answer: 'You will not pay any upfront costs or hourly billing fees. Attorneys practicing before the North Carolina Industrial Commission work on a strict contingency fee basis that is capped by law at 25 percent of your financial recovery. The Commission must review and formally approve the lawyer\'s fee before any money is deducted from your final settlement check.',
                  schemaAnswer: 'No upfront costs or hourly fees. NC workers comp attorneys work on contingency, capped by law at 25% of your recovery. The NC Industrial Commission must review and approve the attorney fee before any deduction from your settlement.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Take the Next Step in Your Claim
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The insurance adjuster is already calculating the absolute minimum they have to pay to close your file. You cannot afford to guess about the statutory value of your body parts or the long-term cost of your future medical care. Leverage the{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>North Carolina workers comp settlement calculator</Link>
                {' '}to establish your baseline, review your Average Weekly Wage documentation, and ensure your PPD rating accurately reflects the physical damage you have suffered. If you are facing a permanent injury, reaching out for a professional legal consultation is the safest way to ensure the North Carolina Industrial Commission approves a clincher agreement that truly protects your financial future.
              </p>

            </article>

          ) : stateData.slug === 'arizona' ? (
            /* ─────────────────────────────────────────────────────────────────
               ARIZONA — converted from public/wc-arizona-content.md
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                When you get hurt on the job in the Grand Canyon State, you quickly learn that the Arizona workers compensation system speaks its entirely own language. Suddenly, you are navigating complex bureaucratic formulas, fighting for proper medical care, and dealing with an alphabet soup of state agencies. If your injury is severe enough to leave you with permanent physical limitations, you are likely trying to figure out how much your case is actually worth. You are probably looking for an Arizona workers comp settlement calculator to give you a straightforward number. But in Arizona, your eventual payout depends on an incredibly specific set of statutory rules that categorize your injury based on the specific body part affected.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                To protect your financial future, you must understand exactly how the state values your lost earning capacity, how your wage replacement is calculated, and what it legally takes to secure a full Arizona workers comp lump sum. We are going to break down the exact math and legal strategy you need to evaluate your claim like an attorney.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Arizona Workers Comp Works
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The Arizona Industrial Commission, commonly referred to as the Arizona ICA, is the state agency responsible for overseeing all work injury claims. Under state law, this operates as a strict no-fault system. You do not have to prove that your employer was negligent, reckless, or malicious to get your medical bills covered. Even if you made a careless mistake that caused your own injury, you are generally fully covered. In exchange for this guaranteed medical safety net, the law prevents you from suing your employer for non-economic damages like pain and suffering.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, the entire financial side of your recovery revolves around one vital administrative metric: your <strong style={{ color: '#E2E8F0' }}>average monthly wage</strong>. Shortly after your workplace accident, the insurance carrier and the Arizona ICA will review your payroll records from the thirty days immediately prior to your injury to lock in this number. Once the Industrial Commission issues a formal notice setting your average monthly wage, that specific dollar amount dictates every single financial benefit you receive for the life of your claim. If the insurance adjuster miscalculates your bonuses or overtime during this window, your settlement will be permanently undervalued.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Total Disability Benefits and the Wage Cap
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                While you are actively recovering and your doctor says you cannot work at all, you are entitled to Temporary Total Disability benefits. Arizona law mandates that your temporary disability rate is exactly <strong style={{ color: '#E2E8F0' }}>66.67%</strong> of your established average monthly wage. If you are married or have dependents, the state adds a nominal extra <strong style={{ color: '#FBBF24' }}>$25</strong> per month to your check.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Let us look at the concrete dollar math. If you earned <strong style={{ color: '#FBBF24' }}>$3,000</strong> a month before your accident, your temporary disability checks will total roughly <strong style={{ color: '#FBBF24' }}>$2,000</strong> a month, paid out bi-weekly. But what happens if you are a high earner? Arizona actually utilizes a very high maximum average monthly wage limit, which is subject to annual adjustment by the ICA based on inflation and economic indexes.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For workplace injuries occurring in 2026, the ICA capped the maximum average monthly wage at <strong style={{ color: '#FBBF24' }}>$6,131.00</strong>. This means that even if you earn <strong style={{ color: '#FBBF24' }}>$12,000</strong> a month as an executive or a specialized union contractor, the state system calculates your 66.67% rate using that $6,131.00 ceiling. Therefore, your absolute maximum monthly temporary benefit tops out at approximately <strong style={{ color: '#FBBF24' }}>$4,087</strong>. If your doctor clears you to return to work on light duty but you are earning less than your pre-injury wage, you shift to Temporary Partial Disability, where the insurance company pays 66.67% of the difference between your old wage and your new light-duty pay. Under A.R.S. § 23-1045, Arizona sets no fixed week limit on temporary disability — these checks continue until your treating physician declares you &quot;medically stationary,&quot; Arizona&apos;s term for maximum medical improvement.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Scheduled vs. Unscheduled Injuries: The Core of Arizona Value
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once you complete your surgeries and physical therapy, your primary treating physician will place you at Maximum Medical Improvement. If you do not make a 100% full recovery, your doctor will assign you an Arizona workers comp impairment rating. This is where you encounter the most critical legal concept in Arizona permanent disability workers comp: the strict dividing line between <strong style={{ color: '#E2E8F0' }}>scheduled</strong> and <strong style={{ color: '#E2E8F0' }}>unscheduled injuries</strong>. Your financial future depends entirely on which side of this line your injury falls.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you injure a specific extremity — like your arm, hand, leg, foot, or your vision or hearing — Arizona treats this as a scheduled injury. The state legislature has pre-assigned a rigid maximum number of months of compensation for each of these body parts under the law. For example, a total loss of use of a major dominant arm entitles you to <strong style={{ color: '#E2E8F0' }}>60 months</strong> of compensation. A minor hand entitles you to <strong style={{ color: '#E2E8F0' }}>40 months</strong>. If your doctor gives you a 10% impairment rating on your dominant arm, you receive 10% of those 60 months, which equals six months of Arizona PPD checks. These scheduled permanent partial disability payments are typically paid out at <strong style={{ color: '#E2E8F0' }}>55%</strong> of your average monthly wage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Conversely, if you injure your spine, neck, head, hips, or if you injure multiple scheduled body parts in the same accident, you have what is called an <strong style={{ color: '#E2E8F0' }}>unscheduled injury</strong>. Unscheduled injuries are not paid based on a rigid chart of body parts. Instead, they are compensated based on your <strong style={{ color: '#E2E8F0' }}>Loss of Earning Capacity</strong>. The Industrial Commission will look at your physical restrictions and determine how much less money you are capable of earning in the open labor market compared to before your accident.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Proving this loss requires aggressive legal work, often involving functional capacity evaluations and vocational experts. If your pre-injury average monthly wage was <strong style={{ color: '#FBBF24' }}>$4,000</strong>, but your permanent lumbar fusion restricts you to a desk job paying only <strong style={{ color: '#FBBF24' }}>$2,500</strong> a month, your loss of earning capacity is <strong style={{ color: '#FBBF24' }}>$1,500</strong>. You will generally receive 55% of that $1,500 difference every single month. Because unscheduled benefits can theoretically be awarded for the rest of your life, these cases almost always result in the largest Arizona workers comp settlement payouts.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Securing an Arizona Workers Comp Lump Sum Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Instead of dealing with the insurance company for decades and receiving small monthly checks, many injured workers prefer to negotiate an Arizona workers comp lump sum settlement. In the local legal community, this is typically referred to as a <strong style={{ color: '#E2E8F0' }}>Full and Final Settlement under A.R.S. § 23-1067</strong>. In this scenario, you agree to close out your entire workers compensation claim — including your right to any future medical care — in exchange for a single, tax-free check.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                However, you cannot just sign a piece of paper with the insurance adjuster and walk away with your money. Every single full and final settlement requires formal approval from the Industrial Commission of Arizona. An administrative law judge must review the settlement documents to ensure the financial deal is genuinely in your best interest and that you fully comprehend that you are permanently abandoning your medical safety net. If your injury will require future joint replacements or expensive lifelong pain management, you must mathematically project those future medical costs and demand the insurance company include them in your lump sum before you ever consider signing. Furthermore, if you are a Medicare beneficiary, federal law requires you to establish a Medicare Set-Aside account to ensure the federal government does not end up paying for your future work-related medical treatment.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Key Factors That Alter Your Claim&apos;s Value
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Several external legal elements will drive the final output of any accurate settlement valuation. First, you must account for Arizona workers comp attorney fees. The ICA heavily regulates what lawyers can charge injured workers to prevent price gouging. Under A.R.S. § 23-1069, your attorney generally cannot take more than <strong style={{ color: '#E2E8F0' }}>25%</strong> of your settlement or award. This fee cap ensures that the vast majority of the settlement money stays directly in your pocket to fund your long-term recovery.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Second, you must look beyond the workers compensation system to maximize your financial outcome. While the ICA system absolutely does not cover pain and suffering, you might have strong legal grounds for a third-party lawsuit. If an outside vendor, a negligent delivery driver, or the manufacturer of a defective piece of heavy machinery caused your workplace accident, you can sue that specific entity directly in civil court. Arizona is a pure comparative fault state, which means you can successfully recover civil damages even if you were 90% to blame for your own accident, though your final jury award will simply be reduced by your percentage of fault. A third-party civil claim is the only legal avenue where you can demand massive compensation for your physical agony and mental trauma — and running your numbers through an{' '}
                <Link href="/pain-and-suffering-calculator/arizona/" style={{ color: '#60A5FA' }}>Arizona pain and suffering calculator</Link>
                {' '}becomes highly relevant in those scenarios.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                The Unforgiving Arizona Workers Comp Statute of Limitations
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Time is the biggest threat to your financial recovery. The Arizona workers comp statute of limitations is remarkably strict. You must file a formal Worker&apos;s and Physician&apos;s Report of Injury directly with the Industrial Commission within <strong style={{ color: '#E2E8F0' }}>one year</strong> from the date your workplace accident occurred, or within one year from the date you first became aware of an occupational illness.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Simply telling your manager about your bad back or filling out an internal HR incident report does not satisfy this legal requirement. It does not stop the clock. If you fail to ensure your official claim paperwork is filed with the Arizona ICA within that one-year statutory window, you will permanently lose your right to claim any medical benefits, wage replacement, or a future settlement.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={[
                {
                  id: 'wc-az-faq-1',
                  question: 'What exactly is the role of an impairment rating?',
                  answer: 'Your impairment rating translates your physical, anatomical damage into a hard percentage. For scheduled injuries like arms and legs, this percentage dictates the exact number of months you will receive permanent partial disability checks. For unscheduled injuries like spine trauma, the rating is simply one piece of medical evidence used by the judge to help determine your overall loss of earning capacity.',
                  schemaAnswer: 'An impairment rating converts physical damage into a percentage. For scheduled injuries it dictates the exact number of PPD benefit months. For unscheduled injuries it is one piece of evidence the judge uses to calculate your overall loss of earning capacity.',
                },
                {
                  id: 'wc-az-faq-2',
                  question: 'Can I get paid for my pain and suffering in an ICA claim?',
                  answer: 'No, the Arizona workers compensation system is an exclusive remedy that strictly covers your authorized medical bills and a portion of your lost wages. To obtain non-economic damages, you must pursue a separate third-party civil lawsuit against a negligent outside party. You can explore those potential civil values using an Arizona pain and suffering calculator.',
                  schemaAnswer: 'No. The Arizona ICA system covers only authorized medical bills and a portion of lost wages. To recover non-economic pain and suffering damages you must file a separate third-party civil lawsuit against a negligent outside party.',
                },
                {
                  id: 'wc-az-faq-3',
                  question: 'Will a full and final settlement end my medical coverage?',
                  answer: 'Yes. If you negotiate a Full and Final Settlement under A.R.S. § 23-1067 and it is approved by the administrative law judge, the insurance carrier\'s obligation to pay for your medical care ends permanently. You must use your lump sum settlement funds to pay out of pocket for any future doctor visits, physical therapy, or revision surgeries related to your workplace accident.',
                  schemaAnswer: 'Yes. A Full and Final Settlement approved under A.R.S. § 23-1067 permanently ends the carrier\'s medical coverage obligation. All future work-related medical costs must be paid from your lump sum funds.',
                },
                {
                  id: 'wc-az-faq-4',
                  question: 'How long does it take the ICA to approve a lump sum?',
                  answer: 'Once you and the insurance company successfully negotiate a settlement amount and sign the required legal documents, it typically takes the Industrial Commission roughly thirty to forty-five days to review the file, ensure the math is fair, and issue the formal approval order releasing your funds.',
                  schemaAnswer: 'After both parties sign the settlement documents, the Industrial Commission of Arizona typically takes 30 to 45 days to review the file and issue the formal approval order releasing settlement funds.',
                },
                {
                  id: 'wc-az-faq-5',
                  question: 'What happens if my boss illegally failed to buy workers comp insurance?',
                  answer: 'If your employer failed to carry mandatory coverage, you are not out of luck. You can file your claim directly with the No Insurance Section of the ICA\'s Special Fund Division. The state will step in, investigate the claim, pay your medical bills and wage replacement directly, and then aggressively pursue your employer for full reimbursement alongside massive financial penalties.',
                  schemaAnswer: 'File your claim with the No Insurance Section of the ICA Special Fund Division. The state pays your medical bills and wage replacement directly, then pursues your uninsured employer for full reimbursement and financial penalties.',
                },
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Take Control of Your Work Injury Claim
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Valuing a catastrophic work injury in the Grand Canyon State requires far more than basic guesswork. It requires a deep, tactical understanding of the Arizona ICA statutes, complex earning capacity formulas, and long-term medical inflation projections. Before you ever consider signing away your right to lifetime medical care, you need to know exactly what your permanent physical limitations are worth under the law.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Use a dedicated{' '}
                <Link href="/workers-comp-settlement-calculator/" style={{ color: '#60A5FA' }}>workers comp settlement calculator</Link>
                {' '}to estimate your baseline numbers and understand your worst-case scenario. However, always consult with an ICA-regulated legal professional to ensure the insurance carrier is correctly calculating your average monthly wage and accurately classifying your injury as unscheduled whenever possible. Fighting for your financial future means demanding every single dollar the statutes allow.
              </p>

            </article>

          ) : stateData.slug === 'georgia' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in Georgia at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in Georgia at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Georgia&apos;s workers&apos; compensation system is run by the{' '}
                <strong style={{ color: '#E2E8F0' }}>State Board of Workers&apos; Compensation (SBWC)</strong>, the state agency that reviews claims, approves settlements, and sets the benefit rates used below (
                <a href="https://sbwc.georgia.gov/about-us" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC About Us</a>
                ). The system is governed by Title 34, Chapter 9 of the Official Code of Georgia Annotated (O.C.G.A.), often just called &quot;the Act.&quot;
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Coverage is broad but not universal. The Act applies to employers, including public corporations and nonprofits, that regularly have <strong style={{ color: '#E2E8F0' }}>three or more employees</strong>, whether full-time or part-time — count doesn&apos;t distinguish between the two (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-1/section-34-9-2/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-2</a>
                {' '}(statute text via Justia);{' '}
                <a href="https://sbwc.georgia.gov/about-us" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC About Us</a>
                ). If you were hurt on the job in Georgia and your employer meets that threshold, you&apos;re almost certainly covered from your first day of work — there&apos;s no waiting period for eligibility, only a waiting period before wage checks start.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The SBWC has been around since 1920 and, by its own account, currently serves more than a quarter million Georgia employers and roughly 3.8 million workers (
                <a href="https://sbwc.georgia.gov/about-us" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC About Us</a>
                ). It&apos;s funded through assessments on insurers and self-insured employers, not general tax revenue, which is part of why claims move through an administrative Board process rather than straight into court.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your injury keeps you out of work, Georgia pays <strong style={{ color: '#E2E8F0' }}>temporary total disability (TTD)</strong> at <strong style={{ color: '#E2E8F0' }}>two-thirds (66 2/3%) of your average weekly wage (AWW)</strong>, subject to a state maximum and minimum (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-261/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-261</a>
                {' '}(statute text via Justia)). For 2026 injuries, that maximum is <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()} per week</strong>, and the minimum is <strong style={{ color: '#E2E8F0' }}>$50 per week</strong>. Those figures took effect July 1, 2023, and the SBWC&apos;s most recent published summary (revised July 1, 2025) confirms no rate change since — so $800/$50 is still the operative cap for injuries happening now (
                <a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC Summary of Workers&apos; Compensation Provisions</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There&apos;s also a <strong style={{ color: '#E2E8F0' }}>temporary partial disability (TPD)</strong> benefit for workers who can do some work but earn less than before — it&apos;s capped separately at <strong style={{ color: '#E2E8F0' }}>$533 per week</strong> (
                <a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC Summary of Provisions</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your AWW itself is normally calculated by taking your total wages over the <strong style={{ color: '#E2E8F0' }}>13 weeks immediately before the injury</strong> and dividing by 13 — as long as you worked substantially the whole of that period for the same employer (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-260/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-260</a>
                {' '}(statute text via Justia)). That 13-week average, not your most recent paycheck, is what feeds the two-thirds calculation above.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period.</strong> You don&apos;t get paid for the first 7 days you&apos;re out of work. If your disability lasts more than 21 consecutive days from the date of injury, though, that first week becomes payable retroactively — you&apos;re made whole for the whole period (
                <a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC Summary of Provisions</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>How long it lasts.</strong> For most injuries, TTD is capped at <strong style={{ color: '#E2E8F0' }}>400 weeks from the date of injury</strong> — a little over 7.5 years (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-261/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-261</a>
                {' '}(statute text via Justia)). That cap disappears entirely for injuries the SBWC classifies as <strong style={{ color: '#E2E8F0' }}>catastrophic</strong> — things like spinal cord injuries with severe paralysis, amputation, severe traumatic brain injury, severe burns, total blindness, or any injury severe enough that it keeps you from doing your old job or any other work that exists in meaningful numbers in the national economy (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-6/part-1/section-34-9-200-1/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-200.1</a>
                {' '}(statute text via Justia)). Catastrophic-injury TTD instead continues &quot;until such time as the employee undergoes a change in condition for the better,&quot; with no fixed week count.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability (PPD) ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability (PPD)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Georgia&apos;s PPD system is different from a lot of states in one important way: it uses a specific, named medical standard. Your treating doctor (or an independent medical examiner) rates the percentage of impairment to the injured body part using the <strong style={{ color: '#E2E8F0' }}>AMA Guides to the Evaluation of Permanent Impairment, 5th Edition</strong> — the statute names that exact edition, not a newer one (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-263/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-263(d)</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                That impairment percentage is then applied to a <strong style={{ color: '#E2E8F0' }}>fixed schedule of weeks</strong> set by statute for each body part. The math is: impairment % × scheduled weeks for that body part × your weekly compensation rate (66 2/3% of AWW, subject to the same $800 maximum used for TTD). The PPD calculator below runs this exact statutory method using the schedule below.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Importantly, PPD checks don&apos;t start immediately. Georgia law is explicit that PPD income benefits &quot;shall not become payable so long as the employee is entitled to&quot; TTD or TPD benefits for the same injury — so PPD is paid <strong style={{ color: '#E2E8F0' }}>after</strong> your temporary benefits stop, not alongside them (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-263/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-263(b)</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Here&apos;s Georgia&apos;s statutory schedule for some of the most commonly rated body parts:
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Part</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Weeks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Arm', '225'], ['Leg', '225'], ['Hand', '160'], ['Foot', '135'], ['Thumb', '60'],
                      ['Index finger', '40'], ['Great toe', '30'], ['Hearing, one ear', '75'],
                      ['Hearing, both ears', '150'], ['Vision, one eye', '150'], ['Body as a whole', '300'],
                    ].map(([part, weeks], i, arr) => (
                      <tr key={part} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{part}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px' }}>
                Source for the full schedule:{' '}
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-263/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-263</a>
                {' '}(statute text via Justia).
              </p>

              <StatePPDSection state="georgia" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Georgia doesn&apos;t have a separate PPD-style schedule for &quot;permanent total disability&quot; — instead, certain severe losses trigger a legal presumption. The loss of both arms, hands, legs, or feet, any two or more of those, or permanent total loss of vision in both eyes creates a <strong style={{ color: '#E2E8F0' }}>rebuttable presumption of permanent total disability</strong>, which is then compensated the same way as ongoing TTD, under O.C.G.A. §34-9-261, rather than under the PPD schedule (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-7/section-34-9-263/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-263</a>
                {' '}(statute text via Justia)). In practice, most permanent-total situations in Georgia are handled through the catastrophic-injury classification described above, which removes the 400-week cap on weekly benefits.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in Georgia ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in Georgia
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Georgia calls a workers&apos; comp settlement a <strong style={{ color: '#E2E8F0' }}>&quot;stipulation and agreement&quot;</strong> or, more commonly, just a <strong style={{ color: '#E2E8F0' }}>settlement agreement</strong>. Whatever the injured worker and the employer/insurer agree to, it has to be written up and filed with the SBWC — and it is <strong style={{ color: '#E2E8F0' }}>not binding on anyone until the Board approves it</strong> (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-1/section-34-9-15/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-15</a>
                {' '}(statute text via Justia)). Once approved, the settlement becomes a final, enforceable disposition of the claims it covers, similar in effect to a judgment.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The SBWC&apos;s Settlement Division exists specifically to review these agreements for compliance before approval; it publishes guidance on the settlement approval process but is barred from telling either side what a claim is &quot;worth&quot; (
                <a href="https://sbwc.georgia.gov/divisions-offices/settlement" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>SBWC Settlement Division</a>
                ). Settlements in Georgia commonly resolve future indemnity (wage-loss) benefits and can also close out future medical treatment for the claim, depending on what the parties agree to and the Board approves — but nothing is final until that Board sign-off happens.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Two different clocks matter in a Georgia workers&apos; comp case, and missing either one can end your right to benefits:
              </p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#E2E8F0' }}>Notice to your employer:</strong> report the injury as soon as possible. Georgia&apos;s claim-filing deadlines run from either the date of injury or the date benefits/treatment stopped, so prompt reporting protects your position either way.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Claim-filing deadline (statute of limitations):</strong> you generally must file a claim with the SBWC <strong style={{ color: '#E2E8F0' }}>within one year of the injury</strong>. That window extends if the employer has been paying you: you get <strong style={{ color: '#E2E8F0' }}>two years from the date of the last weekly benefit payment</strong>, or <strong style={{ color: '#E2E8F0' }}>one year from the date of the last remedial (authorized) medical treatment</strong> furnished by the employer, whichever gives you more time (
                  <a href="https://law.justia.com/codes/georgia/2022/title-34/chapter-9/article-3/part-1/section-34-9-82" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-82</a>
                  {' '}(statute text via Justia)).
                </li>
              </ul>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Georgia uses a <strong style={{ color: '#E2E8F0' }}>panel of physicians</strong> system rather than free choice of any doctor. Your employer must post and maintain a list of <strong style={{ color: '#E2E8F0' }}>at least six physicians or physician groups</strong> who are reasonably accessible to employees, and you choose your treating doctor from that posted list (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-6/part-1/section-34-9-201/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-201</a>
                {' '}(statute text via Justia)). You&apos;re also allowed to make <strong style={{ color: '#E2E8F0' }}>one change to a different doctor already on the same panel without needing the Board&apos;s permission</strong> — after that, further changes generally need approval.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A few built-in exceptions matter. In a genuine emergency, the panel-selection rule doesn&apos;t apply for as long as the emergency lasts — go get emergency care wherever you need to. The panel itself must include at least one orthopedic surgeon, and the Board is directed to encourage minority-physician participation on panels where feasible. And if your employer never actually posts a valid panel in the first place, you&apos;re not stuck: you&apos;re free to select any physician at the employer&apos;s expense (
                <a href="https://law.justia.com/codes/georgia/title-34/chapter-9/article-6/part-1/section-34-9-201/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>O.C.G.A. §34-9-201</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a simplified, hypothetical illustration to show how the pieces fit together — it is not a prediction of what any real claim is worth. A worker earns an average weekly wage (AWW) of <strong style={{ color: '#E2E8F0' }}>$1,200</strong>. They&apos;re out of work for 10 weeks (TTD), then are found to have a 20% permanent impairment to the hand.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly TTD rate: 66 2/3% × $1,200</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.00/week (at Georgia&apos;s 2026 cap)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $800 × 10</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$8,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD: hand at 160 scheduled weeks × 20% = 32 weeks × $800</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$25,600.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Combined estimated total</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$33,600.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a rough estimate covering only these two benefit types — it doesn&apos;t include medical expenses, potential vocational or dependency benefits, or any settlement discount/negotiation that would actually apply in a real case. Use the calculator above with your own AWW, weeks out of work, and impairment rating to see your own numbers.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : stateData.slug === 'michigan' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in Michigan at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in Michigan at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Michigan&apos;s workers&apos; compensation system is administered by the Workers&apos; Disability Compensation Agency (WDCA), part of the Michigan Department of Labor and Economic Opportunity (LEO). The underlying law is the Worker&apos;s Disability Compensation Act of 1969 (Act 317 of 1969, codified at MCL 418.101 et seq.), which replaced Michigan&apos;s original 1912 workers&apos; comp law (
                <a href="https://www.michigan.gov/leo/bureaus-agencies/wdca" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>WDCA overview</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Coverage isn&apos;t universal by headcount alone. Under Michigan&apos;s insurance rules, a private employer must carry workers&apos; comp coverage if it regularly employs 1 or more workers 35+ hours a week for 13 or more weeks in the preceding 52 weeks, <em>or</em> regularly employs 3 or more workers at one time (part-time counted), agricultural employers with 3+ workers meeting the same 35-hour/13-week test, and household employers with a domestic worker on the same 35-hour/13-week schedule. All public employers must carry coverage regardless of size. Partners, corporate officers, and LLC manager-members count as employees for this test; sole proprietors working in their own business don&apos;t (
                <a href="https://www.michigan.gov/leo/bureaus-agencies/wdca/insurance-requirements/pages/workers-disability-compensation-insurance-requirements" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>LEO Workers&apos; Disability Compensation Insurance Requirements</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Rate.</strong> Michigan doesn&apos;t pay a straight percentage of gross pay. The weekly benefit for total incapacity is <strong style={{ color: '#E2E8F0' }}>80% of the employee&apos;s after-tax average weekly wage</strong> (MCL 418.351(1), statute text via Justia:{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-351/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.351</a>
                ). &quot;After-tax&quot; means the wage is first reduced for federal/state income tax and FICA withholding, based on the worker&apos;s filing status and number of dependents, before the 80% is applied. Michigan doesn&apos;t leave that conversion to guesswork — the WDCA publishes an annual rate book with tables that do the after-tax conversion and 80% calculation for you, indexed by gross wage, filing status, and dependents (
                <a href="https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2026_Rate_Book.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>2026 Rate Book, michigan.gov/LEO</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>2026 max/min.</strong> For injuries in the 2026 benefit year (calendar year 2026), the maximum weekly rate is <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong>, tied to the 2026 state average weekly wage of $1,333.88. Michigan doesn&apos;t set a flat dollar minimum the way some states do; the &quot;floor&quot; is simply wherever the after-tax 80% calculation lands for very low earners (
                <a href="https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2026_Rate_Book.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>2026 Rate Book</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period.</strong> Michigan&apos;s WDCA materials direct an insurer to file the first report of injury &quot;immediately upon the disability exceeding 7 consecutive days, death, or specific loss&quot; — meaning wage-loss checks start once the disability passes the 7-day mark, with the norm being retroactive payment back to day one once disability continues beyond 14 days (
                <a href="https://www.michigan.gov/-/media/Project/Websites/leo/Documents/WDCA-RESOURCES-AND-REPORTS/Publications/wca_WCPUB006.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>WDCA, Michigan Workers&apos; Disability Compensation Rights &amp; Responsibilities</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Duration.</strong> There&apos;s no fixed number of weeks that cuts off temporary total disability (TTD) in Michigan. MCL 418.351(1) says compensation &quot;shall be paid for the duration of the disability,&quot; and only caps a <em>conclusive legal presumption</em> of total-and-permanent disability at 800 weeks from the injury date — after 800 weeks, whether the worker is still totally disabled becomes a question of fact again rather than an automatic legal conclusion. That 800-week rule is not a benefit cutoff. The WDCA&apos;s own consumer publication confirms wage-loss benefits &quot;continue so long as you are disabled, which could be for the rest of your life,&quot; though the amount can be reduced by up to 50% once the worker turns 65 and has been drawing benefits for at least 5 years (
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-351/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.351</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Temporary partial disability.</strong> If a worker returns to lighter or part-time duty and earns less than before, Michigan pays a percentage of average weekly earnings equal to the proportionate loss of wage-earning capacity, under MCL 418.371(1). By statute, benefits plus actual post-injury earnings can&apos;t add up to more than the worker&apos;s pre-injury average weekly wage — the combination is capped there, not stacked on top of it (
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-371/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.371</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Michigan doesn&apos;t use the AMA <em>Guides to the Evaluation of Permanent Impairment</em> to set dollar values for lost body parts. Instead, MCL 418.361 lays out Michigan&apos;s own fixed schedule: a set number of compensation <em>weeks</em> is assigned by statute to each listed body part, paid at the same 80%-of-after-tax-AWW rate used for total incapacity, subject to the same statutory max/min. Loss of the first phalange (bone segment) of a thumb, finger, or toe counts as half that digit&apos;s scheduled weeks; losing more than the first phalange counts as loss of the whole digit (statute text via Justia:{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-361/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.361</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A percentage loss of use of a scheduled member (rather than outright amputation) is prorated against that member&apos;s full scheduled weeks — a 20% loss of use of a hand, for example, is compensated as 20% of the hand&apos;s 215 scheduled weeks, at the applicable weekly rate.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Part</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Weeks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Thumb', '65'], ['Index (first) finger', '38'], ['Second finger', '33'], ['Third finger', '22'],
                      ['Fourth (little) finger', '16'], ['Great toe', '33'], ['Other toe (each)', '11'], ['Hand', '215'],
                      ['Arm', '269'], ['Foot', '162'], ['Leg', '215'], ['Eye', '162'],
                    ].map(([part, weeks], i, arr) => (
                      <tr key={part} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{part}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px' }}>
                Source: MCL 418.361 (statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-361/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.361</a>
                ).
              </p>

              <StatePPDSection state="michigan" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Michigan treats certain injuries as permanent and total by statutory definition rather than case-by-case argument: loss of both eyes, both legs or feet at or above the ankle, both arms or hands at or above the wrist, permanent and complete paralysis of both legs, both arms, or one leg and one arm, incurable insanity, imbecility caused by the injury, or <em>any two</em> of the losses listed elsewhere in the schedule (for example, one hand and one eye). These cases are compensated as total and permanent disability rather than under the specific-loss schedule for a single member (MCL 418.361, statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-361/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.361</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in Michigan ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in Michigan
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Michigan calls a workers&apos; comp settlement a <strong style={{ color: '#E2E8F0' }}>&quot;redemption&quot;</strong> — the parties agree to redeem (buy out) the employer&apos;s/carrier&apos;s entire liability for the injury with a lump-sum payment, instead of continuing weekly checks. Redemption isn&apos;t available until at least six months after the injury (MCL 418.835, statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-8/section-418-835/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.835</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Every redemption agreement must be submitted to and approved (or rejected) by a workers&apos; compensation magistrate — it isn&apos;t a private contract the parties can just sign and walk away with. Filing a redemption agreement is expressly <em>not</em> an admission of liability by the employer or carrier. If either side requests review by the WDCA director within 15 days after the magistrate&apos;s order is mailed or electronically distributed, the case goes to the director; if no one requests review within that 15-day window, the magistrate&apos;s order becomes final (MCL 418.835 and MCL 418.837, statute text via Justia:{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-8/section-418-835/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>418.835</a>
                ,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-8/section-418-837/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>418.837</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A &quot;full&quot; redemption can close out both wage-loss and future medical benefits for the claim in exchange for the lump sum, since it redeems the employer&apos;s entire liability arising from the injury — that&apos;s a decision a magistrate reviews before approving, precisely because closing out future medical care is a permanent, one-way step for the worker.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A few procedural details are specific to Michigan&apos;s process: the carrier has to notify the employer in writing at least 10 business days before the redemption hearing, spelling out the proposed settlement amount and hearing details, and giving the employer a chance to object. Each party filing a redemption agreement pays a $100 filing fee. Separately, when a magistrate orders that already-awarded, still-running weekly payments be converted into one or more lump sums (rather than the parties negotiating a redemption by agreement), the conversion uses a 10%-per-year present-worth discount.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Notice to employer:</strong> an injured worker must give notice of the injury (oral or written) within 90 days after the injury happens, or within 90 days of when the worker knew or should have known about it. A late notice is excused unless the employer can show it was actually prejudiced by the delay (MCL 418.381(1), statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-381/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.381</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Claim filing deadline:</strong> separately, a claim for compensation — made to the employer or filed with the agency — must happen within 2 years after the injury occurred, or the claim can&apos;t be maintained at all. Even within a timely-filed claim, back pay generally can&apos;t reach further than 2 years before the date the worker filed for a hearing (1 year for nursing/attendant-care claims specifically) (MCL 418.381(1)-(3), statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-381/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.381</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For the first 28 days of treatment after a work injury, the employer (or its insurer) has the right to choose the treating physician. After that 28-day window, the injured worker can switch to a doctor of their own choosing simply by notifying the employer and carrier of the change — no permission needed. The employer or carrier can still ask a workers&apos; compensation magistrate to order the worker to stop treating with their chosen doctor, but only after notice to all parties and a hearing, and only if they can show cause (MCL 418.315, statute text via Justia,{' '}
                <a href="https://law.justia.com/codes/michigan/chapter-418/statute-act-317-of-1969/division-317-1969-3/section-418-315/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>MCL 418.315</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Employers must furnish all reasonable and necessary medical, surgical, hospital, and dental care, plus prosthetics, eyeglasses, and hearing aids needed because of the injury, for as long as the need connected to the injury continues. If the employer doesn&apos;t provide needed care, the worker can be reimbursed for reasonable expenses, or a magistrate can order direct payment to the provider.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical Only)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This example is for illustration. It is not a prediction of what any real claim would pay. Facts: average weekly wage (AWW) of $1,200 before the injury; 10 weeks of temporary total disability; a 20% loss of use of one hand.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Michigan&apos;s rate is 80% of <em>after-tax</em> AWW, and that after-tax conversion runs through the WDCA&apos;s own rate-book tables (filing status and dependents affect the result), not a simple 80% of gross pay. For this illustration we&apos;ll use an assumed, clearly-labeled weekly rate of <strong style={{ color: '#E2E8F0' }}>$700</strong> — a plausible after-tax-adjusted figure for a $1,200 gross AWW, not a number we calculated ourselves. That figure is comfortably under the 2026 maximum of ${stateData.weeklyCapAmount.toLocaleString()}, so the statutory cap doesn&apos;t come into play here.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $700 × 10 (assumed after-tax rate)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$7,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD: hand at 215 scheduled weeks × 20% = 43 weeks × $700</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$30,100.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Combined estimated total</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$37,100.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Again: this is a simplified hypothetical using a labeled assumed rate, not a computed after-tax figure, an actual WDCA rate-book lookup, or a real adjudicated claim. Real Michigan cases turn on the worker&apos;s actual after-tax rate from the current rate book, medical evidence of the percentage of loss, whether TTD and specific-loss periods overlap or run consecutively, and whether a redemption resolves the whole claim for a different lump sum than a week-by-week total would suggest.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : stateData.slug === 'new-jersey' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in New Jersey at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in New Jersey at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                New Jersey&apos;s workers&apos; compensation system is run by the Division of Workers&apos; Compensation (DWC), part of the Department of Labor and Workforce Development, through 15 workers&apos; compensation courts around the state (
                <a href="https://www.nj.gov/labor/workerscompensation/about/index.shtml" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DWC About page</a>
                ). The rules come from the New Jersey Workers&apos; Compensation Act, N.J.S.A. 34:15-1 and following (
                <a href="https://nj.gov/labor/workerscompensation/assets/PDFs/Forms/wc_law.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>compiled law text, NJDOL</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Coverage is broad: state law requires nearly every New Jersey employer that isn&apos;t covered by a federal program to either carry workers&apos; compensation insurance or be approved to self-insure (
                <a href="https://www.nj.gov/labor/workerscompensation/injured-worker-protections/index.shtml" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DWC Injured Worker Protections</a>
                ). If you&apos;re an employee hurt on the job or made sick by your work, you&apos;re generally covered from your first day, regardless of fault.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your injury keeps you out of work, New Jersey pays temporary total disability (TTD) at <strong style={{ color: '#E2E8F0' }}>70% of your average weekly wage (AWW)</strong> at the time of injury, subject to a statutory maximum and minimum. Source: R.S. 34:15-12(a) (
                <a href="https://nj.gov/labor/workerscompensation/assets/PDFs/Forms/wc_law.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL compiled law, PDF</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>2026 rates, effective January 1, 2026 through December 31, 2026:</strong> maximum <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()}/week</strong> (up from $1,159 in 2025); minimum <strong style={{ color: '#E2E8F0' }}>$320/week</strong> (the statute sets the floor at 20% of the statewide average weekly wage; 20% of the 2026 SAWW of $1,598.66 is $319.73, which rounds to $320). Sources: NJDOL 2026 benefit-rate press release (
                <a href="https://www.nj.gov/labor/lwdhome/press/2025/20251229_newbenefitrates2026.shtml" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>nj.gov</a>
                ) for the $1,199 maximum and the $1,598.66 SAWW; R.S. 34:15-12(a) for the 20%-of-SAWW minimum formula.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period:</strong> no cash benefits (only medical care) are paid until you&apos;ve been disabled for 7 days. If your disability lasts longer than 7 days, that first week is paid retroactively. Source: R.S. 34:15-14 (
                <a href="https://nj.gov/labor/workerscompensation/assets/PDFs/Forms/wc_law.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL compiled law, PDF</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Duration:</strong> TTD is capped at a hard <strong style={{ color: '#E2E8F0' }}>400 weeks</strong>, unlike states where it runs until you reach maximum medical improvement with no set limit. Source: R.S. 34:15-12(a); confirmed against N.J.S.A. 34:15-12 via Justia (
                <a href="https://law.justia.com/codes/new-jersey/title-34/section-34-15-12/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>statute text via Justia</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability (PPD) ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability (PPD)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                New Jersey does not use the AMA <em>Guides to the Evaluation of Permanent Impairment</em> to set dollar values. Instead, the state has its <strong style={{ color: '#E2E8F0' }}>own statutory schedule</strong> that assigns a maximum number of weeks to each body part; a doctor rates your percentage of permanent loss of function, and that percentage is applied against the part&apos;s maximum weeks. Source: R.S. 34:15-12(c) (
                <a href="https://nj.gov/labor/workerscompensation/assets/PDFs/Forms/wc_law.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL compiled law, PDF</a>
                ); schedule of body-part weeks (
                <a href="https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL 2026 Schedule of Disabilities, PDF</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                PPD is paid after your temporary disability (TTD) period ends — it compensates for the permanent loss left once you&apos;ve healed as much as you&apos;re going to.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The dollar value of a PPD award is <strong style={{ color: '#E2E8F0' }}>not</strong> simply your wage times a percentage. New Jersey&apos;s official 2026 schedule sets a maximum total dollar award tied to the <em>total number of weeks</em> the award covers (more weeks land in a higher dollar bracket). For example, the 2026 schedule sets the maximum award for a 90-week case at <strong style={{ color: '#E2E8F0' }}>$28,800</strong>. Source:{' '}
                <a href="https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL 2026 Schedule of Disabilities and Maximum Benefits, PDF</a>
                .
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Part</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maximum Weeks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Arm', '330'], ['Leg', '315'], ['Hand (loss of function under 25%)', '260'], ['Hand (loss of function 25% or more)', '300'],
                      ['Foot (loss of function under 25%)', '250'], ['Foot (loss of function 25% or more)', '285'], ['Eye (loss of vision)', '200'],
                      ['Thumb', '80'], ['Index finger', '60'], ['Hearing, both ears', '200'],
                    ].map(([part, weeks], i, arr) => (
                      <tr key={part} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{part}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px' }}>
                Source: R.S. 34:15-12(c); NJDOL 2026 Schedule of Disabilities (
                <a href="https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>PDF</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A note on fingers: New Jersey treats the loss of the first joint (phalange) of a finger as half the finger&apos;s scheduled weeks, and loss reaching into the second joint as the full finger — but no combination of finger losses can be compensated at more than the value of a full hand. Source: R.S. 34:15-12(c).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Two more details worth knowing if your case involves more than one body part or an amputation:
              </p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#E2E8F0' }}>Multiple body parts in one case.</strong> If your claim petition covers more than one disability, each one is rated and assigned its own number of weeks separately — they aren&apos;t added together before the weeks-to-dollars bracket is applied.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Amputation.</strong> When the injury involves an actual amputation (as opposed to loss of use without amputation), New Jersey adds an extra 30% on top of the scheduled award, and that extra 30% isn&apos;t counted when figuring an attorney&apos;s fee.</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Use the PPD calculator below to work through your own body part and percentage against this schedule.
              </p>

              <StatePPDSection state="new-jersey" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your injury leaves you permanently and totally unable to work, New Jersey pays the same 70%-of-wages rate (subject to the same 2026 max/min) for up to <strong style={{ color: '#E2E8F0' }}>450 weeks</strong>, after which payments stop unless you complete an approved rehabilitation program and still can&apos;t earn a wage comparable to your pre-injury pay — in that case, reduced payments continue. Source: R.S. 34:15-12(b) (
                <a href="https://law.justia.com/codes/new-jersey/title-34/section-34-15-12/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>statute text via Justia</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in New Jersey ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in New Jersey
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                New Jersey workers&apos; comp cases resolve one of two ways once a claim petition is filed:
              </p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#E2E8F0' }}>Order Approving Settlement (&quot;Section 20&quot; settlement).</strong> Named for its statutory home, R.S. 34:15-20, this is a lump-sum settlement approved by a judge of compensation. It results in a dismissal of the case &quot;with prejudice&quot; and is final as to all rights and benefits — meaning it closes out the claim entirely, including future medical treatment for that injury.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Formal award / agreement for compensation (&quot;Section 22&quot;).</strong> Under R.S. 34:15-22, the parties can agree on the extent of disability and have a judge approve a formal award instead of a full dismissal. This route leaves the case open: medical or disability benefits tied to the award can later be reviewed or modified under R.S. 34:15-27 if your condition changes.</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Either way, a judge of compensation must approve the settlement before it&apos;s binding — you and your employer/insurer can&apos;t finalize a workers&apos; comp settlement on your own.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Notice to your employer:</strong> tell your employer as soon as you can. The statute sets up a layered rule: if your employer doesn&apos;t already know about the injury, you generally need to give notice within 14 days to avoid a delay in when benefits start, and notice given within 30 days generally cures small defects unless your employer can show it was actually harmed by the delay. As an outer limit, if your employer has no actual knowledge and gets no notice within 90 days of the injury, no compensation is allowed at all. Source: R.S. 34:15-17.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Claim petition (statute of limitations):</strong> you generally must file a formal claim petition with the Division of Workers&apos; Compensation within <strong style={{ color: '#E2E8F0' }}>2 years</strong> of the date of the accident (or, where compensation has already been paid, within 2 years of the last payment). For an occupational illness — a condition caused gradually by your work rather than a single accident — the 2-year clock instead runs from when you first became aware, or should reasonably have become aware, that the condition was connected to your job. Sources: R.S. 34:15-51 (
                <a href="https://law.justia.com/codes/new-jersey/title-34/section-34-15-51/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>statute text via Justia</a>
                ); DWC Injured Worker FAQ.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In New Jersey, <strong style={{ color: '#E2E8F0' }}>your employer (or its insurance carrier) chooses the treating doctor</strong> for a work injury — this is the opposite of states that let the injured worker pick. You can generally only see your own doctor at the employer&apos;s expense in a true emergency, or if the employer unreasonably refuses or neglects to provide care. Sources: R.S. 34:15-15 (employer&apos;s duty to furnish treatment); DWC Injured Worker Protections page, stating &quot;the employer, and/or the insurance carrier, has the right to designate the authorized treating physician for all work-related injuries.&quot;
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a simplified illustration, not a prediction of any real case. Facts: average weekly wage (AWW) of $1,200. Worker is out of work for 10 weeks (TTD), then rated with a 20% permanent loss of use of the hand.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly TTD rate: 70% × $1,200</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$840.00/week (below the 2026 max)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $840 × 10</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$8,400.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD weeks: hand under 25% at 260-week max × 20%</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>52 weeks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                New Jersey&apos;s official 2026 schedule sets the maximum total award for a 52-week case; check the schedule&apos;s exact dollar figure for 52 weeks before relying on a number — this page doesn&apos;t display a figure it can&apos;t confirm directly against the current chart. (For reference, the same 2026 schedule shows a 90-week award capped at $28,800, so the amount scales with the week bracket, not a flat weekly rate.) Combined, TTD ($8,400) plus the 52-week PPD award from the current official schedule gives a rough total. Source for the schedule itself:{' '}
                <a href="https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>NJDOL 2026 Schedule of Disabilities and Maximum Benefits, PDF</a>
                . This is only an estimate based on simplified facts. It is not a settlement offer, a prediction of any outcome, or legal advice.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : stateData.slug === 'virginia' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in Virginia at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in Virginia at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Workers&apos; compensation claims in Virginia are handled by the <strong style={{ color: '#E2E8F0' }}>Virginia Workers&apos; Compensation Commission (VWC)</strong>, a state agency separate from the courts. The program is set out in <strong style={{ color: '#E2E8F0' }}>Title 65.2 of the Code of Virginia</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Coverage is close to automatic once you&apos;re on payroll: every employer and employee in Virginia is &quot;conclusively presumed&quot; to have accepted the Act unless they&apos;ve opted out in writing ahead of time (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter3/section65.2-300/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-300</a>
                ). The main carve-out is size — a private employer with <strong style={{ color: '#E2E8F0' }}>fewer than three employees</strong> regularly working in the same business in Virginia generally isn&apos;t required to carry coverage, though underground coal mine operators don&apos;t get this exception and volunteer fire and EMS companies can elect to be covered (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter1/section65.2-101/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-101</a>
                ). If you were hurt on the job for a business with three or more workers, you&apos;re almost certainly covered.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The rest of this page walks through how Virginia calculates weekly checks, how permanent injuries are paid out under the state&apos;s own schedule (not the AMA Guides), how settlements get approved, and the deadlines that can end a claim before it starts.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your injury keeps you out of work entirely, you receive <strong style={{ color: '#E2E8F0' }}>temporary total incapacity (TTD)</strong> benefits equal to <strong style={{ color: '#E2E8F0' }}>66 2/3% of your average weekly wage (AWW)</strong>, subject to Virginia&apos;s statewide minimum and maximum (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-500/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-500(A)</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>2026 rate caps:</strong> effective <strong style={{ color: '#E2E8F0' }}>July 1, 2026</strong>, the maximum weekly compensation rate is <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong> and the minimum is <strong style={{ color: '#E2E8F0' }}>$376.75</strong>. A cost-of-living adjustment of 2.65% is separately scheduled to take effect October 1, 2026. Source: VWC Notice of 2026 Rates,{' '}
                <a href="https://www.workcomp.virginia.gov/news/notice-of-2026-rates" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>workcomp.virginia.gov</a>
                . These figures apply to injuries during the Commission&apos;s July 2026–June 2027 rate year; Virginia resets its min/max every July 1, so an injury earlier in 2026 falls under the prior year&apos;s figures instead.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period:</strong> the first <strong style={{ color: '#E2E8F0' }}>7 calendar days</strong> of lost time are unpaid; if you&apos;re still out of work on the 8th day, benefits start from day 8. If your incapacity lasts <strong style={{ color: '#E2E8F0' }}>more than three weeks</strong>, the waiting-period days become retroactively payable, and you&apos;re paid from day one of your incapacity (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-509/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-509</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Duration:</strong> TTD isn&apos;t capped by a fixed number of weeks on its own. Instead, Virginia caps <em>total</em> compensation (TTD plus permanent partial disability combined) at <strong style={{ color: '#E2E8F0' }}>500 weeks</strong>, and also caps the dollar total at 500 times the Commonwealth&apos;s average weekly wage for the applicable year — except for permanent and total incapacity, certain permanent disability cases, and coal workers&apos; pneumoconiosis deaths, none of which are subject to that ceiling (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-518/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-518</a>
                ). If your condition is found to be permanent and total, weekly compensation instead continues for your <strong style={{ color: '#E2E8F0' }}>lifetime without limit</strong> (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-500/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-500(D)</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Temporary partial disability (TPD):</strong> if you can return to work but at reduced wages, you&apos;re paid 66 2/3% of the difference between your pre-injury and post-injury average weekly wages, also capped at the Commonwealth&apos;s average weekly wage (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-502/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-502</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Virginia does <strong style={{ color: '#E2E8F0' }}>not</strong> use the AMA Guides to price out a permanent injury the way some states do. Instead, it uses its own fixed schedule of weeks per body part, written directly into the statute. Your doctor rates the percentage of permanent loss of use of the body part, that percentage is applied to the body part&apos;s scheduled weeks, and the result is paid at the same 66 2/3%-of-AWW rate (subject to the same min/max) used for TTD (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-503(B), (D)</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Here&apos;s Virginia&apos;s own schedule for some of the most common body parts:
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Part</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Weeks (100% Loss)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Arm', '200'], ['Leg', '175'], ['Hand', '150'], ['Foot', '125'], ['Vision, one eye (total loss)', '100'],
                      ['Thumb', '60'], ['Hearing, one ear (total loss)', '50'], ['First finger (index)', '35'],
                    ].map(([part, weeks], i, arr) => (
                      <tr key={part} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{part}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px' }}>
                Source:{' '}
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-503(B)</a>
                . Partial loss is paid proportionately — for example, losing the first phalanx of a finger or thumb is treated as half the digit&apos;s compensation, and losing more than the first phalanx is treated as loss of the whole digit.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Timing matters here: PPD compensation is <strong style={{ color: '#E2E8F0' }}>payable only after your TTD payments end</strong> — it isn&apos;t paid on top of active TTD checks. It <em>can</em> run at the same time as TPD payments under § 65.2-502, but when it does, each combined week of payment counts as <strong style={{ color: '#E2E8F0' }}>two weeks</strong> against the overall 500-week cap discussed above (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-503(E)</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Use the PPD calculator below to plug in a body part and impairment percentage and see how Virginia&apos;s statutory schedule applies to your situation.
              </p>

              <StatePPDSection state="virginia" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Virginia treats certain injuries as permanent and total automatically: the loss of <strong style={{ color: '#E2E8F0' }}>both hands, both arms, both feet, both legs, both eyes, or any two of these</strong> (from the same accident, or as a compensable consequence of it) (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-503(C)</a>
                ). In these cases, compensation is paid weekly at the same 66 2/3%-of-AWW rate for the rest of the worker&apos;s life, with no 500-week or dollar cap (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-500/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-500(D)</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in Virginia ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in Virginia
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Virginia workers&apos; comp claims can be resolved by a settlement agreement between the employee and the employer/insurer, but the agreement is not enforceable on its own. It must be submitted to and approved by the Commission, which will approve it only when a Commissioner is &quot;clearly of the opinion&quot; that the deal is in the best interests of the employee (or the employee&apos;s dependents in a death claim). The employer or carrier must file the signed settlement memorandum with the Commission within <strong style={{ color: '#E2E8F0' }}>14 calendar days</strong> of it being fully executed. Once approved, the agreement becomes enforceable as a Commission award (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter7/section65.2-701/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-701</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Virginia settlements can resolve indemnity (wage-loss) benefits, and can also close out future medical treatment for the injury depending on what the parties and the Commission agree to — but nothing is final until the Commission signs off.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#E2E8F0' }}>Notice to employer:</strong> report the injury to your employer within <strong style={{ color: '#E2E8F0' }}>30 days</strong> of the accident, or within <strong style={{ color: '#E2E8F0' }}>60 days</strong> of being told an illness is an occupational disease.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Claim filing deadline:</strong> file your formal claim with the Commission within <strong style={{ color: '#E2E8F0' }}>2 years of the date of accident</strong>. For most occupational diseases, the deadline is 2 years from when you&apos;re told the disease is work-related, and no more than 5 years from your last workplace exposure.</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Source: VWC Injured Workers guidance,{' '}
                <a href="https://workcomp.virginia.gov/content/injured-workers" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>workcomp.virginia.gov</a>
                . Missing either deadline can end your right to benefits, so don&apos;t wait to report an injury or file if your employer or its insurer isn&apos;t cooperating.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Once you report an injury, your employer must furnish medical treatment free of charge for as long as necessary. You don&apos;t get free choice of any doctor in Virginia — instead, your employer (or its insurer) gives you a <strong style={{ color: '#E2E8F0' }}>panel of at least three physicians</strong>, and you choose your treating doctor from that list (
                <a href="https://law.lis.virginia.gov/vacode/title65.2/chapter6/section65.2-603/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Va. Code § 65.2-603</a>
                ). If your employer doesn&apos;t offer a panel, or the panel doesn&apos;t meet the statutory requirements, you generally have more freedom to select your own treating physician — the VWC&apos;s injured-worker guidance addresses this directly.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical Only)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Say an injured worker in Virginia has an average weekly wage of <strong style={{ color: '#E2E8F0' }}>$1,200</strong> before the injury.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly TTD rate: 66 2/3% × $1,200 (no cap; between the 2026 min/max)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.00/week</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $800 × 10</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$8,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD: hand at 150 scheduled weeks × 20% = 30 weeks × $800 (paid after TTD ends)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$24,000.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Combined total (40 weeks, well under the 500-week cap)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$32,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a simplified hypothetical to show the math, not an estimate of what any real claim is worth. Actual claims depend on your medical records, average weekly wage calculation, whether you have permanent restrictions, and how your case is rated — use the calculator above with your own numbers, and talk to your claims examiner or an attorney about your specific situation.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : stateData.slug === 'minnesota' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in Minnesota at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in Minnesota at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Minnesota&apos;s workers&apos; compensation system is administered by the{' '}
                <a href="https://www.dli.mn.gov/business/workers-compensation" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Minnesota Department of Labor and Industry (DLI)</a>
                , under{' '}
                <a href="https://www.revisor.mn.gov/statutes/cite/176.101" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Minnesota Statutes Chapter 176</a>
                . Disputed claims are heard by workers&apos; compensation judges at the Office of Administrative Hearings, with appeals going to the{' '}
                <a href="https://mn.gov/workcomp/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Workers&apos; Compensation Court of Appeals</a>
                {' '}under Minn. Stat. ch. 175A.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Most Minnesota employers must carry workers&apos; compensation insurance or qualify as self-insured. A handful of narrow categories are exempt under{' '}
                <a href="https://www.revisor.mn.gov/statutes/cite/176.041" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Minn. Stat. §176.041</a>
                , including a farmer&apos;s spouse, parent, or child working on the family farm; sole proprietors, partners, and certain closely held corporate officers or LLC managers with limited payroll hours and 25%+ ownership; statutory independent contractors; household workers earning under $1,000 in cash per three months from one home; and casual employment outside the usual course of a business. Everyone else working for a covered employer is generally entitled to benefits from the date of injury, regardless of fault.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Rate.</strong> Temporary total disability (TTD) is paid at 66 2/3% of the worker&apos;s average weekly wage (AWW) at the time of injury, subject to the statewide maximum and minimum. Source: Minn. Stat. §176.101, subd. 1.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>2026 maximum and minimum.</strong> For injuries occurring October 1, 2025 through September 30, 2026, the maximum weekly benefit is <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()}</strong> and the minimum is <strong style={{ color: '#E2E8F0' }}>$307.37</strong>. For injuries occurring on or after October 1, 2026, the maximum rises to <strong style={{ color: '#E2E8F0' }}>$1,594.08</strong> (set at 108% of the statewide average weekly wage of $1,476) and the minimum to <strong style={{ color: '#E2E8F0' }}>$318.82</strong>. These figures adjust every October 1 and should be re-checked against DLI&apos;s rate page for injuries near that date. Source:{' '}
                <a href="https://www.dli.mn.gov/business/workers-compensation/work-comp-rate-information-statewide-average-weekly-wage-saww" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DLI SAWW/rate information page</a>
                {' '}and{' '}
                <a href="https://www.dli.mn.gov/sites/default/files/pdf/annladj.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DLI annual adjustment chart</a>
                .
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Duration.</strong> TTD stops entirely once <strong style={{ color: '#E2E8F0' }}>130 weeks</strong> of TTD compensation have been paid, counting initial and any recommenced TTD together — it doesn&apos;t matter how much time has elapsed since the injury, only how many weeks of TTD checks have gone out. The one exception: weeks paid while the employee is in a DLI-approved retraining plan don&apos;t count against the 130-week limit. This is a hard cap, not a &quot;until you recover&quot; open-ended benefit like some states use. Source: Minn. Stat. §176.101, subd. 1(k).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period.</strong> No TTD or TPD is paid for the first three calendar days of disability, unless the disability continues for 10 calendar days or longer, in which case those three days are paid retroactively from the start of the disability. Source: Minn. Stat. §176.121.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Temporary partial disability (TPD).</strong> If an injured worker returns to lighter or lower-paying work before reaching maximum medical improvement, Minnesota pays TPD at 66 2/3% of the difference between the pre-injury wage and what the worker is now able to earn, capped at the TTD maximum rate. TPD can run for up to 275 weeks, or 450 weeks after the date of injury, whichever comes first (longer if the worker is in approved retraining). Source: Minn. Stat. §176.101, subd. 2.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Minnesota does not use a &quot;weeks per body part&quot; schedule the way many states do. Instead, a physician rates the worker&apos;s <strong style={{ color: '#E2E8F0' }}>permanent impairment as a percentage of the whole body</strong>, following the state&apos;s own impairment tables in{' '}
                <a href="https://www.revisor.mn.gov/rules/5223" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Minnesota Rules Chapter 5223</a>
                {' '}— not the AMA Guides. That whole-body percentage is then multiplied by a flat dollar amount tied to the impairment band it falls into, producing a lump-sum PPD award. An employee can&apos;t be compensated for more than 100% whole-body disability even with injuries to multiple body parts. Source: Minn. Stat. §176.101, subd. 2a.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                PPD is paid only after TTD ends — the statute is explicit that &quot;permanent partial disability is not payable while temporary total compensation is being paid.&quot; If a worker asks for a lump-sum payout, the insurer must pay it within 30 days (and may discount it to present value at up to 5%); otherwise it&apos;s paid in installments at the worker&apos;s TTD rate as of the injury date. Source: Minn. Stat. §176.101, subd. 2a(c).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There are two dollar tables in effect in 2026, split by injury date:
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '10px' }}>
                <strong style={{ color: '#E2E8F0' }}>Table A — injuries on or after October 1, 2023 and before October 1, 2026</strong> (first four bands of twenty):
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Whole-Body Impairment</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dollar Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Less than 5.5%', '$114,260'], ['5.5% to less than 10.5%', '$121,800'],
                      ['10.5% to less than 15.5%', '$129,485'], ['15.5% to less than 20.5%', '$137,025'],
                    ].map(([band, amount], i, arr) => (
                      <tr key={band} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{band}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '10px' }}>
                <strong style={{ color: '#E2E8F0' }}>Table B — injuries on or after October 1, 2026</strong> (same first four bands, enacted by 2026 Minn. Laws ch. 103, §10):
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Whole-Body Impairment</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dollar Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Less than 5.5%', '$137,240'], ['5.5% to less than 10.5%', '$146,297'],
                      ['10.5% to less than 15.5%', '$155,527'], ['15.5% to less than 20.5%', '$164,584'],
                    ].map(([band, amount], i, arr) => (
                      <tr key={band} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{band}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Both tables run up through the 95.5%–100% band ($567,840 under Table A, $682,045 under Table B). Sources: Minn. Stat. §176.101, subd. 2a (Table A, current text);{' '}
                <a href="https://www.revisor.mn.gov/laws/2026/0/103/laws.0.12.0" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>2026 Minn. Laws ch. 103, §10</a>
                {' '}(Table B and its effective date). Every even-numbered year, including 2026, the legislature&apos;s Workers&apos; Compensation Advisory Council is required to reconsider whether the table provides adequate compensation, so expect another revision cycle in 2028.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The PPD calculator below uses these two tables directly — enter the whole-body impairment percentage and injury date, and it applies the correct band and dollar figure.
              </p>

              <StatePPDSection state="minnesota" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Permanent total disability (PTD) is paid at 66 2/3% of the worker&apos;s daily wage at the time of injury, subject to the same maximum as TTD and a minimum of 65% of the statewide average weekly wage. After $25,000 in PTD compensation has been paid, the benefit is offset by certain concurrent government disability benefits tied to the same injury. PTD generally continues until age 72, or for five years if the worker was already over 67 at the time of injury. Source: Minn. Stat. §176.101, subd. 4.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in Minnesota ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in Minnesota
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Minnesota workers&apos; comp claims are resolved through a <strong style={{ color: '#E2E8F0' }}>Stipulation for Settlement</strong> — the official name for a negotiated settlement agreement between the employee, employer, and insurer. Once the parties reach terms, the stipulation must be filed with the Office of Administrative Hearings within 45 days of the agreement; a Workers&apos; Compensation Judge reviews the document and must approve it before it&apos;s binding. If the parties notify the court of a settlement but don&apos;t file the stipulation in time without good cause shown, the judge can put the case back on the trial calendar or dismiss it. Source:{' '}
                <a href="https://mn.gov/cah/lawyers-and-litigants/workers-compensation/general-proceedings-guide/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>Office of Administrative Hearings, Workers&apos; Compensation General Proceedings Guide</a>
                .
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Settlements are commonly structured as &quot;full, final, and complete,&quot; closing out future indemnity and, often, future medical benefits for the accepted injury in exchange for a lump sum. The exact scope of what&apos;s closed out is negotiated case by case and spelled out in the stipulation itself.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Notice to employer.</strong> An injured worker (or someone on their behalf) must give the employer notice within 14 days of the injury, or compensation isn&apos;t due until notice is given or the employer already has actual knowledge of the injury. Notice within 30 days cures most minor defects. After 180 days without notice or actual knowledge, compensation is generally barred, subject to limited exceptions for mistake, inadvertence, or inability to give notice. Source: Minn. Stat. §176.141.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Claim filing deadline.</strong> A workers&apos; comp claim generally must be commenced within three years after a written report of the injury is filed with DLI, and in any event no later than six years from the date of the accident. Occupational disease claims run three years from when the employee knew the disease was caused by work. If the injured worker is physically or mentally incapacitated (not counting minority), the three-year window is extended by an additional three years from when the incapacity ends. Source: Minn. Stat. §176.151.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Minnesota generally lets an injured employee choose their own treating health care provider. That default narrows in a few situations: the employer may require treatment through a DLI-certified managed care plan under Minn. Stat. §176.1351; an employer party to a qualifying collective bargaining agreement may restrict treatment to an approved provider list; and pharmacy purchases can be limited to a pharmacy near the employee&apos;s home. Under a certified managed care plan, the worker must generally use in-network providers, with exceptions for emergencies, adjuster-approved out-of-network care, an existing relationship with a provider seen at least twice in the prior two years, living or working beyond 30 miles (Twin Cities) or 50 miles (Greater Minnesota) from network providers, and a few other statutory carve-outs.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Disputes over a requested change of doctor, chiropractor, or podiatrist are resolved under standards DLI has adopted by rule, and any medical expenses tied to an agreed or ordered change are paid by the employer on the same terms as other authorized treatment. Source: Minn. Stat. §176.135, subd. 2.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This example is for illustration only — it is not a prediction of what any real claim is worth, and it does not reflect every offset, dependent adjustment, or attorney&apos;s fee that could apply to an actual case. Facts: average weekly wage of $1,200. Injury occurs before October 1, 2026. Worker draws 10 weeks of temporary total disability, then is rated with a 10% whole-body permanent partial impairment.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly TTD rate: 66 2/3% × $1,200 (between the min/max, no cap)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.00/week</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $800 × 10</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$8,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD: 10% rating in the &quot;5.5% to less than 10.5%&quot; Table A band ($121,800) × 10%</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$12,180.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Combined estimated total</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$20,180.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a simplified estimate of two benefit types only. It doesn&apos;t include medical bills, mileage reimbursement, permanent total disability, vocational rehabilitation, dependent benefits, or any settlement discount/present-value adjustment — and it assumes the 10% rating and $1,200 wage are exactly as stated, which a real case would need a physician&apos;s rating and payroll records to establish.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : stateData.slug === 'colorado' ? (
            <article style={{ margin: '0 auto' }}>

              {/* ── Workers' comp in Colorado at a glance ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Workers&apos; Comp in Colorado at a Glance
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Colorado&apos;s workers&apos; compensation system is run by the Division of Workers&apos; Compensation (DOWC), part of the Colorado Department of Labor and Employment (CDLE) (
                <a href="https://cdle.colorado.gov/dwc" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>CDLE, Division of Workers&apos; Compensation</a>
                ). The benefits themselves come from the Workers&apos; Compensation Act of Colorado, C.R.S. Title 8, Articles 40 through 47.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Coverage is close to universal: CDLE states that all businesses with employees operating in Colorado must carry workers&apos; compensation insurance (or qualify as self-insured), regardless of the number of employees, whether they work part-time, or whether they&apos;re family members of the owner (
                <a href="https://cdle.colorado.gov/dwc" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>CDLE, Division of Workers&apos; Compensation</a>
                ;{' '}
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-44/part-1/section-8-44-101/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-44-101</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Temporary disability benefits ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Temporary Disability Benefits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If a work injury keeps you off the job or cuts your hours, Colorado replaces part of your lost wages while you recover.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Rate.</strong> Temporary total disability (TTD) pays <strong style={{ color: '#E2E8F0' }}>66 2/3% of your average weekly wage (AWW)</strong> at the time of injury (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-105/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-105</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>2026-2027 maximum.</strong> The rate is capped at 91% of the state average weekly wage. Under the Division&apos;s 2026 Max Benefits Order, that ceiling is <strong style={{ color: '#E2E8F0' }}>${stateData.weeklyCapAmount.toLocaleString()} a week</strong>, effective July 1, 2026 through June 30, 2027 — you need to earn at least $2,196.18 a week to hit it (
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                ). Colorado&apos;s order does not publish a separate statutory minimum dollar floor for TTD the way some states do.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Waiting period.</strong> The first 3 days off work go unpaid. But if the disability lasts more than two weeks, payment becomes retroactive all the way back to your first day off (
                <a href="https://law.justia.com/codes/colorado/2021/title-8/article-42/section-8-42-103/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-103</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Duration.</strong> Colorado does not cap TTD at a set number of weeks. Checks continue until you reach maximum medical improvement (MMI), return to your regular or modified job, or are given a written release to return to regular work — whichever comes first. Do not trust any claim that Colorado has a &quot;104-week&quot; TTD limit; that number doesn&apos;t apply here (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-105/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-105</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Temporary partial disability (TPD).</strong> Once you&apos;re released to work with restrictions but can only earn a reduced wage, TPD pays 66 2/3% of the difference between your pre-injury AWW and what you&apos;re earning now, subject to the same 91%-of-SAWW cap that applies to TTD (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-106/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-106</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent partial disability (PPD) ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Partial Disability (PPD)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is where Colorado departs from the simple &quot;weeks × your wage&quot; formula used in many states. PPD splits into two separate tracks, and which one applies depends on the body part hurt.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Scheduled injuries.</strong> For a defined list of body parts — arms, hands, legs, feet, fingers, toes, eyes, hearing, and a few others — the statute sets a fixed number of weeks for a total loss, and you&apos;re paid your percentage of that many weeks. The important quirk: scheduled awards are <strong style={{ color: '#E2E8F0' }}>not</strong> paid at 66 2/3% of your own wage. They&apos;re paid at a flat weekly compensation rate the Division sets by rule and adjusts every year with the state average weekly wage. For the 2026-2027 benefit year, that flat rate is <strong style={{ color: '#E2E8F0' }}>$459.45 a week</strong>, no matter what you actually earned (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-107(2), (6)</a>
                {' '}(statute text via Justia);{' '}
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Whole-person (non-scheduled) injuries.</strong> Injuries not on the schedule — most spine, internal, and systemic conditions — are rated differently. A physician assigns a whole-person impairment percentage under the American Medical Association&apos;s <em>Guides to the Evaluation of Permanent Impairment</em>, Third Edition, Revised, as it stood on July 1, 1991 (Colorado has not adopted a newer edition for this purpose). That percentage is multiplied by an age factor — which runs from 1.80 for a worker age 20 or younger down to 1.00 at age 60 or older, so an older worker&apos;s award reflects fewer remaining working years — and then by 400 weeks. The result is paid at your TTD rate, subject to a Division-set floor and ceiling: <strong style={{ color: '#E2E8F0' }}>$150.00 to $804.46 a week</strong> for the 2026-2027 year (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-107(8)</a>
                {' '}(statute text via Justia);{' '}
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Under either track, PPD is paid <strong style={{ color: '#E2E8F0' }}>after</strong> temporary disability ends, starting on the date of MMI.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Colorado also caps the combined dollar total of temporary disability plus PPD payable on a claim rated by whole-person impairment: <strong style={{ color: '#E2E8F0' }}>$202,297.46</strong> for a rating of 19% or less, and <strong style={{ color: '#E2E8F0' }}>$328,049.94</strong> for a rating of 20% or greater, for 2026-2027 (
                <a href="https://law.justia.com/codes/colorado/2023/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107-5-d-1/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-107.5</a>
                {' '}(statute text via Justia);{' '}
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Colorado&apos;s scheduled PPD table (2026-2027 rate: $459.45/week):
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Part</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled Weeks (100% Loss)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Arm, at the shoulder', '208'], ['Leg, at the hip joint', '208'], ['Hand, below the wrist', '104'],
                      ['Foot, below the ankle', '104'], ['Total deafness, both ears', '139'], ['Total blindness, one eye', '104'],
                      ['Thumb, with the metacarpal bone', '50'], ['Index finger, with the metacarpal bone', '26'],
                    ].map(([part, weeks], i, arr) => (
                      <tr key={part} style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(99,179,237,0.08)' } : undefined}>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{part}</td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>{weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px' }}>
                Source:{' '}
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-107(2), (6)</a>
                {' '}(statute text via Justia);{' '}
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                .
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The PPD calculator below runs both the scheduled-weeks math and the whole-person (impairment % × age factor × 400 weeks) math for you — plug in your own rating and date of birth to see an estimate.
              </p>

              <StatePPDSection state="colorado" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Permanent total disability ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Permanent Total Disability (PTD)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you&apos;re unable to earn any wages in the same or other employment, you may qualify for permanent total disability. PTD pays 66 2/3% of your AWW, subject to the same weekly maximum as TTD, and continues until death — Colorado does not cut PTD off at a fixed number of weeks (
                <a href="https://law.justia.com/codes/colorado/2021/title-8/article-42/section-8-42-111/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-42-111</a>
                {' '}(statute text via Justia)). Under the 2026 order, PTD can be terminated if the worker earns, or is shown capable of earning, more than <strong style={{ color: '#E2E8F0' }}>$9,474.74 a year</strong> (
                <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>DOWC 2026 Max Benefits Order</a>
                ).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── How settlements work in Colorado ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Settlements Work in Colorado
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Most Colorado workers&apos; comp cases end in a &quot;full and final&quot; settlement, documented on the Division&apos;s own Uniform Settlement Agreement (USA) form (
                <a href="https://cdle.colorado.gov/sites/cdle/files/FAQ_Uniform_Settlement_Agreements.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>CDLE, Uniform Settlement Agreement FAQ</a>
                ).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                By statute, a settlement is not binding until it has been reviewed in person with the injured worker and approved in writing by an administrative law judge or the Director of the Division (
                <a href="https://law.justia.com/codes/colorado/2021/title-8/article-43/part-2/section-8-43-204/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-204</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                A full and final settlement can leave future medical benefits open or closed. &quot;Closing&quot; medical means giving up the right to further Division-ordered treatment for that claim in exchange for settlement money; the USA form has a specific paragraph the parties can use instead to agree medical benefits stay open. If the agreement states the claim cannot be reopened, it generally can&apos;t be — except for fraud or a mutual mistake about a material fact (
                <a href="https://law.justia.com/codes/colorado/2021/title-8/article-43/part-2/section-8-43-204/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-204</a>
                {' '}(statute text via Justia)). Once approved, any lump sum owed must be paid within 15 calendar days.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Deadlines ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Deadlines
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Notice to your employer.</strong> Report the injury to your employer in writing within <strong style={{ color: '#E2E8F0' }}>10 days</strong>. Missing this can cost you up to a day of benefits for every day you&apos;re late — but the penalty doesn&apos;t apply if your employer already knew about the injury, you had good cause for the delay, or you were physically or mentally unable to report it yourself (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-43/part-1/section-8-43-102/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-102</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Filing your claim.</strong> A notice claiming compensation must be filed with the Division within <strong style={{ color: '#E2E8F0' }}>2 years</strong> of the injury or death. That stretches to <strong style={{ color: '#E2E8F0' }}>5 years</strong> for occupational diseases involving radioactive/fissionable materials, radiation-induced malignancy, uranium poisoning, asbestosis, silicosis, or anthracosis. The 2-year deadline does not apply once compensation has already been paid on the claim (
                <a href="https://law.justia.com/codes/colorado/2021/title-8/article-43/part-1/section-8-43-103/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-103</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Medical care ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Medical Care
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your employer or its insurer picks the doctor at the start of your claim — but not by handing you a single name. They must designate at least four physicians, or a combination of at least two physicians and two corporate medical providers, within 30 miles of your workplace, with at least one location that isn&apos;t commonly owned with the others (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-43/part-4/section-8-43-404/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-404(5)</a>
                {' '}(statute text via Justia)).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You get one chance to switch your own treating physician, as long as you do it in writing within 120 days of the first doctor being designated and before you reach MMI. If your employer fails to designate a physician in time, you&apos;re free to pick your own treating doctor (
                <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-43/part-4/section-8-43-404/" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>C.R.S. § 8-43-404(5)</a>
                {' '}(statute text via Justia)).
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              {/* ── Worked example ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Worked Example (Hypothetical — Not a Prediction of Your Case)
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Say your average weekly wage before the injury was <strong style={{ color: '#E2E8F0' }}>$1,200</strong>, and you hurt your hand at work.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Weekly TTD rate: 66 2/3% × $1,200 (well under the 2026-2027 max)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$800.00/week</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>TTD for 10 weeks: $800.00 × 10 (no waiting-period deduction)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$8,000.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>PPD: hand at 104 scheduled weeks × 20% = 20.8 weeks × the flat $459.45/week rate</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$9,556.56</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>Combined estimate</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$17,556.56</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                That total sits far below Colorado&apos;s combined-benefit cap for whole-person claims, but note that cap is written in terms of whole-person impairment percentage, so it may not be the operative ceiling for a purely scheduled injury like this one.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is a simplified estimate for illustration only. It leaves out medical bills, any temporary partial disability, vocational or disfigurement add-ons, and disputes over the rating itself, and it is not a prediction of what any real claim would settle for. Use the calculator above to run your own numbers.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />

            </article>

          ) : (
            <article style={{ margin: '0 auto' }}>
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How {stateData.name} Workers&apos; Comp Settlements Work
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In {stateData.name}, workers&apos; compensation provides a crucial safety net for employees injured in the course of their employment. The system is designed to provide wage replacement and medical benefits without the need to prove employer negligence.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Under {stateData.name} law, your temporary total disability (TTD) benefits are calculated at {(stateData.benefitRate * 100).toFixed(1)}% of your Average Weekly Wage (AWW). This amount is subject to a strict weekly cap of ${stateData.weeklyCapAmount.toLocaleString()} per week. {Number.isFinite(stateData.maxWeeksTTD)
                  ? `The maximum duration you can receive TTD benefits is ${stateData.maxWeeksTTD} weeks.`
                  : `${stateData.name} sets no fixed week limit on TTD — benefits continue until you reach maximum medical improvement or return to work.`}
                {stateData.slug === 'virginia' && ' This 500-week limit is shared with permanent partial disability — weeks paid under one benefit type reduce the weeks available under the other (Va. Code § 65.2-518).'}
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Permanent Partial Disability (PPD) benefits compensate you if you suffer a permanent loss of function after reaching maximum medical recovery. {PPD_MODULE_SLUGS.has(stateData.slug as ScheduledLossStateSlug | 'minnesota')
                  ? `${stateData.name} does not use the AMA Guides or the generic weeks-per-body-part schedule above for PPD — it uses its own statutory schedule. Use the estimator below for a ${stateData.name}-specific figure.`
                  : NON_GENERIC_PPD_SLUGS.has(stateData.slug)
                    ? `${stateData.name} does not use the AMA Guides or a simple weeks-per-body-part schedule for PPD — see the state-specific note below for how it actually calculates this benefit. This calculator does not yet model ${stateData.name}'s PPD method and hides the PPD output accordingly.`
                    : stateData.ppdMethod === 'ama_schedule'
                      ? `In ${stateData.name}, PPD is calculated using the AMA Scheduled Weeks method (where each body part is worth a specific number of benefit weeks).`
                      : `In ${stateData.name}, PPD is calculated using the percentage-of-person method (where benefits are calculated out of a whole person week count).`}
              </p>
              {PPD_MODULE_SLUGS.has(stateData.slug as ScheduledLossStateSlug | 'minnesota') && (
                <StatePPDSection state={stateData.slug as ScheduledLossStateSlug | 'minnesota'} />
              )}
              {stateData.stateSpecificNotes && (
                <div
                  className="rounded-xl px-4 py-3 mt-4"
                  style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: '#93C5FD' }}>
                    <strong>State-Specific Note:</strong> {stateData.stateSpecificNotes}
                  </p>
                </div>
              )}

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <WorkedExampleWorkersComp
                stateSlug={stateData.slug}
                stateName={stateData.name}
                calculatorHref="/workers-comp-settlement-calculator/"
              />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <SourcesSection sources={stateSources} />
            </article>
          )}

          <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

          {/* FAQ Accordion Section */}
          <h2
            className="heading-gradient"
            style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
          >
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={activeFaqs} />

          <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

          {/* Bottom CTA Section */}
          <h2
            className="heading-gradient"
            style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
          >
            Get Your {stateData.name} Estimate Now
          </h2>
          <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
            Insurance adjusters utilize detailed tables and calculator software to establish standard payouts. Make sure you understand the statutory rates and caps that apply to your case.
          </p>
          <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
            Scroll back to the top of the page to enter your wages and compute a localized workers&apos; comp settlement range.
          </p>

          {/* State grid */}
          <section className="mt-14 max-w-3xl" aria-label="Workers comp settlement calculator by state">
            <h2
              className="heading-gradient mb-2"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Workers Comp Settlement Calculator by State
            </h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              Select your state for a workers compensation calculator reflecting local replacement rates, weekly caps, and body part schedules.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORKERS_COMP_STATES.filter((state) => !NOINDEXED_WORKERS_COMP_SLUGS.has(state.slug)).map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/workers-comp-settlement-calculator/${state.slug}/`}
                    className="flex items-center gap-2 text-sm py-1 transition-colors hover:opacity-80"
                    style={{ color: '#60A5FA' }}
                  >
                    <span className="text-xs" style={{ color: '#475569' }}>{state.abbreviation}</span>
                    <span>{state.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full">
            <DisclaimerBanner variant="footer" stateName={stateData.name} />
          </div>

        </div>

      </main>
    </>
  )
}
