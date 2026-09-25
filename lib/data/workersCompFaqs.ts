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

// Per-state FAQ overrides for the Sprint C1 rewrite (GA, MI, NJ, VA, CO, MN).
// Verbatim from research/2026-09-24/wc-states/<state>.md's FAQ section —
// answer and schemaAnswer are identical so the FAQPage JSON-LD matches the
// visible accordion exactly. States not listed here keep WORKERS_COMP_FAQS.
export const STATE_WORKERS_COMP_FAQS: Partial<Record<string, FAQItem[]>> = {
  georgia: [
    {
      id: 'wc-ga-faq-1',
      question: "Is there a cap on how long I can collect weekly workers' comp checks in Georgia?",
      answer:
        "Yes, for most injuries: 400 weeks from the date of injury. If the SBWC classifies your injury as catastrophic, that cap doesn't apply and benefits continue until your condition improves (O.C.G.A. §34-9-261; O.C.G.A. §34-9-200.1, statute text via Justia).",
      schemaAnswer:
        "Yes, for most injuries: 400 weeks from the date of injury. If the SBWC classifies your injury as catastrophic, that cap doesn't apply and benefits continue until your condition improves (O.C.G.A. §34-9-261; O.C.G.A. §34-9-200.1, statute text via Justia).",
    },
    {
      id: 'wc-ga-faq-2',
      question: 'Can I pick any doctor I want for a work injury in Georgia?',
      answer:
        'No. Your employer must post a panel of at least six physicians, and you choose your treating doctor from that list. You get one free change to another doctor on the same panel without Board approval (O.C.G.A. §34-9-201, statute text via Justia).',
      schemaAnswer:
        'No. Your employer must post a panel of at least six physicians, and you choose your treating doctor from that list. You get one free change to another doctor on the same panel without Board approval (O.C.G.A. §34-9-201, statute text via Justia).',
    },
    {
      id: 'wc-ga-faq-3',
      question: "What's the maximum weekly workers' comp check in Georgia in 2026?",
      answer:
        '$800 per week for total disability and PPD, and $533 per week for temporary partial disability. Both figures have been in effect since July 1, 2023, with no change confirmed through 2026 (SBWC Summary of Workers\' Compensation Provisions).',
      schemaAnswer:
        '$800 per week for total disability and PPD, and $533 per week for temporary partial disability. Both figures have been in effect since July 1, 2023, with no change confirmed through 2026 (SBWC Summary of Workers\' Compensation Provisions).',
    },
    {
      id: 'wc-ga-faq-4',
      question: "How long do I have to file a workers' comp claim in Georgia?",
      answer:
        'Generally one year from the date of injury, extended to two years from the last weekly benefit payment or one year from the last employer-furnished treatment, whichever is later (O.C.G.A. §34-9-82, statute text via Justia).',
      schemaAnswer:
        'Generally one year from the date of injury, extended to two years from the last weekly benefit payment or one year from the last employer-furnished treatment, whichever is later (O.C.G.A. §34-9-82, statute text via Justia).',
    },
    {
      id: 'wc-ga-faq-5',
      question: 'Does my Georgia settlement need to be approved by anyone?',
      answer:
        "Yes. Any settlement agreement must be filed with the State Board of Workers' Compensation, and it isn't binding on either side until the Board approves it (O.C.G.A. §34-9-15, statute text via Justia).",
      schemaAnswer:
        "Yes. Any settlement agreement must be filed with the State Board of Workers' Compensation, and it isn't binding on either side until the Board approves it (O.C.G.A. §34-9-15, statute text via Justia).",
    },
  ],
  michigan: [
    {
      id: 'wc-mi-faq-1',
      question: 'Is a Michigan workers\' comp settlement the same as a "redemption"?',
      answer:
        "Yes — in Michigan, a lump-sum workers' comp settlement is called a redemption, and it requires approval by a workers' compensation magistrate before it's binding (MCL 418.835, statute text via Justia).",
      schemaAnswer:
        "Yes — in Michigan, a lump-sum workers' comp settlement is called a redemption, and it requires approval by a workers' compensation magistrate before it's binding (MCL 418.835, statute text via Justia).",
    },
    {
      id: 'wc-mi-faq-2',
      question: 'How soon after an injury can a case be redeemed?',
      answer: 'Not before six months have passed since the date of injury (MCL 418.835, statute text via Justia).',
      schemaAnswer: 'Not before six months have passed since the date of injury (MCL 418.835, statute text via Justia).',
    },
    {
      id: 'wc-mi-faq-3',
      question: 'Does Michigan cap how long temporary total disability checks can run?',
      answer:
        'No. Weekly TTD benefits continue for as long as the disability lasts under MCL 418.351(1); the only week-based figure in that section is the 800-week limit on the conclusive presumption of permanent total disability, which is not a cutoff on ordinary TTD checks (statute text via Justia).',
      schemaAnswer:
        'No. Weekly TTD benefits continue for as long as the disability lasts under MCL 418.351(1); the only week-based figure in that section is the 800-week limit on the conclusive presumption of permanent total disability, which is not a cutoff on ordinary TTD checks (statute text via Justia).',
    },
    {
      id: 'wc-mi-faq-4',
      question: "Can I pick my own doctor for a Michigan workers' comp injury?",
      answer:
        'Not right away. The employer or insurer chooses the treating physician for the first 28 days. After that, you can switch to a doctor of your choice by notifying the employer and carrier (MCL 418.315, statute text via Justia).',
      schemaAnswer:
        'Not right away. The employer or insurer chooses the treating physician for the first 28 days. After that, you can switch to a doctor of your choice by notifying the employer and carrier (MCL 418.315, statute text via Justia).',
    },
    {
      id: 'wc-mi-faq-5',
      question: "What's the maximum weekly workers' comp check in Michigan for 2026?",
      answer:
        "$1,201.00 per week for injuries in the 2026 benefit year, based on a state average weekly wage of $1,333.88. The actual rate for an individual worker still depends on their after-tax average weekly wage under the WDCA's rate-book tables.",
      schemaAnswer:
        "$1,201.00 per week for injuries in the 2026 benefit year, based on a state average weekly wage of $1,333.88. The actual rate for an individual worker still depends on their after-tax average weekly wage under the WDCA's rate-book tables.",
    },
  ],
  'new-jersey': [
    {
      id: 'wc-nj-faq-1',
      question: 'Does New Jersey use the AMA Guides to rate permanent disability?',
      answer:
        'No. New Jersey rates permanent partial disability under its own statutory schedule of weeks per body part, set out in R.S. 34:15-12(c), not the AMA Guides.',
      schemaAnswer:
        'No. New Jersey rates permanent partial disability under its own statutory schedule of weeks per body part, set out in R.S. 34:15-12(c), not the AMA Guides.',
    },
    {
      id: 'wc-nj-faq-2',
      question: 'Who picks my doctor for a work injury in New Jersey?',
      answer:
        "Your employer or its insurance carrier designates the authorized treating physician. You generally can't choose your own doctor at the employer's expense except in an emergency or if the employer refuses to provide care.",
      schemaAnswer:
        "Your employer or its insurance carrier designates the authorized treating physician. You generally can't choose your own doctor at the employer's expense except in an emergency or if the employer refuses to provide care.",
    },
    {
      id: 'wc-nj-faq-3',
      question: 'How long can I receive temporary disability checks in New Jersey?',
      answer: 'Up to 400 weeks, a hard statutory cap (R.S. 34:15-12(a), statute text via Justia).',
      schemaAnswer: 'Up to 400 weeks, a hard statutory cap (R.S. 34:15-12(a), statute text via Justia).',
    },
    {
      id: 'wc-nj-faq-4',
      question: "What's the difference between a Section 20 and a Section 22 settlement?",
      answer:
        'A Section 20 order approving settlement (R.S. 34:15-20) is a lump sum that dismisses the case for good, closing out future medical benefits for that injury. A Section 22 formal award (R.S. 34:15-22) keeps the case open and can later be reviewed or modified under R.S. 34:15-27 if your condition changes.',
      schemaAnswer:
        'A Section 20 order approving settlement (R.S. 34:15-20) is a lump sum that dismisses the case for good, closing out future medical benefits for that injury. A Section 22 formal award (R.S. 34:15-22) keeps the case open and can later be reviewed or modified under R.S. 34:15-27 if your condition changes.',
    },
    {
      id: 'wc-nj-faq-5',
      question: "How long do I have to file a workers' comp claim in New Jersey?",
      answer:
        'Generally 2 years from the date of the accident, or 2 years from the last payment of compensation if you already received some (R.S. 34:15-51, statute text via Justia).',
      schemaAnswer:
        'Generally 2 years from the date of the accident, or 2 years from the last payment of compensation if you already received some (R.S. 34:15-51, statute text via Justia).',
    },
  ],
  virginia: [
    {
      id: 'wc-va-faq-1',
      question: 'Does Virginia use the AMA Guides to rate a permanent injury?',
      answer:
        "No. Virginia pays permanent partial disability off its own statutory schedule of weeks per body part, not the AMA Guides' impairment percentages the way some other states do (Va. Code § 65.2-503(B)).",
      schemaAnswer:
        "No. Virginia pays permanent partial disability off its own statutory schedule of weeks per body part, not the AMA Guides' impairment percentages the way some other states do (Va. Code § 65.2-503(B)).",
    },
    {
      id: 'wc-va-faq-2',
      question: 'How long can temporary total disability payments last in Virginia?',
      answer:
        "There's no separate week-count on TTD alone — it's folded into an overall 500-week cap on total compensation (TTD plus PPD combined), unless the injury qualifies as permanent and total, in which case payments continue for life (Va. Code § 65.2-518; § 65.2-500(D)).",
      schemaAnswer:
        "There's no separate week-count on TTD alone — it's folded into an overall 500-week cap on total compensation (TTD plus PPD combined), unless the injury qualifies as permanent and total, in which case payments continue for life (Va. Code § 65.2-518; § 65.2-500(D)).",
    },
    {
      id: 'wc-va-faq-3',
      question: 'Do I have to see whatever doctor my employer picks?',
      answer:
        'Not exactly — your employer must give you a panel of at least three physicians to choose from, and you pick your treating doctor from that list (Va. Code § 65.2-603).',
      schemaAnswer:
        'Not exactly — your employer must give you a panel of at least three physicians to choose from, and you pick your treating doctor from that list (Va. Code § 65.2-603).',
    },
    {
      id: 'wc-va-faq-4',
      question: 'What if I work for a small business in Virginia?',
      answer:
        "Private employers with fewer than three employees regularly working in the same business are generally exempt from mandatory coverage, so check your employer's size if you're unsure whether you're covered (Va. Code § 65.2-101).",
      schemaAnswer:
        "Private employers with fewer than three employees regularly working in the same business are generally exempt from mandatory coverage, so check your employer's size if you're unsure whether you're covered (Va. Code § 65.2-101).",
    },
    {
      id: 'wc-va-faq-5',
      question: 'Can I just accept a settlement offer from the insurance company on my own?',
      answer:
        "No agreement is binding until the Virginia Workers' Compensation Commission reviews and approves it as being in your best interest — the insurer can't finalize a settlement without the Commission's sign-off (Va. Code § 65.2-701).",
      schemaAnswer:
        "No agreement is binding until the Virginia Workers' Compensation Commission reviews and approves it as being in your best interest — the insurer can't finalize a settlement without the Commission's sign-off (Va. Code § 65.2-701).",
    },
  ],
  colorado: [
    {
      id: 'wc-co-faq-1',
      question: 'Does Colorado use the AMA Guides for impairment ratings?',
      answer:
        'Yes, but only for whole-person (non-scheduled) ratings, and only the Third Edition, Revised, as it stood on July 1, 1991 — Colorado has not switched to a newer edition (C.R.S. § 8-42-107(8), statute text via Justia).',
      schemaAnswer:
        'Yes, but only for whole-person (non-scheduled) ratings, and only the Third Edition, Revised, as it stood on July 1, 1991 — Colorado has not switched to a newer edition (C.R.S. § 8-42-107(8), statute text via Justia).',
    },
    {
      id: 'wc-co-faq-2',
      question: 'Is there a limit on how many weeks I can collect TTD?',
      answer:
        'No. Colorado does not cap TTD at a set number of weeks; it runs until MMI, a return to regular work, or a written release to return to regular work, whichever comes first (C.R.S. § 8-42-105, statute text via Justia).',
      schemaAnswer:
        'No. Colorado does not cap TTD at a set number of weeks; it runs until MMI, a return to regular work, or a written release to return to regular work, whichever comes first (C.R.S. § 8-42-105, statute text via Justia).',
    },
    {
      id: 'wc-co-faq-3',
      question: 'Do I have to see the doctor my employer picks?',
      answer:
        'Generally yes, at least at first — your employer or its insurer must give you a list of at least four physicians (or a mix of physicians and corporate medical providers) to choose from, and you get one later change of your own within 120 days of the first designation (C.R.S. § 8-43-404(5), statute text via Justia).',
      schemaAnswer:
        'Generally yes, at least at first — your employer or its insurer must give you a list of at least four physicians (or a mix of physicians and corporate medical providers) to choose from, and you get one later change of your own within 120 days of the first designation (C.R.S. § 8-43-404(5), statute text via Justia).',
    },
    {
      id: 'wc-co-faq-4',
      question: "Who has to approve my settlement before it's final?",
      answer:
        'An administrative law judge or the Director of the Division of Workers\' Compensation must review it with you in person and approve it in writing (C.R.S. § 8-43-204, statute text via Justia).',
      schemaAnswer:
        'An administrative law judge or the Director of the Division of Workers\' Compensation must review it with you in person and approve it in writing (C.R.S. § 8-43-204, statute text via Justia).',
    },
    {
      id: 'wc-co-faq-5',
      question: 'How long do I have to report my injury and file a claim?',
      answer:
        'Ten days, in writing, to your employer. Filing the claim itself with the Division has its own, longer deadline — 2 years from the injury (5 years for certain occupational diseases) (C.R.S. § 8-43-102; C.R.S. § 8-43-103, statute text via Justia).',
      schemaAnswer:
        'Ten days, in writing, to your employer. Filing the claim itself with the Division has its own, longer deadline — 2 years from the injury (5 years for certain occupational diseases) (C.R.S. § 8-43-102; C.R.S. § 8-43-103, statute text via Justia).',
    },
  ],
  minnesota: [
    {
      id: 'wc-mn-faq-1',
      question: "Is Minnesota workers' comp based on fault?",
      answer:
        "No. Coverage is no-fault — a worker generally doesn't need to prove the employer was negligent, only that the injury arose out of and in the course of employment, under Minn. Stat. Chapter 176 generally administered by DLI.",
      schemaAnswer:
        "No. Coverage is no-fault — a worker generally doesn't need to prove the employer was negligent, only that the injury arose out of and in the course of employment, under Minn. Stat. Chapter 176 generally administered by DLI.",
    },
    {
      id: 'wc-mn-faq-2',
      question: 'How is Minnesota\'s PPD different from states that use a "scheduled weeks" system?',
      answer:
        "Minnesota rates the whole body as a single percentage under its own impairment rules (Minn. Rules ch. 5223), then multiplies that percentage's dollar band from the statutory table — it does not assign a fixed number of weeks to specific body parts like a hand or arm (Minn. Stat. §176.101, subd. 2a).",
      schemaAnswer:
        "Minnesota rates the whole body as a single percentage under its own impairment rules (Minn. Rules ch. 5223), then multiplies that percentage's dollar band from the statutory table — it does not assign a fixed number of weeks to specific body parts like a hand or arm (Minn. Stat. §176.101, subd. 2a).",
    },
    {
      id: 'wc-mn-faq-3',
      question: 'Which PPD dollar table applies to my injury?',
      answer:
        "It depends only on your date of injury, not when you're rated or paid. Injuries from October 1, 2023 through September 30, 2026 use the current table; injuries on or after October 1, 2026 use the higher table enacted by 2026 Minn. Laws ch. 103, §10.",
      schemaAnswer:
        "It depends only on your date of injury, not when you're rated or paid. Injuries from October 1, 2023 through September 30, 2026 use the current table; injuries on or after October 1, 2026 use the higher table enacted by 2026 Minn. Laws ch. 103, §10.",
    },
    {
      id: 'wc-mn-faq-4',
      question: 'How long can I receive weekly TTD checks in Minnesota?',
      answer:
        "Up to 130 weeks total, combining any initial and later-resumed TTD periods, unless you're in an approved retraining plan, which can extend that limit (Minn. Stat. §176.101, subd. 1(k)).",
      schemaAnswer:
        "Up to 130 weeks total, combining any initial and later-resumed TTD periods, unless you're in an approved retraining plan, which can extend that limit (Minn. Stat. §176.101, subd. 1(k)).",
    },
    {
      id: 'wc-mn-faq-5',
      question: "Do I have to accept my employer's settlement offer?",
      answer:
        "No. A Stipulation for Settlement is voluntary and only becomes binding once both sides sign it and a Workers' Compensation Judge at the Office of Administrative Hearings reviews and approves it.",
      schemaAnswer:
        "No. A Stipulation for Settlement is voluntary and only becomes binding once both sides sign it and a Workers' Compensation Judge at the Office of Administrative Hearings reviews and approves it.",
    },
  ],
}

// Returns the state's own FAQ set if Sprint C1 gave it one, otherwise the
// shared generic set every other workers-comp state page uses.
export function getWorkersCompFaqsForState(slug: string): FAQItem[] {
  return STATE_WORKERS_COMP_FAQS[slug] ?? WORKERS_COMP_FAQS
}

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
