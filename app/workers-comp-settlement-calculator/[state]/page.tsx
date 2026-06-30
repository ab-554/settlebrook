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
import {
  getWorkersCompStateBySlug,
  getAllWorkersCompStateSlugs,
  WORKERS_COMP_STATES,
} from '@/lib/data/workersCompStates'
import { WORKERS_COMP_FAQS, buildWorkersCompFAQSchema } from '@/lib/data/workersCompFaqs'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllWorkersCompStateSlugs()
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { state: string }
}): Promise<Metadata> {
  const stateData = getWorkersCompStateBySlug(params.state)
  if (!stateData) return { title: 'Page Not Found', robots: { index: false, follow: false } }

  const canonicalUrl = `/workers-comp-settlement-calculator/${stateData.slug}/`

  // Title: "[State] Workers Comp Settlement Calculator — Free Tool"
  const pageTitle = `${stateData.name} Workers Comp Settlement Calculator — Free Tool`

  // State-specific description (~155 chars)
  const description = `Free ${stateData.name} workers compensation settlement calculator. Estimate TTD and PPD benefits under ${stateData.name} law. Enter weekly wages for an instant estimate.`.slice(0, 155)

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
          url: 'https://settlebrook.com/og-image.png',
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
      images: ['https://settlebrook.com/og-image.png'],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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

// ─── Ad Slot placeholder ──────────────────────────────────────────────────────

function AdSlot({ id }: { id: string }) {
  return (
    <div
      id={id}
      aria-label="Advertisement"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(99,179,237,0.15)',
        borderRadius: '8px',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '32px 0',
        color: 'rgba(99,179,237,0.3)',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}
    >
      AD
    </div>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function StateWorkersCompPage({ params }: { params: { state: string } }) {
  const stateData = getWorkersCompStateBySlug(params.state)
  if (!stateData) notFound()

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
    provider: { '@type': 'Organization', name: 'Settlebrook', url: 'https://settlebrook.com' },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlebrook.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Workers Comp Settlement Calculator',
        item: 'https://settlebrook.com/workers-comp-settlement-calculator/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${stateData.name} Workers Comp Settlement Calculator`,
        item: canonicalUrl,
      },
    ],
  }

  const faqSchema = buildWorkersCompFAQSchema(WORKERS_COMP_FAQS)

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
                ${stateData.weeklyCapAmount.toLocaleString()}/wk Cap ({stateData.weeklyCapYear})
              </span>
              <span className="state-badge state-badge-blue">
                {stateData.ppdMethod === 'ama_schedule' ? 'AMA Scheduled Weeks' : 'Percentage of Person'}
              </span>
              <span className="state-badge state-badge-muted">
                Max TTD: {stateData.maxWeeksTTD} Weeks
              </span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
          
          <AdSlot id="WC_STATE_AD_TOP" />

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

          <AdSlot id="WC_STATE_AD_MID" />

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
                To maintain economic balance, the California Department of Industrial Relations enforces statutory income floors and ceilings. For workplace injuries occurring in 2026, your weekly TTD benefit is strictly capped at a maximum of <strong style={{ color: '#E2E8F0' }}>$1,619 per week</strong>. Consider a real dollar example: if you earned $1,800 per week as a union ironworker before shattering your ankle, two-thirds of your wage equals $1,200. Because this amount falls below the state threshold, you will receive $1,200 every week. However, if you earned $3,000 per week as a specialized commercial pilot, two-thirds of your wage equals $2,000. Because this calculated figure exceeds the statutory ceiling, your actual payments will be restricted to the $1,619 weekly cap. Under state law, TTD payments are legally restricted to a maximum duration of <strong style={{ color: '#E2E8F0' }}>104 weeks within a five-year window</strong> from your injury date.
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

              {/* ── Average Settlements ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Workers&apos; Comp Settlements in California
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because permanent impairment scores, pre-injury wage histories, and future medical allocations vary wildly from person to person, there is no single universal settlement average. However, historical claims data across the California Department of Industrial Relations provides reliable financial benchmarks based on injury severity.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Minor workplace injuries</strong> involving straightforward soft-tissue sprains, simple lacerations, or minor concussions that resolve fully within a few months without residual impairment typically resolve for lump-sum C&amp;R amounts ranging between <strong style={{ color: '#FBBF24' }}>$5,000 and $20,000</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Moderate occupational injuries</strong> requiring arthroscopic surgical intervention, such as torn rotator cuffs, meniscus tears, or single-level herniated discs that result in permanent disability ratings between 15% and 30%, generally yield settlement packages between <strong style={{ color: '#FBBF24' }}>$40,000 and $90,000</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <strong style={{ color: '#E2E8F0' }}>Catastrophic workplace traumas</strong> involving multi-level spinal fusions, traumatic brain injuries, severe crushing fractures, or occupational amputations carrying disability ratings above 70% command substantial six-figure settlements regularly ranging between <strong style={{ color: '#FBBF24' }}>$250,000 and $500,000</strong> or more when factoring in substantial future lifetime medical care allocations.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

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
                  answer: 'There is no statutory maximum dollar cap on a total workers\u2019 compensation settlement in California. While temporary disability weekly paychecks are strictly capped at $1,619 per week for 2026 injuries, overall settlement values depend entirely on your final permanent disability rating percentage and the projected lifetime cost of your medical care. Workers who suffer 100% total permanent disability qualify for lifetime bi-weekly pension payments that can accumulate to well over $1 million.',
                  schemaAnswer: 'There is no statutory maximum dollar cap on a total workers\u2019 compensation settlement in California. While temporary disability weekly paychecks are strictly capped at $1,619 per week for 2026 injuries, overall settlement values depend entirely on your final permanent disability rating percentage and the projected lifetime cost of your medical care. Workers who suffer 100% total permanent disability qualify for lifetime bi-weekly pension payments that can accumulate to well over $1 million.',
                },
                {
                  id: 'wc-ca-faq-3',
                  question: 'How long does California workers comp last?',
                  answer: 'Active wage replacement under Temporary Total Disability is strictly limited by California Labor Code to a cumulative maximum of 104 weeks within a five-year window from your injury date. However, medical coverage for approved job injuries can last for the remainder of your life if you resolve your claim via a Stipulated Award. If you elect a Compromise and Release settlement, all workers\u2019 compensation benefits terminate immediately upon cashing your lump-sum check.',
                  schemaAnswer: 'Active wage replacement under Temporary Total Disability is strictly limited by California Labor Code to a cumulative maximum of 104 weeks within a five-year window from your injury date. However, medical coverage for approved job injuries can last for the remainder of your life if you resolve your claim via a Stipulated Award. If you elect a Compromise and Release settlement, all workers\u2019 compensation benefits terminate immediately upon cashing your lump-sum check.',
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
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Texas Workers&apos; Comp Settlements Work
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas is unique because it is the only state in the country that does not mandate private employers to carry workers&apos; compensation insurance. Employers who choose to opt out of the state system are known as &quot;non-subscribers.&quot;
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your employer carries standard workers&apos; compensation, Texas pays up to 70% of your Average Weekly Wage (AWW) for TTD benefits, capped at a maximum weekly amount of $1,066 for 2026. If your employer is a non-subscriber, you cannot file a standard workers&apos; comp claim. Instead, you have the right to file a personal injury lawsuit against your employer in civil court where you can recover full damages, including pain and suffering, with no statutory caps.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For subscribers, permanent benefits are paid as Impairment Income Benefits (IIBs) once you reach Maximum Medical Improvement (MMI). You receive three weeks of benefits for every percentage point of impairment assigned by your doctor.
              </p>
            </article>
          ) : stateData.slug === 'florida' ? (
            <article style={{ margin: '0 auto' }}>
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Florida Workers&apos; Comp Settlements Work
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Florida&apos;s workers&apos; compensation system requires employers with four or more employees (or one or more in construction) to carry insurance. The Division of Workers&apos; Compensation oversees claims state-wide.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Florida pays 66.67% of your Average Weekly Wage (AWW) for temporary total disability (TTD), capped at a maximum weekly rate of $1,197 for 2026. TTD is limited to a maximum of 104 weeks. PPD benefits are calculated based on your physical impairment rating using the Florida Impairment Rating Guide. Note that Florida severely restricts permanent total disability (PTD) benefits for most workplace injuries unless they fall under very specific catastrophic exceptions.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Lump-sum settlements in Florida are negotiated agreements that release the employer and insurer from any future liability for medical care and lost wages. These are typically finalized before a judge of compensation claims.
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
                Your AWW is calculated by taking your total gross earnings from the 52 weeks immediately preceding your accident and dividing that number by 52. Once the WCB determines your baseline wage, they apply the state cap. For 2026, the New York maximum weekly benefit sits at <strong style={{ color: '#FBBF24' }}>$1,145 per week</strong>. This figure updates annually every July 1st based on the statewide average weekly wage, and it represents one of the highest benefit ceilings in the entire country.
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
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$1,145.00 (Capped at 2026 maximum)</td>
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

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Settlements in New York
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because the New York WCB strictly redlines individual settlement data to protect worker privacy, there is no official state ledger of exact payout averages. However, based on published actuarial data from state rating bureaus and historical SLU schedules, we can bracket realistic expectations across different injury tiers across the state:
              </p>

              {/* Settlement tiers table */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Injury Severity Tier</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Common Diagnoses</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typical Settlement Mechanism</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Payout Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Minor Extremity</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Sprained ankle, simple finger fracture, resolved tendinitis</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Schedule Loss of Use (SLU)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$5,000 – $22,000</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Moderate Surgical</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Arthroscopic knee repair, rotator cuff tear, wrist fracture</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Schedule Loss of Use (SLU)</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$35,000 – $85,000</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Severe Non-Schedule</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Herniated cervical disc, complex shoulder rebuild, mild concussions</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Section 32 Lump Sum</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$90,000 – $240,000</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Catastrophic Total</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Multi-level spinal fusion, traumatic brain injury, amputations</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Structured Section 32</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$300,000 – $850,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <em>Note: These figures represent gross case valuations before deducting prior temporary wage payments, attorney fees (typically capped at 10% to 15% by WCB judges), and medical liens.</em>
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

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
                Because Illinois historically maintains strong labor protections, the state caps these payments at some of the highest statutory thresholds in the entire country. For injuries occurring in 2026, the maximum weekly TTD benefit is capped at <strong style={{ color: '#FBBF24' }}>$1,897.47</strong>. If you are an executive or specialized heavy equipment operator earning $3,500 a week, your weekly disability check cannot legally exceed that statutory ceiling regardless of your actual lost wages. Adjusters frequently miscalculate your AWW by excluding earned bonuses or regular overtime, artificially starving your household budget to pressure you into a cheap, premature settlement.
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

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Illinois Workers Comp Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because every workplace injury involves distinct wage histories and medical recoveries, providing a single universal average settlement figure is misleading. However, reviewing historical IWCC approval data allows us to group realistic settlement expectations into concrete medical tiers across Illinois:
              </p>

              {/* Settlement tiers table */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', overflow: 'hidden', marginBottom: '18px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Injury Severity Tier</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typical Medical Treatment</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: '#60A5FA', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Settlement Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Tier 1: Minor Soft Tissue</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Physical therapy, minor strains, clean lacerations with no nerve damage.</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$12,000 – $35,000</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Tier 2: Moderate Surgical</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Arthroscopic knee meniscus repairs, simple rotator cuff tears, single fractures.</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$45,000 – $110,000</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Tier 3: Severe Spinal / Joint</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Single or two-level lumbar/cervical fusions, total hip or knee replacements.</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$125,000 – $325,000</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Tier 4: Catastrophic Industrial</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '14px' }}>Traumatic brain injuries, amputations, permanent total disability (PTD).</td>
                      <td style={{ padding: '14px 16px', color: '#FBBF24', fontWeight: 600, fontSize: '14px' }}>$400,000 – $1,200,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

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

          ) : (
            <article style={{ margin: '0 auto' }}>
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How {stateData.name} Workers&apos; Comp Settlements Work
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                In {stateData.name}, workers&apos; compensation provides a crucial safety net for employees injured in the course of their employment. The system is designed to provide wage replacement and medical benefits without the need to prove employer negligence.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Under {stateData.name} law, your temporary total disability (TTD) benefits are calculated at {(stateData.benefitRate * 100).toFixed(1)}% of your Average Weekly Wage (AWW). This amount is subject to a strict weekly cap of ${stateData.weeklyCapAmount.toLocaleString()} per week. The maximum duration you can receive TTD benefits is {stateData.maxWeeksTTD} weeks.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Permanent Partial Disability (PPD) benefits compensate you if you suffer a permanent loss of function after reaching maximum medical recovery. In {stateData.name}, PPD is calculated using the {stateData.ppdMethod === 'ama_schedule' ? 'AMA Scheduled Weeks method (where each body part is worth a specific number of benefit weeks)' : 'percentage-of-person method (where benefits are calculated out of a whole person week count)'}.
              </p>
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
          <FAQAccordion faqs={WORKERS_COMP_FAQS} />

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
              {WORKERS_COMP_STATES.map((state) => (
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

          <AdSlot id="WC_STATE_AD_BOTTOM" />

          <div className="w-full">
            <DisclaimerBanner variant="footer" stateName={stateData.name} />
          </div>

        </div>

      </main>
    </>
  )
}
