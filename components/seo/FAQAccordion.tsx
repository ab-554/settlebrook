// ─────────────────────────────────────────────────────────────────────────────
// components/seo/FAQAccordion.tsx
// FIX M7: Removed all itemScope/itemType/itemProp microdata attributes.
//         The JSON-LD FAQPage schema is already injected via <script> tags in
//         each page that uses this component. Having BOTH JSON-LD and microdata
//         creates duplicate FAQPage declarations — two competing schema formats
//         for the same content. Google's documentation explicitly recommends
//         choosing one format. JSON-LD wins: it's cleaner, easier to maintain,
//         and already present. Microdata removed here.
// Design-refresh: native <details> styled as calm paper cards (see .faq-* in
// globals.css). Answer HTML rendering is unchanged.
// 2026-09-25: optional `schema` prop. When set, the accordion emits the FAQPage
// JSON-LD for exactly the FAQs it renders, so the structured data always
// matches the visible questions (Google requires FAQ markup to reflect the
// page content). The state templates use it because each state's FAQs are
// inline JSX, not a shared data module. Default false — every other caller is
// unchanged and keeps emitting its own <script> at page level.
// ─────────────────────────────────────────────────────────────────────────────

import { buildFAQSchema, type FAQItem } from '@/lib/data/faqContent'

interface FAQAccordionProps {
  faqs: FAQItem[]
  openFirstByDefault?: boolean
  /** Emit the FAQPage JSON-LD for these FAQs alongside the accordion. */
  schema?: boolean
}

export function FAQAccordion({ faqs, openFirstByDefault = true, schema = false }: FAQAccordionProps) {
  if (!faqs.length) return null

  return (
    // FIX M7: itemScope and itemType removed — JSON-LD handles schema, not microdata
    <div className="flex flex-col gap-3">
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(faqs)) }} />
      )}
      {faqs.map((faq, index) => (
        <details
          key={faq.id}
          id={faq.id}
          open={openFirstByDefault && index === 0}
          className="faq-item group"
        >
          <summary className="faq-summary" style={{ listStyle: 'none' }}>
            {/* FIX M7: itemProp="name" removed from question span */}
            <span className="faq-question">
              {faq.question}
            </span>
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

          {/* FIX M7: itemScope, itemProp, itemType removed from answer div */}
          <div className="faq-divider">
            <div
              className="faq-answer"
              dangerouslySetInnerHTML={{
                __html: faq.answer
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br />'),
              }}
            />
          </div>
        </details>
      ))}
    </div>
  )
}

export default FAQAccordion
