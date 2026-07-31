// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // FIX H3: title trimmed — template adds " | Settlebrook" (13 chars)
  title: "About Settlebrook — Legal Settlement Calculators",
  description:
    "SettleBrook builds free, research-backed settlement calculators for pain and suffering, car accidents, and workers' comp claims. Learn how our tools work and why we built them.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About SettleBrook | Free Legal Settlement Calculators",
    description:
      "Free settlement estimation tools built for everyday Americans navigating personal injury and workplace injury claims.",
    url: "/about/",
    siteName: "SettleBrook",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SettleBrook – Settlement Calculator Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SettleBrook | Free Legal Settlement Calculators",
    description:
      "Free settlement estimation tools built for everyday Americans navigating personal injury and workplace injury claims.",
    images: ["/og-image.png"],
  },
};

// FIX M2: Organization JSON-LD removed — sitewide schema now in layout.tsx

const TOOLS = [
  {
    title: "Pain & Suffering Calculator",
    desc: "Estimate non-economic damages using the multiplier and per diem methods.",
    href: "/pain-and-suffering-calculator/",
  },
  {
    title: "Car Accident Settlement Calculator",
    desc: "Calculate total estimated compensation for vehicle accident injuries.",
    href: "/car-accident-settlement-calculator/",
  },
  {
    title: "Workers' Comp Calculator",
    desc: "Estimate your workers' compensation settlement based on injury type and state.",
    href: "/workers-comp-settlement-calculator/",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: "#050A18" }}>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4"
          style={{
            minHeight: '52vh',
            background: 'radial-gradient(ellipse at top, #1E3A5F 0%, #050A18 70%)',
          }}
        >
          {/* Orbs */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div className="orb-1 absolute rounded-full" style={{ width: 480, height: 480, top: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)', filter: 'blur(48px)' }} />
            <div className="orb-2 absolute rounded-full" style={{ width: 380, height: 380, bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)', filter: 'blur(48px)' }} />
            <div className="orb-3 absolute rounded-full" style={{ width: 300, height: 300, top: '45%', left: '55%', background: 'radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          </div>

          <div className="relative max-w-5xl mx-auto py-20 sm:py-24 flex flex-col items-center gap-8">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <span className="trust-pill">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#34D399', animation: 'pulseGlow 2s infinite' }} />
                Trusted · Free · No Signup
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              About Settlebrook — Free Legal Settlement Calculators
            </h1>

            {/* Subheading */}
            <p
              className="animate-fade-in-up-d2 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Free legal settlement calculators built for everyday Americans — not lawyers.
            </p>
          </div>
        </section>

        {/* AD_SLOT_TOP */}
        <div
          id="AD_SLOT_TOP"
          className="w-full flex justify-center py-3"
          style={{ backgroundColor: 'rgba(13,21,38,0.6)', borderBottom: '1px solid rgba(99,179,237,0.08)' }}
          aria-hidden="true"
        >
          {/* AdSense leaderboard 728×90 / responsive */}
        </div>

        {/* Main content */}
        <article className="max-w-7xl mx-auto px-6 sm:px-8 py-14 flex flex-col gap-12">

          {/* Mission */}
          <section aria-labelledby="mission-heading">
            <h2
              id="mission-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Our Mission
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Every year, millions of Americans file personal injury and workers&apos;
                compensation claims. Most have no idea what a fair settlement looks
                like. Insurance adjusters do — and they exploit that information gap
                to pay far less than claimants deserve. Studies consistently show
                that unrepresented claimants receive significantly lower settlements
                than those who understand the valuation process, even before hiring
                an attorney.
              </p>
              <p>
                SettleBrook exists to close that gap. Our calculators translate the
                same formulas that insurance companies and plaintiff attorneys use
                daily into plain-language tools that anyone can run in under two
                minutes. You don&apos;t need a law degree or a $300-per-hour consultation
                to get a realistic ballpark — you need a reliable, honest starting
                point.
              </p>
              <p>
                We are not a law firm and we do not give legal advice. But we believe
                firmly that informed people negotiate better outcomes, accept fewer
                lowball offers, and are far less likely to walk away from money they
                are rightfully owed.
              </p>
            </div>
          </section>

          {/* How calculators work */}
          <section aria-labelledby="how-it-works-heading">
            <h2
              id="how-it-works-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              How Our Calculators Work
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Our tools implement the two most widely used settlement estimation
                methods in U.S. personal injury practice. Neither is codified in law —
                they are industry conventions. But they are the same conventions your
                insurer&apos;s claims software is running right now.
              </p>

              <h3 className="text-lg font-semibold mt-2" style={{ color: "#F1F5F9" }}>
                The Multiplier Method
              </h3>
              <p>
                The multiplier method starts with your total economic damages —
                verified medical bills, documented lost wages, and out-of-pocket
                costs like transportation to appointments or home care — and
                multiplies them by a factor between 1.5 and 5 to estimate the
                non-economic (pain and suffering) component of your claim.
              </p>
              <p>
                The multiplier rises with injury severity, length of recovery, the
                permanence of harm, and the degree to which the accident disrupted
                your daily life and relationships. A sprained wrist that healed in
                three weeks carries a very different multiplier than a herniated disc
                requiring surgery and causing permanent limitations.
              </p>
              <p>
                Example: $25,000 in verified medical costs × multiplier of 3 =
                $75,000 in pain and suffering. Add back the $25,000 in economic
                damages for a total estimated claim of{" "}
                <strong style={{ color: "#FBBF24" }}>$100,000</strong>, before any
                comparative negligence reductions or policy limit adjustments.
              </p>

              <h3 className="text-lg font-semibold mt-2" style={{ color: "#F1F5F9" }}>
                The Per Diem Method
              </h3>
              <p>
                The per diem method assigns a daily dollar value to your pain and
                suffering — typically your daily wage rate — and multiplies it by
                the number of days you endured documented pain, reduced mobility, or
                measurably diminished quality of life. This approach is particularly
                persuasive in courtroom presentations because it grounds the
                intangible concept of suffering in a concrete, relatable daily cost.
              </p>
              <p>
                Both methods produce informed estimates, not guarantees. Actual
                settlement amounts depend on liability disputes, your jurisdiction&apos;s
                damage caps, available insurance policy limits, the quality of your
                documentation, and factors no calculator can fully anticipate.
              </p>
            </div>
          </section>

          {/* AD_SLOT_MID */}
          <div
            id="AD_SLOT_MID"
            className="w-full flex justify-center py-4"
            aria-hidden="true"
          >
            {/* AdSense in-content responsive */}
          </div>

          {/* Why we built this */}
          <section aria-labelledby="why-heading">
            <h2
              id="why-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Why We Built SettleBrook
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                The idea came from a frustrating observation: the resources that
                explain settlement math clearly — that walk you through an actual
                formula, account for your state&apos;s specific rules, and tell you
                honestly which factors push a number up or down — are mostly locked
                behind attorney consultations or buried in dense legal textbooks
                most people will never read.
              </p>
              <p>
                Free online calculators existed before us, but the majority were
                superficial lead-generation forms designed to collect your phone
                number and sell it to law firms, not to give you meaningful
                information. We found this practice predatory. People using these
                tools are often injured, stressed, and already being pressured by
                insurance adjusters. They deserve actual answers, not a sales funnel.
              </p>
              <p>
                SettleBrook launched with the Pain &amp; Suffering Calculator — the most
                commonly searched and least honestly served calculator in this niche.
                The Car Accident Settlement Calculator and Workers&apos; Comp Settlement
                Calculator followed, covering the three most prevalent injury claim
                categories in the United States.
              </p>
              <p>
                We are a small, independent operation. We keep the site free, keep
                advertising unobtrusive, and decline affiliate arrangements with any
                service we would not personally recommend. Our only business model is
                helping enough people that the site sustains itself through display
                advertising.
              </p>
            </div>
          </section>

          {/* Team */}
          <section aria-labelledby="team-heading">
            <h2
              id="team-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Our Team
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                SettleBrook is maintained by a compact team of researchers, content
                specialists, and web developers with backgrounds spanning legal
                publishing, insurance industry analysis, and consumer financial
                education. We are not a law firm. We do not employ licensed
                attorneys. Our legal content is researched against publicly available
                case law summaries, state insurance commission bulletins, established
                personal injury litigation frameworks, and insurance industry
                actuarial publications.
              </p>
              <p>
                Every formula, assumption, and multiplier range we use is
                documented, cited, and reviewed periodically for accuracy. When legal
                landscapes shift — new state-level caps on non-economic damages,
                changes to workers&apos; compensation fee schedules, or updated court
                interpretations of comparative fault — we update our tools to reflect
                current practice.
              </p>
              <p>
                Our tools are designed exclusively for U.S. claims under U.S. law.
                If you are located outside the United States or pursuing a claim
                under another jurisdiction&apos;s legal framework, our calculators do not
                apply to your situation.
              </p>
            </div>
          </section>

          {/* Accuracy disclaimer box */}
          <section
            aria-labelledby="disclaimer-heading"
            className="rounded-2xl p-6"
            style={{
              background: "rgba(251,191,36,0.07)",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            <h2
              id="disclaimer-heading"
              className="text-lg font-bold mb-3"
              style={{ color: "#FBBF24" }}
            >
              Important Accuracy Disclaimer
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                SettleBrook calculators produce estimates based on general industry
                formulas and publicly documented settlement benchmarks. They are
                educational tools only. No output from any SettleBrook tool should
                be interpreted as a prediction of what you will receive, a guarantee
                of any settlement amount, or a substitute for consultation with a
                licensed personal injury attorney in your state.
              </p>
              <p>
                Settlement values are highly fact-specific. Comparative negligence
                determinations, available insurance policy limits, pre-existing
                conditions, jurisdiction-specific damage caps, evidentiary quality,
                and opposing counsel skill can each significantly alter actual
                outcomes — in either direction.
              </p>
              <p>
                Use our tools to educate yourself and establish a reasonable
                baseline. Then consult a qualified attorney before making any
                decision about your claim. Many personal injury attorneys offer free
                initial consultations.
              </p>
            </div>
          </section>

          {/* Tools grid */}
          <section aria-labelledby="tools-heading">
            <h2
              id="tools-heading"
              className="heading-gradient font-bold mb-6"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Our Free Calculators
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="glass-card flex flex-col gap-2 p-5 no-underline"
                >
                  <h3 className="text-sm font-bold" style={{ color: "#F1F5F9" }}>
                    {tool.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                    {tool.desc}
                  </p>
                  <span className="mt-auto text-xs font-semibold" style={{ color: "#60A5FA" }}>
                    Use calculator →
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </article>

        {/* AD_SLOT_BOTTOM */}
        <div
          id="AD_SLOT_BOTTOM"
          className="w-full flex justify-center py-3"
          style={{ backgroundColor: "rgba(13,21,38,0.6)", borderTop: "1px solid rgba(99,179,237,0.08)" }}
          aria-hidden="true"
        >
          {/* AdSense leaderboard 728×90 / responsive */}
        </div>

      </main>
    </>
  );
}