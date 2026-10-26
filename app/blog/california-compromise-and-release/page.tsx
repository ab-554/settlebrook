// ─────────────────────────────────────────────────────────────────────────────
// app/blog/california-compromise-and-release/page.tsx
// Blog post — targets "compromise and release settlement amounts". Source draft:
// research/2026-09-24/posts/post-9-california-compromise-and-release.md
// (verification log: post-9-verification.md, same folder).
//
// SCHEDULED for 2026-11-02: lib/data/blogPosts.ts sets this slug's
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

const canonicalUrl = "/blog/california-compromise-and-release/"
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const pageTitle = "California Compromise and Release vs. Stipulated Award"
const metaDescription =
  "California C&R vs. Stipulations with Request for Award: what each closes, how future medical and the settlement amount are handled, and WCAB approval."

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
        alt: "California Compromise and Release vs. Stipulated Award — Settlebrook",
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
  "https://www.dir.ca.gov/dwc/CaseResolved.htm",
  "https://www.dir.ca.gov/dwc/wcfaqiw.html",
  "https://www.dir.ca.gov/dwc/DEU110.pdf",
  "https://www.dir.ca.gov/dwc/setguide.pdf",
  "https://www.dir.ca.gov/dwc/FORMS/EAMS%20Forms/ADJ/DWCForm10214c.pdf",
  "https://www.dir.ca.gov/dwc/FORMS/EAMS%20Forms/ADJ/DWCForm10214a.pdf",
  "https://www.dir.ca.gov/dwc/WorkersCompensationBenefits.htm",
  "https://dir.ca.gov/DIRNews/2025/2025-116.html",
  "https://www.dir.ca.gov/dwc/IandA.html",
  "https://www.dir.ca.gov/InjuredWorkerGuidebook/FAQs_IandA.pdf",
  "https://www.dir.ca.gov/InjuredWorkerGuidebook/Chapter5.pdf",
  "https://www.dir.ca.gov/InjuredWorkerGuidebook/Chapter7.pdf",
  "https://www.dir.ca.gov/InjuredWorkerGuidebook/Chapter11.pdf",
  "https://www.dir.ca.gov/dwc/deu.html",
  "https://www.dir.ca.gov/dwc/FAQ/DEU_FAQ.html",
  "https://www.dir.ca.gov/dwc/pdr.pdf",
  "https://www.dir.ca.gov/t8/10700.html",
  "https://www.dir.ca.gov/t8/10702.html",
  "https://law.justia.com/codes/california/code-lab/division-4/part-3/chapter-2/section-5001/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-3/chapter-2/section-5002/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-3/chapter-2/section-5003/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-4/chapter-5/section-5702/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-4/chapter-2/section-5410/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-4/chapter-6/section-5804/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-2/chapter-2/article-3/section-4650/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-2/chapter-2/article-3/section-4656/",
  "https://law.justia.com/codes/california/code-lab/division-4/part-2/chapter-2/article-3/section-4660-1/",
  "https://www.cms.gov/medicare/coordination-benefits-recovery/workers-comp-set-aside-arrangements"
]

// ─── FAQ — single source for the visible text and the FAQPage JSON-LD ────────

const FAQS = [
  {
    "q": "Can I get medical care after a California Compromise and Release?",
    "a": "Usually not at the insurer's expense. DWC says that if the lump sum covers the estimated cost of future medical care, the claims administrator stops paying your doctor and the cost becomes yours. The signed agreement controls, so read what it says about medical care."
  },
  {
    "q": "What if my condition gets worse after I settle with stips?",
    "a": "You can request more benefits, usually within five years of the injury date. The claims administrator can likewise ask for a reduction if you improve. After a C&R you can't ask for more."
  },
  {
    "q": "How much is a California Compromise and Release worth?",
    "a": "No agency publishes an average, and the amount isn't set by a formula. It's negotiated from three pieces: temporary disability paid or owed, permanent disability from the rating, and an estimate of future medical costs. Fees, liens and advances then come out."
  },
  {
    "q": "Can a judge reject my settlement?",
    "a": "Yes. The WCAB must inquire into whether the agreement is adequate and may disapprove it or set a hearing. A settlement isn't valid until approved."
  },
  {
    "q": "Do I need a Medicare Set-Aside?",
    "a": "CMS says no law requires submitting a proposal, but it is a recommended process, and CMS sets review thresholds for Medicare beneficiaries and people expecting to enroll within 30 months. Check CMS's WCMSA page before you sign anything."
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
    { '@type': 'ListItem', position: 3, name: "California Compromise and Release vs. Stipulated Award", item: canonicalUrl },
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

export default function CaliforniaCompromiseAndReleasePost() {
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
              { label: "California Compromise and Release vs. Stipulated Award", href: canonicalUrl },
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

            <p style={bodyStyle}>When a California workers&apos; comp claim settles, it settles one of two ways: a <strong style={strongStyle}>Compromise and Release</strong> (C&amp;R) or <strong style={strongStyle}>Stipulations with Request for Award</strong> (usually called &quot;stips&quot;). The choice decides two big things: whether you get one lump sum or payments over time, and who pays for your medical care after the case is over.</p>

            <p style={bodyStyle}>You&apos;ll also see pages promising &quot;compromise and release settlement amounts.&quot; No agency publishes those, and we won&apos;t invent an average. What we can show is the pieces every California settlement is built from, the math behind the one piece that has a fixed formula, and the approval step that every settlement has to clear. For how the weekly check works before any settlement, see our guide to <Link href="/blog/workers-comp-weekly-benefit-calculator/" style={linkStyle}>how your workers&apos; comp weekly check is calculated</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">C&amp;R vs. Stips at a Glance</h2>
            <div style={tableWrapStyle}>
              <table style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th scope="col"><span className="sr-only">Topic</span></th>
                    <th scope="col">Compromise and Release (C&amp;R)</th>
                    <th scope="col">Stipulations with Request for Award (Stips)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">What closes</th><td>Usually the whole claim as written in the agreement. The insurer or employer is released from future liability.</td><td>The benefits you agree on, such as permanent disability. The award can still be changed for a limited time, and medical care stays open.</td></tr>
                  <tr><th scope="row">Future medical care</th><td>If the lump sum covers estimated future medical costs, the claims administrator stops paying your doctor and the cost becomes yours.</td><td>The claims administrator usually keeps paying for medical care for the injury.</td></tr>
                  <tr><th scope="row">How you&apos;re paid</th><td>One lump sum, covering permanent disability not yet paid.</td><td>Payments over time.</td></tr>
                  <tr><th scope="row">If your condition worsens</th><td>You can&apos;t ask for more benefits later.</td><td>Either side can usually ask for a change within five years of the injury date.</td></tr>
                  <tr><th scope="row">Approval</th><td>A workers&apos; compensation judge must review it for adequacy.</td><td>Same.</td></tr>
                  <tr><th scope="row">Official form</th><td>DWC-CA 10214(c)</td><td>DWC-CA 10214(a)</td></tr>
                </tbody>
              </table>
            </div>

            <p style={bodyStyle}>Terms vary from one agreement to the next, so the signed document controls, not this table.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How a Compromise and Release Works</h2>
            <p style={bodyStyle}>A C&amp;R is a negotiated deal. You and the claims administrator agree on a dollar amount to resolve the claim. The State of California&apos;s description is plain: after a judge approves the lump sum, &quot;the claims administrator will not be liable for any further payments or medical care.&quot;</p>

            <p style={bodyStyle}>The mechanics come from the Labor Code. Both sides sign, and a copy goes to the Workers&apos; Compensation Appeals Board (WCAB), which can then enter an award based on the agreement (Lab. Code § 5002). The agreement has to state the date of the accident, your average weekly wage, the type of disability, and the amounts paid or still owed (Lab. Code § 5003).</p>

            <p style={bodyStyle}>The state&apos;s own C&amp;R form releases the employer and insurer &quot;from all claims and causes of action, whether now known or ascertained.&quot; Because that release is broad, the Division of Workers&apos; Compensation (DWC) requires every body part and date of injury being settled to be listed up front, and it limits &quot;all injuries&quot; language to body parts that were actually injured and evaluated in the medical reports.</p>

            <p style={bodyStyle}>Once approved, a C&amp;R is hard to undo. DWC&apos;s notice to injured workers says an approved C&amp;R is final and can rarely be set aside.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Stipulations with Request for Award Work</h2>
            <p style={bodyStyle}>With stips, you and the claims administrator agree on the facts and on what is owed, then ask the WCAB to issue an award based on that agreement. The Labor Code allows exactly this: the parties may agree on the facts, file the agreement, and the board may decide the case on it (Lab. Code § 5702). The state&apos;s stipulation form has you &quot;stipulate to the issuance of an Award,&quot; state a permanent disability percentage and weekly rate, and mark whether there is a need for medical treatment.</p>

            <p style={bodyStyle}>Two things set stips apart:</p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Medical care stays open.</strong> DWC says a stip &quot;usually includes a sum of money and future medical treatment,&quot; with payments &quot;over time.&quot;</li>
              <li><strong style={strongStyle}>The award can be reopened for a limited time.</strong> If your condition gets worse, you can request more benefits, and if it improves, the claims administrator can request a reduction. DWC says these requests usually must be made within five years of the injury date. The statute behind that window says no award may be changed &quot;after five years from the date of the injury&quot; (Lab. Code § 5804), and an injured worker may claim &quot;new and further disability&quot; within five years of the injury (Lab. Code § 5410).</li>
            </ul>

            <p style={bodyStyle}>That five years runs from the day you were hurt, not from the day the award was issued.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How the Settlement Amount Gets Built</h2>
            <p style={bodyStyle}>A C&amp;R number is negotiated, not computed. But the negotiation starts from benefits that have a legal basis, and DWC requires the settlement to &quot;fully explain the basis for the settlement amount, including how PD was determined.&quot; Three pieces feed in.</p>

            <h3 className="heading-display h3-editorial">1. Temporary disability (TD) paid or owed</h3>
            <p style={bodyStyle}>TD replaces part of your wages while you can&apos;t do your usual job. As a general rule it is two-thirds of the gross wages you lose, within a state minimum and maximum. For a 2026 injury, DWC&apos;s rate chart (organized by date of injury) shows:</p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>AWW below $396.92: the TD rate is $264.61 per week.</li>
              <li>AWW from $396.93 to $2,646.17: TD is 2/3 × AWW.</li>
            </ul>

            <p style={bodyStyle}>Two-thirds of the top of that band is the 2026 maximum of $1,764.11 per week, which matches DIR&apos;s announcement that the maximum rises from $1,680.29 on January 1, 2026. Our <Link href="/workers-comp-maximum-weekly-benefits-by-state/" style={linkStyle}>state-by-state maximum benefits table</Link> uses the same figures. For injuries on or after January 1, 2008, TD generally stops at 104 weeks within five years of the injury, and certain listed conditions, including amputations and severe burns, allow up to 240 weeks (Lab. Code § 4656).</p>

            <p style={bodyStyle}><strong style={strongStyle}>Hypothetical example, not a settlement estimate.</strong> Say a worker hurt in 2026 earned an AWW of $1,200 and was off work 20 weeks.</p>

            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>$1,200 falls inside the $396.93 to $2,646.17 band, so TD = 2/3 × $1,200 = <strong style={strongStyle}>$800.00 per week</strong>.</li>
              <li>If 12 weeks were paid: 12 × $800.00 = <strong style={strongStyle}>$9,600.00</strong>.</li>
              <li>If 8 weeks were owed and unpaid: 8 × $800.00 = <strong style={strongStyle}>$6,400.00</strong>.</li>
              <li>All 20 weeks: 20 × $800.00 = <strong style={strongStyle}>$16,000.00</strong>, well under the 104-week limit.</li>
            </ul>

            <p style={bodyStyle}>A worker with a $3,000 AWW would hit the cap instead: 2/3 × $3,000 is $2,000, but the maximum is $1,764.11.</p>

            <p style={bodyStyle}>That $16,000 is only the TD line. It says nothing about permanent disability or future medical care.</p>

            <h3 className="heading-display h3-editorial">2. Permanent disability (PD)</h3>
            <p style={bodyStyle}>PD is payment for a lasting loss after you&apos;ve recovered as much as you&apos;re going to. In California, for injuries on or after January 1, 2013, the rating starts with the doctor&apos;s whole-person impairment under the AMA Guides, 5th Edition, which is &quot;multiplied by an adjustment factor of 1.4&quot; (Lab. Code § 4660.1). DWC&apos;s rating schedule then adjusts for occupation and for age at the date of injury, and apportionment (how much of the disability the job caused versus other factors) is considered too. The rating, your injury date, your pre-injury wages and whether your employer offers you qualifying work all feed into the PD amount, and &quot;PD benefit amounts are set by law.&quot;</p>

            <p style={bodyStyle}>We don&apos;t print California PD dollar figures here, because the weeks and weekly limits depend on the rating and the injury date and should come from DWC directly. Use DWC&apos;s <a href="https://www.dir.ca.gov/dwc/deu.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>permanent disability rating schedule and rating resources</a> for the rating, and see our <Link href="/blog/ppd-settlement-calculator-guide/" style={linkStyle}>PPD settlement guide</Link> for how impairment ratings work in general.</p>

            <p style={bodyStyle}>How PD shows up differs by settlement type. In stips, the agreed PD is paid over time. In a C&amp;R, you receive one lump sum covering the PD you haven&apos;t yet received, and DWC says it &quot;is reduced by the PD benefits that you already received, including any lump sum advances.&quot;</p>

            <h3 className="heading-display h3-editorial">3. Future medical exposure</h3>
            <p style={bodyStyle}>This is the piece that makes C&amp;R numbers hard to compare. Under stips the insurer keeps paying, so no one has to put a price on future treatment. Under a C&amp;R the parties estimate what future care might cost and fold that estimate into the lump sum, because afterward the cost is yours. Different assumptions about surgery, therapy and medication produce very different estimates. There is no official formula, and we won&apos;t offer a typical figure.</p>

            <h3 className="heading-display h3-editorial">What comes out of the lump sum</h3>
            <p style={bodyStyle}>The state&apos;s C&amp;R form has lines for the attorney&apos;s fee requested, liens to be paid out of the settlement, PD advances already paid, and any TD overpayment. A judge must approve any attorney fee. So the number on the settlement is not always the number you receive.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">The WCAB Approval Step</h2>
            <p style={bodyStyle}>A California settlement isn&apos;t valid until it&apos;s approved. The Labor Code says &quot;No release of liability or compromise agreement is valid unless it is approved by the appeals board or referee&quot; (Lab. Code § 5001).</p>

            <p style={bodyStyle}>Under WCAB rule 8 CCR § 10700, the board &quot;shall inquire into the adequacy&quot; of both C&amp;Rs and stips. It may set a hearing to take evidence, approve or disapprove the agreement, or issue findings and awards. For agreements that pay less than the full compensation due and release the employer from future liability, the rule says approval comes only &quot;where it appears that a reasonable doubt exists as to the rights of the parties or that approval is in the best interest of the parties.&quot; Lien claimants on file must be served a copy (8 CCR § 10702).</p>

            <p style={bodyStyle}>Signing is not the finish line: until the judge approves it, the settlement isn&apos;t final. You are also not required to accept any offer.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Medicare Set-Asides</h2>
            <p style={bodyStyle}>If you&apos;re on Medicare, or expect to be within 30 months, a settlement that covers future medical care can raise a federal question. The Centers for Medicare &amp; Medicaid Services (CMS) describes a workers&apos; compensation Medicare Set-Aside (WCMSA) as &quot;a financial agreement that allocates a portion of a workers&apos; compensation settlement to pay for future medical services.&quot; CMS says there are &quot;no statutory or regulatory provisions requiring that a WCMSA proposal be submitted to CMS for review&quot; and calls submission a recommended process. It reviews proposals when the claimant is a Medicare beneficiary and the total settlement is over $25,000, or when the claimant reasonably expects Medicare enrollment within 30 months and the settlement is expected to exceed $250,000. The state&apos;s C&amp;R form also has a paragraph headed &quot;Social Security, Medicare and Long-Term Disability Benefits.&quot; See CMS&apos;s <a href="https://www.cms.gov/medicare/coordination-benefits-recovery/workers-comp-set-aside-arrangements" target="_blank" rel="noopener noreferrer" style={linkStyle}>WCMSA page</a> for the details.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Free Help From DWC</h2>
            <p style={bodyStyle}>DWC&apos;s Information &amp; Assistance (I&amp;A) officers answer questions and help injured workers sort out problems with a claim, and DWC says &quot;their services are free.&quot; They can call the claims administrator to clear up misunderstandings, but they &quot;cannot actively prepare your case, fill out forms or argue on your behalf.&quot; DWC&apos;s line is 1-800-736-7401. More at the <a href="https://www.dir.ca.gov/dwc/IandA.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>I&amp;A Unit page</a>.</p>

            <p style={bodyStyle}>To see where your own weekly numbers land, use our <Link href="/workers-comp-settlement-calculator/california/" style={linkStyle}>California workers&apos; comp calculator page</Link> or the main <Link href="/workers-comp-settlement-calculator/" style={linkStyle}>workers&apos; comp settlement calculator</Link>. Any calculator, ours included, can only approximate California&apos;s permanent disability amount. How we source our figures is on our <Link href="/methodology/" style={linkStyle}>methodology page</Link>.</p>

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

            <p style={{ ...bodyStyle, fontSize: '15px' }}><em>This article is general information, not legal advice. California workers&apos; compensation rules, rates and forms change, and every claim turns on its own facts. Confirm current figures with the Division of Workers&apos; Compensation and talk to a licensed California attorney or a DWC Information &amp; Assistance officer before you sign a settlement.</em></p>

          </article>

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title={pageTitle} path={canonicalUrl} reviewed={getPostDisplayDate(post)} className="mt-10" />
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
