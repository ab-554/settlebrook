// ─────────────────────────────────────────────────────────────────────────────
// app/editorial-policy/page.tsx
// E-E-A-T transparency page — sourcing standards, review cycle, corrections
// process, and byline policy. Structure mirrors app/methodology/page.tsx.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'

const canonicalUrl = '/editorial-policy/'

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'How Settlebrook sources, reviews, and corrects the legal and statutory content on this site — sourcing standards, review cycle, and how to submit a correction.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Editorial Policy | Settlebrook',
    description:
      'How Settlebrook sources, reviews, and corrects the legal and statutory content on this site — sourcing standards, review cycle, and how to submit a correction.',
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Settlebrook — Editorial Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Policy | Settlebrook',
    description:
      'How Settlebrook sources, reviews, and corrects the legal and statutory content on this site — sourcing standards, review cycle, and how to submit a correction.',
    images: ['/og-image.png'],
  },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Editorial Policy',
  url: canonicalUrl,
  description:
    'How Settlebrook sources, reviews, and corrects the legal and statutory content on this site.',
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
    { '@type': 'ListItem', position: 2, name: 'Editorial Policy', item: canonicalUrl },
  ],
}

export default function EditorialPolicyPage() {
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
            <p className="eyebrow mb-2">Sourcing &amp; Corrections Standards</p>
            <h1>Editorial Policy</h1>
            <p className="lede mt-3 max-w-2xl">
              How we source legal figures, how often we check them, and what happens when we get one wrong.
            </p>
          </div>
        </header>

        <article className="container-page py-10 sm:py-14 flex flex-col gap-10">

          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Editorial Policy', href: canonicalUrl },
            ]}
          />

          {/* Sourcing */}
          <section aria-labelledby="sourcing-heading">
            <h2
              id="sourcing-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              How We Source Legal and Statutory Figures
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Every statutory figure on Settlebrook &mdash; damage caps, comparative fault rules, statutes of limitations, workers&rsquo; comp benefit rates and duration caps &mdash; is checked against a primary source: the state&rsquo;s own statute text, a state court decision, or an official state agency page (a workers&rsquo; compensation board, insurance department, or labor department). We do not source legal figures from aggregator sites, law-firm marketing pages, or other calculator websites, and we do not repeat a commonly cited figure without independently confirming it on an official page first.
              </p>
              <p>
                Where an official source could not be independently confirmed &mdash; a page blocked from automated access, a scanned or image-only document, a JavaScript-rendered table with no extractable text &mdash; we say so on the page rather than publish a guessed number. Our{' '}
                <Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="text-link">
                  workers&rsquo; comp maximum weekly benefits table
                </Link>
                {' '}is a working example of this: figures that couldn&rsquo;t be confirmed against an official source are marked &ldquo;Pending official confirmation&rdquo; instead of filled in.
              </p>
            </div>
          </section>

          {/* Review cycle */}
          <section aria-labelledby="review-cycle-heading">
            <h2
              id="review-cycle-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              Our Review Cycle and the &ldquo;Last Reviewed&rdquo; Date
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                The three calculator pages and every state-specific page display a &ldquo;Last reviewed&rdquo; stamp under the headline. That date marks the last time someone at Settlebrook re-checked the page&rsquo;s legal claims against current law and current official sources &mdash; not the last time the page&rsquo;s wording or design changed. A page can be edited for clarity or formatting without its review date moving; only a legal re-verification updates it.
              </p>
              <p>
                Pages are reviewed on a rolling basis, prioritized by how likely the underlying law is to have changed: workers&rsquo; comp benefit rates and caps that states update annually or by fiscal year are checked most often, while settled doctrines like the basic multiplier method are checked less frequently. When a legislature or court changes a rule we cite, we aim to update the affected page in the same cycle we discover it, not wait for a scheduled pass.
              </p>
            </div>
          </section>

          {/* Corrections */}
          <section aria-labelledby="corrections-heading">
            <h2
              id="corrections-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              How to Submit a Correction
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                If you find a figure on Settlebrook that&rsquo;s outdated, mis-sourced, or wrong, use the{' '}
                <Link href="/contact/" className="text-link">
                  contact form
                </Link>
                {' '}or email{' '}
                <a href="mailto:contact@settlebrook.com" className="text-link">
                  contact@settlebrook.com
                </a>
                {' '}with the page URL, the figure you believe is wrong, and the correct figure with its source if you have one. Corrections to legal and statutory figures are prioritized over other feedback and are typically reviewed within 2 business days.
              </p>
              <p>
                Once a correction is confirmed against a primary source, we update the page and its &ldquo;Last reviewed&rdquo; date immediately &mdash; we don&rsquo;t hold corrections for a scheduled review cycle.
              </p>
            </div>
          </section>

          {/* Not legal advice */}
          <section aria-labelledby="not-advice-heading">
            <h2
              id="not-advice-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              This Is Not Legal Advice
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Settlebrook&rsquo;s calculators and editorial content are informational tools, not legal advice, and using them does not create an attorney-client relationship. We verify the legal figures we cite, but we cannot assess the specific facts of any individual case &mdash; liability, evidence quality, venue, and negotiation all affect a real settlement in ways no calculator can. Anyone with an active claim should consult a licensed attorney in their state before making a decision.
              </p>
            </div>
          </section>

          {/* Byline */}
          <section aria-labelledby="byline-heading">
            <h2
              id="byline-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              Byline Policy
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Content on Settlebrook is published under a single byline, &ldquo;Settlebrook Editorial,&rdquo; rather than attributed to individual writers. This reflects how the site is actually produced: every page goes through the same sourcing and review process described above regardless of who drafted it, so the byline names the process and the publication, not a person. See our{' '}
                <Link href="/methodology/" className="text-link">
                  methodology page
                </Link>
                {' '}for the formulas and calculation logic behind each tool, and our{' '}
                <Link href="/about/" className="text-link">
                  about page
                </Link>
                {' '}for who runs the site.
              </p>
            </div>
          </section>

        </article>

      </main>
    </>
  )
}
