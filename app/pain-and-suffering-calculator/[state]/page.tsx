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
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(96,165,250,0.07)',
                  border: '1px solid rgba(96,165,250,0.22)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h2 className="text-sm font-bold mb-1.5" style={{ color: '#93C5FD' }}>
                  Free {stateData.name} Case Review
                </h2>
                <p className="text-xs leading-snug mb-4" style={{ color: '#60A5FA' }}>
                  {stateData.name} personal injury attorneys work on contingency — no fees unless you win.
                </p>
                <div
                  id="AFFILIATE_CTA_SIDEBAR"
                  className="btn-primary w-full rounded-xl text-xs font-semibold py-2.5 px-4 text-center cursor-default"
                >
                  Find a {stateData.name} Attorney →
                </div>
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
