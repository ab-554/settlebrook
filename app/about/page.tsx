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

          {/* What Settlebrook is */}
          <section aria-labelledby="what-heading">
            <h2
              id="what-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              What Settlebrook Is
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Settlebrook is a free set of settlement estimate tools for people with
                injury claims in the United States. Three calculators cover the most
                common claim types: pain and suffering, car accident settlements, and
                workers compensation. Each one runs the same arithmetic that adjusters
                and plaintiff attorneys use, in your browser, in about two minutes.
                There is no signup, no paywall, and no data collection — your figures
                are never transmitted anywhere.
              </p>
            </div>
          </section>

          {/* Why it exists */}
          <section aria-labelledby="why-heading">
            <h2
              id="why-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              Why It Exists
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Search for what your claim is worth and most of what you find is law
                firm marketing. Those pages rank because someone paid to rank them,
                and the calculator at the bottom is usually a form that collects your
                phone number to sell as a lead. You are often injured, stressed, and
                already being pressured by an adjuster when you go looking. Settlebrook
                gives you the formula and the state rules directly instead, and asks
                for nothing in return.
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

          {/* Accuracy */}
          <section aria-labelledby="accuracy-heading">
            <h2
              id="accuracy-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              How We Keep It Accurate
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Statutory figures — benefit caps, damage caps, filing deadlines, fault
                rules — are checked against state statutes, state workers compensation
                agencies, and published decisions rather than copied from other
                websites. State pages carry a visible last-reviewed date and are
                re-checked on a rolling basis as legislatures change the numbers. The
                formulas, the sources, and the review schedule are written out in full
                in{" "}
                <Link href="/methodology/" className="underline transition-colors" style={{ color: "#60A5FA" }}>
                  our methodology
                </Link>
                .
              </p>
            </div>
          </section>

          {/* What it is not */}
          <section aria-labelledby="not-heading">
            <h2
              id="not-heading"
              className="heading-gradient font-bold mb-4"
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              What Settlebrook Is Not
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              <p>
                Settlebrook is not a law firm and does not give legal advice. We do not
                evaluate individual cases, and we do not sell leads or refer users to
                attorneys for a fee. What the calculators produce is an informed
                estimate, not a prediction — real settlements turn on evidence, policy
                limits, venue, and negotiation. If you have an active claim, talk to a
                licensed attorney in your state.
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