// ─────────────────────────────────────────────────────────────────────────────
// app/blog/uninsured-motorist-claim/page.tsx
// Blog post #7 — targets "uninsured motorist claim" / "hit and run uninsured
// motorist claim" / "uninsured motorist settlement" / "is uninsured motorist
// coverage required". Source draft:
// research/2026-09-24/posts/post-7-uninsured-motorist-claim.md
// (verification log: post-7-verification.md, same folder).
//
// SCHEDULED for 2026-10-05: lib/data/blogPosts.ts sets this slug's
// publishDate to that day; this page's own notFound() gate (below) returns
// a real 404 until a build runs on or after that date — see
// .github/workflows/daily-rebuild.yml.
//
// Structure follows app/blog/minor-car-accident-settlement/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline
//   • No manual ad slots (Auto Ads only)
// Body published verbatim from the draft (H1 through "Not Legal Advice");
// the frontmatter is not published. The 14-state UM table is a real <table>
// in an overflow-x-auto wrapper with a min-width so it scrolls on a phone.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import CiteThisPage from '@/components/ui/CiteThisPage'
import BlogRail from '@/components/ui/BlogRail'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = '/blog/uninsured-motorist-claim/'
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const pageTitle = 'Uninsured Motorist Claims: How They Work by State'
const metaDescription =
  'How uninsured motorist claims work, whether UM coverage is required in your state, and how to estimate your claim with a free calculator.'

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
        alt: 'Uninsured Motorist Claims — Settlebrook',
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
// visible copy adds links only).
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is uninsured motorist coverage required in my state?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It depends on the state. Illinois, New York, and North Carolina require it in every policy. Most other states — including California, Texas, Florida, and Georgia — require insurers to offer it, but you can decline it in writing. Michigan and Ohio don't require insurers to offer it at all. See the table above for your state.",
      },
    },
    {
      '@type': 'Question',
      name: "What's the difference between an uninsured motorist claim and an underinsured motorist claim?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An uninsured motorist (UM) claim applies when the at-fault driver has no insurance at all, or can\'t be identified (hit-and-run). An underinsured motorist (UIM) claim applies when the at-fault driver has insurance, but not enough to cover your damages. Both are typically purchased together and paid by your own insurer, but they\'re triggered by different facts. See our guide on claims that exceed policy limits for more on the UIM side.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I have to report a hit-and-run to the police to make a UM claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In practice, yes. Most UM policies require prompt police notification for an unidentified-vehicle claim, and some states legally require a physical-contact showing or a corroborating witness when the other vehicle can\'t be identified. Report it as soon as possible and get a copy of the police report for your insurer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can my own insurance company deny my UM claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Even though you're the policyholder, your insurer can dispute how the accident happened, whether your injuries are related to the crash, or how much they're worth — the same way any insurer evaluates an injury claim. Document your treatment and communications the same way you would with a third-party insurer.",
      },
    },
    {
      '@type': 'Question',
      name: "What if I don't have uninsured motorist coverage and get hit by an uninsured driver?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Your main options are medical payments or PIP coverage for medical bills, your own health insurance, and pursuing the at-fault driver personally if they're identified — though collecting from someone without insurance is often difficult in practice. This is generally the strongest argument for carrying UM coverage where it's not already mandatory in your state.",
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
    { '@type': 'ListItem', position: 3, name: 'Uninsured Motorist Claim', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the other blog posts) ────────────────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const
const strongStyle = { color: 'var(--ink)' } as const
// Horizontal scroll wrapper for the state table; the min-width on the <table>
// is what forces the scroll on a narrow viewport rather than text crushing.
const tableWrapStyle = { overflowX: 'auto', marginBottom: 18 } as const

export default function UninsuredMotoristClaimPost() {
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
              { label: 'Uninsured Motorist Claim', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Uninsured Motorist Claims: How They Work by State
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

            <p style={bodyStyle}>Getting hit by a driver who has no insurance — or who hits you and drives off — creates a specific problem: there&rsquo;s no liability insurer on the other side to pay your claim. This is where uninsured motorist (UM) coverage comes in. It&rsquo;s coverage you buy on your own auto policy, and when the at-fault driver can&rsquo;t pay (because they&rsquo;re uninsured or unidentified), you make the claim against your own insurer instead of theirs.</p>
            <p style={bodyStyle}>This article covers UM claims specifically — uninsured drivers and hit-and-run accidents. If the other driver has insurance but not enough to cover your damages, that&rsquo;s a different coverage (underinsured motorist, or UIM) with its own rules; see our guide on <Link href="/blog/settlement-exceeds-policy-limits/" style={linkStyle}>claims that exceed the at-fault driver&rsquo;s policy limits</Link> for that situation.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What UM Coverage Actually Pays For</h2>
            <p style={bodyStyle}>UM coverage pays for the bodily injury damages you&rsquo;d otherwise have collected from the at-fault driver&rsquo;s liability insurance — medical bills, lost wages, and pain and suffering — up to the limit you bought. It&rsquo;s triggered when:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>The at-fault driver has no auto insurance at all, or</li>
              <li>The at-fault driver fled the scene and can&rsquo;t be identified (a hit-and-run or &ldquo;phantom vehicle&rdquo;).</li>
            </ul>
            <p style={bodyStyle}>Some states also sell uninsured motorist property damage (UMPD) coverage as a separate, optional add-on for vehicle repair costs when an uninsured driver hits your car — Illinois is one example, where the state&rsquo;s insurance regulator notes that not paying the separate UMPD premium is treated as declining that specific coverage. In most of the 14 states below, vehicle damage from an uninsured or hit-and-run driver is instead handled through your own collision coverage, not your UM policy. Check your own declarations page to see which coverages you actually have.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How a UM Claim Is Different From a Normal Claim</h2>
            <p style={bodyStyle}>The biggest practical difference: you are negotiating with your own insurance company, not a stranger&rsquo;s. That changes a few things.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Your policy&rsquo;s notice and cooperation duties apply.</strong> Every auto policy requires you to report the accident promptly, cooperate with the insurer&rsquo;s investigation, and in most states, report a hit-and-run to the police within a set window (see below). Missing these steps — set by your own policy and state law, not by us — can jeopardize the claim, so read your policy&rsquo;s notice provisions and don&rsquo;t wait to see how the injury develops before reporting it.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Your insurer still has a financial interest in paying you less.</strong> Even though it&rsquo;s &ldquo;your&rdquo; insurance company, adjusting a UM claim works the same way any injury claim does: your insurer evaluates the medical records, disputes causation or severity where it can, and often opens with a lower offer than the claim is ultimately worth. Document everything the same way you would in a claim against someone else&rsquo;s insurer.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Some states let you arbitrate instead of sue.</strong> If your policy includes an arbitration clause for UM disputes (many do), a disagreement over value may go to an arbitrator rather than a courtroom — check your policy for this provision.</p>
            <p style={bodyStyle}><strong style={strongStyle}>The payout is capped at your own UM limit</strong>, not at what your damages are actually worth. This is the single most important number in a UM claim, and it&rsquo;s discussed in the worked example below.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Is UM Coverage Required? A State-by-State Breakdown</h2>
            <p style={bodyStyle}>Whether you have UM coverage — and how much — depends entirely on your state and what you (or whoever bought the policy) decided when it was issued. States fall into three groups: coverage that&rsquo;s mandatory and can&rsquo;t be waived, coverage insurers must offer but you can decline in writing, and states with no offer requirement at all.</p>
            <div style={tableWrapStyle}>
              <table style={{ minWidth: 680 }}>
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">Is UM Coverage Required?</th>
                    <th scope="col">Minimum UM Limits (Bodily Injury)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Arizona</th><td>Must be offered by written notice; you may decline it</td><td>Offered at not less than your policy&rsquo;s bodily injury liability limits (state liability minimum: $25,000/$50,000)</td></tr>
                  <tr><th scope="row">California</th><td>Included by default in every liability policy unless the named insured rejects it in writing</td><td>$30,000 per person / $60,000 per accident</td></tr>
                  <tr><th scope="row">Colorado</th><td>Must be offered; may be rejected in writing</td><td>Tied to the state&rsquo;s liability minimum: $25,000 per person / $50,000 per accident</td></tr>
                  <tr><th scope="row">Florida</th><td>Must be offered on any policy that includes bodily injury liability coverage; may be rejected in writing</td><td>Equal to your bodily injury liability limits, unless you select lower limits in writing (Florida doesn&rsquo;t require BI liability coverage at all, so a driver without it may never be offered UM)</td></tr>
                  <tr><th scope="row">Georgia</th><td>Must be offered; may be rejected in writing</td><td>$25,000 per person / $50,000 per accident, or higher if matched to the policy&rsquo;s liability limits</td></tr>
                  <tr><th scope="row">Illinois</th><td>Mandatory for bodily injury (cannot be rejected); UM property damage is a separate, optional coverage</td><td>$25,000 per person / $50,000 per accident</td></tr>
                  <tr><th scope="row">Michigan</th><td>Not required — insurers are not statutorily required to even offer it</td><td>Not applicable (optional product; no statutory minimum)</td></tr>
                  <tr><th scope="row">Nevada</th><td>Must be offered on a state-approved form; you may decline it</td><td>Offered in an amount equal to your bodily injury liability limits</td></tr>
                  <tr><th scope="row">New York</th><td>Mandatory in every auto liability policy</td><td>$25,000 per person / $50,000 per accident</td></tr>
                  <tr><th scope="row">North Carolina</th><td>Mandatory (limited exception for commercial/fleet policies)</td><td>Not less than the state&rsquo;s bodily injury liability minimum (currently $50,000 per person / $100,000 per accident), up to a $1,000,000/$1,000,000 cap if higher limits are purchased</td></tr>
                  <tr><th scope="row">Ohio</th><td>Not required — insurers are not statutorily required to offer it</td><td>Not applicable</td></tr>
                  <tr><th scope="row">Pennsylvania</th><td>Must be offered; may be rejected in writing on a signed rejection form</td><td>No fixed UM floor in the offer statute; set through the state&rsquo;s &ldquo;request for lower limits&rdquo; process (baseline financial responsibility minimum: $15,000/$30,000)</td></tr>
                  <tr><th scope="row">Texas</th><td>Must be offered; may be rejected in writing</td><td>Tied to the state&rsquo;s liability minimum: $30,000 per person / $60,000 per accident</td></tr>
                  <tr><th scope="row">Washington</th><td>Must be offered; may be rejected in writing</td><td>No fixed floor in the UM statute; tied to the liability limits selected (state minimum liability: $25,000/$50,000)</td></tr>
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>A few things worth noting from this table. New York, North Carolina, and Illinois are the only states here where UM bodily injury coverage cannot be waived — if you have an auto policy in those states, you have it. Michigan and Ohio sit at the other end: insurers there aren&rsquo;t even required to put the offer in front of you, so if you want UM coverage, you may need to ask for it by name. Everywhere else, insurers must offer it and you can decline, so whether you have it depends on what was chosen when the policy was bought.</p>
            <p style={bodyStyle}>If you&rsquo;re not sure what you have, your declarations page will list &ldquo;uninsured motorist&rdquo; or &ldquo;UM/UIM&rdquo; coverage with a dollar limit next to it — or it won&rsquo;t be listed at all. Our <Link href="/car-accident-settlement-calculator/california/" style={linkStyle}>California</Link>, <Link href="/car-accident-settlement-calculator/texas/" style={linkStyle}>Texas</Link>, <Link href="/car-accident-settlement-calculator/florida/" style={linkStyle}>Florida</Link>, <Link href="/car-accident-settlement-calculator/new-york/" style={linkStyle}>New York</Link>, and <Link href="/car-accident-settlement-calculator/michigan/" style={linkStyle}>Michigan</Link> calculator pages have more on each state&rsquo;s broader accident-claim rules.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Hit-and-Run Claims: What You Need to Prove</h2>
            <p style={bodyStyle}>A hit-and-run is treated as a UM claim because, functionally, you can&rsquo;t identify or collect from the at-fault driver. Two things matter most:</p>
            <p style={bodyStyle}><strong style={strongStyle}>Report it to the police promptly.</strong> Nearly every UM policy conditions coverage for an unidentified vehicle on a timely police report, and your state&rsquo;s own hit-and-run reporting laws apply on top of that. Don&rsquo;t skip this step even if the damage looks minor — it&rsquo;s often the only official record that ties your injury to the incident.</p>
            <p style={bodyStyle}><strong style={strongStyle}>&ldquo;Physical contact&rdquo; rules vary and can matter a lot.</strong> For a true phantom-vehicle case — where the other car never touched you but ran you off the road, for example — some states require actual physical contact between the vehicles before UM coverage applies, specifically to guard against fabricated claims. California&rsquo;s UM statute requires that &ldquo;the bodily injury has arisen out of physical contact of the automobile with the insured or with an automobile that the insured is occupying,&rdquo; with no independent-witness exception written into that provision. Georgia&rsquo;s statute has the same physical-contact requirement but does carve out an exception: contact isn&rsquo;t required if the claimant&rsquo;s account &ldquo;is corroborated by an eyewitness to the occurrence other than the claimant.&rdquo; Because this rule is written differently state to state, check your own state&rsquo;s UM statute or ask your insurer directly if your hit-and-run involved no contact at all.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What Happens If You Have No UM Coverage</h2>
            <p style={bodyStyle}>If you were hit by an uninsured or hit-and-run driver and have no UM coverage on your policy, your remaining options are narrower:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={strongStyle}>Medical payments (med-pay) coverage or, in a no-fault state, your Personal Injury Protection (PIP)</strong> — pays medical bills up to its own limit regardless of fault, separate from UM.</li>
              <li><strong style={strongStyle}>Suing the at-fault driver personally</strong>, if they&rsquo;re identified — a judgment isn&rsquo;t capped the way an insurance payout is, but collecting from someone with no insurance often means they have limited assets to collect from either.</li>
              <li><strong style={strongStyle}>Your health insurance</strong> for medical treatment, though it may seek reimbursement later if you do recover money from another source.</li>
            </ul>
            <p style={bodyStyle}>None of these reliably closes the gap the way UM coverage would have. If you&rsquo;re shopping for coverage after an experience like this, that&rsquo;s a conversation to have with your insurance agent, not something this article can size for you — state minimums and pricing vary too much for a general number to be useful.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Worked Example: A UM Claim in a Pure Comparative Fault State</h2>
            <p style={{ ...bodyStyle, fontSize: '15px' }}><em>The following is a hypothetical example for illustration only. It does not reflect any real claim, and your numbers will be different.</em></p>
            <p style={bodyStyle}>Settlebrook&rsquo;s <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> uses this formula:</p>
            <pre style={{ ...bodyStyle, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, overflowX: 'auto', fontSize: '14px' }}>
{`multiplierBase   = medical + future medical + lost wages + future lost wages
specialDamages    = multiplierBase + property damage
pain & suffering  = multiplierBase × multiplier
total             = specialDamages + pain & suffering
fault-adjusted    = total × (100 − fault%) / 100`}
            </pre>
            <p style={bodyStyle}>The multiplier scales with injury severity: 1.5 for minor injuries, 2.5 for moderate, 3.5 for serious, 4.5 for severe, and 5.0 for catastrophic.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Hypothetical facts:</strong> A driver in Washington State is hit by a driver with no insurance who leaves the scene; the incident is reported to police the same day. The claimant suffers a moderate injury requiring several months of physical therapy (multiplier: 2.5). Medical bills come to $16,000, with $2,000 in anticipated future medical care. Lost wages are $3,000, with no future lost wages. Vehicle repair is handled separately through the claimant&rsquo;s collision coverage and isn&rsquo;t part of this UM bodily-injury claim. Washington uses pure comparative fault, meaning a claimant&rsquo;s damages are reduced by their fault percentage but never barred outright, no matter how high that percentage is. A police investigation puts the claimant at 10% fault for following too closely. The claimant&rsquo;s own policy carries a $50,000 per-person UM limit.</p>
            <p style={bodyStyle}><strong style={strongStyle}>Multiplier method:</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>multiplierBase = $16,000 + $2,000 + $3,000 + $0 = <strong style={{ color: 'var(--amber)' }}>$21,000</strong></li>
              <li>specialDamages = $21,000 + $0 (no property damage in this claim) = <strong style={{ color: 'var(--amber)' }}>$21,000</strong></li>
              <li>pain &amp; suffering = $21,000 × 2.5 = <strong style={{ color: 'var(--amber)' }}>$52,500</strong></li>
              <li>total = $21,000 + $52,500 = <strong style={{ color: 'var(--amber)' }}>$73,500</strong></li>
              <li>fault-adjusted = $73,500 × (100 − 10) / 100 = $73,500 × 0.90 = <strong style={{ color: 'var(--amber)' }}>$66,150</strong></li>
            </ul>
            <p style={bodyStyle}><strong style={strongStyle}>Where the UM limit comes in:</strong> The fault-adjusted estimate, $66,150, is a calculation of what the claim is worth. But this is a UM claim against the claimant&rsquo;s own insurer, and that insurer&rsquo;s obligation stops at the policy&rsquo;s UM limit — $50,000 in this example. So even though the damages calculate out to $66,150, the claimant&rsquo;s insurer isn&rsquo;t obligated to pay more than $50,000 under this policy. This is exactly why the size of your own UM limit — not just whether you have UM coverage at all — determines how much of an uninsured-driver claim you can actually recover.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Run Your Own Numbers</h2>
            <p style={bodyStyle}>Every UM claim depends on two things that are specific to you: your state&rsquo;s UM rules (mandatory, opt-out, or not offered at all) and the limit on your own policy. Use the <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> to estimate your damages from your medical costs, lost wages, injury severity, and fault percentage, then compare that estimate to your UM limit to see whether you&rsquo;re likely to be made whole or capped short of it. The standalone <Link href="/pain-and-suffering-calculator/" style={linkStyle}>pain and suffering calculator</Link> is useful if you just want to isolate the non-economic portion. Both are free.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Frequently Asked Questions</h2>

            <h3 className="heading-display h3-editorial">Is uninsured motorist coverage required in my state?</h3>
            <p style={bodyStyle}>It depends on the state. Illinois, New York, and North Carolina require it in every policy. Most other states — including California, Texas, Florida, and Georgia — require insurers to offer it, but you can decline it in writing. Michigan and Ohio don&rsquo;t require insurers to offer it at all. See the table above for your state.</p>

            <h3 className="heading-display h3-editorial">What&rsquo;s the difference between an uninsured motorist claim and an underinsured motorist claim?</h3>
            <p style={bodyStyle}>An uninsured motorist (UM) claim applies when the at-fault driver has no insurance at all, or can&rsquo;t be identified (hit-and-run). An underinsured motorist (UIM) claim applies when the at-fault driver has insurance, but not enough to cover your damages. Both are typically purchased together and paid by your own insurer, but they&rsquo;re triggered by different facts. See our guide on <Link href="/blog/settlement-exceeds-policy-limits/" style={linkStyle}>claims that exceed policy limits</Link> for more on the UIM side.</p>

            <h3 className="heading-display h3-editorial">Do I have to report a hit-and-run to the police to make a UM claim?</h3>
            <p style={bodyStyle}>In practice, yes. Most UM policies require prompt police notification for an unidentified-vehicle claim, and some states legally require a physical-contact showing or a corroborating witness when the other vehicle can&rsquo;t be identified. Report it as soon as possible and get a copy of the police report for your insurer.</p>

            <h3 className="heading-display h3-editorial">Can my own insurance company deny my UM claim?</h3>
            <p style={bodyStyle}>Yes. Even though you&rsquo;re the policyholder, your insurer can dispute how the accident happened, whether your injuries are related to the crash, or how much they&rsquo;re worth — the same way any insurer evaluates an injury claim. Document your treatment and communications the same way you would with a third-party insurer.</p>

            <h3 className="heading-display h3-editorial">What if I don&rsquo;t have uninsured motorist coverage and get hit by an uninsured driver?</h3>
            <p style={bodyStyle}>Your main options are medical payments or PIP coverage for medical bills, your own health insurance, and pursuing the at-fault driver personally if they&rsquo;re identified — though collecting from someone without insurance is often difficult in practice. This is generally the strongest argument for carrying UM coverage where it&rsquo;s not already mandatory in your state.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Not Legal Advice</h2>
            <p style={bodyStyle}>This article is for general informational purposes only and is not legal advice. Insurance and injury law vary by state, by policy language, and by the specific facts of a claim. For advice about your situation, consult a licensed attorney in your state or your own insurance agent about your policy&rsquo;s coverage.</p>

          </article>

          {/* Citation block — title, editorial byline, canonical URL, review stamp */}
          <CiteThisPage title={pageTitle} path={canonicalUrl} reviewed={getPostDisplayDate(post)} className="mt-10" />
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
