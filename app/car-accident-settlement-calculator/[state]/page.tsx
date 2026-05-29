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
//   • State-specific content section below calculator (placeholder — real
//     editorial will be added per the Tier 2/3 rollout schedule in AGENTS.md)
//   • FAQ accordion from carAccidentFaqs.ts
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

// ─── Ad slot placeholder — matches CarAccidentCalculator panel style ───────────

function AdSlot({ id }: { id: string }) {
  return (
    <div
      id={id}
      aria-label="Advertisement"
      className="w-full min-h-[90px] rounded-xl flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(99,179,237,0.10)' }}
    >
      <span className="text-xs select-none" style={{ color: 'rgba(148,163,184,0.22)' }}>{id}</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StateCarAccidentPage({ params }: { params: { state: string } }) {
  const stateData = getCarAccidentStateBySlug(params.state)
  if (!stateData) notFound()

  // All 5 car accident FAQs are shared across every state page. State-specific
  // FAQs will be added per the Tier 2/3 rollout schedule.
  const faqs = getCarAccidentFAQs()

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
        <header style={{ backgroundColor: '#0D1526', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
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

          {/* ── STATE-SPECIFIC CONTENT SECTION ── */}
          {/*
            Placeholder section — real editorial content will be added per the
            Tier 1 / Tier 2 / Tier 3 rollout schedule in AGENTS.md.
            Pattern: stateData.slug === 'california' ? <CaArticle /> : stateData.slug === 'texas' ? ...
            Each state will receive a full article with H2 sections covering:
              - [State] car accident law overview
              - How the multiplier method works in [State]
              - [State] fault rule in depth
              - Policy limits and UIM in [State]
              - Average settlement ranges
              - Statute of limitations notes
              - State-specific FAQ accordion
          */}
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
              {/* Fault rule */}
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
              {/* Filing deadline */}
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
              {/* Avg range */}
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

          <div className="w-full">
            <DisclaimerBanner variant="footer" stateName={stateData.name} />
          </div>
        </div>
      </main>
    </>
  )
}
