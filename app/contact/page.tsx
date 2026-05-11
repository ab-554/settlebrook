// app/contact/page.tsx
// Parent stays a Server Component (better for SEO/metadata).
// ContactForm is isolated as a 'use client' child component.

import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  // FIX H4: title trimmed — template adds " | Settlebrook" (13 chars)
  title: "Contact Us — Settlement Calculator Questions",
  description:
    "Contact the SettleBrook team with questions about our pain and suffering, car accident, or workers' comp calculators. We respond within 2 business days.",
  alternates: { canonical: "https://settlebrook.com/contact/" },
  openGraph: {
    title: "Contact SettleBrook",
    description:
      "Have a question about our settlement calculators? Reach the SettleBrook team.",
    url: "https://settlebrook.com/contact/",
    siteName: "SettleBrook",
    type: "website",
    images: [{ url: "https://settlebrook.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SettleBrook",
    images: ["https://settlebrook.com/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact SettleBrook",
  // FIX M3: trailing slash added to url
  url: "https://settlebrook.com/contact/",
  description: "Contact form and FAQ for SettleBrook settlement calculators.",
  mainEntity: {
    "@type": "Organization",
    name: "SettleBrook",
    email: "contact.ab554@gmail.com",
    url: "https://settlebrook.com",
  },
};

const FAQS = [
  {
    q: "Are your settlement calculators free to use?",
    a: "Yes. All SettleBrook calculators are completely free. We support the site through non-intrusive display advertising. We will never charge for calculator access or gate results behind an email signup.",
  },
  {
    q: "Are the calculator results legally binding?",
    a: "No. Calculator results are estimates based on general industry formulas. They are educational tools only and carry no legal weight. Actual settlement values depend on your specific facts, evidence, jurisdiction, available insurance coverage, and other factors. Always consult a licensed attorney before making settlement decisions.",
  },
  {
    q: "Why does the multiplier range vary so much (1.5× to 5×)?",
    a: "The multiplier reflects injury severity. Minor soft-tissue injuries with full recovery typically fall in the 1.5–2× range. Moderate injuries requiring surgery or extended recovery land around 3×. Severe, permanent, or catastrophic injuries can justify 4–5×. The appropriate multiplier requires judgment from an attorney familiar with your jurisdiction's case history.",
  },
  {
    q: "Do your calculators work for all 50 states?",
    a: "Our general calculators work as a starting point for all U.S. states. We also publish state-specific pages for high-volume states (California, Texas, Florida, New York) that account for local laws like non-economic damage caps, comparative fault rules, and state-specific workers' comp fee schedules.",
  },
  {
    q: "I found an error in a calculator. How do I report it?",
    a: "Please use the contact form on this page with the subject 'Calculator Error' and describe the specific issue including the inputs you used and the result you believe is incorrect. We take accuracy seriously and will investigate within 2 business days.",
  },
  {
    q: "Can I share or embed your calculators on my website?",
    a: "You may link to any SettleBrook page. Embedding via iframe or reproducing calculator logic in a competing tool is not permitted without written license. Contact us at contact.ab554@gmail.com to discuss licensing arrangements.",
  },
  {
    q: "Do you recommend specific attorneys or legal services?",
    a: "Not at this time. We may introduce curated attorney referrals in the future with full disclosure of any affiliate relationships. Currently we suggest using your state bar association's attorney referral service or AVVO to find qualified personal injury attorneys near you.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
                Response within 48 hours
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Contact Settlebrook — Settlement Calculator Support
            </h1>

            {/* Subheading */}
            <p
              className="animate-fade-in-up-d2 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Have a question about our calculators? We&rsquo;re here to help.
            </p>

            {/* CTA */}
            <div className="animate-fade-in-up-d3">
              <a
                href="#contact-form"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                style={{ scrollBehavior: 'smooth' }}
              >
                Send a Message →
              </a>
            </div>
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

        {/* Two-column layout: form + info */}
        <section id="contact-form" className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid md:grid-cols-5 gap-10">

            {/* Contact Form — 3 of 5 columns */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-bold mb-5" style={{ color: "#F1F5F9" }}>
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info — 2 of 5 columns */}
            <aside className="md:col-span-2 flex flex-col gap-5">
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,179,237,0.15)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <h2 className="text-base font-bold mb-4" style={{ color: "#F1F5F9" }}>
                  Get In Touch
                </h2>
                <div className="flex flex-col gap-4 text-sm" style={{ color: "#94A3B8" }}>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>
                      Email
                    </p>
                    <a href="mailto:contact.ab554@gmail.com" className="hover:opacity-80" style={{ color: "#60A5FA" }}>
                      contact.ab554@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#64748B" }}>
                      Response Time
                    </p>
                    <p>Within 48 hours</p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(251,191,36,0.07)",
                  border: "1px solid rgba(251,191,36,0.25)",
                }}
              >
                <h2 className="text-sm font-bold mb-2" style={{ color: "#FBBF24" }}>
                  Not Legal Advice
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  We cannot answer questions about your specific legal situation,
                  advise on whether to accept a settlement, or provide attorney
                  referrals. For legal guidance, please consult a licensed personal
                  injury attorney in your state.
                </p>
              </div>
            </aside>

          </div>
        </section>

        {/* AD_SLOT_MID */}
        <div
          id="AD_SLOT_MID"
          className="w-full flex justify-center py-4"
          style={{ backgroundColor: "rgba(13,21,38,0.4)" }}
          aria-hidden="true"
        >
          {/* AdSense in-content responsive */}
        </div>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="max-w-7xl mx-auto px-6 sm:px-8 py-14"
        >
          <h2
            id="faq-heading"
            className="heading-gradient font-bold mb-8"
            style={{ fontSize: 28, fontWeight: 700 }}
          >
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-3 max-w-3xl">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="faq-item group"
              >
                <summary className="faq-summary">
                  <h3 className="faq-question">{faq.q}</h3>
                  <svg
                    className="faq-icon w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="faq-divider">
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

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