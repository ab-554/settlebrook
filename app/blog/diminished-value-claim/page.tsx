// ─────────────────────────────────────────────────────────────────────────────
// app/blog/diminished-value-claim/page.tsx
// Blog post #4 — targets "diminished value claim" / "diminished value
// calculator" / "17c formula". Source draft:
// research/2026-09-24/posts/post-2-diminished-value-claim.md
// Structure follows app/blog/ppd-settlement-calculator-guide/page.tsx:
//   • Relative canonical + relative OG/Twitter image paths (metadataBase in
//     app/layout.tsx supplies the https://www.settlebrook.com prefix)
//   • Article + FAQPage + BreadcrumbList JSON-LD inline
//   • No manual ad slots (Auto Ads only)
// Body published verbatim from the draft, H1 through Sources — the
// frontmatter and Verification Table section are not published.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import EditorialLayout from '@/components/ui/EditorialLayout'
import BlogRail from '@/components/ui/BlogRail'

const canonicalUrl = '/blog/diminished-value-claim/'
const PUBLISHED_DATE = '2026-09-24'

const metaDescription =
  'What a diminished value claim is, how insurers use the 17c formula, and how diminished value fits into your overall car accident settlement.'

export const metadata: Metadata = {
  title: 'Diminished Value Claims After a Car Accident',
  description: metaDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Diminished Value Claims After a Car Accident: How They're Calculated",
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
        alt: 'Diminished Value Claims After a Car Accident — Settlebrook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Diminished Value Claims After a Car Accident: How They're Calculated",
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
  headline: "Diminished Value Claims After a Car Accident: How They're Calculated",
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
      name: 'Is a diminished value claim the same thing as a property damage claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A property damage claim typically covers the cost to repair or replace your vehicle. A diminished value claim is a separate, additional amount for the resale value your vehicle lost simply because it now has an accident in its history, even after a good repair.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to hire an appraiser to file a diminished value claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always — you can submit a claim using an insurer’s own formula-based estimate. But because insurer formulas like 17c tend to produce lower numbers, many people who dispute the insurer’s figure get an independent appraisal, which relies on actual comparable sales rather than a fixed set of modifiers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get diminished value from my own insurance company?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your state and your policy’s wording. Georgia is the clearest example of a state where the state supreme court, in Mabry, required insurers to evaluate diminished value on first-party claims. In other states, coverage for a first-party diminished value claim varies, and you’ll want to check your policy language and your state’s rules.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the 17c formula apply everywhere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. It's the method associated with the Georgia Mabry litigation. It isn't a nationwide legal standard, and other states' rules and your policy wording decide how diminished value is handled.",
      },
    },
    {
      '@type': 'Question',
      name: 'Will a diminished value payout be added to my pain and suffering, or counted separately?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In Settlebrook's car accident settlement calculator, property damage and diminished value are added to your special damages total dollar-for-dollar — they are not multiplied along with pain and suffering, because a multiplier is meant to reflect physical and emotional harm, not a drop in resale value.",
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
    { '@type': 'ListItem', position: 3, name: 'Diminished Value Claim', item: canonicalUrl },
  ],
}

// ─── Shared inline styles (match the [state] editorial templates) ─────────────

const bodyStyle = { color: 'var(--ink-2)', lineHeight: '1.8', marginBottom: '18px' } as const
const linkStyle = { color: 'var(--primary)' } as const
const ruleStyle = { borderColor: 'var(--line)', margin: '36px 0' } as const

export default function DiminishedValueClaimPost() {
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
              { label: 'Diminished Value Claim', href: canonicalUrl },
            ]} />
            <div className="mt-4 max-w-3xl">
              <h1 className="mt-1">
                Diminished Value Claims After a Car Accident: How They&rsquo;re Calculated
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

            <p style={bodyStyle}>You get your car repaired after a wreck. The body shop does good work, the panels line up, the paint matches. On paper, the car is fixed. But if you tried to sell it next month, a buyer who ran a vehicle history report would see the accident — and offer less than for an identical car with a clean history.</p>
            <p style={bodyStyle}>That gap in resale value is a diminished value claim. It&rsquo;s a category of loss that insurance adjusters, appraisers, and courts have argued over for more than two decades, and it comes up in almost every car accident settlement where the vehicle wasn&rsquo;t totaled.</p>
            <p style={bodyStyle}>This article explains what a diminished value claim is, how the widely-cited &ldquo;17c&rdquo; formula works, where it came from, and how diminished value fits into the bigger picture of a car accident settlement.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">What Is a Diminished Value Claim?</h2>
            <p style={bodyStyle}>A diminished value claim asks an insurer to pay for the loss in your vehicle&rsquo;s market value caused by the accident itself — separate from, and in addition to, the cost of the physical repairs.</p>
            <p style={bodyStyle}>People in the diminished value field generally talk about three kinds of loss:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><strong style={{ color: 'var(--ink)' }}>Inherent diminished value</strong> — the loss from the simple fact that the vehicle now has an accident on its record, regardless of repair quality. The National Association of Insurance Commissioners&rsquo; Journal of Insurance Regulation describes this as value lost &ldquo;because of public perception (i.e., &lsquo;stigma&rsquo;)&rdquo; once a claim is registered against the vehicle.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Repair-related diminished value</strong> — additional loss from the quality of the repair itself, such as mismatched paint or parts that don&rsquo;t perform like the originals. The same NAIC review describes this as the vehicle being &ldquo;worth less because of the mechanic&rsquo;s poor work while repairing the vehicle.&rdquo;</li>
              <li><strong style={{ color: 'var(--ink)' }}>Immediate diminished value</strong> — the drop in value at the moment the damage occurs, before any repair. This comes up most often when a car is sold &ldquo;as-is&rdquo; unrepaired, or when its post-damage value is disputed for a total-loss calculation.</li>
            </ul>
            <p style={bodyStyle}>Most diminished value claims filed by everyday drivers are inherent diminished value claims: the car has been properly repaired, but the accident history alone drags down what it&rsquo;s worth.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Third-Party Claims vs. First-Party Claims</h2>
            <p style={bodyStyle}>Diminished value claims come in two forms, and the distinction matters a lot for whether you&rsquo;re likely to get paid.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Third-party claims</strong> are filed against the at-fault driver&rsquo;s liability insurance. Because you weren&rsquo;t at fault, you&rsquo;re asserting a right to be made whole under general tort law — not a contract you signed. The NAIC review notes that in a third-party claim, &ldquo;an injured person (the third party) asks an at-fault person&rsquo;s liability insurance to pay for damages,&rdquo; and that many states recognize this kind of recovery as part of ordinary property damage.</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>First-party claims</strong> are filed against your own insurance company, usually under your collision or uninsured/underinsured motorist coverage. Because this is a contract claim, the outcome depends heavily on your policy&rsquo;s exact wording — and courts in different states have read similar language differently. Whether you can recover diminished value from your own insurer, and how much, varies by state and by policy terms.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Where the &ldquo;17c&rdquo; Formula Came From</h2>
            <p style={bodyStyle}>The formula most often associated with diminished value calculations is known in the industry as the &ldquo;17c&rdquo; method. Its name and use trace directly back to Georgia litigation over State Farm&rsquo;s claims practices.</p>
            <p style={bodyStyle}>In 2001, the Georgia Supreme Court decided <em>State Farm Mutual Automobile Insurance Co. v. Mabry</em>, 274 Ga. 498, 556 S.E.2d 114 (2001), a class action arguing that State Farm had to evaluate diminished value as part of ordinary first-party physical damage claims, not just pay for repairs. The court agreed, holding that State Farm was &ldquo;obligated to pay for diminution in value when it occurs,&rdquo; and that it had to assess that element of loss for every applicable claim rather than requiring a separate demand for it.</p>
            <p style={bodyStyle}>The case was sent back to the Superior Court of Muscogee County to work out how State Farm would calculate and pay those claims. A later federal case, <em>Tiller v. State Farm Mutual Automobile Insurance Co.</em>, No. 1:12-CV-3432-TWT (N.D. Ga. Feb. 5, 2013), explains that the resulting methodology — the one now commonly called &ldquo;17c&rdquo; — was &ldquo;referenced in Section 10 of the March 6, 2002, order&rdquo; issued by that Muscogee County court in the Mabry case. The &ldquo;17c&rdquo; label has since become common shorthand whenever people discuss formula-based diminished value estimates.</p>
            <p style={bodyStyle}>According to the NAIC&rsquo;s Journal of Insurance Regulation, the formula works like this:</p>
            <p style={bodyStyle}><strong style={{ color: 'var(--ink)' }}>Diminished value = 10% of the vehicle&rsquo;s pre-accident retail value × a damage modifier × a mileage modifier</strong></p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>The base loss is capped at 10% of the vehicle&rsquo;s pre-accident retail value (commonly a NADA guide value), on the theory that diminished value can never exceed a tenth of what the car was worth.</li>
              <li>The damage modifier is a number between 0 and 1 that scales the base loss down depending on how severe the structural damage was. Moderate damage is commonly assigned a modifier around 0.5.</li>
              <li>The mileage modifier is a second number between 0 and 1 that scales the loss down further depending on how many miles are on the vehicle.</li>
            </ul>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">A Hypothetical Example of the 17c Method</h2>
            <p style={{ ...bodyStyle, fontSize: '15px' }}><em>The following is a hypothetical example to illustrate the arithmetic. It is one method some insurers use — it is not a legal formula required in every state, and it is not how Settlebrook&rsquo;s calculator produces its own results.</em></p>
            <p style={bodyStyle}>Say a car was worth $20,000 right before the accident.</p>
            <ol style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li><strong style={{ color: 'var(--ink)' }}>Base loss:</strong> 10% of $20,000 = $2,000</li>
              <li><strong style={{ color: 'var(--ink)' }}>Damage modifier:</strong> the vehicle had moderate structural damage, so a modifier of 0.5 is applied. $2,000 × 0.5 = $1,000</li>
              <li><strong style={{ color: 'var(--ink)' }}>Mileage modifier:</strong> the car had moderate mileage for its age, so a modifier of 0.8 is applied. $1,000 × 0.8 = $800</li>
            </ol>
            <p style={bodyStyle}><strong style={{ color: 'var(--amber)' }}>Result: an estimated diminished value of $800.</strong></p>
            <p style={bodyStyle}>Change any input and the result moves a lot. In <em>Tiller</em>, the court described an actual State Farm calculation on a vehicle NADA-valued at $14,755: after a damage modifier of 30% and a mileage modifier of 11% were applied to the 10% base, the diminished value came out to $48.76. The plaintiffs in that case argued the 17c methodology &ldquo;results in an artificially low figure&rdquo; — and a $48.76 payout on a nearly $15,000 vehicle is exactly the kind of result that drives that argument.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Why the 17c Formula Draws Criticism</h2>
            <p style={bodyStyle}>The 17c formula is popular with insurers because it&rsquo;s fast and cheap to apply — an adjuster can run the numbers from a repair estimate and a mileage reading without inspecting the car in person. But the same features that make it convenient are what critics point to.</p>
            <p style={bodyStyle}>The NAIC&rsquo;s review flags one criticism in particular: mileage is already priced into the vehicle&rsquo;s NADA retail value before the formula starts, since NADA values already account for the odometer reading. Applying a separate mileage modifier on top of that, the review notes, &ldquo;is viewed by some as a double penalty for mileage.&rdquo; The formula also ignores repair-related diminished value entirely — two vehicles with identical pre-accident value, damage severity, and mileage get the same 17c number, even if one was repaired flawlessly and the other has a visible paint mismatch.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Independent Appraisals: How They Differ</h2>
            <p style={bodyStyle}>An independent diminished value appraisal generally works from actual market data instead of a fixed set of modifiers. An appraiser pulls comparable sale or listing prices for the same make, model, year, and condition — some with accident history disclosed, some without — and compares them directly, rather than applying a flat percentage capped at 10%. Because the comparison is based on real transactions rather than a generic table, an independent appraisal can come out higher or lower than a 17c-style estimate, and it can account for repair-quality issues a formula ignores. Insurers aren&rsquo;t obligated to accept an independent appraisal, but it&rsquo;s commonly used as leverage when a policyholder disputes an insurer&rsquo;s formula-based figure.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Which States Recognize First-Party Diminished Value Claims</h2>
            <p style={bodyStyle}>Georgia is the one state where this is settled by a state supreme court decision: under <em>Mabry</em>, insurers must evaluate first-party diminished value as part of an ordinary physical damage claim.</p>
            <p style={bodyStyle}>Outside Georgia, whether a first-party diminished value claim succeeds depends on your state&rsquo;s law and the exact wording of your policy — insurers write &ldquo;loss&rdquo; and &ldquo;actual cash value&rdquo; provisions differently, and courts in different states have reached different conclusions about what those provisions require. Third-party claims against an at-fault driver&rsquo;s insurer tend to have an easier path, since they rest on general property-damage tort principles rather than one insurer&rsquo;s contract language, but documentation and your state&rsquo;s damages rules still matter. If you&rsquo;re not sure where your state lands, your state&rsquo;s insurance department or a local attorney can tell you how it&rsquo;s been handled in your jurisdiction.</p>
            <p style={bodyStyle}>If you were in an accident in Georgia, our <Link href="/car-accident-settlement-calculator/georgia/" style={linkStyle}>Georgia car accident settlement calculator</Link> lets you include property damage, such as a diminished value figure, in a full settlement estimate. Drivers building out a settlement estimate in <Link href="/car-accident-settlement-calculator/california/" style={linkStyle}>California</Link>, <Link href="/car-accident-settlement-calculator/texas/" style={linkStyle}>Texas</Link>, <Link href="/car-accident-settlement-calculator/florida/" style={linkStyle}>Florida</Link>, or <Link href="/car-accident-settlement-calculator/new-york/" style={linkStyle}>New York</Link> can run their own numbers through those state-specific calculators as well.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">How Diminished Value Fits Into Your Car Accident Settlement</h2>
            <p style={bodyStyle}>It&rsquo;s worth being clear about where diminished value sits inside a settlement calculation, since it&rsquo;s easy to mix up with pain and suffering.</p>
            <p style={bodyStyle}>Settlebrook&rsquo;s <Link href="/car-accident-settlement-calculator/" style={linkStyle}>car accident settlement calculator</Link> uses the multiplier method: medical bills, future medical costs, lost wages, and future lost wages are added together and multiplied by a factor (typically 1.5x to 5x, depending on injury severity) to estimate pain and suffering.</p>
            <p style={bodyStyle}>Property damage, including a diminished value figure if you&rsquo;re pursuing one, is <strong style={{ color: 'var(--ink)' }}>not</strong> run through that multiplier. It&rsquo;s added on top, dollar-for-dollar, as part of your special damages total. Here&rsquo;s what that looks like with round numbers:</p>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li>Medical bills + lost wages: $10,000 (this is what gets multiplied)</li>
              <li>Property damage / diminished value: $2,000 (added, not multiplied)</li>
              <li>Multiplier for a moderate injury: 2.5x</li>
              <li>Pain and suffering estimate: $10,000 × 2.5 = $25,000</li>
              <li>Total special damages: $10,000 + $2,000 = $12,000</li>
              <li><strong style={{ color: 'var(--amber)' }}>Total settlement estimate: $12,000 + $25,000 = $37,000</strong></li>
            </ul>
            <p style={bodyStyle}>The reasoning: a multiplier is meant to put a number on pain, suffering, and emotional distress caused by physical injury. A diminished value payment doesn&rsquo;t compensate for pain — it compensates for a dollar-for-dollar drop in what your car is worth. Multiplying it the same way you&rsquo;d multiply medical bills would inflate the injury portion of your claim with a number that has nothing to do with how much you suffered.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">FAQ</h2>

            <h3 className="heading-display h3-editorial">Is a diminished value claim the same thing as a property damage claim?</h3>
            <p style={bodyStyle}>No. A property damage claim typically covers the cost to repair or replace your vehicle. A diminished value claim is a separate, additional amount for the resale value your vehicle lost simply because it now has an accident in its history, even after a good repair.</p>

            <h3 className="heading-display h3-editorial">Do I need to hire an appraiser to file a diminished value claim?</h3>
            <p style={bodyStyle}>Not always — you can submit a claim using an insurer&rsquo;s own formula-based estimate. But because insurer formulas like 17c tend to produce lower numbers, many people who dispute the insurer&rsquo;s figure get an independent appraisal, which relies on actual comparable sales rather than a fixed set of modifiers.</p>

            <h3 className="heading-display h3-editorial">Can I get diminished value from my own insurance company?</h3>
            <p style={bodyStyle}>It depends on your state and your policy&rsquo;s wording. Georgia is the clearest example of a state where the state supreme court, in <em>Mabry</em>, required insurers to evaluate diminished value on first-party claims. In other states, coverage for a first-party diminished value claim varies, and you&rsquo;ll want to check your policy language and your state&rsquo;s rules.</p>

            <h3 className="heading-display h3-editorial">Does the 17c formula apply everywhere?</h3>
            <p style={bodyStyle}>No. It&rsquo;s the method associated with the Georgia <em>Mabry</em> litigation. It isn&rsquo;t a nationwide legal standard, and other states&rsquo; rules and your policy wording decide how diminished value is handled.</p>

            <h3 className="heading-display h3-editorial">Will a diminished value payout be added to my pain and suffering, or counted separately?</h3>
            <p style={bodyStyle}>In Settlebrook&rsquo;s car accident settlement calculator, property damage and diminished value are added to your special damages total dollar-for-dollar — they are not multiplied along with pain and suffering, because a multiplier is meant to reflect physical and emotional harm, not a drop in resale value.</p>

            <hr style={ruleStyle} />

            <h2 className="heading-display h2-editorial">Not Legal Advice</h2>
            <p style={bodyStyle}>This article is for general information only and isn&rsquo;t legal, financial, or insurance advice. Diminished value rules vary by state and by the specific language in your insurance policy. For advice about your own situation, talk to a licensed attorney or your state&rsquo;s department of insurance.</p>

            <h2 className="heading-display h2-editorial">Sources</h2>
            <ul style={{ ...bodyStyle, paddingLeft: 24, listStyleType: 'disc' }}>
              <li><em>State Farm Mutual Automobile Insurance Co. v. Mabry</em>, 274 Ga. 498, 556 S.E.2d 114 (Ga. 2001) — CourtListener: <a href="https://www.courtlistener.com/opinion/1418705/state-farm-mut-auto-ins-co-v-mabry/" target="_blank" rel="noopener noreferrer" style={linkStyle}>courtlistener.com</a></li>
              <li><em>Tiller v. State Farm Mutual Automobile Insurance Co.</em>, No. 1:12-CV-3432-TWT (N.D. Ga. Feb. 5, 2013) — U.S. Government Publishing Office: <a href="https://www.govinfo.gov/content/pkg/USCOURTS-gand-1_12-cv-03432/pdf/USCOURTS-gand-1_12-cv-03432-0.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>govinfo.gov</a></li>
              <li>National Association of Insurance Commissioners, &ldquo;Automobile Diminished Value Claims,&rdquo; <em>Journal of Insurance Regulation</em> — <a href="https://content.naic.org/sites/default/files/cipr-jir-2023-5_0.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>content.naic.org</a></li>
            </ul>

          </article>
          </EditorialLayout>
        </div>

      </main>
    </>
  )
}
