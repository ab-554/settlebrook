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
                Let&apos;s put concrete math to this statute. Suppose you are an electrician earning $1,400 a week. For the first 26 weeks of your recovery, the insurance company will pay you 70 percent of that wage, which equals <strong style={{ color: '#FBBF24' }}>$980 per week</strong>. You must also factor in the state-mandated caps. For injuries occurring in 2026, the maximum weekly benefit is <strong style={{ color: '#FBBF24' }}>$1,066</strong>. Because your $980 calculation falls below the maximum cap, you receive your full calculated rate. If you were earning $2,000 a week, your 70 percent calculation would be $1,400, but the insurance company would legally cap your checks at exactly $1,066 per week.
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
                Texas law mandates that you receive exactly <strong style={{ color: '#E2E8F0' }}>three weeks</strong> of Texas IIB benefits for every single percentage point of your impairment rating. These benefits are paid at 70 percent of your Average Weekly Wage, strictly capped at $1,066 per week.
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

              {/* ── Average Settlements ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Because of the dual system, average settlement values look wildly different depending on your employer&apos;s insurance status.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For <strong style={{ color: '#E2E8F0' }}>subscribers</strong>, the system is designed to be a rigid math equation rather than a windfall. A moderate injury like a torn meniscus or a simple fracture usually results in a Texas workers&apos; comp settlement ranging from <strong style={{ color: '#FBBF24' }}>$15,000 to $35,000</strong> in IIB payouts, plus the coverage of the surgery. Severe injuries involving spinal fusions or joint replacements can push IIB settlements into the <strong style={{ color: '#FBBF24' }}>$60,000 to $90,000</strong> range.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For <strong style={{ color: '#E2E8F0' }}>non-subscribers</strong>, the sky is the limit. Because civil juries can award massive pain and suffering damages, non-subscriber settlements frequently exceed <strong style={{ color: '#FBBF24' }}>$100,000</strong> for moderate injuries and regularly cross the million-dollar threshold for severe, life-altering negligence cases.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

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
                Let&apos;s look at a concrete example. If you earn an average of $1,200 per week as a heavy machinery operator in Jacksonville, your weekly TTD check will be <strong style={{ color: '#FBBF24' }}>$800</strong>. The state does impose a hard ceiling on these wages. For injuries occurring in 2026, the absolute maximum weekly TTD rate is <strong style={{ color: '#FBBF24' }}>$1,197</strong>. Even if you are a high-earning executive making $4,000 a week, your weekly workers&apos; comp check cannot exceed that statutory $1,197 cap. Furthermore, the insurance company will not pay you these temporary benefits forever. Florida law strictly limits TTD payments to a maximum of <strong style={{ color: '#E2E8F0' }}>104 weeks</strong>. Once you hit that two-year mark of temporary benefits, the checks stop, regardless of whether you have fully recovered.
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

              {/* ── Average Settlements ── */}
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Real-World Average Settlement Examples
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                While every spinal cord and torn rotator cuff heals differently, analyzing real-world examples helps set your expectations. Settlement values hinge entirely on your pre-injury wages and the severity of your medical prognosis.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Consider a 45-year-old construction worker making $900 a week who suffers a torn meniscus requiring arthroscopic surgery. He receives his temporary benefits for three months, undergoes physical therapy, and reaches MMI with a 3 percent impairment rating. Because he can return to light-duty work, his future wage loss is minimal. A fair settlement to close out his future medical rights and pay his impairment benefits might land around <strong style={{ color: '#FBBF24' }}>$18,000 to $25,000</strong>.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Conversely, look at a 55-year-old commercial truck driver making $1,500 a week who suffers a crushed lumbar spine requiring a complex multi-level fusion. He requires lifelong pain management, physical therapy, and will never drive a commercial rig again. Even if he does not meet the strict statutory definition for permanent total disability, the massive cost of his future medical care and his high impairment rating drastically inflate his case value. A settlement to close out his medical care and buy out his impairment benefits could easily range from <strong style={{ color: '#FBBF24' }}>$150,000 to $275,000</strong> or more, depending heavily on the projected costs locked inside his Medicare Set-Aside.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

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
