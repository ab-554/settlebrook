// app/contact/page.tsx
// Parent stays a Server Component (better for SEO/metadata).
// ContactForm is isolated as a 'use client' child component.

import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  // FIX H4: title trimmed — template adds " | Settlebrook" (13 chars)
  title: "Contact Us — Settlement Calculator Questions",
  description:
    "Contact the Settlebrook team with questions about our pain and suffering, car accident, or workers' comp calculators. We respond within 2 business days.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Contact Settlebrook",
    description:
      "Have a question about our settlement calculators? Reach the Settlebrook team.",
    url: "/contact/",
    siteName: "Settlebrook",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Settlebrook",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Settlebrook",
  // FIX M3: trailing slash added to url
  url: "https://www.settlebrook.com/contact/",
  description: "Contact form and FAQ for Settlebrook settlement calculators.",
  mainEntity: {
    "@type": "Organization",
    name: "Settlebrook",
    email: "contact@settlebrook.com",
    url: "https://www.settlebrook.com",
  },
};

const FAQS = [
  {
    q: "Are your settlement calculators free to use?",
    a: "Yes. All Settlebrook calculators are completely free. We support the site through non-intrusive display advertising. We will never charge for calculator access or gate results behind an email signup.",
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
    q: "Do your calculators work in every state?",
    a: "Yes — the general calculators work for injuries anywhere in the US, using formulas that aren't state-specific. We also publish dedicated state guide pages for the states listed on each calculator, which account for local laws like non-economic damage caps, comparative fault rules, and state-specific workers' comp fee schedules.",
  },
  {
    q: "I found an error in a calculator. How do I report it?",
    a: "Please use the contact form on this page with the subject 'Calculator Error' and describe the specific issue including the inputs you used and the result you believe is incorrect. We take accuracy seriously and will investigate within 2 business days.",
  },
  {
    q: "Can I share or embed your calculators on my website?",
    a: "You may link to any Settlebrook page. Embedding via iframe or reproducing calculator logic in a competing tool is not permitted without written license. Contact us at contact@settlebrook.com to discuss licensing arrangements.",
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

      <main className="min-h-screen">

        {/* ── HEADER BAND ── */}
        <header className="page-band">
          <div className="container-page py-8 sm:py-12">
            <p className="eyebrow mb-2">Response within 48 hours</p>
            <h1>Contact Settlebrook — Settlement Calculator Support</h1>
            <p className="lede mt-3 max-w-2xl">
              Have a question about our calculators? We&rsquo;re here to help.
            </p>
            <a href="#contact-form" className="btn-primary mt-5">
              Send a Message →
            </a>
          </div>
        </header>

        {/* Two-column layout: form + info */}
        <section id="contact-form" className="container-page py-10 sm:py-12">
          <div className="grid md:grid-cols-5 gap-10">

            {/* Contact Form — 3 of 5 columns */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--ink)' }}>
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info — 2 of 5 columns */}
            <aside className="md:col-span-2 flex flex-col gap-5">
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'var(--surface)',
                  border: "1px solid var(--line)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--ink)' }}>
                  Get In Touch
                </h2>
                <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--ink-2)' }}>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ink-3)' }}>
                      Email
                    </p>
                    <a href="mailto:contact@settlebrook.com" className="hover:opacity-80" style={{ color: 'var(--accent)' }}>
                      contact@settlebrook.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ink-3)' }}>
                      Response Time
                    </p>
                    <p>Within 48 hours</p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'var(--amber-tint)',
                  border: '1px solid var(--amber-line)',
                }}
              >
                <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--amber)' }}>
                  Not Legal Advice
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                  We cannot answer questions about your specific legal situation,
                  advise on whether to accept a settlement, or provide attorney
                  referrals. For legal guidance, please consult a licensed personal
                  injury attorney in your state.
                </p>
              </div>
            </aside>

          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="container-page py-10 sm:py-14"
        >
          <h2
            id="faq-heading"
            className="heading-serif mb-6"
            style={{ fontSize: 28 }}
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

      </main>
    </>
  );
}