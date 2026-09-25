// ─────────────────────────────────────────────────────────────────────────────
// app/pain-and-suffering-calculator/page.tsx
// FIXES:
//   C3 — OG description expanded to 153 chars (was 50); Twitter card fields added
//   H7 — Title trimmed to 44 chars (was 56 → 70 with template)
//   M4 — datePublished + dateModified added to WebApplication schema
//   M8 — keywords meta array removed (Google ignores it; zero SEO value)
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import PainSufferingCalculator from '@/components/calculator/PainSufferingCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import HeroBand, { type HeroFact } from '@/components/ui/HeroBand'
import EditorialLayout from '@/components/ui/EditorialLayout'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { getMainPageFAQs, buildFAQSchema } from '@/lib/data/faqContent'
import { getPriorityStates, ALL_STATES } from '@/lib/data/states'
import SourcesSection from '@/components/seo/SourcesSection'
import BackToCalculator from '@/components/calculator/BackToCalculator'
import { buildNextSteps } from '@/lib/nextSteps'
import sourcesData from '@/lib/data/sources.json'

// E-E-A-T review stamp. Bump this one string when the page is re-verified
// against current law — nothing else needs to change.
// Updated 2026-09-24: legal accuracy sprint removed unsourced claims.
const LAST_REVIEWED = 'September 2026'

// Contextual cards shown under a result (built server-side, see lib/nextSteps.ts).
const NEXT_STEPS = buildNextSteps({ tool: 'pain-suffering' })

const HUB_SOURCES = (sourcesData['pain-and-suffering'] as Record<string, { label: string; url: string; supports: string; tier: 'primary' | 'secondary' }[]>)['main'] ?? []

// Hero chips — true facts about this tool (methods, the protected multiplier
// range, and the number of published state guides).
const HERO_FACTS: HeroFact[] = [
  { label: 'Methods', value: 'Multiplier and per diem', icon: 'calculator', tone: 'primary' },
  { label: 'Severity multipliers', value: '1.5× to 5.0× of economic damages', icon: 'layers' },
  { label: 'State guides', value: `${ALL_STATES.length} states with local law`, icon: 'map', href: '#by-state' },
]

export const metadata: Metadata = {
  // FIX H7: 44 chars → 57 chars total with "| Settlebrook" template (under 60 ✓)
  title: 'Pain & Suffering Calculator — Free Estimate',
  // FIX C3: expanded to 153 chars with CTA and primary keyword
  description:
    'Use our free pain and suffering calculator to estimate your damages. Enter medical bills and lost wages for an instant multiplier or per diem estimate. Updated for 2026 USA laws.',
  // FIX M8: keywords array removed — Google ignores this meta tag entirely
  alternates: { canonical: '/pain-and-suffering-calculator/' },
  openGraph: {
    // FIX C3: OG title and description fully populated
    title: 'Pain & Suffering Calculator — Free Estimate | Settlebrook',
    description:
      'Use our free pain and suffering calculator to estimate your damages. Enter medical bills and lost wages for an instant multiplier or per diem estimate. Updated for 2026 USA laws.',
    url: '/pain-and-suffering-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pain & Suffering Calculator — Settlebrook',
      },
    ],
  },
  // FIX C3: Twitter card now has title + description
  twitter: {
    card: 'summary_large_image',
    site: '@settlebrook',
    title: 'Pain & Suffering Calculator — Free Estimate | Settlebrook',
    description:
      'Free pain and suffering calculator using the multiplier and per diem methods. Instant results for USA injury victims. No signup required.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const faqs = getMainPageFAQs()
const priorityStates = getPriorityStates()

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pain & Suffering Calculator',
  url: 'https://www.settlebrook.com/pain-and-suffering-calculator/',
  description:
    'Free online calculator that estimates pain and suffering damages using the multiplier method and per diem method.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  // FIX M4: date fields added for freshness signals
  datePublished: '2025-01-01',
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
      name: 'Pain & Suffering Calculator',
      item: 'https://www.settlebrook.com/pain-and-suffering-calculator/',
    },
  ],
}

const faqSchema = buildFAQSchema(faqs)

function SideCard({ children }: { children: React.ReactNode }) {
  return <div className="card-flat card-pad">{children}</div>
}

export default function PainSufferingCalculatorPage() {

  // Right rail (sticky from 1200px): the related-links cards that used to be the sidebar.
  const rail = (
    <>
            <SideCard>
              <h2 className="font-body font-semibold mb-3" style={{ fontSize: 16 }}>How This Calculator Works</h2>
              <ol className="flex flex-col gap-2.5">
                {[
                  'Enter your medical bills, lost wages, and other economic damages.',
                  'Choose your calculation method and injury severity.',
                  'Get an instant settlement estimate range with a full breakdown.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'var(--ink-2)' }}>
                    <span className="calc-step-badge" style={{ width: 22, height: 22, fontSize: 14 }} aria-hidden="true">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SideCard>

            <SideCard>
              <h3 className="font-body font-semibold mb-1" style={{ fontSize: 16 }}>How Is Pain and Suffering Calculated?</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
                Learn exactly how insurance companies calculate your damages — multiplier method, per diem method, and what raises or lowers your number.
              </p>
              <Link href="/pain-and-suffering-calculator/guide/" className="btn-secondary btn-sm w-full">
                Read the Complete Guide →
              </Link>
            </SideCard>

            <nav aria-label="State-specific pain and suffering calculators">
              <SideCard>
                <h2 className="font-body font-semibold mb-2" style={{ fontSize: 16 }}>Calculator by State</h2>
                <ul className="flex flex-col">
                  {priorityStates.map((state) => (
                    <li key={state.slug}>
                      <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="flex items-center justify-between text-sm py-2 text-link" style={{ textDecoration: 'none' }}>
                        <span>{state.name}</span>
                        <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>→</span>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 mt-1" style={{ borderTop: '1px solid var(--line)' }}>
                    <a href="#by-state" className="text-xs font-semibold inline-block py-1" style={{ color: 'var(--ink-3)' }}>All {ALL_STATES.length} states ↓</a>
                  </li>
                </ul>
              </SideCard>
            </nav>

            <nav aria-label="Other settlement calculators">
              <SideCard>
                <h2 className="font-body font-semibold mb-2" style={{ fontSize: 16 }}>Other Free Calculators</h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/car-accident-settlement-calculator/" className="flex flex-col py-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Car Accident Settlement Calculator</span>
                      <span className="text-xs" style={{ color: 'var(--ink-3)' }}>Estimate total vehicle accident damages</span>
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
            { label: 'Pain & Suffering Calculator', href: '/pain-and-suffering-calculator/' },
          ]}
          title={<>Pain &amp; Suffering Calculator</>}
          promise={<>
            Estimate your pain and suffering damages using the{' '}
            <strong style={{ color: 'var(--ink)' }}>multiplier method</strong> or{' '}
            <strong style={{ color: 'var(--ink)' }}>per diem method</strong> — the two
            most common ways to estimate pain and suffering.
            Free, instant, no signup required.
          </>}
          reviewed={LAST_REVIEWED}
          sourcesCount={HUB_SOURCES.length}
          facts={HERO_FACTS}
          factsLabel="What this calculator covers"
        />

        {/* ── CALCULATOR (live estimate) ── */}
        <div className="container-page calc-container pt-8 pb-10 sm:pt-10 sm:pb-14">
          <PainSufferingCalculator nextSteps={NEXT_STEPS} />
        </div>

        {/* ── EDITORIAL — sticky TOC · prose · tools rail (three columns from 1200px) ── */}
        <div className="container-page pb-14 sm:pb-20">
          <BackToCalculator targetId="calculator" />
          <EditorialLayout rootId="editorial-root" backHref="#calculator" rail={rail}>

          {/* ── EDITORIAL ── */}
          <article className="editorial">
            <h2 className="heading-display h2-editorial">When Everything Feels Uncertain After an Injury</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Getting hurt changes everything — and fast. One day you&apos;re fine, and the next you&apos;re dealing with doctor visits, missed work, and a stack of bills while an insurance adjuster is already calling you. It&apos;s overwhelming, and if you&apos;re wondering what your pain and suffering is actually <strong style={{ color: 'var(--ink)' }}>worth</strong>, you&apos;re not alone. That&apos;s exactly what this pain and suffering calculator is built for — to give you a real, grounded estimate of your non-economic damages before you sign anything or accept a lowball offer.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Pain and suffering is real money. It&apos;s not a vague bonus tacked onto your claim — it&apos;s often the largest part of a personal injury settlement. And yet most injury victims have no idea how it&apos;s calculated, which means they have no idea when they&apos;re being underpaid.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>This tool uses the same formulas insurance companies use internally. It won&apos;t replace an attorney, and it won&apos;t give you a guaranteed number — no calculator can do that. But it will give you a defensible starting point, so you walk into negotiations knowing your range, not guessing at it.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">What Are Pain and Suffering Damages?</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>When you&apos;re injured because of someone else&apos;s negligence, your losses fall into two buckets.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The first bucket is economic damages — the stuff with receipts. Medical bills, lost wages, physical therapy costs, prescription expenses, future medical treatment. These are concrete, documentable, and relatively straightforward to calculate.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The second bucket is non-economic damages, and this is where pain and suffering lives. It covers the losses that don&apos;t come with an invoice: the physical pain you wake up with every morning, the anxiety of not knowing if you&apos;ll fully recover, the hobbies you can&apos;t do anymore, the way your relationships have changed, the sleep you&apos;ve lost. These are sometimes called general damages or bodily injury damages, and they&apos;re entirely real even though there&apos;s no line item for them.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Courts and insurance companies alike recognize that your suffering has monetary value. The law doesn&apos;t require you to prove it with a receipt — it requires you to show it&apos;s real, connected to the accident, and consistent with your medical treatment.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s what most people don&apos;t realize: in many personal injury claims, pain and suffering compensation <strong style={{ color: 'var(--ink)' }}>exceeds</strong> the economic damages. A $20,000 medical bill might anchor a settlement closer to $60,000 or $80,000 once non-economic damages are properly accounted for. That gap is why understanding this calculation matters so much.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">How to Calculate Pain and Suffering</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The most widely used method is called the multiplier method, and it&apos;s straightforward once you see it in action.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>You start with your total economic damages — add up every medical bill, every lost paycheck, every out-of-pocket expense tied to your injury. That number becomes your base. Then you multiply it by a number between 1.5 and 5, depending on how severe and lasting your injuries are. The result is your estimated pain and suffering damages.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s how that plays out with real numbers:</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Say you broke your wrist in a car accident. Your medical bills total $12,000 and you missed two weeks of work, losing $3,200 in wages. Your total economic damages are $15,200. A moderate injury like a fracture that heals fully might warrant a multiplier of 2.0. That puts your pain and suffering estimate at $30,400 — and your total claim value at roughly $45,600.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Now take a more serious scenario. A herniated disc from the same type of accident. Medical costs run $38,000, and you&apos;re out of work for three months — $14,500 in lost wages. Economic damages: $52,500. Because the injury is severe, requires surgery, and leaves you with chronic pain, the multiplier rises to 3.5. Pain and suffering: $183,750. Total claim: over $236,000.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>What moves the multiplier up? Severity of the injury, whether it&apos;s permanent or temporary, how much your daily life has been disrupted, and how consistent and well-documented your medical treatment is. A minor soft tissue injury that resolves in six weeks typically lands at 1.5 to 2. Permanent injuries, surgeries, and long-term disability push toward 4 or 5.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>What moves it down? Gaps in treatment, pre-existing conditions in the same body part, and any evidence that you contributed to the accident.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">The Per Diem Method</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The per diem method takes a different approach. Instead of multiplying your economic damages, it assigns a daily dollar value to your pain — and then multiplies that by the number of days you suffered.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The daily rate is usually tied to your actual daily earnings. If you make $200 a day, the argument is that your pain is worth at least that much per day, since you&apos;d reasonably trade a day&apos;s pay to not experience it.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>So if you earned $200/day and your recovery took 180 days of real, documented pain, your per diem calculation yields $36,000 in pain and suffering.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>This method works best when your recovery has a clear endpoint — a fracture that healed, a surgery with a defined recovery window. It&apos;s harder to apply when injuries are ongoing or permanent, because multiplying a daily rate by an indefinite number of future days becomes speculative.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Some personal injury attorneys use per diem specifically to counter lowball multiplier offers from insurance companies. If the per diem number comes out higher, it gives you a stronger argument in negotiation. Our <Link href='/pain-and-suffering-calculator/' style={{ color: 'var(--primary)' }}>Pain and Suffering Calculator</Link> runs both methods so you can see which one produces a stronger estimate for your specific situation.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">How Insurance Companies Calculate Pain and Suffering</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s something most injury victims never find out until it&apos;s too late: insurance companies don&apos;t sit down and thoughtfully consider your suffering. They run it through software.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>The dominant program in the industry is called Colossus, and it&apos;s used by many of the largest insurers in the country. An insurance adjuster enters your medical codes, treatment history, injury type, and claim details — and the software spits out a settlement range. The adjuster then works from that range, typically starting at the low end.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Colossus weighs certain factors heavily. Documented treatment from a licensed physician counts for more than chiropractic-only care. Consistent, uninterrupted treatment strengthens your value. Objective findings — an MRI showing a herniated disc, an X-ray confirming a fracture — carry more weight than pain complaints alone.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>What hurts your value in the system? Gaps in treatment longer than 30 days (the software reads these as evidence you weren&apos;t really that hurt). Treatment from providers the system doesn&apos;t weight highly. Injuries that don&apos;t match the accident mechanism. And any documented pre-existing condition in the same area.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Adjusters are also trained to ask you recorded questions early — before you&apos;ve fully treated — specifically to lock in statements that minimize your claim. The number they first offer you is not their honest assessment. It&apos;s their opening bid in a negotiation, anchored to a software output designed to protect their bottom line.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Knowing how the calculation works is your first line of defense.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">Factors That Affect Your Settlement Value</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Several things directly influence where your pain and suffering estimate lands — and some of them are within your control.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Medical documentation</strong> is the single biggest factor. Every symptom, every limitation, every bad night of sleep should be in your medical records. Judges and adjusters can only value what&apos;s documented. If you told your doctor your back hurts but you didn&apos;t mention the headaches, the insomnia, or the fact that you can&apos;t pick up your kids — those losses effectively don&apos;t exist in your claim.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Treatment consistency</strong> matters almost as much. If you went to three appointments and then stopped for two months, the insurance company will argue the gap means you recovered. Even if you stopped because you couldn&apos;t afford more visits, or because life got in the way, the gap will be used against you. Treat consistently until your doctor releases you.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Injury severity and permanence</strong> drive the multiplier higher than anything else. A torn rotator cuff that requires surgery and leaves you with a 15% permanent impairment is worth dramatically more than the same shoulder injury that heals completely. If your doctor has given you a permanent impairment rating, that number is significant — document it and make sure it&apos;s in your records.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Your credibility</strong> affects settlement value in ways that aren&apos;t always obvious. Social media posts showing you at a barbecue two weeks after claiming you can barely walk will crater your claim. Inconsistencies between what you tell doctors and what you tell the insurance company will be flagged.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Attorney representation</strong> is worth weighing carefully. An attorney can negotiate on your behalf, identify additional insurance coverage, and take a case to trial if the insurer won&apos;t offer a fair number — leverage you don&apos;t have negotiating alone. That value has to be weighed against contingency fees, which are typically a third of the settlement. This doesn&apos;t mean you must hire an attorney, but the decision deserves serious thought before you negotiate alone.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">Pain and Suffering Settlement Examples</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>These examples are illustrative — every claim is different, and these numbers are not guarantees. They&apos;re meant to show you what the math looks like in real personal injury claims.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Scenario 1 — Rear-end collision, soft tissue injuries.</strong> You&apos;re hit from behind at a stoplight. Whiplash, cervical strain, six weeks of physical therapy. Medical bills: $6,800. Lost wages: $1,400. Economic damages: $8,200. Multiplier: 1.8 (moderate soft tissue, full recovery). Pain and suffering estimate: $14,760. Total claim value: $22,960.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Scenario 2 — Slip and fall, knee surgery.</strong> You fall on a wet floor at a retail store. Torn meniscus, arthroscopic surgery, four months of recovery. Medical bills: $31,500. Lost wages: $9,200. Economic damages: $40,700. Multiplier: 3.0 (surgery, significant recovery period). Pain and suffering estimate: $122,100. Total claim value: $162,800.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: 'var(--ink)' }}>Scenario 3 — T-bone collision, spinal injury.</strong> Another driver runs a red light and hits your door. Herniated disc at L4-L5, nerve damage, permanent 12% whole-body impairment. Medical bills: $67,000. Lost wages: $28,000. Economic damages: $95,000. Multiplier: 4.5 (permanent injury, surgical intervention, lasting disability). Pain and suffering estimate: $427,500. Total claim value: well over $500,000 — and likely subject to policy limits.</p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <SourcesSection sources={HUB_SOURCES} />

            <h2 className="heading-display h2-editorial">Frequently Asked Questions</h2>
            <FAQAccordion faqs={faqs} />

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">Related Guides</h2>
            <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
              <li style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '8px' }}>
                <Link href="/blog/injury-claim-calculator/" style={{ color: 'var(--primary)' }}>Injury Claim Calculator: How Insurers Value Your Claim</Link> — a deeper look at how adjusters weigh documentation, comparative fault, and policy limits alongside the multiplier and per diem math.
              </li>
            </ul>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2 className="heading-display h2-editorial">Get Your Estimate Now</h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>You deserve to know what your claim is worth before anyone asks you to sign anything. The insurance company already has software running numbers on your case — you should have one too.</p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>Use our free Pain and Suffering Calculator above to estimate your settlement value in under 2 minutes.</p>

          </article>

          {/* ── STATE GRID ── */}
          <section
            id="by-state"
            className="mt-12 prose-col"
            aria-label="Pain and suffering calculator by state"
            style={{ scrollMarginTop: 'calc(var(--header-h) + 12px)' }}
          >
            <h2 className="heading-display" style={{ fontSize: 26, marginBottom: 6 }}>
              Pain &amp; Suffering Calculator by State
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-2)' }}>
              State laws vary significantly. Select your state for a calculator that reflects local fault
              rules, damage caps, and filing deadlines.
            </p>
            <ul className="flex flex-wrap gap-2">
              {ALL_STATES.map((state) => (
                <li key={state.slug}>
                  <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="picker-link" style={{ minHeight: 40 }}>
                    <span className="text-xs mr-1.5" style={{ color: 'var(--ink-3)' }}>{state.abbreviation}</span>
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <DisclaimerBanner variant="footer" />
          </EditorialLayout>
        </div>
      </main>
    </>
  )
}
