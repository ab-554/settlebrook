// ─────────────────────────────────────────────────────────────────────────────
// app/car-accident-settlement-calculator/[state]/page.tsx
// Tool #2 — dynamic state pages for the Car Accident Settlement Calculator.
// Structure mirrors pain-and-suffering-calculator/[state]/page.tsx exactly:
//   • generateStaticParams → getAllCarAccidentStateSlugs()
//   • generateMetadata    → state-specific title, description, OG, Twitter
//   • Three JSON-LD schemas: WebApplication (with areaServed), FAQPage,
//     BreadcrumbList (3-level: Home → tool root → state page)
//   • Hero header: H1 with state name, badge row, BreadcrumbNav
//   • Two-column layout: state law callout + CarAccidentCalculator left,
//     sidebar right (guide CTA + other state links)
//   • State-specific editorial articles for CA and TX (Tier 1 launch states)
//   • Generic placeholder article for all other states (Tier 2/3 rollout)
//   • FAQ accordion — state-specific for CA and TX, generic for all others
//   • DisclaimerBanner footer variant
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CarAccidentCalculator from '@/components/calculator/CarAccidentCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import {
  getCarAccidentStateBySlug,
  getAllCarAccidentStateSlugs,
  CAR_ACCIDENT_STATES,
} from '@/lib/data/carAccidentStates'
import { getCarAccidentFAQs, buildFAQSchema } from '@/lib/data/carAccidentFaqs'
import type { FAQItem } from '@/lib/data/faqContent'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // Returns Array<{ state: string }> — shape getAllCarAccidentStateSlugs()
  // already produces, matching Next.js generateStaticParams convention.
  return getAllCarAccidentStateSlugs()
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { state: string }
}): Promise<Metadata> {
  const stateData = getCarAccidentStateBySlug(params.state)
  if (!stateData) return { title: 'Page Not Found', robots: { index: false, follow: false } }

  const canonicalUrl = `https://settlebrook.com/car-accident-settlement-calculator/${stateData.slug}/`

  // Title: "{State} Car Accident Settlement Calculator — Free Tool"
  // Longest state = "North Carolina" (14 chars) → 62 chars → 76 total with template — acceptable ✓
  const pageTitle = `${stateData.name} Car Accident Settlement Calculator — Free Tool`

  // State-specific description (~155 chars)
  const noFaultSuffix = stateData.isNoFaultState
    ? ` ${stateData.name} is a no-fault insurance state — PIP rules apply.`
    : ''
  const description = (
    `Free ${stateData.name} car accident settlement calculator. Estimate damages under ${stateData.faultRuleLabel} rules, ${stateData.statuteOfLimitations}-year SOL.${noFaultSuffix} Instant results.`
  ).slice(0, 155)

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
          alt: `${stateData.name} Car Accident Settlement Calculator — Settlebrook`,
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

// ─── Ad slot placeholder — matches styled guide page pattern ──────────────────

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

// ─── Currency formatter ────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

// ─── California state-specific FAQs ───────────────────────────────────────────

const CA_CAR_FAQS: FAQItem[] = [
  {
    id: 'ca-car-faq-1',
    question: 'How much is a car accident settlement worth in California?',
    answer:
      'There is no fixed answer because settlement value depends on your specific injury, your medical costs, your lost wages, the at-fault driver\'s policy limits, and your percentage of fault. Soft tissue injuries with under $10,000 in medical bills often settle in the $15,000 to $35,000 range. Injuries requiring surgery commonly settle between $75,000 and $200,000. Catastrophic and permanent injuries can produce settlements well above $500,000. California settlements trend higher than national averages because of the state\'s high medical costs, pure comparative fault rules, and high-verdict urban jurisdictions.',
    schemaAnswer:
      'Settlement value depends on injury severity, medical costs, lost wages, the at-fault driver\'s policy limits, and fault percentage. Soft tissue injuries often settle $15,000–$35,000. Injuries requiring surgery commonly settle $75,000–$200,000. Catastrophic injuries can exceed $500,000. California settlements trend higher than national averages due to high medical costs, pure comparative fault, and high-verdict urban venues.',
  },
  {
    id: 'ca-car-faq-2',
    question: 'How is a car accident settlement calculated in California?',
    answer:
      'Most California car accident settlements are calculated using the multiplier method. Your total economic damages — medical bills, future treatment, and lost wages — form the base. That base is multiplied by a factor of 1.5x to 5.0x based on injury severity to produce your pain and suffering figure. Property damage is added separately without a multiplier. Your final recovery is then reduced by your percentage of fault under California pure comparative fault rules. The car accident settlement calculator on this page runs this formula automatically.',
    schemaAnswer:
      'California car accident settlements use the multiplier method: economic damages (medical bills, lost wages, future costs) multiplied by 1.5x–5.0x based on injury severity to produce pain and suffering. Property damage is added separately. The final total is reduced by your fault percentage under pure comparative fault rules.',
  },
  {
    id: 'ca-car-faq-3',
    question: 'What damages can I recover in a California car accident?',
    answer:
      'You can recover economic damages (medical bills, future medical costs, lost wages, future lost wages, vehicle repair or replacement, rental car costs, and out-of-pocket expenses) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment of life, and loss of consortium for a spouse). California places no cap on non-economic damages for car accident claims — the MICRA cap applies only to medical malpractice.',
    schemaAnswer:
      'California car accident recoverable damages include economic damages (medical bills, future costs, lost wages, vehicle damage, out-of-pocket expenses) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment, loss of consortium). California has no cap on non-economic damages for car accidents — the MICRA cap applies only to medical malpractice.',
  },
  {
    id: 'ca-car-faq-4',
    question: 'How long do I have to file a car accident claim in California?',
    answer:
      'You have two years from the accident date to file a personal injury lawsuit under California Code of Civil Procedure Section 335.1. For property damage only, the deadline is three years. If a government vehicle was involved, you must file a government tort claim within six months. Missing these deadlines almost always means losing your right to recover, regardless of how strong your claim is.',
    schemaAnswer:
      'California\'s statute of limitations for car accident personal injury claims is two years from the accident date under CCP § 335.1. Property damage claims have three years. Government vehicle accidents require a tort claim within six months. Missing any deadline typically bars recovery entirely.',
  },
  {
    id: 'ca-car-faq-5',
    question: 'Does fault affect my car accident settlement in California?',
    answer:
      'Yes, but it does not eliminate your recovery. California uses pure comparative fault, meaning your damages are reduced by your percentage of fault — not eliminated. If you are found 40% at fault on a $100,000 claim, you recover $60,000. Unlike modified comparative fault states where being over 50% at fault bars your recovery entirely, California allows you to recover at any fault percentage. This makes California one of the most favorable states for injured drivers with partial fault.',
    schemaAnswer:
      'California uses pure comparative fault — your damages are reduced by your fault percentage but not eliminated. 40% fault on a $100,000 claim yields $60,000. Unlike modified comparative fault states with a 51% bar, California allows recovery at any fault level, making it one of the most favorable states for partially-at-fault plaintiffs.',
  },
]

// ─── Texas state-specific FAQs ────────────────────────────────────────────────

const TX_CAR_FAQS: FAQItem[] = [
  {
    id: 'tx-car-faq-1',
    question: 'How much is a car accident settlement worth in Texas?',
    answer:
      'There is no fixed amount — settlement value depends on your medical bills, lost wages, future treatment costs, and the severity of your pain and suffering. A minor soft tissue injury with $8,000 in medical bills might settle for $20,000 to $30,000. A serious fracture requiring surgery with $50,000 in medical bills and several months off work might settle for $150,000 to $300,000 or more. Use the calculator above to run your specific numbers.',
    schemaAnswer:
      'Texas car accident settlement values depend on medical bills, lost wages, future costs, and pain and suffering severity. Minor soft tissue injuries typically settle $20,000–$30,000. Serious fractures with surgery and missed work commonly settle $150,000–$300,000 or more. Use the calculator to run your specific numbers.',
  },
  {
    id: 'tx-car-faq-2',
    question: 'How is a car accident settlement calculated in Texas?',
    answer:
      'The most common method is the multiplier method: your total economic damages (medical bills plus lost wages plus future costs) are multiplied by a factor between 1.5 and 5 based on injury severity to calculate pain and suffering. That pain and suffering figure is added to your economic damages for a total. Your property damage is calculated separately. If you share any fault, the total is reduced by your fault percentage — but only if your fault is 50% or less under Texas law.',
    schemaAnswer:
      'Texas car accident settlements use the multiplier method: economic damages (medical bills, lost wages, future costs) multiplied by 1.5x–5x based on injury severity to produce pain and suffering. Property damage is calculated separately. The total is reduced by your fault percentage, provided your fault does not exceed 50%.',
  },
  {
    id: 'tx-car-faq-3',
    question: 'Does fault affect my Texas car accident settlement?',
    answer:
      'Yes, significantly. Texas uses modified comparative fault with a 51% bar. If you are 30% at fault, you recover 70% of your total damages. If you are 51% or more at fault, you recover nothing. Insurance adjusters will actively investigate your actions before and during the accident to assign you partial fault wherever possible. Your own conduct — speed, distraction, lane position — becomes part of the damages calculation.',
    schemaAnswer:
      'Texas uses modified comparative fault with a 51% bar. 30% fault means you recover 70% of damages. 51% or more fault bars recovery entirely. Insurance adjusters actively investigate your conduct — speed, distraction, lane position — to assign partial fault and reduce their payout.',
  },
  {
    id: 'tx-car-faq-4',
    question: 'What damages can I recover in a Texas car accident?',
    answer:
      'You can recover economic damages (medical bills, lost wages, vehicle repair, future medical costs, future lost earnings, and diminished vehicle value) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment of life, loss of consortium). Texas places no cap on non-economic damages for car accidents. Punitive damages are available in cases of gross negligence or intentional conduct, though they are rare in standard car accident claims.',
    schemaAnswer:
      'Texas car accident recoverable damages include economic damages (medical bills, lost wages, vehicle repair, future costs, diminished vehicle value) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment, loss of consortium). Texas has no cap on non-economic damages for car accidents. Punitive damages may apply in gross negligence cases.',
  },
  {
    id: 'tx-car-faq-5',
    question: 'How long do I have to file a car accident claim in Texas?',
    answer:
      'Two years from the date of the accident for both personal injury and property damage under Texas Civil Practice and Remedies Code § 16.003. If you miss this deadline, your lawsuit will be dismissed. Minors have until two years after their 18th birthday to file. Government vehicle accidents have a shorter notice requirement — you must file a formal notice of claim within six months.',
    schemaAnswer:
      'Texas\'s statute of limitations for car accident personal injury and property damage claims is two years under CPRC § 16.003. Missing the deadline results in dismissal. Minors have until two years after turning 18. Government vehicle accidents require formal notice of claim within six months.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StateCarAccidentPage({ params }: { params: { state: string } }) {
  const stateData = getCarAccidentStateBySlug(params.state)
  if (!stateData) notFound()

  // Use state-specific FAQs for Tier 1 launch states; generic set for all others
  const faqs: FAQItem[] =
    stateData.slug === 'california'
      ? CA_CAR_FAQS
      : stateData.slug === 'texas'
        ? TX_CAR_FAQS
        : getCarAccidentFAQs()

  const canonicalUrl = `https://settlebrook.com/car-accident-settlement-calculator/${stateData.slug}/`

  // State-specific description for schema (mirrors generateMetadata logic)
  const noFaultSuffix = stateData.isNoFaultState
    ? ` ${stateData.name} is a no-fault insurance state — PIP rules apply.`
    : ''
  const schemaDescription = (
    `Free ${stateData.name} car accident settlement calculator. Estimate damages under ${stateData.faultRuleLabel} rules, ${stateData.statuteOfLimitations}-year SOL.${noFaultSuffix} Instant results.`
  ).slice(0, 155)

  // ── JSON-LD schemas ────────────────────────────────────────────────────────

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${stateData.name} Car Accident Settlement Calculator`,
    url: canonicalUrl,
    description: schemaDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    // areaServed scopes this WebApplication to the specific state for local SEO
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
        name: 'Car Accident Settlement Calculator',
        item: 'https://settlebrook.com/car-accident-settlement-calculator/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${stateData.name} Car Accident Settlement Calculator`,
        item: canonicalUrl,
      },
    ],
  }

  // ── Fault badge style helper (mirrors pain-and-suffering state page) ───────

  const faultBadgeClass: Record<string, string> = {
    'pure-comparative':        'state-badge state-badge-green',
    'modified-comparative-50': 'state-badge state-badge-amber',
    'modified-comparative-51': 'state-badge state-badge-amber',
    contributory:              'state-badge state-badge-red',
  }
  const badgeClass = faultBadgeClass[stateData.faultRule] ?? 'state-badge state-badge-muted'

  // Tier-1 launch state link list — CA and TX (excluding current state)
  const tier1States = CAR_ACCIDENT_STATES.filter(
    (s) => (s.slug === 'california' || s.slug === 'texas') && s.slug !== stateData.slug,
  )

  return (
    <>
      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(faqs)) }} />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Car Accident Settlement Calculator', href: '/car-accident-settlement-calculator/' },
              { label: stateData.name, href: `/car-accident-settlement-calculator/${stateData.slug}/` },
            ]} />
            <div className="mt-4">
              {/* H1 — primary keyword "[State] car accident settlement calculator" ✓ */}
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.02em' }}
              >
                {stateData.name} Car Accident Settlement Calculator
              </h1>
              <p className="mt-3 text-base leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your {stateData.name} car accident settlement under{' '}
                <strong style={{ color: '#E2E8F0' }}>{stateData.faultRuleLabel}</strong> rules.
                Covers medical bills, vehicle damage, lost wages, and pain &amp; suffering.
                {stateData.isNoFaultState && (
                  <span>
                    {' '}{stateData.name} is a{' '}
                    <strong style={{ color: '#E2E8F0' }}>no-fault insurance state</strong> — PIP coverage applies first.
                  </span>
                )}
              </p>
            </div>
            {/* State law badge row */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={badgeClass}>{stateData.faultRuleLabel}</span>
              <span className="state-badge state-badge-muted">
                {stateData.statuteOfLimitations}-Year Statute of Limitations
              </span>
              {stateData.isNoFaultState && (
                <span className="state-badge state-badge-blue">No-Fault Auto State</span>
              )}
              {stateData.avgSettlementLow > 0 && stateData.avgSettlementHigh > 0 && (
                <span className="state-badge state-badge-muted">
                  Avg. Range {formatCurrency(stateData.avgSettlementLow)}–{formatCurrency(stateData.avgSettlementHigh)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── LEFT: state law callout + calculator ── */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>

              <AdSlot id={`CAR_STATE_AD_TOP_${stateData.abbreviation}`} />

              {/* State law facts panel */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(99,179,237,0.15)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h2 className="text-sm font-bold mb-3" style={{ color: '#F1F5F9' }}>
                  {stateData.name} Car Accident Law — Key Facts
                </h2>
                <div className="flex flex-col gap-2.5 text-sm" style={{ color: '#94A3B8' }}>

                  {/* Fault rule */}
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0" style={{ color: '#60A5FA' }}>⚖️</span>
                    <div>
                      <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                        {stateData.faultRuleLabel}:{' '}
                      </span>
                      {stateData.faultRule === 'pure-comparative' && (
                        <>Your settlement is reduced by your fault percentage. Recovery is allowed at any fault level — even if you were mostly at fault.</>
                      )}
                      {stateData.faultRule === 'modified-comparative-51' && (
                        <>Your settlement is reduced by your fault percentage. Recovery is barred entirely if you are found 51% or more at fault.</>
                      )}
                      {stateData.faultRule === 'modified-comparative-50' && (
                        <>Your settlement is reduced by your fault percentage. Recovery is barred entirely if you are found 50% or more at fault.</>
                      )}
                      {stateData.faultRule === 'contributory' && (
                        <>
                          <strong style={{ color: '#F87171' }}>Any fault at all bars recovery completely.</strong> Even 1% fault on your part eliminates your right to sue the at-fault driver. Consult an attorney immediately.
                        </>
                      )}
                    </div>
                  </div>

                  {/* Statute of limitations */}
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0" style={{ color: '#60A5FA' }}>📅</span>
                    <div>
                      <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                        {stateData.statuteOfLimitations}-Year Filing Deadline:{' '}
                      </span>
                      You have {stateData.statuteOfLimitations} year{stateData.statuteOfLimitations !== 1 ? 's' : ''} from the date of the accident to file a lawsuit in {stateData.name}. Missing this deadline permanently bars your claim regardless of its merits.
                    </div>
                  </div>

                  {/* No-fault threshold */}
                  {stateData.isNoFaultState && (
                    <div className="flex gap-2.5">
                      <span className="flex-shrink-0" style={{ color: '#93C5FD' }}>🏥</span>
                      <div>
                        <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                          No-Fault State — PIP Required:{' '}
                        </span>
                        Your own Personal Injury Protection (PIP) insurance pays medical bills first regardless of fault. To sue the at-fault driver for pain &amp; suffering, your injuries must meet {stateData.name}&apos;s serious injury threshold.
                      </div>
                    </div>
                  )}

                  {/* Fault state — direct claim note */}
                  {!stateData.isNoFaultState && (
                    <div className="flex gap-2.5">
                      <span className="flex-shrink-0" style={{ color: '#34D399' }}>✅</span>
                      <div>
                        <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                          At-Fault State:{' '}
                        </span>
                        {stateData.name} is a traditional fault state. You can file a claim directly against the at-fault driver&apos;s liability insurance for all damages — no PIP threshold applies.
                      </div>
                    </div>
                  )}

                  {/* Average settlement range */}
                  {stateData.avgSettlementLow > 0 && stateData.avgSettlementHigh > 0 && (
                    <div className="flex gap-2.5">
                      <span className="flex-shrink-0" style={{ color: '#FBBF24' }}>📊</span>
                      <div>
                        <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                          Observed Settlement Range:{' '}
                        </span>
                        Car accident settlements in {stateData.name} typically range from{' '}
                        <span style={{ color: '#FBBF24' }}>{formatCurrency(stateData.avgSettlementLow)}</span> to{' '}
                        <span style={{ color: '#FBBF24' }}>{formatCurrency(stateData.avgSettlementHigh)}</span> for moderate injuries. Severe or permanent injuries may exceed this range significantly.
                      </div>
                    </div>
                  )}

                  {/* State-specific notes — shown only when non-empty (Tier 1 states) */}
                  {stateData.stateSpecificNotes && (
                    <div
                      className="rounded-xl px-4 py-3 mt-1"
                      style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: '#93C5FD' }}>
                        {stateData.stateSpecificNotes}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs mt-3 italic" style={{ color: '#475569' }}>
                  Verify current laws with a licensed {stateData.name} personal injury attorney.
                </p>
              </div>

              {/* Car accident calculator — passes stateSlug, stateName, and faultRule */}
              <CarAccidentCalculator
                stateSlug={stateData.slug}
                stateName={stateData.name}
                faultRule={stateData.faultRule}
              />
            </div>

            {/* ── SIDEBAR ── */}
            <aside aria-label="Related state information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              {/* Guide CTA */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  How Are {stateData.name} Car Accident Settlements Calculated?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Learn the multiplier method, per diem method, policy limits, and how {stateData.name}&apos;s{' '}
                  {stateData.faultRuleLabel.toLowerCase()} rule affects your final number.
                </p>
                <Link
                  href="/pain-and-suffering-calculator/guide/"
                  style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}
                >
                  Read the Complete Guide →
                </Link>
              </div>

              {/* Other state calculators — CA and TX (excluding current) */}
              {tier1States.length > 0 && (
                <nav aria-label="Other state car accident calculators">
                  <SideCard>
                    <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                      Other State Calculators
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {tier1States.map((state) => (
                        <li key={state.slug}>
                          <Link
                            href={`/car-accident-settlement-calculator/${state.slug}/`}
                            className="text-sm transition-colors hover:opacity-80"
                            style={{ color: '#60A5FA' }}
                          >
                            {state.name} Car Accident Calculator
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
                        <Link
                          href="/car-accident-settlement-calculator/"
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
                        href="/workers-comp-settlement-calculator/"
                        className="text-sm hover:opacity-80 transition-colors"
                        style={{ color: '#60A5FA' }}
                      >
                        Workers Comp Calculator
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>
            </aside>
          </div>

          {/* ── STATE-SPECIFIC EDITORIAL CONTENT ── */}

          {stateData.slug === 'california' ? (
            /* ─────────────────────────────────────────────────────────────────
               CALIFORNIA — converted from public/ca-car-accident-content.md
               Front matter ignored. All full URLs converted to relative paths.
               AD_SLOT comments replaced with styled AdSlot components.
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                If you were just in a California car accident, you already know the drill — the other driver&apos;s insurance adjuster called within 24 hours, they were sympathetic, and they asked you to give a recorded statement before you even know the full extent of your injuries. Do not do it. That call is not customer service. It is a claim-minimization call. Before you respond to anything, understanding what your California car accident claim is actually worth gives you the leverage to answer on your own terms.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Use the{' '}
                <Link href="/car-accident-settlement-calculator/" style={{ color: '#60A5FA' }}>car accident settlement calculator</Link>{' '}
                above to run your own estimate, then read through what California law actually says about what you are owed.
              </p>

              <AdSlot id="CAR_STATE_AD_TOP_CA" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                What a California Car Accident Settlement Covers
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                California law allows injured drivers and passengers to recover two categories of damages from an at-fault party: economic damages and non-economic damages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Economic damages are the measurable financial losses you suffered because of the crash. They include your current medical bills, the cost of future treatment or surgery if your injury is ongoing, wages you lost while you were unable to work, your diminished earning capacity if the injury is permanent, vehicle repair or total loss value, rental car expenses, and any out-of-pocket costs that flow directly from the accident.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Non-economic damages cover the losses that do not come with a receipt. Pain and suffering is the largest category here — it accounts for the physical pain, the sleepless nights, the anxiety you feel every time you approach an intersection, and the enjoyment of life you have lost during recovery. California places no cap on non-economic damages in car accident cases. The MICRA cap that limits non-economic damages to $350,000 applies only to medical malpractice claims, not to personal injury claims arising from car accidents. You are entitled to pursue the full value of your pain and suffering.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Understanding{' '}
                <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link>{' '}
                is especially important in California because non-economic damages often represent the largest share of a total settlement.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Car Accident Settlements Are Calculated in California
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most common approach insurers and attorneys use is the multiplier method. Your total economic damages — medical bills, future treatment, lost wages, and future lost wages — form the base. That base is multiplied by a factor that reflects injury severity, typically ranging from 1.5x for minor soft tissue injuries to 5.0x for catastrophic injuries. Property damage is tracked separately and added directly to the total without a multiplier applied.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                As a concrete example: suppose you had $22,000 in medical bills, $8,000 in lost wages, $6,000 in future physical therapy, and $4,500 in vehicle repair costs. Your multiplier base is $30,000. At a moderate severity multiplier of 2.5x, your pain and suffering estimate is $75,000. Add back your $30,000 economic base and your $4,500 property damage and your gross estimate is $109,500.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                California also allows the per diem method — assigning a daily dollar rate to your pain and suffering and multiplying it by your recovery days. If you assign $150 per day and recovered over 240 days, that produces $36,000 in pain and suffering. Which method produces a higher number depends on your facts, and the{' '}
                <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>{' '}
                lets you run both.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Insurance companies use claims management software — most commonly Colossus — that weights factors like the type of injury, the treating physician&apos;s specialty, the number of office visits, and whether you had a gap in treatment. Colossus tends to undervalue claims. Understanding how it works before you negotiate puts you in a far better position.
              </p>

              <AdSlot id="CAR_STATE_AD_MID_CA" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California Pure Comparative Fault and Your Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                California follows pure comparative fault rules, which is one of the most plaintiff-friendly fault standards in the country. Under pure comparative fault, you can recover damages even if you were 99% at fault for the accident. Your recovery is simply reduced by your percentage of fault.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your total damages come to $109,500 and a jury finds you were 30% at fault for changing lanes without a turn signal, you recover $76,650 — which is $109,500 reduced by 30%. You do not lose the right to recover entirely.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Contrast this with states that use a modified comparative fault standard. In Texas and most other states, if you are found to be 51% or more at fault, you recover nothing. In California that bar does not exist. It is a meaningful difference, particularly in multi-vehicle accidents and intersection crashes where shared fault is common.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The practical implication: do not assume that because you were partially at fault, you have no claim. The adjuster calling you on day one already knows your jurisdiction uses pure comparative fault. They will try to get you to overstate your fault contribution on a recorded statement so they can reduce their payout. Knowing the rule protects you.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California Insurance Minimums and Policy Limits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                California is an at-fault state, not a traditional no-fault state. When another driver causes your accident, you make a bodily injury (BI) claim against their liability coverage, not your own.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For years, California required minimum liability coverage of $15,000 per person, $30,000 per accident, and $5,000 for property damage — commonly written as 15/30/5. That minimum has been inadequate for decades given California&apos;s cost of living and medical costs. As of January 1, 2025, California raised the required minimums to $30,000 per person, $60,000 per accident, and $15,000 for property damage (30/60/15). Policies in force before that date have until January 1, 2030 to comply.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The practical problem is that even the new minimums are often insufficient. If you have a herniated disc requiring surgery, your medical bills alone may reach $60,000 to $120,000. If the at-fault driver only carried 30/60/15, your BI claim is capped at $30,000 regardless of what your damages actually total.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                This is where uninsured and underinsured motorist (UM/UIM) coverage matters. California requires insurers to offer UM/UIM coverage, but you are not required to purchase it. If you waived it in writing when you set up your policy, you may not have it. If your own policy includes UIM coverage, you can make a separate claim against your own insurer for the gap between the at-fault driver&apos;s policy limit and your actual damages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                MedPay coverage — a California-specific option available on most auto policies — covers your medical bills regardless of fault, which makes it useful for covering treatment costs while your BI claim is still being negotiated.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Factors That Affect California Car Accident Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Beyond the numbers you enter into the calculator, several factors pull settlement values up or down in California specifically.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Venue matters significantly. Los Angeles, San Francisco, and San Diego are among the highest verdict venues in the country. Juries in these counties return larger verdicts on average than juries in Central Valley or rural counties, and insurers factor expected jury exposure into their settlement offers. If your case could end up in LA County Superior Court, the insurer knows that.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Documentation quality is the second major factor. Consistent medical treatment with no gaps, records from specialists rather than only urgent care, and a treating physician who documents functional limitations in clinical notes all increase claim value. A gap in treatment — even one caused by financial hardship — is used by adjusters to argue your injury was not serious.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Liability clarity is the third. Clean rear-end collisions where fault is obvious settle faster and for more than intersection crashes with disputed liability. Clear liability documentation — police report, photos, witness statements, traffic camera footage — protects your position from the start.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                California Statute of Limitations for Car Accidents
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You have two years from the date of the accident to file a personal injury lawsuit in California under California Code of Civil Procedure Section 335.1. If you do not file within two years, the court will almost certainly dismiss your case regardless of how strong it is, and you lose the right to recover anything.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The statute of limitations for property damage — your vehicle repair or total loss claim — is three years under CCP Section 338.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Two exceptions are worth knowing. If you were injured by a government vehicle or on government property, you must file a government tort claim within six months of the incident before you can sue. Miss the six-month window and the two-year limitation becomes irrelevant — you are already barred. The second exception covers minors: the two-year clock does not begin running until the injured person turns 18.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Do not treat the two-year deadline as a planning horizon. Cases settled after 18 months of negotiations typically settle for less than cases where an attorney filed suit within the first year, because filing creates trial exposure that motivates the insurer to resolve the claim seriously.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Car Accident Settlements in California
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Average settlement figures are often misleading because they blend minor fender-benders with catastrophic injury cases, but the ranges give you a calibration point.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Soft tissue injuries — whiplash, muscle strains, minor sprains — with medical bills under $10,000 typically settle in the $15,000 to $35,000 range in California, assuming clear liability and no gap in treatment. Moderate injuries involving a herniated disc, shoulder tear, or fracture that require surgery often settle in the $75,000 to $200,000 range. Serious injuries — spinal cord damage, traumatic brain injury, permanent disability — regularly produce settlements and verdicts above $500,000 in California, with catastrophic injury cases frequently exceeding $1 million.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                California settlements trend higher than the national average for three structural reasons: higher baseline medical costs, pure comparative fault rules that prevent defendant attorneys from eliminating recovery on technicalities, and high-verdict urban venues that create real trial exposure for insurers.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Your specific case value depends on your injury severity, your treatment documentation, the at-fault driver&apos;s policy limits, and the clarity of liability. The calculator above gives you a starting baseline. An attorney consultation gives you a case-specific number.
              </p>

              <AdSlot id="CAR_STATE_AD_BOTTOM_CA" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={CA_CAR_FAQS} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Use the Calculator to Estimate Your Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You were just in a California car accident, and the other side has already started building their case. The adjuster who called you works for the insurer, not for you. Running your own estimate with the{' '}
                <Link href="/car-accident-settlement-calculator/" style={{ color: '#60A5FA' }}>car accident settlement calculator</Link>{' '}
                gives you a baseline before you accept any offer, respond to any recorded statement request, or sign any release.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For the non-economic damages portion of your estimate, the{' '}
                <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>{' '}
                walks through both the multiplier method and the per diem method so you can see which produces a higher result under your specific facts.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The calculator gives you a starting number. A California personal injury attorney gives you a case-specific analysis — and most work on contingency, meaning you pay nothing unless you recover.
              </p>
            </article>

          ) : stateData.slug === 'texas' ? (
            /* ─────────────────────────────────────────────────────────────────
               TEXAS — converted from public/tx-car-accident-content.md
               Front matter ignored. All full URLs converted to relative paths.
               AD_SLOT comments replaced with styled AdSlot components.
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', marginTop: '40px' }}>
                If you were just in a car accident in Texas, you already know what comes next — the other driver&apos;s insurance company calls within 24 hours, sounds sympathetic, and offers you a number that sounds reasonable until you realize your medical bills alone will exceed it. Texas insurers are legally required to acknowledge your claim within 15 days and accept or deny it within 15 business days after receiving your documentation. They know the clock. They also know most injured people do not. Use the{' '}
                <Link href="/car-accident-settlement-calculator/" style={{ color: '#60A5FA' }}>car accident settlement calculator</Link>{' '}
                to see what your claim is actually worth before you respond to anything.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                What a Texas Car Accident Settlement Covers
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas is an at-fault state, meaning the driver who caused the accident is financially responsible for the damages they caused. When you file a claim against that driver&apos;s liability insurance — or pursue a lawsuit — your settlement can include two categories of compensation.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Economic damages are the measurable financial losses: emergency room bills, follow-up treatment, surgery, physical therapy, prescription costs, future medical care if your injuries require it, lost wages while you recovered, and diminished future earning capacity if your injuries are permanent. Your vehicle repair or total loss value is also an economic damage, though it is handled separately as a property damage claim under Texas law.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Non-economic damages cover what cannot be itemized on a receipt — the physical pain you experienced, the emotional distress, the loss of enjoyment in activities you can no longer do, and the impact on your relationships. Texas places no cap on non-economic damages in car accident cases, which means juries in Dallas or Houston can award substantial sums when injuries are severe and well-documented.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                How Car Accident Settlements Are Calculated in Texas
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The most common method insurance adjusters and personal injury attorneys use is the multiplier method. Your total economic damages (excluding property damage) are multiplied by a number between 1.5 and 5 depending on injury severity, and that product becomes the pain and suffering figure. The full settlement value is then the sum of all economic damages plus pain and suffering, adjusted for any fault assigned to you.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Here is how that plays out with real Texas numbers. Suppose you were rear-ended on I-10 in Houston. Your medical bills total $18,000, you missed $4,000 in wages, and your future physical therapy is estimated at $3,000. Your economic base is $25,000. For a moderate injury — soft tissue, ongoing pain, several months of treatment — a multiplier of 2.5 is reasonable. That produces $62,500 in pain and suffering. Add your $3,200 vehicle repair as a separate property damage claim and your total claim value is approximately $65,200 before any fault reduction.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For serious injuries — fractures, herniated discs, surgeries — multipliers of 3.5 to 4.5 are standard. A $40,000 medical bill at a 3.5 multiplier yields $140,000 in pain and suffering alone. To understand exactly{' '}
                <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link>{' '}
                under both the multiplier and per diem methods, review our dedicated guide.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Texas Modified Comparative Fault — The 51% Rule
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas follows a modified comparative fault system with a 51% bar, and this rule can significantly reduce or eliminate your recovery. Under Texas Civil Practice and Remedies Code § 33.001, you can recover damages as long as your percentage of fault does not exceed 50%. The moment you are found 51% or more responsible for the accident, you recover nothing.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Below that threshold, your award is reduced proportionally. If a jury determines your total damages are $80,000 but you were 25% at fault for the collision — perhaps you were slightly over the speed limit when the other driver ran a red light — you recover $60,000 (75% of $80,000).
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Insurance adjusters in Texas are trained to argue comparative fault aggressively. Even a minor contributing factor on your part — a slightly wide lane position, a delayed reaction — becomes a tool to reduce what they owe you. Recorded statements given early in the process frequently provide the evidence adjusters use to assign you partial fault. Do not give a recorded statement without first understanding your full claim value.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Texas Insurance Requirements and Policy Limits
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas requires all drivers to carry minimum liability coverage of 30/60/25. That means $30,000 per person for bodily injury, $60,000 per accident for bodily injury when multiple people are injured, and $25,000 for property damage. These are minimums, and many drivers carry only minimums.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If your damages exceed $30,000 — which they often do with serious injuries — you face a policy limit problem. The at-fault driver&apos;s insurer will not pay beyond their client&apos;s policy limits regardless of how strong your case is. Your options at that point are pursuing the driver&apos;s personal assets, which is rarely practical, or turning to your own uninsured/underinsured motorist (UIM) coverage.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas insurers are required to offer UIM coverage, but drivers can reject it in writing. If you declined UIM when you purchased your policy, check your declarations page now. If you have it, UIM can cover the gap between the at-fault policy limit and your actual damages.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Texas also has some of the strongest bad faith insurance laws in the country. Under the Texas Insurance Code, an insurer that unreasonably delays payment or denies a valid claim may owe you not just the original damages but an 18% annual penalty plus attorney fees. That statutory penalty is a meaningful lever in settlement negotiations.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Texas Diminished Value Claims
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                One right that many Texas accident victims do not know they have is the diminished value claim. Even after your vehicle is fully repaired to pre-accident condition, it is worth less on the market than an identical vehicle with no accident history. CarFax records the claim. Dealerships and private buyers discount it. That reduction in market value is a compensable loss in Texas.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Diminished value claims are filed separately from your bodily injury claim, against the at-fault driver&apos;s property damage coverage. Texas courts have consistently recognized this right, and the amount recoverable typically ranges from 10% to 25% of the pre-accident vehicle value depending on the severity of the damage. On a $35,000 vehicle with significant structural repair, that is $3,500 to $8,750 in additional compensation that most people leave on the table.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Factors That Affect Texas Car Accident Settlements
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Settlement value is never just a formula. Several practical factors push the number up or down in Texas specifically. The quality and consistency of your medical records is the single largest driver — gaps in treatment or early discharge from care are used by adjusters to argue your injuries were not serious. Conservative jury verdicts in Dallas and Houston compared to California or New York mean that realistic trial value anchors settlement offers lower than in plaintiff-friendly jurisdictions.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The at-fault driver&apos;s policy limits create a hard ceiling that no negotiation can push through. Pre-existing conditions to the same body area — a prior back injury if you now have a herniated disc — will be used to argue your damages are partially attributable to history rather than the accident. Documenting the difference between your baseline health and your post-accident condition through consistent medical records is how you counter that argument.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Texas Statute of Limitations for Car Accidents
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You have two years from the date of the accident to file a personal injury lawsuit in Texas under Texas Civil Practice and Remedies Code § 16.003. The same two-year limit applies to property damage claims. Miss that deadline and Texas courts will almost certainly dismiss your case regardless of how strong it is.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Two years sounds like a long time. It is not, once you factor in the time needed to complete medical treatment, obtain records, have an attorney review liability, and prepare a demand package. Do not wait until the second year to take action. Evidence degrades, witnesses move, and surveillance footage is typically overwritten within 30 to 90 days.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Average Car Accident Settlements in Texas
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                There is no reliable statewide average for Texas car accident settlements because settlement values vary so widely by injury severity, liability clarity, and available insurance coverage. Minor rear-end collisions with soft tissue injuries typically settle in the range of $10,000 to $35,000. Moderate injuries involving fractures or disc herniations with surgery commonly settle between $75,000 and $200,000. Catastrophic injuries — traumatic brain injury, spinal cord damage, permanent disability — regularly exceed $500,000 and can reach into the millions when future medical costs and lost earning capacity are factored in.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                These figures are benchmarks, not guarantees. The actual value of your Texas car accident claim depends on your specific damages, the evidence available, and the policy limits in play. The{' '}
                <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link>{' '}
                on Settlebrook will give you a personalized estimate based on your actual numbers.
              </p>

              <AdSlot id="CAR_STATE_AD_MID_TX" />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={TX_CAR_FAQS} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>
                Use the Texas Car Accident Settlement Calculator
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you were injured in a Texas car accident and the insurance company is already pushing you toward a quick settlement, run your numbers first. The{' '}
                <Link href="/car-accident-settlement-calculator/" style={{ color: '#60A5FA' }}>car accident settlement calculator</Link>{' '}
                walks you through your economic damages, applies the correct multiplier for your injury severity, accounts for your fault percentage under Texas law, and gives you a documented estimate you can use as a baseline in negotiations.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                For a detailed breakdown of your non-economic damages specifically, the{' '}
                <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link>{' '}
                gives you a state-specific estimate under both the multiplier and per diem methods. If you want to compare how Texas settlement values compare to other high-value states, the{' '}
                <Link href="/car-accident-settlement-calculator/california/" style={{ color: '#60A5FA' }}>California car accident settlement calculator</Link>{' '}
                shows how California&apos;s pure comparative fault system produces different outcomes on identical facts.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The estimate is free, takes under two minutes, and could be the difference between accepting a lowball offer and knowing exactly what your case is actually worth.
              </p>

              <AdSlot id="CAR_STATE_AD_BOTTOM_TX" />
            </article>

          ) : (
            /* ─────────────────────────────────────────────────────────────────
               ALL OTHER STATES — generic placeholder.
               Real editorial will be added per Tier 2/3 rollout in AGENTS.md.
               Pattern: add stateData.slug === '[state]' branches above here.
            ───────────────────────────────────────────────────────────────── */
            <article style={{ margin: '0 auto' }}>
              <AdSlot id={`CAR_STATE_AD_MID_${stateData.abbreviation}`} />

              <h2
                className="heading-gradient"
                style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
              >
                Car Accident Settlements in {stateData.name}
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Car accident claims in {stateData.name} follow{' '}
                <strong style={{ color: '#E2E8F0' }}>{stateData.faultRuleLabel}</strong> rules. This means{' '}
                {stateData.faultRule === 'pure-comparative' && (
                  <>
                    your settlement is reduced by your percentage of fault, but you can recover even if
                    you were mostly responsible. There is no fault bar in {stateData.name} — a plaintiff
                    who is 80% at fault can still recover 20% of their damages.
                  </>
                )}
                {stateData.faultRule === 'modified-comparative-51' && (
                  <>
                    your settlement is reduced by your fault percentage, and recovery is barred entirely
                    if you are found 51% or more responsible. Insurance adjusters in {stateData.name}{' '}
                    frequently try to push fault assessments toward or past the 51% bar to eliminate
                    claims. Do not accept their initial fault characterization without consulting an
                    attorney.
                  </>
                )}
                {stateData.faultRule === 'modified-comparative-50' && (
                  <>
                    your settlement is reduced by your fault percentage, and recovery is barred entirely
                    if you are found 50% or more responsible. {stateData.name} uses the stricter 50%
                    threshold — being found equally at fault bars your claim entirely.
                  </>
                )}
                {stateData.faultRule === 'contributory' && (
                  <>
                    <strong style={{ color: '#F87171' }}>
                      any fault on your part — even 1% — completely eliminates your right to recover.
                    </strong>{' '}
                    {stateData.name} is one of only a handful of states that still uses the pure
                    contributory negligence rule. If you have any potential fault, speak with a{' '}
                    {stateData.name} personal injury attorney before communicating with any insurance
                    company.
                  </>
                )}
              </p>

              {stateData.isNoFaultState && (
                <>
                  <h2
                    className="heading-gradient"
                    style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
                  >
                    {stateData.name} No-Fault Insurance and the Serious Injury Threshold
                  </h2>
                  <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                    {stateData.name} is a no-fault insurance state. After a car accident, your own
                    Personal Injury Protection (PIP) coverage pays your medical bills and a portion of
                    your lost wages — regardless of who caused the accident. This is the first layer of
                    recovery in {stateData.name}, and it applies even if the other driver was clearly
                    at fault.
                  </p>
                  <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                    To step outside the no-fault system and pursue a pain and suffering claim directly
                    against the at-fault driver, your injuries must meet the state&apos;s{' '}
                    <strong style={{ color: '#E2E8F0' }}>serious injury threshold</strong>. The
                    specific qualifying categories vary by state, but generally include permanent
                    injury, significant permanent loss of bodily function, significant and permanent
                    scarring or disfigurement, or death. If your injuries do not meet this threshold,
                    your non-economic recovery is limited to what your own PIP policy covers.
                  </p>
                </>
              )}

              <h2
                className="heading-gradient"
                style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
              >
                How This Calculator Estimates Your {stateData.name} Settlement
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Enter your economic damages in the calculator above — medical bills, future medical
                costs, lost wages, future lost earnings, and vehicle repair or replacement. Choose your
                injury severity level to apply a multiplier between 1.5 and 5. The calculator then
                applies your stated fault percentage under {stateData.name}&apos;s{' '}
                {stateData.faultRuleLabel.toLowerCase()} rule to produce your adjusted total estimate.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                You can also enter the at-fault driver&apos;s policy limit. If your estimate exceeds
                that limit, the calculator displays an advisory warning — a useful signal that you may
                need to explore Underinsured Motorist (UIM) coverage or other recovery options.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                Property damage (vehicle repair or total loss) is included in your total economic
                damages but is intentionally excluded from the multiplier base — it is not appropriate
                to amplify a vehicle repair cost by a pain and suffering factor. This matches how{' '}
                {stateData.name} attorneys and insurance adjusters actually calculate claims.
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2
                className="heading-gradient"
                style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
              >
                {stateData.name} Car Accident Settlement — Key Numbers
              </h2>

              {/* Summary stat grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)' }}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
                    Fault Rule
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                    {stateData.faultRuleLabel}
                  </span>
                </div>
                <div
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)' }}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
                    Filing Deadline
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                    {stateData.statuteOfLimitations} Year{stateData.statuteOfLimitations !== 1 ? 's' : ''}
                  </span>
                </div>
                <div
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)' }}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
                    Typical Range
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#FBBF24' }}>
                    {formatCurrency(stateData.avgSettlementLow)}–{formatCurrency(stateData.avgSettlementHigh)}
                  </span>
                </div>
              </div>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                <em>
                  Ranges above are illustrative for moderate car accident injuries in {stateData.name}.
                  Severe or catastrophic injuries, policy limit situations, or cases going to trial
                  may produce significantly different outcomes. Use the calculator above with your
                  actual damage figures for a personalized estimate.
                </em>
              </p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2
                className="heading-gradient"
                style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
              >
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={faqs} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2
                className="heading-gradient"
                style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
              >
                Get Your {stateData.name} Estimate Now
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                The at-fault driver&apos;s insurer is already calculating what your {stateData.name}{' '}
                claim is worth — and that number is optimized for their bottom line, not yours. Scroll
                up and enter your actual damages to get a transparent, formula-driven estimate before
                you accept any offer.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
                If you are also evaluating a pain and suffering claim separately from vehicle damage,
                the{' '}
                <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>
                  Pain &amp; Suffering Calculator
                </Link>{' '}
                runs both the multiplier and per diem methods side by side for direct comparison.
              </p>

              <AdSlot id={`CAR_STATE_AD_BOTTOM_${stateData.abbreviation}`} />
            </article>
          )}

          <div className="w-full">
            <DisclaimerBanner variant="footer" stateName={stateData.name} />
          </div>
        </div>
      </main>
    </>
  )
}
