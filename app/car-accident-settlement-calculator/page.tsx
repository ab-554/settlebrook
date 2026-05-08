// ═══════════════════════════════════════════════════════════════════════════════
// app/car-accident-settlement-calculator/page.tsx
// FIXES:
//   C5 — Full OG + Twitter metadata added
//   C7 — BreadcrumbList JSON-LD + BreadcrumbNav component added
//   H9 — Title trimmed to 47 chars → 60 with template ✓
// ═══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'

export const metadata: Metadata = {
  // FIX H9: 47 chars → 60 total with template ✓
  title: 'Car Accident Settlement Calculator — Free Tool',
  description:
    'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value. Coming soon — use our pain and suffering calculator now.',
  alternates: { canonical: 'https://settlebrook.com/car-accident-settlement-calculator/' },
  robots: { index: true, follow: true },
  // FIX C5: OG tags fully populated
  openGraph: {
    title: 'Car Accident Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Free car accident settlement calculator for USA victims. Estimate economic damages, pain and suffering, and total settlement value. Coming soon.',
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
  // FIX C5: Twitter card added
  twitter: {
    card: 'summary_large_image',
    site: '@settlebrook',
    title: 'Car Accident Settlement Calculator — Free Tool | Settlebrook',
    description:
      'Estimate your car accident settlement value including medical bills, lost wages, and pain and suffering. Free tool — coming soon.',
    images: ['https://settlebrook.com/og-image.png'],
  },
}

// FIX C7: BreadcrumbList schema
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

export default function CarAccidentCalculatorStub() {
  return (
    <>
      {/* FIX C7: BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">

          {/* FIX C7: BreadcrumbNav component replaces the plain back link */}
          <div className="mb-6">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Car Accident Settlement Calculator', href: '/car-accident-settlement-calculator/' },
            ]} />
          </div>

          {/* H1 contains primary keyword ✓ */}
          <h1
            className="heading-gradient font-bold mb-5"
            style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Car Accident Settlement Calculator
          </h1>

          <div
            className="rounded-2xl px-5 py-4 mb-8"
            style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.22)' }}
          >
            <p className="text-sm font-medium" style={{ color: '#60A5FA' }}>
              🔧 This calculator is currently in development. Use our{' '}
              <Link
                href="/pain-and-suffering-calculator/"
                className="underline font-semibold hover:opacity-80"
                style={{ color: '#93C5FD' }}
              >
                Pain &amp; Suffering Calculator
              </Link>{' '}
              to estimate your non-economic damages now.
            </p>
          </div>

          <article className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: '#94A3B8' }}>
            <p>
              A car accident settlement calculator estimates the total value of your personal injury
              claim following a vehicle collision. Car accident settlements typically include two
              categories:{' '}
              <strong style={{ color: '#E2E8F0' }}>economic damages</strong> (medical bills, vehicle
              repair, lost wages, future medical costs) and{' '}
              <strong style={{ color: '#E2E8F0' }}>non-economic damages</strong> (pain and suffering,
              emotional distress, loss of enjoyment of life).
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              What Factors Affect a Car Accident Settlement?
            </h2>
            <p>
              Car accident settlement values depend heavily on your state&apos;s fault rules, injury
              severity, the at-fault driver&apos;s insurance policy limits, and the quality of your medical
              documentation. States like California and New York use pure comparative fault rules.
              Texas and most other states use a modified comparative fault rule with a 51% bar.
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              How Are Car Accident Settlements Calculated?
            </h2>
            <p>
              Most car accident settlements are calculated using the multiplier method — your total
              economic damages are multiplied by a factor between 1.5 and 5 to arrive at a pain and
              suffering figure. Insurance companies use claims management software (most commonly
              Colossus) that applies multipliers based on injury type, treatment duration, and
              supporting medical records.
            </p>

            <h2 className="heading-gradient" style={{ fontSize: 22, fontWeight: 700 }}>
              Estimate Pain &amp; Suffering Now
            </h2>
            <p>
              While the full car accident settlement calculator is in development, use our{' '}
              <Link
                href="/pain-and-suffering-calculator/"
                className="hover:opacity-80 font-medium"
                style={{ color: '#60A5FA' }}
              >
                Pain &amp; Suffering Calculator
              </Link>{' '}
              to estimate your non-economic damages today.
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

          <nav aria-label="State pain and suffering calculators" className="mt-12">
            <h2 className="text-sm font-bold mb-4" style={{ color: '#94A3B8' }}>
              State-Specific Pain &amp; Suffering Calculators
            </h2>
            <ul className="flex flex-wrap gap-4">
              {[
                { slug: 'california', name: 'California' },
                { slug: 'texas', name: 'Texas' },
                { slug: 'florida', name: 'Florida' },
                { slug: 'new-york', name: 'New York' },
              ].map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/pain-and-suffering-calculator/${state.slug}/`}
                    className="text-sm hover:opacity-80 transition-colors"
                    style={{ color: '#60A5FA' }}
                  >
                    {state.name} Pain &amp; Suffering Calculator
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </>
  )
}
