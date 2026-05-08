// ─────────────────────────────────────────────────────────────────────────────
// lib/data/faqContent.ts
// FAQ content for main page and all state pages.
// ─────────────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string
  question: string
  answer: string
  schemaAnswer: string
}

export interface FAQSet {
  pageSlug: string
  faqs: FAQItem[]
}

const MAIN_PAGE_FAQS: FAQItem[] = [
  {
    id: 'what-is-pain-and-suffering',
    question: 'What is pain and suffering in a personal injury claim?',
    answer:
      'Pain and suffering refers to the physical pain and emotional distress a victim experiences as a result of an injury caused by someone else\'s negligence. Unlike medical bills or lost wages — which have exact dollar amounts — pain and suffering damages are non-economic, meaning they compensate for the human cost of an injury: chronic pain, anxiety, loss of enjoyment of life, sleep disruption, and emotional trauma. They are calculated separately from your economic (special) damages.',
    schemaAnswer:
      'Pain and suffering refers to the physical pain and emotional distress a victim experiences as a result of an injury. Unlike medical bills or lost wages, pain and suffering damages are non-economic — they compensate for chronic pain, anxiety, loss of enjoyment of life, sleep disruption, and emotional trauma. They are calculated separately from economic damages.',
  },
  {
    id: 'how-is-pain-and-suffering-calculated',
    question: 'How is pain and suffering calculated?',
    answer:
      'There are two widely used methods. The **multiplier method** multiplies your total economic damages (medical bills + lost wages + future costs) by a number between 1.5 and 5, depending on injury severity. The **per diem method** assigns a daily dollar value to your suffering and multiplies it by the number of days you were in recovery. Insurance companies most often use the multiplier method. Attorneys may present either method — or both — to maximize your claim.',
    schemaAnswer:
      'There are two widely used methods. The multiplier method multiplies your total economic damages by a number between 1.5 and 5 based on injury severity. The per diem method assigns a daily dollar value to your suffering and multiplies it by your recovery days. Insurance companies most often use the multiplier method.',
  },
  {
    id: 'what-multiplier-is-used',
    question: 'What multiplier is used for pain and suffering?',
    answer:
      'Multipliers typically range from 1.5 to 5. Minor injuries with full recovery use 1.5–2x. Moderate injuries requiring several months of treatment use 2–3x. Serious injuries involving surgery or partial permanent effects use 3–4x. Severe or catastrophic injuries — including permanent disability or traumatic brain injury — use 4–5x. The multiplier is not fixed by law; it is negotiated between attorneys and insurance adjusters based on the evidence in your case.',
    schemaAnswer:
      'Multipliers range from 1.5 to 5. Minor injuries use 1.5–2x. Moderate injuries use 2–3x. Serious injuries use 3–4x. Severe or catastrophic injuries use 4–5x. The multiplier is negotiated between attorneys and insurance adjusters based on case evidence.',
  },
  {
    id: 'what-is-per-diem-method',
    question: 'What is the per diem method for pain and suffering?',
    answer:
      'The per diem method assigns a specific dollar amount to each day you suffered from your injury, then multiplies that by your total recovery days. The daily rate is ideally your actual daily wage (annual salary ÷ 365), which makes the number easier to justify. For those who are unemployed, a reasonable daily rate of $100–$300 is commonly used.',
    schemaAnswer:
      'The per diem method assigns a dollar amount to each day of suffering and multiplies it by the number of recovery days. The daily rate is ideally your actual daily wage. A rate of $100–$300 per day is commonly used for those who are unemployed.',
  },
  {
    id: 'average-pain-and-suffering-settlement',
    question: 'What is the average pain and suffering settlement?',
    answer:
      'There is no meaningful national average because settlements vary enormously based on injury severity, state laws, insurance policy limits, and fault percentage. Minor injury cases may settle for $5,000–$25,000. Moderate injuries commonly settle in the $25,000–$100,000 range. Serious or permanent injuries regularly exceed $100,000, and catastrophic cases can reach millions.',
    schemaAnswer:
      'There is no meaningful national average. Minor injury cases may settle for $5,000–$25,000. Moderate injuries commonly settle in the $25,000–$100,000 range. Serious injuries regularly exceed $100,000, and catastrophic cases can reach millions.',
  },
  {
    id: 'is-calculator-result-accurate',
    question: 'How accurate is this pain and suffering calculator?',
    answer:
      'This calculator applies the same formulas used by insurance adjusters and plaintiff attorneys — the multiplier method and per diem method. The results are a reasonable estimate based on the inputs you provide. However, actual settlement amounts are influenced by factors this tool cannot capture: liability disputes, your state\'s fault rules, insurance policy limits, the strength of your medical documentation, and attorney negotiation skill.',
    schemaAnswer:
      'This calculator applies the multiplier and per diem methods used by insurance adjusters and attorneys. Results are a reasonable estimate. Actual settlements depend on liability disputes, state fault rules, insurance limits, medical documentation quality, and attorney skill.',
  },
  {
    id: 'do-i-need-a-lawyer',
    question: 'Do I need a lawyer to get pain and suffering damages?',
    answer:
      'You are not legally required to hire an attorney, but studies consistently show that injury victims with legal representation receive higher settlements — often 3–4x higher — even after attorney fees. Insurance companies have professional adjusters trained to minimize payouts. Most personal injury attorneys work on contingency (no upfront fees — they take a percentage only if you win).',
    schemaAnswer:
      'You are not required to hire an attorney, but represented victims typically receive 3–4x higher settlements even after fees. Insurance companies employ professional adjusters trained to minimize payouts. Most personal injury attorneys work on contingency — no upfront fees.',
  },
  {
    id: 'how-long-to-settle',
    question: 'How long does a pain and suffering claim take to settle?',
    answer:
      'Minor injury claims handled directly with an insurer can settle in 1–3 months. Cases with ongoing treatment, disputed liability, or significant damages typically take 6–18 months. Cases that go to trial can take 2–5 years. Attorneys generally advise reaching maximum medical improvement (MMI) before settling so that future medical costs are fully accounted for.',
    schemaAnswer:
      'Minor claims can settle in 1–3 months. Cases with ongoing treatment or disputed liability typically take 6–18 months. Cases that go to trial can take 2–5 years. Attorneys recommend waiting for maximum medical improvement before settling.',
  },
]

const GENERIC_STATE_FAQ_TEMPLATES: Array<{
  id: string
  question: (stateName: string) => string
  answer: (stateName: string, solYears: number, faultRuleLabel: string, faultExplanation: string) => string
  schemaAnswer: (stateName: string, solYears: number, faultRuleLabel: string, faultExplanation: string) => string
}> = [
  {
    id: 'state-fault-rule',
    question: (s) => `What is ${s}'s fault rule for personal injury claims?`,
    answer: (s, _sol, label, explanation) =>
      `${s} follows the **${label}** rule. ${explanation} Your pain and suffering damages will be reduced — or potentially eliminated — based on how much fault is assigned to you.`,
    schemaAnswer: (s, _sol, label, explanation) =>
      `${s} follows the ${label} rule. ${explanation} Your pain and suffering damages will be reduced or eliminated based on your assigned fault percentage.`,
  },
  {
    id: 'state-statute-of-limitations',
    question: (s) => `How long do I have to file a personal injury claim in ${s}?`,
    answer: (s, sol) =>
      `In ${s}, the statute of limitations for most personal injury claims is **${sol} year${sol !== 1 ? 's' : ''}** from the date of the injury. If you miss this deadline, your case will almost certainly be dismissed regardless of its merits.`,
    schemaAnswer: (s, sol) =>
      `In ${s}, the statute of limitations for most personal injury claims is ${sol} year${sol !== 1 ? 's' : ''} from the date of injury. Missing this deadline will almost certainly result in case dismissal.`,
  },
  {
    id: 'state-calculator-accuracy',
    question: (s) => `How accurate is this ${s} pain and suffering calculator?`,
    answer: (s) =>
      `This calculator applies the multiplier and per diem methods used by ${s} insurance adjusters and personal injury attorneys, incorporating ${s}-specific factors including the state's fault rule and any applicable damage caps. Results are estimates — actual settlement amounts depend on your specific evidence, insurance policy limits, and negotiation.`,
    schemaAnswer: (s) =>
      `This calculator applies the multiplier and per diem methods used by ${s} insurance adjusters and attorneys, incorporating state-specific fault rules and damage caps. Results are estimates — actual settlements depend on evidence, policy limits, and negotiation.`,
  },
]

const CALIFORNIA_FAQS: FAQItem[] = [
  {
    id: 'ca-pure-comparative',
    question: 'Does California\'s pure comparative fault rule affect my settlement?',
    answer:
      'Yes. California follows pure comparative fault, meaning your settlement is reduced by your percentage of fault — but never eliminated entirely. If you are found 30% at fault and your damages are $100,000, you collect $70,000. Unlike states with a 51% bar, you can still recover in California even if you were mostly at fault.',
    schemaAnswer:
      'California follows pure comparative fault — your settlement is reduced by your fault percentage but never eliminated. If you are 30% at fault on a $100,000 claim, you collect $70,000. You can recover even if you were mostly at fault.',
  },
  {
    id: 'ca-damage-cap',
    question: 'Does California cap pain and suffering damages?',
    answer:
      'No — California does not cap non-economic damages for general personal injury cases. You can recover unlimited pain and suffering damages in a car accident, slip and fall, or premises liability case. The only damage cap in California applies to medical malpractice cases under MICRA, which was raised to $350,000 in 2023.',
    schemaAnswer:
      'California does not cap non-economic damages for general personal injury cases. A $350,000 cap applies only to medical malpractice cases under MICRA.',
  },
  {
    id: 'ca-statute-of-limitations',
    question: 'What is the statute of limitations for personal injury in California?',
    answer:
      'California gives you **2 years** from the date of injury to file a personal injury lawsuit. Claims against California government entities require a government tort claim filed within 6 months — a much shorter window that many plaintiffs miss.',
    schemaAnswer:
      'California\'s statute of limitations for personal injury is 2 years from the injury date. Claims against government entities require a tort claim filed within 6 months.',
  },
  {
    id: 'ca-average-settlement',
    question: 'What is the average personal injury settlement in California?',
    answer:
      'California personal injury settlements vary widely. Minor soft tissue injury cases typically settle between $10,000–$50,000. Moderate injuries with surgery often settle $75,000–$250,000. Serious permanent injuries regularly exceed $500,000 to millions. California\'s lack of a damage cap and pure comparative fault rule tend to produce higher average settlements than most other states.',
    schemaAnswer:
      'California personal injury settlements vary widely. Minor injuries settle $10,000–$50,000. Moderate injuries with surgery settle $75,000–$250,000. Serious injuries regularly exceed $500,000. The lack of damage caps and pure comparative fault produce higher averages than most states.',
  },
]

const TEXAS_FAQS: FAQItem[] = [
  {
    id: 'tx-51-percent-bar',
    question: 'What is Texas\'s 51% bar rule for personal injury?',
    answer:
      'Texas uses modified comparative fault with a 51% bar. If you are found 51% or more responsible for your own injury, you recover nothing. If you are 50% or less at fault, you can recover damages — but your award is reduced by your fault percentage. The jury assigns fault percentages to all parties.',
    schemaAnswer:
      'Texas bars recovery if you are 51% or more at fault. At 50% or less, your award is reduced by your fault percentage. The jury assigns fault percentages to all parties.',
  },
  {
    id: 'tx-damage-cap',
    question: 'Does Texas cap pain and suffering damages?',
    answer:
      'Texas does not cap non-economic damages for general personal injury cases such as car accidents or slip and falls. A cap of $250,000 applies to medical malpractice cases per healthcare provider. There is no cap on economic damages in any Texas personal injury case.',
    schemaAnswer:
      'Texas does not cap non-economic damages for general personal injury cases. A $250,000 cap applies to medical malpractice non-economic damages per provider.',
  },
  {
    id: 'tx-statute-of-limitations',
    question: 'How long do I have to file a personal injury lawsuit in Texas?',
    answer:
      'Texas gives you **2 years** from the date of the injury to file. Minors have until their 20th birthday. Claims against Texas government entities require formal notice within 6 months of the incident.',
    schemaAnswer:
      'Texas\'s statute of limitations for personal injury is 2 years. Minors have until age 20. Claims against government entities require notice within 6 months.',
  },
  {
    id: 'tx-insurance-requirements',
    question: 'Does Texas require car insurance that covers pain and suffering?',
    answer:
      'Texas requires minimum liability coverage of 30/60/25. Texas is a fault state — you can sue the at-fault driver directly for all damages including pain and suffering. Uninsured/underinsured motorist (UM/UIM) coverage is offered but not mandatory.',
    schemaAnswer:
      'Texas requires 30/60/25 minimum liability coverage. Texas is a fault state — you can sue the at-fault driver directly for all damages. Uninsured/underinsured motorist coverage is offered but not mandatory.',
  },
]

const FLORIDA_FAQS: FAQItem[] = [
  {
    id: 'fl-2023-law-change',
    question: 'Did Florida\'s personal injury law change in 2023?',
    answer:
      'Yes — significantly. Florida HB 837 (March 2023) made two major changes: (1) Florida switched from pure comparative fault to modified comparative fault with a 51% bar. (2) The statute of limitations for negligence claims was reduced from 4 years to 2 years. These changes apply to cases filed after March 24, 2023.',
    schemaAnswer:
      'Florida HB 837 (March 2023) made two major changes: Florida switched from pure to modified comparative fault (51% bar), and the statute of limitations was reduced from 4 years to 2 years. These changes apply to cases filed after March 24, 2023.',
  },
  {
    id: 'fl-no-fault',
    question: 'Is Florida a no-fault state for car accidents?',
    answer:
      'Yes. Florida is a no-fault state — your own PIP insurance pays your medical bills up to $10,000 regardless of fault. To sue the at-fault driver for pain and suffering, you must meet Florida\'s serious injury threshold: permanent injury, significant and permanent scarring, or significant and permanent loss of bodily function.',
    schemaAnswer:
      'Florida is a no-fault state. Your own PIP insurance covers medical bills up to $10,000 regardless of fault. To sue for pain and suffering, you must meet the serious injury threshold: permanent injury, significant permanent scarring, or permanent loss of bodily function.',
  },
  {
    id: 'fl-statute-of-limitations',
    question: 'What is Florida\'s new statute of limitations for personal injury?',
    answer:
      'After the 2023 law change, Florida\'s statute of limitations for negligence-based personal injury claims is now **2 years** — reduced from the previous 4-year window. If your injury occurred before March 24, 2023, the old 4-year SOL may still apply.',
    schemaAnswer:
      'Florida reduced its negligence statute of limitations to 2 years (from 4 years) effective March 24, 2023. Injuries before that date may still have 4 years.',
  },
  {
    id: 'fl-damage-cap',
    question: 'Does Florida cap pain and suffering damages?',
    answer:
      'Florida does not currently have a general cap on non-economic damages for personal injury cases. The Florida Supreme Court struck down medical malpractice non-economic damage caps in 2017. However, the 2023 HB 837 reforms introduced other plaintiff-unfavorable changes that may effectively reduce settlement values.',
    schemaAnswer:
      'Florida does not have a general cap on non-economic damages for personal injury. Medical malpractice caps were struck down in 2017. The 2023 HB 837 reforms introduced other changes that may reduce settlement values.',
  },
]

const NEW_YORK_FAQS: FAQItem[] = [
  {
    id: 'ny-pure-comparative',
    question: 'How does New York\'s pure comparative fault rule affect pain and suffering claims?',
    answer:
      'New York follows pure comparative fault — your damages are reduced by your percentage of fault, but you can still recover even if you were mostly responsible. If you were 70% at fault and damages total $100,000, you collect $30,000. This is more plaintiff-friendly than states with a 51% bar.',
    schemaAnswer:
      'New York follows pure comparative fault — damages are reduced by your fault percentage but recovery is never fully barred. 70% fault on a $100,000 claim yields $30,000.',
  },
  {
    id: 'ny-no-fault',
    question: 'Is New York a no-fault state for car accidents?',
    answer:
      'Yes. New York is a no-fault state — your own insurance pays medical bills and 80% of lost wages up to $50,000 regardless of fault. To pursue a pain and suffering claim, your injury must meet New York\'s serious injury threshold under Insurance Law §5102(d): death, dismemberment, significant disfigurement, fracture, permanent loss, or a 90/180-day injury.',
    schemaAnswer:
      'New York is a no-fault state — your own insurance covers medical bills and 80% of lost wages up to $50,000. To sue for pain and suffering, injuries must meet the serious injury threshold under Insurance Law §5102(d).',
  },
  {
    id: 'ny-statute-of-limitations',
    question: 'What is New York\'s statute of limitations for personal injury?',
    answer:
      'New York allows **3 years** from the date of injury for most personal injury lawsuits. Medical malpractice is 2.5 years. Claims against New York City or New York State require a notice of claim filed within **90 days** — a strict deadline that bars municipal claims if missed.',
    schemaAnswer:
      'New York allows 3 years for most personal injury lawsuits. Medical malpractice is 2.5 years. Claims against NYC or NYS require a notice of claim within 90 days.',
  },
  {
    id: 'ny-damage-cap',
    question: 'Does New York cap pain and suffering damages?',
    answer:
      'New York has no statutory cap on non-economic damages for personal injury cases. Juries have broad discretion, and New York juries — particularly in NYC — have historically awarded some of the highest verdicts in the country. Courts retain authority to reduce awards that materially deviate from reasonable compensation under CPLR §5501(c).',
    schemaAnswer:
      'New York has no statutory cap on non-economic damages. Juries have broad discretion and historically award high verdicts. Courts can reduce awards that materially deviate from reasonable compensation under CPLR §5501(c).',
  },
]

const STATE_FAQ_OVERRIDES: Record<string, FAQItem[]> = {
  california: CALIFORNIA_FAQS,
  texas: TEXAS_FAQS,
  florida: FLORIDA_FAQS,
  'new-york': NEW_YORK_FAQS,
}

export function getMainPageFAQs(): FAQItem[] {
  return MAIN_PAGE_FAQS
}

export function getStateFAQs(
  stateSlug: string,
  stateData?: {
    name: string
    statuteOfLimitations: number
    faultRuleLabel: string
    faultRuleExplanation: string
  }
): FAQItem[] {
  if (STATE_FAQ_OVERRIDES[stateSlug]) {
    return STATE_FAQ_OVERRIDES[stateSlug]
  }

  if (stateData) {
    const { name, statuteOfLimitations, faultRuleLabel, faultRuleExplanation } = stateData
    const genericFAQs: FAQItem[] = GENERIC_STATE_FAQ_TEMPLATES.map((template) => ({
      id: `${stateSlug}-${template.id}`,
      question: template.question(name),
      answer: template.answer(name, statuteOfLimitations, faultRuleLabel, faultRuleExplanation),
      schemaAnswer: template.schemaAnswer(name, statuteOfLimitations, faultRuleLabel, faultRuleExplanation),
    }))
    const generalFAQs = MAIN_PAGE_FAQS.slice(0, 4).map((faq) => ({
      ...faq,
      id: `${stateSlug}-${faq.id}`,
    }))
    return [...genericFAQs, ...generalFAQs]
  }

  return MAIN_PAGE_FAQS.map((faq) => ({ ...faq, id: `${stateSlug}-${faq.id}` }))
}

export function buildFAQSchema(faqs: FAQItem[]): object {
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
