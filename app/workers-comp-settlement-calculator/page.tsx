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
import HeroBand, { type HeroFact } from '@/components/ui/HeroBand'
import EditorialLayout from '@/components/ui/EditorialLayout'
import DisclaimerBanner from '@/components/calculator/DisclaimerBanner'
import { WORKERS_COMP_FAQS, buildWorkersCompFAQSchema } from '@/lib/data/workersCompFaqs'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'
import SourcesSection from '@/components/seo/SourcesSection'
import BackToCalculator from '@/components/calculator/BackToCalculator'
import { buildNextSteps } from '@/lib/nextSteps'
import sourcesData from '@/lib/data/sources.json'
import { getBlogPostBySlug, isPostPublished } from '@/lib/data/blogPosts'

const weeklyBenefitPost = getBlogPostBySlug('/blog/workers-comp-weekly-benefit-calculator/')
const isWeeklyBenefitPostLive = !!weeklyBenefitPost && isPostPublished(weeklyBenefitPost)

// Contextual cards shown under a result (built server-side, see lib/nextSteps.ts).
const NEXT_STEPS = buildNextSteps({ tool: 'workers-comp' })

// E-E-A-T review stamp. Bump this one string when the page is re-verified
// against current law - nothing else needs to change.
// Updated 2026-09-24: legal accuracy sprint fixed a stale weekly-cap figure.
const LAST_REVIEWED = 'September 2026'

const HUB_SOURCES = (sourcesData['workers-comp'] as Record<string, { label: string; url: string; supports: string; tier: 'primary' | 'secondary' }[]>)['main'] ?? []

// ─── Metadata ─────────────────────────────────────────────────────────────────

// Hero chips — true facts about this tool.
const INDEXED_WC_STATES = WORKERS_COMP_STATES.filter((s) => !NOINDEXED_WORKERS_COMP_SLUGS.has(s.slug))
const HERO_FACTS: HeroFact[] = [
  { label: 'Benefit types', value: 'TTD, PPD and PTD', icon: 'layers', tone: 'primary' },
  { label: 'Weekly caps', value: 'Official rates for 50 states + DC', icon: 'wallet', href: '/workers-comp-maximum-weekly-benefits-by-state/' },
  { label: 'State guides', value: `${INDEXED_WC_STATES.length} states with local law`, icon: 'map', href: '#by-state' },
]

export const metadata: Metadata = {
  title: 'Workers Comp Settlement Calculator — Free Tool',
  description:
    'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state. Enter your weekly wage and impairment rating for an instant estimate.',
  alternates: { canonical: '/workers-comp-settlement-calculator/' },
  openGraph: {
    title: 'Workers Comp Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state. Enter your weekly wage and impairment rating for an instant estimate.',
    url: '/workers-comp-settlement-calculator/',
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Workers Comp Settlement Calculator',
  url: 'https://www.settlebrook.com/workers-comp-settlement-calculator/',
  description:
    'Free workers compensation settlement calculator. Estimate TTD, PPD, and PTD benefits by state based on your weekly wage and impairment rating.',
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
      name: 'Workers Comp Settlement Calculator',
      item: 'https://www.settlebrook.com/workers-comp-settlement-calculator/',
    },
  ],
}

const faqSchema = buildWorkersCompFAQSchema(WORKERS_COMP_FAQS)

// ─── Sidebar glassmorphism card wrapper ───────────────────────────────────────

function SideCard({ children }: { children: React.ReactNode }) {
  return <div className="card-flat card-pad">{children}</div>
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function WorkersCompCalculatorPage() {

  // Right rail (sticky from 1200px): the related-links cards that used to be the sidebar.
  const rail = (
    <>
            <SideCard>
              <h2 className="font-body font-semibold mb-3" style={{ fontSize: 16 }}>How This Calculator Works</h2>
              <ol className="flex flex-col gap-2.5">
                {[
                  'Choose your state and enter your Average Weekly Wage (AWW).',
                  'Select your benefit type: Temporary Total (TTD), Permanent Partial (PPD), or Permanent Total (PTD).',
                  'Enter your treatment weeks, body part and impairment rating, or age, and calculate your estimate.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'var(--ink-2)' }}>
                    <span className="calc-step-badge" style={{ width: 22, height: 22, fontSize: 14 }} aria-hidden="true">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SideCard>

            <SideCard>
              <h3 className="font-body font-semibold mb-1" style={{ fontSize: 16 }}>No Pain &amp; Suffering Covered</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
                Workers compensation is a no-fault system that does not cover non-economic damages. To estimate those, use our separate <Link href="/pain-and-suffering-calculator/" className="text-link font-semibold">pain and suffering calculator</Link>.
              </p>
              <Link href="/pain-and-suffering-calculator/" className="btn-secondary btn-sm w-full">
                Calculate Pain &amp; Suffering →
              </Link>
            </SideCard>

            <nav aria-label="State-specific workers comp settlement calculators">
              <SideCard>
                <h2 className="font-body font-semibold mb-2" style={{ fontSize: 16 }}>Calculator by State</h2>
                <ul className="flex flex-col">
                  {WORKERS_COMP_STATES.filter((s) => s.slug === 'california' || s.slug === 'texas' || s.slug === 'florida').map((state) => (
                    <li key={state.slug}>
                      <Link href={`/workers-comp-settlement-calculator/${state.slug}/`} className="flex items-center justify-between text-sm py-2 text-link" style={{ textDecoration: 'none' }}>
                        <span>{state.name}</span>
                        <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>→</span>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 mt-1" style={{ borderTop: '1px solid var(--line)' }}>
                    <a href="#by-state" className="text-xs font-semibold inline-block py-1" style={{ color: 'var(--ink-3)' }}>All indexed states ↓</a>
                  </li>
                </ul>
              </SideCard>
            </nav>

            <nav aria-label="Workers comp benefit rate reference">
              <SideCard>
                <h2 className="font-body font-semibold mb-2" style={{ fontSize: 16 }}>Benefit Rate Reference</h2>
                <Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="flex flex-col py-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Max Weekly Benefits by State (2026)</span>
                  <span className="text-xs" style={{ color: 'var(--ink-3)' }}>Official max/min TTD rate for every state</span>
                </Link>
              </SideCard>
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
                    <Link href="/car-accident-settlement-calculator/" className="flex flex-col py-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Car Accident Settlement Calculator</span>
                      <span className="text-xs" style={{ color: 'var(--ink-3)' }}>Estimate total vehicle accident damages</span>
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
            { label: 'Workers Comp Settlement Calculator', href: '/workers-comp-settlement-calculator/' },
          ]}
          title={<>Workers Comp Settlement Calculator</>}
          promise={<>
            Estimate your TTD, PPD, or PTD workers compensation benefits by state. Free, instant, no signup required.
          </>}
          reviewed={LAST_REVIEWED}
          sourcesCount={HUB_SOURCES.length}
          facts={HERO_FACTS}
          factsLabel="What this calculator covers"
        />

        {/* ── CALCULATOR (live estimate) ── */}
        <div className="container-page calc-container pt-8 pb-10 sm:pt-10 sm:pb-14">
          <WorkersCompCalculator nextSteps={NEXT_STEPS} />
        </div>

        {/* ── EDITORIAL — sticky TOC · prose · tools rail (three columns from 1200px) ── */}
        <div className="container-page pb-14 sm:pb-20">
          <BackToCalculator targetId="calculator" />
          <EditorialLayout rootId="editorial-root" backHref="#calculator" rail={rail}>

          {/* ── EDITORIAL CONTENT ── */}
          <article className="editorial">
            
            {/* Section 1: What Workers Comp Settlements Cover */}
            <h2
              className="heading-display h2-editorial"
            >
              What Workers Comp Settlements Cover
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              A workers&apos; compensation settlement is a legally binding agreement that resolves a workplace injury claim, usually in exchange for a lump-sum payment or structured ongoing payments. Unlike personal injury lawsuits, workers&apos; comp is a no-fault system, which means you do not have to prove your employer was negligent to receive benefits. In exchange for this automatic coverage, you give up the right to sue your employer and cannot recover compensation for pain and suffering.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              A standard workers&apos; compensation settlement typically covers three core areas of financial exposure:
            </p>
            <ul style={{ color: 'var(--ink-2)', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Reasonable and Necessary Medical Care:</strong> This includes all past medical treatments, hospitalizations, surgeries, physical therapy, medications, and any projected future medical costs associated with the injury.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Wage Replacement Benefits:</strong> This compensates for the income lost during the period you are unable to work. Temporary Total Disability (TTD) benefits are paid during active recovery, while Permanent Partial Disability (PPD) or Permanent Total Disability (PTD) benefits compensate for long-term or permanent losses.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Vocational Rehabilitation:</strong> If your injury prevents you from returning to your previous job, some states cover the cost of retraining, educational courses, and job placement assistance.
              </li>
            </ul>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            {/* Section 2: How the Formula Works */}
            <h2
              className="heading-display h2-editorial"
            >
              How the Formula Works (AWW × benefit rate × impairment weeks)
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              The statutory formula for permanent partial disability (PPD) settlements is standardized in most states. It relies on three primary variables: your Average Weekly Wage (AWW), the state-specified benefit rate, and the scheduled number of weeks assigned to the injured body part, adjusted by your impairment rating.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Here is the standard formula:
            </p>
            <div
              className="rounded-xl p-5 mb-5 font-mono text-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--primary)' }}
            >
              PPD Benefit = Weekly Benefit Amount × Scheduled Body Part Weeks × (Impairment Rating % / 100)
            </div>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Let&apos;s break down each component:
            </p>
            <ul style={{ color: 'var(--ink-2)', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Average Weekly Wage (AWW):</strong> Calculated from your gross earnings (including overtime and bonuses) in the weeks preceding the injury.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Weekly Benefit Amount:</strong> In most states, this is exactly two-thirds (66.67%) of your AWW, subject to a statutory maximum weekly cap set by the state — each state page on this site shows the current verified cap and its effective period next to it.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Scheduled Body Part Weeks:</strong> Every state maintains a schedule of benefits assigning a maximum number of weeks of compensation for specific body parts (e.g., an arm might be worth 269 weeks in California or 200 weeks in Texas).
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Impairment Rating:</strong> Once you reach maximum medical improvement, a physician determines the permanent loss of function as a percentage from 0% to 100%. If an arm is rated at 10% impairment, you receive 10% of the maximum weeks for that arm.
              </li>
            </ul>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            {/* Section 3: TTD vs PPD vs PTD explained */}
            <h2
              className="heading-display h2-editorial"
            >
              TTD vs PPD vs PTD Explained
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Workers&apos; compensation programs categorize disability benefits into distinct types based on the duration of the disability and whether the injury results in a permanent impairment. Understanding these categories is essential for predicting your settlement value.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Temporary Total Disability (TTD):</strong> TTD benefits are paid while you are actively recovering under a doctor&apos;s care and are completely unable to perform your regular job duties. These payments act as weekly wage replacement (typically 66.67% of your gross AWW) and stop once your doctor releases you to return to work or determines you have reached Maximum Medical Improvement (MMI). Most states cap TTD benefits at 104 weeks (2 years).
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Permanent Partial Disability (PPD):</strong> If you have recovered as much as medically possible but are left with a permanent physical loss of function (such as restricted range of motion in a joint, loss of hearing, or loss of a digit), you qualify for PPD benefits. PPD is calculated using the scheduled body part weeks and your impairment rating. It does not require you to be completely unable to work; you can receive PPD even if you return to your regular job.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--ink)' }}>Permanent Total Disability (PTD):</strong> If your workplace injury is so severe that it permanently prevents you from returning to any gainful employment, you may qualify for PTD benefits. PTD cases typically involve catastrophic injuries, such as blindness, loss of multiple limbs, or severe traumatic brain injuries. PTD settlements represent the present value of a lifetime stream of weekly benefits, adjusted for your life expectancy and discounted for a lump-sum payment.
            </p>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            {/* Section 4: When to Get an Attorney */}
            <h2
              className="heading-display h2-editorial"
            >
              When to Get an Attorney
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              For minor injuries with a clear recovery timeline, a full return to work, and cooperative insurance companies, you can often handle the claim yourself. However, workers&apos; compensation insurers are motivated to close files for the lowest possible cost, and certain situations make retaining an attorney highly advisable.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Consider consulting an experienced workers&apos; compensation attorney if:
            </p>
            <ul style={{ color: 'var(--ink-2)', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px', lineHeight: '1.8' }}>
              <li>
                <strong style={{ color: 'var(--ink)' }}>Your claim is denied:</strong> Insurers often deny claims by arguing the injury occurred outside of work hours or was caused by a pre-existing condition.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>You receive a low impairment rating:</strong> If your treating physician assigned an impairment rating that you feel does not reflect your actual physical limitations, an attorney can dispute it and request an Independent Medical Examination (IME).
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>You are offered a lump-sum settlement:</strong> Insurance companies frequently offer lump-sum settlements that fail to fully account for future medical needs, surgeries, or permanent earning capacity loss. An attorney can evaluate the true value of your future claims.
              </li>
              <li>
                <strong style={{ color: 'var(--ink)' }}>You have a pre-existing condition:</strong> The insurer will try to blame your pain on your pre-existing condition to reduce your benefit payout.
              </li>
            </ul>

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <SourcesSection sources={HUB_SOURCES} />

            <h2
              className="heading-display h2-editorial"
            >
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={WORKERS_COMP_FAQS} />

            {isWeeklyBenefitPostLive && (
              <>
                <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

                <h2
                  className="heading-display h2-editorial"
                >
                  Related Guides
                </h2>
                <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
                  <li style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '8px' }}>
                    <Link href="/blog/workers-comp-weekly-benefit-calculator/" style={{ color: 'var(--primary)' }}>How Your Workers&apos; Comp Weekly Check Is Calculated</Link> — average weekly wage, the 66 2/3% rate, state max/min caps, and waiting periods explained.
                  </li>
                </ul>
              </>
            )}

            <hr style={{ borderColor: 'var(--line)', margin: '40px 0' }} />

            <h2
              className="heading-display h2-editorial"
            >
              Get Your Estimate Now
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Your employer&apos;s insurance provider has professionals working to minimize the value of your claim. Arm yourself with standard legal math before negotiating any final settlement.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '20px' }}>
              Scroll up to the calculator to enter your wages and injury parameters for an instant estimate.
            </p>

          </article>

          {/* ── STATE GRID ── */}
          <section
            id="by-state"
            className="mt-12 prose-col"
            aria-label="Workers comp settlement calculator by state"
            style={{ scrollMarginTop: 'calc(var(--header-h) + 12px)' }}
          >
            <h2 className="heading-display" style={{ fontSize: 26, marginBottom: 6 }}>
              Workers Comp Settlement Calculator by State
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-2)' }}>
              Select your state for a workers compensation calculator reflecting local replacement rates, weekly caps, and body part schedules.
            </p>
            <ul className="flex flex-wrap gap-2">
              {WORKERS_COMP_STATES.filter((state) => !NOINDEXED_WORKERS_COMP_SLUGS.has(state.slug)).map((state) => (
                <li key={state.slug}>
                  <Link href={`/workers-comp-settlement-calculator/${state.slug}/`} className="picker-link" style={{ minHeight: 40 }}>
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
