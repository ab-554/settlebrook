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

  const canonicalUrl = `https://settlebrook.com/pain-and-suffering-calculator/${stateData.slug}/`

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
          url: 'https://settlebrook.com/og-image.png',
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
      images: ['https://settlebrook.com/og-image.png'],
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
  const canonicalUrl   = `https://settlebrook.com/pain-and-suffering-calculator/${stateData.slug}/`

  // FIX M5: datePublished + dateModified added to WebApplication schema
  const webApplicationSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: `${stateData.name} Pain & Suffering Calculator`,
    url: canonicalUrl, description: stateData.metaDescription,
    applicationCategory: 'FinanceApplication', operatingSystem: 'Web',
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Settlebrook', url: 'https://settlebrook.com' },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlebrook.com/' },
      { '@type': 'ListItem', position: 2, name: 'Pain & Suffering Calculator', item: 'https://settlebrook.com/pain-and-suffering-calculator/' },
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
        <header style={{ backgroundColor: '#0D1526', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
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
