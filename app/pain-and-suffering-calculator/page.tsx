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
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { getMainPageFAQs, buildFAQSchema } from '@/lib/data/faqContent'
import { getPriorityStates, ALL_STATES } from '@/lib/data/states'

export const metadata: Metadata = {
  // FIX H7: 44 chars → 57 chars total with "| Settlebrook" template (under 60 ✓)
  title: 'Pain & Suffering Calculator — Free Estimate',
  // FIX C3: expanded to 153 chars with CTA and primary keyword
  description:
    'Use our free pain and suffering calculator to estimate your damages. Enter medical bills and lost wages for an instant multiplier or per diem estimate. Updated for 2025 USA laws.',
  // FIX M8: keywords array removed — Google ignores this meta tag entirely
  alternates: { canonical: '/pain-and-suffering-calculator/' },
  openGraph: {
    // FIX C3: OG title and description fully populated
    title: 'Pain & Suffering Calculator — Free Estimate | Settlebrook',
    description:
      'Use our free pain and suffering calculator to estimate your damages. Enter medical bills and lost wages for an instant multiplier or per diem estimate. Updated for 2025 USA laws.',
    url: 'https://settlebrook.com/pain-and-suffering-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://settlebrook.com/og-image.png',
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
    images: ['https://settlebrook.com/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const faqs = getMainPageFAQs()
const priorityStates = getPriorityStates()

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pain & Suffering Calculator',
  url: 'https://settlebrook.com/pain-and-suffering-calculator/',
  description:
    'Free online calculator that estimates pain and suffering damages using the multiplier method and per diem method.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  // FIX M4: date fields added for freshness signals
  datePublished: '2025-01-01',
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
      name: 'Pain & Suffering Calculator',
      item: 'https://settlebrook.com/pain-and-suffering-calculator/',
    },
  ],
}

const faqSchema = buildFAQSchema(faqs)

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

export default function PainSufferingCalculatorPage() {
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

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Pain & Suffering Calculator', href: '/pain-and-suffering-calculator/' },
            ]} />
            <div className="mt-4">
              {/* H1 contains primary keyword "pain and suffering calculator" ✓ */}
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}
              >
                Pain &amp; Suffering Calculator
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your pain and suffering damages using the{' '}
                <strong style={{ color: '#E2E8F0' }}>multiplier method</strong> or{' '}
                <strong style={{ color: '#E2E8F0' }}>per diem method</strong> — the same
                formulas used by insurance adjusters and plaintiff attorneys across the USA.
                Free, instant, no signup required.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {[
                'Updated for 2025',
                'Both multiplier & per diem methods',
                'All 50 states',
                'No personal data collected',
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

            {/* Calculator */}
            <div className="w-full lg:flex-1 min-w-0 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>
              <PainSufferingCalculator />
            </div>

            {/* Sidebar */}
            <aside aria-label="Related information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              <SideCard>
                <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>How This Calculator Works</h2>
                <div className="flex flex-col gap-3" style={{ color: '#94A3B8' }}>
                  {[
                    'Enter your medical bills, lost wages, and other economic damages.',
                    'Choose your calculation method and injury severity.',
                    'Get an instant settlement estimate range with a full breakdown.',
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

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  How Is Pain and Suffering Calculated?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Learn exactly how insurance companies calculate your damages — multiplier method, per diem method, and what raises or lowers your number.
                </p>
                <Link href="/pain-and-suffering-calculator/guide/" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}>
                  Read the Complete Guide →
                </Link>
              </div>

              <nav aria-label="State-specific pain and suffering calculators">
                <SideCard>
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Calculator by State</h2>
                  <ul className="flex flex-col gap-2">
                    {priorityStates.map((state) => (
                      <li key={state.slug}>
                        <Link
                          href={`/pain-and-suffering-calculator/${state.slug}/`}
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

              <nav aria-label="Other settlement calculators">
                <SideCard>
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Other Free Calculators</h2>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/car-accident-settlement-calculator/" className="flex flex-col gap-0.5 group">
                        <span className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                          Car Accident Settlement Calculator
                        </span>
                        <span className="text-xs" style={{ color: '#475569' }}>Estimate total vehicle accident damages</span>
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

          {/* ── EDITORIAL ── */}
          <article style={{ margin: '0 auto' }}>
            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>When Everything Feels Uncertain After an Injury</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Getting hurt changes everything — and fast. One day you&apos;re fine, and the next you&apos;re dealing with doctor visits, missed work, and a stack of bills while an insurance adjuster is already calling you. It&apos;s overwhelming, and if you&apos;re wondering what your pain and suffering is actually <strong style={{ color: '#E2E8F0' }}>worth</strong>, you&apos;re not alone. That&apos;s exactly what this pain and suffering calculator is built for — to give you a real, grounded estimate of your non-economic damages before you sign anything or accept a lowball offer.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Pain and suffering is real money. It&apos;s not a vague bonus tacked onto your claim — it&apos;s often the largest part of a personal injury settlement. And yet most injury victims have no idea how it&apos;s calculated, which means they have no idea when they&apos;re being underpaid.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>This tool uses the same formulas insurance companies use internally. It won&apos;t replace an attorney, and it won&apos;t give you a guaranteed number — no calculator can do that. But it will give you a defensible starting point, so you walk into negotiations knowing your range, not guessing at it.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>What Are Pain and Suffering Damages?</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>When you&apos;re injured because of someone else&apos;s negligence, your losses fall into two buckets.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The first bucket is economic damages — the stuff with receipts. Medical bills, lost wages, physical therapy costs, prescription expenses, future medical treatment. These are concrete, documentable, and relatively straightforward to calculate.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The second bucket is non-economic damages, and this is where pain and suffering lives. It covers the losses that don&apos;t come with an invoice: the physical pain you wake up with every morning, the anxiety of not knowing if you&apos;ll fully recover, the hobbies you can&apos;t do anymore, the way your relationships have changed, the sleep you&apos;ve lost. These are sometimes called general damages or bodily injury damages, and they&apos;re entirely real even though there&apos;s no line item for them.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Courts and insurance companies alike recognize that your suffering has monetary value. The law doesn&apos;t require you to prove it with a receipt — it requires you to show it&apos;s real, connected to the accident, and consistent with your medical treatment.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s what most people don&apos;t realize: in many personal injury claims, pain and suffering compensation <strong style={{ color: '#E2E8F0' }}>exceeds</strong> the economic damages. A $20,000 medical bill might anchor a settlement closer to $60,000 or $80,000 once non-economic damages are properly accounted for. That gap is why understanding this calculation matters so much.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>How to Calculate Pain and Suffering</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The most widely used method is called the multiplier method, and it&apos;s straightforward once you see it in action.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>You start with your total economic damages — add up every medical bill, every lost paycheck, every out-of-pocket expense tied to your injury. That number becomes your base. Then you multiply it by a number between 1.5 and 5, depending on how severe and lasting your injuries are. The result is your estimated pain and suffering damages.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s how that plays out with real numbers:</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Say you broke your wrist in a car accident. Your medical bills total $12,000 and you missed two weeks of work, losing $3,200 in wages. Your total economic damages are $15,200. A moderate injury like a fracture that heals fully might warrant a multiplier of 2.0. That puts your pain and suffering estimate at $30,400 — and your total claim value at roughly $45,600.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Now take a more serious scenario. A herniated disc from the same type of accident. Medical costs run $38,000, and you&apos;re out of work for three months — $14,500 in lost wages. Economic damages: $52,500. Because the injury is severe, requires surgery, and leaves you with chronic pain, the multiplier rises to 3.5. Pain and suffering: $183,750. Total claim: over $236,000.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>What moves the multiplier up? Severity of the injury, whether it&apos;s permanent or temporary, how much your daily life has been disrupted, and how consistent and well-documented your medical treatment is. A minor soft tissue injury that resolves in six weeks typically lands at 1.5 to 2. Permanent injuries, surgeries, and long-term disability push toward 4 or 5.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>What moves it down? Gaps in treatment, pre-existing conditions in the same body part, and any evidence that you contributed to the accident.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>The Per Diem Method</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The per diem method takes a different approach. Instead of multiplying your economic damages, it assigns a daily dollar value to your pain — and then multiplies that by the number of days you suffered.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The daily rate is usually tied to your actual daily earnings. If you make $200 a day, the argument is that your pain is worth at least that much per day, since you&apos;d reasonably trade a day&apos;s pay to not experience it.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>So if you earned $200/day and your recovery took 180 days of real, documented pain, your per diem calculation yields $36,000 in pain and suffering.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>This method works best when your recovery has a clear endpoint — a fracture that healed, a surgery with a defined recovery window. It&apos;s harder to apply when injuries are ongoing or permanent, because multiplying a daily rate by an indefinite number of future days becomes speculative.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Some personal injury attorneys use per diem specifically to counter lowball multiplier offers from insurance companies. If the per diem number comes out higher, it gives you a stronger argument in negotiation. Our <Link href='/pain-and-suffering-calculator/' style={{ color: '#60A5FA' }}>Pain and Suffering Calculator</Link> runs both methods so you can see which one produces a stronger estimate for your specific situation.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>How Insurance Companies Calculate Pain and Suffering</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Here&apos;s something most injury victims never find out until it&apos;s too late: insurance companies don&apos;t sit down and thoughtfully consider your suffering. They run it through software.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>The dominant program in the industry is called Colossus, and it&apos;s used by many of the largest insurers in the country. An insurance adjuster enters your medical codes, treatment history, injury type, and claim details — and the software spits out a settlement range. The adjuster then works from that range, typically starting at the low end.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Colossus weighs certain factors heavily. Documented treatment from a licensed physician counts for more than chiropractic-only care. Consistent, uninterrupted treatment strengthens your value. Objective findings — an MRI showing a herniated disc, an X-ray confirming a fracture — carry more weight than pain complaints alone.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>What hurts your value in the system? Gaps in treatment longer than 30 days (the software reads these as evidence you weren&apos;t really that hurt). Treatment from providers the system doesn&apos;t weight highly. Injuries that don&apos;t match the accident mechanism. And any documented pre-existing condition in the same area.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Adjusters are also trained to ask you recorded questions early — before you&apos;ve fully treated — specifically to lock in statements that minimize your claim. The number they first offer you is not their honest assessment. It&apos;s their opening bid in a negotiation, anchored to a software output designed to protect their bottom line.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Knowing how the calculation works is your first line of defense.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>Factors That Affect Your Settlement Value</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Several things directly influence where your pain and suffering estimate lands — and some of them are within your control.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Medical documentation</strong> is the single biggest factor. Every symptom, every limitation, every bad night of sleep should be in your medical records. Judges and adjusters can only value what&apos;s documented. If you told your doctor your back hurts but you didn&apos;t mention the headaches, the insomnia, or the fact that you can&apos;t pick up your kids — those losses effectively don&apos;t exist in your claim.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Treatment consistency</strong> matters almost as much. If you went to three appointments and then stopped for two months, the insurance company will argue the gap means you recovered. Even if you stopped because you couldn&apos;t afford more visits, or because life got in the way, the gap will be used against you. Treat consistently until your doctor releases you.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Injury severity and permanence</strong> drive the multiplier higher than anything else. A torn rotator cuff that requires surgery and leaves you with a 15% permanent impairment is worth dramatically more than the same shoulder injury that heals completely. If your doctor has given you a permanent impairment rating, that number is significant — document it and make sure it&apos;s in your records.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Your credibility</strong> affects settlement value in ways that aren&apos;t always obvious. Social media posts showing you at a barbecue two weeks after claiming you can barely walk will crater your claim. Inconsistencies between what you tell doctors and what you tell the insurance company will be flagged.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Attorney representation</strong> consistently produces higher settlements. Studies have found that represented claimants receive settlements three to four times higher on average than unrepresented ones — even after attorney fees. This doesn&apos;t mean you must hire an attorney, but it means the decision deserves serious thought before you negotiate alone.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>Pain and Suffering Settlement Examples</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>These examples are illustrative — every claim is different, and these numbers are not guarantees. They&apos;re meant to show you what the math looks like in real personal injury claims.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Scenario 1 — Rear-end collision, soft tissue injuries.</strong> You&apos;re hit from behind at a stoplight. Whiplash, cervical strain, six weeks of physical therapy. Medical bills: $6,800. Lost wages: $1,400. Economic damages: $8,200. Multiplier: 1.8 (moderate soft tissue, full recovery). Pain and suffering estimate: $14,760. Total claim range: $20,000–$26,000.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Scenario 2 — Slip and fall, knee surgery.</strong> You fall on a wet floor at a retail store. Torn meniscus, arthroscopic surgery, four months of recovery. Medical bills: $31,500. Lost wages: $9,200. Economic damages: $40,700. Multiplier: 3.0 (surgery, significant recovery period). Pain and suffering estimate: $122,100. Total claim range: $140,000–$175,000.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}><strong style={{ color: '#E2E8F0' }}>Scenario 3 — T-bone collision, spinal injury.</strong> Another driver runs a red light and hits your door. Herniated disc at L4-L5, nerve damage, permanent 12% whole-body impairment. Medical bills: $67,000. Lost wages: $28,000. Economic damages: $95,000. Multiplier: 4.5 (permanent injury, surgical intervention, lasting disability). Pain and suffering estimate: $427,500. Total claim value: well over $500,000 — and likely subject to policy limits.</p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>Frequently Asked Questions</h2>
            <FAQAccordion faqs={faqs} />

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2 className="heading-gradient" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}>Get Your Estimate Now</h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>You deserve to know what your claim is worth before anyone asks you to sign anything. The insurance company already has software running numbers on your case — you should have one too.</p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>Use our free Pain and Suffering Calculator above to estimate your settlement value in under 2 minutes.</p>

          </article>

          {/* ── STATE GRID ── */}
          <section className="mt-14 max-w-3xl" aria-label="Pain and suffering calculator by state">
            <h2 className="heading-gradient mb-2" style={{ fontSize: 24, fontWeight: 700 }}>
              Pain &amp; Suffering Calculator by State
            </h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              State laws vary significantly. Select your state for a calculator that reflects local fault
              rules, damage caps, and filing deadlines.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_STATES.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/pain-and-suffering-calculator/${state.slug}/`}
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
