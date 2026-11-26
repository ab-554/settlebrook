// ─────────────────────────────────────────────────────────────────────────────
// app/blog/minnesota-workers-compensation-rates/page.tsx
// Blog post #12 — targets "minnesota workers compensation rates" /
// "mn work comp rates". Search Console (Oct 26 – Nov 23, 2026) showed ~130
// impressions for those two queries landing on the Minnesota state guide at
// position ~66–70; this post answers the rate-lookup intent directly and
// leaves the state guide to cover the wider benefit system.
//
// Every dollar figure below is from the Minnesota Department of Labor and
// Industry (DLI) table "Compensation rates as of October 1, 2026" (updated
// July 2026). The worked examples are arithmetic on those figures, not
// separate claims. Duration, waiting-period and TPD rules match the
// already-verified Minnesota section of
// app/workers-comp-settlement-calculator/[state]/page.tsx.
//
// Structure follows app/blog/workers-comp-weekly-benefit-calculator/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline
//   • No manual ad slots (Auto Ads only)
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import CiteThisPage from '@/components/ui/CiteThisPage'
import BlogRail from '@/components/ui/BlogRail'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = '/blog/minnesota-workers-compensation-rates/'
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate
const MODIFIED_DATE = PUBLISHED_DATE

const pageTitle = "Minnesota Workers' Compensation Rates for 2026"

const metaDescription =
  "Minnesota work comp rates for injuries on or after Oct. 1, 2026: $1,594.08 maximum, $318.82 minimum, the rate history since 2013, and worked examples."

// Official sources, declared once so the body and the Sources list can't drift apart.
const DLI_RATE_TABLE_URL = 'https://dli.mn.gov/sites/default/files/pdf/2026%20SAWWTABLE%20JULY%202026%20Updated.pdf'
const DLI_RATE_PAGE_URL = 'https://dli.mn.gov/business/workers-compensation/work-comp-rate-information-statewide-average-weekly-wage-saww'
const STATUTE_176_101_URL = 'https://www.revisor.mn.gov/statutes/cite/176.101'
const STATUTE_176_121_URL = 'https://www.revisor.mn.gov/statutes/cite/176.121'
const STATUTE_176_645_URL = 'https://www.revisor.mn.gov/statutes/cite/176.645'

export const metadata: Metadata = {
  title: pageTitle,
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: pageTitle,
    description: metaDescription,
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'article',
    publishedTime: PUBLISHED_DATE,
    modifiedTime: MODIFIED_DATE,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Minnesota Workers' Compensation Rates for 2026 — Settlebrook",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: metaDescription,
    images: ['/og-image.png'],
  },
}

// ─── FAQ (one source for the visible section and the FAQPage JSON-LD) ─────────

const faqs = [
  {
    q: "What is the maximum workers' comp rate in Minnesota for 2026?",
    a: 'For injuries on or after October 1, 2026, the maximum weekly compensation rate is $1,594.08, which is 108% of the 2026 statewide average weekly wage of $1,476.00. For injuries from October 1, 2025 through September 30, 2026, the maximum is $1,536.84.',
  },
  {
    q: "What is the minimum workers' comp rate in Minnesota?",
    a: "For injuries on or after October 1, 2026, the minimum is $318.82 a week (20% of the maximum) or the employee's actual weekly wage, whichever is less.",
  },
  {
    q: 'When do Minnesota work comp rates change?',
    a: 'Every October 1. The Department of Labor and Industry publishes the new statewide average weekly wage and the maximum and minimum rates that apply to injuries on or after that date.',
  },
  {
    q: 'Does my rate go up when the new maximum is announced?',
    a: "Not automatically. The maximum and minimum that apply to a claim are the ones in effect on the date of injury. Ongoing benefits are adjusted separately under Minn. Stat. § 176.645, and the Department of Labor and Industry states that annual increases for workers injured on or after October 1, 2013 are limited to 3%.",
  },
  {
    q: 'How much do I have to earn to get the maximum rate?',
    a: 'Temporary total disability is paid at 66 2/3% of the average weekly wage, so the $1,594.08 maximum is reached at a weekly wage of $2,391.12. Above that wage the check stays at the maximum.',
  },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://www.settlebrook.com${canonicalUrl}`,
  },
  headline: pageTitle,
  description: metaDescription,
  image: 'https://www.settlebrook.com/og-image.png',
  datePublished: PUBLISHED_DATE,
  dateModified: MODIFIED_DATE,
  author: {
    '@type': 'Organization',
    name: 'Settlebrook',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Settlebrook',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.settlebrook.com/logo.png',
    },
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog/' },
    { '@type': 'ListItem', position: 3, name: "Minnesota Workers' Compensation Rates", item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const
const strongStyle = { color: 'var(--ink)' } as const
const cellStyle = { color: 'var(--ink-2)' } as const

// ─── Rate tables, transcribed from the DLI table (updated July 2026) ──────────
// Each row applies to injuries on or after the date shown, until the next row.
// Newest first, because the current rate is what most readers came for.

const maximumRates = [
  { from: 'Oct. 1, 2026', rate: '$1,594.08', basis: '108% of SAWW' },
  { from: 'Oct. 1, 2025', rate: '$1,536.84', basis: '108% of SAWW' },
  { from: 'Oct. 1, 2024', rate: '$1,481.76', basis: '108% of SAWW' },
  { from: 'Oct. 1, 2023', rate: '$1,363.74', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2022', rate: '$1,312.74', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2021', rate: '$1,256.64', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2020', rate: '$1,166.88', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2019', rate: '$1,134.24', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2018', rate: '$1,098.54', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2017', rate: '$1,061.82', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2016', rate: '$1,046.52', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2015', rate: '$1,008.78', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2014', rate: '$980.22', basis: '102% of SAWW' },
  { from: 'Oct. 1, 2013', rate: '$963.90', basis: '102% of SAWW' },
]

const minimumRates = [
  { from: 'Oct. 1, 2026', rate: '$318.82' },
  { from: 'Oct. 1, 2025', rate: '$307.37' },
  { from: 'Oct. 1, 2024', rate: '$296.35' },
  { from: 'Oct. 1, 2023', rate: '$272.75' },
  { from: 'Oct. 1, 2022', rate: '$262.55' },
  { from: 'Oct. 1, 2021', rate: '$251.33' },
]

const permanentTotalMinimums = [
  { from: 'Oct. 1, 2026', rate: '$959.40' },
  { from: 'Oct. 1, 2025', rate: '$924.95' },
  { from: 'Oct. 1, 2024', rate: '$891.80' },
  { from: 'Oct. 1, 2023', rate: '$869.05' },
]

export default function MinnesotaWorkersCompensationRatesPost() {
  const post = getBlogPostBySlug(canonicalUrl)
  if (!post || !isPostPublished(post)) {
    notFound()
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen">

        {/* ── PAGE HEADER ── */}
        <header className="hero-band">
          <div className="container-page py-8 sm:py-10">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog/' },
              { label: "Minnesota Workers' Compensation Rates", href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Minnesota Workers&rsquo; Compensation Rates for 2026
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>
                {getPostDisplayDate(post)} · Settlebrook Editorial ·{' '}
                <Link href="/methodology/" className="text-link">
                  How we verify
                </Link>
              </p>
            </div>
          </div>
        </header>

        {/* ── ARTICLE ── */}
        <div className="container-page py-10 sm:py-14">
          <EditorialLayout rootId="editorial-root" rail={<BlogRail currentSlug={canonicalUrl} />}>
          <article className="editorial">

            <p style={bodyStyle}>For a work injury on or after <strong style={strongStyle}>October 1, 2026</strong>, the Minnesota workers&rsquo; compensation maximum is <strong style={strongStyle}>$1,594.08 a week</strong> and the minimum is <strong style={strongStyle}>$318.82 a week</strong> or the employee&rsquo;s actual weekly wage, whichever is less. Both come from the 2026 statewide average weekly wage (SAWW) of $1,476.00, published by the <a href={DLI_RATE_TABLE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minnesota Department of Labor and Industry (DLI)</a>.</p>
            <p style={bodyStyle}>Minnesota work comp rates reset every October 1, and the rate that applies to a claim is the one in effect on the date of injury. This page lists the current figures, the rate for every injury year back to 2013, and how the numbers turn into a weekly check. For the wider system (permanent partial disability, time limits, settlements), see our <Link href="/workers-comp-settlement-calculator/minnesota/" style={linkStyle}>Minnesota workers&rsquo; comp guide and calculator</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Minnesota Work Comp Rates at a Glance</h2>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Figure</th>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Injuries Oct. 1, 2026 and after</th>
                    <th className="text-left py-2" style={strongStyle}>Injuries Oct. 1, 2025 – Sept. 30, 2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th scope="row" className="text-left py-2 pr-4" style={cellStyle}>Maximum weekly compensation rate</th>
                    <td className="py-2 pr-4" style={cellStyle}>$1,594.08</td>
                    <td className="py-2" style={cellStyle}>$1,536.84</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th scope="row" className="text-left py-2 pr-4" style={cellStyle}>Minimum weekly compensation rate</th>
                    <td className="py-2 pr-4" style={cellStyle}>$318.82 or actual weekly wage, whichever is less</td>
                    <td className="py-2" style={cellStyle}>$307.37 or actual weekly wage, whichever is less</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th scope="row" className="text-left py-2 pr-4" style={cellStyle}>Permanent total disability minimum</th>
                    <td className="py-2 pr-4" style={cellStyle}>$959.40</td>
                    <td className="py-2" style={cellStyle}>$924.95</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th scope="row" className="text-left py-2 pr-4" style={cellStyle}>Temporary total disability rate</th>
                    <td className="py-2 pr-4" style={cellStyle}>66 2/3% of average weekly wage</td>
                    <td className="py-2" style={cellStyle}>66 2/3% of average weekly wage</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>Source: <a href={DLI_RATE_TABLE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>DLI, Compensation rates as of October 1, 2026</a> (updated July 2026). The 66 2/3% rate is set by <a href={STATUTE_176_101_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.101, subd. 1</a>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How the Maximum and Minimum Are Set</h2>
            <p style={bodyStyle}>Minnesota ties both limits to the statewide average weekly wage, which DLI updates once a year.</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Maximum.</strong> DLI lists the maximum as 108% of the SAWW for injuries on or after October 1, 2024. With a 2026 SAWW of $1,476.00, that is $1,476.00 × 1.08 = $1,594.08. For injuries from October 1, 2013 through September 30, 2024, the maximum was 102% of the SAWW.</li>
              <li><strong style={strongStyle}>Minimum.</strong> DLI lists the minimum as 20% of the maximum or the employee&rsquo;s actual weekly wage, whichever is less. For 2026 that is $1,594.08 × 0.20 = $318.82.</li>
              <li><strong style={strongStyle}>Permanent total disability minimum.</strong> For injuries on or after October 1, 1995, DLI lists a separate minimum for permanent total disability under Minn. Stat. § 176.101, subd. 4. The 2026 figure is $959.40, which works out to 65% of the $1,476.00 SAWW.</li>
            </ul>
            <p style={bodyStyle}>The DLI table also shows a 3.72% adjustment under <a href={STATUTE_176_645_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.645</a> for October 1, 2026. That adjustment is about ongoing benefits on older claims, covered further down. It is not added to the maximum rate.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Maximum Compensation Rate by Date of Injury</h2>
            <p style={bodyStyle}>Find the row that covers your date of injury. Each rate applies to injuries on or after the date shown, up to the day before the next row.</p>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Injuries on or after</th>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Maximum weekly rate</th>
                    <th className="text-left py-2" style={strongStyle}>Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {maximumRates.map((row) => (
                    <tr key={row.from} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td className="py-2 pr-4" style={cellStyle}>{row.from}</td>
                      <td className="py-2 pr-4" style={cellStyle}>{row.rate}</td>
                      <td className="py-2" style={cellStyle}>{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>Source: <a href={DLI_RATE_TABLE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>DLI, Compensation rates as of October 1, 2026</a>. The same table carries the rates for injuries before October 1, 2013.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Minimum Compensation Rate by Date of Injury</h2>
            <p style={bodyStyle}>The minimum only matters when two-thirds of your wage falls below it. In every row, a worker whose actual weekly wage is lower than the figure shown is paid the actual wage instead.</p>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Injuries on or after</th>
                    <th className="text-left py-2" style={strongStyle}>Minimum weekly rate (20% of the maximum)</th>
                  </tr>
                </thead>
                <tbody>
                  {minimumRates.map((row) => (
                    <tr key={row.from} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td className="py-2 pr-4" style={cellStyle}>{row.from}</td>
                      <td className="py-2" style={cellStyle}>{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>Permanent total disability has its own, higher minimum for injuries on or after October 1, 1995:</p>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th className="text-left py-2 pr-4" style={strongStyle}>Effective</th>
                    <th className="text-left py-2" style={strongStyle}>Permanent total disability minimum</th>
                  </tr>
                </thead>
                <tbody>
                  {permanentTotalMinimums.map((row) => (
                    <tr key={row.from} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td className="py-2 pr-4" style={cellStyle}>{row.from}</td>
                      <td className="py-2" style={cellStyle}>{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>Source: <a href={DLI_RATE_TABLE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>DLI, Compensation rates as of October 1, 2026</a>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How the Rate Becomes a Weekly Check</h2>
            <p style={bodyStyle}>Temporary total disability (TTD) is paid at 66 2/3% of your average weekly wage at the time of injury, then checked against the maximum and minimum for your injury date (<a href={STATUTE_176_101_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.101, subd. 1</a>). The three examples below use hypothetical wages and the rates for an injury on or after October 1, 2026.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Example 1: weekly wage of $1,200</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>$1,200 × 2/3 = <strong style={{ color: 'var(--amber)' }}>$800.00 a week</strong></li>
              <li>That is between the minimum and the maximum, so $800.00 is the rate.</li>
            </ul>
            <p style={bodyStyle}><strong style={strongStyle}>Example 2: weekly wage of $3,000</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>$3,000 × 2/3 = $2,000.00 before the cap</li>
              <li>The maximum is $1,594.08, so the check is <strong style={{ color: 'var(--amber)' }}>capped at $1,594.08 a week</strong>.</li>
              <li>Any weekly wage of $2,391.12 or more reaches the maximum, because $2,391.12 × 2/3 = $1,594.08.</li>
            </ul>
            <p style={bodyStyle}><strong style={strongStyle}>Example 3: weekly wage of $450</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>$450 × 2/3 = $300.00, which is below the $318.82 minimum</li>
              <li>The actual wage ($450) is higher than $318.82, so the rate is raised to <strong style={{ color: 'var(--amber)' }}>$318.82 a week</strong>.</li>
              <li>If the actual weekly wage were $280, the minimum would be $280, because the rule uses whichever is less.</li>
            </ul>
            <p style={bodyStyle}>To run your own wage, use the <Link href="/workers-comp-settlement-calculator/minnesota/" style={linkStyle}>Minnesota workers&rsquo; comp calculator</Link>. For how average weekly wage is built in general, see <Link href="/blog/workers-comp-weekly-benefit-calculator/" style={linkStyle}>how a workers&rsquo; comp weekly check is calculated</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Which Year&rsquo;s Rate Applies to You</h2>
            <p style={bodyStyle}>The DLI tables are organized by date of injury. A worker hurt on September 15, 2026 falls in the October 1, 2025 row, with a $1,536.84 maximum, even though checks are still being paid after the new rate took effect. A worker hurt on October 5, 2026 falls in the October 1, 2026 row.</p>
            <p style={bodyStyle}>What changes for older claims is the annual adjustment under <a href={STATUTE_176_645_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.645</a>. DLI&rsquo;s <a href={DLI_RATE_PAGE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>rate information page</a> states that annual benefit increases for workers injured on or after October 1, 2013 are limited to a maximum 3% increase, and it publishes separate adjustment charts for each range of injury dates. If your claim has been open for several years, use the chart that matches your injury date, or ask DLI, since the adjustment rules differ by period.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Long the Weekly Rate Is Paid</h2>
            <p style={bodyStyle}>The weekly rate is one half of the picture. The other half is how many weeks it runs.</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Temporary total disability</strong> ends once 130 weeks of TTD have been paid. Weeks paid during a DLI-approved retraining plan do not count toward the 130 (<a href={STATUTE_176_101_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.101, subd. 1(k)</a>).</li>
              <li><strong style={strongStyle}>Waiting period.</strong> Nothing is paid for the first three calendar days of disability unless the disability lasts 10 calendar days or longer, in which case those days are paid too (<a href={STATUTE_176_121_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.121</a>).</li>
              <li><strong style={strongStyle}>Temporary partial disability</strong> is 66 2/3% of the difference between the pre-injury wage and what the worker can earn now, capped at the same maximum rate. It can run up to 275 weeks, or 450 weeks after the date of injury, whichever comes first (<a href={STATUTE_176_101_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.101, subd. 2</a>).</li>
            </ul>
            <p style={bodyStyle}>Permanent partial disability in Minnesota is not paid at a weekly rate times a number of weeks. It is a dollar amount tied to a whole-body impairment percentage, which the <Link href="/workers-comp-settlement-calculator/minnesota/" style={linkStyle}>Minnesota guide</Link> covers with the current statutory tables.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Minnesota Compares</h2>
            <p style={bodyStyle}>Minnesota updates on October 1, while many states update on January 1 or July 1, so a &ldquo;2026 rate&rdquo; means different months in different states. Our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>50-state table of maximum weekly benefits</Link> lists each state&rsquo;s figure with its effective period and official source.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Frequently Asked Questions</h2>
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="heading-display h3-editorial">{faq.q}</h3>
                <p style={bodyStyle}>{faq.a}</p>
              </div>
            ))}

            <hr style={ruleStyle} />

            <p style={{ ...bodyStyle, fontSize: '15px' }}><em>This article is for general information only and is not legal, medical, or financial advice. Settlebrook is not a law firm. Minnesota rates change every October 1; confirm the figure for your date of injury with the Minnesota Department of Labor and Industry or a licensed Minnesota attorney before relying on it for a real claim.</em></p>

            <h2 className="heading-display h2-editorial">Sources</h2>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><a href={DLI_RATE_TABLE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minnesota DLI: Compensation rates as of October 1, 2026 (updated July 2026)</a></li>
              <li><a href={DLI_RATE_PAGE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minnesota DLI: Work comp rate information and statewide average weekly wage</a></li>
              <li><a href={STATUTE_176_101_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.101 (temporary total, temporary partial and permanent total disability)</a></li>
              <li><a href={STATUTE_176_121_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.121 (waiting period)</a></li>
              <li><a href={STATUTE_176_645_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>Minn. Stat. § 176.645 (annual adjustment of benefits)</a></li>
            </ul>

          </article>

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title={pageTitle} path={canonicalUrl} reviewed={getPostDisplayDate(post)} className="mt-10" />
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
