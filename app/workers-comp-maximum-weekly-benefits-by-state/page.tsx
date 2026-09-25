// ─────────────────────────────────────────────────────────────────────────────
// app/workers-comp-maximum-weekly-benefits-by-state/page.tsx
// Reference table sourced entirely from lib/data/wcMaxBenefits2026.json — a
// dataset of each state's max/min weekly TTD rate collected 2026-09-24 (see
// research/2026-09-24/wc-max-benefits-2026-notes.md). Every summary count on
// this page is computed from the live array rather than hardcoded, so it can
// never drift out of sync with the underlying data the way a copied number
// from the research notes could.
// Design-refresh (2026-09): paper header band, sticky-header data table with
// tabular numerals. All figures, footnotes, and methodology text unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import TrustLine from '@/components/ui/TrustLine'
import wcMaxBenefits from '@/lib/data/wcMaxBenefits2026.json'
import { getBlogPostBySlug, isPostPublished } from '@/lib/data/blogPosts'

const weeklyBenefitPost = getBlogPostBySlug('/blog/workers-comp-weekly-benefit-calculator/')
const isWeeklyBenefitPostLive = !!weeklyBenefitPost && isPostPublished(weeklyBenefitPost)

const canonicalUrl = '/workers-comp-maximum-weekly-benefits-by-state/'
const LAST_VERIFIED = 'September 24, 2026'

// States whose figures need a footnote beyond the plain table read.
const FOOTNOTES: Record<string, string> = {
  Arizona:
    'Arizona’s system is monthly, not weekly. The figure shown is a standard weekly-equivalent (Average Monthly Wage × 12 ÷ 52 × 66⅔%) calculated from the official statutory maximum AMW — not a number the Industrial Commission itself publishes as “weekly.”',
  Washington:
    'Washington L&I pays time-loss compensation monthly and does not publish a weekly rate at all. The official monthly maximum/minimum are $9,981.00/mo and $1,247.63/mo; the weekly figures shown here are a calculated equivalent (× 12 ÷ 52) so Washington can be compared against every other state’s weekly rate in this table.',
  Wyoming:
    'Wyoming pays TTD monthly under a quarterly Statewide Average Monthly Wage table. The figures shown are calculated weekly-equivalents (monthly figure × 12 ÷ 52), not statute-stated weekly numbers.',
  'New Hampshire':
    'This is the last rate officially published on NH DOL’s own compensation rate table (revised June 9, 2025). NH DOL states it issues a new rate each July 1, but no July 2026 update could be located on the official page as of the verification date below — treat this as the most recent confirmed figure, not a guaranteed-current one.',
  Indiana:
    'Indiana sets its TTD maximum by legislative amendment to the statutory maximum average weekly wage rather than an annual administrative bulletin. This is the precise computed figure ($1,316 statutory max AWW × 66⅔%); secondary sources commonly round it to “$878.”',
}

function formatCurrency(value: number | null): string {
  if (value === null) return ''
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Washington's raw fields hold MONTHLY dollars (see FOOTNOTES.Washington) —
// every other state's fields are already weekly or a weekly-equivalent, so
// only Washington needs a conversion before it can share this table's
// "weekly" columns with the rest of the dataset.
function displayMaxWeekly(row: (typeof wcMaxBenefits)[number]): string {
  if (row.status === 'UNVERIFIED' || row.max_weekly === null) return 'Pending official confirmation'
  const weekly = row.state === 'Washington' ? row.max_weekly * (12 / 52) : row.max_weekly
  return formatCurrency(weekly)
}

function displayMinWeekly(row: (typeof wcMaxBenefits)[number]): string {
  if (row.status === 'UNVERIFIED') return 'Pending official confirmation'
  if (row.min_weekly === null) return 'Not published'
  const weekly = row.state === 'Washington' ? row.min_weekly * (12 / 52) : row.min_weekly
  return formatCurrency(weekly)
}

const verifiedCount = wcMaxBenefits.filter((row) => row.status === 'VERIFIED').length
const unverifiedCount = wcMaxBenefits.length - verifiedCount
const unverifiedStates = wcMaxBenefits.filter((row) => row.status === 'UNVERIFIED').map((row) => row.state)

export const metadata: Metadata = {
  title: 'Workers Comp Maximum Weekly Benefits by State (2026)',
  description:
    'The maximum and minimum weekly workers’ compensation benefit rate for all 50 states and DC, sourced directly from each state’s official workers’ comp agency for 2026.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Workers Comp Maximum Weekly Benefits by State (2026) | Settlebrook',
    description:
      'The maximum and minimum weekly workers’ compensation benefit rate for all 50 states and DC, sourced directly from each state’s official workers’ comp agency for 2026.',
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Settlebrook — Workers Comp Maximum Weekly Benefits by State',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workers Comp Maximum Weekly Benefits by State (2026) | Settlebrook',
    description:
      'The maximum and minimum weekly workers’ compensation benefit rate for all 50 states and DC, sourced directly from each state’s official workers’ comp agency for 2026.',
    images: ['/og-image.png'],
  },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Workers Compensation Maximum and Minimum Weekly Benefit Rates by State, 2026',
  description:
    'Maximum and minimum weekly temporary total disability (TTD) benefit rates for all 50 US states and the District of Columbia, sourced from each jurisdiction’s official workers’ compensation agency.',
  url: `https://www.settlebrook.com${canonicalUrl}`,
  license: 'https://www.settlebrook.com/terms-of-use/',
  isAccessibleForFree: true,
  creator: {
    '@type': 'Organization',
    name: 'Settlebrook',
    url: 'https://www.settlebrook.com',
  },
  dateModified: '2026-09-24',
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'text/csv',
      contentUrl: 'https://www.settlebrook.com/data/workers-comp-max-benefits-2026.csv',
    },
  ],
  variableMeasured: ['Maximum weekly TTD benefit', 'Minimum weekly TTD benefit', 'TTD benefit rate formula', 'Effective period'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Workers Comp Settlement Calculator', item: '/workers-comp-settlement-calculator/' },
    { '@type': 'ListItem', position: 3, name: 'Maximum Weekly Benefits by State', item: canonicalUrl },
  ],
}

export default function WorkersCompMaxBenefitsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen">

        {/* ── HEADER BAND ── */}
        <header className="hero-band">
          <div className="container-page py-8 sm:py-12">
            <BreadcrumbNav
              items={[
                { label: 'Home', href: '/' },
                { label: 'Workers Comp Settlement Calculator', href: '/workers-comp-settlement-calculator/' },
                { label: 'Maximum Weekly Benefits by State', href: canonicalUrl },
              ]}
            />
            <h1 className="mt-5">Workers&rsquo; Comp Maximum Weekly Benefits by State (2026)</h1>
            <TrustLine reviewed={LAST_VERIFIED} className="mt-3" />
            <p className="lede mt-4 max-w-2xl">
              Every state caps how much workers&rsquo; compensation pays per week, no matter how high your wages were. That cap decides the real ceiling on your temporary or permanent disability check.
            </p>
          </div>
        </header>

        <article className="container-page py-10 sm:py-12 flex flex-col gap-10">

          {/* Intro */}
          <section className="editorial">
            <p>
              Workers&rsquo; compensation temporary total disability (TTD) benefits are usually calculated as a percentage of your average weekly wage &mdash; typically 60&ndash;80% depending on the state. But every state also sets a statutory ceiling on that weekly check, and most set a floor too. If your wages are high enough, the maximum is what you actually receive, regardless of what the percentage formula would otherwise produce.
            </p>
            <p>
              The table below lists the maximum and minimum weekly TTD rate currently in effect in every state and the District of Columbia, pulled directly from each jurisdiction&rsquo;s own workers&rsquo; compensation agency, labor department, or statute &mdash; never from aggregator sites or law-firm marketing pages. Where an official figure could not be independently confirmed, the table says so rather than guessing.
            </p>
            <p>
              As of {LAST_VERIFIED}, {verifiedCount} of {wcMaxBenefits.length} jurisdictions are independently verified against an official source; {unverifiedCount === 1 ? `one jurisdiction (${unverifiedStates[0]})` : `${unverifiedCount} jurisdictions`} could not be confirmed and is marked accordingly. See the Methodology section below for the full sourcing rules and per-state caveats.
            </p>
          </section>

          {/* Download link */}
          <div className="flex items-center gap-3">
            <a
              href="/data/workers-comp-max-benefits-2026.csv"
              download
              className="btn-secondary"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
              Download full dataset (CSV)
            </a>
          </div>

          {/* ── TABLE ── */}
          <section aria-labelledby="table-heading" className="flex flex-col gap-4">
            <h2 id="table-heading" className="heading-display" style={{ fontSize: 30 }}>
              Maximum &amp; Minimum Weekly TTD Rate by State
            </h2>

            <div className="data-table-wrap">
              <table className="data-table" style={{ minWidth: 880 }}>
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">Max weekly TTD</th>
                    <th scope="col">Min weekly</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Effective period</th>
                    <th scope="col">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {wcMaxBenefits.map((row) => {
                    const footnote = FOOTNOTES[row.state]
                    const isPending = row.status === 'UNVERIFIED'
                    return (
                      <tr key={row.state}>
                        <th scope="row" className="font-semibold whitespace-nowrap" style={{ position: 'static', background: 'transparent', color: 'var(--ink)', borderBottom: '1px solid var(--line)' }}>
                          {row.state}
                          {footnote && (
                            <sup className="ml-0.5" style={{ color: 'var(--primary)' }}>*</sup>
                          )}
                        </th>
                        <td className={isPending ? '' : 'num'} style={isPending ? { color: 'var(--ink-3)' } : undefined}>
                          {displayMaxWeekly(row)}
                        </td>
                        <td className="num" style={{ fontWeight: 500, color: 'var(--ink-2)' }}>
                          {displayMinWeekly(row)}
                        </td>
                        <td style={{ minWidth: 220 }}>
                          {row.ttd_rate ?? 'Not published'}
                        </td>
                        <td className="whitespace-nowrap">
                          {row.effective_period}
                        </td>
                        <td>
                          <a
                            href={row.source_url.split(' and ')[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Official source ↗
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footnote legend */}
            <div className="note flex flex-col gap-2">
              {Object.entries(FOOTNOTES).map(([state, note]) => (
                <p key={state}>
                  <strong>* {state}: </strong>
                  {note}
                </p>
              ))}
            </div>
          </section>

          {/* ── METHODOLOGY ── */}
          <section aria-labelledby="methodology-heading" className="editorial">
            <h2 id="methodology-heading" style={{ marginTop: 0 }}>
              Methodology
            </h2>
            <p>
              Every figure in this table was checked against a state workers&rsquo; comp agency, board, commission, or labor department page &mdash; or the state&rsquo;s own statute text. Aggregator sites, law-firm blogs, and insurer marketing pages were used only to locate where an official page might be; none were cited as a source, and none were used to fill in a number that wasn&rsquo;t independently confirmed on an official page. Every source URL in the table above was fetched and its returned text checked to confirm the dollar figures and effective period actually appear on that page before the row was marked verified.
            </p>
            <p>
              Where an official page could not be reached or did not contain the number &mdash; a JavaScript-rendered rate table, a scanned or image-only PDF, a page blocked by <code>robots.txt</code>, or simply no locatable official page &mdash; the row is marked &ldquo;Pending official confirmation&rdquo; rather than filled with a guessed figure. As of {LAST_VERIFIED}, that applies to {unverifiedCount === 1 ? unverifiedStates[0] : unverifiedStates.join(', ')}.
            </p>
            <p>
              States update their maximum and minimum rates on different cycles, which is why the &ldquo;Effective Period&rdquo; column varies so much. Several states run a state fiscal year (July 1&ndash;June 30) rather than a calendar year, and because this dataset was collected on September 24, 2026 &mdash; after the July 1, 2026 rollover &mdash; the current fiscal-year figures were required, not the prior year&rsquo;s. A small number of states, including Georgia, set their rate by statute rather than an annual index and haven&rsquo;t changed it in several years; that&rsquo;s a real reflection of the law, not a stale lookup.
            </p>
            <p>
              Three states &mdash; Arizona, Washington, and Wyoming &mdash; run their systems on a monthly basis rather than weekly and don&rsquo;t publish an official &ldquo;weekly&rdquo; figure at all. Their entries in this table are calculated weekly-equivalents of the official monthly figures, footnoted above. New Hampshire and Indiana carry their own caveats, also footnoted: New Hampshire&rsquo;s is the most recent rate NH DOL has published, not a confirmed-current one, and Indiana&rsquo;s is a precisely computed figure that secondary sources commonly round.
            </p>
            <p>
              This table is reviewed on a rolling basis, most recently {LAST_VERIFIED}. If you find a figure that&rsquo;s changed since verification, or a state you believe is mis-sourced, use the{' '}
              <Link href="/contact/">contact page</Link>
              {' '}&mdash; corrections to legal and statutory figures are prioritized. See also our{' '}
              <Link href="/editorial-policy/">editorial policy</Link>
              {' '}and{' '}
              <Link href="/methodology/">methodology</Link>
              {' '}pages for how Settlebrook sources and reviews legal content generally.
            </p>
          </section>

          {isWeeklyBenefitPostLive && (
            <section className="editorial">
              <h2 style={{ marginTop: 0 }}>Related Guide</h2>
              <ul>
                <li>
                  <Link href="/blog/workers-comp-weekly-benefit-calculator/">How Your Workers&apos; Comp Weekly Check Is Calculated</Link> — how average weekly wage, the compensation rate, and these state caps combine into your actual check.
                </li>
              </ul>
            </section>
          )}

          {/* Related tools */}
          <section className="flex flex-col gap-4">
            <h2 className="heading-display" style={{ fontSize: 26 }}>
              Estimate Your Own Settlement
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/workers-comp-settlement-calculator/" className="btn-primary">
                Workers Comp Settlement Calculator →
              </Link>
            </div>
          </section>

        </article>

      </main>
    </>
  )
}
