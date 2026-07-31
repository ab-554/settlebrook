// ─────────────────────────────────────────────────────────────────────────────
// app/pain-and-suffering-calculator/[state]/page.tsx
// State-specific page — dark glass theme, fixed FAQ text visibility
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PainSufferingCalculator from '@/components/calculator/PainSufferingCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { getStateBySlug, getAllStateSlugs, getPriorityStates } from '@/lib/data/states'
import { getStateFAQs, buildFAQSchema } from '@/lib/data/faqContent'

export async function generateStaticParams() {
  return getAllStateSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: { state: string }
}): Promise<Metadata> {
  const stateData = getStateBySlug(params.state)
  if (!stateData) return { title: 'Page Not Found', robots: { index: false, follow: false } }

  const canonicalUrl = `/pain-and-suffering-calculator/${stateData.slug}/`

  // FIX H8: Title pattern — longest US state name is "North Carolina" (14 chars)
  // Pattern: "{State} Pain & Suffering Calculator" = max 14 + 27 = 41 chars → 54 with template ✓
  const pageTitle = `${stateData.name} Pain & Suffering Calculator`

  return {
    title: pageTitle,
    description: stateData.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${pageTitle} | Settlebrook`,
      description: stateData.metaDescription,
      url: canonicalUrl,
      siteName: 'Settlebrook',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${stateData.name} Pain & Suffering Calculator — Settlebrook`,
        },
      ],
    },
    // FIX C4: Twitter card was completely missing from all 50 state pages
    twitter: {
      card: 'summary_large_image',
      site: '@settlebrook',
      title: `${pageTitle} | Settlebrook`,
      description: stateData.metaDescription,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

/** Reusable sidebar card */
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

export default function StatePainSufferingPage({ params }: { params: { state: string } }) {
  const stateData = getStateBySlug(params.state)
  if (!stateData) notFound()

  const faqs = getStateFAQs(stateData.slug, {
    name: stateData.name,
    statuteOfLimitations: stateData.statuteOfLimitations,
    faultRuleLabel: stateData.faultRuleLabel,
    faultRuleExplanation: stateData.faultRuleExplanation,
  })

  const priorityStates = getPriorityStates()
  const canonicalUrl   = `/pain-and-suffering-calculator/${stateData.slug}/`

  // FIX M5: datePublished + dateModified added to WebApplication schema
  const webApplicationSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: `${stateData.name} Pain & Suffering Calculator`,
    url: canonicalUrl, description: stateData.metaDescription,
    applicationCategory: 'FinanceApplication', operatingSystem: 'Web',
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Settlebrook', url: 'https://www.settlebrook.com' },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.settlebrook.com/' },
      { '@type': 'ListItem', position: 2, name: 'Pain & Suffering Calculator', item: 'https://www.settlebrook.com/pain-and-suffering-calculator/' },
      { '@type': 'ListItem', position: 3, name: `${stateData.name} Pain & Suffering Calculator`, item: canonicalUrl },
    ],
  }

  /* State badge style helper */
  const faultBadgeClass: Record<string, string> = {
    'pure-comparative':        'state-badge state-badge-green',
    'modified-comparative-50': 'state-badge state-badge-amber',
    'modified-comparative-51': 'state-badge state-badge-amber',
    contributory:              'state-badge state-badge-red',
  }
  const badgeClass = faultBadgeClass[stateData.faultRule] ?? 'state-badge state-badge-muted'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(faqs)) }} />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Pain & Suffering Calculator', href: '/pain-and-suffering-calculator/' },
              { label: stateData.name, href: `/pain-and-suffering-calculator/${stateData.slug}/` },
            ]} />
            <div className="mt-4">
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.02em' }}
              >
                Pain &amp; Suffering Calculator — {stateData.name}
              </h1>
              <p className="mt-3 text-base leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your {stateData.name} personal injury damages using the multiplier or per
                diem method. Reflects {stateData.name}&apos;s{' '}
                <strong style={{ color: '#E2E8F0' }}>{stateData.faultRuleLabel}</strong> rules and{' '}
                {stateData.statuteOfLimitations}-year statute of limitations.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={badgeClass}>{stateData.faultRuleLabel}</span>
              <span className="state-badge state-badge-muted">
                {stateData.statuteOfLimitations}-Year Statute of Limitations
              </span>
              {stateData.hasDamageCap && (
                <span className="state-badge state-badge-amber">Damage Cap Applies</span>
              )}
              {stateData.isNoFaultState && (
                <span className="state-badge state-badge-blue">No-Fault Auto State</span>
              )}
            </div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: state law callout + calculator */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>

              {/* State law facts */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(99,179,237,0.15)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h2 className="text-sm font-bold mb-3" style={{ color: '#F1F5F9' }}>
                  {stateData.name} Personal Injury Law — Key Facts
                </h2>
                <div className="flex flex-col gap-2.5 text-sm" style={{ color: '#94A3B8' }}>
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0" style={{ color: '#60A5FA' }}>⚖️</span>
                    <div>
                      <span className="font-semibold" style={{ color: '#E2E8F0' }}>{stateData.faultRuleLabel}: </span>
                      {stateData.faultRuleExplanation}
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0" style={{ color: '#60A5FA' }}>📅</span>
                    <div>
                      <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                        {stateData.statuteOfLimitations}-Year Filing Deadline:{' '}
                      </span>
                      {stateData.solNotes}
                    </div>
                  </div>
                  {stateData.hasDamageCap && stateData.damageCap && (
                    <div className="flex gap-2.5">
                      <span className="flex-shrink-0" style={{ color: '#FBBF24' }}>🔒</span>
                      <div>
                        <span className="font-semibold" style={{ color: '#E2E8F0' }}>Damage Cap: </span>
                        Non-economic damages may be capped at{' '}
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stateData.damageCap)}.{' '}
                        {stateData.damageCapNotes}
                      </div>
                    </div>
                  )}
                  {!stateData.hasDamageCap && (
                    <div className="flex gap-2.5">
                      <span className="flex-shrink-0" style={{ color: '#34D399' }}>✅</span>
                      <div>
                        <span className="font-semibold" style={{ color: '#E2E8F0' }}>No Damage Cap: </span>
                        {stateData.name} does not cap non-economic damages for general personal injury cases.
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs mt-3 italic" style={{ color: '#475569' }}>
                  Verify current laws with a licensed {stateData.name} personal injury attorney.
                </p>
              </div>

              <PainSufferingCalculator stateSlug={stateData.slug} stateName={stateData.name} />
            </div>

            {/* Sidebar */}
            <aside aria-label="Related state information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              {/* Attorney CTA */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  How Is Pain and Suffering Calculated?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Learn the multiplier method, per diem method, and what insurance companies actually look at when valuing your claim.
                </p>
                <Link href="/pain-and-suffering-calculator/guide/" style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}>
                  Read the Complete Guide →
                </Link>
              </div>

              {/* Other states */}
              <nav aria-label="Other state calculators">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Other State Calculators</h2>
                  <ul className="flex flex-col gap-2">
                    {priorityStates.filter((s) => s.slug !== stateData.slug).map((state) => (
                      <li key={state.slug}>
                        <Link
                          href={`/pain-and-suffering-calculator/${state.slug}/`}
                          className="text-sm transition-colors hover:opacity-80"
                          style={{ color: '#60A5FA' }}
                        >
                          {state.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
                      <Link
                        href="/pain-and-suffering-calculator/"
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: '#94A3B8' }}
                      >
                        ← All states calculator
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>

              {/* Other calculators */}
              <nav aria-label="Other calculators">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Other Calculators</h2>
                  <ul className="flex flex-col gap-2.5">
                    <li>
                      <Link href="/car-accident-settlement-calculator/" className="text-sm hover:opacity-80 transition-colors" style={{ color: '#60A5FA' }}>
                        Car Accident Settlement Calculator
                      </Link>
                    </li>
                    <li>
                      <Link href="/workers-comp-settlement-calculator/" className="text-sm hover:opacity-80 transition-colors" style={{ color: '#60A5FA' }}>
                        Workers Comp Calculator
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>
            </aside>
          </div>

          {stateData.slug === 'california' ? (
            <article style={{ margin: '0 auto' }}>
              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were hurt in California and you&apos;re trying to figure out what your pain and suffering is actually worth, you&apos;re probably getting one of two things from the internet: vague law firm pages that won&apos;t give you a number, or settlement calculators that spit out a figure with no explanation of how they got there.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This page does neither. The <strong style={{ color: '#E2E8F0' }}>pain and suffering calculator California</strong> residents use on Settlebrook applies the same formula methods that California plaintiffs&apos; attorneys and insurance adjusters actually use — the multiplier method and the per diem method — adjusted for how California law treats fault, damages, and caps. Enter your medical bills and injury details, and you&apos;ll get a realistic range with the math shown.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California personal injury law has a few features that directly change what your claim is worth. This guide explains all of them plainly, with real dollar examples, so you understand your number — not just see it.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under California Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California allows injured victims to recover two categories of damages: economic damages (medical bills, lost wages, future treatment costs, property damage) and non-economic damages — which is the legal category that includes pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering under California law covers physical pain from your injuries, emotional distress, anxiety, depression, loss of enjoyment of life, and loss of consortium for a spouse. California Civil Code § 3333 is the governing provision for compensatory damages in tort cases, and it does not place a cap on non-economic damages in standard personal injury claims.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is a point that confuses a lot of people: <strong style={{ color: '#E2E8F0' }}>California has no general cap on pain and suffering damages for car accidents, slip and falls, or most personal injury claims.</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The cap that exists — and that you may have read about — is the MICRA cap. The Medical Injury Compensation Reform Act limits non-economic damages in medical malpractice claims only. As of 2026, that cap is <strong style={{ color: '#E2E8F0' }}>$470,000 for injury cases</strong> and <strong style={{ color: '#E2E8F0' }}>$650,000 for wrongful death cases</strong> caused by medical negligence. If a doctor or hospital caused your injury, MICRA applies. If a driver, property owner, or employer caused your injury, it does not.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in California</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California attorneys and insurance companies use two primary methods to calculate pain and suffering. Neither is mandated by law — they&apos;re industry standards — but understanding both helps you evaluate any offer you receive.</p>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Multiplier Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Your total economic damages (medical bills paid and anticipated, lost wages, out-of-pocket costs) are multiplied by a number between 1.5 and 5. The multiplier reflects injury severity, recovery time, permanence, and impact on daily life.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Example: You were rear-ended in Los Angeles. You have $18,000 in medical bills, $4,000 in lost wages, and a documented soft tissue injury that required three months of physical therapy. Total economic damages: $22,000. A reasonable multiplier for a moderate, non-permanent injury with good documentation is 2.0 to 2.5.</p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '20px', listStyleType: 'disc' }}>
                <li>At 2.0x: Pain and suffering = $44,000 → Total claim value = <strong style={{ color: '#E2E8F0' }}>$66,000</strong></li>
                <li>At 2.5x: Pain and suffering = $55,000 → Total claim value = <strong style={{ color: '#E2E8F0' }}>$77,000</strong></li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Severe injuries with permanent effects — a herniated disc requiring surgery, traumatic brain injury, spinal cord damage — often justify multipliers of 3.5 to 5.</p>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Per Diem Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>A daily dollar value is assigned to your pain (often $100–$300/day for moderate injuries) and multiplied by the number of days you suffered. For a 90-day recovery at $200/day, that&apos;s $18,000 in pain and suffering alone. This method works well for short, acute recoveries and is sometimes used in California jury instructions to make pain and suffering concrete for jurors.</p>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>California&apos;s Pure Comparative Fault and Your Final Number</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Whatever method produces your pain and suffering figure, California&apos;s pure comparative fault rule is applied last — and it can significantly reduce your recovery. See the next section.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>California&apos;s Pure Comparative Fault Rule</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California follows pure comparative fault under California Civil Code § 1714. This means that even if you were partially responsible for your own injury, you can still recover damages. Your recovery is simply reduced by your percentage of fault.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is more favorable than the rule in Texas and most other states, which bar recovery entirely if you&apos;re more than 50% or 51% at fault. In California, there is no fault bar. Even a plaintiff who is 90% at fault can recover 10% of their damages.</p>

              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Real example:</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You&apos;re injured in a California intersection collision. Your total damages — economic plus pain and suffering — are calculated at $100,000. The insurance company argues you ran a yellow light and assigns you 30% fault.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Under pure comparative fault, your recovery is reduced by 30%: you recover <strong style={{ color: '#E2E8F0' }}>$70,000</strong>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you&apos;re in Los Angeles County and the case goes to trial, the jury decides the fault percentage. In practice, California juries — particularly in Los Angeles and San Francisco — tend to award higher damages than national averages, and the pure comparative fault rule means even partially-at-fault plaintiffs can receive meaningful compensation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>One practical implication: never admit fault at the scene or in recorded statements to insurance adjusters. In California, any statement assigning yourself responsibility — even informally — can be used to increase your fault percentage and reduce your recovery.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect California Pain and Suffering Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the formula, several case-specific factors move California settlements up or down.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Medical documentation quality.</strong> California insurers and defense attorneys look for consistent treatment records that connect your symptoms directly to the accident. Gaps in treatment — even if explained — are used to argue that your injuries weren&apos;t serious or that something else caused them. Treat consistently and follow your doctor&apos;s recommendations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Injury type and permanence.</strong> Soft tissue injuries settle in the lower multiplier range. Herniated discs, fractures, injuries requiring surgery but with good recovery, and any injury with permanent effects justify higher multipliers and tend to settle for more.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Liability clarity.</strong> If fault is disputed or shared, expect a longer negotiation and a lower initial offer. Clear liability — a rear-end collision, a documented premises defect — accelerates settlement and strengthens your position.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue.</strong> Where in California your case would be tried matters enormously. Los Angeles and San Francisco juries historically return higher verdicts than juries in rural Central Valley counties. Insurance companies track verdict data by venue and price their settlement offers accordingly. A $100,000 case in Los Angeles may settle for more than the same case in Fresno.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Insurance bad faith exposure.</strong> California has strong insurance bad faith laws. If an insurer unreasonably delays or denies a valid claim, they may face punitive damages exposure. Experienced California plaintiffs&apos; attorneys use this as leverage in negotiations.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>California Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California Code of Civil Procedure § 335.1 sets a <strong style={{ color: '#E2E8F0' }}>two-year statute of limitations</strong> for personal injury claims. You have two years from the date of injury to file a lawsuit. If you miss that deadline, your claim is permanently barred regardless of how strong it is.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several exceptions extend the deadline:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Discovery rule.</strong> If you didn&apos;t know — and couldn&apos;t reasonably have known — that you were injured, the two-year clock starts from the date you discovered (or should have discovered) the injury. This comes up in cases involving delayed symptom onset, such as some traumatic brain injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Minor plaintiffs.</strong> If the injured person was under 18 at the time of the accident, the two-year clock doesn&apos;t start until they turn 18. They have until their 20th birthday to file.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Government defendants.</strong> If your claim is against a California government entity — a city, county, or state agency — you must file a government tort claim within <strong style={{ color: '#E2E8F0' }}>six months</strong> of the incident before you can sue. Missing this administrative deadline kills the claim entirely, even within the general two-year window.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Don&apos;t treat the two-year limit as breathing room. Evidence degrades, witnesses move, and insurance companies track limitation deadlines closely.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in California</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Settlement data in California isn&apos;t publicly reported, and any source giving you a precise &quot;average&quot; is either guessing or cherry-picking. What injury attorneys and aggregated verdict databases do show are realistic ranges by injury type.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Soft tissue injuries</strong> (sprains, strains, minor whiplash) with no surgery and full recovery: $10,000–$40,000 in total settlement value, with pain and suffering comprising roughly half.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Moderate injuries</strong> (herniated discs, fractures, injuries requiring surgery but with good recovery): $75,000–$250,000, depending on treatment costs, lost income, and case venue.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Severe or permanent injuries</strong> (spinal cord damage, traumatic brain injury, permanent disability, disfigurement): $500,000 to several million dollars, particularly in Los Angeles and Bay Area venues where jury verdicts support higher valuations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>California settlements trend higher than national averages for two reasons: the pure comparative fault rule maximizes plaintiff recovery, and California jury verdicts — particularly in urban counties — are among the highest in the country. Insurance companies price their offers with that jury threat in mind.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'ca-faq-1',
                  question: 'How is pain and suffering calculated in California?',
                  answer: 'California uses two methods: the multiplier method (your total medical bills and economic losses multiplied by 1.5 to 5, based on injury severity) and the per diem method (a daily dollar rate multiplied by your recovery days). Neither is legally mandated — they\'re the standard industry approach used by both plaintiffs\' attorneys and insurance adjusters. Our how pain and suffering is calculated guide covers both methods in full detail.',
                  schemaAnswer: 'California uses two methods: the multiplier method (your total medical bills and economic losses multiplied by 1.5 to 5, based on injury severity) and the per diem method (a daily dollar rate multiplied by your recovery days). Neither is legally mandated — they\'re the standard industry approach used by both plaintiffs\' attorneys and insurance adjusters. Our how pain and suffering is calculated guide covers both methods in full detail.'
                },
                {
                  id: 'ca-faq-2',
                  question: 'Is there a cap on pain and suffering in California?',
                  answer: 'Not for most personal injury claims. California has no general cap on non-economic damages for car accidents, slip and falls, dog bites, or premises liability cases. The MICRA cap — currently $470,000 for injury and $650,000 for wrongful death in 2026 — applies only to medical malpractice claims against healthcare providers.',
                  schemaAnswer: 'Not for most personal injury claims. California has no general cap on non-economic damages for car accidents, slip and falls, dog bites, or premises liability cases. The MICRA cap — currently $470,000 for injury and $650,000 for wrongful death in 2026 — applies only to medical malpractice claims against healthcare providers.'
                },
                {
                  id: 'ca-faq-3',
                  question: 'What is pure comparative fault in California?',
                  answer: 'Pure comparative fault means your compensation is reduced by your percentage of fault, but not eliminated. If you\'re 40% at fault and your damages are $100,000, you recover $60,000. California is one of a minority of states that allows recovery even when the plaintiff is more than 50% responsible. Most states would bar your claim entirely at that fault level.',
                  schemaAnswer: 'Pure comparative fault means your compensation is reduced by your percentage of fault, but not eliminated. If you\'re 40% at fault and your damages are $100,000, you recover $60,000. California is one of a minority of states that allows recovery even when the plaintiff is more than 50% responsible. Most states would bar your claim entirely at that fault level.'
                },
                {
                  id: 'ca-faq-4',
                  question: 'How long do I have to file a personal injury claim in California?',
                  answer: 'Two years from the date of injury under California Code of Civil Procedure § 335.1. Key exceptions: the discovery rule extends this for injuries with delayed onset; minors have until age 20; and government entity claims require a tort claim filed within six months of the incident. Missing any of these deadlines eliminates your right to recover.',
                  schemaAnswer: 'Two years from the date of injury under California Code of Civil Procedure § 335.1. Key exceptions: the discovery rule extends this for injuries with delayed onset; minors have until age 20; and government entity claims require a tort claim filed within six months of the incident. Missing any of these deadlines eliminates your right to recover.'
                },
                {
                  id: 'ca-faq-5',
                  question: 'What is the average pain and suffering settlement in California?',
                  answer: 'There is no single average — settlement values range from under $10,000 for minor soft tissue injuries to millions for permanent disability cases. California settlements trend higher than the national average due to pure comparative fault rules and high urban jury verdict data in counties like Los Angeles and San Francisco. The most accurate estimate for your specific situation comes from entering your actual damages into the calculator.',
                  schemaAnswer: 'There is no single average — settlement values range from under $10,000 for minor soft tissue injuries to millions for permanent disability cases. California settlements trend higher than the national average due to pure comparative fault rules and high urban jury verdict data in counties like Los Angeles and San Francisco. The most accurate estimate for your specific situation comes from entering your actual damages into the calculator.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Free California Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The formulas and legal rules on this page are built into Settlebrook&apos;s <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link>. Enter your medical expenses, injury type, and recovery duration and you&apos;ll get a California-specific estimate using both the multiplier and per diem methods — with the math shown so you understand what&apos;s driving your number.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you&apos;re also researching how fault rules and caps apply in another state, see the <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link> for a direct comparison with California&apos;s pure comparative fault approach.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This calculator provides an estimate for informational purposes only. It is not legal advice. Consult a licensed California personal injury attorney before making decisions about your claim.</em></p>
            </article>
          ) : stateData.slug === 'texas' ? (
            <article style={{ margin: '0 auto' }}>
              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Texas — whether in a car accident on I-35, a slip and fall at a Houston strip mall, or a workplace incident in Dallas — you are probably dealing with medical bills, missed work, and an insurance adjuster who has already called you twice. That adjuster&apos;s job is to close your claim fast and cheap. Your job is to understand what your case is actually worth before you sign anything.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering damages are the part of your settlement that compensates you for the physical pain, emotional distress, and reduced quality of life your injury caused. They are separate from your medical bills and lost wages. In Texas, these damages are called non-economic damages, and calculating them correctly can be the difference between a fair settlement and leaving tens of thousands of dollars on the table.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> above to estimate your damages, then read through this page to understand exactly how Texas law affects your number.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Texas Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas law allows injured people to recover two broad categories of damages in a personal injury claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Economic damages</strong> are the easy ones to quantify: your ER bill, follow-up appointments, physical therapy, prescription costs, lost wages while you recovered, and future medical expenses if your injury is permanent.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Non-economic damages</strong> — what most people call pain and suffering — cover everything that does not come with a receipt. Under the Texas Civil Practice and Remedies Code, non-economic damages include physical pain and suffering, mental anguish, physical impairment, disfigurement, and loss of consortium (the impact on your relationship with a spouse).</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas does <strong style={{ color: '#E2E8F0' }}>not</strong> cap non-economic damages in standard personal injury cases. A jury can award whatever it finds reasonable. The only meaningful cap applies to medical malpractice cases: $250,000 against an individual healthcare provider, with an aggregate cap of $750,000 across all defendants. If your injury came from a car accident, a defective product, or a premises liability incident, no statutory ceiling limits your non-economic recovery.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas Tort Reform in 2003 changed the landscape significantly — it tightened expert witness standards, capped med mal damages, and made it harder to join multiple defendants — but it did not eliminate pain and suffering recovery for standard personal injury claims.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Texas</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas courts and insurance companies use two primary methods to calculate pain and suffering. Neither is written into Texas law — they are industry standards used in negotiation and presented to juries as frameworks.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Multiplier Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You add up all your economic damages (medical bills plus lost wages) and multiply by a number between 1.5 and 5. The multiplier reflects injury severity.</p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px', listStyleType: 'disc' }}>
                <li>Minor soft-tissue injury, full recovery in 8 weeks: multiplier of 1.5 to 2</li>
                <li>Moderate injury requiring surgery, 6-month recovery: multiplier of 2.5 to 3.5</li>
                <li>Permanent injury, chronic pain, or significant disability: multiplier of 4 to 5</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Texas example:</strong> You suffer a herniated disc in a rear-end collision on I-10 in Houston. Your medical bills total $28,000 and you missed six weeks of work, losing $9,000 in wages. Total economic damages: $37,000. At a 3x multiplier for a moderate injury requiring an epidural injection and physical therapy, your pain and suffering estimate is $111,000, bringing the total claim to $148,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Per Diem Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You assign a daily dollar value to your pain — often your daily wage — and multiply by the number of days you suffered. If you earn $200 per day and suffered for 180 days, your per diem pain and suffering estimate is $36,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas juries respond to both methods. Your attorney will typically use whichever produces the stronger number and is easier to justify with your medical records.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Texas Modified Comparative Fault — The 51% Rule</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Texas follows a modified comparative fault system under Chapter 33 of the Texas Civil Practice and Remedies Code. This rule directly affects how much you can recover, and insurance adjusters use it aggressively to reduce settlements.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Here is how it works: if you are found partially at fault for your own injury, your damages are reduced by your percentage of fault. If you are found 51% or more at fault, you recover <strong style={{ color: '#E2E8F0' }}>nothing</strong>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Example:</strong> You are hit by a driver running a red light, but you were also slightly speeding. A jury finds you 20% at fault and the other driver 80% at fault. If your total damages are $100,000, you recover $80,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Now change the facts: the other driver argues you were actually 55% responsible for the accident because you failed to brake in time. Under Texas law, that finding eliminates your entire recovery.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters know this rule and will try to assign you partial fault in their initial liability evaluation — sometimes inflating your fault percentage to pressure you into a low settlement. If an adjuster tells you that you were partially at fault, do not accept that characterization without speaking to an attorney. Fault allocation is negotiable, and in litigation, it is a question for the jury.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Dallas and Houston claims are particularly affected by this dynamic. Texas juries in large metro areas tend to be more conservative than California or New York juries, and insurance companies price offers accordingly.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Texas Pain and Suffering Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the formula, these factors move the number up or down in real Texas negotiations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Injury documentation.</strong> Texas adjusters and defense attorneys scrutinize gaps in treatment. If you waited two weeks after the accident to see a doctor, expect the defense to argue your injuries were not serious or were caused by something else. Consistent, well-documented medical treatment is the single strongest factor in your favor.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Type of injury.</strong> Herniated discs, traumatic brain injuries, spinal cord injuries, and burns produce higher multipliers than soft-tissue injuries like whiplash. Permanent injuries command the highest settlements because future suffering is compensable.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue.</strong> Harris County (Houston) and Dallas County juries are conservative relative to national averages. A case worth $500,000 in Los Angeles may settle for $300,000 in Dallas. Travis County (Austin) trends slightly more plaintiff-friendly.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Insurance policy limits.</strong> Texas requires minimum auto liability coverage of $30,000 per person. Many at-fault drivers carry only the minimum. If your damages exceed the policy limit, your practical recovery may be capped by the defendant&apos;s coverage unless they have significant personal assets or you have underinsured motorist coverage.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Expert witnesses.</strong> In high-value Texas cases, medical experts who can testify about the permanence and severity of your injuries significantly strengthen your position at trial and in pre-trial negotiations.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Texas Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Texas, you have <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of your injury to file a personal injury lawsuit. This deadline is set by Section 16.003 of the Texas Civil Practice and Remedies Code. Miss it, and the court will almost certainly dismiss your case — no matter how strong your claim is.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Two years sounds like a long time. It is not, once you account for medical treatment, gathering records, expert evaluations, and pre-suit negotiations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Key exceptions to know:</strong></p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px', listStyleType: 'disc' }}>
                <li><strong style={{ color: '#E2E8F0' }}>Minors.</strong> If the injured person is under 18, the two-year clock does not start until they turn 18. A child injured at age 10 has until age 20 to file.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Discovery rule.</strong> In cases where the injury was not immediately apparent — certain toxic exposure or medical negligence cases — the clock may start when you discovered or should have discovered the injury.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Government defendants.</strong> If your claim is against a Texas government entity (a city bus, a county-maintained road), you must file a formal notice of claim within <strong style={{ color: '#E2E8F0' }}>six months</strong> of the incident. This is a much shorter deadline and a common trap.</li>
                <li><strong style={{ color: '#E2E8F0' }}>Wrongful death.</strong> The two-year limitation also applies, running from the date of death.</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not wait until month 23 to consult an attorney. Evidence disappears, witnesses move, and surveillance footage gets overwritten.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Texas</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no honest way to give you a precise average — settlement data is largely private, and the range is enormous based on injury type, fault allocation, and insurance coverage. That said, here is a realistic picture based on claim types.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Minor soft-tissue injuries (whiplash, bruising, strains) with full recovery typically settle in the $8,000 to $25,000 range in Texas, with pain and suffering representing 50 to 60% of that figure.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Moderate injuries requiring surgery — a knee scope, disc surgery, or rotator cuff repair — commonly settle between $75,000 and $250,000 depending on recovery outcomes and fault allocation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Severe injuries involving permanent impairment, traumatic brain injury, or spinal damage can produce settlements and verdicts from $300,000 into the millions, though Texas jury conservatism means these cases often settle below what comparable cases would fetch in California. See our <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link> if you are comparing jurisdictions.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The calculator above gives you a data-anchored starting estimate. Treat it as a floor for negotiation, not a final number.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'tx-faq-1',
                  question: 'How is pain and suffering calculated in Texas?',
                  answer: 'Texas does not prescribe a formula by statute. In practice, attorneys and insurance companies use the multiplier method — adding your medical bills and lost wages, then multiplying by 1.5 to 5 based on injury severity — or the per diem method, which assigns a daily dollar value to your suffering and multiplies it by the duration. Juries hear both approaches and decide what is reasonable. The multiplier method is more common in Texas insurance negotiations.',
                  schemaAnswer: 'Texas does not prescribe a formula by statute. In practice, attorneys and insurance companies use the multiplier method — adding your medical bills and lost wages, then multiplying by 1.5 to 5 based on injury severity — or the per diem method, which assigns a daily dollar value to your suffering and multiplies it by the duration. Juries hear both approaches and decide what is reasonable. The multiplier method is more common in Texas insurance negotiations.'
                },
                {
                  id: 'tx-faq-2',
                  question: 'Is there a cap on pain and suffering in Texas?',
                  answer: 'For standard personal injury claims — car accidents, slip and falls, product liability — there is no cap on non-economic damages in Texas. A jury can award any amount it finds fair. The cap only applies to medical malpractice: $250,000 against an individual provider and $750,000 aggregate. If a doctor or hospital caused your injury, those limits apply. If another driver or property owner caused it, they do not.',
                  schemaAnswer: 'For standard personal injury claims — car accidents, slip and falls, product liability — there is no cap on non-economic damages in Texas. A jury can award any amount it finds fair. The cap only applies to medical malpractice: $250,000 against an individual provider and $750,000 aggregate. If a doctor or hospital caused your injury, those limits apply. If another driver or property owner caused it, they do not.'
                },
                {
                  id: 'tx-faq-3',
                  question: 'What is the 51% rule in Texas personal injury cases?',
                  answer: 'Under Texas modified comparative fault law (Chapter 33, Texas Civil Practice and Remedies Code), you can only recover damages if you are found 50% or less at fault for your own injury. Your damages are reduced proportionally by your fault percentage. If you are assigned 51% or more of the fault, you are completely barred from recovery. Insurance adjusters routinely use this rule as leverage — if they can argue you were primarily responsible, your claim becomes worthless.',
                  schemaAnswer: 'Under Texas modified comparative fault law (Chapter 33, Texas Civil Practice and Remedies Code), you can only recover damages if you are found 50% or less at fault for your own injury. Your damages are reduced proportionally by your fault percentage. If you are assigned 51% or more of the fault, you are completely barred from recovery. Insurance adjusters routinely use this rule as leverage — if they can argue you were primarily responsible, your claim becomes worthless.'
                },
                {
                  id: 'tx-faq-4',
                  question: 'What is the statute of limitations for personal injury in Texas?',
                  answer: 'Two years from the date of the injury, under Section 16.003 of the Texas Civil Practice and Remedies Code. For claims against government entities, a notice of claim must be filed within six months. For injured minors, the clock starts at age 18. Missing the deadline almost always results in complete dismissal of your claim regardless of merit.',
                  schemaAnswer: 'Two years from the date of the injury, under Section 16.003 of the Texas Civil Practice and Remedies Code. For claims against government entities, a notice of claim must be filed within six months. For injured minors, the clock starts at age 18. Missing the deadline almost always results in complete dismissal of your claim regardless of merit.'
                },
                {
                  id: 'tx-faq-5',
                  question: 'What are average pain and suffering settlements in Texas?',
                  answer: 'Ranges vary widely by injury severity. Minor injuries typically produce total settlements of $8,000 to $25,000. Moderate surgical injuries commonly settle in the $75,000 to $250,000 range. Catastrophic or permanent injuries can reach seven figures, though Texas juries are notably conservative compared to other large states. Policy limits, fault allocation, and documentation quality are the primary variables that move your number within those ranges.',
                  schemaAnswer: 'Ranges vary widely by injury severity. Minor injuries typically produce total settlements of $8,000 to $25,000. Moderate surgical injuries commonly settle in the $75,000 to $250,000 range. Catastrophic or permanent injuries can reach seven figures, though Texas juries are notably conservative compared to other large states. Policy limits, fault allocation, and documentation quality are the primary variables that move your number within those ranges.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Calculator — Then Talk to an Attorney</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You have been injured. Texas law gives you real rights, but it also has real traps — a 51% fault bar that can erase your entire claim, a two-year deadline that moves faster than it feels, and insurance adjusters trained to minimize what they pay you.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> gives you a data-based estimate grounded in the multiplier and per diem methods used in actual Texas negotiations. Run your numbers, save your estimate, and walk into any conversation with an insurance company or attorney knowing your baseline.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Your estimate is a starting point. For injuries involving surgery, permanent impairment, disputed fault, or any claim above $25,000, consult a licensed Texas personal injury attorney. Most work on contingency — no fee unless you recover — so the consultation costs you nothing.</p>
            </article>
          ) : stateData.slug === 'florida' ? (
            <article style={{ margin: '0 auto' }}>
              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Florida and you are trying to figure out what your pain and suffering is worth, you have already hit a wall most people outside the state do not see coming. Florida is a no-fault state, which means your own car insurance pays your medical bills first — regardless of who caused the crash. That sounds simple until you realize it also means you cannot automatically sue the driver who hit you for pain and suffering. There is a legal threshold you have to clear first. On top of that, Florida rewrote its personal injury laws in March 2023, and a lot of the information circulating online is already outdated. This page walks you through how pain and suffering is calculated under current Florida law, what you actually need to qualify for a claim, and what settlements in Miami, Orlando, and the rest of the state tend to look like in practice. Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> above to run your own numbers.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Florida Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering is a category of non-economic damages — meaning damages that do not have a receipt attached. Under Florida law, non-economic damages can include physical pain, mental anguish, emotional distress, loss of enjoyment of life, inconvenience, and loss of capacity for enjoyment of life, both past and future.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Florida does not impose a general cap on non-economic damages in standard personal injury cases. The Florida Supreme Court struck down previous statutory caps on pain and suffering in medical malpractice cases in 2017 in <em>North Broward Hospital District v. Kalitan</em>, and the legislature has not reinstated a general cap since. This means a jury in a Florida personal injury case can award whatever amount it determines is fair — there is no ceiling built into the law for most claim types.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>That said, what you can recover is shaped by two significant gatekeeping rules: the no-fault threshold that determines whether you can sue at all, and the 2023 tort reform changes that restructured how fault is assigned and how medical bills are presented at trial.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Florida No-Fault Insurance and the Pain and Suffering Threshold</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Florida requires every driver to carry Personal Injury Protection (PIP) coverage of at least $10,000. When you are injured in a car accident, your own PIP pays 80% of your medical bills and 60% of lost wages up to that $10,000 limit — regardless of fault. PIP does not cover pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>To step outside the no-fault system and sue the at-fault driver for pain and suffering, you must meet the permanent injury threshold under Florida Statute 627.737. The law requires that you prove one of the following:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You suffered a significant and permanent loss of an important bodily function. You sustained a permanent injury within a reasonable degree of medical probability (not just a possibility — a probability). You have significant and permanent scarring or disfigurement. Or the accident caused your death.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft tissue injuries — whiplash, minor sprains, and strains — typically do not meet this threshold, which is why many Florida accident victims are surprised to learn their claim for pain and suffering is blocked even when the other driver was clearly at fault. You generally need objective medical evidence: imaging showing a herniated disc, surgical records, or a physician&apos;s opinion that your injury is permanent.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you do not meet the threshold, you are limited to your PIP benefits for economic losses. If you do meet it, you can pursue full non-economic damages including pain and suffering.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Florida</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Florida does not mandate a specific formula. In practice, attorneys and insurance adjusters use two methods.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Multiplier Method</strong> takes your total economic damages — medical bills, lost wages, future treatment costs — and multiplies them by a number between 1.5 and 5. The multiplier rises with injury severity. A permanent partial disability with ongoing physical limitations might draw a 3x multiplier. A catastrophic injury with total loss of function might push toward 5x.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Example: If your medical bills total $40,000 and your lost wages are $10,000, your economic damages are $50,000. At a 3x multiplier, your pain and suffering estimate is $150,000, and your total claim value is $200,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Per Diem Method</strong> assigns a daily dollar value to your pain — often your daily wage — and multiplies it by the number of days you suffered. For a person earning $200 per day who suffered significant pain for 365 days, that is $73,000 in pain and suffering alone.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters in Florida tend to start lower than these calculations. They also run claims through proprietary software (Colossus is the most common) that compresses multipliers for soft tissue injuries and rewards cases with consistent medical treatment documented in records.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Florida&apos;s 2023 Tort Reform — What Changed</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This section matters. If you are reading anything written before April 2023, the legal landscape it describes no longer exists.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Florida Governor Ron DeSantis signed HB837 into law in March 2023. The changes are the most significant rewrite of Florida personal injury law in decades. Three changes directly affect pain and suffering claims.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Comparative Fault Rule — From Pure to Modified 51% Bar.</strong> Before HB837, Florida followed pure comparative fault. Under that rule, even if you were 99% at fault for an accident, you could still recover 1% of your damages from the other party. That rule is gone. Florida now follows a modified comparative fault system with a 51% bar. If a jury finds you are 51% or more responsible for the accident, you recover nothing. If you are 50% or less at fault, you recover your damages reduced by your percentage of fault. This change makes fault disputes far more aggressive — insurers now have a financial incentive to push your fault percentage above 50%, which eliminates your entire claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Statute of Limitations — Reduced from 4 Years to 2 Years.</strong> Before HB837, Florida personal injury victims had four years from the date of injury to file a lawsuit. That window is now two years. This applies to accidents occurring on or after March 24, 2023. If your accident occurred before that date, the four-year window still applies.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Medical Bill Evidence — Paid Amounts Only.</strong> Under the old rules, plaintiffs could show juries the full billed amount of medical care — often dramatically higher than what insurance actually paid. HB837 limits evidence to the amounts actually paid or owed under a contract. This reduces the economic damages anchor that plaintiffs used to support higher pain and suffering multipliers. It is a significant practical change for how cases are valued in settlement negotiations.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Florida Pain and Suffering Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the legal framework, several case-specific factors move your number up or down.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Injury permanence is the most important. Meeting the permanent injury threshold is the floor — how permanent and how severe determines the ceiling. A herniated disc that responds to physical therapy is treated differently from one requiring spinal fusion surgery.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Consistent medical treatment matters enormously. Gaps in treatment — weeks where you did not see a doctor — give insurers grounds to argue your injuries were not serious or that you caused additional harm by not following care recommendations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Liability clarity affects multipliers. If you bear any comparative fault, your award is reduced by that percentage. A 20% fault finding on a $200,000 claim costs you $40,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Geographic location affects settlement value. Miami-Dade and Broward County juries have historically awarded higher non-economic damages than rural Florida counties. Orlando and Tampa tend to land between rural averages and South Florida figures. Insurers price this into their offers.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Florida Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For accidents occurring on or after March 24, 2023, you have two years from the date of the injury to file a personal injury lawsuit in Florida. Missing this deadline almost certainly means losing your right to recover anything — courts enforce it strictly.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For accidents that occurred before March 24, 2023, the prior four-year limitation period applies.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Two exceptions are worth knowing. The discovery rule can extend the clock when an injury is not reasonably discoverable at the time of the accident — relevant for latent conditions like traumatic brain injuries that are not immediately diagnosed. Claims involving minors generally toll the statute of limitations until the minor turns 18. Government entity claims (accidents on government property or involving government vehicles) require a pre-suit notice within three years and carry additional procedural requirements.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you are anywhere near the two-year mark, consult a Florida personal injury attorney immediately. Filing two days late is the same as never filing.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Florida</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no official average — settlements are private and court verdicts vary dramatically by case facts. That said, publicly available verdict data and industry settlement surveys give rough reference points.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Minor soft tissue injuries where the permanent injury threshold is met (such as a documented disc herniation at a single level with conservative treatment): settlements commonly range from $15,000 to $75,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Moderate permanent injuries requiring surgery — spinal fusion, knee reconstruction, shoulder repair — typically settle between $75,000 and $300,000 depending on age, income, and the extent of ongoing limitations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Severe or catastrophic injuries — traumatic brain injury, spinal cord damage, amputations, permanent paralysis — routinely produce settlements and verdicts above $500,000 and frequently into the millions.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Miami-Dade County juries have returned some of the highest personal injury verdicts in the country, and insurers factor that risk premium into South Florida settlement offers. If you are in Miami or Fort Lauderdale, your settlement leverage is measurably higher than if the same case were litigated in rural north Florida.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'fl-faq-1',
                  question: 'How is pain and suffering calculated in Florida?',
                  answer: 'Florida does not prescribe a formula. The two most common methods are the multiplier method — your total economic damages multiplied by 1.5 to 5 based on injury severity — and the per diem method, which assigns a daily dollar value to your suffering and multiplies it by the duration. Insurance companies also use proprietary claims software that applies internal multipliers. An experienced Florida personal injury attorney can tell you which method produces the stronger number for your specific injuries.',
                  schemaAnswer: 'Florida does not prescribe a formula. The two most common methods are the multiplier method — your total economic damages multiplied by 1.5 to 5 based on injury severity — and the per diem method, which assigns a daily dollar value to your suffering and multiplies it by the duration. Insurance companies also use proprietary claims software that applies internal multipliers. An experienced Florida personal injury attorney can tell you which method produces the stronger number for your specific injuries.'
                },
                {
                  id: 'fl-faq-2',
                  question: 'Does Florida limit pain and suffering damages?',
                  answer: 'No. Florida does not impose a general statutory cap on non-economic damages in standard personal injury cases. The Florida Supreme Court struck down previous caps in medical malpractice cases as unconstitutional, and no general cap exists for car accidents or premises liability claims. However, the permanent injury threshold under Florida Statute 627.737 functions as a practical barrier — if your injuries are not permanent, you cannot recover pain and suffering from the at-fault driver in a car accident case regardless of what the damages would be.',
                  schemaAnswer: 'No. Florida does not impose a general statutory cap on non-economic damages in standard personal injury cases. The Florida Supreme Court struck down previous caps in medical malpractice cases as unconstitutional, and no general cap exists for car accidents or premises liability claims. However, the permanent injury threshold under Florida Statute 627.737 functions as a practical barrier — if your injuries are not permanent, you cannot recover pain and suffering from the at-fault driver in a car accident case regardless of what the damages would be.'
                },
                {
                  id: 'fl-faq-3',
                  question: 'What is the permanent injury threshold in Florida?',
                  answer: 'To sue for pain and suffering in a Florida car accident, you must prove that you suffered a significant and permanent loss of an important bodily function, a permanent injury within a reasonable degree of medical probability, significant and permanent scarring or disfigurement, or death. The threshold must be supported by objective medical evidence. A physician opinion that your condition is permanent — backed by diagnostic imaging, surgical records, or other objective findings — is typically required.',
                  schemaAnswer: 'To sue for pain and suffering in a Florida car accident, you must prove that you suffered a significant and permanent loss of an important bodily function, a permanent injury within a reasonable degree of medical probability, significant and permanent scarring or disfigurement, or death. The threshold must be supported by objective medical evidence. A physician opinion that your condition is permanent — backed by diagnostic imaging, surgical records, or other objective findings — is typically required.'
                },
                {
                  id: 'fl-faq-4',
                  question: 'How did Florida\'s 2023 tort reform change pain and suffering claims?',
                  answer: 'HB837, signed in March 2023, made three major changes. It replaced Florida\'s pure comparative fault rule with a modified 51% bar — if you are more than 50% at fault, you recover nothing. It reduced the personal injury statute of limitations from four years to two years for accidents occurring on or after March 24, 2023. And it restricted the medical bill evidence that plaintiffs can present to juries — only amounts actually paid by insurance can be shown, not billed amounts. Together, these changes favor defendants and insurance companies and make it more important than ever to consult an attorney early.',
                  schemaAnswer: 'HB837, signed in March 2023, made three major changes. It replaced Florida\'s pure comparative fault rule with a modified 51% bar — if you are more than 50% at fault, you recover nothing. It reduced the personal injury statute of limitations from four years to two years for accidents occurring on or after March 24, 2023. And it restricted the medical bill evidence that plaintiffs can present to juries — only amounts actually paid by insurance can be shown, not billed amounts. Together, these changes favor defendants and insurance companies and make it more important than ever to consult an attorney early.'
                },
                {
                  id: 'fl-faq-5',
                  question: 'What is the statute of limitations for personal injury in Florida?',
                  answer: 'Two years from the date of injury for accidents that occurred on or after March 24, 2023. Four years for accidents that occurred before that date under the prior law. Government entity claims have additional notice requirements. Missing the deadline bars your claim entirely.',
                  schemaAnswer: 'Two years from the date of injury for accidents that occurred on or after March 24, 2023. Four years for accidents that occurred before that date under the prior law. Government entity claims have additional notice requirements. Missing the deadline bars your claim entirely.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Calculator — Then Talk to a Florida Attorney</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> gives you a baseline estimate using the multiplier and per diem methods. It is a starting point, not a settlement offer. Florida&apos;s no-fault threshold, the 2023 comparative fault changes, and the new two-year limitation period make legal guidance more important here than in almost any other state.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injuries are permanent and your accident occurred recently, the two-year clock is already running. Most Florida personal injury attorneys work on contingency — no fee unless you recover. For comparison, the <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link> and <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link> pages walk through how those states handle the same calculation under their own rules.</p>
            </article>
          ) : stateData.slug === 'new-york' ? (
            <article style={{ margin: '0 auto' }}>
              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Getting injured in New York is overwhelming enough. Add the complexity of New York&apos;s no-fault insurance system, and most accident victims have no idea where to start. Whether your injury happened in Manhattan rush-hour traffic, on a slippery subway platform, or on a sidewalk outside a Bronx bodega, the rules governing your right to sue for pain and suffering are unlike any other state. New York requires you to clear a legal hurdle called the serious injury threshold before you can bring a personal injury lawsuit for non-economic damages. Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your damages while you read through the law below.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under New York Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>New York places no statutory cap on pain and suffering damages. If your injuries qualify under the serious injury threshold, there is no ceiling on what a jury can award you for your physical pain, emotional anguish, loss of enjoyment of life, and permanent disability.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering in New York covers:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Physical pain</strong> during treatment and recovery</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Ongoing chronic pain</strong> from permanent injuries</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Emotional distress</strong>, anxiety, and PTSD following the incident</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Loss of enjoyment</strong> of activities you could do before the injury</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Disfigurement</strong>, scarring, or permanent functional limitation</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Loss of consortium</strong> for a spouse</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Because New York City juries are among the most plaintiff-friendly in the country — and because the cost of living benchmark used to calculate per diem pain is highest in New York City — settlements and verdicts here routinely exceed those in other states for equivalent injuries.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>New York No-Fault Insurance and the Serious Injury Threshold</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is the section most injured New Yorkers miss — and missing it can destroy a valid claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>New York is a no-fault state under New York Insurance Law Article 51. Every driver must carry Personal Injury Protection (PIP) coverage of at least $50,000. After a car accident, your own insurance pays your medical bills and a portion of your lost wages regardless of who caused the crash. In exchange for this guaranteed coverage, New York law restricts your right to sue the at-fault driver for pain and suffering unless your injury meets one of the nine serious injury categories defined in New York Insurance Law Section 5102(d).</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The nine categories are:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>1. Death.</strong> Your claim passes automatically.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>2. Dismemberment.</strong> Loss of a limb or extremity.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>3. Significant disfigurement.</strong> Visible, permanent scarring that a reasonable person would find objectionable. Minor scars typically do not qualify.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>4. Fracture.</strong> Any broken bone satisfies this category — this is one of the most common ways claims qualify in New York.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>5. Loss of fetus.</strong> A miscarriage caused by the accident qualifies.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>6. Permanent loss of use.</strong> Total, permanent loss of use of a body organ, member, function, or system — for example, permanent paralysis of a limb.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>7. Permanent consequential limitation of use.</strong> Significant, permanent restriction in the use of a body organ or member. A herniated disc causing documented, permanent limitation in spinal motion qualifies if supported by objective medical evidence.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>8. Significant limitation of use.</strong> A significant limitation of a body function or system. This is the most litigated category because &quot;significant&quot; is contested in every case. Duration and degree both matter.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>9. 90/180-day rule.</strong> A medically determined injury or impairment that prevents you from performing substantially all of the material acts that constitute your usual and customary daily activities for not less than 90 of the first 180 days following the accident. This category covers serious soft-tissue injuries and concussions where full recovery takes months but permanency is uncertain.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injury falls into any one of these nine categories — supported by objective medical evidence — you can sue for pain and suffering. If it does not, your recovery in a car accident is limited to your no-fault PIP benefits.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in New York</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>New York courts and insurance adjusters use two primary methods.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Multiplier method:</strong> Your total economic damages (medical bills, lost wages, future medical costs) are multiplied by a factor between 1.5 and 5, depending on injury severity and permanency. A New York City construction worker with $40,000 in medical bills and a documented herniated disc with 30% permanent limitation might see a multiplier of 3 to 4, producing a pain and suffering estimate of $120,000 to $160,000 — on top of economic damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Per diem method:</strong> A daily rate — often $200 to $500 in New York City — is assigned to each day of pain and suffering from the date of injury through maximum medical improvement. A victim who suffered for 18 months before reaching a plateau at $300/day accumulates $164,250 in per diem pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Defense counsel and insurance companies almost always use the multiplier method internally because per diem calculations compound quickly. Plaintiff attorneys in high-value New York City cases often use both methods as arguments at trial.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>New York Pure Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>New York follows pure comparative fault under CPLR Article 14-A. This means your negligence — even if you were 90% responsible for the accident — does not bar your recovery. Your damages are simply reduced by your percentage of fault.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Example: You are hit by a driver who ran a red light in Brooklyn. The jury finds you 25% at fault for jaywalking when hit. Your total damages are $200,000. You recover $150,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is a significant advantage over states like Texas and Florida, where modified comparative fault rules bar recovery entirely once your fault reaches 51%. In New York, there is no such bar. This makes New York one of the most favorable states in the country for personal injury plaintiffs.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Compare how other states handle this using our <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link> and <Link href="/pain-and-suffering-calculator/texas/" style={{ color: '#60A5FA' }}>Texas pain and suffering calculator</Link>.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect New York Pain and Suffering Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the legal framework, these practical factors move settlement values up or down in New York:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue.</strong> New York City (Manhattan, Brooklyn, Queens, the Bronx, Staten Island) produces the highest verdicts in the state. Erie County (Buffalo) and Albany County produce significantly lower awards for equivalent injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Objective medical evidence.</strong> Soft-tissue injuries without MRI findings, nerve conduction studies, or consistent treatment records are aggressively contested. Documented gaps in treatment are used to argue the injury was not serious.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Treatment consistency.</strong> Insurance companies scrutinize gaps in medical care. A 60-day gap in treatment after an accident is argued as evidence of recovery — not inconvenience.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Policy limits.</strong> Even a valid $500,000 pain and suffering claim is constrained by the at-fault driver&apos;s liability limits. If they carry minimum coverage ($25,000 per person in New York), that is the realistic ceiling unless you carry underinsured motorist (UIM) coverage.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Attorney involvement.</strong> New York personal injury attorneys typically work on contingency (33% to 40% of the recovery). Studies consistently show represented plaintiffs receive higher net recoveries than unrepresented plaintiffs, even after attorney fees.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>New York Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You have <strong style={{ color: '#E2E8F0' }}>three years</strong> from the date of injury to file a personal injury lawsuit in New York under CPLR 214(5). Three years is longer than most states — Florida offers two years, Texas two years. But there are exceptions that dramatically shorten this window.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Government entities:</strong> If your injury was caused by New York City, the MTA, or any New York state or municipal agency, you must file a Notice of Claim within <strong style={{ color: '#E2E8F0' }}>90 days</strong> of the accident. Missing this deadline can permanently bar your claim regardless of how strong it is. The 90-day rule applies to slip and falls on city sidewalks, MTA bus accidents, subway platform injuries, and accidents involving city-owned vehicles.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Medical malpractice:</strong> Two and a half years from the act of malpractice or the end of continuous treatment — not the standard personal injury period.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Minors:</strong> The statute of limitations is tolled (paused) until the minor turns 18, then the standard limitations period begins.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not wait. Evidence degrades, witnesses disappear, and surveillance footage is routinely overwritten within 30 days.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in New York</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>New York — particularly New York City — produces some of the highest personal injury settlements in the United States. Several factors drive this premium:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>New York City jurors</strong> apply a high cost-of-living benchmark to per diem calculations</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>New York juries</strong> are historically more plaintiff-favorable than national averages</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The serious injury threshold</strong> filters out minor claims, meaning cases that reach the litigation stage tend to involve genuine, documented injuries</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>New York City&apos;s congestion</strong> and the density of commercial activity produce high-frequency, high-stakes accident claims</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft-tissue injuries that meet the 90/180-day rule in New York City typically settle between $50,000 and $150,000. Fractures with full recovery settle between $75,000 and $200,000. Cases involving permanent limitation of use — spinal injuries with documented impairment, traumatic brain injuries, amputations — routinely exceed $500,000 and frequently produce seven-figure verdicts at trial.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <Link href="/pain-and-suffering-calculator/florida/" style={{ color: '#60A5FA' }}>Florida pain and suffering calculator</Link> page shows the contrast — Florida&apos;s $10,000 PIP floor and two-year statute produce structurally different claim dynamics.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>MVAIC note:</strong> If the at-fault driver was uninsured and fled the scene, the Motor Vehicle Accident Indemnification Corporation (MVAIC) provides coverage for qualified New York residents. You must file a Notice of Intention to make a claim with MVAIC within 180 days of the accident.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'ny-faq-1',
                  question: 'How is pain and suffering calculated in New York?',
                  answer: 'New York does not use a fixed formula. The two standard methods are the multiplier method — where total economic damages are multiplied by 1.5 to 5 based on injury severity — and the per diem method, where a daily dollar rate is assigned to each day of documented pain and suffering. In practice, insurance adjusters use the multiplier method internally, and plaintiff attorneys use both methods as leverage in negotiation and at trial.',
                  schemaAnswer: 'New York does not use a fixed formula. The two standard methods are the multiplier method — where total economic damages are multiplied by 1.5 to 5 based on injury severity — and the per diem method, where a daily dollar rate is assigned to each day of documented pain and suffering. In practice, insurance adjusters use the multiplier method internally, and plaintiff attorneys use both methods as leverage in negotiation and at trial.'
                },
                {
                  id: 'ny-faq-2',
                  question: 'What is the serious injury threshold in New York?',
                  answer: 'The serious injury threshold is defined under New York Insurance Law Section 5102(d). It requires that your injury fall into one of nine categories: death, dismemberment, significant disfigurement, fracture, loss of fetus, permanent loss of use, permanent consequential limitation of use, significant limitation of use, or the 90/180-day rule. Car accident victims who cannot establish one of these nine categories cannot sue for pain and suffering — they are limited to no-fault PIP benefits.',
                  schemaAnswer: 'The serious injury threshold is defined under New York Insurance Law Section 5102(d). It requires that your injury fall into one of nine categories: death, dismemberment, significant disfigurement, fracture, loss of fetus, permanent loss of use, permanent consequential limitation of use, significant limitation of use, or the 90/180-day rule. Car accident victims who cannot establish one of these nine categories cannot sue for pain and suffering — they are limited to no-fault PIP benefits.'
                },
                {
                  id: 'ny-faq-3',
                  question: 'Does New York limit pain and suffering damages?',
                  answer: 'No. New York has no statutory cap on pain and suffering damages in personal injury cases. Juries may award any amount supported by the evidence. This stands in contrast to states like California, which has a $470,000 cap on non-economic damages in medical malpractice cases, and Florida, which recently enacted caps on non-economic damages in some medical malpractice contexts. For standard personal injury claims — car accidents, slip and falls, premises liability — New York imposes no ceiling.',
                  schemaAnswer: 'No. New York has no statutory cap on pain and suffering damages in personal injury cases. Juries may award any amount supported by the evidence. This stands in contrast to states like California, which has a $470,000 cap on non-economic damages in medical malpractice cases, and Florida, which recently enacted caps on non-economic damages in some medical malpractice contexts. For standard personal injury claims — car accidents, slip and falls, premises liability — New York imposes no ceiling.'
                },
                {
                  id: 'ny-faq-4',
                  question: 'What is the statute of limitations for personal injury in New York?',
                  answer: 'Three years from the date of injury under CPLR 214(5) for most personal injury claims. The critical exception is claims against government entities: you must file a Notice of Claim within 90 days of the accident if New York City, the MTA, or any state or municipal body is a defendant. Missing the 90-day government notice deadline is fatal to your claim — courts rarely grant extensions.',
                  schemaAnswer: 'Three years from the date of injury under CPLR 214(5) for most personal injury claims. The critical exception is claims against government entities: you must file a Notice of Claim within 90 days of the accident if New York City, the MTA, or any state or municipal body is a defendant. Missing the 90-day government notice deadline is fatal to your claim — courts rarely grant extensions.'
                },
                {
                  id: 'ny-faq-5',
                  question: 'How much is a pain and suffering settlement worth in New York?',
                  answer: 'It depends entirely on the nature of your injury, the venue, and your documentation. In New York City, soft-tissue injuries meeting the 90/180-day threshold typically settle between $50,000 and $150,000. Fractures with documented recovery settle between $75,000 and $200,000. Permanent spinal injuries, traumatic brain injuries, and amputation cases regularly exceed $500,000. These are ranges, not guarantees — policy limits, comparative fault allocation, and the quality of your medical records all move the final number.',
                  schemaAnswer: 'It depends entirely on the nature of your injury, the venue, and your documentation. In New York City, soft-tissue injuries meeting the 90/180-day threshold typically settle between $50,000 and $150,000. Fractures with documented recovery settle between $75,000 and $200,000. Permanent spinal injuries, traumatic brain injuries, and amputation cases regularly exceed $500,000. These are ranges, not guarantees — policy limits, comparative fault allocation, and the quality of your medical records all move the final number.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Calculator to Estimate Your New York Settlement</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in New York and your injuries meet the serious injury threshold, your pain and suffering damages can be substantial — especially if your accident happened in New York City. Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to run both the multiplier and per diem methods with your actual numbers. The calculator is free, takes two minutes, and gives you a defensible starting estimate before you speak to an attorney. No personal information required.</p>
            </article>
          ) : stateData.slug === 'pennsylvania' ? (
            <article style={{ margin: '0 auto' }}>
              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in a car accident in Pennsylvania and you are trying to figure out whether you can even sue for pain and suffering, you are not alone in that confusion. Pennsylvania is one of a small number of states that operates a &quot;choice no-fault&quot; system, which means your right to recover pain and suffering damages depends almost entirely on a decision you made when you bought your auto insurance policy — a decision most people do not remember making. This guide explains how that system works, how pain and suffering is calculated under Pennsylvania law, what your claim may actually be worth, and what deadlines you cannot afford to miss.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Pennsylvania Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering is a category of non-economic damages — compensation for the physical pain, emotional distress, anxiety, loss of enjoyment of life, and diminished quality of living caused by someone else&apos;s negligence. Unlike medical bills or lost wages, there is no invoice for pain and suffering. Its value is argued, not calculated on a spreadsheet.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania places no statutory cap on compensatory damages, including pain and suffering. The Pennsylvania Constitution prohibits the legislature from limiting jury awards in personal injury cases. That means there is no ceiling on what a jury can award you — your recovery is bounded only by what the evidence supports and what a jury finds credible.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Punitive damages are available in Pennsylvania for conduct that is outrageous or shows a reckless indifference to the interests of others, but they require a higher evidentiary burden and are not available in routine negligence cases. For most personal injury claimants, the focus is entirely on compensatory non-economic damages: pain, suffering, and their ongoing consequences in your daily life.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pennsylvania Choice No-Fault — Limited Tort vs Full Tort</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is the most important section on this page. Read it carefully before you use any calculator.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania&apos;s choice no-fault system means that when you purchased your auto insurance policy, you were required to elect either <strong style={{ color: '#E2E8F0' }}>limited tort</strong> or <strong style={{ color: '#E2E8F0' }}>full tort</strong> coverage. That single election determines whether you can sue for pain and suffering after a car accident.</p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600 }}>Full Tort</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you elected full tort, you have an unrestricted right to sue the at-fault driver for all damages, including pain and suffering, regardless of how severe your injuries are. Full tort costs more in premiums, but it preserves your full legal rights. If you have full tort and you suffered a soft-tissue injury, a herniated disc, or any other injury caused by someone else, you can pursue pain and suffering damages without clearing any legal threshold.</p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600 }}>Limited Tort</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you elected limited tort — which many drivers chose because it lowers premiums — you gave up your right to sue for pain and suffering unless your injuries meet the &quot;serious injury&quot; threshold defined by Pennsylvania statute. Under 75 Pa. C.S. Section 1705, a serious injury is one of three things: death, serious impairment of a body function, or permanent serious disfigurement.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>What that means in practice: if you have limited tort and you suffered whiplash, a sprain, or a soft-tissue injury that is genuinely painful but does not seriously impair a body function or permanently disfigure you, a Pennsylvania court will likely bar your pain and suffering claim entirely.</p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600 }}>Exceptions to Limited Tort</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Limited tort is not absolute. You may still pursue full pain and suffering damages under a limited tort policy if the at-fault driver was uninsured, if the at-fault driver was convicted of DUI in connection with the accident, if the at-fault driver was operating a vehicle registered out of state, or if you were a pedestrian or bicyclist at the time of the crash.</p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600 }}>Why This Matters for Your Calculation</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Before you estimate a pain and suffering figure, you need to know your tort election. If you do not know, call your insurance agent and ask. That answer changes everything about the value of your claim.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Pennsylvania</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Once you have confirmed you can pursue pain and suffering — either through full tort or by meeting the serious injury threshold under limited tort — Pennsylvania courts and insurers use two primary methods to calculate non-economic damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The multiplier method</strong> is the most common. An adjuster or attorney takes your total economic damages (medical bills, lost wages, out-of-pocket costs) and multiplies them by a number between 1.5 and 5 to arrive at a pain and suffering figure. The multiplier depends on injury severity, treatment duration, whether surgery was required, and the permanence of your injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>A real example: you suffered a herniated disc in a rear-end collision in Philadelphia. Your medical bills total $28,000 and you lost $6,000 in wages during your recovery. Your total economic damages are $34,000. A moderate multiplier of 3 produces a pain and suffering estimate of $102,000, for a total claim value of $136,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The per diem method</strong> assigns a daily dollar value to your pain and suffering — often your daily wage — and multiplies it by the number of days you experienced pain. If you earned $250 per day and suffered for 180 days, the per diem calculation yields $45,000 in pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</a> to run both methods with your own numbers. For a deeper explanation of how the math works, read <a href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</a>.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pennsylvania Modified Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania follows a modified comparative fault rule with a 51% bar. If you were partially at fault for the accident, your damages are reduced by your percentage of fault. If you were 25% at fault, you recover 75% of your total damages. If you were 51% or more at fault, you are completely barred from recovering anything.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters use comparative fault aggressively during negotiations. If you made a lane change without signaling, if you were slightly speeding, or if any contributing factor can be attributed to your conduct, expect the adjuster to assign you fault and reduce the offer accordingly. An attorney can challenge those assignments, and juries can reject them — but you need to anticipate this argument before you accept any settlement.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania&apos;s 51% bar is the same threshold used in Texas and most other comparative fault states. It is more favorable to plaintiffs than states with a 50% bar, but only marginally so.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Pennsylvania Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several factors beyond injury severity drive settlement value in Pennsylvania.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue matters enormously.</strong> Philadelphia County produces some of the highest plaintiff jury verdict averages in the United States. Philadelphia juries are urban, plaintiff-sympathetic, and familiar with the real cost of medical care in a major city. A herniated disc case that settles for $85,000 in rural Centre County may command a $200,000 offer in Philadelphia simply because the defendant&apos;s attorney knows what a Philadelphia jury is likely to award.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pittsburgh and Allegheny County produce strong plaintiff verdicts as well, though typically lower than Philadelphia. Cases in suburban counties like Chester, Montgomery, and Bucks County tend to land in the middle range.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Other settlement factors include: how clearly liability is established, the at-fault driver&apos;s insurance policy limits, whether you treated with a specialist versus a primary care physician, the consistency of your treatment record, the permanence of your injuries, and your age and occupation. A permanent injury to a 35-year-old surgeon has a different damages profile than the same injury to a retired individual, even if the diagnosis is identical.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pennsylvania Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Pennsylvania, you have <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of the accident to file a personal injury lawsuit. This deadline is set by 42 Pa. C.S. Section 5524 and it is nearly absolute.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you miss the two-year deadline, the defendant&apos;s attorney will file a motion to dismiss, the court will grant it, and your claim will be extinguished regardless of how strong it was on the merits. There is no second chance.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Limited exceptions exist. The discovery rule may toll the statute in cases where injuries were not immediately apparent. The minority tolling rule pauses the statute for injured plaintiffs who were under 18 at the time of the accident — the clock starts running on their 18th birthday. Fraudulent concealment by the defendant can also toll the statute in rare circumstances.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not rely on exceptions. If you have a viable claim, consult an attorney well before the two-year mark. Insurance negotiations that drag past the deadline leave you with no leverage and no claim.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Pennsylvania</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania does not publish statewide settlement data, and published verdict databases reflect only cases that went to trial — a small fraction of all resolved claims. With that caveat, published verdict research and attorney survey data suggest the following general ranges for Pennsylvania.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft-tissue injuries (sprains, strains) in full tort cases: $15,000 to $60,000. Disc injuries without surgery: $40,000 to $150,000. Disc injuries with surgery: $100,000 to $400,000. Traumatic brain injuries: $200,000 to several million dollars depending on severity. Wrongful death cases in Philadelphia: often seven figures before punitive damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These are ranges, not guarantees. Your specific facts — venue, liability clarity, treatment quality, and the at-fault driver&apos;s policy limits — will determine where your case falls within or outside any range. Policy limits are a practical ceiling in most cases; a $25,000 bodily injury policy is the most you will recover from that insurer regardless of what a jury would award.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'pa-faq-1',
                  question: 'How is pain and suffering calculated in Pennsylvania?',
                  answer: 'Pennsylvania insurers and courts use the multiplier method most frequently. Your total economic damages (medical bills plus lost wages) are multiplied by a factor of 1.5 to 5 depending on injury severity. A serious injury with surgery and long-term impairment may command a multiplier of 4 or 5. A soft-tissue injury with a clean recovery may receive 1.5 to 2. The per diem method is an alternative that assigns a daily dollar value to your pain and assigns it across the days of your suffering.',
                  schemaAnswer: 'Pennsylvania insurers and courts use the multiplier method most frequently. Your total economic damages (medical bills plus lost wages) are multiplied by a factor of 1.5 to 5 depending on injury severity. A serious injury with surgery and long-term impairment may command a multiplier of 4 or 5. A soft-tissue injury with a clean recovery may receive 1.5 to 2. The per diem method is an alternative that assigns a daily dollar value to your pain and assigns it across the days of your suffering.'
                },
                {
                  id: 'pa-faq-2',
                  question: 'What is limited tort in Pennsylvania?',
                  answer: 'Limited tort is an auto insurance election that reduces your premiums in exchange for surrendering your right to sue for pain and suffering after a car accident, unless your injuries meet the serious injury threshold (death, serious impairment of a body function, or permanent serious disfigurement). If your injuries do not meet that threshold, you can recover medical bills and lost wages but not pain and suffering.',
                  schemaAnswer: 'Limited tort is an auto insurance election that reduces your premiums in exchange for surrendering your right to sue for pain and suffering after a car accident, unless your injuries meet the serious injury threshold (death, serious impairment of a body function, or permanent serious disfigurement). If your injuries do not meet that threshold, you can recover medical bills and lost wages but not pain and suffering.'
                },
                {
                  id: 'pa-faq-3',
                  question: 'Does Pennsylvania limit pain and suffering damages?',
                  answer: 'No. Pennsylvania has no statutory cap on compensatory damages, including pain and suffering. The Pennsylvania Constitution prohibits such a cap. Your recovery is limited only by the evidence, the jury, and practically speaking, the at-fault driver\'s insurance policy limits.',
                  schemaAnswer: 'No. Pennsylvania has no statutory cap on compensatory damages, including pain and suffering. The Pennsylvania Constitution prohibits such a cap. Your recovery is limited only by the evidence, the jury, and practically speaking, the at-fault driver\'s insurance policy limits.'
                },
                {
                  id: 'pa-faq-4',
                  question: 'What is the statute of limitations for personal injury in Pennsylvania?',
                  answer: 'Two years from the date of the accident under 42 Pa. C.S. Section 5524. Limited exceptions apply for minors and delayed injury discovery, but do not rely on them. File or retain counsel well before the deadline.',
                  schemaAnswer: 'Two years from the date of the accident under 42 Pa. C.S. Section 5524. Limited exceptions apply for minors and delayed injury discovery, but do not rely on them. File or retain counsel well before the deadline.'
                },
                {
                  id: 'pa-faq-5',
                  question: 'What is the difference between limited tort and full tort in Pennsylvania?',
                  answer: 'Full tort preserves your unrestricted right to sue for pain and suffering after any auto accident. Limited tort surrenders that right unless your injury is classified as serious under Pennsylvania law. Full tort costs more in premiums. If you were not offered a choice or do not know your election, contact your insurer immediately — it is printed on your declarations page.',
                  schemaAnswer: 'Full tort preserves your unrestricted right to sue for pain and suffering after any auto accident. Limited tort surrenders that right unless your injury is classified as serious under Pennsylvania law. Full tort costs more in premiums. If you were not offered a choice or do not know your election, contact your insurer immediately — it is printed on your declarations page.'
                },
                {
                  id: 'pa-faq-6',
                  question: 'Can I still recover pain and suffering if I was partly at fault in Pennsylvania?',
                  answer: 'Yes, as long as your share of fault is 50% or less. Pennsylvania uses modified comparative fault with a 51% bar. Your damages are reduced proportionally by your fault percentage. At 51% or more, you recover nothing.',
                  schemaAnswer: 'Yes, as long as your share of fault is 50% or less. Pennsylvania uses modified comparative fault with a 51% bar. Your damages are reduced proportionally by your fault percentage. At 51% or more, you recover nothing.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Pennsylvania Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pennsylvania&apos;s choice no-fault system is genuinely complicated, and whether you have full tort or limited tort changes the entire value of your claim. Before you negotiate with an insurance adjuster or accept any settlement offer, run your numbers.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</a> to estimate both the multiplier method and per diem method with your actual medical expenses and income. If you are also researching how other states handle non-economic damages, compare with the <a href="/pain-and-suffering-calculator/new-york/" style={{ color: '#60A5FA' }}>New York pain and suffering calculator</a>. The calculator is free, takes under two minutes, and gives you a baseline to evaluate whatever the insurer puts on the table.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>An estimate is not legal advice. For a claim involving serious injuries, surgery, or long-term impairment, consult a Pennsylvania personal injury attorney. Most take cases on contingency and charge nothing unless you recover.</p>
            </article>
          ) : stateData.slug === 'illinois' ? (
            <article style={{ margin: '0 auto' }}>
              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Introduction</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Illinois — whether in a car accident on the Eisenhower Expressway, a slip and fall in a Chicago storefront, or a workplace injury downstate — you&apos;re probably asking the same question most injured people ask: what is my case actually worth?</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering damages are typically the largest part of any personal injury settlement. In Illinois, those damages are uncapped, meaning there is no legal ceiling on how much you can recover for your physical pain, emotional distress, and loss of enjoyment of life. Illinois courts struck down attempts to limit those damages over a decade ago, and the law has remained strongly favorable to injured plaintiffs ever since.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This page explains how pain and suffering is calculated in Illinois, what the 51% comparative fault rule means for your case, what deadlines apply to your claim, and what real Illinois settlements look like. Use the <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</a> above to run your own estimate.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Illinois Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Illinois law divides personal injury damages into two categories. Economic damages cover what you lost financially — medical bills, lost wages, future medical costs, and property damage. Non-economic damages cover everything else: the physical pain you endured, the emotional trauma, the anxiety, the depression, the loss of your ability to do things you used to do.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no cap on non-economic damages in Illinois for personal injury, car accident, or wrongful death cases. This was not always the case. In 2005, the Illinois legislature passed tort reform legislation that capped non-economic damages at $500,000 against individual defendants and $1,000,000 against hospitals. The Illinois Supreme Court struck down those caps in <em>Lebron v. Gottlieb Memorial Hospital</em> (2010), ruling they violated the separation of powers doctrine under the Illinois Constitution. Attempts to reinstate caps have failed since.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>What this means for you: unlike injured plaintiffs in states like California or Texas — where soft caps or advisory limits can compress settlement values — Illinois gives juries and insurers no legal ceiling to hide behind. A serious injury with strong documentation can command a genuinely proportional recovery.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Illinois</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Illinois insurers and attorneys use two standard methods to calculate pain and suffering. Understanding both helps you evaluate whether an offer is fair.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Multiplier Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The most common approach multiplies your total economic damages by a number between 1.5 and 5, depending on injury severity. A multiplier of 1.5 typically applies to soft tissue injuries with a short recovery. A multiplier of 4 or 5 applies to permanent injuries, surgeries, or significant long-term limitations.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Example: You were rear-ended on I-90 near Chicago. Your medical bills total $22,000, and you missed six weeks of work worth $9,000. Your total economic damages are $31,000. At a multiplier of 3 — reasonable for a herniated disc requiring physical therapy — your pain and suffering estimate comes to $93,000, and your total settlement estimate is $124,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>At a multiplier of 4, the same facts produce $155,000 total. The multiplier is where negotiation actually happens.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The Per Diem Method</strong></p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The per diem method assigns a daily dollar value to your pain — often your daily wage — and multiplies it by the number of days you suffered. If you earn $200 per day and suffered for 300 days, your pain and suffering figure is $60,000. This method works well when recovery was prolonged but injury severity was moderate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For a deeper look at how these formulas are applied, read <a href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</a>.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Illinois Modified Comparative Fault — The 51% Rule</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Illinois follows a modified comparative fault system under 735 ILCS 5/2-1116. This rule matters significantly to your recovery.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Here is how it works. If you are found partially at fault for your own injury, your damages are reduced by your percentage of fault. If you are 20% at fault for a car accident, you recover 80% of your total damages. That is true in most comparative fault states.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The critical Illinois rule is the 51% bar: if you are found 51% or more at fault, you recover nothing. You are completely barred from any recovery. At exactly 50% fault, you can still recover half. At 51%, you collect zero.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This matters most in cases involving disputed liability — intersection accidents, premises liability where you may have ignored a warning, or workplace accidents where your employer claims you violated a safety procedure. Insurance adjusters frequently inflate your percentage of fault during initial negotiations specifically to justify lower offers or denials. If an adjuster claims you were 40% at fault, that is almost always a negotiating position, not a legal determination.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Illinois courts apportion fault to the jury. The jury&apos;s finding is what controls. An attorney can push back on inflated fault assignments that adjusters have no legal authority to impose unilaterally.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Illinois Pain and Suffering Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Where your case is venued matters enormously in Illinois, and this is not a minor point.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Cook County — Chicago — consistently produces among the highest jury verdict averages in the country. Juries in Cook County are experienced with serious injury cases and tend to award substantial non-economic damages. If your case goes to trial in Cook County and your injuries are well-documented, your exposure numbers are materially higher than the same case tried downstate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Collar counties like DuPage, Lake, and Will tend to produce more moderate verdicts. Downstate venues — Sangamon, Madison, St. Clair counties — vary significantly. Madison and St. Clair counties have historically been plaintiff-friendly venues.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond venue, Illinois-specific factors that influence pain and suffering value include:</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The length and consistency of your medical treatment matters more than almost anything else. Gaps in treatment — periods where you stopped seeing doctors — are used aggressively by defense attorneys to argue your injuries resolved. Treat continuously, follow your doctor&apos;s instructions, and document everything.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Permanent injuries, surgeries, hardware implants, and lasting functional limitations command higher multipliers. Soft tissue injuries that resolve within 90 days carry lower ones.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pre-existing conditions complicate but do not eliminate your claim. Illinois follows the eggshell plaintiff rule — a defendant takes you as they find you. If a prior back condition was asymptomatic and the accident aggravated it, you can still recover for the aggravation.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Illinois Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Missing a filing deadline in Illinois ends your case regardless of how strong it is. These deadlines are hard cutoffs.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Personal injury (car accidents, slip and fall, general negligence):</strong> 2 years from the date of injury. 735 ILCS 5/13-202.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Medical malpractice:</strong> 2 years from the date you discovered, or reasonably should have discovered, the injury — but subject to a 4-year absolute statute of repose from the date of the negligent act. Whichever expires first controls. If a surgeon made an error in 2021 and you discovered it in 2024, you have until 2025 (2 years from discovery) — unless the 4-year repose period from the act has already expired, in which case you are barred entirely. 735 ILCS 5/13-212.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Wrongful death:</strong> 2 years from the date of death. 740 ILCS 180/2.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Minors:</strong> The statute of limitations is tolled — paused — until the minor reaches age 18. A child injured at age 10 has until age 20 to file. Medical malpractice cases involving minors have a separate rule and are more complex; consult an attorney.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Do not wait.</strong> Evidence degrades, witnesses become unavailable, and insurance companies use delay against you. Two years sounds like a long time until it is not.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Illinois</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Giving a single average number for Illinois pain and suffering settlements is not meaningful because settlement values vary by three to four orders of magnitude depending on injury type, venue, and liability clarity. A soft tissue car accident case in a suburban county might settle for $15,000 to $40,000. A spinal cord injury case tried in Cook County can produce a jury verdict in the millions.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>What the data does show: Cook County jury verdicts in personal injury cases consistently rank among the top 10 in national surveys. Illinois plaintiffs with permanent injuries, strong medical documentation, and clear liability tend to receive higher offers than comparable plaintiffs in capped states, precisely because insurers cannot point to a statutory ceiling.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Real examples from public Illinois verdict and settlement data: a Chicago pedestrian struck by a rideshare vehicle recovered $1.2 million for a torn labrum and PTSD; a construction worker with a crush injury settled for $875,000 before trial in Cook County; a rear-end accident causing a cervical fusion settled for $340,000 in Lake County.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Your case is individual. Use the <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</a> to build a personalized estimate based on your actual damages.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'il-faq-1',
                  question: 'Is there a cap on pain and suffering in Illinois?',
                  answer: 'No. Illinois has no statutory cap on non-economic damages for personal injury, car accident, or wrongful death cases. The Illinois Supreme Court struck down prior caps in Lebron v. Gottlieb Memorial Hospital in 2010, holding that caps on damages violated the separation of powers under the Illinois Constitution. There is no legislative cap currently in effect.',
                  schemaAnswer: 'No. Illinois has no statutory cap on non-economic damages for personal injury, car accident, or wrongful death cases. The Illinois Supreme Court struck down prior caps in Lebron v. Gottlieb Memorial Hospital in 2010, holding that caps on damages violated the separation of powers under the Illinois Constitution. There is no legislative cap currently in effect.'
                },
                {
                  id: 'il-faq-2',
                  question: 'How is pain and suffering calculated in Illinois?',
                  answer: 'Illinois attorneys and insurers use two methods. The multiplier method takes your total economic damages and multiplies them by a factor between 1.5 and 5 based on injury severity. The per diem method assigns a daily dollar value — often your daily wage — and multiplies it by recovery days. Multipliers above 3 typically require surgical intervention, permanent limitations, or documented psychological harm.',
                  schemaAnswer: 'Illinois attorneys and insurers use two methods. The multiplier method takes your total economic damages and multiplies them by a factor between 1.5 and 5 based on injury severity. The per diem method assigns a daily dollar value — often your daily wage — and multiplies it by recovery days. Multipliers above 3 typically require surgical intervention, permanent limitations, or documented psychological harm.'
                },
                {
                  id: 'il-faq-3',
                  question: 'What is the statute of limitations for personal injury in Illinois?',
                  answer: 'Two years from the date of injury for most personal injury claims, including car accidents and premises liability. Medical malpractice has a 2-year discovery rule subject to a 4-year absolute statute of repose. Wrongful death is 2 years from the date of death. Minors have until age 18 plus two years.',
                  schemaAnswer: 'Two years from the date of injury for most personal injury claims, including car accidents and premises liability. Medical malpractice has a 2-year discovery rule subject to a 4-year absolute statute of repose. Wrongful death is 2 years from the date of death. Minors have until age 18 plus two years.'
                },
                {
                  id: 'il-faq-4',
                  question: 'Does Illinois use no-fault auto insurance?',
                  answer: 'No. Illinois is an at-fault state. You pursue damages against the at-fault driver\'s liability insurance, not your own policy. Illinois does not require personal injury protection (PIP) coverage. You can sue the at-fault driver directly and recover pain and suffering damages without the PIP limitations that apply in no-fault states like Michigan or Florida.',
                  schemaAnswer: 'No. Illinois is an at-fault state. You pursue damages against the at-fault driver\'s liability insurance, not your own policy. Illinois does not require personal injury protection (PIP) coverage. You can sue the at-fault driver directly and recover pain and suffering damages without the PIP limitations that apply in no-fault states like Michigan or Florida.'
                },
                {
                  id: 'il-faq-5',
                  question: 'How much is a pain and suffering settlement worth in Chicago?',
                  answer: 'Chicago — Cook County — produces the highest average verdicts in Illinois and among the highest nationally. The same injury that might settle for $80,000 downstate might realistically command $150,000 to $200,000 with strong documentation in Cook County, purely because of jury exposure. Insurers price Chicago cases differently. This is a legitimate factor your attorney should be accounting for in negotiations.',
                  schemaAnswer: 'Chicago — Cook County — produces the highest average verdicts in Illinois and among the highest nationally. The same injury that might settle for $80,000 downstate might realistically command $150,000 to $200,000 with strong documentation in Cook County, purely because of jury exposure. Insurers price Chicago cases differently. This is a legitimate factor your attorney should be accounting for in negotiations.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Illinois Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Illinois, you deserve an accurate picture of what your claim is worth before you speak with an insurance adjuster or accept any offer. Adjusters make first offers based on what they think you will accept, not on what your case is worth.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</a> to enter your medical expenses, lost wages, and injury details. The calculator applies both the multiplier and per diem methods and gives you an Illinois-specific estimate in under two minutes.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you want to understand how the numbers are built, read our guide on <a href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</a>. If you were injured in another state, see the <a href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</a> for a comparison of how capped states handle the same calculation differently.</p>
            </article>
          ) : stateData.slug === 'ohio' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your noneconomic damages under Ohio law. Ohio is one of a small number of states with a statutory cap on pain and suffering awards — and the formula is more nuanced than most injured Ohioans realize. Whether your injury happened in Columbus, Cleveland, or Cincinnati, understanding <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> before you enter settlement negotiations can be the difference between accepting far less than you deserve and knowing exactly where you stand.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio limits noneconomic damages in most personal injury cases, but the cap is not absolute. Catastrophic injuries are fully exempt, and even for capped claims, the formula can produce a significantly higher number than the base $250,000 figure. This page explains the Ohio damage cap, how the formula works, and what factors courts and insurers use to value pain and suffering in Ohio personal injury cases.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Ohio Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Ohio, pain and suffering falls under the category of noneconomic damages — compensation for losses that have no invoice attached. Economic damages cover what you can document: medical bills, lost wages, future treatment costs, and property damage. Noneconomic damages cover everything else: physical pain, emotional distress, anxiety, loss of enjoyment of life, and the permanent ways a serious injury reshapes your daily existence.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio Revised Code Section 2315.18 governs noneconomic damages in most personal injury tort actions. It applies to injuries caused by negligence and sets both a formula-based cap and an absolute per-occurrence ceiling. Understanding this statute is not optional preparation — it is the central fact that shapes every serious personal injury settlement negotiation in Ohio.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Ohio Noneconomic Damage Cap — How the Formula Works</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio Revised Code Section 2315.18 caps noneconomic damages at the <strong style={{ color: '#E2E8F0' }}>greater of $250,000 or three times the plaintiff&apos;s economic damages</strong>, subject to two absolute ceilings: <strong style={{ color: '#E2E8F0' }}>$350,000 per plaintiff</strong> and <strong style={{ color: '#E2E8F0' }}>$500,000 per occurrence</strong> when multiple plaintiffs are involved.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The critical point most injured Ohioans miss is that $250,000 is the floor, not the fixed cap. If your economic damages are large enough, the 3x multiplier produces a higher figure, and that higher figure becomes your cap.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Example 1 — Low economic damages:</strong> Your medical bills and lost wages total $60,000. Three times $60,000 is $180,000, which is less than $250,000. Your cap is therefore $250,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Example 2 — High economic damages:</strong> Your medical bills, lost wages, and future care costs total $140,000. Three times $140,000 is $420,000, which exceeds $250,000 but exceeds the $350,000 per-plaintiff ceiling. Your noneconomic damages are capped at $350,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Example 3 — Very high economic damages:</strong> Your economic damages are $200,000. Three times $200,000 is $600,000. Your individual cap is $350,000 because the per-plaintiff ceiling controls, even though the formula produces a higher number.</p>

              <h3 className="heading-gradient" style={{ fontSize: '20px', fontWeight: 600 }}>The Catastrophic Injury Exception</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The cap does not apply at all if you suffered a catastrophic injury. Ohio law defines catastrophic injuries as any of the following:</p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px', listStyleType: 'disc' }}>
                <li>Permanent and substantial physical deformity, loss of use of a limb, or loss of a bodily organ system</li>
                <li>Permanent physical functional injury that permanently prevents the injured person from being able to independently care for themselves and perform life-sustaining activities</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injury qualifies, the jury&apos;s full noneconomic award stands — the judge does not reduce it. Severe spinal cord injuries, traumatic brain injuries with permanent cognitive impairment, amputations, and severe burn injuries commonly meet this threshold, but the determination is fact-specific and contested.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>One procedural detail matters here: Ohio juries are never told about the cap. The jury awards the full amount it believes the plaintiff deserves. If the award exceeds the statutory limit, the judge reduces it after the verdict during post-trial proceedings. This means your attorney should always argue for the highest supportable noneconomic figure at trial, regardless of the cap.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Ohio</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio attorneys and insurance adjusters use two primary methods to arrive at a pain and suffering number before the cap is applied.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The multiplier method</strong> is the most common. You add up all verifiable economic damages — medical expenses, lost income, future treatment — and multiply by a factor between 1.5 and 5. A minor soft-tissue injury with a short recovery typically draws a multiplier near 1.5. A permanent injury requiring ongoing care can justify a multiplier of 4 or 5. A $90,000 economic damages figure multiplied by 3 produces a $270,000 pain and suffering estimate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The per diem method</strong> assigns a daily dollar value to your pain and suffering and multiplies it by the number of days you suffered. If your recovery took 18 months and you assign $150 per day to your pain, the per diem calculation produces $81,900. This approach works well for injuries with defined recovery timelines.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters in Ohio, particularly for larger claims, often use Colossus software to generate an internal damages figure. Colossus weighs injury codes, treatment duration, and medical documentation — which is why thorough, continuous medical records directly affect your settlement value.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Ohio Modified Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio follows a modified comparative fault rule with a <strong style={{ color: '#E2E8F0' }}>51% bar</strong>, codified under Ohio Revised Code Section 2315.33. If you are found partially at fault for your own injury, your damages are reduced proportionally by your percentage of fault. If you are 51% or more at fault, you recover nothing.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In practical terms: if a jury finds your total damages are $300,000 and assigns you 25% of the fault, you recover $225,000. If the same jury assigns you 51% of the fault, your recovery is zero.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Comparative fault is a standard defense tactic in Ohio. Insurance adjusters routinely argue that plaintiffs contributed to their own injuries — particularly in car accident cases involving speed, distraction, or failure to wear a seatbelt. Document the accident scene, preserve evidence, and obtain police reports early, because every percentage point of fault assigned to you reduces your recovery dollar for dollar.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Ohio Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several variables shape how insurers and juries value pain and suffering in Ohio personal injury cases beyond the raw medical bills.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The nature and permanence of your injury carries the most weight. A herniated disc that resolves after physical therapy draws a different valuation than a spinal injury requiring surgery and permanent restrictions. Future medical costs and loss of earning capacity amplify economic damages, which in turn raise the 3x cap threshold.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The quality of your medical documentation is equally important. Consistent treatment from the accident date forward, clear physician notes connecting your symptoms to the accident, and documented functional limitations all support a higher multiplier. Gaps in treatment give insurers an argument that your injuries were less severe.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Venue also matters. Jury verdicts in Cuyahoga County (Cleveland) and Franklin County (Columbus) have historically produced higher plaintiff awards than rural Ohio counties. Insurers factor expected verdict ranges by jurisdiction into their settlement offers.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Ohio Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio imposes a <strong style={{ color: '#E2E8F0' }}>two-year statute of limitations</strong> on personal injury claims under Ohio Revised Code Section 2305.10. The clock typically begins running on the date of the accident or the date you discovered — or reasonably should have discovered — the injury.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Two years sounds like a long runway, but building a strong personal injury claim in Ohio takes time. Medical records must be gathered, expert witnesses may need to be retained, and liability investigations require thorough documentation. Waiting until the final months before the deadline compresses your attorney&apos;s preparation time and weakens your negotiating position.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Certain exceptions apply. Claims involving minors are governed by different rules — the statute of limitations typically does not begin running until the minor turns 18. Claims against government entities may require earlier notice filings. If you are within a year of your accident date and have not consulted an attorney, act immediately.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Ohio</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Published settlement data for Ohio personal injury cases is limited because the majority of claims resolve confidentially. General verdict research and reported case data suggest the following ranges as rough benchmarks, not guarantees.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft-tissue injuries such as whiplash and minor sprains in Ohio tend to settle in the range of $15,000 to $75,000, with noneconomic damages representing the majority of the total. Moderate injuries — fractures, disc herniations requiring surgery, shoulder or knee tears — commonly produce settlements in the $80,000 to $300,000 range. Catastrophic injuries that trigger the ORC 2315.18 exception and remove the cap entirely have produced jury verdicts in Ohio exceeding $1 million.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Columbus, Cleveland, and Cincinnati personal injury attorneys operate in active plaintiff markets with established verdict histories. If your injury is serious and liability is clear, Ohio settlements are often defensible well above initial insurance offers. Your economic damages figure is the foundation — every dollar added to that number raises your 3x cap ceiling.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'oh-faq-1',
                  question: 'How is pain and suffering calculated in Ohio?',
                  answer: 'Ohio attorneys and insurers primarily use the multiplier method — total economic damages multiplied by a factor between 1.5 and 5 based on injury severity and permanence. The per diem method, which assigns a daily dollar value to your suffering, is used for injuries with clearly defined recovery periods. The resulting figure is then evaluated against the Ohio noneconomic damage cap under ORC 2315.18 to determine whether the statutory limit applies.',
                  schemaAnswer: 'Ohio attorneys and insurers primarily use the multiplier method — total economic damages multiplied by a factor between 1.5 and 5 based on injury severity and permanence. The per diem method, which assigns a daily dollar value to your suffering, is used for injuries with clearly defined recovery periods. The resulting figure is then evaluated against the Ohio noneconomic damage cap under ORC 2315.18 to determine whether the statutory limit applies.'
                },
                {
                  id: 'oh-faq-2',
                  question: 'Is there a cap on pain and suffering in Ohio?',
                  answer: 'Yes. Ohio caps noneconomic damages at the greater of $250,000 or three times your economic damages, with an absolute per-plaintiff ceiling of $350,000 and a per-occurrence ceiling of $500,000. The cap does not apply to catastrophic injuries, defined under ORC 2315.18 as permanent and substantial physical deformity, permanent loss of limb use, loss of a bodily organ system, or permanent functional injury preventing independent self-care.',
                  schemaAnswer: 'Yes. Ohio caps noneconomic damages at the greater of $250,000 or three times your economic damages, with an absolute per-plaintiff ceiling of $350,000 and a per-occurrence ceiling of $500,000. The cap does not apply to catastrophic injuries, defined under ORC 2315.18 as permanent and substantial physical deformity, permanent loss of limb use, loss of a bodily organ system, or permanent functional injury preventing independent self-care.'
                },
                {
                  id: 'oh-faq-3',
                  question: 'What is the Ohio noneconomic damage cap formula?',
                  answer: 'The formula under ORC 2315.18 is: cap equals the greater of $250,000 or 3x the plaintiff\'s economic damages. If the 3x calculation exceeds $350,000, the per-plaintiff ceiling of $350,000 controls. Juries are not informed of the cap — they award the full amount, and the judge reduces the verdict post-trial if it exceeds the statutory limit.',
                  schemaAnswer: 'The formula under ORC 2315.18 is: cap equals the greater of $250,000 or 3x the plaintiff\'s economic damages. If the 3x calculation exceeds $350,000, the per-plaintiff ceiling of $350,000 controls. Juries are not informed of the cap — they award the full amount, and the judge reduces the verdict post-trial if it exceeds the statutory limit.'
                },
                {
                  id: 'oh-faq-4',
                  question: 'How do you exceed the damage cap in Ohio?',
                  answer: 'The cap is eliminated entirely if the plaintiff suffered a catastrophic injury as defined by ORC 2315.18. To invoke the exception, you must demonstrate that your injury resulted in permanent and substantial physical deformity, permanent loss of use of a limb, loss of a bodily organ system, or a permanent functional injury that prevents you from independently caring for yourself. This determination is made by the court and is frequently contested by defense counsel.',
                  schemaAnswer: 'The cap is eliminated entirely if the plaintiff suffered a catastrophic injury as defined by ORC 2315.18. To invoke the exception, you must demonstrate that your injury resulted in permanent and substantial physical deformity, permanent loss of use of a limb, loss of a bodily organ system, or a permanent functional injury that prevents you from independently caring for yourself. This determination is made by the court and is frequently contested by defense counsel.'
                },
                {
                  id: 'oh-faq-5',
                  question: 'What is the statute of limitations for personal injury in Ohio?',
                  answer: 'Ohio\'s personal injury statute of limitations is two years from the date of injury or discovery under ORC 2305.10. Claims involving minors and claims against government entities are subject to different rules. Missing the deadline extinguishes your right to recover, regardless of how strong your case is on the merits.',
                  schemaAnswer: 'Ohio\'s personal injury statute of limitations is two years from the date of injury or discovery under ORC 2305.10. Claims involving minors and claims against government entities are subject to different rules. Missing the deadline extinguishes your right to recover, regardless of how strong your case is on the merits.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Estimate Your Ohio Pain and Suffering Settlement</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ohio&apos;s noneconomic damage cap adds a layer of complexity that most injured Ohioans are not prepared for when they sit across from an insurance adjuster. Knowing the cap formula, understanding the catastrophic injury exception, and calculating your economic damages accurately are the three steps that determine whether you leave money on the table.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to run the multiplier and per diem methods against your actual damages figures. If you want to understand the full framework before you calculate, read our detailed guide on <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link>. For a comparison of how a neighboring state handles these damages, see the <Link href="/pain-and-suffering-calculator/illinois/" style={{ color: '#60A5FA' }}>Illinois pain and suffering calculator</Link>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This calculator is a free educational tool. It does not constitute legal advice. For case-specific guidance, consult a licensed Ohio personal injury attorney.</em></p>
            </article>
          ) : stateData.slug === 'georgia' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Georgia through someone else&apos;s negligence, you may be entitled to pain and suffering damages on top of your medical bills and lost wages. Georgia law gives injury victims access to non-economic damages with no statutory cap — and the state&apos;s modified comparative fault rule means understanding your share of fault is one of the most important factors in determining whether you recover anything at all.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your non-economic damages using both the multiplier method and per diem method. This guide explains exactly how pain and suffering is calculated in Georgia, what Georgia&apos;s 50% bar means for your claim, and the deadlines you cannot afford to miss.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Georgia Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering falls under non-economic damages in Georgia — compensation for the physical pain, emotional distress, mental anguish, and reduced quality of life caused by your injury. Unlike medical bills or lost wages, non-economic damages do not come with a receipt. Their value is determined by the severity of your injuries, the duration of your recovery, and how the injury has changed your daily life.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia previously had a statutory cap on non-economic damages in medical malpractice cases, but the Georgia Supreme Court struck that cap down as unconstitutional in <em>Atlanta Oculoplastic Surgery v. Nestlehutt</em> (2010). For personal injury claims — including car accidents, slip and falls, and premises liability — <strong style={{ color: '#E2E8F0' }}>there is no cap on pain and suffering damages in Georgia</strong>. A jury can award whatever amount it finds reasonable based on the evidence presented at trial.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Georgia Modified Comparative Fault — The 50% Bar</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia follows a modified comparative fault system under <Link href="https://law.justia.com/codes/georgia/title-51/chapter-12/section-51-12-33/" style={{ color: '#60A5FA' }}>OCGA Section 51-12-33</Link>. This rule allows an injured plaintiff to recover damages even if they were partially at fault — but only if their share of fault falls below a specific threshold. In Georgia, that threshold is <strong style={{ color: '#E2E8F0' }}>50%</strong>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Here is what the 50% bar means in practice: if you are found to be 49% at fault for the accident, you recover 51% of your total damages. If you are found to be exactly 50% at fault, you recover <strong style={{ color: '#E2E8F0' }}>nothing</strong>. The moment your fault equals or exceeds 50%, your right to any compensation is completely eliminated.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This makes Georgia&apos;s comparative fault rule <strong style={{ color: '#E2E8F0' }}>stricter than most states</strong>. Texas, Florida, and Pennsylvania all use a 51% bar — meaning a plaintiff can recover as long as they are not more than 50% responsible. Georgia&apos;s 50% bar is one percentage point harsher: in those states, being exactly 50% at fault still allows recovery. In Georgia, it does not.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This distinction matters most in close-liability cases — rear-end accidents where the lead driver braked suddenly, slip and fall cases where the plaintiff may have been partially inattentive, or pedestrian accidents in shared-fault scenarios. Defense attorneys in Georgia regularly target the 50% threshold specifically because eliminating recovery entirely is a more powerful outcome than simply reducing it.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Your fault percentage is determined either by negotiation with the insurance adjuster or, if your case goes to trial, by the jury. Documentation of the scene, witness statements, and accident reconstruction reports all influence how fault is allocated.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Georgia</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia courts and insurance adjusters primarily use two methods to calculate pain and suffering. Understanding <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> before entering negotiations gives you a significant advantage.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Multiplier Method:</strong> Your total economic damages — medical expenses, lost wages, future medical costs — are multiplied by a number between 1.5 and 5. The multiplier reflects injury severity. A soft tissue injury with full recovery typically draws a multiplier of 1.5 to 2. A permanent disability or catastrophic injury can push the multiplier to 4 or 5. Insurance company software, including Colossus, automates much of this calculation, which is why thorough medical documentation drives settlement values more than subjective pain descriptions.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Per Diem Method:</strong> A daily dollar rate is assigned to your pain and suffering — often tied to your daily wage — and multiplied by the number of days you experienced pain during recovery. A $200 per diem rate applied to a 180-day recovery produces $36,000 in non-economic damages before any comparative fault reduction.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Both methods produce estimates. Georgia juries are not bound by either formula and can award any amount supported by the evidence.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Georgia Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the calculation method, several Georgia-specific factors shape what an insurer offers and what a jury awards.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue</strong> is one of the largest variables. Atlanta juries — particularly in Fulton County and DeKalb County — have a well-established reputation for plaintiff-friendly verdicts. A serious injury case tried in Atlanta can produce significantly higher non-economic damages than the same case tried in a rural Georgia county where juries tend to be more conservative. Experienced Georgia plaintiff attorneys often consider venue strategy before filing.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Injury documentation</strong> determines multiplier value. Consistent treatment records, specialist referrals, MRI or imaging results, and a treating physician&apos;s narrative about how the injury affects daily function all increase the multiplier an adjuster or jury will apply.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Pre-existing conditions</strong> are a persistent defense tactic in Georgia. If you had a prior back injury and then suffered a new back injury in an accident, the defense will argue a portion of your pain predates the accident. Counter this with clear before-and-after medical records.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Government Entity Claims in Georgia</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injury was caused by a Georgia government entity — a city vehicle, a county-maintained road, a state agency — you face procedural requirements that do not apply to claims against private parties. Missing these deadlines bars your claim entirely, regardless of how strong your case is.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia requires <strong style={{ color: '#E2E8F0' }}>ante-litem notice</strong> before you can sue a government entity. The deadlines are:</p>
              <ul style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px', paddingLeft: '24px', listStyleType: 'disc' }}>
                <li><strong style={{ color: '#E2E8F0' }}>City or municipality:</strong> written notice within <strong style={{ color: '#E2E8F0' }}>6 months</strong> of the injury</li>
                <li><strong style={{ color: '#E2E8F0' }}>County or state agency:</strong> written notice within <strong style={{ color: '#E2E8F0' }}>12 months</strong> of the injury</li>
              </ul>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Ante-litem notice must include specific information: the time, place, and circumstances of the injury, and the amount of damages claimed. Defective notice — missing required details or delivered late — can be fatal to your case. The standard 2-year statute of limitations does not extend these ante-litem windows.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your accident occurred on a government-maintained road, in a public building, or involved a government-operated vehicle, consult a Georgia personal injury attorney immediately to confirm the applicable ante-litem deadline.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Georgia Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia gives personal injury victims <strong style={{ color: '#E2E8F0' }}>2 years</strong> from the date of injury to file a lawsuit. This deadline is set by OCGA Section 9-3-33. If you do not file within 2 years, the court will dismiss your case and you lose your right to any compensation, regardless of how clear the liability is.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There are limited exceptions. The discovery rule can toll the clock in cases where the injury was not immediately apparent — some toxic exposure or medical negligence cases. The statute of limitations is also tolled for minors until they turn 18, at which point they have 2 years to file. Claims involving government entities are governed by their own ante-litem notice requirements, but the 2-year filing deadline still applies after proper notice is given.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not treat the 2-year deadline as a planning horizon. Insurance negotiations, evidence preservation, and witness availability all deteriorate over time. Most experienced Georgia personal injury attorneys recommend initiating your case well within the first year.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Georgia</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no official database of Georgia personal injury settlement amounts — most cases resolve confidentially. That said, documented jury verdicts and reported settlements provide useful reference points.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Minor soft tissue injuries in Georgia — whiplash, sprains, strains with full recovery — typically settle in the <strong style={{ color: '#E2E8F0' }}>$10,000 to $35,000</strong> range, with pain and suffering representing roughly half. Moderate injuries requiring surgery or producing lasting impairment commonly settle between <strong style={{ color: '#E2E8F0' }}>$75,000 and $250,000</strong>. Catastrophic injuries — spinal cord damage, traumatic brain injury, permanent disability — regularly produce settlements and verdicts <strong style={{ color: '#E2E8F0' }}>above $500,000</strong>, with Atlanta jury awards occasionally reaching seven figures.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These figures are not guarantees. Your specific settlement depends on your fault percentage under Georgia&apos;s 50% bar, the defendant&apos;s insurance policy limits, the strength of your medical documentation, and whether your case is tried in an urban or rural Georgia county. Use our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to build a baseline estimate from your actual damages.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'ga-faq-1',
                  question: 'How is pain and suffering calculated in Georgia?',
                  answer: 'Georgia insurers and courts use either the multiplier method or the per diem method. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5 based on injury severity. The per diem method assigns a daily dollar value to your pain and multiplies it by the number of days you suffered. Neither method produces a binding figure — insurance adjusters negotiate from these estimates, and Georgia juries can award any amount they find supported by the evidence.',
                  schemaAnswer: 'Georgia insurers and courts use either the multiplier method or the per diem method. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5 based on injury severity. The per diem method assigns a daily dollar value to your pain and multiplies it by the number of days you suffered. Neither method produces a binding figure — insurance adjusters negotiate from these estimates, and Georgia juries can award any amount they find supported by the evidence.'
                },
                {
                  id: 'ga-faq-2',
                  question: 'Is there a cap on pain and suffering in Georgia?',
                  answer: 'No. Georgia\'s cap on non-economic damages in medical malpractice cases was struck down as unconstitutional by the Georgia Supreme Court in 2010. For personal injury claims, there is no statutory limit on the amount a jury can award for pain and suffering.',
                  schemaAnswer: 'No. Georgia\'s cap on non-economic damages in medical malpractice cases was struck down as unconstitutional by the Georgia Supreme Court in 2010. For personal injury claims, there is no statutory limit on the amount a jury can award for pain and suffering.'
                },
                {
                  id: 'ga-faq-3',
                  question: 'What is the 50% rule in Georgia personal injury cases?',
                  answer: 'Georgia\'s modified comparative fault rule under OCGA 51-12-33 bars recovery if you are found 50% or more at fault for the accident. If your fault is 49% or less, you recover damages reduced by your fault percentage. At exactly 50% fault, you recover nothing. This is stricter than the 51% bar used in Texas, Florida, and several other states.',
                  schemaAnswer: 'Georgia\'s modified comparative fault rule under OCGA 51-12-33 bars recovery if you are found 50% or more at fault for the accident. If your fault is 49% or less, you recover damages reduced by your fault percentage. At exactly 50% fault, you recover nothing. This is stricter than the 51% bar used in Texas, Florida, and several other states.'
                },
                {
                  id: 'ga-faq-4',
                  question: 'What is the statute of limitations for personal injury in Georgia?',
                  answer: '2 years from the date of injury under OCGA Section 9-3-33. Claims against government entities require ante-litem notice within 6 months (city) or 12 months (county or state) before the lawsuit can be filed.',
                  schemaAnswer: '2 years from the date of injury under OCGA Section 9-3-33. Claims against government entities require ante-litem notice within 6 months (city) or 12 months (county or state) before the lawsuit can be filed.'
                },
                {
                  id: 'ga-faq-5',
                  question: 'What are average pain and suffering settlements in Georgia?',
                  answer: 'Minor injury cases typically settle between $10,000 and $35,000. Moderate injuries requiring surgery or producing lasting impairment commonly settle between $75,000 and $250,000. Catastrophic injury cases — permanent disability, traumatic brain injury, spinal cord damage — regularly exceed $500,000. Atlanta juries tend to award higher verdicts than rural Georgia counties. Your individual settlement depends on your fault percentage, the defendant\'s insurance limits, and the quality of your medical documentation.',
                  schemaAnswer: 'Minor injury cases typically settle between $10,000 and $35,000. Moderate injuries requiring surgery or producing lasting impairment commonly settle between $75,000 and $250,000. Catastrophic injury cases — permanent disability, traumatic brain injury, spinal cord damage — regularly exceed $500,000. Atlanta juries tend to award higher verdicts than rural Georgia counties. Your individual settlement depends on your fault percentage, the defendant\'s insurance limits, and the quality of your medical documentation.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Georgia Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Georgia&apos;s 50% comparative fault bar makes your fault percentage the single most important variable in your case. One point of fault — the difference between 49% and 50% — is the difference between a full recovery and none. Before you negotiate with an insurance adjuster, you need a realistic estimate of your damages and a clear understanding of how fault allocation affects what you actually take home.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your non-economic damages under both the multiplier and per diem methods. If your accident happened in a neighboring state, our <Link href="/pain-and-suffering-calculator/florida/" style={{ color: '#60A5FA' }}>Florida pain and suffering calculator</Link> applies Florida&apos;s comparative fault rules to your claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This content is for informational purposes only and does not constitute legal advice. Consult a licensed Georgia personal injury attorney for guidance specific to your case.</em></p>
            </article>
          ) : stateData.slug === 'north-carolina' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina is one of the most difficult states in the country to win a personal injury claim — and if you have been hurt in Charlotte, Raleigh, or anywhere else in the state, you need to understand why before you accept a single dollar from an insurance company.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina follows pure contributory negligence, a fault rule so strict that if an insurer can show you were even 1% responsible for your own injury, you recover nothing. Not a reduced amount — nothing. Use this page alongside our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to build a realistic picture of what your claim may be worth, and read our complete guide on <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> before you negotiate.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under North Carolina Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina law recognizes two categories of damages in personal injury cases. Economic damages cover losses with a measurable dollar value: medical bills, future treatment costs, lost wages, and reduced earning capacity. Non-economic damages — the category that includes pain and suffering — cover the human cost of the injury: physical pain, emotional distress, anxiety, disfigurement, loss of enjoyment of life, and the lasting impact on your relationships and daily routine.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina juries are given wide discretion to value non-economic damages in standard personal injury cases. There is no statutory cap on pain and suffering for general personal injury claims, which means a serious injury with lasting consequences can produce a substantial non-economic award. The single biggest threat to that award is not the cap — it is the contributory negligence rule discussed in the next section.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>North Carolina Contributory Negligence — The Harshest Fault Rule in America</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Most states use some form of comparative fault, which means your damages are reduced in proportion to your share of responsibility. If you were 20% at fault in a Texas car accident, you recover 80% of your damages. North Carolina does not work that way.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina is one of only four or five states — alongside Alabama, Maryland, Virginia, and the District of Columbia — that still applies pure contributory negligence. Under this rule, any fault on your part is a complete bar to recovery. If you were 1% negligent and the defendant was 99% negligent, you walk away with nothing.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In practice, this means North Carolina insurance adjusters are trained to look for any evidence of plaintiff fault and use it aggressively. Common contributory negligence arguments include: you were speeding even slightly at the time of the crash, you were not wearing a seatbelt, you were texting, you failed to notice an obvious hazard, or you delayed seeking medical treatment in a way that worsened your condition. Each of these arguments, if accepted by a jury, results in a zero verdict regardless of how badly you were hurt.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is a narrow last clear chance doctrine that can sometimes overcome a contributory negligence defense — if the defendant had the final opportunity to avoid the harm and failed to take it, the plaintiff may still recover. But this is a limited exception and difficult to prove.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The practical consequence for settlement negotiations is significant. Because a contributory negligence finding eliminates your entire claim, insurance companies in North Carolina have enormous leverage. An attorney who understands how to preempt these arguments and document the defendant&apos;s sole fault is not optional in a serious North Carolina personal injury case — it is essential.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in North Carolina</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Assuming your contributory negligence defense is neutralized, North Carolina attorneys and insurance adjusters use the same two valuation methods used nationally.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The multiplier method is the most common. You add up your total economic damages — all medical expenses, lost income, and future costs — and multiply that figure by a number between 1.5 and 5. Minor soft-tissue injuries with full recovery typically draw multipliers between 1.5 and 2. Serious injuries requiring surgery, producing permanent limitations, or resulting in long-term psychiatric harm regularly draw multipliers of 3 to 5 or higher. A $40,000 medical bill with a 3x multiplier produces a $120,000 pain and suffering figure and a $160,000 total claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The per diem method assigns a daily dollar rate — often the injured person&apos;s daily wage — to each day they lived with pain, then multiplies it by the duration of recovery. A $200 daily rate across 365 days produces $73,000 in pain and suffering alone.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance software, including Colossus, assigns its own internal multipliers that frequently undervalue claims. Whatever figure an adjuster offers first, it is almost never the ceiling.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>North Carolina Damage Caps</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no cap on non-economic damages for standard personal injury claims in North Carolina. Car accidents, slip and falls, dog bites, and similar tort claims are uncapped, which means the jury&apos;s verdict controls.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Medical malpractice is the exception. North Carolina General Statutes Section 90-21.19 caps non-economic damages in med mal cases. For 2026, that cap is <strong style={{ color: '#E2E8F0' }}>$712,847</strong>. The figure is adjusted every three years by the NC Office of State Budget and Management based on the Consumer Price Index. The cap applies to all non-economic damages combined, including pain and suffering, emotional distress, and loss of consortium.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The cap is lifted in two narrow circumstances: cases involving reckless disregard for the rights of others, and cases involving gross negligence that results in permanent disfigurement or death. In those situations, the jury may award non-economic damages beyond the statutory ceiling.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Punitive damages in North Carolina are capped at the greater of three times compensatory damages or $250,000.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect North Carolina Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the fault rule and caps, several case-specific factors shape what an insurer will offer.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Injury severity and permanence are the most important. A fractured spine, traumatic brain injury, or permanent nerve damage commands far more than a soft-tissue strain. Treatment duration matters equally — a claim supported by six months of consistent physical therapy is harder to minimize than one with a two-week gap in care.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Venue also matters. Mecklenburg County (Charlotte) and Wake County (Raleigh) juries have historically been more plaintiff-friendly than rural counties, which is one reason cases in those jurisdictions tend to settle higher. The defendant driver&apos;s policy limits are a practical ceiling in most cases unless underinsured motorist coverage is available.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Documentation is your leverage. Consistent medical records, expert testimony on future care needs, employer letters confirming lost wages, and personal journals tracking daily pain all directly increase settlement value.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>North Carolina Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina General Statutes Section 1-52 sets a three-year statute of limitations for personal injury claims. The clock starts on the date of the injury. If you file after three years, your case is dismissed regardless of merit.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Key exceptions apply. The discovery rule can toll the limitations period in cases where an injury was not immediately apparent — particularly relevant in toxic exposure and some medical malpractice cases. For minor plaintiffs, the three-year period does not begin until the child turns 18. Wrongful death claims have a separate two-year limitations period running from the date of death under NCGS Section 1-53.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Three years sounds like a long runway, but the practical reality is that evidence disappears, witnesses become unavailable, and surveillance footage is routinely overwritten within 30 to 90 days of an incident. Filing a claim and preserving evidence early gives you a substantially stronger position than waiting.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in North Carolina</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Published verdicts and settlements in North Carolina reflect the impact of contributory negligence on case values. Because any plaintiff fault can eliminate the claim entirely, cases that proceed to settlement tend to involve defendants with clear, unambiguous liability — and those cases often settle well.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Moderate car accident injuries with solid liability — broken bones, herniated discs, or rotator cuff tears requiring surgery — commonly settle in the $75,000 to $200,000 range in major metro venues. Traumatic brain injury and spinal cord injury cases with permanent functional loss regularly produce settlements and verdicts exceeding $500,000, with serious cases reaching seven figures.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft-tissue-only claims with no surgery and full recovery tend to settle in the $15,000 to $50,000 range depending on treatment costs and duration.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These are illustrative ranges, not guarantees. Every case is fact-specific, and the contributory negligence exposure in your particular case may significantly affect what an insurer is willing to offer. Compare your state with our <Link href="/pain-and-suffering-calculator/georgia/" style={{ color: '#60A5FA' }}>Georgia pain and suffering calculator</Link> to understand how different fault rules change outcomes.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'nc-faq-1',
                  question: 'How is pain and suffering calculated in North Carolina?',
                  answer: 'North Carolina attorneys use the multiplier method or the per diem method. The multiplier method multiplies total economic damages by a factor of 1.5 to 5 based on injury severity. The per diem method assigns a daily dollar rate to each day you lived with pain. Insurance adjusters also use proprietary software like Colossus that frequently produces lowball figures. Neither method produces a fixed number — the final settlement depends on the strength of your liability evidence, the quality of your medical documentation, and whether the defendant can raise a credible contributory negligence argument.',
                  schemaAnswer: 'North Carolina attorneys use the multiplier method or the per diem method. The multiplier method multiplies total economic damages by a factor of 1.5 to 5 based on injury severity. The per diem method assigns a daily dollar rate to each day you lived with pain. Insurance adjusters also use proprietary software like Colossus that frequently produces lowball figures. Neither method produces a fixed number — the final settlement depends on the strength of your liability evidence, the quality of your medical documentation, and whether the defendant can raise a credible contributory negligence argument.'
                },
                {
                  id: 'nc-faq-2',
                  question: 'What is contributory negligence in North Carolina?',
                  answer: 'Contributory negligence means that if you contributed in any way to causing your injury, you cannot recover any damages from the defendant — even if the defendant was overwhelmingly more at fault. North Carolina is one of only four or five states that still applies this rule. Most other states use comparative fault, which reduces your recovery proportionally rather than eliminating it entirely.',
                  schemaAnswer: 'Contributory negligence means that if you contributed in any way to causing your injury, you cannot recover any damages from the defendant — even if the defendant was overwhelmingly more at fault. North Carolina is one of only four or five states that still applies this rule. Most other states use comparative fault, which reduces your recovery proportionally rather than eliminating it entirely.'
                },
                {
                  id: 'nc-faq-3',
                  question: 'Does any fault bar recovery in North Carolina?',
                  answer: 'Yes. Under pure contributory negligence, even 1% fault on your part is a complete bar to recovery. There is no threshold you have to exceed — any measurable negligence on your part is sufficient for a jury to return a defense verdict. The narrow last clear chance doctrine is the only common-law exception.',
                  schemaAnswer: 'Yes. Under pure contributory negligence, even 1% fault on your part is a complete bar to recovery. There is no threshold you have to exceed — any measurable negligence on your part is sufficient for a jury to return a defense verdict. The narrow last clear chance doctrine is the only common-law exception.'
                },
                {
                  id: 'nc-faq-4',
                  question: 'What is the statute of limitations for personal injury in North Carolina?',
                  answer: 'Three years from the date of injury under NCGS Section 1-52. Wrongful death claims must be filed within two years of death. The period is tolled for minors until they turn 18, and the discovery rule may apply in cases where the injury was not immediately apparent. Do not wait to consult an attorney — evidence preservation begins on day one.',
                  schemaAnswer: 'Three years from the date of injury under NCGS Section 1-52. Wrongful death claims must be filed within two years of death. The period is tolled for minors until they turn 18, and the discovery rule may apply in cases where the injury was not immediately apparent. Do not wait to consult an attorney — evidence preservation begins on day one.'
                },
                {
                  id: 'nc-faq-5',
                  question: 'Is there a cap on pain and suffering in North Carolina?',
                  answer: 'There is no cap for standard personal injury claims. Medical malpractice cases are capped at $712,847 for 2026, adjusted every three years by the NC OSBM. That cap is lifted for cases involving reckless disregard or gross negligence resulting in permanent disfigurement or death. Punitive damages are capped at the greater of three times compensatory damages or $250,000.',
                  schemaAnswer: 'There is no cap for standard personal injury claims. Medical malpractice cases are capped at $712,847 for 2026, adjusted every three years by the NC OSBM. That cap is lifted for cases involving reckless disregard or gross negligence resulting in permanent disfigurement or death. Punitive damages are capped at the greater of three times compensatory damages or $250,000.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Calculate Your North Carolina Pain and Suffering Estimate</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>North Carolina&apos;s contributory negligence rule makes accurate claim valuation more important — not less. If an insurer can convince you your case is weak because of a disputed fault issue, they will lowball you. Knowing what your damages are worth before you negotiate puts you in a position to push back.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> now to enter your medical expenses, lost wages, and injury severity. The calculator applies both the multiplier and per diem methods and gives you an instant estimate you can use as a baseline in any settlement discussion.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This page is for general informational purposes only and does not constitute legal advice. Consult a licensed North Carolina personal injury attorney before making decisions about your claim.</em></p>
            </article>
          ) : stateData.slug === 'michigan' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan has one of the most complex personal injury systems in the United States. As a no-fault state, Michigan requires drivers to carry Personal Injury Protection (PIP) coverage that pays your own medical bills and lost wages regardless of who caused the accident — but that same no-fault system also restricts your right to sue the at-fault driver for pain and suffering. To step outside the no-fault system and pursue noneconomic damages, your injuries must clear a legal threshold that Michigan courts have defined through decades of case law. Understanding how that threshold works, how the state caps noneconomic damages, and how modified comparative fault can reduce your recovery is essential before you use our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your claim.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Michigan Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Michigan, pain and suffering falls under the category of noneconomic damages — compensation for the human cost of your injuries rather than their financial cost. Noneconomic damages can include physical pain, mental anguish, emotional distress, disfigurement, permanent scarring, loss of consortium, and loss of the ability to enjoy daily activities and relationships.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan does not compensate noneconomic damages automatically in every personal injury case. Because the state operates a no-fault insurance system, your right to sue for pain and suffering depends entirely on whether your injury meets the legal definition of a serious impairment of body function. If it does not, your recovery is limited to the economic benefits your own PIP coverage provides. If it does, you can pursue noneconomic damages from the at-fault driver — subject to the state&apos;s statutory damage caps. To understand <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> more broadly, our full guide walks through both the multiplier method and the per diem method.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Michigan No-Fault Insurance and the Serious Impairment Threshold</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan&apos;s no-fault law, enacted in 1973 and significantly reformed in 2019, requires every registered vehicle owner to carry PIP medical coverage. Since the 2020 reforms took effect, Michigan drivers choose from tiered PIP options: $250,000, $500,000, or unlimited coverage. Seniors enrolled in Medicare may opt out of PIP medical coverage entirely. Your PIP policy pays your medical bills and 85% of lost wages up to a statutory maximum, regardless of fault — but it does not pay pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>To recover pain and suffering from the at-fault driver, Michigan law under MCL 500.3135 requires that you suffered a <strong style={{ color: '#E2E8F0' }}>serious impairment of body function</strong>. The Michigan Supreme Court has defined this as an objectively manifested impairment of an important body function that affects your general ability to lead your normal life. Every word in that definition carries legal weight.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Objectively manifested</strong> means the impairment must be observable or perceivable from evidence beyond your own subjective complaints — imaging results, physician findings, and functional assessments all matter. <strong style={{ color: '#E2E8F0' }}>Important body function</strong> means not every body part qualifies equally; courts weigh the significance of the function affected. <strong style={{ color: '#E2E8F0' }}>Affects your general ability to lead your normal life</strong> does not require that you be completely unable to live your life — it requires that the impairment has influenced some of your capacity to live normally, even if you have adapted or partially recovered.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft tissue injuries, herniated discs, and significant orthopedic injuries have cleared this threshold in Michigan courts. Minor sprains and injuries that resolve quickly without documented functional impact typically do not. Medical documentation from your treating physicians is the most important factor in establishing that your injury meets the serious impairment standard.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pedestrians and cyclists injured by a motor vehicle have separate rules. If the at-fault vehicle&apos;s insurer cannot be identified, they are limited to $250,000 in benefits through the <strong style={{ color: '#E2E8F0' }}>Michigan Assigned Claims Plan (MACP)</strong> — a state-administered fund of last resort.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Michigan Noneconomic Damage Cap</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan imposes a statutory cap on noneconomic damages in personal injury cases. For 2026, the <strong style={{ color: '#E2E8F0' }}>standard cap is $596,400</strong>. This figure is adjusted annually based on the Consumer Price Index and applies to the vast majority of motor vehicle accident claims.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>A separate, elevated cap of <strong style={{ color: '#E2E8F0' }}>$1,065,000</strong> applies when the plaintiff has suffered a catastrophic injury. Michigan law defines catastrophic injuries eligible for the elevated cap as: paraplegia or quadriplegia resulting in the permanent loss of or damage to both legs, both arms, or one leg and one arm; permanent cognitive incapacity; or permanent loss of or damage to a reproductive organ resulting in an inability to procreate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In practical terms, the standard $596,400 cap is the ceiling for most serious injury claims — even those involving significant permanent injuries that fall short of the catastrophic definitions above. A plaintiff with a severe spinal injury, a traumatic brain injury, or permanent scarring that is life-altering in impact but does not meet the statutory catastrophic definition will be capped at $596,400 in noneconomic damages, regardless of what a jury might otherwise award.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These caps apply only to noneconomic damages. <strong style={{ color: '#E2E8F0' }}>Economic damages in Michigan are uncapped</strong> — medical bills, future medical costs, lost wages, and lost earning capacity are fully recoverable without a ceiling.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Michigan</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Once you have cleared the serious impairment threshold and your case proceeds toward settlement or trial, adjusters and attorneys calculate your noneconomic damages using two primary methods.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>multiplier method</strong> takes your total special damages — documented medical bills and lost wages — and multiplies them by a factor that reflects the severity and permanence of your injuries. In Michigan, multipliers typically range from 1.5x for moderate recoverable injuries to 4x or 5x for severe permanent conditions. Insurance carriers use claims software such as Colossus to generate multiplier recommendations based on injury codes, treatment duration, and documentation quality.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>per diem method</strong> assigns a daily dollar rate to your pain — often equivalent to your daily wage — and multiplies it by the number of days you suffered. Per diem calculations are more commonly used by plaintiff attorneys during demand letters and trial preparation than by insurance adjusters.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In either method, the noneconomic damage cap functions as a hard ceiling. If the multiplier calculation produces a figure of $900,000 but your claim does not meet the catastrophic injury definition, your noneconomic recovery is limited to $596,400 regardless.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Michigan Modified Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan follows a <strong style={{ color: '#E2E8F0' }}>modified comparative fault rule with a 51% bar</strong>, codified under MCL 600.2959. Under this rule, your compensation is reduced by your percentage of fault for the accident. If you are awarded $400,000 in total damages and the jury assigns you 20% of the fault, your recovery is reduced to $320,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The critical cutoff: if you are found <strong style={{ color: '#E2E8F0' }}>51% or more at fault</strong>, you are completely barred from recovering any damages. At exactly 50% fault, you can still recover — reduced by half. This threshold matters significantly in rear-end accidents, intersection collisions, and premises liability cases where both parties contributed to the circumstances of the injury.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters apply comparative fault analysis from the moment your claim is filed. If the accident report, witness statements, or your own account suggest you bear any responsibility for the collision, the adjuster will apply a fault percentage to every settlement offer. Retaining an attorney early helps counter lowball fault assignments before they become embedded in the claim file.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Michigan Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several variables beyond the legal framework directly influence what a Michigan personal injury claim settles for in practice.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Jurisdiction</strong> is a major factor. Wayne County (Detroit) has historically produced higher plaintiff verdicts than rural Michigan counties, and that settlement premium is built into demand letters filed in that jurisdiction. Grand Rapids (Kent County) and Lansing (Ingham County) fall in the middle tier.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The at-fault driver&apos;s policy limits</strong> set a practical ceiling in most cases. If the defendant carries minimum liability coverage and has no substantial assets, your recovery is constrained regardless of the merit of your claim. <strong style={{ color: '#E2E8F0' }}>Underinsured motorist coverage</strong> on your own policy can bridge the gap.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Documentation quality</strong> — consistent treatment, complete medical records, and objective imaging evidence — directly affects how adjusters score your claim in software like Colossus. Gaps in treatment are interpreted as evidence that your injuries were not serious.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Michigan Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The statute of limitations for personal injury claims in Michigan is <strong style={{ color: '#E2E8F0' }}>three years from the date of the accident</strong>, under MCL 600.5805(2). If you do not file suit within three years, the court will dismiss your claim regardless of its merits, and you permanently lose your right to recover.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several exceptions apply. Claims against a government entity — a city, county, or the state itself — require a <strong style={{ color: '#E2E8F0' }}>60-day notice of intent</strong> filed before the three-year period runs, and the shorter notice deadline can effectively accelerate your timeline. Claims on behalf of minors are tolled until the minor reaches age 18, at which point the three-year period begins. Wrongful death claims under MCL 600.5852 are subject to a separate three-year period running from the appointment of a personal representative of the estate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not rely on the three-year window as a comfortable buffer. Evidence degrades, witnesses become unavailable, and insurance companies use delay to their advantage. Consulting a Michigan personal injury attorney within the first 90 days of your injury preserves your options.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Michigan</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan does not maintain a public database of personal injury settlement values, and published verdict reporters capture only the small percentage of cases that go to trial. That said, pattern data from Michigan courts and attorney reporting provides general benchmarks.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft tissue injuries that clearly meet the serious impairment threshold — herniated discs with nerve involvement, rotator cuff tears requiring surgery — typically settle in the <strong style={{ color: '#E2E8F0' }}>$75,000 to $200,000</strong> range in noneconomic damages, depending on age, treatment duration, and jurisdiction. Moderate permanent injuries settle in the <strong style={{ color: '#E2E8F0' }}>$200,000 to $450,000</strong> range. Claims approaching the $596,400 standard cap involve significant, documented permanent impairment with strong medical support.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Catastrophic injuries involving paraplegia, quadriplegia, or permanent cognitive incapacity reach the elevated $1,065,000 cap in the strongest cases. Wayne County verdicts in catastrophic cases occasionally exceed even the elevated cap, though those awards are reduced to the statutory ceiling on post-verdict motions.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These figures are reference points, not guarantees. Every Michigan personal injury claim turns on its own facts.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'mi-faq-1',
                  question: 'How is pain and suffering calculated in Michigan?',
                  answer: 'Michigan attorneys and insurance adjusters use either the multiplier method or the per diem method. The multiplier method multiplies your total economic damages (medical bills plus lost wages) by a factor between 1.5 and 5, depending on injury severity and permanence. The per diem method assigns a daily dollar value to your suffering and multiplies it by the number of days affected. Both calculations are subject to Michigan\'s noneconomic damage cap of $596,400 for standard claims in 2026.',
                  schemaAnswer: 'Michigan attorneys and insurance adjusters use either the multiplier method or the per diem method. The multiplier method multiplies your total economic damages (medical bills plus lost wages) by a factor between 1.5 and 5, depending on injury severity and permanence. The per diem method assigns a daily dollar value to your suffering and multiplies it by the number of days affected. Both calculations are subject to Michigan\'s noneconomic damage cap of $596,400 for standard claims in 2026.'
                },
                {
                  id: 'mi-faq-2',
                  question: 'What is the serious impairment threshold in Michigan?',
                  answer: 'To sue for pain and suffering following a motor vehicle accident in Michigan, your injury must be an objectively manifested impairment of an important body function that affects your general ability to lead your normal life. This definition comes from MCL 500.3135 as interpreted by the Michigan Supreme Court. Purely subjective complaints without medical documentation typically do not satisfy the threshold. Injuries that permanently or significantly alter your daily functioning — documented with imaging, physician assessments, and functional evaluations — are more likely to qualify.',
                  schemaAnswer: 'To sue for pain and suffering following a motor vehicle accident in Michigan, your injury must be an objectively manifested impairment of an important body function that affects your general ability to lead your normal life. This definition comes from MCL 500.3135 as interpreted by the Michigan Supreme Court. Purely subjective complaints without medical documentation typically do not satisfy the threshold. Injuries that permanently or significantly alter your daily functioning — documented with imaging, physician assessments, and functional evaluations — are more likely to qualify.'
                },
                {
                  id: 'mi-faq-3',
                  question: 'Is there a cap on pain and suffering in Michigan?',
                  answer: 'Yes. Michigan caps noneconomic damages at $596,400 for standard personal injury claims in 2026. An elevated cap of $1,065,000 applies to catastrophic injuries: paraplegia, quadriplegia, permanent cognitive incapacity, or permanent loss of a reproductive organ. Economic damages — medical bills, lost wages, future care costs — are not capped. The caps are adjusted annually based on the Consumer Price Index.',
                  schemaAnswer: 'Yes. Michigan caps noneconomic damages at $596,400 for standard personal injury claims in 2026. An elevated cap of $1,065,000 applies to catastrophic injuries: paraplegia, quadriplegia, permanent cognitive incapacity, or permanent loss of a reproductive organ. Economic damages — medical bills, lost wages, future care costs — are not capped. The caps are adjusted annually based on the Consumer Price Index.'
                },
                {
                  id: 'mi-faq-4',
                  question: 'What is the statute of limitations for personal injury in Michigan?',
                  answer: 'Three years from the date of injury, under MCL 600.5805(2). Claims against government entities require a 60-day notice of intent filed before suit, which effectively shortens your practical window. Minor victims have until three years after their 18th birthday. Missing the deadline permanently bars your claim.',
                  schemaAnswer: 'Three years from the date of injury, under MCL 600.5805(2). Claims against government entities require a 60-day notice of intent filed before suit, which effectively shortens your practical window. Minor victims have until three years after their 18th birthday. Missing the deadline permanently bars your claim.'
                },
                {
                  id: 'mi-faq-5',
                  question: 'How does Michigan no-fault insurance affect pain and suffering claims?',
                  answer: 'Michigan no-fault PIP coverage pays your medical bills and a portion of lost wages regardless of fault, but it does not cover pain and suffering. To recover pain and suffering from the at-fault driver, you must step outside the no-fault system by proving your injury meets the serious impairment of body function threshold. If it does not, your recovery is limited to PIP benefits. Michigan drivers now choose their PIP coverage tier — $250,000, $500,000, or unlimited — at policy renewal, and that choice affects how much medical coverage is available before you reach any gap.',
                  schemaAnswer: 'Michigan no-fault PIP coverage pays your medical bills and a portion of lost wages regardless of fault, but it does not cover pain and suffering. To recover pain and suffering from the at-fault driver, you must step outside the no-fault system by proving your injury meets the serious impairment of body function threshold. If it does not, your recovery is limited to PIP benefits. Michigan drivers now choose their PIP coverage tier — $250,000, $500,000, or unlimited — at policy renewal, and that choice affects how much medical coverage is available before you reach any gap.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Michigan Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Michigan&apos;s no-fault threshold, noneconomic damage cap, and modified comparative fault rule make it one of the more complex states for estimating personal injury damages. Use our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to generate a range estimate based on your economic damages and injury severity. For a complete breakdown of the multiplier and per diem methods before you run your numbers, read our guide on <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link>. If your accident occurred in another no-fault state, the <Link href="/pain-and-suffering-calculator/florida/" style={{ color: '#60A5FA' }}>Florida pain and suffering calculator</Link> covers Florida&apos;s distinct threshold and cap rules.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The calculator produces an estimate for informational purposes only. It is not legal advice. If your injuries meet or approach the serious impairment threshold, consult a licensed Michigan personal injury attorney before accepting any settlement offer.</p>
            </article>
          ) : stateData.slug === 'washington' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington state personal injury victims have some of the strongest legal protections in the country. There is no cap on non-economic damages, the state applies pure comparative fault, and Seattle juries are among the most plaintiff-friendly in the western United States. If you were injured in Washington — whether in a car accident on I-5, a slip and fall in Tacoma, or a workplace incident in Spokane — understanding how pain and suffering is calculated under Washington law directly affects how much your claim is worth.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> above to estimate your non-economic damages using both the multiplier method and the per diem method. The sections below explain how Washington law shapes those numbers.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Washington Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington law divides personal injury damages into two categories. Economic damages cover measurable financial losses: medical bills, future treatment costs, lost wages, and reduced earning capacity. Non-economic damages — which include pain and suffering, emotional distress, loss of enjoyment of life, and loss of consortium — compensate for the human cost of your injury.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington has no statutory cap on non-economic damages for standard personal injury claims. The Washington Supreme Court struck down a legislative cap on non-economic damages in medical malpractice cases in <em>Sofie v. Fibreboard Corp.</em> (1989), holding that such caps violated the right to jury trial under the Washington Constitution. That precedent has kept Washington one of the few states where juries retain full discretion to award non-economic damages without an artificial ceiling, regardless of injury type.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Washington Pure Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington follows the pure comparative fault doctrine under <Link href="https://app.leg.wa.gov/RCW/default.aspx?cite=4.22.005" style={{ color: '#60A5FA' }}>RCW 4.22.005</Link>. Pure comparative fault means your recovery is reduced by your percentage of fault — but never eliminated by it. Even if you were 90 percent at fault for your own injury, you can still recover 10 percent of your total damages from the other responsible party.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is a critical distinction from the modified comparative fault rules used in states like Texas and Florida, where plaintiffs who are found 51 percent or more at fault are completely barred from recovery. Washington imposes no such bar.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In practice, insurance adjusters in Washington will attempt to assign you a higher fault percentage to reduce their payout. A defense-side adjuster may argue that you were speeding, failed to brake in time, or were distracted — even when the other party bears the majority of responsibility. Understanding that pure comparative fault works in your favor means you should not accept a low early offer simply because an adjuster claims you were partially at fault. Your recovery is proportional, not all-or-nothing.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>To understand <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> alongside fault reductions, see our full methodology guide.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Washington</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington courts and insurance adjusters use two primary methods to calculate pain and suffering damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>multiplier method</strong> is the most widely used approach. Your total economic damages — medical expenses, lost wages, and future costs — are multiplied by a factor between 1.5 and 5. The multiplier reflects injury severity, recovery duration, and long-term impact on your life. A soft-tissue whiplash injury with a full recovery may attract a 1.5x multiplier. A spinal cord injury requiring permanent care may reach 4x or 5x. Washington&apos;s absence of a damages cap means high-multiplier outcomes are legally permissible, and Seattle juries have awarded multimillion-dollar verdicts for catastrophic injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>per diem method</strong> assigns a fixed daily dollar amount to your pain and suffering for each day you lived with the injury. A common benchmark is your daily wage rate. If you earned $300 per day and suffered for 180 days before reaching maximum medical improvement, the per diem calculation produces $54,000 in non-economic damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance companies also use proprietary claims software — most commonly Colossus — which weights factors including injury type, treatment duration, and documented functional limitations. Strong medical records, consistent treatment, and documented gaps in daily function all push the software output higher.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Washington Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several variables determine where your Washington settlement lands within the calculated range.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Injury severity and permanency carry the most weight. Permanent impairment, chronic pain, or disability produces significantly higher non-economic awards than temporary injuries with full recovery. The volume and consistency of your medical treatment matters — gaps in treatment are routinely used by defense counsel to argue that your pain was not as severe as claimed.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Venue matters considerably in Washington. King County (Seattle) produces the highest verdicts in the state. Plaintiffs with strong liability cases and serious injuries achieve materially better outcomes at trial in Seattle than in smaller counties. If your injury occurred in or around Seattle and the case goes to litigation, this geographic premium is real and quantifiable.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Comparative fault assignments also shift the final number. A $200,000 pain and suffering calculation is worth $160,000 if you are found 20 percent at fault.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Washington Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington imposes a three-year statute of limitations on personal injury claims under <Link href="https://app.leg.wa.gov/RCW/default.aspx?cite=4.16.080" style={{ color: '#60A5FA' }}>RCW 4.16.080</Link>. The clock starts running on the date of your injury. If you do not file a lawsuit within three years, your claim is permanently barred and no court will hear it — regardless of how severe your injuries are or how clear the other party&apos;s liability may be.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington also recognizes the discovery rule for latent injuries. If your injury was not reasonably discoverable at the time it occurred — for example, an internal injury that was not diagnosed until months after an accident — the three-year period begins from the date you discovered, or reasonably should have discovered, the injury. This is particularly relevant in toxic exposure cases, occupational disease claims, and delayed-onset traumatic injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your claim involves a government entity — a municipal bus, a state-maintained road, or a public hospital — you must file a formal tort claim notice within the timeframes required under RCW 4.96.020 before any lawsuit can proceed. Those deadlines are shorter than three years and can extinguish your claim entirely if missed.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Washington</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington does not maintain a public database of personal injury settlement values, and most cases resolve through private negotiation rather than public trial verdicts. Settlement amounts vary widely based on injury type, liability clarity, insurance policy limits, and venue.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>That said, observable ranges from reported verdicts and disclosed settlements provide a useful reference. Soft-tissue injuries — whiplash, minor ligament sprains, contusions — with full recovery typically resolve in the $15,000 to $60,000 range for non-economic damages. Moderate injuries requiring surgery or producing permanent partial impairment commonly reach $100,000 to $400,000. Catastrophic injuries — spinal cord damage, traumatic brain injury, severe burns — regularly produce seven-figure non-economic awards in Washington, particularly in King County.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These figures are ranges, not guarantees. Your specific outcome depends on the facts of your case, your documentation, the applicable insurance limits, and whether the case resolves before or at trial. Use our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to generate an estimate based on your actual damages.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'wa-faq-1',
                  question: 'How is pain and suffering calculated in Washington?',
                  answer: 'Washington adjusters and courts use two methods. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5, depending on injury severity and long-term impact. The per diem method assigns a daily dollar value to your suffering for each day you were affected. Insurance companies also process claims through software like Colossus, which generates an internal valuation based on injury codes, treatment records, and documented functional limitations. Neither method produces a binding number — both are starting points for negotiation.',
                  schemaAnswer: 'Washington adjusters and courts use two methods. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5, depending on injury severity and long-term impact. The per diem method assigns a daily dollar value to your suffering for each day you were affected. Insurance companies also process claims through software like Colossus, which generates an internal valuation based on injury codes, treatment records, and documented functional limitations. Neither method produces a binding number — both are starting points for negotiation.'
                },
                {
                  id: 'wa-faq-2',
                  question: 'Is there a cap on pain and suffering in Washington?',
                  answer: 'No. Washington has no cap on non-economic damages for personal injury claims. The Washington Supreme Court ruled that legislative caps on non-economic damages violate the state constitution\'s right to jury trial. Washington juries retain full discretion to award non-economic damages based on the facts of each case, with no statutory ceiling.',
                  schemaAnswer: 'No. Washington has no cap on non-economic damages for personal injury claims. The Washington Supreme Court ruled that legislative caps on non-economic damages violate the state constitution\'s right to jury trial. Washington juries retain full discretion to award non-economic damages based on the facts of each case, with no statutory ceiling.'
                },
                {
                  id: 'wa-faq-3',
                  question: 'What is pure comparative fault in Washington state?',
                  answer: 'Pure comparative fault under RCW 4.22.005 means your recovery is reduced by your percentage of responsibility for the injury, but you are never barred from recovery regardless of how high your fault percentage is. If you were 70 percent at fault and your total damages are $100,000, you can still recover $30,000. This is more favorable to plaintiffs than the modified comparative fault rules used in most other states.',
                  schemaAnswer: 'Pure comparative fault under RCW 4.22.005 means your recovery is reduced by your percentage of responsibility for the injury, but you are never barred from recovery regardless of how high your fault percentage is. If you were 70 percent at fault and your total damages are $100,000, you can still recover $30,000. This is more favorable to plaintiffs than the modified comparative fault rules used in most other states.'
                },
                {
                  id: 'wa-faq-4',
                  question: 'What is the statute of limitations for personal injury in Washington?',
                  answer: 'Three years from the date of injury under RCW 4.16.080. If the injury was latent or not reasonably discoverable at the time it occurred, the three-year period begins from the date of discovery. Claims against government entities require a separate tort claim notice filed within the timeframe set by RCW 4.96.020, which imposes shorter deadlines.',
                  schemaAnswer: 'Three years from the date of injury under RCW 4.16.080. If the injury was latent or not reasonably discoverable at the time it occurred, the three-year period begins from the date of discovery. Claims against government entities require a separate tort claim notice filed within the timeframe set by RCW 4.96.020, which imposes shorter deadlines.'
                },
                {
                  id: 'wa-faq-5',
                  question: 'What are average pain and suffering settlements in Washington state?',
                  answer: 'Settlement values depend heavily on injury severity, venue, and liability clarity. Soft-tissue injuries with full recovery typically produce non-economic awards in the $15,000 to $60,000 range. Surgeries and permanent partial impairment commonly reach $100,000 to $400,000. Catastrophic injuries in King County have produced seven-figure verdicts. These are observed ranges — not averages — because Washington does not publish settlement data.',
                  schemaAnswer: 'Settlement values depend heavily on injury severity, venue, and liability clarity. Soft-tissue injuries with full recovery typically produce non-economic awards in the $15,000 to $60,000 range. Surgeries and permanent partial impairment commonly reach $100,000 to $400,000. Catastrophic injuries in King County have produced seven-figure verdicts. These are observed ranges — not averages — because Washington does not publish settlement data.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Washington Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Washington law gives injured people meaningful legal leverage: no damages cap, pure comparative fault, and a plaintiff-friendly venue in Seattle. But that leverage only translates into a fair settlement if you know what your claim is actually worth before you negotiate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your non-economic damages using both the multiplier and per diem methods. If you are comparing results across states, see how Washington compares to the <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This calculator is a free educational tool. It does not constitute legal advice. For representation in a Washington personal injury claim, consult a licensed Washington personal injury attorney.</em></p>
            </article>
          ) : stateData.slug === 'colorado' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Colorado and you are trying to understand what your noneconomic damages might be worth, you are in the right place. Colorado&apos;s personal injury landscape changed dramatically in 2025 when the state legislature increased its noneconomic damage cap from $250,000 to $1.5 million under House Bill 24-1472 — one of the most significant shifts in Colorado tort law in decades. That single change means many injured Coloradans are now entitled to far more compensation than they would have recovered under the old framework.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to run your numbers. Then read on to understand the Colorado-specific rules that will shape your result, including the modified comparative fault 50% bar, the bifurcated statute of limitations, and what the Colorado Supreme Court&apos;s 2025 ruling in <em>Banner Health v. Gresser</em> means for catastrophic injury victims.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><em>This page is for educational purposes only and does not constitute legal advice. Consult a licensed Colorado personal injury attorney before making any decisions about your claim.</em></p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Colorado Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Under Colorado Revised Statutes § 13-21-102.5, pain and suffering falls within the category of <strong style={{ color: '#E2E8F0' }}>noneconomic damages</strong> — compensation for losses that do not appear on a bill or pay stub. Colorado recognizes noneconomic damages that include physical pain, mental anguish, emotional distress, inconvenience, grief, fear, loss of enjoyment of life, and impairment of the quality of life.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>These damages are distinct from economic damages, which cover your measurable financial losses: medical bills, future treatment costs, lost wages, and loss of earning capacity. Both categories can be pursued in the same Colorado personal injury lawsuit, and both matter when calculating your total settlement value. Understanding <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> is an essential first step before you attempt to estimate what your Colorado claim is worth.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Colorado Noneconomic Damage Cap — The 2025 Increase</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For years, Colorado&apos;s noneconomic damage cap was among the most restrictive in the country. Before 2025, the general cap sat at $250,000 for most personal injury cases, with a difficult-to-obtain exception allowing courts to increase it to $500,000 upon clear and convincing evidence. Adjusted for inflation, those figures had reached approximately $642,180 and $1,284,370 respectively just before the new law took effect — but the underlying statutory ceiling had not meaningfully kept pace with the real cost of serious injuries.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>That changed with <strong style={{ color: '#E2E8F0' }}>HB 24-1472</strong>, signed by Governor Jared Polis in 2024 and effective January 1, 2025. For all civil actions <strong style={{ color: '#E2E8F0' }}>filed on or after January 1, 2025</strong>, the noneconomic damage cap jumped to <strong style={{ color: '#E2E8F0' }}>$1.5 million</strong> — a sixfold increase over the prior statutory floor. Starting January 1, 2028, the cap adjusts biennially for inflation, so it will never again fall behind the cost of living the way the old cap did.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The increase reflects what Colorado lawmakers acknowledged directly: the old caps had failed to keep pace with the real economic and human cost of catastrophic injuries. A victim who suffered a traumatic brain injury, spinal cord damage, or permanent disfigurement could previously recover only a fraction of what a jury determined their suffering was actually worth.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For <strong style={{ color: '#E2E8F0' }}>medical malpractice</strong> claims, the cap structure is different and phases in more gradually under HB 24-1472. The noneconomic damages cap for med mal is <strong style={{ color: '#E2E8F0' }}>$530,000 for injuries occurring in 2026</strong> (rising from $415,000 in 2025), and it climbs incrementally to $875,000 by 2029, after which it too adjusts for inflation every two years.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In <strong style={{ color: '#E2E8F0' }}>wrongful death</strong> cases arising from medical malpractice, the cap scales from $555,000 in 2025 to $1.575 million by 2029. For general wrongful death actions, HB 24-1472 sets a new cap of $2.125 million, also subject to biennial inflation adjustment from 2028.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>One important development reinforcing these changes came from the Colorado Supreme Court. In <strong style={{ color: '#E2E8F0' }}>Banner Health v. Gresser (23SC959)</strong>, decided October 20, 2025, the court affirmed that when a trial court makes a proper finding of good cause to exceed the Health Care Availability Act&apos;s $1 million total damages cap in a medical malpractice case, the court must rely on the jury&apos;s damages determination rather than substituting its own figure. The ruling secured a judgment exceeding $39 million — now over $50 million with interest — for a child who suffered catastrophic neurological injuries due to medical negligence. While Gresser addresses the HCAA&apos;s separate $1 million total cap rather than the general noneconomic cap, the decision reinforces the principle that jury determinations of damages carry significant legal weight in Colorado courts.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Colorado</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Colorado courts and insurance adjusters use two primary methods to calculate pain and suffering, both of which are available through our <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>multiplier method</strong> is the more commonly used approach. Your total economic damages — medical bills, lost wages, future treatment — are multiplied by a number typically between 1.5 and 5. The multiplier reflects the severity of your injuries. A soft-tissue strain that resolved in six weeks might warrant a 1.5x multiplier. A permanent spinal injury requiring lifetime care could justify a 4x or 5x multiplier. Insurance software such as Colossus, which many Colorado carriers use to evaluate claims, applies its own internal multiplier logic based on injury codes, treatment duration, and medical documentation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The <strong style={{ color: '#E2E8F0' }}>per diem method</strong> assigns a daily dollar value to your pain and assigns that rate for each day you experienced suffering, from the date of injury through maximum medical improvement. For example, if your daily rate is $200 and your recovery lasted 300 days, your per diem pain and suffering figure would be $60,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Neither method produces a guaranteed result. Colorado&apos;s $1.5 million cap places an absolute ceiling on noneconomic recovery regardless of which formula you use, and your actual settlement will depend on the strength of your medical documentation, liability clarity, and the at-fault party&apos;s insurance policy limits.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Colorado Modified Comparative Fault — The 50% Bar</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Colorado uses a <strong style={{ color: '#E2E8F0' }}>modified comparative fault</strong> system with a <strong style={{ color: '#E2E8F0' }}>50% bar</strong>, governed by C.R.S. § 13-21-111. This is an important distinction from the 51% bar used in many other states, and it is stricter than it might first appear.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Under Colorado&apos;s rule, your compensation is reduced in proportion to your share of fault. If a jury finds you were 30% at fault for a car accident in Denver and your total damages are $100,000, you recover $70,000. That is standard comparative fault math.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The 50% bar is where Colorado becomes especially harsh: <strong style={{ color: '#E2E8F0' }}>if you are found to be 50% or more at fault, you recover nothing</strong>. Not a reduced amount — zero. At exactly 50% fault, the bar cuts off your recovery entirely. This differs from 51% bar states, where you can still recover something even at exactly half responsible.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This rule has significant practical consequences in Colorado personal injury claims. Cases involving shared-fault scenarios — such as intersection collisions, premises liability where the injured party may have ignored a warning, or bar fights — carry real risk of hitting the 50% threshold. It also gives Colorado defense attorneys a meaningful litigation tool: arguing comparative fault aggressively in order to push the plaintiff&apos;s percentage to or above the bar.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If any share of fault is likely to be disputed in your case, you should speak with a Colorado personal injury attorney before accepting any settlement offer.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Colorado Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Beyond the cap and the comparative fault calculation, several additional variables shape what a Colorado pain and suffering settlement actually looks like in practice.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Injury severity and permanence</strong> carry the most weight. A permanent injury that affects your ability to work, care for your family, or engage in daily activities supports a higher multiplier and a larger noneconomic award than a short-term soft-tissue injury.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Medical documentation</strong> is critical. Colorado insurers and defense attorneys scrutinize gaps in treatment, delayed care-seeking, and failure to follow physician recommendations. Consistent, well-documented treatment creates the paper trail that supports your damages calculation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Insurance policy limits</strong> are a practical ceiling. Even if your damages exceed $1 million, the at-fault driver&apos;s or business&apos;s liability policy may cap what is collectible without additional litigation steps such as an underinsured motorist claim or a bad-faith action.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue</strong> matters in Colorado. Denver County and Boulder County tend to produce more plaintiff-favorable jury outcomes than rural counties. Cases filed in Denver District Court are generally higher-value environments for serious injury claims.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Colorado Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Colorado uses a <strong style={{ color: '#E2E8F0' }}>bifurcated statute of limitations</strong> for personal injury claims, and the distinction matters.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For <strong style={{ color: '#E2E8F0' }}>general negligence cases</strong> — slip and falls, premises liability, assault, and most other personal injury claims — you have <strong style={{ color: '#E2E8F0' }}>two years</strong> from the date of injury to file suit under C.R.S. § 13-80-102.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For <strong style={{ color: '#E2E8F0' }}>motor vehicle accidents</strong>, Colorado provides a longer window: <strong style={{ color: '#E2E8F0' }}>three years</strong> from the date of the crash under C.R.S. § 13-80-101.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Missing either deadline almost always results in a complete bar to recovery, regardless of how severe your injuries are or how clearly liability falls on the other party. Colorado courts enforce the statute of limitations strictly.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There are limited tolling exceptions — the limitations period may be paused for claims involving minors, legal incapacity, or fraudulent concealment. Colorado also applies a discovery rule in some cases, meaning the clock may start when you reasonably discovered the injury rather than when it occurred, particularly in latent-harm scenarios.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you are unsure which limitation period applies to your specific claim — particularly in cases involving government defendants, product liability, or medical treatment — consult a Colorado personal injury attorney promptly. Waiting does not preserve your rights.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Colorado</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Settlement data in Colorado is not publicly reported in a standardized way, and the concept of an &quot;average&quot; settlement is genuinely misleading in personal injury contexts because case values vary enormously based on injury type, liability clarity, and available insurance coverage. That said, real-world Colorado verdicts and settlements provide useful reference points.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft-tissue car accident claims in Colorado — whiplash, minor back strains — typically settle in the range of $10,000 to $50,000 when the injuries resolved within a few months and medical bills are relatively modest. Moderate injuries with ongoing physical therapy and some lost wages commonly settle in the $75,000 to $250,000 range.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Serious injury cases — herniated discs requiring surgery, shoulder repairs, traumatic brain injuries — can produce settlements and verdicts in the $500,000 to $1.5 million range, particularly in Denver and Boulder where jury pools tend to award more generously. Catastrophic injury cases involving permanent disability, spinal cord damage, or injuries requiring lifelong care have reached seven figures under Colorado&apos;s new $1.5 million noneconomic cap, with economic damages adding substantially to those totals.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The 2025 cap increase means victims with serious permanent injuries who previously would have been limited to recovering $250,000 in noneconomic damages can now pursue their full noneconomic losses up to $1.5 million. That is a structural change in Colorado settlement leverage that benefits plaintiffs significantly.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'co-faq-1',
                  question: 'How is pain and suffering calculated in Colorado?',
                  answer: 'Colorado does not mandate a single calculation method. Attorneys and insurers most commonly use the multiplier method — multiplying your total economic damages by a factor between 1.5 and 5 based on injury severity, duration, and impact on daily life. The per diem method is an alternative that assigns a daily dollar rate to your suffering for each day you experienced it. Insurance carriers in Colorado often use claims management software that applies their own internal multiplier logic. Our free Pain and Suffering Calculator lets you run both methods so you can compare results.',
                  schemaAnswer: 'Colorado does not mandate a single calculation method. Attorneys and insurers most commonly use the multiplier method — multiplying your total economic damages by a factor between 1.5 and 5 based on injury severity, duration, and impact on daily life. The per diem method is an alternative that assigns a daily dollar rate to your suffering for each day you experienced it. Insurance carriers in Colorado often use claims management software that applies their own internal multiplier logic.'
                },
                {
                  id: 'co-faq-2',
                  question: 'What is the noneconomic damage cap in Colorado?',
                  answer: 'For personal injury cases filed on or after January 1, 2025, the noneconomic damage cap in Colorado is $1.5 million under HB 24-1472. Medical malpractice claims are subject to a separate, lower cap that phases in gradually — $530,000 for injuries occurring in 2026, climbing to $875,000 by 2029. The general personal injury cap will be adjusted for inflation every two years starting in 2028.',
                  schemaAnswer: 'For personal injury cases filed on or after January 1, 2025, the noneconomic damage cap in Colorado is $1.5 million under HB 24-1472. Medical malpractice claims are subject to a separate, lower cap that phases in gradually — $530,000 for injuries occurring in 2026, climbing to $875,000 by 2029. The general personal injury cap will be adjusted for inflation every two years starting in 2028.'
                },
                {
                  id: 'co-faq-3',
                  question: 'What changed with Colorado\'s damage cap in 2025?',
                  answer: 'The Colorado General Assembly passed HB 24-1472 in the 2024 legislative session, and Governor Polis signed it into law effective January 1, 2025. The general noneconomic damage cap increased from $250,000 (with a hard-to-obtain $500,000 exception) to $1.5 million — a sixfold increase. The law also substantially increased the wrongful death cap to $2.125 million and began a phased increase of the medical malpractice noneconomic cap from $300,000 to $875,000 by 2029.',
                  schemaAnswer: 'The Colorado General Assembly passed HB 24-1472 in the 2024 legislative session, and Governor Polis signed it into law effective January 1, 2025. The general noneconomic damage cap increased from $250,000 to $1.5 million — a sixfold increase. The law also substantially increased the wrongful death cap to $2.125 million and began a phased increase of the medical malpractice noneconomic cap to $875,000 by 2029.'
                },
                {
                  id: 'co-faq-4',
                  question: 'What is the statute of limitations for personal injury in Colorado?',
                  answer: 'Colorado uses two separate limitations periods. For most personal injury cases — slip and falls, premises liability, general negligence — you have two years from the date of injury. For car and motor vehicle accidents specifically, you have three years from the date of the crash. Missing either deadline will bar your claim entirely in nearly all circumstances. If a government entity is involved, a notice of claim requirement applies on a shorter timeline.',
                  schemaAnswer: 'Colorado uses two separate limitations periods. For most personal injury cases — slip and falls, premises liability, general negligence — you have two years from the date of injury. For car and motor vehicle accidents specifically, you have three years from the date of the crash. Missing either deadline will bar your claim entirely in nearly all circumstances.'
                },
                {
                  id: 'co-faq-5',
                  question: 'Does Colorado use comparative fault, and how does it affect my settlement?',
                  answer: 'Yes. Colorado follows modified comparative fault with a 50% bar under C.R.S. § 13-21-111. Your damages are reduced by your percentage of fault. If you are found 50% or more at fault, you recover nothing — not a reduced amount, but zero. This is stricter than states using the 51% bar. In contested-liability cases, Colorado\'s 50% bar gives defense attorneys a meaningful tool to eliminate your recovery entirely, which makes early legal counsel especially important.',
                  schemaAnswer: 'Yes. Colorado follows modified comparative fault with a 50% bar under C.R.S. § 13-21-111. Your damages are reduced by your percentage of fault. If you are found 50% or more at fault, you recover nothing. This is stricter than states using the 51% bar.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Estimate Your Colorado Pain and Suffering Damages Now</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Colorado&apos;s 2025 cap increase fundamentally changed the compensation available to seriously injured victims in this state. Whether you were injured in a Denver car accident, a Boulder slip and fall, or a workplace incident on the Front Range, your noneconomic damages now have room to reflect what your suffering is actually worth.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to enter your medical expenses, lost wages, and injury details and get an instant estimate using both the multiplier and per diem methods. If you are comparing state rules, see how Colorado&apos;s framework stacks up against the <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Your estimate is a starting point, not a guarantee. A licensed Colorado personal injury attorney can evaluate the specific facts of your case, account for comparative fault exposure, and give you a realistic picture of what your claim is worth.</p>
            </article>
          ) : stateData.slug === 'nevada' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your noneconomic damages under Nevada law. The sections below explain exactly how Nevada courts and insurers calculate pain and suffering, which damage caps apply to your claim, and what affects your final settlement value.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <div data-ad-slot="PS_STATE_AD_TOP" aria-hidden="true" />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Nevada Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Nevada law allows injured victims to recover noneconomic damages for the physical pain, emotional distress, mental anguish, and diminished quality of life caused by another party&apos;s negligence. These damages are separate from economic damages such as medical bills, lost wages, and future care costs.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Unlike some states that impose blanket caps on noneconomic damages across all personal injury claims, Nevada takes a targeted approach. For most personal injury cases — car accidents, slip and falls, premises liability, product liability — there is <strong style={{ color: '#E2E8F0' }}>no statutory cap on pain and suffering</strong>. Juries in Clark County, Washoe County, and across Nevada have broad discretion to award noneconomic damages that reflect the full impact of your injuries on your daily life.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The primary source of law governing these claims is the Nevada Revised Statutes (NRS), particularly NRS Chapter 41, which defines the rights of injured parties in civil actions.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Nevada Damage Caps — Med Mal vs. General PI</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The most important distinction in Nevada damage cap law is the difference between <strong style={{ color: '#E2E8F0' }}>general personal injury claims</strong> and <strong style={{ color: '#E2E8F0' }}>medical malpractice claims</strong>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For general personal injury cases — including car accidents, truck accidents, tourist injuries on the Las Vegas Strip, and premises liability claims — Nevada imposes no cap on noneconomic damages. A jury can award whatever amount it determines is fair compensation for your pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Medical malpractice claims operate under a separate and stricter framework. Under NRS 41A.035, Nevada caps noneconomic damages in med mal cases on a graduated scale. For 2026, the cap is <strong style={{ color: '#E2E8F0' }}>$590,000</strong>. That figure increases by $80,000 per year until it reaches $750,000 in 2028. After 2028, the cap adjusts annually at <strong style={{ color: '#E2E8F0' }}>2.1% per year</strong> indexed to inflation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injury resulted from a healthcare provider&apos;s negligence — a surgical error, misdiagnosis, or medication mistake — your pain and suffering recovery is subject to this cap regardless of how severe your injuries are. If your injury occurred in a non-medical context, the cap does not apply.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Punitive damages in Nevada are subject to separate limits under NRS 42.005. If the compensatory damages award exceeds $100,000, punitive damages are capped at three times the compensatory award. If compensatory damages are $100,000 or less, the punitive cap is a flat $300,000.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Nevada</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Nevada does not mandate a single calculation method for pain and suffering. In practice, attorneys and insurance adjusters use two primary approaches, both of which you can model using our guide on <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link>.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The multiplier method</strong> is the most widely used approach in Nevada. Your total economic damages — medical expenses, lost income, future treatment costs — are multiplied by a factor between 1.5 and 5. The multiplier reflects injury severity, recovery duration, and the permanence of any disability. A soft tissue injury with full recovery might draw a 1.5 multiplier. A spinal cord injury requiring lifelong care could justify a 4 or 5 multiplier.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For example, if you sustained a herniated disc with $60,000 in medical expenses and $20,000 in lost wages, your economic damages total $80,000. Applying a 3x multiplier produces a pain and suffering estimate of $240,000, for a total claim value of $320,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>The per diem method</strong> assigns a daily dollar value to your pain — often equal to your daily wage — and multiplies it by the number of days you suffered. This method works best for injuries with a clear recovery endpoint.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance carriers that handle Nevada claims also run values through Colossus and similar claims software, which weight treatment type, injury codes, and documentation quality. Strong medical records from consistent treatment will always produce a higher software-generated value than gaps in care.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <div data-ad-slot="PS_STATE_AD_MID" aria-hidden="true" />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Nevada Modified Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Nevada follows a <strong style={{ color: '#E2E8F0' }}>modified comparative fault system with a 51% bar</strong>, codified in NRS 41.141. Under this rule, your compensation is reduced by your percentage of fault for the accident. If you are found 30% at fault for a car accident, a $100,000 award is reduced to $70,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The 51% bar means that if you are found to be <strong style={{ color: '#E2E8F0' }}>51% or more at fault</strong>, you recover nothing. This is a hard cutoff — not a sliding scale beyond that threshold. Nevada applies this rule to all parties in multi-defendant cases as well, allocating fault among all responsible parties including the plaintiff.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Las Vegas specifically, comparative fault arguments are common in tourist injury claims involving casino premises, hotel pools, rideshare vehicles, and pedestrian accidents on the Strip. Property owners and their insurers routinely argue that tourists were distracted, intoxicated, or failed to observe obvious hazards. Documenting the scene, the hazard, and your own conduct at the time of injury is critical to protecting your comparative fault percentage.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Nevada Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several factors specific to Nevada&apos;s legal and economic environment directly influence pain and suffering settlement values.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Venue</strong> matters significantly. Clark County (Las Vegas) juries have a reputation for awarding higher verdicts in serious injury cases than rural Nevada counties. Attorneys filing in Clark County often achieve better results in cases involving catastrophic injury, particularly when the defendant is a large commercial entity like a casino, hotel chain, or rideshare company.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Tourist and commercial injury claims</strong> are a distinctive category in Nevada. The Las Vegas Strip generates a high volume of premises liability, dram shop liability, and negligent security claims. These defendants typically carry substantial commercial insurance policies, which supports higher settlement values compared to individual-defendant claims.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Insurance policy limits</strong> remain the practical ceiling in most cases. Even a well-documented claim with strong pain and suffering support will be bounded by what the at-fault party&apos;s insurer will pay under available coverage. Underinsured motorist (UIM) coverage from your own policy becomes critical in Nevada car accident cases where the at-fault driver carries minimum limits.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}><strong style={{ color: '#E2E8F0' }}>Injury documentation</strong> — consistent medical treatment, specialist referrals, imaging studies, and mental health records — is the single most controllable factor in increasing your settlement value.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Nevada Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Under NRS 11.190(4)(e), Nevada imposes a <strong style={{ color: '#E2E8F0' }}>2-year statute of limitations</strong> on personal injury claims. The clock starts on the date of the accident or, in some cases, the date you discovered the injury. Missing this deadline permanently bars your claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Medical malpractice claims carry the same 2-year period but apply a discovery rule — the clock begins when you discovered or reasonably should have discovered the negligence, subject to an outer limit.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Claims against <strong style={{ color: '#E2E8F0' }}>Nevada government entities</strong> operate under a separate and shorter deadline. Under NRS 41.036, you must file a written notice of claim with the relevant government agency within <strong style={{ color: '#E2E8F0' }}>6 months</strong> of the injury before you can file a lawsuit. Failing to submit this notice on time destroys your right to sue the government — it is not a soft deadline. This applies to injuries on public property, accidents involving government vehicles, and claims against state or county agencies.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If your injury involves any government-owned property, facility, or vehicle — including Clark County School District premises, Nevada DOT road conditions, or a city-operated bus — treat the 6-month notice deadline as your primary filing date.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Nevada</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Settlement values in Nevada vary widely based on injury type, liability clarity, available insurance, and venue. The figures below reflect general market ranges observed in Nevada personal injury cases and are not guarantees of any individual outcome.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Soft tissue injuries — sprains, strains, and whiplash — with full recovery typically resolve in the $10,000 to $50,000 range for pain and suffering. Moderate injuries requiring surgery, such as a herniated disc with discectomy or a fractured bone with hardware, commonly produce pain and suffering awards between $75,000 and $200,000.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Severe injuries with permanent impairment — traumatic brain injuries, spinal cord injuries, and amputations — routinely produce noneconomic awards exceeding $500,000, particularly in Clark County. Wrongful death claims in Nevada can produce multi-million-dollar pain and suffering awards for surviving family members.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Las Vegas premises liability cases against large commercial defendants — casinos, hotels, entertainment venues — often resolve at the higher end of applicable ranges given the institutional defendants&apos; policy limits and reputational sensitivity to litigation.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>For context on how Nevada compares to neighboring states, see our <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link>.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <div data-ad-slot="PS_STATE_AD_BOTTOM" aria-hidden="true" />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'nv-faq-1',
                  question: 'How is pain and suffering calculated in Nevada?',
                  answer: 'Nevada uses two primary methods. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5, depending on injury severity and permanence. The per diem method assigns a daily dollar value to your suffering and multiplies it by the number of days affected. Insurance carriers also use claims software like Colossus to generate internal valuations. Both methods reward thorough, consistent medical documentation.',
                  schemaAnswer: 'Nevada uses two primary methods. The multiplier method multiplies your total economic damages by a factor between 1.5 and 5, depending on injury severity and permanence. The per diem method assigns a daily dollar value to your suffering and multiplies it by the number of days affected. Insurance carriers also use claims software like Colossus to generate internal valuations. Both methods reward thorough, consistent medical documentation.'
                },
                {
                  id: 'nv-faq-2',
                  question: 'Is there a cap on pain and suffering in Nevada?',
                  answer: 'It depends on the type of claim. For general personal injury cases — car accidents, slip and falls, premises liability — Nevada has no cap on noneconomic damages. For medical malpractice claims, Nevada caps noneconomic damages at $590,000 in 2026, rising to $750,000 by 2028 and then indexed annually at 2.1%.',
                  schemaAnswer: 'It depends on the type of claim. For general personal injury cases — car accidents, slip and falls, premises liability — Nevada has no cap on noneconomic damages. For medical malpractice claims, Nevada caps noneconomic damages at $590,000 in 2026, rising to $750,000 by 2028 and then indexed annually at 2.1%.'
                },
                {
                  id: 'nv-faq-3',
                  question: 'What is the Nevada med mal noneconomic cap for 2026?',
                  answer: 'The Nevada medical malpractice noneconomic damages cap is $590,000 for 2026 under NRS 41A.035. The cap increases by $80,000 per year until it reaches $750,000 in 2028, after which it adjusts annually at a 2.1% rate.',
                  schemaAnswer: 'The Nevada medical malpractice noneconomic damages cap is $590,000 for 2026 under NRS 41A.035. The cap increases by $80,000 per year until it reaches $750,000 in 2028, after which it adjusts annually at a 2.1% rate.'
                },
                {
                  id: 'nv-faq-4',
                  question: 'What is the statute of limitations for personal injury in Nevada?',
                  answer: 'Two years from the date of injury for most personal injury claims under NRS 11.190(4)(e). Claims against government entities require a written notice of claim within 6 months of the injury before a lawsuit can be filed. Both deadlines are absolute — missing either one permanently ends your case.',
                  schemaAnswer: 'Two years from the date of injury for most personal injury claims under NRS 11.190(4)(e). Claims against government entities require a written notice of claim within 6 months of the injury before a lawsuit can be filed. Both deadlines are absolute — missing either one permanently ends your case.'
                },
                {
                  id: 'nv-faq-5',
                  question: 'What is Nevada\'s comparative fault rule?',
                  answer: 'Nevada uses modified comparative fault with a 51% bar under NRS 41.141. Your damages are reduced by your percentage of fault. If you are found 51% or more at fault, you recover nothing. This rule applies to all civil personal injury claims including car accidents, premises liability, and product liability.',
                  schemaAnswer: 'Nevada uses modified comparative fault with a 51% bar under NRS 41.141. Your damages are reduced by your percentage of fault. If you are found 51% or more at fault, you recover nothing. This rule applies to all civil personal injury claims including car accidents, premises liability, and product liability.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Use the Nevada Pain and Suffering Calculator</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Nevada law gives you the right to recover full noneconomic damages in most personal injury cases — but calculating a credible number before you negotiate matters. Insurance adjusters start low. Knowing your documented range gives you the leverage to counter effectively.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> now to run both the multiplier and per diem methods against your actual medical expenses and lost wages. The estimate is free, takes under two minutes, and gives you a defensible starting point for your Nevada personal injury claim.</p>
            </article>
          ) : stateData.slug === 'arizona' ? (
            <article style={{ margin: '0 auto' }}>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>If you were injured in Arizona due to someone else&apos;s negligence, you may be entitled to pain and suffering damages on top of your medical bills and lost wages. Arizona is one of the most plaintiff-friendly states in the country — it has no cap on noneconomic damages and applies pure comparative fault, meaning you can recover compensation even if you were partially at fault. Use our free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to estimate your claim, then read on to understand exactly how Arizona law shapes your settlement.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Pain and suffering is not a fixed dollar amount. What you recover depends on your injury severity, your treatment record, the at-fault party&apos;s insurance limits, and the legal rules specific to Arizona. This page explains each of those factors in plain terms so you know what to expect before you negotiate or accept any offer.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Pain and Suffering Damages Under Arizona Law</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>In Arizona, personal injury victims can recover two categories of damages. Economic damages cover your measurable financial losses — medical bills, rehabilitation costs, future medical expenses, and lost income. Noneconomic damages cover everything else: physical pain, emotional distress, anxiety, loss of enjoyment of life, disfigurement, and loss of consortium.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Arizona law imposes no statutory cap on noneconomic damages. The Arizona Constitution explicitly prohibits the legislature from limiting damages in personal injury and wrongful death cases. This is a critical distinction from states like Texas, where noneconomic damages in some cases are capped at $250,000. In Arizona, your pain and suffering award is limited only by what the evidence supports and what a jury is willing to award. High-value claims involving catastrophic injuries, permanent disability, or severe disfigurement have resulted in multimillion-dollar noneconomic awards in Maricopa County and Pima County courts.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Arizona Pure Comparative Fault</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Arizona follows the doctrine of pure comparative fault under Arizona Revised Statutes Section 12-2505. Under this rule, your compensation is reduced by your percentage of fault — but you are never completely barred from recovery, regardless of how much of the accident was your fault.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>This is a significant advantage over states that use modified comparative fault. In Texas and most other states, if you are found 51 percent or more at fault, you collect nothing. In Arizona, a plaintiff who is 90 percent at fault can still recover 10 percent of their total damages. A plaintiff who is 30 percent at fault recovers 70 percent of their damages.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>As a practical example: if your total damages — including pain and suffering — are calculated at $150,000 and you are found 25 percent responsible for the accident, your net recovery is $112,500.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Insurance adjusters know this rule and will often argue elevated fault percentages specifically to reduce their payout. If an adjuster claims you share significant fault, that is not a reason to drop the claim — it is a reason to document your case more carefully and push back with evidence. Understanding <Link href="/pain-and-suffering-calculator/guide/" style={{ color: '#60A5FA' }}>how pain and suffering is calculated</Link> before you negotiate gives you an objective baseline to measure any offer against.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>How Pain and Suffering Is Calculated in Arizona</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Arizona personal injury attorneys and insurance carriers use two primary methods to calculate pain and suffering.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The multiplier method takes your total economic damages and multiplies them by a number between 1.5 and 5. The multiplier reflects the severity of your injury. A soft-tissue whiplash injury with a short recovery period typically draws a multiplier between 1.5 and 2.5. A traumatic brain injury, spinal cord injury, or permanent impairment can support multipliers of 4 or 5 — and in catastrophic cases, even higher. Insurance carriers in Arizona frequently use Colossus software to generate initial settlement offers. Colossus applies its own multipliers based on injury codes, treatment duration, and medical provider documentation. Knowing this, consistent and well-documented medical treatment significantly increases the calculated value of your claim.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The per diem method assigns a daily dollar rate to your pain — often your daily wages — and multiplies it by the number of days you suffered. This method is more persuasive for injuries with a clear endpoint and a well-documented recovery timeline.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Most Arizona attorneys use the multiplier method as the primary framework, with per diem as a supporting argument in front of juries.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Factors That Affect Arizona Settlements</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Several variables determine where your final settlement lands within the range your formula suggests.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>The severity and permanence of your injury carries the most weight. Permanent scarring, chronic pain, spinal damage, or traumatic brain injury all push settlements toward the higher end. Medical documentation quality matters just as much — gaps in treatment or inconsistent records give adjusters leverage to reduce your multiplier. The defendant&apos;s insurance policy limits act as a practical ceiling in most cases, regardless of what your damages calculate to. Attorney representation consistently produces higher settlements; Arizona plaintiff attorneys in Phoenix and Tucson are aggressive negotiators familiar with local jury tendencies. Finally, Arizona&apos;s several liability rule means that if multiple defendants are involved, each one is only responsible for their own percentage of fault — not the full judgment — which can complicate collection in multi-party cases.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Arizona Statute of Limitations</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>You have two years from the date of your injury to file a personal injury lawsuit in Arizona. This deadline is set by Arizona Revised Statutes Section 12-542 and it applies to most personal injury claims including car accidents, slip and fall cases, and dog bites.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Missing this deadline almost certainly means your case is dismissed and you lose the right to recover permanently. There are narrow exceptions. If the injured person is a minor, the two-year clock typically does not begin until they turn 18. If the defendant&apos;s identity was not immediately known — in hit-and-run accidents, for example — the discovery rule may toll the deadline. Claims against government entities in Arizona require a notice of claim filed within 180 days of the injury, which is an even shorter window that catches many injured people off guard.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Do not wait to get an estimate of your claim. Use the <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> now and consult an attorney well before the deadline approaches.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Average Pain and Suffering Settlements in Arizona</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>There is no published average for pain and suffering settlements in Arizona because most settlements are private. That said, attorneys and claims data suggest general ranges by injury category.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Minor soft-tissue injuries — strains, sprains, whiplash without structural damage — typically settle in the range of $5,000 to $35,000 in total damages, with pain and suffering representing a portion of that. Moderate injuries involving herniated discs, fractures, or surgeries commonly settle between $50,000 and $200,000. Serious injuries with permanent impairment, chronic pain, or significant loss of function regularly produce settlements above $200,000, and catastrophic cases in Maricopa County have resulted in verdicts and settlements exceeding $1 million.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Arizona&apos;s plaintiff-friendly legal environment — no damage caps, pure comparative fault, and an active plaintiff bar in Phoenix and Tucson — means settlements here tend to run higher than in comparable states. For a state-by-state comparison, review the <Link href="/pain-and-suffering-calculator/california/" style={{ color: '#60A5FA' }}>California pain and suffering calculator</Link> page, which uses a different fault framework and shows how legal rules shift settlement values.</p>

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={[
                {
                  id: 'az-faq-1',
                  question: 'How is pain and suffering calculated in Arizona?',
                  answer: 'Arizona attorneys use two methods. The multiplier method multiplies your total medical bills and economic losses by a factor of 1.5 to 5 based on injury severity. The per diem method assigns a daily dollar value to your suffering and multiplies it by recovery days. Most Arizona claims use the multiplier method, and insurance software like Colossus applies its own version of this formula during the adjuster\'s evaluation.',
                  schemaAnswer: 'Arizona attorneys use two methods. The multiplier method multiplies your total medical bills and economic losses by a factor of 1.5 to 5 based on injury severity. The per diem method assigns a daily dollar value to your suffering and multiplies it by recovery days. Most Arizona claims use the multiplier method, and insurance software like Colossus applies its own version of this formula during the adjuster\'s evaluation.'
                },
                {
                  id: 'az-faq-2',
                  question: 'Is there a cap on pain and suffering in Arizona?',
                  answer: 'No. Arizona\'s constitution prohibits the legislature from capping damages in personal injury or wrongful death cases. There is no limit on noneconomic damages — including pain and suffering — in Arizona. This makes Arizona one of the most favorable states in the country for personal injury plaintiffs with serious injuries.',
                  schemaAnswer: 'No. Arizona\'s constitution prohibits the legislature from capping damages in personal injury or wrongful death cases. There is no limit on noneconomic damages — including pain and suffering — in Arizona. This makes Arizona one of the most favorable states in the country for personal injury plaintiffs with serious injuries.'
                },
                {
                  id: 'az-faq-3',
                  question: 'What is pure comparative fault in Arizona?',
                  answer: 'Pure comparative fault under ARS 12-2505 means your compensation is reduced by your percentage of fault, but you are never barred from recovering — no matter how high your fault percentage is. If you are 80 percent at fault and your damages total $100,000, you still recover $20,000. This is more favorable to plaintiffs than the modified comparative fault rules used in most other states.',
                  schemaAnswer: 'Pure comparative fault under ARS 12-2505 means your compensation is reduced by your percentage of fault, but you are never barred from recovering — no matter how high your fault percentage is. If you are 80 percent at fault and your damages total $100,000, you still recover $20,000. This is more favorable to plaintiffs than the modified comparative fault rules used in most other states.'
                },
                {
                  id: 'az-faq-4',
                  question: 'What is the statute of limitations for personal injury in Arizona?',
                  answer: 'Two years from the date of the injury under ARS 12-542. Claims against government entities require a notice of claim filed within 180 days — significantly shorter. Minors generally have until two years after their 18th birthday. Missing the deadline almost always means you cannot recover anything, so consult an attorney as early as possible.',
                  schemaAnswer: 'Two years from the date of the injury under ARS 12-542. Claims against government entities require a notice of claim filed within 180 days — significantly shorter. Minors generally have until two years after their 18th birthday. Missing the deadline almost always means you cannot recover anything, so consult an attorney as early as possible.'
                },
                {
                  id: 'az-faq-5',
                  question: 'What are average pain and suffering settlements in Arizona?',
                  answer: 'Soft-tissue injuries typically produce total settlements in the $5,000–$35,000 range. Moderate injuries with surgery or structural damage commonly settle between $50,000 and $200,000. Catastrophic or permanently disabling injuries regularly exceed $200,000, and high-value cases in Maricopa County have resulted in seven-figure recoveries. The actual value of your claim depends on your specific injuries, medical documentation, and the defendant\'s available insurance coverage.',
                  schemaAnswer: 'Soft-tissue injuries typically produce total settlements in the $5,000–$35,000 range. Moderate injuries with surgery or structural damage commonly settle between $50,000 and $200,000. Catastrophic or permanently disabling injuries regularly exceed $200,000, and high-value cases in Maricopa County have resulted in seven-figure recoveries. The actual value of your claim depends on your specific injuries, medical documentation, and the defendant\'s available insurance coverage.'
                }
              ]} />

              <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' }} />

              <h2 className="heading-gradient" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}>Estimate Your Arizona Pain and Suffering Damages</h2>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Arizona law gives injured victims significant legal protections — no damage caps, full recovery under pure comparative fault, and a two-year window to pursue your claim. What you recover still depends on how well you document your injuries and how accurately you understand the value of your claim before you negotiate.</p>
              <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>Use the free <Link href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> to run your numbers using both the multiplier method and the per diem method. Enter your medical expenses, select your injury severity, and get an immediate estimate of your noneconomic damages under Arizona law. The calculator is free, takes under two minutes, and gives you the objective baseline you need before any conversation with an adjuster or attorney.</p>
            </article>
          ) : (

            <>
              {/* ── EDITORIAL ── */}
              <article className="mt-14 max-w-3xl" aria-label={`Pain and suffering damages guide for ${stateData.name}`}>
                <h2 className="heading-gradient mb-5" style={{ fontSize: 26, fontWeight: 700 }}>
                  Pain &amp; Suffering Damages in {stateData.name}
                </h2>
                <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  <p>
                    In {stateData.name}, pain and suffering damages are classified as{' '}
                    <strong style={{ color: '#E2E8F0' }}>non-economic damages</strong> — compensation for
                    physical pain, emotional distress, and diminished quality of life.
                    {stateData.hasDamageCap
                      ? ` ${stateData.name} limits these damages: ${stateData.damageCapNotes}`
                      : ` ${stateData.name} places no statutory cap on non-economic damages for general personal injury cases.`}
                  </p>
                  <p>
                    {stateData.faultRuleExplanation}
                    {stateData.faultRule === 'contributory'
                      ? ` Because ${stateData.name} uses contributory negligence, even minor shared fault can bar your recovery entirely — making legal representation especially important.`
                      : stateData.faultRule === 'pure-comparative'
                      ? ` ${stateData.name}'s pure comparative fault rule is one of the most plaintiff-friendly in the country.`
                      : ` If you are found more than 50% at fault, you will not be able to recover any damages under ${stateData.name} law.`}
                  </p>
                  <p>
                    You have{' '}
                    <strong style={{ color: '#E2E8F0' }}>
                      {stateData.statuteOfLimitations} year{stateData.statuteOfLimitations !== 1 ? 's' : ''}
                    </strong>{' '}
                    from the date of your injury to file a personal injury lawsuit in {stateData.name}.{' '}
                    {stateData.solNotes} Missing this deadline permanently bars your claim.
                  </p>
                </div>
              </article>

              {/* ── FAQ ── */}
              <section className="mt-10 max-w-3xl" aria-label={`${stateData.name} pain and suffering FAQs`}>
                <h2 className="heading-gradient mb-6" style={{ fontSize: 24, fontWeight: 700 }}>
                  {stateData.name} Pain &amp; Suffering — FAQs
                </h2>
                {/* FAQAccordion uses .faq-question / .faq-answer classes for guaranteed text visibility */}
                <FAQAccordion faqs={faqs} />
              </section>
            </>
          )}

          <div className="w-full">
            <DisclaimerBanner variant="footer" stateName={stateData.name} />
          </div>
        </div>
      </main>
    </>
  )
}
