// ─────────────────────────────────────────────────────────────────────────────
// app/blog/injury-claim-calculator/page.tsx
// Blog post #3 — targets "injury claim calculator" / "personal injury claim
// calculator". Source draft: research/2026-09-24/posts/post-1-injury-claim-calculator.md
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
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import BlogRail from '@/components/ui/BlogRail'

const canonicalUrl = '/blog/injury-claim-calculator/'
const PUBLISHED_DATE = '2026-09-24'

const metaDescription =
  "See how insurers actually calculate a personal injury claim, then use our free injury claim calculator to estimate your own settlement range."

export const metadata: Metadata = {
  title: 'Injury Claim Calculator: How Insurers Value Your Claim',
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Injury Claim Calculator: How Insurers Value Your Claim',
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
        alt: 'Injury Claim Calculator — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Injury Claim Calculator: How Insurers Value Your Claim',
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
  headline: 'Injury Claim Calculator: How Insurers Value Your Claim',
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
      name: 'Is an injury claim calculator the same as what an insurance company uses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It uses the two most common estimating methods, the multiplier method and the per diem method, but a calculator can't account for every fact-specific detail an adjuster or attorney will weigh, like documentation quality or a disputed liability picture. Treat the output as a starting estimate, not a guaranteed number.",
      },
    },
    {
      '@type': 'Question',
      name: 'What multiplier should I use for my injury?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Multipliers scale with severity and permanence: minor, short-term injuries sit around 1.5, while catastrophic, permanent injuries can reach 5.0. If you're unsure where your injury falls, it's reasonable to run the calculator at two or three different severity levels to see the full range.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does comparative fault apply even if the other driver was mostly at fault?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. In comparative fault states, any percentage of fault assigned to you reduces your recovery by that percentage, even if it's small. In modified comparative fault states, reaching the state's bar (50% in Georgia, more than 50% in Florida) eliminates recovery entirely. In contributory negligence jurisdictions like Maryland, any fault at all can bar recovery.",
      },
    },
    {
      '@type': 'Question',
      name: "Why did the insurance company's number come out lower than my calculator estimate?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The most common reasons are a disputed severity rating, treatment gaps the adjuster is using to discount causation, a policy limits ceiling that caps what they can offer regardless of the claim's value, or a fault percentage they're assigning to you that you don't agree with. Ask the adjuster directly which of these is driving their number.",
      },
    },
    {
      '@type': 'Question',
      name: "Should I accept the insurance company's first offer?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A first offer is often an opening position rather than a final number. Running your own estimate first — and understanding your state's comparative fault rule — gives you a factual basis to negotiate rather than accepting or rejecting an offer based on instinct alone.",
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
    { '@type': 'ListItem', position: 3, name: 'Injury Claim Calculator', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const

export default function InjuryClaimCalculatorPost() {
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
              { label: 'Injury Claim Calculator', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Injury Claim Calculator: How Insurers Value Your Claim
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>
                September 24, 2026 · Settlebrook Editorial ·{' '}
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

            <p style={bodyStyle}>When an insurance adjuster looks at your personal injury claim, they&rsquo;re weighing your bills, your wage loss, your medical records, and your share of fault to land on a number. You can&rsquo;t see that process from the outside, which is why the offer that lands in your inbox can feel like it was pulled out of thin air.</p>
            <p style={bodyStyle}>You can build your own estimate. Our free <Link href="/pain-and-suffering-calculator/" style={linkStyle}>injury claim calculator</Link> uses the two most widely used ways of putting a number on pain and suffering, the multiplier method and the per diem method, so you can see roughly where your claim might land before you accept anything.</p>
            <p style={bodyStyle}>This guide walks through what actually goes into that number: how economic and non-economic damages are added up, how your own share of fault can shrink the total, and what adjusters are really looking at when they read your file. We&rsquo;ll also work through one full example with real math, so you can see exactly how the pieces fit together.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What an Injury Claim Calculator Actually Does</h2>
            <p style={bodyStyle}>A personal injury claim is made up of two very different kinds of losses. The first kind is economic — your medical bills, your lost paychecks, the money that actually left your pocket or your future paycheck. The second kind is non-economic — pain, physical limitation, disruption to your life — and it doesn&rsquo;t come with a receipt.</p>
            <p style={bodyStyle}>An injury claim calculator estimates that second, harder-to-price category using one of two standard methods:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>The multiplier method</strong> takes your economic damages and multiplies them by a factor tied to how serious the injury is.</li>
              <li><strong style={{ color: 'var(--ink)' }}>The per diem method</strong> assigns a dollar value to each day you were affected by the injury and multiplies it by the number of recovery days.</li>
            </ul>
            <p style={bodyStyle}>Neither method is a legal guarantee of what you&rsquo;ll receive. Both are estimating tools that give you a reasoned starting point before negotiation begins. For the full breakdown of how we built ours, see our <Link href="/methodology/" style={linkStyle}>methodology page</Link>.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">The Building Blocks of a Claim Value</h2>

            <h3 className="heading-display h3-editorial">Special Damages (the economic side)</h3>
            <p style={bodyStyle}>Special damages are the losses you can document with paperwork:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Medical bills already incurred</li>
              <li>Future medical care, when a doctor has projected it</li>
              <li>Lost wages from time already missed</li>
              <li>Future lost wages or reduced earning capacity, when supported by medical or vocational evidence</li>
              <li>Property damage, most often vehicle repair or replacement costs</li>
            </ul>
            <p style={bodyStyle}>In Settlebrook&rsquo;s calculator, we add the first four of these together into what we call the <strong style={{ color: 'var(--ink)' }}>multiplier base</strong> (medical bills + future medical + lost wages + future lost wages), and we add property damage on top of that separately to get <strong style={{ color: 'var(--ink)' }}>special damages</strong>.</p>

            <h3 className="heading-display h3-editorial">General Damages (pain and suffering)</h3>
            <p style={bodyStyle}>General damages cover pain, suffering, emotional distress, and loss of enjoyment of life. There&rsquo;s no invoice for this, so the multiplier method converts your multiplier base into a dollar figure using a factor tied to injury severity. Our calculator uses:</p>
            <div className="overflow-x-auto" style={{ marginBottom: 18 }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <th className="text-left py-2 pr-4" style={{ color: 'var(--ink)' }}>Severity</th>
                    <th className="text-left py-2" style={{ color: 'var(--ink)' }}>Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Minor', '1.5'],
                    ['Moderate', '2.5'],
                    ['Serious', '3.5'],
                    ['Severe', '4.5'],
                    ['Catastrophic', '5.0'],
                  ].map(([sev, mult]) => (
                    <tr key={sev} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td className="py-2 pr-4" style={{ color: 'var(--ink-2)' }}>{sev}</td>
                      <td className="py-2" style={{ color: 'var(--ink-2)' }}>{mult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={bodyStyle}>A sprained wrist that heals in six weeks sits at the low end. A spinal injury with permanent restrictions sits at the high end. Everything else falls somewhere in between, and reasonable people — including adjusters and juries — can disagree on exactly where.</p>

            <h3 className="heading-display h3-editorial">The Per Diem Alternative</h3>
            <p style={bodyStyle}>Instead of a multiplier, the per diem method picks a daily rate (often anchored to your own daily earnings) and multiplies it by the number of days you were in active recovery:</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Per diem pain and suffering = daily rate × recovery days</strong></p>
            <p style={bodyStyle}>This method is easiest to apply to injuries with a clear, bounded recovery period — a broken bone that heals on a set timeline, for example — and less well for injuries with permanent or uncertain effects, where a multiplier is more common.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Worked Example: How the Math Comes Together</h2>
            <p style={bodyStyle}>Here&rsquo;s a complete, fully hypothetical example using Settlebrook&rsquo;s exact formula, step by step. None of these figures represent an actual case or a typical outcome — they&rsquo;re just numbers chosen to show the math clearly.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>The facts (all hypothetical):</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Medical bills to date: $18,000</li>
              <li>Future medical care: $7,000</li>
              <li>Lost wages to date: $6,000</li>
              <li>Future lost wages: $4,000</li>
              <li>Property damage: $5,000</li>
              <li>Injury severity: Moderate (multiplier 2.5)</li>
              <li>Plaintiff fault: 20%</li>
            </ul>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Step 1 — Multiplier base</strong><br />$18,000 + $7,000 + $6,000 + $4,000 = <strong style={{ color: 'var(--amber)' }}>$35,000</strong></p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Step 2 — Special damages</strong><br />$35,000 (multiplier base) + $5,000 (property damage) = <strong style={{ color: 'var(--amber)' }}>$40,000</strong></p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Step 3 — Pain and suffering</strong><br />$35,000 × 2.5 = <strong style={{ color: 'var(--amber)' }}>$87,500</strong></p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Step 4 — Total (pre-fault-adjustment)</strong><br />$40,000 + $87,500 = <strong style={{ color: 'var(--amber)' }}>$127,500</strong></p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Step 5 — Fault-adjusted total</strong><br />$127,500 × (100 − 20) / 100 = $127,500 × 0.80 = <strong style={{ color: 'var(--amber)' }}>$102,000</strong></p>
            <p style={bodyStyle}>So in this hypothetical, a claim worth $127,500 before any fault dispute lands at <strong style={{ color: 'var(--amber)' }}>$102,000</strong> once a 20% comparative-fault finding is applied.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>For comparison, the per diem alternative:</strong><br />If we instead valued pain and suffering at a daily rate of $150 over 240 recovery days:<br />$150 × 240 = <strong style={{ color: 'var(--amber)' }}>$36,000</strong> (versus $87,500 under the multiplier method)</p>
            <p style={bodyStyle}>That gap is the whole reason it&rsquo;s worth running both methods. The multiplier and per diem approaches can produce very different numbers for the same injury, and knowing both gives you a realistic range instead of a single figure.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What an Insurance Adjuster Actually Weighs</h2>
            <p style={bodyStyle}>The math above is only the starting point. Before an adjuster ever applies a multiplier, they&rsquo;re evaluating your file against a handful of practical factors that push the number up or down:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>Documentation quality.</strong> Consistent, itemized medical records and bills that clearly tie treatment to the incident carry more weight than gaps or vague notes.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Treatment gaps.</strong> A large gap between the incident and your first medical visit, or long pauses in treatment, gives an adjuster a reason to argue the injury wasn&rsquo;t serious or wasn&rsquo;t caused by the incident.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Policy limits.</strong> An insurer will not pay more than the at-fault party&rsquo;s available coverage, regardless of how strong the claim is, which is why policy limits are one of the first things an adjuster checks.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Liability disputes.</strong> If fault is contested, the adjuster is pricing in the cost and risk of litigation, not just the injury itself.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Venue.</strong> The jurisdiction where a case would be tried affects an adjuster&rsquo;s internal valuation, since local jury tendencies and court procedures vary.</li>
            </ul>
            <p style={bodyStyle}>None of this is arbitrary once you know it&rsquo;s there — it&rsquo;s a checklist, and it&rsquo;s worth building your file with that checklist in mind.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Comparative Fault Changes the Number</h2>
            <p style={bodyStyle}>Every state applies some version of a fault-sharing rule, and the rule your state uses can swing your final number as much as the injury itself does. There are four main categories.</p>

            <h3 className="heading-display h3-editorial">Pure Comparative Fault — New York</h3>
            <p style={bodyStyle}>Under a pure comparative fault rule, you can recover damages even if you were mostly at fault — your recovery is just reduced by your percentage of fault, with no cutoff. New York applies this rule under <a href="https://www.nysenate.gov/legislation/laws/CVP/1411" target="_blank" rel="noopener noreferrer" style={linkStyle}>N.Y. CPLR § 1411</a>, which states that a claimant&rsquo;s culpable conduct &ldquo;shall not bar recovery,&rdquo; and instead the damages otherwise recoverable &ldquo;shall be diminished in the proportion&rdquo; that the claimant&rsquo;s fault bears to the total fault that caused the injury. In theory, a claimant who is 90% at fault can still recover the remaining 10% of their damages.</p>

            <h3 className="heading-display h3-editorial">Modified Comparative Fault, 50% Bar — Georgia</h3>
            <p style={bodyStyle}>Some states cut off recovery once the plaintiff&rsquo;s fault reaches a certain share. Georgia bars recovery once the plaintiff is 50% or more responsible. Under <a href="https://law.justia.com/codes/georgia/title-51/chapter-12/article-2/section-51-12-33/" target="_blank" rel="noopener noreferrer" style={linkStyle}>O.C.G.A. § 51-12-33</a>, a plaintiff who is found 50 percent or more responsible for their own injury is not entitled to recover any damages at all.</p>

            <h3 className="heading-display h3-editorial">Modified Comparative Fault, 51% Bar — Florida</h3>
            <p style={bodyStyle}>Other states set the cutoff one point higher, so a plaintiff can be exactly 50% at fault and still recover. Florida moved to this model in 2023. Under <a href="https://www.flsenate.gov/laws/statutes/2023/768.81" target="_blank" rel="noopener noreferrer" style={linkStyle}>Fla. Stat. § 768.81(6)</a>, &ldquo;any party found to be greater than 50 percent at fault for his or her own harm may not recover any damages,&rdquo; which means a plaintiff at 50% fault or less can still recover a reduced award, while a plaintiff at 51% or more recovers nothing.</p>

            <h3 className="heading-display h3-editorial">Contributory Negligence — Maryland</h3>
            <p style={bodyStyle}>A small number of jurisdictions still use the strictest rule of all: if you bear any fault, even a small amount, you recover nothing. Maryland is one of them. In <em>Coleman v. Soccer Association of Columbia</em> (Md. July 9, 2013), the Maryland high court declined to replace this rule with comparative fault, writing that it would &ldquo;decline to abrogate Maryland&rsquo;s long-established common law principle of contributory negligence,&rdquo; and left any change in that doctrine to the state legislature. You can read the full opinion on the <a href="https://www.mdcourts.gov/opinions/coa/2013/9a12.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Maryland Judiciary&rsquo;s website</a>.</p>

            <p style={bodyStyle}>Because this single rule can turn a six-figure claim into zero, it&rsquo;s worth knowing which category your state falls into before you accept — or dismiss — any settlement offer.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Car Accidents Add Extra Layers</h2>
            <p style={bodyStyle}>If your claim came out of a motor vehicle collision, the same multiplier and per diem math applies, but you&rsquo;re also dealing with a specific type of insurance policy, specific coverage limits, and often a separate property damage claim running in parallel. Our <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> applies the same formula shown above but is built specifically around collision claims, including how vehicle repair costs factor into the property damage line.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Using the Calculator the Right Way</h2>
            <p style={bodyStyle}>Run the numbers before you talk to an adjuster, not after you&rsquo;ve already gotten an offer. Once you have a range, that range becomes your anchor in negotiation — it&rsquo;s a lot easier to push back on a lowball offer when you know roughly where the math should land and why.</p>
            <p style={bodyStyle}>It also helps to run more than one scenario. Try your case at a lower severity rating and a higher one, and try it with a couple of different fault percentages, so you understand the full range of reasonable outcomes rather than a single number.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Frequently Asked Questions</h2>

            <h3 className="heading-display h3-editorial">Is an injury claim calculator the same as what an insurance company uses?</h3>
            <p style={bodyStyle}>It uses the two most common estimating methods, the multiplier method and the per diem method, but a calculator can&rsquo;t account for every fact-specific detail an adjuster or attorney will weigh, like documentation quality or a disputed liability picture. Treat the output as a starting estimate, not a guaranteed number.</p>

            <h3 className="heading-display h3-editorial">What multiplier should I use for my injury?</h3>
            <p style={bodyStyle}>Multipliers scale with severity and permanence: minor, short-term injuries sit around 1.5, while catastrophic, permanent injuries can reach 5.0. If you&rsquo;re unsure where your injury falls, it&rsquo;s reasonable to run the calculator at two or three different severity levels to see the full range.</p>

            <h3 className="heading-display h3-editorial">Does comparative fault apply even if the other driver was mostly at fault?</h3>
            <p style={bodyStyle}>Yes. In comparative fault states, any percentage of fault assigned to you reduces your recovery by that percentage, even if it&rsquo;s small. In modified comparative fault states, reaching the state&rsquo;s bar (50% in Georgia, more than 50% in Florida) eliminates recovery entirely. In contributory negligence jurisdictions like Maryland, any fault at all can bar recovery.</p>

            <h3 className="heading-display h3-editorial">Why did the insurance company&rsquo;s number come out lower than my calculator estimate?</h3>
            <p style={bodyStyle}>The most common reasons are a disputed severity rating, treatment gaps the adjuster is using to discount causation, a policy limits ceiling that caps what they can offer regardless of the claim&rsquo;s value, or a fault percentage they&rsquo;re assigning to you that you don&rsquo;t agree with. Ask the adjuster directly which of these is driving their number.</p>

            <h3 className="heading-display h3-editorial">Should I accept the insurance company&rsquo;s first offer?</h3>
            <p style={bodyStyle}>A first offer is often an opening position rather than a final number. Running your own estimate first — and understanding your state&rsquo;s comparative fault rule — gives you a factual basis to negotiate rather than accepting or rejecting an offer based on instinct alone.</p>

            <hr style={ruleStyle} />

            <p style={{ ...bodyStyle, fontSize: '15px' }}><strong style={{ color: 'var(--ink)' }}>This article is for general information only and is not legal advice.</strong> Every state&rsquo;s laws and every insurance policy are different, and the outcome of any specific claim depends on facts this article can&rsquo;t account for. For advice about your specific situation, talk to a licensed attorney in your state.</p>

            <h2 className="heading-display h2-editorial">Sources</h2>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li>N.Y. CPLR § 1411 (comparative negligence), NYS Senate Open Legislation — <a href="https://www.nysenate.gov/legislation/laws/CVP/1411" target="_blank" rel="noopener noreferrer" style={linkStyle}>nysenate.gov</a></li>
              <li>Fla. Stat. § 768.81 (comparative fault), The Florida Senate, 2023 Florida Statutes — <a href="https://www.flsenate.gov/laws/statutes/2023/768.81" target="_blank" rel="noopener noreferrer" style={linkStyle}>flsenate.gov</a></li>
              <li>O.C.G.A. § 51-12-33 (reduction and apportionment of award or bar of recovery), Justia U.S. Law — <a href="https://law.justia.com/codes/georgia/title-51/chapter-12/article-2/section-51-12-33/" target="_blank" rel="noopener noreferrer" style={linkStyle}>law.justia.com</a></li>
              <li><em>Coleman v. Soccer Association of Columbia</em>, No. 9, Sept. Term 2012 (Md. July 9, 2013), official opinion, Maryland Judiciary — <a href="https://www.mdcourts.gov/opinions/coa/2013/9a12.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>mdcourts.gov</a></li>
            </ol>

          </article>
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
