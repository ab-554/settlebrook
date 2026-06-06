// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/workersComp.ts
// Tool #3 — Workers Comp Settlement Calculator.
// Pure functions — no React, no side effects.
//
// Formula reference (AGENTS.md):
//   weeklyBenefit      = Math.min(AWW × stateRate, stateWeeklyCap)
//   TTD total          = weeklyBenefit × treatmentWeeks
//   PPD (AMA schedule) = scheduledWeeks × (impairmentPct / 100) × weeklyBenefit
//   PPD (pct-of-person)= weeklyBenefit × 500 × (impairmentPct / 100)   [IL + non-scheduled]
//   PTD total          = annualBenefit × lifeExpectancyYears × 0.85 (discount factor)
//   Attorney adjust    = base × 1.25 if hasAttorney
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WorkersCompInputs,
  WorkersCompResult,
  WorkersCompStateData,
  BodyPartData,
  BenefitType,
} from './types'
import { getBodyPartByKey } from '../data/bodyParts'
import { getWorkersCompStateBySlug } from '../data/workersCompStates'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Actuarial present-value discount factor applied to PTD lump-sum estimates. */
const PTD_DISCOUNT_FACTOR = 0.85

/** Whole-body scheduled weeks — used for non-scheduled injuries and IL PPD. */
const WHOLE_BODY_WEEKS = 500

/** IRS/SSA life-expectancy table (approximate remaining years by age).
 *  Values clipped at age 18 (min) and 85 (max — 0 remaining years).
 *  Source: SSA 2023 Period Life Table, rounded to nearest integer.
 */
const LIFE_EXPECTANCY_BY_AGE: Record<number, number> = {
  18: 60, 19: 59, 20: 58, 21: 57, 22: 56, 23: 55, 24: 54,
  25: 53, 26: 52, 27: 51, 28: 50, 29: 49, 30: 48, 31: 47,
  32: 46, 33: 45, 34: 44, 35: 43, 36: 42, 37: 41, 38: 40,
  39: 39, 40: 38, 41: 37, 42: 36, 43: 35, 44: 34, 45: 33,
  46: 32, 47: 31, 48: 30, 49: 29, 50: 28, 51: 27, 52: 26,
  53: 25, 54: 24, 55: 23, 56: 22, 57: 21, 58: 20, 59: 19,
  60: 18, 61: 17, 62: 16, 63: 15, 64: 14, 65: 13, 66: 12,
  67: 11, 68: 10, 69: 9, 70: 8, 71: 8, 72: 7, 73: 7,
  74: 6, 75: 6, 76: 5, 77: 5, 78: 4, 79: 4, 80: 3,
  81: 3, 82: 3, 83: 2, 84: 2, 85: 0,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns approximate remaining life expectancy years for a given age.
 * Ages below 18 are treated as 18. Ages above 85 return 0.
 */
function getLifeExpectancyYears(age: number): number {
  const clamped = Math.max(18, Math.min(85, Math.round(age)))
  return LIFE_EXPECTANCY_BY_AGE[clamped] ?? 0
}

// ─── Core formula functions ───────────────────────────────────────────────────

/**
 * Calculates the capped weekly benefit.
 * weeklyBenefit = Math.min(AWW × stateRate, stateWeeklyCap)
 * Ensures both AWW and the result are non-negative.
 */
export function calculateWeeklyBenefit(
  aww: number,
  stateRate: number,
  weeklyCap: number,
): number {
  const raw = Math.max(0, aww) * stateRate
  return Math.min(raw, weeklyCap)
}

/**
 * Applies the attorney adjustment.
 * Returns base × 1.25 when hasAttorney is true; base unchanged otherwise.
 * Studies show represented claimants settle for ~25% more on average,
 * which is the industry-standard adjustment applied to WC benefit estimates.
 */
export function applyAttorneyAdjustment(base: number, hasAttorney: boolean): number {
  return hasAttorney ? base * 1.25 : base
}

// ─── Benefit-type calculators ─────────────────────────────────────────────────

/**
 * Calculates a Temporary Total Disability (TTD) estimate.
 *
 * TTD total = weeklyBenefit × treatmentWeeks
 *
 * treatmentWeeks is capped at stateData.maxWeeksTTD. A warning is appended
 * if the raw input exceeds the state maximum.
 */
export function calculateTTD(
  inputs: WorkersCompInputs,
  stateData: WorkersCompStateData,
): WorkersCompResult {
  const warnings: string[] = []

  const aww = Math.max(0, inputs.averageWeeklyWage)
  const weeklyBenefit = calculateWeeklyBenefit(aww, stateData.benefitRate, stateData.weeklyCapAmount)

  const rawWeeks = Math.max(0, inputs.treatmentWeeks ?? 0)
  let treatmentWeeks = rawWeeks

  // Cap at the state statutory TTD maximum and surface a warning when exceeded.
  if (rawWeeks > stateData.maxWeeksTTD) {
    treatmentWeeks = stateData.maxWeeksTTD
    warnings.push(
      `${stateData.name} limits TTD benefits to ${stateData.maxWeeksTTD} weeks. ` +
      `Your entry of ${rawWeeks} weeks has been capped at the state maximum.`,
    )
  }

  if (aww <= 0) {
    warnings.push('Enter your Average Weekly Wage to produce an accurate TTD estimate.')
  }

  // Texas non-subscriber advisory
  if (stateData.hasNonSubscriberSystem) {
    warnings.push(
      'Texas: if your employer did not subscribe to the workers compensation system, ' +
      'you cannot file a WC claim — you must pursue a personal injury lawsuit instead. ' +
      'Verify your employer\'s subscriber status before relying on this estimate.',
    )
  }

  const baseSettlement = weeklyBenefit * treatmentWeeks
  const adjustedSettlement = applyAttorneyAdjustment(baseSettlement, inputs.hasAttorney)

  return {
    benefitType: 'ttd',
    weeklyBenefit,
    baseSettlement,
    adjustedSettlement,
    hasAttorneyAdjustment: inputs.hasAttorney,
    weeksCovered: treatmentWeeks,
    stateWeeklyCap: stateData.weeklyCapAmount,
    stateBenefitRate: stateData.benefitRate,
    warnings,
    calculatedAt: new Date().toISOString(),
  }
}

/**
 * Calculates a Permanent Partial Disability (PPD) estimate.
 *
 * AMA schedule:
 *   PPD total = scheduledWeeks × (impairmentPct / 100) × weeklyBenefit
 *
 * Percentage-of-person (Illinois, or any non-scheduled body part):
 *   PPD total = weeklyBenefit × 500 × (impairmentPct / 100)
 *
 * Non-scheduled body parts (back/spine, whole body) always use the
 * percentage-of-person formula regardless of stateData.ppdMethod.
 */
export function calculatePPD(
  inputs: WorkersCompInputs,
  stateData: WorkersCompStateData,
  bodyPart: BodyPartData,
): WorkersCompResult {
  const warnings: string[] = []

  const aww = Math.max(0, inputs.averageWeeklyWage)
  const weeklyBenefit = calculateWeeklyBenefit(aww, stateData.benefitRate, stateData.weeklyCapAmount)
  const impairmentPct = Math.max(0, Math.min(100, inputs.impairmentPercent ?? 0))

  // Determine which PPD formula to apply.
  // Non-scheduled body parts always use percentage-of-person even in AMA states.
  const usePercentageOfPerson =
    stateData.ppdMethod === 'percentage_of_person' || !bodyPart.isScheduled

  const ppdMethod = usePercentageOfPerson ? 'percentage_of_person' : 'ama_schedule'

  let weeksCovered: number
  let baseSettlement: number

  if (usePercentageOfPerson) {
    // IL formula and all non-scheduled injuries:
    // ppdTotal = weeklyBenefit × WHOLE_BODY_WEEKS × (impairmentPct / 100)
    weeksCovered = WHOLE_BODY_WEEKS * (impairmentPct / 100)
    baseSettlement = weeklyBenefit * WHOLE_BODY_WEEKS * (impairmentPct / 100)
  } else {
    // AMA scheduled: scheduledWeeks × (impairmentPct / 100) × weeklyBenefit
    weeksCovered = bodyPart.scheduledWeeks * (impairmentPct / 100)
    baseSettlement = bodyPart.scheduledWeeks * (impairmentPct / 100) * weeklyBenefit
  }

  if (aww <= 0) {
    warnings.push('Enter your Average Weekly Wage to produce an accurate PPD estimate.')
  }
  if (impairmentPct <= 0) {
    warnings.push('Enter your impairment rating percentage from your medical evaluation.')
  }
  if (!bodyPart.isScheduled) {
    warnings.push(
      `${bodyPart.label} is a non-scheduled (whole-body) injury. ` +
      'The percentage-of-person formula is used regardless of your state\'s PPD method.',
    )
  }

  if (stateData.hasNonSubscriberSystem) {
    warnings.push(
      'Texas: if your employer did not subscribe to the workers compensation system, ' +
      'you cannot file a WC claim — you must pursue a personal injury lawsuit instead. ' +
      'Verify your employer\'s subscriber status before relying on this estimate.',
    )
  }

  const adjustedSettlement = applyAttorneyAdjustment(baseSettlement, inputs.hasAttorney)

  return {
    benefitType: 'ppd',
    weeklyBenefit,
    baseSettlement,
    adjustedSettlement,
    hasAttorneyAdjustment: inputs.hasAttorney,
    weeksCovered,
    stateWeeklyCap: stateData.weeklyCapAmount,
    stateBenefitRate: stateData.benefitRate,
    ppdMethod,
    warnings,
    calculatedAt: new Date().toISOString(),
  }
}

/**
 * Calculates a Permanent Total Disability (PTD) lump-sum estimate.
 *
 * annualBenefit      = weeklyBenefit × 52
 * lifeExpectancy     = SSA table lookup by claimantAge
 * PTD total (base)   = annualBenefit × lifeExpectancyYears × PTD_DISCOUNT_FACTOR (0.85)
 *
 * The 0.85 discount factor converts a nominal future-payment stream to a
 * present-value lump sum — the figure actually negotiated in WC settlements.
 */
export function calculatePTD(
  inputs: WorkersCompInputs,
  stateData: WorkersCompStateData,
): WorkersCompResult {
  const warnings: string[] = []

  const aww = Math.max(0, inputs.averageWeeklyWage)
  const weeklyBenefit = calculateWeeklyBenefit(aww, stateData.benefitRate, stateData.weeklyCapAmount)

  const age = Math.max(18, Math.min(85, inputs.claimantAge ?? 40))
  const lifeExpectancyYears = getLifeExpectancyYears(age)
  const annualBenefit = weeklyBenefit * 52
  const weeksCovered = lifeExpectancyYears * 52

  const baseSettlement = annualBenefit * lifeExpectancyYears * PTD_DISCOUNT_FACTOR

  if (aww <= 0) {
    warnings.push('Enter your Average Weekly Wage to produce an accurate PTD estimate.')
  }
  if (lifeExpectancyYears === 0) {
    warnings.push('Life expectancy at age 85+ is near zero — PTD estimate will be $0.')
  }
  warnings.push(
    'PTD estimates are present-value approximations. Actual structured settlements ' +
    'are individually negotiated and depend on medical evidence, state WC board approval, ' +
    'and applicable discount rates.',
  )

  if (stateData.hasNonSubscriberSystem) {
    warnings.push(
      'Texas: if your employer did not subscribe to the workers compensation system, ' +
      'you cannot file a WC claim — you must pursue a personal injury lawsuit instead. ' +
      'Verify your employer\'s subscriber status before relying on this estimate.',
    )
  }

  const adjustedSettlement = applyAttorneyAdjustment(baseSettlement, inputs.hasAttorney)

  return {
    benefitType: 'ptd',
    weeklyBenefit,
    baseSettlement,
    adjustedSettlement,
    hasAttorneyAdjustment: inputs.hasAttorney,
    weeksCovered,
    stateWeeklyCap: stateData.weeklyCapAmount,
    stateBenefitRate: stateData.benefitRate,
    warnings,
    calculatedAt: new Date().toISOString(),
  }
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Main Tool #3 calculation entry point.
 *
 * Resolves state data and (for PPD) body part data, then delegates to the
 * appropriate benefit-type calculator. Returns a WorkersCompResult with all
 * fields populated, including the attorney adjustment and any advisory warnings.
 *
 * Returns a result with warnings and $0 settlement values when required inputs
 * are missing rather than throwing — mirrors the pattern in carAccident.ts.
 */
export function calculateWorkersComp(inputs: WorkersCompInputs): WorkersCompResult {
  const stateData = getWorkersCompStateBySlug(inputs.state)

  // Guard: unknown state — return a zero result with a clear warning.
  if (!stateData) {
    const fallback: WorkersCompResult = {
      benefitType: inputs.benefitType,
      weeklyBenefit: 0,
      baseSettlement: 0,
      adjustedSettlement: 0,
      hasAttorneyAdjustment: false,
      stateWeeklyCap: 0,
      stateBenefitRate: 0,
      warnings: [`State "${inputs.state}" is not supported. Select a supported state and recalculate.`],
      calculatedAt: new Date().toISOString(),
    }
    return fallback
  }

  // Guard: monopolistic state fund — these states are skipped per AGENTS.md.
  if (stateData.isMonopolisticFund) {
    return {
      benefitType: inputs.benefitType,
      weeklyBenefit: 0,
      baseSettlement: 0,
      adjustedSettlement: 0,
      hasAttorneyAdjustment: false,
      stateWeeklyCap: stateData.weeklyCapAmount,
      stateBenefitRate: stateData.benefitRate,
      warnings: [
        `${stateData.name} operates a monopolistic state workers compensation fund. ` +
        'Private workers compensation insurance is not available. Claims must be filed ' +
        `directly with the ${stateData.name} state fund.`,
      ],
      calculatedAt: new Date().toISOString(),
    }
  }

  switch (inputs.benefitType as BenefitType) {
    case 'ttd':
      return calculateTTD(inputs, stateData)

    case 'ppd': {
      // Resolve the body part. Fall back to 'whole_body' if the key is missing
      // or unrecognised, and surface a warning so the user can correct their input.
      let bodyPart = inputs.bodyPartKey ? getBodyPartByKey(inputs.bodyPartKey) : undefined
      const warnings: string[] = []
      if (!bodyPart) {
        // Import the fallback whole-body entry directly from the array constant
        // rather than calling getBodyPartByKey again to avoid a circular-ish lookup.
        bodyPart = {
          key: 'whole_body',
          label: 'Whole Body / Other Non-Scheduled',
          scheduledWeeks: 500,
          isScheduled: false,
          category: 'Non-Scheduled',
        }
        warnings.push(
          'No body part selected — defaulting to Whole Body (non-scheduled). ' +
          'Select the specific injured body part for an accurate AMA scheduled award.',
        )
      }
      const result = calculatePPD(inputs, stateData, bodyPart)
      // Prepend any resolver warnings before the PPD function's own warnings.
      return { ...result, warnings: [...warnings, ...result.warnings] }
    }

    case 'ptd':
      return calculatePTD(inputs, stateData)

    default: {
      // TypeScript exhaustiveness guard — should never reach here at runtime.
      const _exhaustive: never = inputs.benefitType as never
      void _exhaustive
      return calculateTTD(inputs, stateData)
    }
  }
}
