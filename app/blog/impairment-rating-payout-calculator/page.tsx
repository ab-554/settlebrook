// ─────────────────────────────────────────────────────────────────────────────
// app/blog/impairment-rating-payout-calculator/page.tsx
// Blog post — targets "impairment rating payout calculator". Source draft:
// research/2026-09-24/posts/post-8-impairment-rating-payout-calculator.md
// (verification log: post-8-verification.md, same folder).
//
// SCHEDULED for 2026-10-29: lib/data/blogPosts.ts sets this slug's
// publishDate to that day; this page's own notFound() gate (below) returns
// a real 404 until a build runs on or after that date — see
// .github/workflows/daily-rebuild.yml.
//
// Structure follows app/blog/uninsured-motorist-claim/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline; the FAQ is one
//     FAQS array that feeds both the visible accordion text and the schema,
//     so they cannot drift
//   • No manual ad slots (Auto Ads only), no robots override
// Body converted mechanically from the reviewed draft (H1 is the page
// header; frontmatter sources render as the Sources list). Tables are real
// <table>s in an overflow-x-auto wrapper with a min-width so they scroll on a phone.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import CiteThisPage from '@/components/ui/CiteThisPage'
import BlogRail from '@/components/ui/BlogRail'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = "/blog/impairment-rating-payout-calculator/"
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const pageTitle = "Impairment Rating Payout: How a % Becomes Dollars"
const metaDescription =
  "How a workers' comp impairment rating turns into weeks and dollars. Texas worked example with 2026-27 rates, plus Colorado and California rules."

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
        alt: "Impairment Rating Payout — Settlebrook",
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

// ─── Sources (frontmatter of the reviewed draft) ──────────────────────────────

const SOURCES = [
  "https://tdi.texas.gov/wc/employee/maxminbens.html",
  "https://tdi.texas.gov/wc/employee/impairmentben.html",
  "https://www.tdi.texas.gov/wc/hcprovider/ama-guides-sixth.html",
  "https://www.tdi.texas.gov/WC/hcprovider/documents/ama-guides-0826.pdf",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-121/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-126/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-061/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-062/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-123/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-124/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-125/",
  "https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-h/section-408-142/",
  "https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/",
  "https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g",
  "https://cdle.colorado.gov/dwc/dowc-updates",
  "https://cdle.colorado.gov/dwc/injured-workers/understand-potential-benefits",
  "https://www.dir.ca.gov/dwc/workerscompensationbenefits.htm",
  "https://dir.ca.gov/dwc/FactSheets/FactSheet_D.pdf",
  "https://www.dir.ca.gov/dwc/pdr.pdf"
]

// ─── FAQ — single source for the visible text and the FAQPage JSON-LD ────────

const FAQS = [
  {
    "q": "How much is a 10% impairment rating worth?",
    "a": "It depends on the state. In Texas, 10% is 30 weeks, or $21,000 at a hypothetical $700 weekly rate. In Colorado, a 10% loss of a hand below the wrist is 10.4 weeks at $459.45, or $4,778.28. California converts a final rating after adjustments, so a raw 10% cannot be priced."
  },
  {
    "q": "How many weeks of benefits do I get in Texas for my impairment rating?",
    "a": "Three weeks for each percentage point, so a 20% rating is 60 weeks. Benefits start the day after you reach MMI and end when the weeks run out or if you die first (Tex. Labor Code § 408.121)."
  },
  {
    "q": "What is the Texas impairment income benefit maximum for 2026-27?",
    "a": "For injuries from October 1, 2026 through September 30, 2027, the weekly maximum is $920.00 and the minimum is $197.00. For injuries from October 1, 2025 through September 30, 2026, the maximum is $890.00 and the minimum is $191.00. The rate in effect on your injury date applies for the whole claim."
  },
  {
    "q": "Does my wage affect an impairment payout?",
    "a": "In Texas and California, yes, up to each state's cap. In Colorado, no: scheduled injuries pay a flat weekly rate regardless of what you earned."
  },
  {
    "q": "Can I challenge my impairment rating?",
    "a": "Yes, but the deadlines are short. In Texas, a first valid rating becomes final if not disputed before the 91st day after written notice, and a disputed rating goes to a designated doctor. Other states have their own processes, so check with your state agency or a licensed attorney."
  }
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
  dateModified: PUBLISHED_DATE,
  author: {
    '@type': 'Organization',
    name: 'Settlebrook Editorial',
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
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog/' },
    { '@type': 'ListItem', position: 3, name: "Impairment Rating Payout", item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the other blog posts) ────────────────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const
const strongStyle = { color: 'var(--ink)' } as const
// Horizontal scroll wrapper for tables; the min-width on each <table> is what
// forces the scroll on a narrow viewport rather than crushing the text.
const tableWrapStyle = { overflowX: 'auto', marginBottom: 18 } as const

export default function ImpairmentRatingPayoutCalculatorPost() {
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
              { label: "Impairment Rating Payout", href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                {pageTitle}
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

            <p style={bodyStyle}>An impairment rating is a percentage, and a percentage is not a payment. Your doctor says &quot;15%,&quot; and you want to know what that is worth. The answer is a three-step conversion: the rating sets a number of weeks, your state&apos;s rate rule sets a dollar amount per week, and the two multiply together. Each state fills in those steps differently.</p>

            <p style={bodyStyle}>This post uses Texas as the main example, because its rule is easy to follow: a fixed number of weeks for every point of rating. It then covers Colorado&apos;s scheduled-injury rule and how California gets from a rating to a payment. Every figure comes from a state statute or state agency and shows its effective dates. For the general formula most states share, see our <Link href="/blog/ppd-settlement-calculator-guide/" style={linkStyle}>PPD settlement calculator guide</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">The Three Steps: Rating, Weeks, Dollars</h2>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li><strong style={strongStyle}>The rating.</strong> After you reach maximum medical improvement (MMI), meaning your condition has stopped improving, a doctor assigns a percentage for the permanent loss.</li>
              <li><strong style={strongStyle}>The weeks.</strong> Your state turns that percentage into weeks of benefits. Some states count weeks per point of rating. Others assign weeks to each body part and take a share.</li>
              <li><strong style={strongStyle}>The weekly rate.</strong> Your state sets a dollar amount per week, usually a share of your average weekly wage (AWW) with a maximum and minimum. Colorado pays a flat amount for scheduled injuries.</li>
            </ol>

            <p style={bodyStyle}>Weeks times weekly rate is what the formula produces. It is not a settlement offer.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Texas: Impairment Income Benefits</h2>
            <p style={bodyStyle}>Texas calls the payment for a permanent rating <strong style={strongStyle}>impairment income benefits (IIBs)</strong>. Texas Department of Insurance, Division of Workers&apos; Compensation (TDI-DWC) describes them in one line: &quot;If you are eligible, you get three weeks of IIBs for each percentage of impairment&quot; (<a href="https://tdi.texas.gov/wc/employee/impairmentben.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>TDI-DWC, Impairment Income Benefits</a>).</p>

            <h3 className="heading-display h3-editorial">How Texas counts the weeks</h3>
            <p style={bodyStyle}>The statute sets the rule. Under Tex. Labor Code § 408.121(a), IIBs begin the day after you reach MMI and end on the earlier of two dates: when a period &quot;computed at the rate of three weeks for each percentage point of impairment&quot; runs out, or your death (statute text via Justia: <a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-121/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.121</a>). Under subsection (b), the insurance carrier must start paying no later than the fifth day after it receives the doctor&apos;s report certifying MMI.</p>

            <p style={bodyStyle}>The math is a single multiplication: <strong style={strongStyle}>rating % × 3 = weeks</strong>.</p>

            <h3 className="heading-display h3-editorial">How Texas sets the weekly rate</h3>
            <p style={bodyStyle}>Tex. Labor Code § 408.126 sets the IIB rate at 70 percent of your average weekly wage, subject to the maximum and minimum in §§ 408.061 and 408.062 (statute text via Justia: <a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-126/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.126</a>). The maximum for IIBs is 70 percent of the state average weekly wage, and the minimum is 15 percent of it, both rounded to the whole dollar (<a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-061/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.061</a> and <a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-062/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.062</a>, statute text via Justia).</p>

            <p style={bodyStyle}>Those limits reset every October 1, and the limit in effect on your date of injury stays fixed for as long as benefits are paid (§ 408.061(g)). TDI-DWC publishes the figures, last updated 9/14/2026 (<a href="https://tdi.texas.gov/wc/employee/maxminbens.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>TDI-DWC, Maximum and Minimum Weekly Benefits</a>):</p>

            <div style={tableWrapStyle}>
              <table style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th scope="col">Date of injury</th>
                    <th scope="col">State average weekly wage</th>
                    <th scope="col">IIB maximum per week</th>
                    <th scope="col">IIB minimum per week</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Oct. 1, 2026 – Sept. 30, 2027 (fiscal year 2027)</th><td>$1,314.32</td><td>$920.00</td><td>$197.00</td></tr>
                  <tr><th scope="row">Oct. 1, 2025 – Sept. 30, 2026 (fiscal year 2026)</th><td>$1,271.05</td><td>$890.00</td><td>$191.00</td></tr>
                </tbody>
              </table>
            </div>

            <p style={bodyStyle}>An injury on or after October 1, 2026 uses the $920 maximum. An injury on September 30, 2026 uses $890 for the whole claim.</p>

            <p style={bodyStyle}>The IIB maximum is also lower than the &quot;Texas maximum&quot; you often see quoted. The $1,314 figure ($1,271 the year before) is the cap for temporary income benefits, not impairment benefits. Our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>state-by-state maximum weekly benefits page</Link> covers those temporary-benefit caps.</p>

            <h3 className="heading-display h3-editorial">Texas rating-to-weeks table</h3>
            <p style={bodyStyle}>Because the rule is three weeks per point, the weeks column below is exact for any rating. The dollar column uses a hypothetical weekly rate of $700, which is 70 percent of a $1,000 AWW and sits under both the $890 and $920 caps.</p>

            <div style={tableWrapStyle}>
              <table style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th scope="col">Impairment rating</th>
                    <th scope="col">IIB weeks (rating × 3)</th>
                    <th scope="col">Total at a hypothetical $700/week</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">5%</th><td>15</td><td>$10,500</td></tr>
                  <tr><th scope="row">10%</th><td>30</td><td>$21,000</td></tr>
                  <tr><th scope="row">15%</th><td>45</td><td>$31,500</td></tr>
                  <tr><th scope="row">20%</th><td>60</td><td>$42,000</td></tr>
                  <tr><th scope="row">25%</th><td>75</td><td>$52,500</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="heading-display h3-editorial">Worked example: 15% rating, AWW $1,000</h3>
            <p style={bodyStyle}>This is a hypothetical, not an estimate for a real claim. Say a worker is injured on November 2, 2026, reaches MMI, and receives a 15% rating. Their AWW is $1,000.</p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Weeks:</strong> 15 × 3 = <strong style={strongStyle}>45 weeks</strong>.</li>
              <li><strong style={strongStyle}>Rate:</strong> 70% × $1,000 = $700.00 per week. That is below the $920 maximum for fiscal year 2027, so the full $700.00 applies.</li>
              <li><strong style={strongStyle}>Total:</strong> 45 × $700.00 = <strong style={strongStyle}>$31,500.00</strong>.</li>
            </ul>

            <p style={bodyStyle}>Now raise the wage. With the same rating and an AWW of $1,500, 70% × $1,500 = $1,050, which is over the cap, so the rate drops to $920: 45 × $920.00 = <strong style={strongStyle}>$41,400.00</strong>. Had that injury happened in September 2026, the cap would be $890: 45 × $890.00 = $40,050.00. Both examples assume wages high enough that the $197 minimum does not apply.</p>

            <h3 className="heading-display h3-editorial">What a 15% rating also means</h3>
            <p style={bodyStyle}>Fifteen percent is a threshold in Texas. Supplemental income benefits after IIBs end require &quot;an impairment rating of 15 percent or more,&quot; along with other conditions such as work-status and job-search requirements (Tex. Labor Code § 408.142(a), statute text via Justia: <a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-h/section-408-142/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.142</a>). A 14% rating cannot qualify.</p>

            <h3 className="heading-display h3-editorial">Who sets the rating, and what happens in a dispute</h3>
            <p style={bodyStyle}>The doctor who certifies MMI also assigns the rating, using the guidelines in § 408.124 (<a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-123/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.123</a>, statute text via Justia). Texas uses the AMA Guides to the Evaluation of Permanent Impairment, 4th edition (1993). DWC says it has used that edition for over 20 years and plans to move to the 6th edition (2025) (<a href="https://www.tdi.texas.gov/wc/hcprovider/ama-guides-sixth.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>TDI-DWC, AMA Guides transition</a>). A DWC stakeholder presentation shows a tentative January 1, 2028 start for exams under the new edition, with dates &quot;tentative and subject to change&quot; (<a href="https://www.tdi.texas.gov/WC/hcprovider/documents/ama-guides-0826.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>DWC presentation</a>).</p>

            <p style={bodyStyle}>A rating can be disputed, but the clock is short:</p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>A first valid rating becomes final if it is not disputed before the 91st day after written notice goes to you and the carrier (§ 408.123(e)). Later disputes need compelling medical evidence (§ 408.123(f)).</li>
              <li>If the carrier disputes the rating, it must still pay IIBs based on its &quot;reasonable assessment of the correct rating&quot; (§ 408.121(c)).</li>
              <li>When a rating is disputed, DWC sends the employee to the next available doctor on its designated doctor list, and that doctor&apos;s report carries presumptive weight unless other medical evidence outweighs it (<a href="https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-125/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 408.125</a>, statute text via Justia).</li>
            </ul>

            <p style={bodyStyle}>Every rating point is worth three weeks, so a two-point gap between doctors is six weeks of benefits. Our <Link href="/workers-comp-settlement-calculator/texas/" style={linkStyle}>Texas workers&apos; comp calculator</Link> shows what a different rating does to your total.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Colorado: Scheduled Injuries Pay a Flat Weekly Rate</h2>
            <p style={bodyStyle}>Colorado splits injuries into two groups. The state&apos;s division describes scheduled injuries as loss of function &quot;to your toes, feet, legs, fingers, hands, arms, eyes, vision or hearing,&quot; and non-scheduled (whole person) injuries as loss of function &quot;to your spine, lungs, or mental function&quot; (<a href="https://cdle.colorado.gov/dwc/injured-workers/understand-potential-benefits" target="_blank" rel="noopener noreferrer" style={linkStyle}>Colorado DWC, Understand Potential Benefits</a>).</p>

            <p style={bodyStyle}>For scheduled injuries, the statute assigns weeks to each body part: the loss of a hand below the wrist is 104 weeks (C.R.S. § 8-42-107(2)(c)), and a partial loss pays the &quot;proportionate share&quot; of that schedule (§ 8-42-107(7)(b)(II)) (statute text via Justia: <a href="https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/" target="_blank" rel="noopener noreferrer" style={linkStyle}>§ 8-42-107</a>). The weekly rate is a flat statutory amount that is adjusted each July 1 and does not depend on your wages. For injuries from July 1, 2026 through June 30, 2027, it is $459.45 per week under the <a href="https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g" target="_blank" rel="noopener noreferrer" style={linkStyle}>2026 Max Benefits Order</a>, which Colorado DWC posted on June 2, 2026 as effective July 1, 2026 (<a href="https://cdle.colorado.gov/dwc/dowc-updates" target="_blank" rel="noopener noreferrer" style={linkStyle}>DOWC updates</a>).</p>

            <p style={bodyStyle}><strong style={strongStyle}>Hypothetical example: hand below the wrist, 20% loss</strong></p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Weeks: 104 × 0.20 = <strong style={strongStyle}>20.8 weeks</strong>.</li>
              <li>Rate: the flat $459.45 per week. Your AWW is not used.</li>
              <li>Total: 20.8 × $459.45 = <strong style={strongStyle}>$9,556.56</strong>.</li>
            </ul>

            <p style={bodyStyle}>At 10% loss, the same hand is 10.4 weeks × $459.45 = $4,778.28.</p>

            <h3 className="heading-display h3-editorial">Colorado whole-person injuries: explanation only</h3>
            <p style={bodyStyle}>We do not calculate this track, because we could not verify the full age-factor table. Here is how the state describes it: injuries not on the schedule (for example, back or neck) are rated as whole-person impairment: rating % × an age factor (1.80 at age 20 or younger, down to 1.00 at 60 or older) × 400 weeks, paid at the TTD rate within a 2026–2027 range of $150.00–$804.46 per week. Combined TTD and PPD are capped at $202,297.46 (whole-person rating 19% or less) or $328,049.94 (20% or more) for 2026–2027 (C.R.S. § 8-42-107.5; DOWC 2026 Max Benefits Order).</p>

            <p style={bodyStyle}>Colorado&apos;s statute names the revised third edition of the AMA Guides, as in effect July 1, 1991, for whole-person ratings (§ 8-42-107(8)(c)). Our <Link href="/workers-comp-settlement-calculator/colorado/" style={linkStyle}>Colorado calculator</Link> handles the scheduled track.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">California: A Rating Becomes a Final Percentage, Then Weeks, Then a Rate</h2>
            <p style={bodyStyle}>California has more steps than Texas or Colorado, and we are not publishing a dollar total for it. Here is what the state&apos;s Division of Workers&apos; Compensation (DWC) publishes:</p>

            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li><strong style={strongStyle}>Impairment to disability.</strong> DWC says, &quot;Whole person impairment is converted to disability using modifiers in the Permanent Disability Rating Schedule (PDRS).&quot; For injuries on or after January 1, 2013, a 1.4 modifier replaced the future-earning-capacity (FEC) modifier, and the 2005 PDRS is then used to adjust for occupation and age (<a href="https://www.dir.ca.gov/dwc/workerscompensationbenefits.htm" target="_blank" rel="noopener noreferrer" style={linkStyle}>DWC, Workers&apos; Compensation Benefits</a>). Apportionment, meaning how much of the disability comes from other causes, also affects the result.</li>
              <li><strong style={strongStyle}>Percentage to weeks.</strong> The schedule says &quot;Each rating corresponds to a fixed number of weeks of compensation,&quot; paid under Labor Code § 4658 (<a href="https://www.dir.ca.gov/dwc/pdr.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>DWC, 2005 Schedule for Rating Permanent Disabilities</a>).</li>
              <li><strong style={strongStyle}>Weeks to dollars.</strong> DWC&apos;s fact sheet says your percentage of disability &quot;equals a specific dollar amount, depending on the date of your injury&quot; (<a href="https://dir.ca.gov/dwc/FactSheets/FactSheet_D.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>DWC Fact Sheet D</a>). The weekly PD rate is a share of your average weekly wage, within a minimum and maximum that depend on your injury date and how high your rating is.</li>
            </ol>

            <p style={bodyStyle}>We could not confirm the weeks-per-percentage table on a DWC page, and a wrong week count would produce a wrong total, so we show no California payout figure. For your own number, use DWC&apos;s published resources above or contact DWC&apos;s Disability Evaluation Unit or a local Information &amp; Assistance office. Our <Link href="/workers-comp-settlement-calculator/california/" style={linkStyle}>California calculator page</Link> has the state&apos;s weekly benefit figures.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What the Formula Leaves Out</h2>
            <p style={bodyStyle}>The payout above is one piece of a workers&apos; comp claim: the permanent impairment benefit. It does not include temporary disability checks, medical care, or anything negotiated in a settlement. A settlement can resolve disputes over the rating, the injury, or future medical costs for a lump sum that does not trace back to weeks times rate. We do not publish an &quot;average&quot; payout, because no official source gives one. For how other states compare, see our <Link href="/blog/workers-comp-settlement-chart/" style={linkStyle}>workers&apos; comp settlement chart</Link>. Our <Link href="/methodology/" style={linkStyle}>methodology page</Link> explains how we source each figure, and the <Link href="/workers-comp-settlement-calculator/" style={linkStyle}>workers&apos; comp settlement calculator</Link> lets you run your own numbers.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Frequently Asked Questions</h2>
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="heading-display h3-editorial">{faq.q}</h3>
                <p style={bodyStyle}>{faq.a}</p>
              </div>
            ))}

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Sources</h2>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              {SOURCES.map((url) => (
                <li key={url} style={{ wordBreak: 'break-all' }}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{url.replace(/^https?:\/\//, '')}</a>
                </li>
              ))}
            </ul>

            <hr style={ruleStyle} />

            <p style={{ ...bodyStyle, fontSize: '15px' }}><em>This article is general information, not legal advice. Workers&apos; compensation rates, ratings and deadlines change and are decided case by case. Check current figures with your state&apos;s workers&apos; compensation agency, and talk to a licensed attorney in your state before relying on any number here for a real claim.</em></p>

          </article>

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title={pageTitle} path={canonicalUrl} reviewed={getPostDisplayDate(post)} className="mt-10" />
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
