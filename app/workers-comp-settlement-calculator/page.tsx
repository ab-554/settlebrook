// ═══════════════════════════════════════════════════════════════════════════════
// app/workers-comp-settlement-calculator/page.tsx
// FIXES:
//   C6 — Full OG + Twitter metadata added
//   C8 — BreadcrumbList JSON-LD + BreadcrumbNav component added
//   H10 — Title trimmed to 47 chars → 60 with template ✓
// ═══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'

export const metadata: Metadata = {
  // FIX H10: 47 chars → 60 total with template ✓
  title: 'Workers Comp Settlement Calculator — Free Tool',
  description:
    'Free workers compensation settlement calculator for USA workers. Estimate PPD, PTD, and wage loss benefits by state. Coming soon — use our pain and suffering calculator now.',
  alternates: { canonical: 'https://settlebrook.com/workers-comp-settlement-calculator/' },
  robots: { index: true, follow: true },
  // FIX C6: OG tags fully populated
  openGraph: {
    title: 'Workers Comp Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free workers compensation settlement calculator for USA workers. Estimate PPD, PTD, and wage loss benefits by state. Coming soon.',
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
  // FIX C6: Twitter card added
  twitter: {
    card: 'summary_large_image',
    site: '@settlebrook',
    title: 'Workers Comp Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Estimate your workers compensation settlement including PPD ratings, wage loss, and impairment benefits. Free tool — coming soon.',
    images: ['https://settlebrook.com/og-image.png'],
  },
}

// FIX C8: BreadcrumbList schema
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

export default function WorkersCompCalculatorStub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">

          <div className="mb-6">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Workers Comp Settlement Calculator', href: '/workers-comp-settlement-calculator/' },
            ]} />
          </div>

          <h1
            className="heading-gradient font-bold mb-5"
            style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Workers Comp Settlement Calculator
          </h1>

          <div
            className="rounded-2xl px-5 py-4 mb-8"
            style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.22)' }}
          >
            <p className="text-sm font-medium" style={{ color: '#60A5FA' }}>
              🔧 This calculator is in development. Use our{' '}
              <Link href="/pain-and-suffering-calculator/" className="underline font-semibold hover:opacity-80" style={{ color: '#93C5FD' }}>
                Pain &amp; Suffering Calculator
              </Link>{' '}
              to estimate your non-economic damages now.
            </p>
          </div>

          <article className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: '#94A3B8' }}>
            <p>
              A workers compensation settlement calculator estimates the value of a workers comp claim
              based on the nature and severity of your workplace injury, your average weekly wage, the
              type of benefit (temporary disability, permanent partial disability, or permanent total
              disability), and your state&apos;s benefit schedules.
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              How Are Workers Comp Settlements Calculated?
            </h2>
            <p>
              Workers compensation settlements fall into two categories:{' '}
              <strong style={{ color: '#E2E8F0' }}>structured settlements</strong> (ongoing weekly
              payments) and <strong style={{ color: '#E2E8F0' }}>lump-sum settlements</strong> (one-time
              payment closing the claim). Lump-sum amounts are calculated based on the present value of
              future benefits, your impairment rating, and your state&apos;s maximum benefit limits.
            </p>
            <p>
              Most states use a permanent partial disability (PPD) rating system — a physician assigns
              a percentage of impairment to your injured body part, and the settlement is calculated as
              a multiple of your average weekly wage times the weeks assigned to that impairment level.
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              Key Differences From Personal Injury Claims
            </h2>
            <p>
              Unlike personal injury claims, workers comp settlements do not include pain and suffering
              damages in most states. Workers comp is a no-fault system. In exchange, your recovery is
              limited to economic damages: medical treatment, wage replacement, and impairment benefits.
              If a third party caused your injury, you may be able to pursue both a workers comp claim
              and a separate personal injury lawsuit.
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              Estimate Your Damages Now
            </h2>
            <p>
              If your workplace injury was caused by a third party&apos;s negligence, our{' '}
              <Link href="/pain-and-suffering-calculator/" className="hover:opacity-80 font-medium" style={{ color: '#60A5FA' }}>
                Pain &amp; Suffering Calculator
              </Link>{' '}
              can help estimate the non-economic damages you may be entitled to pursue outside of
              workers comp.
            </p>
          </article>

          <div className="mt-8">
            <Link
              href="/pain-and-suffering-calculator/"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-2xl"
            >
              Use Pain &amp; Suffering Calculator →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
