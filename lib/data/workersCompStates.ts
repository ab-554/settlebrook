// ─────────────────────────────────────────────────────────────────────────────
// lib/data/workersCompStates.ts
// Tool #3 — Workers Comp Settlement Calculator state data.
//
// 2026-09-24 legal accuracy sprint: weeklyCapAmount and weeklyCapEffectivePeriod
// are now read from lib/data/wcMaxBenefits2026.json — the single verified
// source of truth for every state's max weekly TTD benefit (see
// research/2026-09-24/LEGAL-FIXES.md and wc-max-benefits-2026-notes.md).
// Do not hardcode a weeklyCapAmount literal below; add/update the JSON instead.
// ─────────────────────────────────────────────────────────────────────────────

import type { WorkersCompStateData } from '../calculations/types'
import wcMaxBenefits2026 from './wcMaxBenefits2026.json'

interface WcMaxBenefitRecord {
  state: string
  max_weekly: number | null
  min_weekly: number | null
  effective_period: string
  source_url: string
  status: string
}

const WC_MAX_BENEFITS_BY_STATE = new Map<string, WcMaxBenefitRecord>(
  (wcMaxBenefits2026 as WcMaxBenefitRecord[]).map((record) => [record.state, record])
)

type WorkersCompStateSeed = Omit<WorkersCompStateData, 'weeklyCapAmount' | 'weeklyCapEffectivePeriod'>

/**
 * Pulls weeklyCapAmount + weeklyCapEffectivePeriod from wcMaxBenefits2026.json
 * by the state's full name. Throws at build time rather than silently
 * shipping a stale/guessed number if a state is ever missing from the JSON.
 */
function withVerifiedWeeklyCap(seed: WorkersCompStateSeed): WorkersCompStateData {
  const record = WC_MAX_BENEFITS_BY_STATE.get(seed.name)
  if (!record || record.max_weekly == null) {
    throw new Error(
      `lib/data/workersCompStates.ts: no verified max_weekly found in wcMaxBenefits2026.json for "${seed.name}". ` +
      'Add a VERIFIED record before publishing this state.',
    )
  }
  return {
    ...seed,
    weeklyCapAmount: record.max_weekly,
    weeklyCapEffectivePeriod: record.effective_period,
  }
}

export const WORKERS_COMP_STATES: WorkersCompStateData[] = [
  // ── Tier 1 ────────────────────────────────────────────────────────────

  withVerifiedWeeklyCap({
    slug: 'california',
    name: 'California',
    abbreviation: 'CA',
    // California pays 66.67% (two-thirds) of AWW, capped at the SAWW-linked max.
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'California TTD is limited to 104 weeks within a 5-year period from the date of injury for most injuries (240 weeks for certain severe injuries). PPD uses the AMA Guides 5th Edition. WCAB adjudication required for disputed claims.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    // Texas pays 70% of AWW, capped at the state average weekly wage.
    benefitRate: 0.70,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'Texas is the only state where workers compensation is not mandatory for most private employers. Non-subscribing employers (those who opt out of the WC system) can be sued directly in civil court — those claims are personal injury claims, not workers comp claims. If your employer is a non-subscriber, use the Pain & Suffering Calculator instead.',
    // Non-subscriber flag drives the UI warning in WorkersCompCalculator.
    hasNonSubscriberSystem: true,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'florida',
    name: 'Florida',
    abbreviation: 'FL',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'Florida TTD is limited to 104 weeks. PPD benefits are based on impairment ratings under the AMA Guides. Florida eliminated permanent total disability benefits for most injuries effective 2003; severe cases may qualify under a narrow exception.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'new-york',
    name: 'New York',
    abbreviation: 'NY',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    // WCL § 15(2): New York sets no statutory week cap on TTD — it continues
    // until the claimant reaches maximum medical improvement or returns to
    // work. Infinity (not an invented finite number) keeps calculateTTD's
    // existing cap comparison mathematically correct without modifying that
    // protected file — see lib/calculations/workersComp.ts.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'New York has the highest workers comp weekly cap in the country, updated annually on July 1. There is no fixed TTD maximum for most injuries. PPD awards use the AMA Guides scheduled loss of use (SLU) table.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  // ── Tier 2 ────────────────────────────────────────────────────────────

  withVerifiedWeeklyCap({
    slug: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    benefitRate: 0.6667,
    // Illinois uses percentage_of_person for PPD, not the AMA body-part schedule.
    // workersComp.ts branches on this flag for the PPD formula.
    ppdMethod: 'percentage_of_person',
    // 820 ILCS 305/8(b): Illinois sets no fixed week cap on TTD — it
    // continues until the employee reaches maximum medical improvement or
    // returns to work. Infinity (not an invented finite number) keeps
    // calculateTTD's existing cap comparison mathematically correct without
    // modifying that protected file — see lib/calculations/workersComp.ts.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Illinois uses a percentage-of-person PPD method rather than the AMA scheduled weeks table. PPD is calculated as: weekly benefit × 500 whole-body weeks × impairment percentage. TTD has no fixed week cap under 820 ILCS 305/8(b) — it continues until MMI or return to work.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    // 77 P.S. § 511.3: Pennsylvania sets no fixed week cap on TTD, but the
    // insurer may request an Impairment Rating Evaluation (IRE) after 104
    // weeks of total disability, which can convert the claim to a capped
    // partial-disability status. Infinity (not an invented finite number)
    // keeps calculateTTD's existing cap comparison mathematically correct
    // without modifying that protected file — see lib/calculations/workersComp.ts.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Pennsylvania TTD has no fixed week cap under 77 P.S. § 511.3, but the insurer may request an Impairment Rating Evaluation (IRE) after 104 weeks of total disability, which can convert the claim to capped partial-disability status.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  // ── Tier 3 ────────────────────────────────────────────────────────────

  withVerifiedWeeklyCap({
    slug: 'georgia',
    name: 'Georgia',
    abbreviation: 'GA',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 400,
    stateSpecificNotes:
      'PPD uses the AMA Guides to the Evaluation of Permanent Impairment, 5th Edition (named explicitly in O.C.G.A. § 34-9-263): impairment rating % × scheduled weeks for the body part × 66⅔% of AWW.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'ohio',
    name: 'Ohio',
    abbreviation: 'OH',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    // R.C. 4123.56(A): Ohio sets no fixed week cap on TTD, but a medical
    // examination is required after 200 weeks of continuous total disability
    // to determine whether the claimant has reached maximum medical
    // improvement. Infinity (not an invented finite number) keeps
    // calculateTTD's existing cap comparison mathematically correct without
    // modifying that protected file — see lib/calculations/workersComp.ts.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Ohio TTD has no fixed week cap under R.C. 4123.56(A), but a medical examination is required after 200 weeks of continuous total disability to determine whether the claimant has reached maximum medical improvement.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    benefitRate: 0.80, // Michigan pays 80% of after-tax AWW — unique formula
    ppdMethod: 'ama_schedule',
    // MCL 418.351 sets no fixed week cap on TTD — it continues while disability
    // persists. Infinity (not an invented finite number) keeps calculateTTD's
    // existing cap comparison mathematically correct without modifying that
    // protected file — see lib/calculations/workersComp.ts. The "500 weeks"
    // figure that used to appear here is actually the specific-loss
    // permanency-determination deadline in MCL 418.361, not a TTD payment cap.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Michigan calculates TTD benefits based on 80% of after-tax (net) average weekly wage, not gross — resulting in an effective gross replacement rate lower than the stated 80%. MCL 418.351 sets no fixed week cap on TTD; it continues while disability persists. PPD uses Michigan\'s own fixed statutory schedule of weeks per body part (MCL 418.361) — not the AMA Guides, and not scaled by an impairment percentage.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'north-carolina',
    name: 'North Carolina',
    abbreviation: 'NC',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 500,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    // A.R.S. § 23-1045: Arizona sets no fixed week cap on TTD — it continues
    // until the claimant becomes "medically stationary" (Arizona's term for
    // maximum medical improvement). Infinity (not an invented finite number)
    // keeps calculateTTD's existing cap comparison mathematically correct
    // without modifying that protected file — see lib/calculations/workersComp.ts.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Arizona\'s system is based on a monthly Average Monthly Wage, not a weekly figure — the weekly cap shown here is a standard weekly-equivalent conversion (AMW × 12 ÷ 52 × 66⅔%) for comparability with other states, not a figure the Industrial Commission itself publishes as "weekly." TTD has no fixed week cap under A.R.S. § 23-1045 — it continues until the claimant becomes medically stationary.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'new-jersey',
    name: 'New Jersey',
    abbreviation: 'NJ',
    benefitRate: 0.70,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 400,
    stateSpecificNotes:
      'PPD uses New Jersey\'s own statutory schedule of weeks per body part (R.S. 34:15-12(c)) — not the AMA Guides. Percentage of disability maps directly to weeks on that schedule.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'virginia',
    name: 'Virginia',
    abbreviation: 'VA',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 500,
    stateSpecificNotes:
      'PPD uses Virginia\'s own statutory schedule of weeks per body part (Va. Code § 65.2-503) — not the AMA Guides. The award is proportional to the partial loss of use of that body part.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    // C.R.S. § 8-42-105 sets no fixed week cap on TTD — it runs until MMI,
    // return to work, or a written release to return to work. Infinity (not
    // an invented finite number) keeps calculateTTD's existing cap comparison
    // mathematically correct without modifying that protected file — see
    // lib/calculations/workersComp.ts. The "104 weeks" figure that used to
    // appear here was not a real Colorado TTD cap.
    maxWeeksTTD: Infinity,
    stateSpecificNotes:
      'Colorado TTD (C.R.S. § 8-42-105) has no fixed week cap — it continues until maximum medical improvement, return to regular/modified work, or a written release to return to work. PPD uses AMA Guides-based impairment ratings (C.R.S. § 8-42-107) for scheduled body-part injuries; non-scheduled (whole-person) injuries use a different age/wage-adjusted formula not reflected in this calculator.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),

  withVerifiedWeeklyCap({
    slug: 'minnesota',
    name: 'Minnesota',
    abbreviation: 'MN',
    benefitRate: 0.6667,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 130,
    stateSpecificNotes:
      'Minnesota PPD is not weeks-based: a physician rates whole-body impairment as a percentage under the state\'s own Administrative Rules Chapter 5223 (not the AMA Guides by name), and that percentage is multiplied by a dollar figure from the statutory table in Minn. Stat. § 176.101, subd. 2a to produce a lump-sum award — not the scheduled-weeks formula this calculator uses.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  }),
]

/**
 * Tier 3 state pages pulled from indexing/internal links during the 2026-09-23
 * AdSense fix sprint — content was a stubbed template with no state-specific
 * editorial (see stateSpecificNotes above). Pages stayed live but noindexed
 * until each one got real state-specific content.
 *
 * Sprint C1 (2026-09-25) gave Georgia, Michigan, New Jersey, Virginia,
 * Colorado, and Minnesota real custom editorial content — see the
 * stateData.slug ternary in app/workers-comp-settlement-calculator/[state]/
 * page.tsx — so this set is now empty. Kept (rather than deleted) so a
 * future Tier 3 rollout state has somewhere to go.
 */
export const NOINDEXED_WORKERS_COMP_SLUGS = new Set<string>([])

/**
 * States where this calculator's generic PPD formula (AMA scheduled weeks ×
 * impairment % × weekly benefit) does not match the state's real PPD method.
 * On these states' pages, the PPD *output* is hidden (UI only) and replaced
 * with a short explanation of the actual method — see LEGAL-FIXES.md A.12.
 * State-specific PPD module planned — do not re-enable generic PPD here.
 */
export const NON_GENERIC_PPD_SLUGS = new Set(['michigan', 'minnesota', 'new-jersey', 'virginia'])

/**
 * Returns a single WorkersCompStateData entry by URL slug, or undefined when
 * the slug does not match any entry in WORKERS_COMP_STATES.
 */
export function getWorkersCompStateBySlug(slug: string): WorkersCompStateData | undefined {
  return WORKERS_COMP_STATES.find((s) => s.slug === slug)
}

/**
 * Returns all slugs formatted for Next.js generateStaticParams.
 * Shape matches getAllStateSlugs() in states.ts and getAllCarAccidentStateSlugs()
 * in carAccidentStates.ts for consistency across all three tools.
 */
export function getAllWorkersCompStateSlugs(): Array<{ state: string }> {
  return WORKERS_COMP_STATES.map((s) => ({ state: s.slug }))
}
