// ─────────────────────────────────────────────────────────────────────────────
// lib/data/carAccidentStates.ts
// Tool #2 — Car Accident Settlement Calculator state data.
// All 14 states from states.ts are represented here with car-accident-specific
// fields. California and Texas are fully populated. Florida and New York carry
// their distinct no-fault/threshold notes. The remaining 10 states use correct
// faultRule and SOL values from states.ts with placeholder settlement ranges
// to be expanded per the Tier 2 / Tier 3 rollout schedule in AGENTS.md.
// ─────────────────────────────────────────────────────────────────────────────

import type { FaultRule } from '../calculations/types'

export interface CarAccidentStateData {
  slug: string
  name: string
  abbreviation: string
  faultRule: FaultRule
  faultRuleLabel: string
  /** Years from date of accident to file suit (general personal injury SOL). */
  statuteOfLimitations: number
  /** True when the state requires PIP and imposes a pain & suffering threshold. */
  isNoFaultState: boolean
  /** Conservative low end of observed non-economic settlement ranges for car accidents. */
  avgSettlementLow: number
  /** Conservative high end of observed non-economic settlement ranges for car accidents. */
  avgSettlementHigh: number
  /** Short plain-English summary of the state rules most relevant to car accident claims. */
  stateSpecificNotes: string
}

export const CAR_ACCIDENT_STATES: CarAccidentStateData[] = [
  // ── TIER 1 LAUNCH STATES ──────────────────────────────────────────────────

  {
    slug: 'california',
    name: 'California',
    abbreviation: 'CA',
    faultRule: 'pure-comparative',
    faultRuleLabel: 'Pure Comparative Fault',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 25000,
    avgSettlementHigh: 150000,
    stateSpecificNotes:
      'Pure comparative fault — any fault percentage still allows recovery, with your award reduced proportionally. No statutory cap on non-economic damages for general personal injury including car accidents. MICRA cap applies only to medical malpractice. Los Angeles and San Francisco juries produce some of the highest car accident verdicts in the country.',
  },
  {
    slug: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 20000,
    avgSettlementHigh: 120000,
    stateSpecificNotes:
      '51% bar — if you are found 51% or more at fault you recover nothing. At 50% or less, your award is reduced by your fault percentage. Texas imposes no general cap on non-economic damages for car accidents. Med mal cap is $250k–$750k but does not apply to car accident claims. Insurance adjusters in Houston and Dallas aggressively dispute fault to push plaintiffs toward or past the 51% bar.',
  },

  // ── TIER 2 — 30 DAYS AFTER LAUNCH ────────────────────────────────────────

  {
    slug: 'florida',
    name: 'Florida',
    abbreviation: 'FL',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: true,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes:
      'Modified comparative fault (51% bar) since March 2023 (HB 837) — Florida changed from pure comparative fault. PIP coverage of $10,000 minimum is still required. To recover pain and suffering from the at-fault driver you must meet the permanent injury threshold: significant and permanent loss of an important bodily function, permanent injury within reasonable medical probability, significant and permanent scarring or disfigurement, or death. Statute of limitations reduced from 4 years to 2 years by HB 837.',
  },
  {
    slug: 'new-york',
    name: 'New York',
    abbreviation: 'NY',
    faultRule: 'pure-comparative',
    faultRuleLabel: 'Pure Comparative Fault',
    statuteOfLimitations: 3,
    isNoFaultState: true,
    avgSettlementLow: 30000,
    avgSettlementHigh: 200000,
    stateSpecificNotes:
      'Pure comparative fault — damages reduced by fault percentage, no recovery bar at any fault level. No-fault state: PIP up to $50,000 covers medical bills and lost wages regardless of fault. Serious injury threshold must be met before you can sue the at-fault driver for pain and suffering — qualifying categories include significant limitation of use of a body function or system, permanent consequential limitation, or 90/180-day disability. Claims against NYC or NYS government require a notice of claim within 90 days.',
  },

  // ── TIER 3 — 90 DAYS AFTER LAUNCH ────────────────────────────────────────

  {
    slug: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: true,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    abbreviation: 'GA',
    faultRule: 'modified-comparative-50',
    faultRuleLabel: 'Modified Comparative Fault (50% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'ohio',
    name: 'Ohio',
    abbreviation: 'OH',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    faultRule: 'pure-comparative',
    faultRuleLabel: 'Pure Comparative Fault',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },

  // ── REMAINING ACTIVE STATES ───────────────────────────────────────────────

  {
    slug: 'washington',
    name: 'Washington',
    abbreviation: 'WA',
    faultRule: 'pure-comparative',
    faultRuleLabel: 'Pure Comparative Fault',
    statuteOfLimitations: 3,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    faultRule: 'modified-comparative-50',
    faultRuleLabel: 'Modified Comparative Fault (50% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 3,
    isNoFaultState: true,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'nevada',
    name: 'Nevada',
    abbreviation: 'NV',
    faultRule: 'modified-comparative-51',
    faultRuleLabel: 'Modified Comparative Fault (51% Bar)',
    statuteOfLimitations: 2,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    abbreviation: 'NC',
    faultRule: 'contributory',
    faultRuleLabel: 'Contributory Negligence',
    statuteOfLimitations: 3,
    isNoFaultState: false,
    avgSettlementLow: 15000,
    avgSettlementHigh: 100000,
    stateSpecificNotes: '',
  },
]

/**
 * Returns a single CarAccidentStateData entry by URL slug, or undefined if
 * the slug does not match any entry in CAR_ACCIDENT_STATES.
 */
export function getCarAccidentStateBySlug(slug: string): CarAccidentStateData | undefined {
  return CAR_ACCIDENT_STATES.find((s) => s.slug === slug)
}

/**
 * Returns all slugs formatted for Next.js generateStaticParams.
 * Shape matches getAllStateSlugs() in states.ts for consistency.
 */
export function getAllCarAccidentStateSlugs(): Array<{ state: string }> {
  return CAR_ACCIDENT_STATES.map((s) => ({ state: s.slug }))
}
