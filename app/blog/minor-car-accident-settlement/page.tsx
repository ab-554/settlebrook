// ─────────────────────────────────────────────────────────────────────────────
// app/blog/minor-car-accident-settlement/page.tsx
// Blog post #7 — targets "minor car accident settlement" / "soft tissue
// injury settlement" / "whiplash settlement calculator". Source draft:
// research/2026-09-24/posts/post-5-minor-car-accident-settlement.md
//
// SCHEDULED for 2026-10-01: lib/data/blogPosts.ts sets this slug's
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

const canonicalUrl = '/blog/minor-car-accident-settlement/'
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const metaDescription =
  "How minor car accident settlements differ when there's a soft-tissue injury versus no injury at all, plus a free calculator to estimate yours."

export const metadata: Metadata = {
  title: 'Minor Car Accident Settlements: Injury vs. No Injury',
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Minor Car Accident Settlements: Soft-Tissue Injuries vs. No Injury',
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
        alt: 'Minor Car Accident Settlements — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minor Car Accident Settlements: Soft-Tissue Injuries vs. No Injury',
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
  headline: 'Minor Car Accident Settlements: Soft-Tissue Injuries vs. No Injury',
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
      name: 'Is a minor car accident with no injury still worth filing a claim for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Even with no injury, you can typically recover repair costs, a rental car or loss-of-use payment, and — if the repaired car is worth less because of its accident history — a diminished value claim.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does whiplash always qualify as a "real" injury for settlement purposes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Whiplash is a recognized injury. What insurers look at closely is documentation — how quickly you were evaluated, how consistent treatment was, and whether records connect the injury to the accident. In a no-fault state, the injury also has to meet that state's statutory threshold before you can pursue pain and suffering from the other driver.",
      },
    },
    {
      '@type': 'Question',
      name: "What's the difference between a no-fault state and an at-fault state?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In a no-fault state, your own PIP coverage pays medical bills and lost wages first, and you generally can't sue the other driver for pain and suffering unless your injury meets a state-law threshold. In an at-fault (tort) state, you file directly against the other driver's liability insurer, with no threshold to clear first.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I take a minor car accident claim to small claims court?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It's generally an option for property-damage-only disputes within your state's dollar limit — for example, up to $12,500 for an individual in California or up to $20,000 in Texas justice court. It's less commonly used for injury claims, and limits vary by state, so check with your local court.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long do I have to file a claim after a minor accident?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your state. Texas and California, for example, both set a two-year deadline for personal injury claims. Confirm your specific deadline with a licensed attorney — missing it can permanently bar your claim.',
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
    { '@type': 'ListItem', position: 3, name: 'Minor Car Accident Settlement', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--accent)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const

export default function MinorCarAccidentSettlementPost() {
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
        <header className="page-band">
          <div className="container-page py-8 sm:py-10">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog/' },
              { label: 'Minor Car Accident Settlement', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Minor Car Accident Settlements: Soft-Tissue Injuries vs. No Injury
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
        <article className="container-page py-10 sm:py-12">
          <div className="editorial">

            <p style={bodyStyle}>Many car accidents are minor. A bumper gets crumpled at a stoplight, a fender gets clipped in a parking lot, or a rear-end collision at low speed leaves both cars driveable. But &ldquo;minor&rdquo; covers two very different situations that lead to very different settlements: accidents where nobody was hurt, and accidents where someone walks away with a sore neck or back that turns into a diagnosed soft-tissue injury a day or two later.</p>
            <p style={bodyStyle}>This article covers both scenarios — what&rsquo;s recoverable with no injury, what changes once a soft-tissue injury like whiplash is involved, how your state&rsquo;s no-fault or at-fault system changes the math, and a worked hypothetical example using Settlebrook&rsquo;s own settlement formula.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">No Injury: What a Property-Damage-Only Claim Covers</h2>
            <p style={bodyStyle}>When nobody is hurt, the claim is purely about the vehicle and the related costs of being without it. Three categories typically make up a property-damage-only claim:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>Repair costs</strong> — what a body shop charges to return the car to its pre-accident condition, usually based on an insurance appraisal or shop estimate.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Rental or loss-of-use costs</strong> — reimbursement for a rental car (or the cash value of not having your vehicle) while it&rsquo;s in the shop, or while a total-loss payout is being worked out.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Diminished value</strong> — the drop in resale value a vehicle carries simply because it now has an accident on its title history, even after a proper repair. Insurers and courts have argued over how to calculate this for more than two decades. If your car was repaired but you think it&rsquo;s worth less because of the accident, our <Link href="/blog/diminished-value-claim/" style={linkStyle}>diminished value claim guide</Link> walks through how that number is typically calculated and who owes it.</li>
            </ul>
            <p style={bodyStyle}>Because there&rsquo;s no injury, there&rsquo;s no pain-and-suffering component and no multiplier to apply — the claim is simply the sum of your actual, documented losses. A no-injury claim can also resolve faster, since it doesn&rsquo;t depend on medical treatment finishing or a doctor determining you&rsquo;ve reached maximum medical improvement.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">Soft-Tissue Injuries: What Actually Changes the Value</h2>
            <p style={bodyStyle}>Whiplash, muscle strains, and ligament sprains are common in low-speed collisions. They don&rsquo;t show up on an X-ray the way a fracture does, which is exactly why documentation carries more weight in these claims than in claims involving obvious, visible injuries.</p>
            <p style={bodyStyle}>A few general factors tend to matter most to an insurance adjuster or, if it goes that far, a court:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>How quickly you were evaluated.</strong> A doctor, urgent care, or ER visit the same day or within a day or two of the crash ties your symptoms to the accident. A long gap gives an insurer room to argue something else caused the pain.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Whether treatment was consistent.</strong> Following through on the recommended treatment plan, without long unexplained gaps, supports the claim that the injury was real and required ongoing care.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Whether the record is complete.</strong> Diagnosis codes, physical therapy notes, and a clear point where you were declared recovered give a concrete basis for valuing the claim rather than leaving it to guesswork.</li>
            </ul>
            <p style={bodyStyle}>None of this changes the legal test for whether you qualify to bring a pain-and-suffering claim in the first place — that depends on whether your state is a no-fault state or an at-fault state.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">No-Fault States: PIP Pays First, and a Threshold Limits Pain-and-Suffering Claims</h2>
            <p style={bodyStyle}>Some states run on a &ldquo;no-fault&rdquo; system for auto insurance. In these states, your own Personal Injury Protection (PIP) coverage pays your medical bills and lost wages first, regardless of who caused the crash. But no-fault also means you generally can&rsquo;t sue the other driver for pain and suffering unless your injury clears a legal threshold set by state law. Three examples show how this works in practice.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Florida.</strong> Florida&rsquo;s PIP statute requires insurers to pay &ldquo;[e]ighty percent of all reasonable expenses for medically necessary medical, surgical, X-ray, dental, and rehabilitative services&rdquo; and &ldquo;[s]ixty percent of any loss of gross income and loss of earning capacity,&rdquo; subject to a minimum $10,000 in combined medical and disability benefits and a separate $5,000 death benefit (<a href="https://www.flsenate.gov/Laws/Statutes/2025/627.736" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 627.736</a>). To recover pain and suffering from the at-fault driver, the injury must be a &ldquo;[s]ignificant and permanent loss of an important bodily function,&rdquo; a &ldquo;[p]ermanent injury within a reasonable degree of medical probability&rdquo; (other than scarring or disfigurement), &ldquo;[s]ignificant and permanent scarring or disfigurement,&rdquo; or death (<a href="https://www.flsenate.gov/laws/statutes/2025/627.737" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 627.737</a>). A soft-tissue strain that resolves with treatment generally won&rsquo;t meet this threshold, which is why PIP — not a lawsuit — is usually where a minor Florida claim gets paid.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>New York.</strong> New York limits lawsuits for pain and suffering to cases meeting the statutory definition of &ldquo;serious injury&rdquo;: &ldquo;death; dismemberment; significant disfigurement; a fracture; loss of a fetus; permanent loss of use of a body organ, member, function or system; permanent consequential limitation of use of a body organ or member; [or] significant limitation of use of a body function or system,&rdquo; plus a category for injuries that prevent someone from performing substantially all usual daily activities for at least 90 of the 180 days after the accident (<a href="https://www.nysenate.gov/legislation/laws/ISC/5102" target="_blank" rel="noopener noreferrer" style={linkStyle}>N.Y. Ins. Law § 5102(d)</a>). Because &ldquo;significant limitation&rdquo; is a broad, fact-specific category, some well-documented soft-tissue claims do clear this threshold.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Michigan.</strong> A person is subject to tort liability for pain and suffering from a car accident &ldquo;only if the injured person has suffered death, serious impairment of body function, or permanent serious disfigurement&rdquo; (<a href="https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-500-3135" target="_blank" rel="noopener noreferrer" style={linkStyle}>MCL § 500.3135(1)</a>). &ldquo;Serious impairment of body function&rdquo; requires an impairment that is objectively manifested (observable by someone other than the injured person), affects an important body function, and affects the person&rsquo;s general ability to lead their normal life. As in New York, this is a case-by-case standard, so whether a given whiplash case qualifies depends heavily on the medical evidence.</p>
            <p style={bodyStyle}>If you&rsquo;re dealing with a minor accident in one of these states, our <Link href="/car-accident-settlement-calculator/florida/" style={linkStyle}>Florida</Link>, <Link href="/car-accident-settlement-calculator/new-york/" style={linkStyle}>New York</Link>, and <Link href="/car-accident-settlement-calculator/michigan/" style={linkStyle}>Michigan</Link> settlement calculator pages walk through how each state&rsquo;s rules affect your estimate.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">At-Fault States: Filing Against the Other Driver&rsquo;s Insurance</h2>
            <p style={bodyStyle}>Other states use a traditional &ldquo;at-fault&rdquo; (tort) system instead. There, you file your claim directly against the at-fault driver&rsquo;s liability insurance, and there&rsquo;s no statutory injury threshold you need to clear before you can seek pain and suffering — you simply need to show the other driver was negligent and that the negligence caused your loss.</p>
            <p style={bodyStyle}>For a property-damage-only claim in an at-fault state, small claims court is often a realistic option if the insurer won&rsquo;t pay a fair amount and the damages fit within your state&rsquo;s small claims dollar limit. Two examples:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>California</strong> allows an individual to sue for up to $12,500 in small claims court (businesses are limited to $6,250) (<a href="https://selfhelp.courts.ca.gov/small-claims-california" target="_blank" rel="noopener noreferrer" style={linkStyle}>California Courts Self-Help Guide</a>).</li>
              <li><strong style={{ color: 'var(--ink)' }}>Texas</strong> allows small claims cases in justice court up to $20,000 (<a href="https://guides.sll.texas.gov/small-claims" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas State Law Library</a>).</li>
            </ul>
            <p style={bodyStyle}>Small claims limits and procedures vary by state and change periodically, so always confirm the current limit with your local court before filing. Our <Link href="/car-accident-settlement-calculator/california/" style={linkStyle}>California</Link> and <Link href="/car-accident-settlement-calculator/texas/" style={linkStyle}>Texas</Link> calculator pages have more detail specific to those states.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">How Long You Have to File</h2>
            <p style={bodyStyle}>Every state sets a statute of limitations — a deadline after which you lose the right to sue, even if your claim is otherwise valid. This applies whether you&rsquo;re pursuing a soft-tissue injury claim or a property-damage-only claim. Two examples:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>Texas</strong> requires that a suit for personal injury be brought &ldquo;not later than two years after the day the cause of action accrues&rdquo; (<a href="https://www.txcourts.gov/media/1456324/210513.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Tex. Civ. Prac. &amp; Rem. Code § 16.003(a)</a>, as cited by the Texas Supreme Court).</li>
              <li><strong style={{ color: 'var(--ink)' }}>California</strong> sets a two-year deadline for &ldquo;[i]njury to a person,&rdquo; measured from the date of the injury (<a href="https://selfhelp.courts.ca.gov/civil-lawsuit/statute-limitations" target="_blank" rel="noopener noreferrer" style={linkStyle}>Cal. Code Civ. Proc. § 335.1</a>, as summarized by the California Courts Self-Help Guide).</li>
            </ul>
            <p style={bodyStyle}>Filing deadlines are calculated differently depending on the facts of your case (for example, if a minor is involved, or if the at-fault party left the state), so treat these as general reminders, not a substitute for confirming your own deadline.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">Worked Example: A Minor Soft-Tissue Claim</h2>
            <p style={{ ...bodyStyle, fontSize: '14px' }}><em>The following is a hypothetical example for illustration only. It does not reflect any real claim, and your numbers will be different.</em></p>
            <p style={bodyStyle}>Settlebrook&rsquo;s <Link href="/pain-and-suffering-calculator/" style={linkStyle}>pain and suffering calculator</Link> uses this formula:</p>
            <pre style={{ ...bodyStyle, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, overflowX: 'auto', fontSize: '13px' }}>
{`multiplierBase   = medical + future medical + lost wages + future lost wages
specialDamages    = multiplierBase + property damage
pain & suffering  = multiplierBase × multiplier
total             = specialDamages + pain & suffering
fault-adjusted    = total × (100 − fault%) / 100`}
            </pre>
            <p style={bodyStyle}>The multiplier scales with injury severity: 1.5 for minor injuries, 2.5 for moderate, 3.5 for serious, 4.5 for severe, and 5.0 for catastrophic.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Hypothetical facts:</strong> A rear-end collision leaves the driver with a diagnosed minor whiplash strain (multiplier: 1.5). Medical bills come to $3,200, with no future medical care anticipated. Lost wages are $800 (8 missed workdays at a $100 daily wage), with no future lost wages. Vehicle repair (property damage) costs $2,400. The other driver is 100% at fault (0% fault on our hypothetical claimant).</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Multiplier method:</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>multiplierBase = $3,200 + $0 + $800 + $0 = <strong style={{ color: 'var(--amber)' }}>$4,000</strong></li>
              <li>specialDamages = $4,000 + $2,400 = <strong style={{ color: 'var(--amber)' }}>$6,400</strong></li>
              <li>pain &amp; suffering = $4,000 × 1.5 = <strong style={{ color: 'var(--amber)' }}>$6,000</strong></li>
              <li>total = $6,400 + $6,000 = <strong style={{ color: 'var(--amber)' }}>$12,400</strong></li>
              <li>fault-adjusted = $12,400 × (100 − 0) / 100 = <strong style={{ color: 'var(--amber)' }}>$12,400</strong></li>
            </ul>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Per diem method (alternative way to value pain and suffering):</strong> Instead of a multiplier, the per diem method assigns a daily dollar value to pain and suffering — often the person&rsquo;s own daily wage — for each day of recovery. Using the same $100 daily wage over a 60-day recovery and treatment period:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>per diem pain &amp; suffering = $100 × 60 days = <strong style={{ color: 'var(--amber)' }}>$6,000</strong></li>
              <li>total (per diem) = $6,400 + $6,000 = <strong style={{ color: 'var(--amber)' }}>$12,400</strong></li>
              <li>fault-adjusted = $12,400 × (100 − 0) / 100 = <strong style={{ color: 'var(--amber)' }}>$12,400</strong></li>
            </ul>
            <p style={bodyStyle}>Both methods land on the same figure here only because the inputs were chosen to illustrate the mechanics clearly — in a real claim, the two methods often produce different numbers. That&rsquo;s why it&rsquo;s worth running your own numbers both ways.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">Run Your Own Numbers</h2>
            <p style={bodyStyle}>Every accident is different, and the two variables that move the estimate the most are your state&rsquo;s no-fault or at-fault rules and how your injury (or lack of one) gets documented. Use the <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> to plug in your own medical costs, lost wages, property damage, injury severity, and fault percentage, or the standalone <Link href="/pain-and-suffering-calculator/" style={linkStyle}>pain and suffering calculator</Link> if you just want to estimate the non-economic portion of a claim. Both are free and don&rsquo;t require creating an account.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">Frequently Asked Questions</h2>

            <h3 className="heading-serif h3-editorial">Is a minor car accident with no injury still worth filing a claim for?</h3>
            <p style={bodyStyle}>Yes. Even with no injury, you can typically recover repair costs, a rental car or loss-of-use payment, and — if the repaired car is worth less because of its accident history — a diminished value claim. See our <Link href="/blog/diminished-value-claim/" style={linkStyle}>diminished value guide</Link>.</p>

            <h3 className="heading-serif h3-editorial">Does whiplash always qualify as a &ldquo;real&rdquo; injury for settlement purposes?</h3>
            <p style={bodyStyle}>Whiplash is a recognized injury. What insurers look at closely is documentation — how quickly you were evaluated, how consistent treatment was, and whether records connect the injury to the accident. In a no-fault state, the injury also has to meet that state&rsquo;s statutory threshold before you can pursue pain and suffering from the other driver.</p>

            <h3 className="heading-serif h3-editorial">What&rsquo;s the difference between a no-fault state and an at-fault state?</h3>
            <p style={bodyStyle}>In a no-fault state, your own PIP coverage pays medical bills and lost wages first, and you generally can&rsquo;t sue the other driver for pain and suffering unless your injury meets a state-law threshold — see the Florida, New York, and Michigan examples above. In an at-fault (tort) state, you file directly against the other driver&rsquo;s liability insurer, with no threshold to clear first.</p>

            <h3 className="heading-serif h3-editorial">Can I take a minor car accident claim to small claims court?</h3>
            <p style={bodyStyle}>It&rsquo;s generally an option for property-damage-only disputes within your state&rsquo;s dollar limit — for example, up to $12,500 for an individual in California or up to $20,000 in Texas justice court. It&rsquo;s less commonly used for injury claims, and limits vary by state, so check with your local court.</p>

            <h3 className="heading-serif h3-editorial">How long do I have to file a claim after a minor accident?</h3>
            <p style={bodyStyle}>It depends on your state. Texas and California, for example, both set a two-year deadline for personal injury claims. Confirm your specific deadline with a licensed attorney — missing it can permanently bar your claim.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-serif h2-editorial">Not Legal Advice</h2>
            <p style={bodyStyle}>This article is for general informational purposes only and is not legal advice. Settlement outcomes depend on the specific facts of your case, the laws of your state, and how your insurer or a court applies them. For advice about your specific situation, consult a licensed attorney in your state.</p>

            <h2 className="heading-serif h2-editorial">Sources</h2>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li><a href="https://www.flsenate.gov/Laws/Statutes/2025/627.736" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 627.736 — Personal injury protection benefits (PIP)</a> — The Florida Senate, 2025 Florida Statutes</li>
              <li><a href="https://www.flsenate.gov/laws/statutes/2025/627.737" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 627.737 — Tort exemption; tort liability</a> — The Florida Senate, 2025 Florida Statutes</li>
              <li><a href="https://www.nysenate.gov/legislation/laws/ISC/5102" target="_blank" rel="noopener noreferrer" style={linkStyle}>N.Y. Ins. Law § 5102(d) — Definition of &ldquo;serious injury&rdquo;</a> — New York State Senate, Open Legislation</li>
              <li><a href="https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-500-3135" target="_blank" rel="noopener noreferrer" style={linkStyle}>MCL § 500.3135 — Tort liability; conditions</a> — Michigan Legislature</li>
              <li><a href="https://www.txcourts.gov/media/1456324/210513.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Tex. Civ. Prac. &amp; Rem. Code § 16.003 — Two-Year Limitations Period</a> — Supreme Court of Texas opinion citing the statute</li>
              <li><a href="https://selfhelp.courts.ca.gov/civil-lawsuit/statute-limitations" target="_blank" rel="noopener noreferrer" style={linkStyle}>Cal. Code Civ. Proc. § 335.1 — Statute of limitations for personal injury</a> — California Courts Self-Help Guide (Judicial Council of California)</li>
              <li><a href="https://selfhelp.courts.ca.gov/small-claims-california" target="_blank" rel="noopener noreferrer" style={linkStyle}>California small claims court dollar limits</a> — California Courts Self-Help Guide (Judicial Council of California)</li>
              <li><a href="https://guides.sll.texas.gov/small-claims" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas justice court small claims dollar limit</a> — Texas State Law Library</li>
            </ol>

          </div>
        </article>

      </main>
    </>
  )
}
