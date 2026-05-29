// ─────────────────────────────────────────────────────────────────────────────
// lib/data/carAccidentFaqs.ts
// Tool #2 — FAQ content for the Car Accident Settlement Calculator main page.
// Shape matches FAQItem from faqContent.ts so buildFAQSchema() can be reused
// directly. Five items ordered by user intent (how to calculate → what to
// recover → fault impact → policy limits → accuracy).
// ─────────────────────────────────────────────────────────────────────────────

import type { FAQItem } from './faqContent'
// Re-export buildFAQSchema so the page only needs one import path
export { buildFAQSchema } from './faqContent'

export const CAR_ACCIDENT_FAQS: FAQItem[] = [
  {
    id: 'how-is-car-accident-settlement-calculated',
    question: 'How is a car accident settlement calculated?',
    answer:
      'Car accident settlements are most commonly calculated using the **multiplier method**. You start by adding up all of your economic damages — medical bills, future medical costs, lost wages, future lost earnings, and vehicle repair or replacement. That total becomes your special damages base. You then apply a multiplier between 1.5 and 5 based on injury severity to arrive at your pain and suffering figure. Add the two together, then reduce by your percentage of fault (if any), and you have your estimated settlement value.\n\nFor example: if your economic damages total $30,000 and your injury is moderate (multiplier of 2.5), your pain and suffering estimate is $75,000 — giving a total claim value of $105,000 before any fault reduction.',
    schemaAnswer:
      'Car accident settlements are most commonly calculated using the multiplier method. Total economic damages (medical bills, lost wages, vehicle damage) are multiplied by a factor between 1.5 and 5 based on injury severity to arrive at a pain and suffering estimate. The two are added together, then reduced by the plaintiff\'s percentage of fault.',
  },
  {
    id: 'what-damages-can-i-recover-car-accident',
    question: 'What damages can I recover in a car accident claim?',
    answer:
      'A car accident claim can include two broad categories of damages.\n\n**Economic damages** (also called special damages) cover your out-of-pocket losses: past and future medical bills, hospital costs, physical therapy, prescription medications, lost wages while you were recovering, and future lost earning capacity if your injury affects your ability to work. Vehicle repair or total loss replacement costs are also economic damages.\n\n**Non-economic damages** (also called general damages) compensate you for losses that don\'t come with a receipt: physical pain, emotional distress, anxiety, loss of enjoyment of life, loss of consortium, and sleep disruption. These are calculated using either the multiplier method or the per diem method.\n\nIn rare cases involving reckless or grossly negligent conduct, punitive damages may also be available — but these are not included in standard settlement calculations.',
    schemaAnswer:
      'Car accident damages fall into two categories. Economic damages include medical bills, future medical costs, lost wages, future earning capacity, and vehicle damage. Non-economic damages include physical pain, emotional distress, loss of enjoyment of life, and other intangible losses. Punitive damages may apply in rare cases of gross negligence.',
  },
  {
    id: 'how-does-fault-affect-car-accident-settlement',
    question: 'How does fault affect my car accident settlement?',
    answer:
      'Your state\'s fault rule determines whether — and by how much — your settlement is reduced if you share any blame for the accident.\n\n**Pure comparative fault** states (California, New York, Arizona): Your award is reduced by your fault percentage, but you can still recover at any level of fault. At 40% fault on a $100,000 claim, you collect $60,000.\n\n**Modified comparative fault — 51% bar** (Texas, Florida, Illinois, most states): You can recover if you are 50% or less at fault. At 51% or more, you recover nothing.\n\n**Modified comparative fault — 50% bar** (Georgia, Colorado): You recover if you are 49% or less at fault. At 50% or more, recovery is barred.\n\n**Contributory negligence** (North Carolina, Virginia): Any fault at all — even 1% — bars recovery completely.\n\nThis calculator applies your fault percentage to reduce your estimate automatically.',
    schemaAnswer:
      'Fault rules vary by state. Pure comparative fault states (CA, NY, AZ) reduce your award by your fault percentage with no bar. Modified comparative fault states bar recovery at 51% or 50% fault. Contributory negligence states (NC, VA) bar recovery for any fault at all. This calculator reduces your estimate by your stated fault percentage.',
  },
  {
    id: 'what-if-at-fault-driver-has-low-insurance-limits',
    question: 'What if the at-fault driver has low insurance limits?',
    answer:
      'Insurance policy limits cap what the at-fault driver\'s insurer will pay — regardless of what your damages actually are. If your calculated settlement is $150,000 but the at-fault driver only carries a $50,000 liability policy, the insurer typically offers the policy limit as its maximum payout.\n\nYou have several options when this happens:\n\n1. **Pursue the driver personally** for assets above the policy limit — but most drivers with low coverage also have limited personal assets.\n2. **File a claim under your own Underinsured Motorist (UIM) coverage** if you purchased it. UIM coverage is specifically designed for this situation and pays the gap between the at-fault driver\'s limit and your actual damages (up to your UIM limit).\n3. **Negotiate a structured settlement** or payment plan with the at-fault driver directly.\n\nThis calculator lets you enter the at-fault driver\'s policy limit. If your estimate exceeds it, we display a warning so you can plan accordingly.',
    schemaAnswer:
      'If the at-fault driver\'s policy limit is lower than your damages, the insurer will typically pay only the policy limit. Options include pursuing the driver personally, filing under your own underinsured motorist (UIM) coverage, or negotiating directly. This calculator warns you when your estimate exceeds the stated policy limit.',
  },
  {
    id: 'how-accurate-is-car-accident-settlement-calculator',
    question: 'How accurate is this car accident settlement calculator?',
    answer:
      'This calculator applies the multiplier method used by insurance adjusters and plaintiff attorneys across the USA — the same formula that underlies most professional settlement valuations. It accurately reflects the math of how settlements are typically estimated.\n\nHowever, the actual settlement you receive will depend on factors no calculator can fully capture: the strength of your medical documentation, liability disputes and witness credibility, your state\'s specific fault rules and damage caps, the at-fault driver\'s policy limits, and the skill of the attorneys involved.\n\nUse this tool to understand your reasonable range before you negotiate — not as a final number to accept or decline. The insurance company already has software running these calculations on your claim. This puts you on equal footing.',
    schemaAnswer:
      'This calculator applies the multiplier method used by insurance adjusters and plaintiff attorneys. Results are a reasonable estimate. Actual settlements depend on medical documentation, liability disputes, state fault rules, damage caps, policy limits, and attorney skill. Use this tool to understand your range before negotiations.',
  },
]

/** Returns all five car accident FAQs for use on the main calculator page. */
export function getCarAccidentFAQs(): FAQItem[] {
  return CAR_ACCIDENT_FAQS
}
