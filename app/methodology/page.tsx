// ─────────────────────────────────────────────────────────────────────────────
// app/methodology/page.tsx
// E-E-A-T transparency page — discloses formulas, sources, review cadence,
// and editorial boundaries. Structure mirrors app/about/page.tsx:
//   • Same metadata shape (title without " | Settlebrook" — template appends it)
//   • Same hero styling (no ad slots — Auto Ads only, per 2026-09-23 cleanup)
//   • Same glassmorphism + muted-prose styling
// Adds BreadcrumbNav and WebPage + BreadcrumbList JSON-LD, which about/ lacks.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'

const canonicalUrl = '/methodology/'

export const metadata: Metadata = {
  // Title stays short — the root layout template appends " | Settlebrook" (13 chars)
  title: 'How Settlebrook Works — Methodology',
  description:
    'How Settlebrook calculates settlement estimates and verifies state law. Formulas, official sources, and update schedule — fully disclosed.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'How Settlebrook Works — Methodology | Settlebrook',
    description:
      'How Settlebrook calculates settlement estimates and verifies state law. Formulas, official sources, and update schedule — fully disclosed.',
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Settlebrook — Methodology and Editorial Standards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Settlebrook Works — Methodology | Settlebrook',
    description:
      'How Settlebrook calculates settlement estimates and verifies state law. Formulas, official sources, and update schedule — fully disclosed.',
    images: ['/og-image.png'],
  },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'How Settlebrook Works — Methodology',
  url: canonicalUrl,
  description:
    'How Settlebrook calculates settlement estimates and verifies state law. Formulas, official sources, and update schedule — fully disclosed.',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Settlebrook',
    url: 'https://www.settlebrook.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Settlebrook',
    url: 'https://www.settlebrook.com',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Methodology', item: canonicalUrl },
  ],
}

export default function MethodologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen">

        {/* ── HEADER BAND ── */}
        <header className="page-band">
          <div className="container-page py-8 sm:py-12">
            <p className="eyebrow mb-2">Open Formulas · Cited Sources · No Data Collection</p>
            <h1>How Settlebrook Works</h1>
            <p className="lede mt-3 max-w-2xl">
              Every formula we run, every source we verify against, and every limit
              on what these tools can tell you.
            </p>
          </div>
        </header>

        {/* Main content */}
        <article className="container-page py-10 sm:py-14 flex flex-col gap-10">

          {/* Breadcrumb */}
          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Methodology', href: canonicalUrl },
            ]}
          />

          {/* Formulas */}
          <section aria-labelledby="formulas-heading">
            <h2
              id="formulas-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              Our Formulas Are Public
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Every calculator on Settlebrook uses the two methods actually used in
                US personal injury practice: the multiplier method, which multiplies
                economic damages by a severity factor from 1.5x to 5.0x, and the per
                diem method, which multiplies a daily rate by the number of recovery
                days. We do not use proprietary black-box scoring.
              </p>
              <p>
                The exact formula each tool runs is described on the tool page itself.
                Your inputs never leave your browser — Settlebrook collects no personal
                data and requires no signup.
              </p>
            </div>
          </section>

          {/* Sources */}
          <section aria-labelledby="sources-heading">
            <h2
              id="sources-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              State Law Figures Come From Official Sources
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Statutory figures on Settlebrook state pages — maximum weekly benefit
                rates, damage caps, statutes of limitations, and fault rules — are
                verified against primary sources: state statutes, state workers
                compensation agencies, and published court decisions. That includes
                agencies such as the Pennsylvania Department of Labor and Industry,
                the Ohio Bureau of Workers Compensation, and the Arizona Industrial
                Commission.
              </p>
              <p>
                Where a recent law changed the rules, we state the current rule rather
                than the outdated one still repeated on many websites. Florida&apos;s 2023
                HB 837 reform is a clear example: it moved Florida to modified
                comparative fault and shortened the negligence statute of limitations
                to two years, and our Florida pages reflect that.
              </p>
            </div>
          </section>

          {/* Review cadence */}
          <section aria-labelledby="review-heading">
            <h2
              id="review-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              How Often Content Is Reviewed
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                State pages are reviewed against current law on a rolling basis, and
                each page displays its last review date. When a legislature changes a
                benefit schedule, cap, or deadline, the affected pages are updated as
                part of the next review cycle.
              </p>
            </div>
          </section>

          {/* Boundaries */}
          <section aria-labelledby="boundaries-heading">
            <h2
              id="boundaries-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              What Settlebrook Deliberately Does Not Do
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Settlebrook does not provide legal advice, does not evaluate individual
                cases, does not connect users with law firms in exchange for fees, and
                does not collect or sell user data.
              </p>
              <p>
                The calculators produce informational estimates. Actual settlement
                values depend on evidence, insurance limits, venue, and negotiation —
                factors no calculator can assess. Anyone with an active claim should
                consult a licensed attorney in their state.
              </p>
            </div>
          </section>

          {/* Who runs it */}
          <section aria-labelledby="who-heading">
            <h2
              id="who-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              Who Runs Settlebrook
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Settlebrook is an independent editorial project. Content is produced and
                reviewed under the standards on this page, and every calculator page
                carries a disclaimer and a plain-language explanation of its method.
              </p>
              <p>
                Questions or corrections: use the{' '}
                <Link href="/contact/" className="text-link">
                  contact page
                </Link>
                . Corrections to legal figures are prioritized. See our{' '}
                <Link href="/editorial-policy/" className="text-link">
                  editorial policy
                </Link>
                {' '}for our full sourcing standards, review cycle, and corrections process.
              </p>
            </div>
          </section>

        </article>

      </main>
    </>
  )
}
