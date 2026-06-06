// ─────────────────────────────────────────────────────────────────────────────
// lib/data/workersCompFaqs.ts
// FAQ content for workers comp settlement calculator.
// ─────────────────────────────────────────────────────────────────────────────

import type { FAQItem } from './faqContent'

export const WORKERS_COMP_FAQS: FAQItem[] = [
  {
    id: 'how-calculated',
    question: 'How is a workers comp settlement calculated?',
    answer:
      'Unlike personal injury cases, workers compensation settlements do not include pain and suffering. Instead, they are calculated using a strict formula based on your average weekly wage (AWW), your state\'s benefit rate (typically 66.67%), and the number of benefit weeks assigned to your specific injury. For permanent partial disability (PPD), the formula is: AWW × benefit rate × impairment weeks × (impairment rating % / 100). The total weekly benefit is also subject to your state\'s weekly cap.',
    schemaAnswer:
      'Workers comp settlements are calculated using a formula: Average Weekly Wage (AWW) × benefit rate × impairment weeks × impairment percentage. It is subject to state weekly caps and does not include pain and suffering.',
  },
  {
    id: 'impairment-rating',
    question: 'What is an impairment rating and how does it affect my settlement?',
    answer:
      'An impairment rating is a percentage between 0% and 100% assigned by a treating physician or an independent medical examiner once you reach Maximum Medical Improvement (MMI). This rating represents the permanent loss of function in your injured body part or body as a whole. A higher impairment rating directly increases your settlement value by multiplying the maximum scheduled weeks allowed for that body part under state law.',
    schemaAnswer:
      'An impairment rating is a percentage (0-100%) assigned by a physician representing permanent loss of function. A higher impairment rating increases your settlement by multiplying the maximum scheduled weeks for that body part.',
  },
  {
    id: 'get-attorney',
    question: 'Should I get an attorney for my workers comp claim?',
    answer:
      'While you are not required to hire an attorney, data from the National Council on Compensation Insurance (NCCI) shows that represented workers receive higher settlements on average — often yielding a 25% average uplift in payout even after accounting for attorney fees. Workers comp attorneys can help negotiate lump-sum amounts, dispute low impairment ratings, and ensure medical treatment is fully covered.',
    schemaAnswer:
      'Represented workers receive higher settlements on average, with an average uplift of 25% according to NCCI data. Attorneys help dispute low impairment ratings and negotiate lump-sum settlements.',
  },
  {
    id: 'ttd-ppd-ptd-difference',
    question: 'What is the difference between TTD, PPD, and PTD benefits?',
    answer:
      'Temporary Total Disability (TTD) pays weekly wage replacement (usually 66.67% of AWW) while you are completely unable to work during your active recovery. Permanent Partial Disability (PPD) compensates you for permanent, partial impairment of a body part (like a finger or arm) after reaching maximum recovery. Permanent Total Disability (PTD) provides ongoing or lump-sum benefits if you are permanently and completely unable to perform any gainful employment.',
    schemaAnswer:
      'TTD provides temporary wage replacement during active recovery. PPD compensates for permanent, partial loss of function in a body part after recovery. PTD provides lifetime benefits if you cannot return to any work.',
  },
  {
    id: 'calculator-accuracy',
    question: 'How accurate is this workers comp settlement calculator?',
    answer:
      'This calculator provides an estimate of your potential settlement based on state-specific rates, caps, and the formulas defined by law. However, actual workers comp settlements are negotiated agreements. Factors such as disputed medical evidence, pre-existing conditions, future medical cost projections, and the negotiation skills of your attorney will ultimately decide your final settlement amount. Use this tool as a starting estimate, not a legal guarantee.',
    schemaAnswer:
      'This calculator provides an estimate using state rates and statutory formulas. Actual settlements depend on negotiations, disputed medical evidence, future medical costs, and pre-existing conditions.',
  },
]

export function buildWorkersCompFAQSchema(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.schemaAnswer,
      },
    })),
  }
}
