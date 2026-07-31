// app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // FIX H5: brand suffix removed — template adds "| Settlebrook" automatically
  title: "Privacy Policy",
  description:
    "SettleBrook's privacy policy. We do not collect personal data. Learn how Google AdSense and Analytics cookies work on our site and how to exercise your GDPR and CCPA rights.",
  alternates: { canonical: "/privacy-policy/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Settlebrook",
    description:
      "SettleBrook does not collect or store personal information. Read our full GDPR and CCPA compliant privacy policy.",
    url: "/privacy-policy/",
    siteName: "Settlebrook",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Privacy Policy — Settlebrook" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@settlebrook",
    title: "Privacy Policy | Settlebrook",
    images: ["/og-image.png"],
  },
};

const LAST_UPDATED = "January 1, 2025";

export default function PrivacyPolicyPage() {
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
                Last Updated · 2025
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Privacy Policy
            </h1>

            {/* Subheading */}
            <p
              className="animate-fade-in-up-d2 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              We don&rsquo;t collect, sell, or store your personal data. Ever.
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
          <p className="text-sm mb-4" style={{ color: "#64748B" }}>
            Last updated: <time dateTime="2025-01-01">{LAST_UPDATED}</time>
          </p>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            This Privacy Policy describes how SettleBrook (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
            operated at{" "}
            <a href="/" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
              settlebrook.com
            </a>
            , handles information when you use our website and free settlement
            calculators. We are committed to being transparent about what data exists,
            what we do not collect, and what rights you have.
          </p>
        </header>

        {/* 1. Information We Do Not Collect */}
        <section aria-labelledby="no-collect-heading">
          <h2 id="no-collect-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            1. Information We Do Not Collect
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              SettleBrook does not have user accounts. We do not require registration,
              login, or any form of identification to use our calculators. We do not
              collect, store, transmit, or sell:
            </p>
            <ul className="flex flex-col gap-2 pl-4 text-sm" style={{ color: "#94A3B8", listStyleType: "disc" }}>
              <li>Your name, email address, phone number, or mailing address</li>
              <li>Social Security numbers, insurance policy numbers, or claim numbers</li>
              <li>Any dollar amounts, medical details, or injury information you enter into our calculators</li>
              <li>Payment information of any kind</li>
              <li>Government-issued identification numbers</li>
            </ul>
            <p>
              All calculator inputs are processed entirely in your browser. No form
              values leave your device and no server receives your calculation data.
              When you close the page or browser tab, all entered data is gone.
            </p>
          </div>
        </section>

        {/* 2. Information Automatically Collected */}
        <section aria-labelledby="auto-collect-heading">
          <h2 id="auto-collect-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            2. Information Automatically Collected
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              Like virtually all websites, SettleBrook&apos;s hosting infrastructure
              (Vercel) automatically logs standard server-level data when your browser
              requests a page. This includes:
            </p>
            <ul className="flex flex-col gap-2 pl-4 text-sm" style={{ color: "#94A3B8", listStyleType: "disc" }}>
              <li>Your IP address (used for routing; not stored by us)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring URL</li>
              <li>Pages visited and timestamps</li>
            </ul>
            <p>
              Vercel&apos;s infrastructure logs are retained according to{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
                style={{ color: "#60A5FA" }}
              >
                Vercel&apos;s own privacy policy
              </a>
              . We do not have independent access to raw server logs and do not use
              them for identification or marketing.
            </p>
          </div>
        </section>

        {/* AD_SLOT_MID */}
        <div id="AD_SLOT_MID" className="w-full flex justify-center py-4" aria-hidden="true">
          {/* AdSense in-content responsive */}
        </div>

        {/* 3. Cookies */}
        <section aria-labelledby="cookies-heading">
          <h2 id="cookies-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            3. Cookies
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              SettleBrook itself does not set first-party cookies. However, third-party
              services we use — specifically Google AdSense and Google Analytics —
              do set cookies in your browser. These cookies are subject to Google&apos;s
              privacy policies, not ours.
            </p>

            <h3 className="text-base font-semibold mt-2" style={{ color: "#F1F5F9" }}>
              Google AdSense Cookies
            </h3>
            <p>
              We display advertisements through Google AdSense to support the free
              operation of this site. Google uses cookies to serve ads based on your
              prior visits to this website and other sites. Google&apos;s use of advertising
              cookies enables it and its partners to serve ads to you based on your
              visit to our site and/or other sites on the Internet.
            </p>
            <p>
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
                style={{ color: "#60A5FA" }}
              >
                Google Ad Settings
              </a>
              . You may also opt out via{" "}
              <a
                href="http://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
                style={{ color: "#60A5FA" }}
              >
                aboutads.info
              </a>
              .
            </p>

            <h3 className="text-base font-semibold mt-2" style={{ color: "#F1F5F9" }}>
              Google Analytics Cookies
            </h3>
            <p>
              We use Google Analytics to understand aggregate usage patterns —
              which pages are visited, how long people spend on the site, and which
              calculators are most used. This data is anonymous and aggregated; it
              cannot be used to identify individual visitors.
            </p>
            <p>
              Google Analytics uses cookies including{" "}
              <code className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.08)", color: "#E2E8F0" }}>_ga</code>,{" "}
              <code className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.08)", color: "#E2E8F0" }}>_gid</code>, and{" "}
              <code className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.08)", color: "#E2E8F0" }}>_gat</code>. You
              can opt out of Google Analytics tracking by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
                style={{ color: "#60A5FA" }}
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </div>
        </section>

        {/* 4. Third-Party Services */}
        <section aria-labelledby="third-party-heading">
          <h2 id="third-party-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            4. Third-Party Services
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>The following third-party services operate on SettleBrook:</p>
            <div className="overflow-x-auto rounded-xl"
              style={{ border: "1px solid rgba(99,179,237,0.15)" }}>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#64748B", borderBottom: "1px solid rgba(99,179,237,0.12)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Google AdSense", purpose: "Display advertising", url: "https://policies.google.com/privacy" },
                    { name: "Google Analytics", purpose: "Aggregate traffic analysis", url: "https://policies.google.com/privacy" },
                    { name: "Vercel", purpose: "Website hosting and delivery", url: "https://vercel.com/legal/privacy-policy" },
                  ].map((s, i) => (
                    <tr key={s.name} style={{
                      color: "#94A3B8",
                      borderTop: i > 0 ? "1px solid rgba(99,179,237,0.08)" : undefined,
                    }}>
                      <td className="py-3 px-4 font-medium" style={{ color: "#E2E8F0" }}>{s.name}</td>
                      <td className="py-3 px-4">{s.purpose}</td>
                      <td className="py-3 px-4">
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs hover:opacity-80" style={{ color: "#60A5FA" }}>
                          View Policy ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              We are not responsible for the privacy practices of these services. We
              encourage you to review their respective policies before using our site
              if you have concerns about third-party data handling.
            </p>
          </div>
        </section>

        {/* 5. GDPR Rights */}
        <section aria-labelledby="gdpr-heading">
          <h2 id="gdpr-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            5. Your GDPR Rights (EU / EEA Visitors)
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              Although SettleBrook is a U.S.-focused website, we acknowledge the
              rights established under the General Data Protection Regulation (GDPR)
              for visitors from the European Union and European Economic Area. Because
              we do not collect or process personal data ourselves, most GDPR rights
              are satisfied by our architecture. However, to the extent third-party
              services (Google) process data about you through our site, you retain
              the following rights:
            </p>
            <ul className="flex flex-col gap-2 pl-4 text-sm" style={{ color: "#94A3B8", listStyleType: "disc" }}>
              <li><strong style={{ color: "#E2E8F0" }}>Right of Access</strong> — Request information about what data exists about you</li>
              <li><strong style={{ color: "#E2E8F0" }}>Right to Rectification</strong> — Request correction of inaccurate data</li>
              <li><strong style={{ color: "#E2E8F0" }}>Right to Erasure</strong> — Request deletion of your personal data</li>
              <li><strong style={{ color: "#E2E8F0" }}>Right to Restrict Processing</strong> — Request that processing be limited</li>
              <li><strong style={{ color: "#E2E8F0" }}>Right to Data Portability</strong> — Receive your data in a structured format</li>
              <li><strong style={{ color: "#E2E8F0" }}>Right to Object</strong> — Object to processing based on legitimate interests</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                privacy@settlebrook.com
              </a>
              . For rights related to Google&apos;s data processing, contact Google directly
              through their privacy controls.
            </p>
          </div>
        </section>

        {/* 6. CCPA Rights */}
        <section aria-labelledby="ccpa-heading">
          <h2 id="ccpa-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            6. Your CCPA Rights (California Residents)
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>
              Under the California Consumer Privacy Act (CCPA) and its amendment the
              California Privacy Rights Act (CPRA), California residents have specific
              rights regarding their personal information. We disclose the following
              in compliance with those requirements:
            </p>
            <p>
              <strong style={{ color: "#F1F5F9" }}>We do not sell personal information.</strong>{" "}
              SettleBrook has not sold, and does not sell, any personal information
              belonging to California residents. No &ldquo;Do Not Sell My Personal Information&rdquo;
              opt-out link is required because we have no personal data to sell.
            </p>
            <p>
              California residents have the right to: (a) know what personal
              information is collected, used, shared, or sold; (b) delete personal
              information held by businesses; (c) opt-out of the sale of personal
              information; and (d) non-discrimination for exercising CCPA rights.
              Because we collect no personal data, rights (a) through (c) are largely
              moot, but we will respond to any CCPA request within 45 days.
            </p>
            <p>
              To submit a CCPA request, email{" "}
              <a href="mailto:privacy@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                privacy@settlebrook.com
              </a>{" "}
              with &ldquo;CCPA Request&rdquo; in the subject line.
            </p>
          </div>
        </section>

        {/* 7. Children */}
        <section aria-labelledby="children-heading">
          <h2 id="children-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            7. Children&apos;s Privacy
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            SettleBrook is not directed at children under the age of 13. We do not
            knowingly collect any information from children. Our content is intended
            for adults researching personal injury or workplace injury claims. If you
            believe a child has used our site in a way that raised privacy concerns,
            please contact us at{" "}
            <a href="mailto:privacy@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
              privacy@settlebrook.com
            </a>
            .
          </p>
        </section>

        {/* 8. Changes */}
        <section aria-labelledby="changes-heading">
          <h2 id="changes-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            8. Changes to This Policy
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            We may update this Privacy Policy to reflect changes in our practices or
            applicable law. The &ldquo;Last Updated&rdquo; date at the top of this page will
            reflect any revisions. Continued use of SettleBrook after any modification
            constitutes your acceptance of the updated policy. We encourage periodic
            review of this page.
          </p>
        </section>

        {/* 9. Contact */}
        <section aria-labelledby="privacy-contact-heading">
          <h2 id="privacy-contact-heading" className="heading-gradient font-bold mb-4"
            style={{ fontSize: 22, fontWeight: 700 }}>
            9. Contact Us
          </h2>
          <div className="flex flex-col gap-3 text-base leading-relaxed" style={{ color: "#94A3B8" }}>
            <p>For any privacy-related questions, requests, or concerns, contact us at:</p>
            <div className="rounded-xl p-4 text-sm flex flex-col gap-1"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,179,237,0.15)" }}>
              <p className="font-semibold" style={{ color: "#F1F5F9" }}>SettleBrook</p>
              <p>Email:{" "}
                <a href="mailto:privacy@settlebrook.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                  privacy@settlebrook.com
                </a>
              </p>
              <p>Website:{" "}
                <a href="/contact" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                  settlebrook.com/contact
                </a>
              </p>
            </div>
            <p>We respond to all privacy inquiries within 30 days.</p>
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