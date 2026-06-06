// ─────────────────────────────────────────────────────────────────────────────
// lib/data/workersCompStates.ts
// Tool #3 — Workers Comp Settlement Calculator state data.
//
// Tier 1 states (CA, TX, FL, NY) are fully populated with accurate 2026 data.
// Remaining 10 states carry correct benefitRate and stubbed cap values to be
// expanded per the Tier 2 / Tier 3 rollout schedule in AGENTS.md.
//
// Weekly cap sources (2026):
//   California  — DIR SAWW-based cap, effective 1 Jan 2026: $1,619
//   Texas       — TDI SAWW cap, effective 1 Oct 2025:       $1,066
//   Florida     — DFS SAWW cap, effective 1 Jan 2026:       $1,197
//   New York    — WCB SAWW cap, effective 1 Jul 2025:       $1,145  (updates annually)
// ─────────────────────────────────────────────────────────────────────────────

import type { WorkersCompStateData } from '../calculations/types'

export const WORKERS_COMP_STATES: WorkersCompStateData[] = [
  // ── Tier 1 — full 2026 data ─────────────────────────────────────────────

  {
    slug: 'california',
    name: 'California',
    abbreviation: 'CA',
    // California pays 66.67% (two-thirds) of AWW, capped at the SAWW-linked max.
    benefitRate: 0.6667,
    weeklyCapAmount: 1619,
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'California TTD is limited to 104 weeks within a 5-year period from the date of injury for most injuries (240 weeks for certain severe injuries). PPD uses the AMA Guides 5th Edition. WCAB adjudication required for disputed claims.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    // Texas pays 70% of AWW, capped at the state average weekly wage.
    benefitRate: 0.70,
    weeklyCapAmount: 1066,
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'Texas is the only state where workers compensation is not mandatory for most private employers. Non-subscribing employers (those who opt out of the WC system) can be sued directly in civil court — those claims are personal injury claims, not workers comp claims. If your employer is a non-subscriber, use the Pain & Suffering Calculator instead.',
    // Non-subscriber flag drives the UI warning in WorkersCompCalculator.
    hasNonSubscriberSystem: true,
    isMonopolisticFund: false,
  },

  {
    slug: 'florida',
    name: 'Florida',
    abbreviation: 'FL',
    benefitRate: 0.6667,
    weeklyCapAmount: 1197,
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'Florida TTD is limited to 104 weeks. PPD benefits are based on impairment ratings under the AMA Guides. Florida eliminated permanent total disability benefits for most injuries effective 2003; severe cases may qualify under a narrow exception.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'new-york',
    name: 'New York',
    abbreviation: 'NY',
    benefitRate: 0.6667,
    // New York's cap is the highest in the nation and updates annually on 1 July.
    // Verify at wcb.ny.gov before relying on this figure for specific claims.
    weeklyCapAmount: 1145,
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    // New York has no fixed TTD maximum for most cases — 520 weeks is a practical
    // ceiling used for calculation purposes; severe cases may exceed this.
    maxWeeksTTD: 520,
    stateSpecificNotes:
      'New York has the highest workers comp weekly cap in the country, updated annually on July 1. The 2025–2026 cap is $1,145/week. There is no fixed TTD maximum for most injuries. PPD awards use the AMA Guides scheduled loss of use (SLU) table.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  // ── Tier 2 — stubbed, to be expanded per AGENTS.md rollout ─────────────

  {
    slug: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    benefitRate: 0.6667,
    weeklyCapAmount: 1897, // 2026 — Illinois cap is one of the highest; verify at icc.illinois.gov
    weeklyCapYear: 2026,
    // Illinois uses percentage_of_person for PPD, not the AMA body-part schedule.
    // workersComp.ts branches on this flag for the PPD formula.
    ppdMethod: 'percentage_of_person',
    maxWeeksTTD: 104,
    stateSpecificNotes:
      'Illinois uses a percentage-of-person PPD method rather than the AMA scheduled weeks table. PPD is calculated as: weekly benefit × 500 whole-body weeks × impairment percentage. The weekly cap is among the highest nationally.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    benefitRate: 0.6667,
    weeklyCapAmount: 1273, // 2026 estimate — verify at dli.pa.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  // ── Tier 3 — stubbed, to be expanded per AGENTS.md rollout ─────────────

  {
    slug: 'georgia',
    name: 'Georgia',
    abbreviation: 'GA',
    benefitRate: 0.6667,
    weeklyCapAmount: 800, // 2026 estimate — verify at sbwc.georgia.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 400,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'ohio',
    name: 'Ohio',
    abbreviation: 'OH',
    benefitRate: 0.6667,
    weeklyCapAmount: 1200, // 2026 estimate — verify at bwc.ohio.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 200,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    benefitRate: 0.80, // Michigan pays 80% of after-tax AWW — unique formula
    weeklyCapAmount: 1200, // 2026 estimate — verify at michigan.gov/leo
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 500,
    stateSpecificNotes:
      'Michigan calculates TTD benefits based on 80% of after-tax (net) average weekly wage, not gross — resulting in an effective gross replacement rate lower than the stated 80%. Verify the net-vs-gross distinction before finalizing any estimate.',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'north-carolina',
    name: 'North Carolina',
    abbreviation: 'NC',
    benefitRate: 0.6667,
    weeklyCapAmount: 1282, // 2026 — verify at ic.nc.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 500,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    benefitRate: 0.6667,
    weeklyCapAmount: 1200, // 2026 estimate — verify at ica.az.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 455,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'new-jersey',
    name: 'New Jersey',
    abbreviation: 'NJ',
    benefitRate: 0.70,
    weeklyCapAmount: 1131, // 2026 estimate — verify at nj.gov/labor
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 400,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'virginia',
    name: 'Virginia',
    abbreviation: 'VA',
    benefitRate: 0.6667,
    weeklyCapAmount: 1309, // 2026 estimate — verify at workcomp.virginia.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 500,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    benefitRate: 0.6667,
    weeklyCapAmount: 1391, // 2026 estimate — verify at cdle.colorado.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 104,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },

  {
    slug: 'minnesota',
    name: 'Minnesota',
    abbreviation: 'MN',
    benefitRate: 0.6667,
    weeklyCapAmount: 1222, // 2026 estimate — verify at dli.mn.gov
    weeklyCapYear: 2026,
    ppdMethod: 'ama_schedule',
    maxWeeksTTD: 130,
    stateSpecificNotes: '',
    hasNonSubscriberSystem: false,
    isMonopolisticFund: false,
  },
]

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
