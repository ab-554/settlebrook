// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // FIX H3: title trimmed — template adds " | Settlebrook" (13 chars)
  title: "About Settlebrook — Legal Settlement Calculators",
  description:
    "Settlebrook builds free, research-backed settlement calculators for pain and suffering, car accidents, and workers' comp claims. Learn how our tools work and why we built them.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About Settlebrook | Free Legal Settlement Calculators",
    description:
      "Free settlement estimation tools built for everyday Americans navigating personal injury and workplace injury claims.",
    url: "/about/",
    siteName: "Settlebrook",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Settlebrook – Settlement Calculator Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Settlebrook | Free Legal Settlement Calculators",
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
      <main className="min-h-screen">

        {/* ── HEADER BAND ── */}
        <header className="page-band">
          <div className="container-page py-8 sm:py-12">
            <p className="eyebrow mb-2">Trusted · Free · No Signup</p>
            <h1>About Settlebrook — Free Legal Settlement Calculators</h1>
            <p className="lede mt-3 max-w-2xl">
              Free legal settlement calculators built for everyday Americans — not lawyers.
            </p>
          </div>
        </header>

        {/* Main content */}
        <article className="container-page py-10 sm:py-14 flex flex-col gap-10">

          {/* What Settlebrook is */}
          <section aria-labelledby="what-heading">
            <h2
              id="what-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              What Settlebrook Is
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Settlebrook is a free set of settlement estimate tools for people with
                injury claims in the United States. Three calculators cover the most
                common claim types: pain and suffering, car accident settlements, and
                workers compensation. Each one runs the same arithmetic that adjusters
                and plaintiff attorneys use, in your browser, in about two minutes.
                There is no signup and no paywall. Your calculator inputs are never
                transmitted anywhere — all figures stay in your browser. The site
                itself runs on Google Analytics and Google AdSense, and our{' '}
                <Link href="/contact/" className="text-link">
                  contact form
                </Link>{' '}
                is processed by Formspree; see our{' '}
                <Link href="/privacy-policy/" className="text-link">
                  privacy policy
                </Link>{' '}
                for details.
              </p>
            </div>
          </section>

          {/* Why it exists */}
          <section aria-labelledby="why-heading">
            <h2
              id="why-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              Why It Exists
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
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

          {/* Accuracy */}
          <section aria-labelledby="accuracy-heading">
            <h2
              id="accuracy-heading"
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              How We Keep It Accurate
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Statutory figures — benefit caps, damage caps, filing deadlines, fault
                rules — are checked against state statutes, state workers compensation
                agencies, and published decisions rather than copied from other
                websites. State pages carry a visible last-reviewed date and are
                re-checked on a rolling basis as legislatures change the numbers. The
                formulas, the sources, and the review schedule are written out in full
                in{" "}
                <Link href="/methodology/" className="text-link">
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
              className="heading-serif mb-3"
              style={{ fontSize: 26 }}
            >
              What Settlebrook Is Not
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--ink-2)' }}>
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
              background: 'var(--amber-tint)',
              border: '1px solid var(--amber-line)',
            }}
          >
            <h2
              id="disclaimer-heading"
              className="text-lg font-bold mb-3"
              style={{ color: 'var(--amber)' }}
            >
              Important Accuracy Disclaimer
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <p>
                Settlebrook calculators produce estimates based on general industry
                formulas and publicly documented settlement benchmarks. They are
                educational tools only. No output from any Settlebrook tool should
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
              className="heading-serif mb-4"
              style={{ fontSize: 26 }}
            >
              Our Free Calculators
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="card flex flex-col gap-2 p-5 no-underline"
                >
                  <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                    {tool.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                    {tool.desc}
                  </p>
                  <span className="mt-auto text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    Use calculator →
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </article>

      </main>
    </>
  );
}