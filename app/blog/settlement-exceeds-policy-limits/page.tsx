// ─────────────────────────────────────────────────────────────────────────────
// app/blog/settlement-exceeds-policy-limits/page.tsx
// Blog post #5 — targets "settlement exceeds policy limits" / "underinsured
// motorist claim". Source draft:
// research/2026-09-24/posts/post-3-exceeds-policy-limits.md
//
// SCHEDULED for 2026-09-27: lib/data/blogPosts.ts sets this slug's
// publishDate to that day. This page checks isPostPublished() itself and
// calls notFound() until the build date reaches it, so the route returns a
// real 404 (excluded from index, homepage, sitemap, and cross-links)
// without deleting the built content. Because this is a static export, the
// post only actually goes live on a build run on or after 2026-09-27 — see
// .github/workflows/daily-rebuild.yml. No changes needed here when that day
// arrives.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import BlogRail from '@/components/ui/BlogRail'
import { getBlogPostBySlug, isPostPublished, getPostDisplayDate } from '@/lib/data/blogPosts'

const canonicalUrl = '/blog/settlement-exceeds-policy-limits/'
// Read from the shared data rather than duplicated here, so there's one
// place to change the date.
const PUBLISHED_DATE = getBlogPostBySlug(canonicalUrl)!.publishDate

const metaDescription =
  "Your damages are worth more than the at-fault driver's insurance will pay. Here's what happens next, and where the rest of the money can come from."

export const metadata: Metadata = {
  title: 'When Your Injury Claim Exceeds Policy Limits',
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  robots: { index: false, follow: false },
  openGraph: {
    title: "When Your Injury Claim Exceeds the At-Fault Driver's Policy Limits",
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
        alt: 'When Your Injury Claim Exceeds Policy Limits — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "When Your Injury Claim Exceeds the At-Fault Driver's Policy Limits",
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
  headline: "When Your Injury Claim Exceeds the At-Fault Driver's Policy Limits",
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
      name: 'Does it matter if my damages exceed the policy limit — can I still get more than that from the at-fault driver directly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The insurance company generally won't pay more than the policy limit. A court judgment against the driver personally isn't capped that way, but actually collecting more from an individual person, on top of their insurance, depends on whether they have assets worth pursuing.",
      },
    },
    {
      '@type': 'Question',
      name: "What happens if damages exceed insurance limits and I don't have UM/UIM coverage?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Without UM/UIM, your main paths beyond the at-fault driver’s policy limit are other liable parties (if any exist), the at-fault driver’s personal assets, and any med-pay or PIP coverage on your own policy for medical bills specifically. This is exactly why UM/UIM coverage is worth checking on your own policy before you ever need it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is an underinsured motorist (UIM) claim, in plain terms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It's a claim against your own insurance company, made under coverage you purchased, that pays when the at-fault driver's liability coverage isn't enough to cover your damages. You're not suing the at-fault driver's insurer a second time — you're making a claim on your own policy.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can the insurance company be held responsible for refusing a fair settlement within the policy limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In some states, yes, under legal doctrines built for exactly that situation, like Texas's Stowers doctrine or Florida's bad-faith statute. The details — timelines, notice requirements, what counts as an acceptable demand — vary by state, so this is worth discussing with an attorney licensed there rather than assuming it works the same way everywhere.",
      },
    },
    {
      '@type': 'Question',
      name: "Is it worth pursuing the at-fault driver's personal assets if their insurance limit isn't enough?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sometimes, but only if they actually have assets a judgment can reach, like real estate, a business, or non-exempt savings. Chasing someone who has nothing worth collecting usually isn't worth the time or legal cost, which is part of why other sources of recovery — UM/UIM, other defendants, umbrella policies — tend to matter more in practice.",
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
    { '@type': 'ListItem', position: 3, name: 'Settlement Exceeds Policy Limits', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const

export default function SettlementExceedsPolicyLimitsPost() {
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
              { label: 'Settlement Exceeds Policy Limits', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                When Your Injury Claim Exceeds the At-Fault Driver&rsquo;s Policy Limits
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

            <p style={bodyStyle}>You ran the numbers. Medical bills, lost paychecks, weeks of pain that aren&rsquo;t over yet, and the number that comes out the other end is bigger than what the at-fault driver&rsquo;s insurance company says it will pay. That gap is one of the most common — and most frustrating — problems in a car accident claim.</p>
            <p style={bodyStyle}>It doesn&rsquo;t mean your claim is worth nothing beyond the policy limit. It means you need to know where else the money can come from, and how insurance law treats a claim once it&rsquo;s bigger than the check the insurer is willing to write.</p>
            <p style={bodyStyle}>This post walks through what &ldquo;exceeding policy limits&rdquo; actually means, what minimum coverage looks like in a few states, and the paths — your own coverage, other defendants, the at-fault driver personally — that can close the gap. Run your own numbers first with the <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link>; it has a policy-limit field built in and will flag it for you when your estimate comes in above what you enter.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What &ldquo;policy limits&rdquo; actually means</h2>
            <p style={bodyStyle}>Every auto liability policy has a cap. The insurance company will not pay more than that cap for a given claim, no matter how strong the case or how serious the injury. States set a <em>minimum</em> amount of liability coverage a driver has to carry, usually written as three numbers, like 30/60/15:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>The first number is the most the policy pays for <strong style={{ color: 'var(--ink)' }}>one person&rsquo;s</strong> bodily injury, in thousands.</li>
              <li>The second is the most it pays for <strong style={{ color: 'var(--ink)' }}>all injuries combined</strong> in one accident.</li>
              <li>The third is the most it pays for <strong style={{ color: 'var(--ink)' }}>property damage</strong>.</li>
            </ul>
            <p style={bodyStyle}>A driver who carries only the minimum can be badly underinsured for a serious injury. A few current examples, from state sources:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>California</strong>: $30,000 per person / $60,000 per accident / $15,000 property damage, effective January 1, 2025 (up from $15,000/$30,000/$5,000, the state&rsquo;s first increase in 56 years). Source: <a href="https://www.insurance.ca.gov/0250-insurers/0300-insurers/0200-bulletins/bulletin-notices-commiss-opinion/upload/bulletin-2023-1-re-sb-1107-final-003.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>California Department of Insurance bulletin on SB 1107</a> and the <a href="https://www.insurance.ca.gov/0400-news/0102-alerts/2025/New-Year-Means-New-Changes-for-Insurance.cfm" target="_blank" rel="noopener noreferrer" style={linkStyle}>CA DOI&rsquo;s 2025 consumer alert</a>. See <Link href="/car-accident-settlement-calculator/california/" style={linkStyle}>California car accident settlement estimates</Link>.</li>
              <li><strong style={{ color: 'var(--ink)' }}>North Carolina</strong>: $50,000 per person / $100,000 per accident / $50,000 property damage, for policies issued or renewed on or after July 1, 2025 (up from $30,000/$60,000/$25,000). Source: <a href="https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025" target="_blank" rel="noopener noreferrer" style={linkStyle}>North Carolina Department of Insurance</a>. See <Link href="/car-accident-settlement-calculator/north-carolina/" style={linkStyle}>North Carolina car accident settlement estimates</Link>.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Texas</strong>: $30,000 per person / $60,000 per accident / $25,000 property damage. Source: <a href="https://statutes.capitol.texas.gov/Docs/TN/htm/TN.601.htm" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Transportation Code § 601.072</a>. See <Link href="/car-accident-settlement-calculator/texas/" style={linkStyle}>Texas car accident settlement estimates</Link>.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Florida</strong>: Florida does not require bodily injury liability coverage for most drivers. It requires $10,000 in Personal Injury Protection (PIP) and $10,000 in property damage liability (PDL); taxis must carry $125,000/$250,000 in bodily injury coverage. Source: <a href="https://www.flhsmv.gov/insurance/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Department of Highway Safety and Motor Vehicles</a>. See <Link href="/car-accident-settlement-calculator/florida/" style={linkStyle}>Florida car accident settlement estimates</Link>.</li>
            </ul>
            <p style={bodyStyle}>Look at that Florida figure again: a driver there can be fully legal on the road with no bodily-injury liability coverage behind them at all. If they cause a serious wreck, there may be nothing on their side to collect from except whatever you can find elsewhere.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">A worked example: how the gap shows up</h2>
            <p style={bodyStyle}>Say a claimant is hit by a driver who carries the Texas minimum, 30/60/25. Using Settlebrook&rsquo;s calculator formula:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Medical bills to date: $45,000</li>
              <li>Future medical care: $10,000</li>
              <li>Lost wages to date: $8,000</li>
              <li>Future lost earning capacity: $2,000</li>
              <li><strong style={{ color: 'var(--ink)' }}>Multiplier base</strong> (medical + future medical + wages + future wages): $65,000</li>
              <li>Property damage: $9,000</li>
              <li><strong style={{ color: 'var(--ink)' }}>Special damages</strong> (multiplier base + property damage): $65,000 + $9,000 = <strong style={{ color: 'var(--amber)' }}>$74,000</strong></li>
              <li>Injury severity: &ldquo;serious&rdquo; → multiplier of 3.5</li>
              <li><strong style={{ color: 'var(--ink)' }}>Pain and suffering</strong>: $65,000 × 3.5 = <strong style={{ color: 'var(--amber)' }}>$227,500</strong></li>
              <li><strong style={{ color: 'var(--ink)' }}>Total damages</strong>: $74,000 + $227,500 = <strong style={{ color: 'var(--amber)' }}>$301,500</strong></li>
              <li>Claimant is found 10% at fault, so the fault-adjusted estimate is $301,500 × (100 − 10) / 100 = $301,500 × 0.90 = <strong style={{ color: 'var(--amber)' }}>$271,350</strong></li>
            </ul>
            <p style={bodyStyle}>The at-fault driver&rsquo;s policy caps out at $30,000 for a single injured person. The estimate is more than nine times that. This is precisely the scenario Settlebrook&rsquo;s calculator flags: enter $30,000 as the policy limit alongside these inputs and the tool will show you the shortfall directly. It&rsquo;s also the scenario where the claimant&rsquo;s own underinsured motorist (UIM) coverage — if they bought it — becomes the next place to look, since the at-fault driver&rsquo;s liability coverage alone can&rsquo;t come close to covering it.</p>
            <p style={bodyStyle}>Try the same numbers, or your own, with the <Link href="/pain-and-suffering-calculator/" style={linkStyle}>pain and suffering calculator</Link> to see the multiplier and per-diem methods side by side.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Where the rest of the money can come from</h2>

            <h3 className="heading-display h3-editorial">Your own underinsured motorist (UIM) coverage</h3>
            <p style={bodyStyle}>UIM coverage is insurance you buy on your own policy that pays when the at-fault driver&rsquo;s liability limits aren&rsquo;t enough to cover your damages. It sits behind their coverage, not instead of it. How it interacts with the at-fault driver&rsquo;s payout — whether your UIM limit gets reduced (offset) by what you already collected, or whether it &ldquo;stacks&rdquo; on top across multiple vehicles or policies — is set by each state&rsquo;s insurance code and varies a lot. That&rsquo;s a state-specific question worth confirming with your own policy and your state&rsquo;s insurance statutes before you assume a number.</p>

            <h3 className="heading-display h3-editorial">Other liable parties</h3>
            <p style={bodyStyle}>A single crash can have more than one at-fault party. A commercial driver&rsquo;s employer, a bar that over-served a driver, a government agency responsible for a dangerous road defect, or a parts manufacturer if a mechanical failure contributed — each is a potentially separate policy, and a separate source of recovery, from the driver&rsquo;s personal auto insurer.</p>

            <h3 className="heading-display h3-editorial">The at-fault driver&rsquo;s personal assets</h3>
            <p style={bodyStyle}>In theory, a judgment against the at-fault driver isn&rsquo;t capped at their policy limit — a court can award more, and the driver is personally on the hook for the difference. In practice, this is usually the least productive path. Most people don&rsquo;t have significant savings, home equity, or other assets that a judgment can reach, and pursuing someone who has nothing to collect from (&ldquo;judgment-proof&rdquo;) can mean years of legal costs for little or no result.</p>

            <h3 className="heading-display h3-editorial">Umbrella policies</h3>
            <p style={bodyStyle}>Some drivers carry a personal umbrella policy, which adds a large block of extra liability coverage on top of their auto policy&rsquo;s limits. It isn&rsquo;t common on a minimum-coverage driver, but it&rsquo;s worth asking about during the claim, since it can turn a policy-limits problem into a fully covered one.</p>

            <h3 className="heading-display h3-editorial">Med-pay and PIP</h3>
            <p style={bodyStyle}>Medical payments coverage (med-pay) and, in no-fault states, Personal Injury Protection (PIP) pay medical bills up to their own limit regardless of who caused the crash, and they pay from <em>your own</em> policy — separate from anything you recover from the at-fault driver. They don&rsquo;t close a large policy-limits gap on their own, but they can cover bills quickly while the rest of the claim is worked out.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">The insurer&rsquo;s duty to settle, and &ldquo;bad faith&rdquo;</h2>
            <p style={bodyStyle}>Insurance companies that handle a driver&rsquo;s liability claim don&rsquo;t get to sit on a policy-limits settlement demand indefinitely just because doing so is cheaper for them in the short run. In Texas, this is captured in what&rsquo;s known as the Stowers doctrine, from a 1929 Texas case, <em>G.A. Stowers Furniture Co. v. American Indemnity Co.</em> As the Texas Supreme Court has since explained it, an insurer can face liability beyond its own policy limits if a claimant makes a settlement demand within the policy limits, on terms an ordinarily prudent insurer would accept given the insured&rsquo;s exposure to a judgment above those limits, and the insurer turns it down anyway. Source: <a href="https://www.txcourts.gov/media/1452128/190701.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Supreme Court opinion discussing the Stowers doctrine and its elements</a>.</p>
            <p style={bodyStyle}>Florida has its own statutory version of this idea. Under Florida&rsquo;s bad-faith statute, a claimant generally has to give the insurer and the state 60 days&rsquo; written notice of a bad-faith violation before suing, and the insurer can avoid a bad-faith claim by paying the claim or fixing the problem within that window; for liability claims specifically, an insurer can avoid a bad-faith suit by tendering the lesser of the policy limit or the amount demanded within 90 days of getting adequate notice of the claim. Source: <a href="https://www.flsenate.gov/Laws/Statutes/2025/624.155" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Statute § 624.155</a>.</p>
            <p style={bodyStyle}>The mechanics differ by state, but in general terms the idea behind a &ldquo;policy-limits demand&rdquo; is this: your attorney sends the insurer a demand to settle for exactly the policy limit, with a deadline and the supporting medical records and bills, putting the insurer on notice that if they don&rsquo;t take the deal and a jury later awards more, they may be the ones left holding the difference. It&rsquo;s one of the sharper tools available when damages clearly outrun what the policy will pay.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What to do if your claim looks like it&rsquo;s headed this way</h2>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li>Get a real estimate of your damages before you accept anything. Use the <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> and enter the at-fault driver&rsquo;s policy limit if you know it (it&rsquo;s often disclosed early in a claim); the tool will show you the gap directly.</li>
              <li>Check your own policy for UM/UIM coverage and its limits, and find out whether it stacks or offsets under your state&rsquo;s rules.</li>
              <li>Ask early whether any other party might share fault or carry separate insurance.</li>
              <li>Keep every medical bill, wage record, and repair estimate — a policy-limits demand only works if the documentation backs up the number.</li>
              <li>Get the at-fault driver&rsquo;s policy limit in writing, and don&rsquo;t sign a release until you understand what it closes off.</li>
            </ol>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">FAQ</h2>

            <h3 className="heading-display h3-editorial">Does it matter if my damages exceed the policy limit — can I still get more than that from the at-fault driver directly?</h3>
            <p style={bodyStyle}>The insurance company generally won&rsquo;t pay more than the policy limit. A court judgment against the driver personally isn&rsquo;t capped that way, but actually collecting more from an individual person, on top of their insurance, depends on whether they have assets worth pursuing.</p>

            <h3 className="heading-display h3-editorial">What happens if damages exceed insurance limits and I don&rsquo;t have UM/UIM coverage?</h3>
            <p style={bodyStyle}>Without UM/UIM, your main paths beyond the at-fault driver&rsquo;s policy limit are other liable parties (if any exist), the at-fault driver&rsquo;s personal assets, and any med-pay or PIP coverage on your own policy for medical bills specifically. This is exactly why UM/UIM coverage is worth checking on your own policy before you ever need it.</p>

            <h3 className="heading-display h3-editorial">What is an underinsured motorist (UIM) claim, in plain terms?</h3>
            <p style={bodyStyle}>It&rsquo;s a claim against your own insurance company, made under coverage you purchased, that pays when the at-fault driver&rsquo;s liability coverage isn&rsquo;t enough to cover your damages. You&rsquo;re not suing the at-fault driver&rsquo;s insurer a second time — you&rsquo;re making a claim on your own policy.</p>

            <h3 className="heading-display h3-editorial">Can the insurance company be held responsible for refusing a fair settlement within the policy limit?</h3>
            <p style={bodyStyle}>In some states, yes, under legal doctrines built for exactly that situation, like Texas&rsquo;s Stowers doctrine or Florida&rsquo;s bad-faith statute. The details — timelines, notice requirements, what counts as an acceptable demand — vary by state, so this is worth discussing with an attorney licensed there rather than assuming it works the same way everywhere.</p>

            <h3 className="heading-display h3-editorial">Is it worth pursuing the at-fault driver&rsquo;s personal assets if their insurance limit isn&rsquo;t enough?</h3>
            <p style={bodyStyle}>Sometimes, but only if they actually have assets a judgment can reach, like real estate, a business, or non-exempt savings. Chasing someone who has nothing worth collecting usually isn&rsquo;t worth the time or legal cost, which is part of why other sources of recovery — UM/UIM, other defendants, umbrella policies — tend to matter more in practice.</p>

            <hr style={ruleStyle} />

            <p style={{ ...bodyStyle, fontSize: '15px' }}><strong style={{ color: 'var(--ink)' }}>This article is for general information only and is not legal advice.</strong> Insurance and injury law vary by state and by the specific facts of a claim. For advice about your situation, talk to a licensed attorney in your state.</p>

            <h2 className="heading-display h2-editorial">Sources</h2>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><a href="https://www.insurance.ca.gov/0250-insurers/0300-insurers/0200-bulletins/bulletin-notices-commiss-opinion/upload/bulletin-2023-1-re-sb-1107-final-003.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>California Department of Insurance — Bulletin on SB 1107 minimum liability limits</a></li>
              <li><a href="https://www.insurance.ca.gov/0400-news/0102-alerts/2025/New-Year-Means-New-Changes-for-Insurance.cfm" target="_blank" rel="noopener noreferrer" style={linkStyle}>California Department of Insurance — &ldquo;New Year Means New Changes for Insurance&rdquo; (2025 consumer alert)</a></li>
              <li><a href="https://www.dmv.ca.gov/portal/vehicle-registration/insurance-requirements/" target="_blank" rel="noopener noreferrer" style={linkStyle}>California DMV — Auto Insurance Requirements</a></li>
              <li><a href="https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025" target="_blank" rel="noopener noreferrer" style={linkStyle}>North Carolina Department of Insurance — Changes to the Rating of Automobile Insurance Policies, Effective July 1, 2025</a></li>
              <li><a href="https://statutes.capitol.texas.gov/Docs/TN/htm/TN.601.htm" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Transportation Code § 601.072 — Minimum Coverage Amounts</a></li>
              <li><a href="https://www.flhsmv.gov/insurance/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Department of Highway Safety and Motor Vehicles — Insurance Requirements</a></li>
              <li><a href="https://www.txcourts.gov/media/1452128/190701.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Texas Supreme Court — opinion discussing the Stowers doctrine, citing G.A. Stowers Furniture Co. v. American Indemnity Co., 15 S.W.2d 544 (Tex. Comm&rsquo;n App. 1929)</a></li>
              <li><a href="https://www.flsenate.gov/Laws/Statutes/2025/624.155" target="_blank" rel="noopener noreferrer" style={linkStyle}>Florida Statutes § 624.155 — Civil remedy for bad faith</a></li>
            </ul>

          </article>
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
