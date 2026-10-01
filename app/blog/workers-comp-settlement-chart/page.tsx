// ─────────────────────────────────────────────────────────────────────────────
// app/blog/workers-comp-settlement-chart/page.tsx
// Blog post #6 — targets "workers comp settlement chart" / "workers comp body
// part settlement chart" / "permanent partial disability schedule". Source
// draft: research/2026-09-24/posts/post-6-workers-comp-settlement-chart.md
// (verification log: post-6-verification.md, same folder).
//
// SCHEDULED for 2026-10-03: lib/data/blogPosts.ts sets this slug's
// publishDate to that day; this page's own notFound() gate (below) returns
// a real 404 until a build runs on or after that date — see
// .github/workflows/daily-rebuild.yml.
//
// Structure follows app/blog/minor-car-accident-settlement/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline
//   • No manual ad slots (Auto Ads only)
// Body published verbatim from the draft (H1 through the closing disclaimer);
// the frontmatter is not published. The draft's markdown tables are real
// <table>s inside an overflow-x-auto wrapper with a min-width, so the wide
// 8-column comparison scrolls sideways on a phone instead of squeezing.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import CiteThisPage from '@/components/ui/CiteThisPage'
import BlogRail from '@/components/ui/BlogRail'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = '/blog/workers-comp-settlement-chart/'
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const pageTitle = "Workers' Comp Settlement Chart by Body Part (2026)"
const metaDescription =
  "See how workers' comp pays for body-part injuries in 7 states: verified PPD schedule weeks, each state's rate rule, and two worked dollar examples."

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
    modifiedTime: PUBLISHED_DATE,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Workers' Comp Settlement Chart by Body Part — Settlebrook",
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

// Must stay word-for-word identical to the visible FAQ section below (the
// visible copy adds links/italics only).
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is there an official chart that shows the dollar amount for each body part?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. States publish a schedule of weeks per body part, not dollars. The dollar amount depends on your percentage of loss and your state\'s rate rule, so the same injury pays differently in different states.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many weeks is a hand worth in workers\' comp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the state: 150 weeks in Virginia, 160 in Georgia, 215 in Michigan, 244 in New York, 260–300 in New Jersey depending on the percentage of loss, and 104 in Colorado ("hand below wrist"). Multiply the applicable figure by your percentage of loss for your actual weeks.',
      },
    },
    {
      '@type': 'Question',
      name: "Why don't all states pay the same amount for a similar injury?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Three variables differ by state: the scheduled weeks for that body part, how the loss percentage is rated, and how the rate is calculated from that percentage. States with similar weeks can diverge sharply once you apply the rate rule — compare Virginia's wage-based rate to Colorado's flat rate above.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does my permanent partial disability payment cover my whole workers\' comp settlement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. PPD is typically one component. Temporary disability payments already received, ongoing or future medical costs, and negotiated resolution of disputed issues can all be part of a final settlement alongside, or instead of, a scheduled PPD award.',
      },
    },
    {
      '@type': 'Question',
      name: "What if my state isn't one of the seven listed here?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "This chart covers only states whose PPD schedules we've verified against an official statute or state agency source. If yours isn't listed, check your own state's workers' compensation agency for its schedule of weeks and rate rule before assuming any figure above applies to you.",
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
    { '@type': 'ListItem', position: 3, name: 'Workers Comp Settlement Chart', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the other blog posts) ────────────────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const
const strongStyle = { color: 'var(--ink)' } as const
// Horizontal scroll wrapper for tables; the min-width on the <table> itself
// is what forces the scroll on a narrow viewport rather than text crushing.
const tableWrapStyle = { overflowX: 'auto', marginBottom: 18 } as const

export default function WorkersCompSettlementChartPost() {
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
              { label: 'Workers Comp Settlement Chart', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Workers&rsquo; Comp Settlement Chart by Body Part (2026)
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

            <p style={bodyStyle}>Search for a &ldquo;workers&rsquo; comp settlement chart by body part&rdquo; and you&rsquo;ll find pages promising a dollar figure for a hand, an arm, or a knee. No state publishes one, because no state pays that way. What every state publishes instead is a <strong style={strongStyle}>schedule of weeks</strong> — a fixed number of weeks of pay assigned to each body part for permanent partial disability (PPD). Your dollar amount is that week count multiplied by your state&rsquo;s own rate rule, and the rate rule is different in every state.</p>
            <p style={bodyStyle}>This chart pulls the verified 2026 PPD schedules for seven states — Georgia, Michigan, New Jersey, Virginia, Minnesota, Colorado, and New York — straight from each state&rsquo;s statute or official rate notice, shows exactly how each state turns weeks into dollars, and walks through two worked examples so you can see the arithmetic yourself. For how your weekly benefit amount is set in the first place, see our companion piece on <Link href="/blog/workers-comp-weekly-benefit-calculator/" style={linkStyle}>how your workers&rsquo; comp weekly check is calculated</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Why There&rsquo;s No Single &ldquo;Dollar Amount&rdquo; Chart</h2>
            <p style={bodyStyle}>Three things vary by state, and all three have to line up before you get a dollar figure:</p>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li><strong style={strongStyle}>The weeks.</strong> Each state&rsquo;s schedule assigns a fixed number of weeks to a body part — an arm might be 200 weeks in one state and 330 in another.</li>
              <li><strong style={strongStyle}>The percentage.</strong> A doctor rates your loss — either as a &ldquo;loss of use&rdquo; percentage of the specific body part, or, in Georgia and Minnesota, as an impairment percentage under a medical ratings guide.</li>
              <li><strong style={strongStyle}>The rate.</strong> Some states pay a percentage of your wages, capped at a state maximum. Colorado pays a flat rate unrelated to wages. Michigan and New Jersey don&rsquo;t let you compute a public dollar total at all, because the missing piece is tax-dependent or table-dependent in a way this article can&rsquo;t fill in for you.</li>
            </ol>
            <p style={bodyStyle}>Multiply weeks × percentage × rate and you get a dollar figure. Skip any one of them and you&rsquo;re guessing.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">PPD Weeks by Body Part: 7-State Comparison</h2>
            <p style={bodyStyle}>The table below shows the <strong style={strongStyle}>maximum scheduled weeks</strong> for total loss of each body part (100% loss of use, or the top of the impairment scale). Your actual weeks are this number multiplied by your percentage of loss.</p>
            <div style={tableWrapStyle}>
              <table style={{ minWidth: 760 }}>
                <thead>
                  <tr>
                    <th scope="col">Body part</th>
                    <th scope="col">Georgia</th>
                    <th scope="col">Michigan</th>
                    <th scope="col">New Jersey</th>
                    <th scope="col">Virginia</th>
                    <th scope="col">Minnesota</th>
                    <th scope="col">Colorado</th>
                    <th scope="col">New York</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Arm</th><td>225</td><td>269</td><td>330</td><td>200</td><td>—</td><td>208</td><td>312</td></tr>
                  <tr><th scope="row">Hand</th><td>160</td><td>215</td><td>260 (under 25% loss) / 300 (25%+ loss)</td><td>150</td><td>—</td><td>104</td><td>244</td></tr>
                  <tr><th scope="row">Leg</th><td>225</td><td>215</td><td>315</td><td>175</td><td>—</td><td>208</td><td>288</td></tr>
                  <tr><th scope="row">Foot</th><td>135</td><td>162</td><td>250 (under 25%) / 285 (25%+)</td><td>125</td><td>—</td><td>104</td><td>205</td></tr>
                  <tr><th scope="row">Eye (total vision loss)</th><td>150</td><td>162</td><td>200</td><td>100</td><td>—</td><td>104</td><td>160</td></tr>
                  <tr><th scope="row">Thumb</th><td>60</td><td>65</td><td>80</td><td>60</td><td>—</td><td>50</td><td>75</td></tr>
                  <tr><th scope="row">Index finger</th><td>40</td><td>38</td><td>60</td><td>35</td><td>—</td><td>26</td><td>46</td></tr>
                  <tr><th scope="row">Great toe</th><td>30</td><td>33</td><td>40</td><td>30</td><td>—</td><td>26</td><td>38</td></tr>
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}><strong style={strongStyle}>Why Minnesota is all dashes:</strong> Minnesota doesn&rsquo;t use a body-part schedule at all. It rates injuries as a percentage of the whole body under Minn. Rules ch. 5223, then pays a lump sum from a dollar table keyed to that percentage — explained below. There&rsquo;s no &ldquo;hand = X weeks&rdquo; figure to show.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Colorado&rsquo;s labels differ slightly</strong> from the other states because its statute names the amputation point directly — &ldquo;hand below wrist,&rdquo; &ldquo;arm at shoulder,&rdquo; &ldquo;leg at hip&rdquo; — rather than a generic &ldquo;hand&rdquo; or &ldquo;arm.&rdquo; The weeks above use Colorado&rsquo;s own wording.</p>
            <p style={bodyStyle}><strong style={strongStyle}>New Jersey&rsquo;s hand and foot each have two values</strong> because N.J.S.A. 34:15-12(c) pays more weeks once the loss of function reaches 25%: below that threshold you get the lower figure, at or above it you get the higher one.</p>
            <p style={bodyStyle}>Some states also schedule body parts not shown here (hearing loss in New York, New Jersey, Virginia and Georgia; Virginia&rsquo;s disfigurement cap and pneumoconiosis stages; Georgia&rsquo;s &ldquo;body as a whole&rdquo; category). Those aren&rsquo;t included because this chart is limited to the body parts common across all seven states&rsquo; public schedules.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Each State Turns Weeks Into Dollars</h2>
            <p style={bodyStyle}>Getting from &ldquo;weeks&rdquo; to &ldquo;dollars&rdquo; is where these states diverge the most. Here&rsquo;s each state&rsquo;s rate rule, in plain terms.</p>
            <div style={tableWrapStyle}>
              <table style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">How the weekly rate is set</th>
                    <th scope="col">Statute</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">New York</th><td>2/3 × your AWW, capped at NY&rsquo;s maximum for your injury date</td><td>WCL § 15(3)</td></tr>
                  <tr><th scope="row">Virginia</th><td>2/3 × your AWW, capped at VA&rsquo;s maximum for your injury date</td><td>Va. Code § 65.2-503</td></tr>
                  <tr><th scope="row">Georgia</th><td>2/3 × your AWW, capped at a flat $800/week</td><td>O.C.G.A. § 34-9-263</td></tr>
                  <tr><th scope="row">Michigan</th><td>80% of your after-tax AWW — same formula used for total disability</td><td>MCL 418.361</td></tr>
                  <tr><th scope="row">New Jersey</th><td>Not wage-based — a graduated dollar table keyed to your total weeks awarded</td><td>N.J.S.A. 34:15-12(c)</td></tr>
                  <tr><th scope="row">Minnesota</th><td>Not weekly — a one-time lump sum from a table keyed to your impairment %</td><td>Minn. Stat. § 176.101 subd. 2a</td></tr>
                  <tr><th scope="row">Colorado</th><td>A flat statutory rate, unrelated to your wages</td><td>C.R.S. § 8-42-107</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="heading-display h3-editorial">New York</h3>
            <p style={bodyStyle}>Two-thirds of AWW, capped at the state&rsquo;s maximum for your injury date. New York resets its cap every July 1: $1,222.42/week for injuries from January through June 2026, and $1,281.50/week (minimum $384.45) for injuries from July 2026 through June 2027 (<a href="https://www.wcb.ny.gov/content/main/SubjectNos/sn046_1805.jsp" target="_blank" rel="noopener noreferrer" style={linkStyle}>NY Workers&rsquo; Compensation Board, Subject Number bulletin</a>). Run your own numbers on the <Link href="/workers-comp-settlement-calculator/new-york/" style={linkStyle}>New York calculator</Link>.</p>

            <h3 className="heading-display h3-editorial">Virginia</h3>
            <p style={bodyStyle}>Same two-thirds formula, but Virginia&rsquo;s compensation year runs July 1 to June 30. Injuries from January through June 2026 use a $1,463.10 maximum ($365.78 minimum); July through December 2026 uses $1,507.01 ($376.75 minimum) (<a href="https://www.workcomp.virginia.gov/news/notice-of-2026-rates" target="_blank" rel="noopener noreferrer" style={linkStyle}>VWC, Notice of 2026 Rates</a>). All compensation, temporary and permanent combined, is capped at 500 weeks under Va. Code § 65.2-518. See the <Link href="/workers-comp-settlement-calculator/virginia/" style={linkStyle}>Virginia calculator</Link>.</p>

            <h3 className="heading-display h3-editorial">Georgia</h3>
            <p style={bodyStyle}>Two-thirds of AWW, capped at a flat $800/week — in effect since July 1, 2023, with no increase confirmed since (<a href="https://sbwc.georgia.gov/document/publication/provisionspdf/download" target="_blank" rel="noopener noreferrer" style={linkStyle}>Georgia SBWC, Summary of Provisions</a>). Georgia&rsquo;s statute names the AMA&rsquo;s <em>Guides to the Evaluation of Permanent Impairment</em>, 5th edition, as the rating standard. See the <Link href="/workers-comp-settlement-calculator/georgia/" style={linkStyle}>Georgia calculator</Link>.</p>

            <h3 className="heading-display h3-editorial">Michigan</h3>
            <p style={bodyStyle}>No two-thirds formula here: Michigan pays 80% of your <em>after-tax</em> AWW, the same rate used for total disability, so the dollar figure depends on your tax situation, not just gross pay. That can&rsquo;t be computed from public wage tables, so we don&rsquo;t publish a Michigan dollar total — enter your own weekly compensation rate (from your benefit notice) into the <Link href="/workers-comp-settlement-calculator/michigan/" style={linkStyle}>Michigan calculator</Link> for a total, or leave it blank for weeks only.</p>

            <h3 className="heading-display h3-editorial">New Jersey</h3>
            <p style={bodyStyle}>Ignore any per-body-part dollar figure you see for New Jersey. Its statute doesn&rsquo;t pay a percentage of wages for scheduled injuries — the rate comes from a table keyed to the <em>total weeks</em> your award covers, and the current 2026 version of that table lives only on the state&rsquo;s own PDF; most secondhand reproductions get it wrong. Use the <a href="https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>official 2026 schedule</a> for the rate and the <Link href="/workers-comp-settlement-calculator/new-jersey/" style={linkStyle}>New Jersey calculator</Link> for the weeks.</p>

            <h3 className="heading-display h3-editorial">Minnesota</h3>
            <p style={bodyStyle}>Minnesota skips weeks entirely. A doctor rates your injury as a percentage of your whole body under Minn. Rules ch. 5223, and that percentage picks a dollar band from a statutory table — a one-time lump sum, not a weekly check. A new, higher table took effect for injuries on or after October 1, 2026, so the same rating pays differently depending on which side of that date your injury falls on (<a href="https://www.revisor.mn.gov/laws/2026/0/103/laws.0.12.0" target="_blank" rel="noopener noreferrer" style={linkStyle}>Minnesota 2026 Session Laws, ch. 103, § 10</a>). A sample of the bands:</p>
            <div style={tableWrapStyle}>
              <table style={{ minWidth: 560 }}>
                <thead>
                  <tr>
                    <th scope="col">Impairment rating</th>
                    <th scope="col">Table A (injuries Jan 1 – Sep 30, 2026)</th>
                    <th scope="col">Table B (injuries Oct 1, 2026 onward)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Less than 5.5%</th><td>$114,260</td><td>$137,240</td></tr>
                  <tr><th scope="row">5.5% to under 10.5%</th><td>$121,800</td><td>$146,297</td></tr>
                  <tr><th scope="row">25.5% to under 30.5%</th><td>$147,000</td><td>$176,565</td></tr>
                  <tr><th scope="row">50.5% to under 55.5%</th><td>$181,965</td><td>$218,562</td></tr>
                  <tr><th scope="row">95.5% to 100%</th><td>$567,840</td><td>$682,045</td></tr>
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>For example, a 10% whole-body rating for an injury on September 1, 2026 falls in the &ldquo;5.5% to under 10.5%&rdquo; band under Table A: 10% × $121,800 = <strong style={strongStyle}>$12,180.00</strong>. The identical 10% rating for an injury on October 15, 2026 falls under Table B instead: 10% × $146,297 = <strong style={strongStyle}>$14,629.70</strong> — a difference driven entirely by injury date, not by anything about the injury itself. The full 20-band table for both periods is on our <Link href="/workers-comp-settlement-calculator/minnesota/" style={linkStyle}>Minnesota calculator page</Link>.</p>

            <h3 className="heading-display h3-editorial">Colorado</h3>
            <p style={bodyStyle}>Colorado pays scheduled PPD injuries at a <strong style={strongStyle}>flat rate that ignores your wages</strong> — $459.45 per week for injuries in the July 1, 2026 through June 30, 2027 benefit year, under the state&rsquo;s 2026 Max Benefits Order. A worker earning minimum wage and a worker earning six figures with the same 20% hand injury get paid the exact same weekly rate.</p>
            <p style={bodyStyle}>For injuries <em>not</em> on the schedule — back and neck are the common examples — Colorado uses a different, whole-person method: &ldquo;rating % × an age factor (1.80 at age 20 or younger, down to 1.00 at 60 or older) × 400 weeks, paid at the TTD rate within a 2026–2027 range of $150.00–$804.46 per week. Combined TTD and PPD are capped at $202,297.46 (whole-person rating 19% or less) or $328,049.94 (20% or more) for 2026–2027&rdquo; (C.R.S. § 8-42-107.5; DOWC 2026 Max Benefits Order). We aren&rsquo;t running that calculation because the full age-factor table isn&rsquo;t independently confirmed — treat it as background, not a number to plug in. See the <Link href="/workers-comp-settlement-calculator/colorado/" style={linkStyle}>Colorado calculator</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Worked Examples</h2>
            <p style={bodyStyle}>These are hypothetical numbers built to show the arithmetic — they are not settlement estimates for a real claim. Use the <Link href="/workers-comp-settlement-calculator/" style={linkStyle}>workers&rsquo; comp settlement calculator</Link> with your own wage and rating for that.</p>

            <p style={bodyStyle}><strong style={strongStyle}>New York — hand, 50% loss of use, AWW $1,200</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>New York&rsquo;s hand schedule is 244 weeks. At 50% loss: 244 × 0.50 = <strong style={strongStyle}>122 weeks</strong>.</li>
              <li>Rate: 2/3 × $1,200 = $800.00/week, which falls under New York&rsquo;s maximum, so the full $800.00/week applies.</li>
              <li>122 weeks × $800.00/week = <strong style={strongStyle}>$97,600.00</strong>.</li>
            </ul>

            <p style={bodyStyle}><strong style={strongStyle}>Virginia — hand, 20% loss, AWW $900</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Virginia&rsquo;s hand schedule is 150 weeks. At 20% loss: 150 × 0.20 = <strong style={strongStyle}>30 weeks</strong>.</li>
              <li>Rate: 2/3 × $900 = $600.00/week, which falls between Virginia&rsquo;s minimum and maximum, so $600.00/week applies.</li>
              <li>30 weeks × $600.00/week = <strong style={strongStyle}>$18,000.00</strong>.</li>
            </ul>

            <p style={bodyStyle}><strong style={strongStyle}>Colorado — hand below wrist, 20% loss</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Colorado&rsquo;s hand-below-wrist schedule is 104 weeks. At 20% loss: 104 × 0.20 = <strong style={strongStyle}>20.8 weeks</strong>.</li>
              <li>Rate: the flat $459.45/week — Colorado ignores wages entirely for scheduled injuries.</li>
              <li>20.8 weeks × $459.45/week = <strong style={strongStyle}>$9,556.56</strong>.</li>
            </ul>

            <p style={bodyStyle}>Notice that a 20% hand injury pays a completely different amount in Virginia ($18,000 at this wage) than in Colorado ($9,556.56, regardless of wage) — not because one injury is &ldquo;worse,&rdquo; but because the two states built different formulas.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">PPD Is Only Part of a Workers&rsquo; Comp Settlement</h2>
            <p style={bodyStyle}>Everything above covers permanent partial disability — payment for a lasting loss after you&rsquo;ve healed as much as you&rsquo;re going to. It isn&rsquo;t your whole workers&rsquo; comp case. A real settlement can also include:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Temporary disability benefits</strong> paid while you were out of work recovering, calculated separately from PPD and covered in our <Link href="/blog/workers-comp-weekly-benefit-calculator/" style={linkStyle}>weekly benefit guide</Link>.</li>
              <li><strong style={strongStyle}>Medical expenses</strong> — past and, in many cases, future treatment tied to the injury.</li>
              <li><strong style={strongStyle}>Negotiation.</strong> Settlements often resolve disputed issues (the rating itself, whether the injury is work-related, future medical exposure) for a lump sum that doesn&rsquo;t map cleanly back to a weeks-times-rate formula.</li>
            </ul>
            <p style={bodyStyle}>There&rsquo;s no reliable published average for what these add up to across cases, so we&rsquo;re not going to invent one. The PPD schedule tells you one verifiable piece of the math — not the final number on a settlement check.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">FAQ</h2>

            <p style={bodyStyle}><strong style={strongStyle}>Is there an official chart that shows the dollar amount for each body part?</strong><br />No. States publish a schedule of <em>weeks</em> per body part, not dollars. The dollar amount depends on your percentage of loss and your state&rsquo;s rate rule, so the same injury pays differently in different states.</p>

            <p style={bodyStyle}><strong style={strongStyle}>How many weeks is a hand worth in workers&rsquo; comp?</strong><br />It depends on the state: 150 weeks in Virginia, 160 in Georgia, 215 in Michigan, 244 in New York, 260–300 in New Jersey depending on the percentage of loss, and 104 in Colorado (&ldquo;hand below wrist&rdquo;). Multiply the applicable figure by your percentage of loss for your actual weeks.</p>

            <p style={bodyStyle}><strong style={strongStyle}>Why don&rsquo;t all states pay the same amount for a similar injury?</strong><br />Three variables differ by state: the scheduled weeks for that body part, how the loss percentage is rated, and how the rate is calculated from that percentage. States with similar weeks can diverge sharply once you apply the rate rule — compare Virginia&rsquo;s wage-based rate to Colorado&rsquo;s flat rate above.</p>

            <p style={bodyStyle}><strong style={strongStyle}>Does my permanent partial disability payment cover my whole workers&rsquo; comp settlement?</strong><br />No. PPD is typically one component. Temporary disability payments already received, ongoing or future medical costs, and negotiated resolution of disputed issues can all be part of a final settlement alongside, or instead of, a scheduled PPD award.</p>

            <p style={bodyStyle}><strong style={strongStyle}>What if my state isn&rsquo;t one of the seven listed here?</strong><br />This chart covers only states whose PPD schedules we&rsquo;ve verified against an official statute or state agency source. If yours isn&rsquo;t listed, check your own state&rsquo;s workers&rsquo; compensation agency for its schedule of weeks and rate rule before assuming any figure above applies to you.</p>

            <hr style={ruleStyle} />

            <p style={bodyStyle}><em>This article is general information, not legal advice. Workers&rsquo; compensation schedules, rates, and effective periods change, and impairment ratings are determined case by case. Verify current figures with your state&rsquo;s workers&rsquo; compensation agency, and talk to a licensed attorney in your state before relying on any number here for a real claim.</em></p>

          </article>

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title={pageTitle} path={canonicalUrl} reviewed={getPostDisplayDate(post)} className="mt-10" />
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
