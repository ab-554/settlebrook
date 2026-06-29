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

  const canonicalUrl = `https://settlebrook.com/workers-comp-settlement-calculator/${stateData.slug}/`

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

  const canonicalUrl = `https://settlebrook.com/workers-comp-settlement-calculator/${stateData.slug}/`

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
