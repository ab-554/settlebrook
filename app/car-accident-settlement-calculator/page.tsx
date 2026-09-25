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
import HeroBand, { type HeroFact } from '@/components/ui/HeroBand'
import EditorialLayout from '@/components/ui/EditorialLayout'
import CiteThisPage from '@/components/ui/CiteThisPage'
import StateList from '@/components/ui/StateList'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { getCarAccidentFAQs, buildFAQSchema } from '@/lib/data/carAccidentFaqs'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import SourcesSection from '@/components/seo/SourcesSection'
import BackToCalculator from '@/components/calculator/BackToCalculator'
import { buildNextSteps } from '@/lib/nextSteps'
import sourcesData from '@/lib/data/sources.json'
import { getBlogPostBySlug, isPostPublished } from '@/lib/data/blogPosts'

// E-E-A-T review stamp. Bump this one string when the page is re-verified
// against current law - nothing else needs to change.
const LAST_REVIEWED = 'September 2026'

// Contextual cards shown under a result (built server-side, see lib/nextSteps.ts).
const NEXT_STEPS = buildNextSteps({ tool: 'car-accident' })

const HUB_SOURCES = (sourcesData['car-accident'] as Record<string, { label: string; url: string; supports: string; tier: 'primary' | 'secondary' }[]>)['main'] ?? []

const policyLimitsPost = getBlogPostBySlug('/blog/settlement-exceeds-policy-limits/')
const isPolicyLimitsPostLive = !!policyLimitsPost && isPostPublished(policyLimitsPost)
const minorAccidentPost = getBlogPostBySlug('/blog/minor-car-accident-settlement/')
const isMinorAccidentPostLive = !!minorAccidentPost && isPostPublished(minorAccidentPost)

// ─── Metadata ─────────────────────────────────────────────────────────────────

// Hero chips — true facts about this tool.
const HERO_FACTS: HeroFact[] = [
  { label: 'Includes', value: 'Vehicle damage and a policy-limit check', icon: 'car', tone: 'primary' },
  { label: 'Methods', value: 'Multiplier and per diem', icon: 'calculator' },
  { label: 'State guides', value: `${CAR_ACCIDENT_STATES.length} states with local law`, icon: 'map', href: '#by-state' },
]

export const metadata: Metadata = {
  // 47 chars → 60 total with "| Settlebrook" template ✓
  title: 'Car Accident Settlement Calculator — Free Tool',
  description:
    'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value instantly.',
  alternates: { canonical: '/car-accident-settlement-calculator/' },
  openGraph: {
    title: 'Car Accident Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value instantly.',
    url: '/car-accident-settlement-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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
  url: 'https://www.settlebrook.com/car-accident-settlement-calculator/',
  description:
    'Free online calculator that estimates car accident settlement values including economic damages, pain and suffering, vehicle damage, and fault reduction.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
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
      name: 'Car Accident Settlement Calculator',
      item: 'https://www.settlebrook.com/car-accident-settlement-calculator/',
    },
  ],
}

const faqSchema = buildFAQSchema(faqs)

// ─── Sidebar glassmorphism card wrapper ───────────────────────────────────────

function SideCard({ children }: { children: React.ReactNode }) {
  return <div className="card-flat card-pad">{children}</div>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarAccidentCalculatorPage() {

  // Right rail (sticky from 1200px): the related-links cards that used to be the sidebar.
  const rail = (
    <>
            <SideCard>
              <h2 className="font-body font-semibold mb-3" style={{ fontSize: 16 }}>How This Calculator Works</h2>
              <ol className="flex flex-col gap-2.5">
                {[
                  'Enter medical bills, lost wages, vehicle damage, and other economic damages.',
                  'Choose your injury severity level and calculation method.',
                  'Optionally enter the at-fault driver\'s policy limit to see a warning if your estimate exceeds it.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'var(--ink-2)' }}>
                    <span className="calc-step-badge" style={{ width: 22, height: 22, fontSize: 14 }} aria-hidden="true">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SideCard>

            <SideCard>
              <h3 className="font-body font-semibold mb-1" style={{ fontSize: 16 }}>How Are Car Accident Settlements Calculated?</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
                Learn exactly how insurance companies value car accident claims — multiplier method, per diem method, policy limits, and what raises or lowers your number.
              </p>
              <Link href="/pain-and-suffering-calculator/guide/" className="btn-secondary btn-sm w-full">
                Read the Complete Guide →
              </Link>
            </SideCard>

            {/* Every state page, alphabetical — no truncated list (components/ui/StateList.tsx) */}
            <nav aria-label="State-specific car accident settlement calculators">
              <StateList tool="car-accident" title="By state" headingLevel="h2" hubLink={false} />
            </nav>

            <nav aria-label="Other settlement calculators">
              <SideCard>
                <h2 className="font-body font-semibold mb-2" style={{ fontSize: 16 }}>Other Free Calculators</h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/pain-and-suffering-calculator/" className="flex flex-col py-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Pain &amp; Suffering Calculator</span>
                      <span className="text-xs" style={{ color: 'var(--ink-3)' }}>Estimate non-economic damages by method</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/workers-comp-settlement-calculator/" className="flex flex-col py-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Workers Comp Settlement Calculator</span>
                      <span className="text-xs" style={{ color: 'var(--ink-3)' }}>Estimate your workplace injury settlement</span>
                    </Link>
                  </li>
                </ul>
              </SideCard>
            </nav>
    </>
  )

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

      <main className="min-h-screen">

        {/* ── HERO BAND — breadcrumb · H1 · promise · trust line · key facts · CTA ── */}
        <HeroBand
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Car Accident Settlement Calculator', href: '/car-accident-settlement-calculator/' },
          ]}
          title={<>Car Accident Settlement Calculator</>}
          promise={<>
            Estimate your total car accident settlement including{' '}
            <strong style={{ color: 'var(--ink)' }}>vehicle damage</strong>,{' '}
            <strong style={{ color: 'var(--ink)' }}>medical bills</strong>,{' '}
            <strong style={{ color: 'var(--ink)' }}>lost wages</strong>, and{' '}
            <strong style={{ color: 'var(--ink)' }}>pain and suffering</strong>.
            Free, instant, works for injuries anywhere in the US.
          </>}
          reviewed={LAST_REVIEWED}
          sourcesCount={HUB_SOURCES.length}
          facts={HERO_FACTS}
          factsLabel="What this calculator covers"
        />

        {/* ── CALCULATOR (live estimate) ── */}
        <div className="container-page calc-container pt-8 pb-10 sm:pt-10 sm:pb-14">
          <CarAccidentCalculator nextSteps={NEXT_STEPS} />
        </div>

        {/* ── EDITORIAL — sticky TOC · prose · tools rail (three columns from 1200px) ── */}
        <div className="container-page pb-14 sm:pb-20">
          <BackToCalculator targetId="calculator" />
          <EditorialLayout rootId="editorial-root" backHref="#calculator" rail={rail}>

          {/* ── EDITORIAL CONTENT ── */}
          <article className="editorial">
            <h2
              className="heading-display h2-editorial"
            >
              What You Need to Know Before Settling Your Car Accident Claim
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              A car accident can reshape your finances overnight. Medical bills start piling up before you even know the full extent of your injuries. The other driver&apos;s insurance company calls quickly — often within days — with a recorded statement request and sometimes a preliminary offer. That offer is rarely the right number. It&apos;s designed to close the file before you fully understand what you&apos;re owed.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              This calculator gives you a grounded, formula-driven estimate of your total claim value before you sign anything. It uses the multiplier method, one of the two most common ways to estimate pain and suffering. The math is transparent, the inputs are yours, and the result is a starting point for negotiation — not a number pulled from a settlement mill.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              What a Car Accident Settlement Actually Covers
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Car accident claims have more moving parts than most personal injury cases because they combine two categories of loss that are calculated differently.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Economic damages</strong> are the concrete, documented losses: every medical bill from the ER, every follow-up visit, every physical therapy session, every prescription. Add to that any wages you lost while you were recovering, any earning capacity you&apos;ve permanently lost, and the cost to repair or replace your vehicle. These are provable with receipts and records, and they form the foundation of your claim.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Non-economic damages</strong> — pain and suffering — sit on top of that foundation. They compensate for the physical pain, the sleepless nights, the anxiety about recovery, the hobbies you can&apos;t participate in, and the ways your relationships have changed. These don&apos;t come with a receipt, but they are legally recoverable and often make up the larger portion of a settlement.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              What sets car accident claims apart from other personal injury cases is the addition of <strong style={{ color: 'var(--ink)' }}>property damage</strong> — your vehicle. In most states, the at-fault driver&apos;s liability insurance covers your property damage separately from your bodily injury claim, but the total exposure to that insurer includes both. That&apos;s why understanding the relationship between your vehicle damage and the at-fault driver&apos;s policy limit matters: a $30,000 repair on a high-value car can eat significantly into a modest policy before your medical damages are even addressed.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              How the Multiplier Method Works for Car Accident Claims
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              The multiplier method is one of the two most common ways to estimate pain and suffering in car accident cases. Here&apos;s exactly how it works.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              First, you sum your medical damages and lost income — but not vehicle damage. Property damage is included in your total economic damages, but it is excluded from the multiplier base. The reasoning is sound: multiplying your vehicle repair cost by a pain and suffering factor doesn&apos;t make legal sense, because a dented car doesn&apos;t cause you physical pain. The multiplier applies only to the human cost of the accident.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Next, you select a multiplier based on injury severity. Minor soft tissue injuries that resolve fully within a few months typically use 1.5x. Fractures, sprains requiring several months of treatment, and injuries with near-full recovery use 2.5x. Cases requiring surgery, with 12 or more months of recovery and some permanent effects, use 3.5x. Significant permanent injuries use 4.5x. Catastrophic injuries — paralysis, traumatic brain injury, permanent total disability — use 5x.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Multiply the medical/wage base by your multiplier to get the pain and suffering figure. Add your vehicle damage and all other economic damages back in. Apply any fault reduction. That&apos;s your total estimated settlement.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              As a concrete example: you were rear-ended and sustained a herniated disc requiring epidural injections and four months of physical therapy. Medical bills: $24,000. Lost wages: $8,500. Vehicle damage: $7,200. Multiplier base (medical + wages only): $32,500. At a 3.5x multiplier for a serious injury, pain and suffering is $113,750. Add vehicle damage and you get total economic damages of $39,700. Total claim estimate: $153,450. If you were 10% at fault, the adjusted total is $138,105.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              Insurance Policy Limits and Your Settlement
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Policy limits are one of the most important — and least understood — constraints on car accident settlements. Your calculated settlement value represents what your claim is theoretically worth. The at-fault driver&apos;s liability policy limit represents the ceiling the insurer will pay.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Most states require only modest minimum liability coverage. In Texas, that&apos;s 30/60/25 — meaning $30,000 per person, $60,000 per accident, and $25,000 for property damage. In California it&apos;s 30/60/15 (since January 1, 2025 — previously 15/30/5). Even at current levels, these minimums have not kept pace with rising medical costs. A single hospitalization can exceed $30,000 easily.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              When your calculated settlement exceeds the at-fault driver&apos;s policy limit, you have practical options. Underinsured Motorist (UIM) coverage on your own policy is specifically designed to bridge this gap — it pays the difference between the at-fault driver&apos;s limit and your actual damages, up to your UIM limit. If you have UIM coverage, your own insurer steps in and you negotiate with them instead.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Enter the at-fault driver&apos;s policy limit in this calculator to see whether your estimate exceeds it. The calculation itself doesn&apos;t change — the limit is purely advisory — but the warning tells you whether you need to think about UIM, personal liability, or other recovery strategies.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              Car Accident Settlement Examples
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              These examples illustrate how the formula produces different results at different injury levels. They are not guarantees — every case is unique.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Scenario 1 — Minor: Rear-end collision, soft tissue injury.</strong> You&apos;re stopped at a red light and hit from behind. Whiplash, cervical strain, six weeks of chiropractic care. Medical bills: $5,200. Lost wages: $1,800. Vehicle damage: $4,500. Multiplier base: $7,000. At 1.5x: pain and suffering $10,500. Total economic damages: $11,500. Adjusted total: $22,000 before fault reduction.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Scenario 2 — Moderate: T-bone collision, shoulder fracture.</strong> You&apos;re hit crossing an intersection. Rotator cuff tear, surgery, five months of physical therapy, near-full recovery. Medical bills: $38,000. Lost wages: $12,000. Vehicle damage: $9,500. Multiplier base: $50,000. At 3.0x: pain and suffering $150,000. Total economic damages: $59,500. Adjusted total: $209,500 before fault reduction.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Scenario 3 — Severe: Head-on collision, spinal cord injury.</strong> Another driver crosses the centerline. Fractured vertebra, spinal cord damage, permanent partial paralysis. Medical bills: $185,000. Future medical costs: $250,000. Lost wages: $45,000. Future lost earnings: $320,000. Vehicle loss: $28,000. Multiplier base: $800,000. At 4.5x: pain and suffering $3,600,000. Total claim value well over $4,000,000 — and almost certainly subject to policy limits that will cap actual recovery.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <SourcesSection sources={HUB_SOURCES} />

            <h2
              className="heading-display h2-editorial"
            >
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              Related Guides
            </h2>
            <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
              <li style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '8px' }}>
                <Link href="/blog/diminished-value-claim/" style={{ color: 'var(--primary)' }}>Diminished Value Claims After a Car Accident</Link> — how the 17c formula works and how a diminished value figure fits into your total settlement.
              </li>
              {isPolicyLimitsPostLive && (
                <li style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '8px' }}>
                  <Link href="/blog/settlement-exceeds-policy-limits/" style={{ color: 'var(--primary)' }}>When Your Injury Claim Exceeds Policy Limits</Link> — where the rest of the money can come from when the at-fault driver&apos;s coverage isn&apos;t enough.
                </li>
              )}
              {isMinorAccidentPostLive && (
                <li style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '8px' }}>
                  <Link href="/blog/minor-car-accident-settlement/" style={{ color: 'var(--primary)' }}>Minor Car Accident Settlements: Soft-Tissue Injuries vs. No Injury</Link> — what changes between a no-injury claim and a diagnosed whiplash claim, plus a worked example.
                </li>
              )}
            </ul>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              Get Your Estimate Now
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              The at-fault driver&apos;s insurer will arrive at its own figure for your claim. Use this calculator to see the math for yourself before you agree to anything.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Scroll up to enter your damages and get an instant estimate. It takes under two minutes and requires no signup.
            </p>
          </article>

          {/* ── STATE GRID — every state page, alphabetical, with count badge ── */}
          <StateList
            variant="plain"
            id="by-state"
            tool="car-accident"
            headingLevel="h2"
            title="Car Accident Settlement Calculator by State"
            intro="State laws vary significantly. Select your state for a calculator that reflects local fault rules, no-fault thresholds, damage caps, and filing deadlines."
            className="mt-12 prose-col"
          />

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title="Car Accident Settlement Calculator — Free Tool" path="/car-accident-settlement-calculator/" reviewed={LAST_REVIEWED} className="mt-10 prose-col" />

          <DisclaimerBanner variant="footer" />
          </EditorialLayout>
        </div>
      </main>
    </>
  )
}
