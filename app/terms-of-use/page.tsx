// app/terms-of-use/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // FIX H6: brand suffix removed — template adds "| Settlebrook" automatically
  title: "Terms of Use",
  description:
    "SettleBrook terms of use. Our calculators provide estimates only — not legal advice. Read our full terms including disclaimer, acceptable use, and governing law.",
  alternates: { canonical: "/terms-of-use/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Use | Settlebrook",
    description:
      "Read SettleBrook's terms of use. Settlement calculators provide estimates only, not legal advice.",
    url: "/terms-of-use/",
    siteName: "Settlebrook",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Terms of Use — Settlebrook" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@settlebrook",
    title: "Terms of Use | Settlebrook",
    images: ["/og-image.png"],
  },
};

const LAST_UPDATED = "January 1, 2025";
const EFFECTIVE_DATE = "January 1, 2025";

export default function TermsOfUsePage() {
  return (
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
                Legal · Estimates Only
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Terms of Use
            </h1>

            {/* Subheading */}
            <p
              className="animate-fade-in-up-d2 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Please read these terms before using Settlebrook&rsquo;s free calculators.
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

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-14 flex flex-col gap-10">

        {/* Header */}
        <header>
          <p className="text-sm flex gap-5 mb-6" style={{ color: "#64748B" }}>
            <span>Effective: <time dateTime="2025-01-01">{EFFECTIVE_DATE}</time></span>
            <span>Last updated: <time dateTime="2025-01-01">{LAST_UPDATED}</time></span>
          </p>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the
            SettleBrook website located at{" "}
            <a href="/" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
              settlebrook.com
            </a>{" "}
            and all associated pages, tools, and content (collectively, the &ldquo;Site&rdquo;).
            By accessing or using the Site, you agree to be bound by these Terms.
            If you do not agree, do not use the Site.
          </p>
        </header>

        {/* Critical disclaimer callout */}
        <section
          aria-labelledby="no-legal-advice-heading"
          className="rounded-2xl p-6"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}
        >
          <h2 id="no-legal-advice-heading" className="text-lg font-bold mb-3"
            style={{ color: "#F87171" }}>
            1. Not Legal Advice — Estimates Only
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              <strong style={{ color: "#F1F5F9" }}>
                SettleBrook is not a law firm. We do not provide legal advice. Nothing
                on this Site — including calculator outputs, articles, guides, or any
                other content — constitutes legal advice, legal opinion, or a
                prediction of any legal outcome.
              </strong>
            </p>
            <p>
              All calculator results are estimates based on general industry formulas
              and publicly documented benchmarks. They are provided for educational
              and informational purposes only. No output from any SettleBrook tool
              should be used as the sole basis for any legal, financial, or
              settlement decision.
            </p>
            <p>
              Actual settlement values depend on facts, evidence, applicable law,
              insurance policy limits, comparative fault determinations, jurisdiction,
              and dozens of other variables that no online calculator can fully
              evaluate. Results may be significantly higher or lower than any actual
              settlement you receive.
            </p>
            <p>
              <strong style={{ color: "#F1F5F9" }}>
                You should consult a licensed personal injury attorney in your state
                before making any decision about your claim.
              </strong>{" "}
              Many personal injury attorneys offer free initial consultations.
            </p>
          </div>
        </section>

        {/* 2. Acceptance */}
        <section aria-labelledby="acceptance-heading">
          <h2 id="acceptance-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            2. Acceptance of Terms
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              By using this Site, you represent that you are at least 18 years of age
              and have the legal capacity to enter into this agreement. If you are
              accessing the Site on behalf of an organization, you represent that you
              have authority to bind that organization to these Terms.
            </p>
            <p>
              These Terms constitute the entire agreement between you and SettleBrook
              with respect to your use of the Site and supersede all prior or
              contemporaneous agreements. We reserve the right to modify these Terms
              at any time. Material changes will be reflected in an updated &ldquo;Last
              Updated&rdquo; date. Continued use of the Site after changes constitutes
              acceptance.
            </p>
          </div>
        </section>

        {/* AD_SLOT_MID */}
        <div id="AD_SLOT_MID" className="w-full flex justify-center py-4" aria-hidden="true">
          {/* AdSense in-content responsive */}
        </div>

        {/* 3. No Liability */}
        <section aria-labelledby="liability-heading">
          <h2 id="liability-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            3. Limitation of Liability and Disclaimers
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              THE SITE AND ALL CONTENT, TOOLS, AND CALCULATORS ARE PROVIDED &ldquo;AS IS&rdquo;
              AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SETTLEBROOK AND
              ITS OPERATORS, EMPLOYEES, CONTRIBUTORS, AND AFFILIATES SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR RELIANCE ON THE SITE,
              INCLUDING BUT NOT LIMITED TO: FINANCIAL LOSS, LEGAL FEES, LOST
              SETTLEMENT VALUE, OR ANY OTHER CLAIM ARISING FROM CALCULATOR OUTPUTS
              OR SITE CONTENT.
            </p>
            <p>
              In jurisdictions that do not allow the exclusion of certain warranties
              or limitation of certain liabilities, our liability is limited to the
              maximum extent permitted by law. Some states do not allow limitations
              on implied warranties or exclusion of incidental or consequential
              damages, so some of the above may not apply to you.
            </p>
            <p>
              SettleBrook does not guarantee the accuracy, completeness, or
              timeliness of any content on the Site. Laws, regulations, and settlement
              practices change. Content may be out of date. You use the Site at your
              own risk.
            </p>
          </div>
        </section>

        {/* 4. Intellectual Property */}
        <section aria-labelledby="ip-heading">
          <h2 id="ip-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            4. Intellectual Property
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              All content on the Site — including text, calculator logic, code,
              design elements, graphics, and the &ldquo;SettleBrook&rdquo; name and any associated
              marks — is owned by or licensed to SettleBrook and is protected by U.S.
              copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable license to
              access and use the Site for personal, non-commercial informational
              purposes only. You may not:
            </p>
            <ul className="flex flex-col gap-2 pl-4 text-sm" style={{ color: "#94A3B8", listStyleType: "disc" }}>
              <li>Reproduce, copy, or distribute Site content for commercial purposes without written permission</li>
              <li>Reverse-engineer, decompile, or extract the calculator logic for use in competing products</li>
              <li>Scrape, crawl, or systematically harvest Site content through automated means</li>
              <li>Frame or mirror the Site on another domain without written permission</li>
              <li>Remove or alter any copyright, trademark, or proprietary notices</li>
            </ul>
            <p>
              Personal, non-commercial sharing of our calculator results (e.g., sharing
              a link, referencing a tool in a blog post with attribution) is permitted
              and encouraged.
            </p>
          </div>
        </section>

        {/* 5. Acceptable Use */}
        <section aria-labelledby="acceptable-use-heading">
          <h2 id="acceptable-use-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            5. Acceptable Use
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>You agree not to use the Site to:</p>
            <ul className="flex flex-col gap-2 pl-4 text-sm" style={{ color: "#94A3B8", listStyleType: "disc" }}>
              <li>Violate any applicable federal, state, or local law or regulation</li>
              <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Introduce viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure</li>
              <li>Use the Site in any manner that could damage, disable, overburden, or impair it</li>
              <li>Collect or harvest any information from the Site through automated means</li>
              <li>Attempt to manipulate search engine rankings using our content</li>
            </ul>
            <p>
              We reserve the right to terminate or restrict access to the Site for any
              user who violates these acceptable use standards, at our sole discretion
              and without notice.
            </p>
          </div>
        </section>

        {/* 6. Third-Party Links */}
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            6. Third-Party Links and Advertising
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              The Site may contain links to third-party websites and may display
              third-party advertisements through Google AdSense. These third-party
              sites and advertisers operate under their own terms and privacy policies.
              SettleBrook does not endorse, control, or assume responsibility for
              any third-party content, products, or services. Your interactions with
              any third party are solely between you and that third party.
            </p>
            <p>
              Future affiliate relationships with legal service providers may exist
              on this Site. Where material affiliate relationships exist, they will
              be disclosed in compliance with FTC guidelines.
            </p>
          </div>
        </section>

        {/* 7. Governing Law */}
        <section aria-labelledby="governing-law-heading">
          <h2 id="governing-law-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            7. Governing Law
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              These Terms shall be governed by and construed in accordance with the
              laws of the State of Delaware, United States, without regard to its
              conflict of law provisions. You consent to the exclusive jurisdiction
              of the state and federal courts located in Delaware for any disputes
              arising from these Terms or your use of the Site.
            </p>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid
              under applicable law, that provision shall be limited or eliminated to
              the minimum extent necessary so that these Terms shall otherwise remain
              in full force and effect.
            </p>
          </div>
        </section>

        {/* 8. Dispute Resolution */}
        <section aria-labelledby="dispute-heading">
          <h2 id="dispute-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            8. Dispute Resolution
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              Before initiating any formal legal proceeding, we encourage you to
              contact us at{" "}
              <a href="mailto:legal@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                legal@settlebrook.com
              </a>{" "}
              to attempt informal resolution of any dispute. Most issues can be
              resolved quickly through direct communication.
            </p>
            <p>
              For disputes that cannot be resolved informally, you agree that any
              claim or controversy arising from these Terms or your use of the Site
              shall be resolved by binding individual arbitration under the American
              Arbitration Association&apos;s Consumer Arbitration Rules, rather than in
              court. You waive any right to a jury trial and agree not to participate
              in class action litigation or class-wide arbitration.
            </p>
            <p>
              Notwithstanding the arbitration agreement above, either party may
              seek injunctive or other equitable relief in a court of competent
              jurisdiction in Delaware to prevent actual or threatened infringement,
              misappropriation, or violation of intellectual property rights.
            </p>
          </div>
        </section>

        {/* 9. Contact */}
        <section aria-labelledby="terms-contact-heading">
          <h2 id="terms-contact-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            9. Contact Information
          </h2>
          <div className="flex flex-col gap-3 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>Questions about these Terms should be directed to:</p>
            <div className="rounded-xl p-4 text-sm flex flex-col gap-1"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,179,237,0.15)" }}>
              <p className="font-semibold" style={{ color: "#F1F5F9" }}>SettleBrook</p>
              <p>Email:{" "}
                <a href="mailto:legal@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                  legal@settlebrook.com
                </a>
              </p>
              <p>Website:{" "}
                <a href="/contact" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                  settlebrook.com/contact
                </a>
              </p>
            </div>
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
  );
}