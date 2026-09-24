// ─────────────────────────────────────────────────────────────────────────────
// app/blog/workers-comp-weekly-benefit-calculator/page.tsx
// Blog post #6 — targets "workers comp weekly benefit calculator" / "how is
// workers comp weekly pay calculated". Source draft:
// research/2026-09-24/posts/post-4-workers-comp-weekly-benefit.md
//
// SCHEDULED for 2026-09-29: lib/data/blogPosts.ts sets this slug's
// publishDate to that day; this page's own notFound() gate (below) returns
// a real 404 until a build runs on or after that date — see
// .github/workflows/daily-rebuild.yml.
//
// Structure follows app/blog/ppd-settlement-calculator-guide/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline
//   • No manual ad slots (Auto Ads only)
// Body published verbatim from the draft, H1 through Sources — the
// frontmatter and VERIFICATION TABLE section are not published.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = '/blog/workers-comp-weekly-benefit-calculator/'
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const metaDescription =
  "How workers' comp weekly benefits are calculated in 2026: average weekly wage, the 66 2/3% rate, state max/min caps, waiting periods, and a worked example."

export const metadata: Metadata = {
  title: "How Your Workers' Comp Weekly Check Is Calculated (2026)",
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "How Your Workers' Comp Weekly Check Is Calculated (2026)",
    description: metaDescription,
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'article',
    publishedTime: PUBLISHED_DATE,
    modifiedTime: PUBLISHED_DATE,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "How Your Workers' Comp Weekly Check Is Calculated — Settlebrook",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "How Your Workers' Comp Weekly Check Is Calculated (2026)",
    description: metaDescription,
    images: ['/og-image.png'],
  },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://www.settlebrook.com${canonicalUrl}`,
  },
  headline: "How Your Workers' Comp Weekly Check Is Calculated (2026)",
  description: metaDescription,
  image: 'https://www.settlebrook.com/og-image.png',
  datePublished: PUBLISHED_DATE,
  dateModified: PUBLISHED_DATE,
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
  mainEntity: [
    {
      '@type': 'Question',
      name: "How is workers' comp weekly pay calculated?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Your state figures your AWW from pre-injury earnings, applies a set percentage — commonly 66 2/3% — to get your weekly rate, then checks that rate against your state's maximum and minimum caps.",
      },
    },
    {
      '@type': 'Question',
      name: "What is the maximum workers' comp weekly benefit in 2026?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends entirely on the state. Verified 2026 maximums range from $654.63/week in Mississippi to $2,431.00/week in Iowa among states that state a weekly figure directly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does overtime count toward my average weekly wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In many states, yes. California's fact sheet on temporary disability lists overtime, bonuses, tips, and commissions as forms of income used to calculate wages, but not every state includes every category the same way.",
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I have a second job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Some states let you include lost wages from a second job in your AWW. Florida allows this under § 440.14(5), but you have to document the lost earnings to the claims administrator — it isn't automatic.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long can I receive weekly TTD checks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Florida caps TTD at 104 weeks under § 440.15(2)(a). Illinois has no fixed limit — under 820 ILCS 305/8(b), payments continue until you return to work or reach maximum medical improvement (MMI).',
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog/' },
    { '@type': 'ListItem', position: 3, name: "Workers' Comp Weekly Benefit Calculator", item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' } as const
const h2Style = { fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' } as const
const h3Style = { fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '32px' } as const
const linkStyle = { color: '#60A5FA' } as const
const ruleStyle = { borderColor: 'rgba(99,179,237,0.15)', margin: '36px 0' } as const

const stateMaxTable = [
  { name: 'California', href: '/workers-comp-settlement-calculator/california/', max: '$1,764.11', period: 'Jan. 1 – Dec. 31, 2026', sourceLabel: 'dir.ca.gov', sourceUrl: 'https://dir.ca.gov/DIRNews/2025/2025-116.html' },
  { name: 'Texas', href: '/workers-comp-settlement-calculator/texas/', max: '$1,271.00', period: 'Oct. 1, 2025 – Sep. 30, 2026', sourceLabel: 'tdi.texas.gov', sourceUrl: 'https://tdi.texas.gov/wc/employee/maxminbens.html' },
  { name: 'Florida', href: '/workers-comp-settlement-calculator/florida/', max: '$1,358.00', period: 'Jan. 1 – Dec. 31, 2026', sourceLabel: 'myfloridacfo.com', sourceUrl: 'https://www.myfloridacfo.com/division/wc/insurer/maximum-compensation-rate-table' },
  { name: 'New York', href: '/workers-comp-settlement-calculator/new-york/', max: '$1,281.50', period: 'Jul. 1, 2026 – Jun. 30, 2027', sourceLabel: 'wcb.ny.gov', sourceUrl: 'https://www.wcb.ny.gov/content/main/SubjectNos/sn046_1805.jsp' },
  { name: 'Illinois', href: '/workers-comp-settlement-calculator/illinois/', max: '$2,045.63', period: 'Jul. 15, 2026 – Jan. 14, 2027', sourceLabel: 'iwcc.illinois.gov', sourceUrl: 'https://iwcc.illinois.gov/resources/resources-for/benefits.html' },
  { name: 'Pennsylvania', href: '/workers-comp-settlement-calculator/pennsylvania/', max: '$1,394.00', period: 'Jan. 1 – Dec. 31, 2026', sourceLabel: 'pa.gov', sourceUrl: 'https://www.pa.gov/agencies/dli/programs-services/workers-compensation/workers--compensation-claim/statewide-average-weekly-wage-saww' },
  { name: 'Ohio', href: '/workers-comp-settlement-calculator/ohio/', max: '$1,281.00', period: 'Calendar year 2026', sourceLabel: 'dam.assets.ohio.gov', sourceUrl: 'https://dam.assets.ohio.gov/image/upload/info.bwc.ohio.gov/Workers/CompRates.pdf' },
  { name: 'North Carolina', href: '/workers-comp-settlement-calculator/north-carolina/', max: '$1,446.00', period: 'Calendar year 2026', sourceLabel: 'ic.nc.gov', sourceUrl: 'https://www.ic.nc.gov/workers-compensation-claims/maximum-weekly-compensation-rates' },
  { name: 'Arizona', href: '/workers-comp-settlement-calculator/arizona/', max: '$943.23*', period: 'Jan. 1 – Dec. 31, 2026', sourceLabel: 'azica.gov', sourceUrl: 'https://www.azica.gov/claims-amw-statutory-maximum-information-page' },
]

export default function WorkersCompWeeklyBenefitCalculatorPost() {
  const post = getBlogPostBySlug(canonicalUrl)
  if (!post || !isPostPublished(post)) {
    notFound()
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── PAGE HEADER ── */}
        <header style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091426 35%, #060C1A 70%, #050A14 100%)', borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7 sm:py-9">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog/' },
              { label: "Workers' Comp Weekly Benefit Calculator", href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1
                className="heading-gradient font-bold leading-tight"
                style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.02em' }}
              >
                How Your Workers&rsquo; Comp Weekly Check Is Calculated (2026)
              </h1>
              <p className="mt-3 text-sm" style={{ color: '#94A3B8' }}>
                {getPostDisplayDate(post)} · Settlebrook Editorial ·{' '}
                <Link href="/methodology/" className="underline transition-colors" style={linkStyle}>
                  How we verify
                </Link>
              </p>
            </div>
          </div>
        </header>

        {/* ── ARTICLE ── */}
        <article className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="max-w-3xl">

            <p style={bodyStyle}>If you&rsquo;re hurt on the job and can&rsquo;t work, your weekly workers&rsquo; comp check isn&rsquo;t a flat amount and it isn&rsquo;t automatically two-thirds of your last paycheck. It&rsquo;s built from three numbers: your <strong style={{ color: '#E2E8F0' }}>average weekly wage (AWW)</strong>, your state&rsquo;s <strong style={{ color: '#E2E8F0' }}>compensation rate</strong>, and your state&rsquo;s <strong style={{ color: '#E2E8F0' }}>maximum and minimum weekly caps</strong>.</p>
            <p style={bodyStyle}>This guide walks through each piece using our <Link href="/workers-comp-settlement-calculator/" style={linkStyle}>workers&rsquo; comp settlement calculator</Link> and our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>50-state table of maximum weekly benefits</Link>, with every dollar figure tied to an official state source, plus two worked examples showing how the same wage plays out differently from state to state.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>What Counts as Your Average Weekly Wage (AWW)</h2>
            <p style={bodyStyle}>Your AWW isn&rsquo;t simply your hourly rate times 40 — it&rsquo;s a snapshot of what you actually earned before you got hurt, and every state defines it in its own statute.</p>
            <p style={bodyStyle}><strong style={{ color: '#E2E8F0' }}>California</strong> figures your wages using &ldquo;all forms of income you receive from work: wages, food, lodging, tips, commissions, overtime and bonuses,&rdquo; under Labor Code Section 4453, according to the state&rsquo;s own fact sheet on temporary disability benefits (<a href="https://www.dir.ca.gov/dwc/factsheets/factsheet_c.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DWC, Fact Sheet C</a>).</p>
            <p style={bodyStyle}><strong style={{ color: '#E2E8F0' }}>Florida</strong> uses a 13-week lookback: under <a href="https://www.flsenate.gov/Laws/Statutes/2025/0440.14" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 440.14(1)(a)</a>, if you worked &ldquo;substantially the whole of 13 weeks&rdquo; before your injury, your AWW is &ldquo;one-thirteenth of the total amount of wages earned&rdquo; in that period. Florida law also lets lost wages from a second job count toward your AWW, but only if you document that loss to the claims administrator (§ 440.14(5)).</p>
            <p style={bodyStyle}>The upshot: overtime, tips, bonuses, and (in some states, like Florida) a second job can raise your AWW, but you generally have to report them, or your check may be calculated on a lower number than you actually earned.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>The Compensation Rate: Usually 66 2/3% of AWW</h2>
            <p style={bodyStyle}>Once your AWW is set, most states pay a fixed percentage of it as your weekly temporary total disability (TTD) benefit. The most common rate is two-thirds:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: '#E2E8F0' }}>California</strong>: 66 2/3% of average weekly earnings, subject to the statutory min/max (<a href="https://dir.ca.gov/DIRNews/2025/2025-116.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DIR, 2026 TTD rate announcement</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>Florida</strong>: 66 2/3% of AWW, subject to the statutory min/max (<a href="https://www.myfloridacfo.com/division/wc/insurer/maximum-compensation-rate-table" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida CFO, Maximum Compensation Rate Table</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>Pennsylvania</strong>: 66 2/3% of AWW, subject to the statewide average weekly wage maximum (<a href="https://www.pa.gov/agencies/dli/programs-services/workers-compensation/workers--compensation-claim/statewide-average-weekly-wage-saww" target="_blank" rel="noopener noreferrer" style={linkStyle}>Pennsylvania Dept. of Labor &amp; Industry, SAWW page</a>).</li>
            </ul>
            <p style={bodyStyle}>Not every state uses two-thirds, though. <strong style={{ color: '#E2E8F0' }}>Michigan</strong> pays 80% of your <em>after-tax</em> (spendable) AWW rather than 66 2/3% of gross AWW (<a href="https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2026_Rate_Book.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Michigan LEO, 2026 Weekly Benefit Tables</a>). Other states use their own percentages too, so check your state&rsquo;s formula rather than assuming two-thirds applies everywhere.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>Maximum and Minimum Weekly Caps (and Why They Change Every Year)</h2>
            <p style={bodyStyle}>No matter how high your AWW is, your check can&rsquo;t exceed your state&rsquo;s maximum weekly benefit. Many states set that ceiling as a percentage of the <strong style={{ color: '#E2E8F0' }}>state average weekly wage (SAWW)</strong> — a figure recalculated each year (or fiscal year) from actual wage data. When the SAWW rises, the cap rises with it.</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: '#E2E8F0' }}>California</strong> ties its maximum directly to the California SAWW under Labor Code § 4453(a)(10); the 2026 maximum reflects a 4.99% increase in the SAWW over the prior year (<a href="https://dir.ca.gov/DIRNews/2025/2025-116.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DIR news release, 2026 TTD adjustment</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>New York</strong> sets its maximum at two-thirds of the New York State Average Weekly Wage (NYSAWW); the rate effective July 1, 2026 through June 30, 2027 is based on the 2025 NYSAWW of $1,922.25 (<a href="https://www.wcb.ny.gov/content/main/SubjectNos/sn046_1805.jsp" target="_blank" rel="noopener noreferrer" style={linkStyle}>NY Workers&rsquo; Compensation Board, Subject Number bulletin</a>).</li>
            </ul>
            <p style={bodyStyle}>The &ldquo;effective period&rdquo; matters as much as the dollar figure. Some states update on January 1, others on July 1 or October 1, and a few (like Georgia, whose $800 maximum and $50 minimum are fixed by statute) change only when the legislature acts (<a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={linkStyle}>Georgia State Board of Workers&rsquo; Compensation, Summary of Provisions</a>).</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>How the Weekly Maximum Varies by State (2026)</h2>
            <p style={bodyStyle}>The 2026 maximum weekly TTD benefit in the nine states with a dedicated calculator page. Full minimums, maximums, and effective periods for all states live on our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>50-state maximum weekly benefits table</Link>.</p>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.15)' }}>
                    <th className="text-left py-2 pr-4" style={{ color: '#E2E8F0' }}>State</th>
                    <th className="text-left py-2 pr-4" style={{ color: '#E2E8F0' }}>2026 Maximum Weekly Benefit</th>
                    <th className="text-left py-2 pr-4" style={{ color: '#E2E8F0' }}>Effective Period</th>
                    <th className="text-left py-2" style={{ color: '#E2E8F0' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {stateMaxTable.map((row) => (
                    <tr key={row.name} style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}>
                      <td className="py-2 pr-4" style={{ color: '#94A3B8' }}><Link href={row.href} style={linkStyle}>{row.name}</Link></td>
                      <td className="py-2 pr-4" style={{ color: '#94A3B8' }}>{row.max}</td>
                      <td className="py-2 pr-4" style={{ color: '#94A3B8' }}>{row.period}</td>
                      <td className="py-2" style={{ color: '#94A3B8' }}><a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>{row.sourceLabel}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ ...bodyStyle, fontSize: '14px' }}><em>*Arizona sets its cap as a maximum <strong>monthly</strong> wage ($6,131.00) rather than a weekly figure; $943.23 is the standard weekly-equivalent conversion, not a number the state itself labels &ldquo;weekly.&rdquo;</em></p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>Waiting Periods and Retroactive Pay</h2>
            <p style={bodyStyle}>Most states don&rsquo;t pay you for the first few days out of work — the waiting period. But if disability drags on, many states pay you back for those first days too — retroactive pay — and the trigger point varies:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: '#E2E8F0' }}>Illinois</strong>: no TTD for the first three lost workdays — &ldquo;unless the employee misses 14 or more calendar days due to the injury,&rdquo; in which case those first three days become payable (<a href="https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Illinois Workers&rsquo; Compensation Commission, official handbook</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>Texas</strong>: benefits aren&rsquo;t paid for the first week &ldquo;unless your injury caused you to lose all or some of your pay (disability) for 14 days or more&rdquo; (<a href="https://tdi.texas.gov/wc/employee/tempben.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Dept. of Insurance, Temporary Income Benefits</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>New York</strong>: &ldquo;lost wage benefits are not paid for the first seven days of the disability, unless it extends beyond fourteen days,&rdquo; after which &ldquo;you may receive lost wage benefits from the first work day you were unable to work&rdquo; (<a href="https://www.wcb.ny.gov/content/main/Workers/LostWageBenefits.jsp" target="_blank" rel="noopener noreferrer" style={linkStyle}>NY Workers&rsquo; Compensation Board, Lost Wage Benefits</a>).</li>
            </ul>
            <p style={bodyStyle}>Fourteen days shows up often as the retroactive trigger, but the initial waiting period (three days in Illinois vs. seven in Texas and New York) is not the same everywhere.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>How Long Payments Last: Week Caps vs. &ldquo;Until MMI&rdquo;</h2>
            <p style={bodyStyle}>States also differ on how long TTD checks can run before they stop or convert to a different benefit type.</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: '#E2E8F0' }}>Florida</strong> caps TTD at 104 weeks: &ldquo;66 2/3 percent of the average weekly wages shall be paid to the employee during the continuance thereof, not to exceed 104 weeks,&rdquo; per <a href="https://www.flsenate.gov/Laws/Statutes/2025/440.15" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 440.15(2)(a)</a>.</li>
              <li><strong style={{ color: '#E2E8F0' }}>Illinois</strong> has no fixed week cap. Under 820 ILCS 305/8(b), &ldquo;the employer pays TTD benefits to an injured employee until the employee has returned to work or has reached maximum medical improvement (MMI),&rdquo; whichever comes first, according to the Illinois Workers&rsquo; Compensation Commission&rsquo;s own handbook (<a href="https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>IWCC handbook</a>).</li>
            </ul>
            <p style={bodyStyle}>That difference matters for a settlement estimate, not just a weekly check: a hard week cap gives you a known ceiling on total TTD paid, while an MMI-based state ties the end date to your medical recovery — harder to predict up front.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>Worked Example: Two States, Two Outcomes</h2>
            <p style={bodyStyle}>These are hypothetical figures to illustrate the math — use the <Link href="/workers-comp-settlement-calculator/" style={linkStyle}>workers&rsquo; comp settlement calculator</Link> for your own numbers.</p>
            <p style={bodyStyle}><strong style={{ color: '#E2E8F0' }}>Example 1 — California, AWW of $1,500/week</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Compensation rate: 66 2/3%</li>
              <li>$1,500 × 2/3 = <strong style={{ color: '#FBBF24' }}>$1,000.00/week</strong></li>
              <li>California&rsquo;s 2026 maximum is $1,764.11, so this worker is paid the full two-thirds amount — $1,000/week — because it falls under the cap.</li>
            </ul>
            <p style={bodyStyle}><strong style={{ color: '#E2E8F0' }}>Example 2 — Florida, AWW of $3,000/week</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Compensation rate: 66 2/3%</li>
              <li>$3,000 × 2/3 = $2,000.00/week before the cap</li>
              <li>But Florida&rsquo;s 2026 maximum is $1,358.00/week (<a href="https://www.myfloridacfo.com/division/wc/insurer/maximum-compensation-rate-table" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida CFO Maximum Compensation Rate Table</a>), so this worker&rsquo;s check is <strong style={{ color: '#FBBF24' }}>capped at $1,358.00/week</strong> — well below the two-thirds figure their wage would otherwise produce.</li>
            </ul>
            <p style={bodyStyle}>The lesson: two-thirds is the starting formula, but the state maximum is what actually determines your check once your wage climbs high enough.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>Highest and Lowest Weekly Caps in the Country (2026)</h2>
            <p style={bodyStyle}>From states where the weekly maximum is stated directly (not converted from a monthly figure):</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: '#E2E8F0' }}>Highest: Iowa, $2,431.00/week</strong>, effective July 1, 2026 – June 30, 2027 (<a href="https://dial.iowa.gov/current-rate-information" target="_blank" rel="noopener noreferrer" style={linkStyle}>Iowa DIAL, Current Rate Information</a>).</li>
              <li><strong style={{ color: '#E2E8F0' }}>Lowest: Mississippi, $654.63/week</strong>, effective January 1, 2026 (<a href="https://www.dfa.ms.gov/sites/default/files/Workers%20Compensation/Workers%20Compensation%20Forms/2026-Quick-Reference-Guide.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Mississippi Dept. of Finance &amp; Administration, 2026 Quick Reference Guide</a>).</li>
            </ul>
            <p style={bodyStyle}>A few states — Arizona, Nevada, Washington, and Wyoming — set their caps as a monthly wage, so their figures aren&rsquo;t directly comparable without conversion; we&rsquo;ve excluded them from this ranking for that reason. Full figures and effective periods for all 50 states plus D.C. are on our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>maximum weekly benefits table</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-gradient" style={h2Style}>FAQ</h2>

            <h3 className="heading-gradient" style={h3Style}>How is workers&rsquo; comp weekly pay calculated?</h3>
            <p style={bodyStyle}>Your state figures your AWW from pre-injury earnings, applies a set percentage — commonly 66 2/3% — to get your weekly rate, then checks that rate against your state&rsquo;s maximum and minimum caps.</p>

            <h3 className="heading-gradient" style={h3Style}>What is the maximum workers&rsquo; comp weekly benefit in 2026?</h3>
            <p style={bodyStyle}>It depends entirely on the state. Verified 2026 maximums range from $654.63/week in Mississippi to $2,431.00/week in Iowa among states that state a weekly figure directly. See our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>50-state maximum weekly benefits table</Link> for your state&rsquo;s exact number.</p>

            <h3 className="heading-gradient" style={h3Style}>Does overtime count toward my average weekly wage?</h3>
            <p style={bodyStyle}>In many states, yes. California&rsquo;s fact sheet on temporary disability lists overtime, bonuses, tips, and commissions as forms of income used to calculate wages (<a href="https://www.dir.ca.gov/dwc/factsheets/factsheet_c.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DWC Fact Sheet C</a>), but not every state includes every category the same way.</p>

            <h3 className="heading-gradient" style={h3Style}>What happens if I have a second job?</h3>
            <p style={bodyStyle}>Some states let you include lost wages from a second job in your AWW. Florida allows this under § 440.14(5), but you have to document the lost earnings to the claims administrator — it isn&rsquo;t automatic.</p>

            <h3 className="heading-gradient" style={h3Style}>How long can I receive weekly TTD checks?</h3>
            <p style={bodyStyle}>Florida caps TTD at 104 weeks under § 440.15(2)(a). Illinois has no fixed limit — under 820 ILCS 305/8(b), payments continue until you return to work or reach maximum medical improvement (MMI).</p>

            <hr style={ruleStyle} />

            <p style={{ ...bodyStyle, fontSize: '14px' }}><em>This article is for general information only and is not legal, medical, or financial advice. Workers&rsquo; compensation laws, rates, and effective periods change; verify current figures with your state&rsquo;s workers&rsquo; compensation agency or a licensed attorney in your state before relying on any number here for a real claim.</em></p>

            <h2 className="heading-gradient" style={h2Style}>Sources</h2>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><a href="https://dir.ca.gov/DIRNews/2025/2025-116.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DIR — 2026 TTD Rate Adjustment Announcement</a></li>
              <li><a href="https://www.dir.ca.gov/dwc/factsheets/factsheet_c.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DWC — Fact Sheet C: Temporary Disability Benefits</a></li>
              <li><a href="https://www.dir.ca.gov/dwc/TemporaryDisability.htm" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DWC — Temporary Disability Benefits Page</a></li>
              <li><a href="https://www.myfloridacfo.com/division/wc/insurer/maximum-compensation-rate-table" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida CFO — Maximum Compensation Rate Table</a></li>
              <li><a href="https://www.flsenate.gov/Laws/Statutes/2025/440.12" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Statutes § 440.12 (2025) — Waiting Period</a></li>
              <li><a href="https://www.flsenate.gov/Laws/Statutes/2025/0440.14" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Statutes § 440.14 (2025) — Average Weekly Wage Computation</a></li>
              <li><a href="https://www.flsenate.gov/Laws/Statutes/2025/440.15" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Statutes § 440.15 (2025) — Temporary Total Disability, 104-Week Cap</a></li>
              <li><a href="https://www.wcb.ny.gov/content/main/SubjectNos/sn046_1805.jsp" target="_blank" rel="noopener noreferrer" style={linkStyle}>New York Workers&rsquo; Compensation Board — Subject Number Bulletin (2026 Rates)</a></li>
              <li><a href="https://www.wcb.ny.gov/content/main/Workers/LostWageBenefits.jsp" target="_blank" rel="noopener noreferrer" style={linkStyle}>New York Workers&rsquo; Compensation Board — Lost Wage Benefits</a></li>
              <li><a href="https://iwcc.illinois.gov/resources/resources-for/benefits.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>Illinois Workers&rsquo; Compensation Commission — Benefit Rates</a></li>
              <li><a href="https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Illinois Workers&rsquo; Compensation Commission — Official Handbook</a></li>
              <li><a href="https://www.pa.gov/agencies/dli/programs-services/workers-compensation/workers--compensation-claim/statewide-average-weekly-wage-saww" target="_blank" rel="noopener noreferrer" style={linkStyle}>Pennsylvania Dept. of Labor &amp; Industry — Statewide Average Weekly Wage</a></li>
              <li><a href="https://dam.assets.ohio.gov/image/upload/info.bwc.ohio.gov/Workers/CompRates.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Ohio BWC — Compensation Rates 2011–2026</a></li>
              <li><a href="https://www.ic.nc.gov/workers-compensation-claims/maximum-weekly-compensation-rates" target="_blank" rel="noopener noreferrer" style={linkStyle}>North Carolina Industrial Commission — Maximum Weekly Compensation Rates</a></li>
              <li><a href="https://www.azica.gov/claims-amw-statutory-maximum-information-page" target="_blank" rel="noopener noreferrer" style={linkStyle}>Arizona ICA — Claims AMW Statutory Maximum Information</a></li>
              <li><a href="https://tdi.texas.gov/wc/employee/maxminbens.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Dept. of Insurance — Maximum/Minimum Benefits Page</a></li>
              <li><a href="https://tdi.texas.gov/wc/employee/tempben.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Dept. of Insurance — Temporary Income Benefits</a></li>
              <li><a href="https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2026_Rate_Book.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Michigan LEO — 2026 Weekly Benefit Rate Book</a></li>
              <li><a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={linkStyle}>Georgia State Board of Workers&rsquo; Compensation — Summary of Provisions</a></li>
              <li><a href="https://dial.iowa.gov/current-rate-information" target="_blank" rel="noopener noreferrer" style={linkStyle}>Iowa DIAL — Current Rate Information</a></li>
              <li><a href="https://www.dfa.ms.gov/sites/default/files/Workers%20Compensation/Workers%20Compensation%20Forms/2026-Quick-Reference-Guide.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Mississippi Dept. of Finance &amp; Administration — 2026 Quick Reference Guide</a></li>
            </ul>

          </div>
        </article>

      </main>
    </>
  )
}
