// ─────────────────────────────────────────────────────────────────────────────
// app/workers-comp-settlement-calculator/page.tsx
// Tool #3 — Workers Comp Settlement Calculator main production page.
// Mirrors car-accident-settlement-calculator/page.tsx structure:
//   • Full metadata (OG, Twitter, canonical, robots)
//   • Three JSON-LD schemas: WebApplication, FAQPage, BreadcrumbList
//   • Hero header with H1, subheading, trust badges, and breadcrumb
//   • Two-column layout: WorkersCompCalculator on left, sidebar on right
//   • Editorial content section (workers-comp-specific)
//   • FAQ accordion driven by workersCompFaqs.ts
//   • State grid linking to /workers-comp-settlement-calculator/[state]/
//   • DisclaimerBanner footer variant
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import WorkersCompCalculator from '@/components/calculator/WorkersCompCalculator'
import FAQAccordion from '@/components/seo/FAQAccordion'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { WORKERS_COMP_FAQS, buildWorkersCompFAQSchema } from '@/lib/data/workersCompFaqs'
import { WORKERS_COMP_STATES } from '@/lib/data/workersCompStates'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Workers Comp Settlement Calculator — Free Tool',
  description:
    'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state. Enter your weekly wage and impairment rating for an instant estimate.',
  alternates: { canonical: '/workers-comp-settlement-calculator/' },
  openGraph: {
    title: 'Workers Comp Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state. Enter your weekly wage and impairment rating for an instant estimate.',
    url: 'https://settlebrook.com/workers-comp-settlement-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://settlebrook.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Workers Comp Settlement Calculator — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@settlebrook',
    title: 'Workers Comp Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state. Enter your weekly wage and impairment rating for an instant estimate.',
    images: ['https://settlebrook.com/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Workers Comp Settlement Calculator',
  url: 'https://settlebrook.com/workers-comp-settlement-calculator/',
  description:
    'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state based on your weekly wage and impairment rating.',
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
      name: 'Workers Comp Settlement Calculator',
      item: 'https://settlebrook.com/workers-comp-settlement-calculator/',
    },
  ],
}

const faqSchema = buildWorkersCompFAQSchema(WORKERS_COMP_FAQS)

// ─── Local Ad Slot placeholder ────────────────────────────────────────────────

function AdSlot({ id }: { id: string }) {
  return (
    <div
      id={id}
      aria-label="Advertisement"
      className="w-full min-h-[90px] rounded-xl flex items-center justify-center my-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(99,179,237,0.10)' }}
    >
      <span className="text-xs select-none" style={{ color: 'rgba(148,163,184,0.22)' }}>{id}</span>
    </div>
  )
}

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

// ─── Page Component ───────────────────────────────────────────────────────────

export default function WorkersCompCalculatorPage() {
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

        {/* ── PAGE HEADER / HERO ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Workers Comp Settlement Calculator', href: '/workers-comp-settlement-calculator/' },
            ]} />
            <div className="mt-4">
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}
              >
                Workers Comp Settlement Calculator
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                Estimate your TTD, PPD, or PTD workers compensation benefits by state. Free, instant, no signup required.
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
          
          <AdSlot id="WC_MAIN_AD_TOP" />

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Calculator Column */}
            <div className="w-full lg:flex-1 min-w-0 overflow-hidden" style={{ minWidth: 0, overflow: 'hidden' }}>
              <WorkersCompCalculator />
            </div>

            {/* Sidebar Column */}
            <aside aria-label="Related information" className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

              {/* How it works */}
              <SideCard>
                <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                  How This Calculator Works
                </h2>
                <div className="flex flex-col gap-3" style={{ color: '#94A3B8' }}>
                  {[
                    'Choose your state and enter your Average Weekly Wage (AWW).',
                    'Select your benefit type: Temporary Total (TTD), Permanent Partial (PPD), or Permanent Total (PTD).',
                    'Enter your treatment weeks, body part and impairment rating, or age, and calculate your estimate.',
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

              {/* Pain & Suffering Note */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  No Pain &amp; Suffering Covered
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Workers compensation is a no-fault system that does not cover non-economic damages. To estimate those, use our separate <Link href="/pain-and-suffering-calculator/" className="underline font-semibold hover:opacity-80" style={{ color: '#60A5FA' }}>pain and suffering calculator</Link>.
                </p>
                <Link
                  href="/pain-and-suffering-calculator/"
                  style={{ display: 'block', textAlign: 'center', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#FFFFFF', textDecoration: 'none' }}
                >
                  Calculate Pain &amp; Suffering →
                </Link>
              </div>

              {/* State links — CA, TX, FL */}
              <nav aria-label="State-specific workers comp settlement calculators">
                <SideCard>
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: '#F1F5F9' }}>
                    Calculator by State
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {WORKERS_COMP_STATES.filter((s) => s.slug === 'california' || s.slug === 'texas' || s.slug === 'florida').map((state) => (
                      <li key={state.slug}>
                        <Link
                          href={`/workers-comp-settlement-calculator/${state.slug}/`}
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
                      <Link href="/car-accident-settlement-calculator/" className="flex flex-col gap-0.5 group">
                        <span className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#60A5FA' }}>
                          Car Accident Settlement Calculator
                        </span>
                        <span className="text-xs" style={{ color: '#475569' }}>Estimate total vehicle accident damages</span>
                      </Link>
                    </li>
                  </ul>
                </SideCard>
              </nav>

            </aside>
          </div>

          {/* ── EDITORIAL CONTENT ── */}
          <article style={{ margin: '0 auto' }}>
            
            {/* Section 1: What Workers Comp Settlements Cover */}
            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              What Workers Comp Settlements Cover
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              A workers&apos; compensation settlement is a legally binding agreement that resolves a workplace injury claim, usually in exchange for a lump-sum payment or structured ongoing payments. Unlike personal injury lawsuits, workers&apos; comp is a no-fault system, which means you do not have to prove your employer was negligent to receive benefits. In exchange for this automatic coverage, you give up the right to sue your employer and cannot recover compensation for pain and suffering.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              A standard workers&apos; compensation settlement typically covers three core areas of financial exposure:
            </p>
            <ul style={{ color: '#94A3B8', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Reasonable and Necessary Medical Care:</strong> This includes all past medical treatments, hospitalizations, surgeries, physical therapy, medications, and any projected future medical costs associated with the injury.
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Wage Replacement Benefits:</strong> This compensates for the income lost during the period you are unable to work. Temporary Total Disability (TTD) benefits are paid during active recovery, while Permanent Partial Disability (PPD) or Permanent Total Disability (PTD) benefits compensate for long-term or permanent losses.
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Vocational Rehabilitation:</strong> If your injury prevents you from returning to your previous job, some states cover the cost of retraining, educational courses, and job placement assistance.
              </li>
            </ul>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            {/* Section 2: How the Formula Works */}
            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              How the Formula Works (AWW × benefit rate × impairment weeks)
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              The statutory formula for permanent partial disability (PPD) settlements is standardized in most states. It relies on three primary variables: your Average Weekly Wage (AWW), the state-specified benefit rate, and the scheduled number of weeks assigned to the injured body part, adjusted by your impairment rating.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Here is the standard formula:
            </p>
            <div
              className="rounded-xl p-5 mb-5 font-mono text-sm"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,179,237,0.10)', color: '#60A5FA' }}
            >
              PPD Benefit = Weekly Benefit Amount × Scheduled Body Part Weeks × (Impairment Rating % / 100)
            </div>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Let&apos;s break down each component:
            </p>
            <ul style={{ color: '#94A3B8', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Average Weekly Wage (AWW):</strong> Calculated from your gross earnings (including overtime and bonuses) in the weeks preceding the injury.
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Weekly Benefit Amount:</strong> In most states, this is exactly two-thirds (66.67%) of your AWW, subject to a statutory maximum weekly cap set by the state (for example, California caps benefits at $1,619 per week, and Texas caps it at $1,066 per week for 2026).
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Scheduled Body Part Weeks:</strong> Every state maintains a schedule of benefits assigning a maximum number of weeks of compensation for specific body parts (e.g., an arm might be worth 269 weeks in California or 200 weeks in Texas).
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Impairment Rating:</strong> Once you reach maximum medical improvement, a physician determines the permanent loss of function as a percentage from 0% to 100%. If an arm is rated at 10% impairment, you receive 10% of the maximum weeks for that arm.
              </li>
            </ul>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            {/* Section 3: TTD vs PPD vs PTD explained */}
            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              TTD vs PPD vs PTD Explained
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Workers&apos; compensation programs categorize disability benefits into distinct types based on the duration of the disability and whether the injury results in a permanent impairment. Understanding these categories is essential for predicting your settlement value.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Temporary Total Disability (TTD):</strong> TTD benefits are paid while you are actively recovering under a doctor&apos;s care and are completely unable to perform your regular job duties. These payments act as weekly wage replacement (typically 66.67% of your gross AWW) and stop once your doctor releases you to return to work or determines you have reached Maximum Medical Improvement (MMI). Most states cap TTD benefits at 104 weeks (2 years).
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Permanent Partial Disability (PPD):</strong> If you have recovered as much as medically possible but are left with a permanent physical loss of function (such as restricted range of motion in a joint, loss of hearing, or loss of a digit), you qualify for PPD benefits. PPD is calculated using the scheduled body part weeks and your impairment rating. It does not require you to be completely unable to work; you can receive PPD even if you return to your regular job.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#E2E8F0' }}>Permanent Total Disability (PTD):</strong> If your workplace injury is so severe that it permanently prevents you from returning to any gainful employment, you may qualify for PTD benefits. PTD cases typically involve catastrophic injuries, such as blindness, loss of multiple limbs, or severe traumatic brain injuries. PTD settlements represent the present value of a lifetime stream of weekly benefits, adjusted for your life expectancy and discounted for a lump-sum payment.
            </p>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            {/* Section 4: When to Get an Attorney */}
            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              When to Get an Attorney
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              For minor injuries with a clear recovery timeline, a full return to work, and cooperative insurance companies, you can often handle the claim yourself. However, workers&apos; compensation insurers are motivated to close files for the lowest possible cost, and certain situations make retaining an attorney highly advisable.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Consider consulting an experienced workers&apos; compensation attorney if:
            </p>
            <ul style={{ color: '#94A3B8', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: '#E2E8F0' }}>Your claim is denied:</strong> Insurers often deny claims by arguing the injury occurred outside of work hours or was caused by a pre-existing condition.
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>You receive a low impairment rating:</strong> If your treating physician assigned an impairment rating that you feel does not reflect your actual physical limitations, an attorney can dispute it and request an Independent Medical Examination (IME).
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>You are offered a lump-sum settlement:</strong> Insurance companies frequently offer lump-sum settlements that fail to fully account for future medical needs, surgeries, or permanent earning capacity loss. An attorney can evaluate the true value of your future claims.
              </li>
              <li>
                <strong style={{ color: '#E2E8F0' }}>You have a pre-existing condition:</strong> The insurer will try to blame your pain on your pre-existing condition to reduce your benefit payout.
              </li>
            </ul>

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={WORKERS_COMP_FAQS} />

            <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '40px 0' }} />

            <h2
              className="heading-gradient"
              style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', marginTop: '48px' }}
            >
              Get Your Estimate Now
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Your employer&apos;s insurance provider has professionals working to minimize the value of your claim. Arm yourself with standard legal math before negotiating any final settlement.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '20px' }}>
              Scroll up to the calculator to enter your wages and injury parameters for an instant estimate.
            </p>

          </article>

          {/* ── STATE GRID ── */}
          <section className="mt-14 max-w-3xl" aria-label="Workers comp settlement calculator by state">
            <h2
              className="heading-gradient mb-2"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Workers Comp Settlement Calculator by State
            </h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              Select your state for a workers compensation calculator reflecting local replacement rates, weekly caps, and body part schedules.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORKERS_COMP_STATES.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/workers-comp-settlement-calculator/${state.slug}/`}
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

          <AdSlot id="WC_MAIN_AD_BOTTOM" />

          <div className="w-full">
            <DisclaimerBanner variant="footer" />
          </div>

        </div>

      </main>
    </>
  )
}
