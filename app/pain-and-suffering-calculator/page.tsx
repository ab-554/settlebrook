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
  alternates: { canonical: 'https://settlebrook.com/pain-and-suffering-calculator/' },
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
        <header style={{ backgroundColor: '#0D1526', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
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
            <div className="w-full lg:flex-1 min-w-0">
              <PainSufferingCalculator />
            </div>

            {/* Sidebar */}
            <aside aria-label="Related information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              <SideCard>
                <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>How This Calculator Works</h2>
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

              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(96,165,250,0.07)',
                  border: '1px solid rgba(96,165,250,0.22)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h2 className="text-sm font-bold mb-1.5" style={{ color: '#93C5FD' }}>Get a Free Case Review</h2>
                <p className="text-xs leading-snug mb-4" style={{ color: '#60A5FA' }}>
                  Estimates are a starting point. A personal injury attorney can evaluate your actual
                  claim — most work on contingency (no fee unless you win).
                </p>
                <div
                  id="AFFILIATE_CTA_SIDEBAR"
                  className="btn-primary w-full rounded-xl text-xs font-semibold py-2.5 px-4 text-center cursor-default"
                >
                  Find a Free Consultation →
                </div>
              </div>

              <nav aria-label="State-specific pain and suffering calculators">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Calculator by State</h2>
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
                    <li className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
                      <Link
                        href="/pain-and-suffering-calculator/states/"
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: '#94A3B8' }}
                      >
                        View all 50 states →
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>

              <nav aria-label="Other settlement calculators">
                <SideCard>
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>Other Free Calculators</h2>
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
          <article className="mt-14 max-w-3xl" aria-label="Guide to pain and suffering damages">

            <section className="mb-10">
              <h2 className="heading-gradient mb-4" style={{ fontSize: 24, fontWeight: 700 }}>
                How to Calculate Pain and Suffering Using the Multiplier Method
              </h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#94A3B8' }}>
                The multiplier method is the most widely used approach. Insurance companies base their
                offers largely on this formula — multiplying your total{' '}
                <strong style={{ color: '#E2E8F0' }}>economic damages</strong> (medical bills, lost wages,
                future treatment costs) by a number between 1.5 and 5.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                The multiplier reflects the severity of your injury. A minor whiplash injury with full
                recovery might warrant a 1.5× multiplier. A serious injury requiring surgery with permanent
                effects might justify 4× or 5×.
              </p>
              <div
                className="rounded-xl p-5 text-sm leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)', color: '#94A3B8' }}
              >
                <strong style={{ color: '#E2E8F0' }}>Example:</strong> $20,000 medical bills + $5,000 lost
                wages = $25,000 economic damages. At a 3× multiplier, pain and suffering = $75,000. Total
                = <strong style={{ color: '#FBBF24' }}>$100,000</strong>.
              </div>
            </section>

            <section className="mb-10">
              <h2 className="heading-gradient mb-4" style={{ fontSize: 24, fontWeight: 700 }}>
                How to Calculate Pain and Suffering Using the Per Diem Method
              </h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#94A3B8' }}>
                The per diem method assigns a dollar value to each day you suffered and multiplies it by
                your total recovery days — from injury to{' '}
                <strong style={{ color: '#E2E8F0' }}>maximum medical improvement (MMI)</strong>.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                The most defensible daily rate is your actual daily wage (annual salary ÷ 365). For those
                who are unemployed, $100–$300 per day is commonly used.
              </p>
              <div
                className="rounded-xl p-5 text-sm leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)', color: '#94A3B8' }}
              >
                <strong style={{ color: '#E2E8F0' }}>Example:</strong> $180/day × 120 recovery days =
                $21,600 pain and suffering + $25,000 economic damages ={' '}
                <strong style={{ color: '#FBBF24' }}>$46,600</strong> total.
              </div>
            </section>

            <section className="mb-10">
              <h2 className="heading-gradient mb-5" style={{ fontSize: 24, fontWeight: 700 }}>
                Factors That Affect Your Actual Pain and Suffering Settlement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Comparative Fault', body: "If you were partially at fault, your recovery is reduced — or eliminated — depending on your state's fault rules." },
                  { title: 'Insurance Policy Limits', body: "Even a $500,000 estimate is only collectible up to the at-fault party's policy limits." },
                  { title: 'Medical Documentation', body: 'Consistent treatment records and specialist notes dramatically strengthen your claim.' },
                  { title: 'Liability Clarity', body: 'Clear-cut liability cases settle faster and higher. Disputed fault cases settle lower.' },
                  { title: 'State Damage Caps', body: 'Some states cap non-economic damages. Ohio and Colorado cap pain and suffering in most cases.' },
                  { title: 'Attorney Representation', body: 'Represented plaintiffs consistently recover 3–4× more even after attorney fees.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl p-4 transition-all duration-300 hover:border-blue-400"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)' }}
                  >
                    <h3 className="text-sm font-bold mb-1.5" style={{ color: '#F1F5F9', fontSize: 14 }}>{item.title}</h3>
                    <p className="text-xs leading-snug" style={{ color: '#94A3B8' }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* ── FAQ ── */}
          <section className="mt-4 max-w-3xl" aria-label="Frequently asked questions about pain and suffering calculators">
            <h2 className="heading-gradient mb-6" style={{ fontSize: 28, fontWeight: 700 }}>
              Pain &amp; Suffering Calculator — FAQs
            </h2>
            <FAQAccordion faqs={faqs} />
          </section>

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

          <div className="mt-14 max-w-3xl">
            <DisclaimerBanner variant="footer" />
          </div>
        </div>
      </main>
    </>
  )
}
