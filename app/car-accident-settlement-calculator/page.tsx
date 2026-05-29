// ─────────────────────────────────────────────────────────────────────────────
// app/car-accident-settlement-calculator/page.tsx
// Tool #2 — full production page replacing the previous stub.
// Structure mirrors pain-and-suffering-calculator/page.tsx exactly:
//   • Full metadata (OG, Twitter, canonical, robots)
//   • Three JSON-LD schemas: WebApplication, FAQPage, BreadcrumbList
//   • Hero header with H1, subheading, trust badges, and breadcrumb
//   • Two-column layout: CarAccidentCalculator on left, sidebar on right
//   • Editorial content section (car-accident-specific)
//   • FAQ accordion driven by carAccidentFaqs.ts
//   • 14-state grid linking to /car-accident-settlement-calculator/[state]/
//   • DisclaimerBanner footer variant
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import CarAccidentCalculator from '@/components/calculator/CarAccidentCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { getCarAccidentFAQs, buildFAQSchema } from '@/lib/data/carAccidentFaqs'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // 47 chars → 60 total with "| Settlebrook" template ✓
  title: 'Car Accident Settlement Calculator — Free Tool',
  description:
    'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value instantly.',
  alternates: { canonical: 'https://settlebrook.com/car-accident-settlement-calculator/' },
  openGraph: {
    title: 'Car Accident Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value instantly.',
    url: 'https://settlebrook.com/car-accident-settlement-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://settlebrook.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Car Accident Settlement Calculator — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@settlebrook',
    title: 'Car Accident Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free car accident settlement calculator. Estimate medical bills, lost wages, vehicle damage, and pain and suffering. Instant results — no signup.',
    images: ['https://settlebrook.com/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// ─── Static data ──────────────────────────────────────────────────────────────

const faqs = getCarAccidentFAQs()

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Accident Settlement Calculator',
  url: 'https://settlebrook.com/car-accident-settlement-calculator/',
  description:
    'Free online calculator that estimates car accident settlement values including economic damages, pain and suffering, vehicle damage, and fault reduction.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
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
  ],
}

const faqSchema = buildFAQSchema(faqs)

// ─── Sidebar glassmorphism card wrapper ───────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarAccidentCalculatorPage() {
  return (
    <>
      {/* ── JSON-LD schemas ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER ── */}
        <header style={{ backgroundColor: '#0D1526', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Car Accident Settlement Calculator', href: '/car-accident-settlement-calculator/' },
            ]} />
            <div className="mt-4">
              {/* H1 — primary keyword "car accident settlement calculator" ✓ */}
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}
              >
                Car Accident Settlement Calculator
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your total car accident settlement including{' '}
                <strong style={{ color: '#E2E8F0' }}>vehicle damage</strong>,{' '}
                <strong style={{ color: '#E2E8F0' }}>medical bills</strong>,{' '}
                <strong style={{ color: '#E2E8F0' }}>lost wages</strong>, and{' '}
                <strong style={{ color: '#E2E8F0' }}>pain and suffering</strong>.
                Free, instant, covers all 50 states.
              </p>
            </div>
            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {[
                'No Signup Required',
                'No Personal Data Collected',
                'Updated for 2026 State Laws',
                'Instant Results',
              ].map((signal) => (
                <span key={signal} className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
                  <span style={{ color: '#34D399' }} className="font-bold">✓</span>
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Calculator — left column */}
            <div className="w-full lg:flex-1 min-w-0 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>
              <CarAccidentCalculator />
            </div>

            {/* Sidebar — right column */}
            <aside aria-label="Related information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              {/* How it works */}
              <SideCard>
                <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                  How This Calculator Works
                </h2>
                <div className="flex flex-col gap-3" style={{ color: '#94A3B8' }}>
                  {[
                    'Enter medical bills, lost wages, vehicle damage, and other economic damages.',
                    'Choose your injury severity level and calculation method.',
                    'Optionally enter the at-fault driver\'s policy limit to see a warning if your estimate exceeds it.',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-2.5 text-sm">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', color: '#fff' }}
                      >
                        {i + 1}
                      </span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </SideCard>

              {/* Guide CTA */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  How Are Car Accident Settlements Calculated?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Learn exactly how insurance companies value car accident claims — multiplier method, per diem method, policy limits, and what raises or lowers your number.
                </p>
                <Link
                  href="/pain-and-suffering-calculator/guide/"
                  style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}
                >
                  Read the Complete Guide →
                </Link>
              </div>

              {/* State links — Tier 1 launch states (CA and TX) */}
              <nav aria-label="State-specific car accident settlement calculators">
                <SideCard>
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                    Calculator by State
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {CAR_ACCIDENT_STATES.filter((s) => s.slug === 'california' || s.slug === 'texas').map((state) => (
                      <li key={state.slug}>
                        <Link
                          href={`/car-accident-settlement-calculator/${state.slug}/`}
                          className="flex items-center justify-between text-sm py-0.5 transition-colors hover:opacity-80"
                          style={{ color: '#60A5FA' }}
                        >
                          <span>{state.name}</span>
                          <span style={{ color: 'rgba(99,179,237,0.35)', fontSize: 11 }}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SideCard>
              </nav>

              {/* Other calculators */}
              <nav aria-label="Other settlement calculators">
                <SideCard>
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                    Other Free Calculators
                  </h2>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/pain-and-suffering-calculator/" className="flex flex-col gap-0.5 group">
                        <span className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                          Pain &amp; Suffering Calculator
                        </span>
                        <span className="text-xs" style={{ color: '#475569' }}>Estimate non-economic damages by method</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/workers-comp-settlement-calculator/" className="flex flex-col gap-0.5 group">
                        <span className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                          Workers Comp Settlement Calculator
                        </span>
                        <span className="text-xs" style={{ color: '#475569' }}>Estimate your workplace injury settlement</span>
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>

            </aside>
          </div>

          {/* ── EDITORIAL CONTENT ── */}
          <article style={{ margin: '0 auto' }}>
            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              What You Need to Know Before Settling Your Car Accident Claim
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              A car accident can reshape your finances overnight. Medical bills start piling up before you even know the full extent of your injuries. The other driver&apos;s insurance company calls quickly — often within days — with a recorded statement request and sometimes a preliminary offer. That offer is rarely the right number. It&apos;s designed to close the file before you fully understand what you&apos;re owed.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              This calculator gives you a grounded, formula-driven estimate of your total claim value before you sign anything. It uses the same multiplier method that insurance adjusters and plaintiff attorneys apply to car accident claims nationwide. The math is transparent, the inputs are yours, and the result is a realistic starting point for negotiation — not a number pulled from a settlement mill.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              What a Car Accident Settlement Actually Covers
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Car accident claims have more moving parts than most personal injury cases because they combine two categories of loss that are calculated differently.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Economic damages</strong> are the concrete, documented losses: every medical bill from the ER, every follow-up visit, every physical therapy session, every prescription. Add to that any wages you lost while you were recovering, any earning capacity you&apos;ve permanently lost, and the cost to repair or replace your vehicle. These are provable with receipts and records, and they form the foundation of your claim.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Non-economic damages</strong> — pain and suffering — sit on top of that foundation. They compensate for the physical pain, the sleepless nights, the anxiety about recovery, the hobbies you can&apos;t participate in, and the ways your relationships have changed. These don&apos;t come with a receipt, but they are legally recoverable and often make up the larger portion of a settlement.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              What sets car accident claims apart from other personal injury cases is the addition of <strong style={{ color: '#E2E8F0' }}>property damage</strong> — your vehicle. In most states, the at-fault driver&apos;s liability insurance covers your property damage separately from your bodily injury claim, but the total exposure to that insurer includes both. That&apos;s why understanding the relationship between your vehicle damage and the at-fault driver&apos;s policy limit matters: a $30,000 repair on a high-value car can eat significantly into a modest policy before your medical damages are even addressed.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              How the Multiplier Method Works for Car Accident Claims
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              The multiplier method is the industry standard for calculating pain and suffering in car accident cases. Here&apos;s exactly how it works.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              First, you sum your medical damages and lost income — but not vehicle damage. Property damage is included in your total economic damages, but it is excluded from the multiplier base. The reasoning is sound: multiplying your vehicle repair cost by a pain and suffering factor doesn&apos;t make legal sense, because a dented car doesn&apos;t cause you physical pain. The multiplier applies only to the human cost of the accident.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Next, you select a multiplier based on injury severity. Minor soft tissue injuries that resolve fully within a few months typically use 1.5x. Fractures, sprains requiring several months of treatment, and injuries with near-full recovery use 2.5x. Cases requiring surgery, with 12 or more months of recovery and some permanent effects, use 3.5x. Significant permanent injuries use 4.5x. Catastrophic injuries — paralysis, traumatic brain injury, permanent total disability — use 5x.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Multiply the medical/wage base by your multiplier to get the pain and suffering figure. Add your vehicle damage and all other economic damages back in. Apply any fault reduction. That&apos;s your total estimated settlement.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              As a concrete example: you were rear-ended and sustained a herniated disc requiring epidural injections and four months of physical therapy. Medical bills: $24,000. Lost wages: $8,500. Vehicle damage: $7,200. Multiplier base (medical + wages only): $32,500. At a 3.5x multiplier for a serious injury, pain and suffering is $113,750. Add vehicle damage and you get total economic damages of $39,700. Total claim estimate: $153,450. If you were 10% at fault, the adjusted total is $138,105.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Insurance Policy Limits and Your Settlement
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Policy limits are one of the most important — and least understood — constraints on car accident settlements. Your calculated settlement value represents what your claim is theoretically worth. The at-fault driver&apos;s liability policy limit represents the ceiling the insurer will pay.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Most states require only modest minimum liability coverage. In Texas, that&apos;s 30/60/25 — meaning $30,000 per person, $60,000 per accident, and $25,000 for property damage. In California it&apos;s 15/30/5. These minimums were set decades ago and have not kept pace with rising medical costs. A single hospitalization can exceed $30,000 easily.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              When your calculated settlement exceeds the at-fault driver&apos;s policy limit, you have practical options. Underinsured Motorist (UIM) coverage on your own policy is specifically designed to bridge this gap — it pays the difference between the at-fault driver&apos;s limit and your actual damages, up to your UIM limit. If you have UIM coverage, your own insurer steps in and you negotiate with them instead.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Enter the at-fault driver&apos;s policy limit in this calculator to see whether your estimate exceeds it. The calculation itself doesn&apos;t change — the limit is purely advisory — but the warning tells you whether you need to think about UIM, personal liability, or other recovery strategies.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Car Accident Settlement Examples
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              These examples illustrate how the formula produces different results at different injury levels. They are not guarantees — every case is unique.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Scenario 1 — Minor: Rear-end collision, soft tissue injury.</strong> You&apos;re stopped at a red light and hit from behind. Whiplash, cervical strain, six weeks of chiropractic care. Medical bills: $5,200. Lost wages: $1,800. Vehicle damage: $4,500. Multiplier base: $7,000. At 1.5x: pain and suffering $10,500. Total economic damages: $11,500. Adjusted total: $22,000 before fault reduction.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Scenario 2 — Moderate: T-bone collision, shoulder fracture.</strong> You&apos;re hit crossing an intersection. Rotator cuff tear, surgery, five months of physical therapy, near-full recovery. Medical bills: $38,000. Lost wages: $12,000. Vehicle damage: $9,500. Multiplier base: $50,000. At 3.0x: pain and suffering $150,000. Total economic damages: $59,500. Adjusted total: $209,500 before fault reduction.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Scenario 3 — Severe: Head-on collision, spinal cord injury.</strong> Another driver crosses the centerline. Fractured vertebra, spinal cord damage, permanent partial paralysis. Medical bills: $185,000. Future medical costs: $250,000. Lost wages: $45,000. Future lost earnings: $320,000. Vehicle loss: $28,000. Multiplier base: $800,000. At 4.5x: pain and suffering $3,600,000. Total claim value well over $4,000,000 — and almost certainly subject to policy limits that will cap actual recovery.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Get Your Estimate Now
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              The at-fault driver&apos;s insurer already has software calculating what your claim is worth — and their number is designed to protect their bottom line, not yours. Use this calculator to run the same math before you agree to anything.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Scroll up to enter your damages and get an instant estimate. It takes under two minutes and requires no signup.
            </p>
          </article>

          {/* ── STATE GRID ── */}
          <section className="mt-14 max-w-3xl" aria-label="Car accident settlement calculator by state">
            <h2
              className="heading-gradient mb-2"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Car Accident Settlement Calculator by State
            </h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              State laws vary significantly. Select your state for a calculator that reflects local
              fault rules, no-fault thresholds, damage caps, and filing deadlines.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAR_ACCIDENT_STATES.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/car-accident-settlement-calculator/${state.slug}/`}
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
            <DisclaimerBanner variant="footer" />
          </div>
        </div>
      </main>
    </>
  )
}
