// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/types.ts
// Shared TypeScript types across all three calculator tools.
// ─────────────────────────────────────────────────────────────────────────────

export interface EconomicDamages {
  medicalBills: number
  futureMedical: number
  lostWages: number
  futureLostWages: number
  propertyDamage: number
}

export interface MultiplierMethodInputs extends EconomicDamages {
  multiplier: number
  /** Plaintiff's share of fault, 0–99. Defaults to 0 (other party fully at fault).
   *  Property damage intentionally excluded from the multiplier base but still
   *  included in specialDamages / totalEstimate before fault reduction. */
  plaintiffFaultPercent?: number
}

export interface PerDiemMethodInputs extends EconomicDamages {
  dailyRate: number
  recoveryDays: number
}

export type SeverityLevel =
  | 'minor'
  | 'moderate'
  | 'serious'
  | 'severe'
  | 'catastrophic'

export interface SeverityConfig {
  level: SeverityLevel
  label: string
  multiplier: number
  description: string
}

export interface MultiplierResult {
  method: 'multiplier'
  specialDamages: number
  multiplierUsed: number
  painAndSuffering: number
  /** Pre-fault-reduction total (specialDamages + painAndSuffering) */
  totalEstimate: number
  /** Plaintiff fault percentage actually applied (0–99, clamped) */
  plaintiffFaultPercent: number
  /** Dollar amount removed due to plaintiff fault */
  faultReduction: number
  /** Final total after fault reduction applied — use this as the displayed total */
  adjustedTotal: number
  rangeLow: number
  rangeHigh: number
}

export interface PerDiemResult {
  method: 'per-diem'
  specialDamages: number
  dailyRateUsed: number
  recoveryDaysUsed: number
  painAndSuffering: number
  totalEstimate: number
}

export interface PainSufferingCalculationResult {
  specialDamages: number
  multiplierResult: MultiplierResult | null
  perDiemResult: PerDiemResult | null
  stateSlug: string | null
  calculatedAt: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export type FaultRule =
  | 'pure-comparative'
  | 'modified-comparative-50'
  | 'modified-comparative-51'
  | 'contributory'

export interface StateData {
  slug: string
  name: string
  abbreviation: string
  hasDamageCap: boolean
  damageCap: number | null
  damageCapNotes: string
  isNoFaultState: boolean
  faultRule: FaultRule
  faultRuleLabel: string
  faultRuleExplanation: string
  statuteOfLimitations: number
  solNotes: string
  cpcMultiplier: number
  metaDescription: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool #2 — Car Accident Calculator types
// ─────────────────────────────────────────────────────────────────────────────

export interface CarAccidentInputs extends EconomicDamages {
  multiplier: number
  /** Plaintiff's share of fault, 0–99. Mirrors MultiplierMethodInputs.plaintiffFaultPercent. */
  plaintiffFaultPercent?: number
  /** Advisory only — triggers a warning in the UI when the estimate exceeds this value. */
  insurancePolicyLimit?: number
}

export interface CarAccidentPerDiemInputs extends EconomicDamages {
  dailyRate: number
  recoveryDays: number
  /** Advisory only — passed through for policyLimitWarning check. */
  insurancePolicyLimit?: number
}

export interface CarAccidentResult {
  multiplierResult: MultiplierResult | null
  perDiemResult: PerDiemResult | null
  specialDamages: number
  /** Null when no policy limit supplied or estimate is within the limit. */
  policyLimitWarning: string | null
  stateSlug: string | null
  calculatedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool #3 — Workers Comp Calculator types
// ─────────────────────────────────────────────────────────────────────────────

/** The three benefit types the workers comp calculator can produce. */
export type BenefitType = 'ttd' | 'ppd' | 'ptd'

/**
 * PPD (Permanent Partial Disability) calculation method.
 * Most states use the AMA Guides scheduled-weeks table per body part.
 * Illinois uses a percentage-of-person approach (500 whole-body weeks × pct).
 */
export type PPDMethod = 'ama_schedule' | 'percentage_of_person'

export interface WorkersCompInputs {
  /** Two-letter state slug, e.g. 'california'. */
  state: string
  /** Which benefit type to calculate. */
  benefitType: BenefitType
  /** Average Weekly Wage — gross earnings divided by weeks worked. */
  averageWeeklyWage: number
  /** Whether the claimant has retained an attorney — applies ×1.25 adjustment. */
  hasAttorney: boolean
  // TTD fields
  /** Number of weeks of temporary total disability treatment. Required for TTD. */
  treatmentWeeks?: number
  // PPD fields
  /** Key from BODY_PARTS — identifies the injured body part. Required for PPD. */
  bodyPartKey?: string
  /** Whole-person impairment percentage (0–100). Required for PPD and PTD. */
  impairmentPercent?: number
  // PTD fields
  /** Claimant's age at time of injury — used for life-expectancy PTD calculation. */
  claimantAge?: number
}

export interface WorkersCompResult {
  benefitType: BenefitType
  /** Capped weekly benefit after applying stateRate and weeklyCap. */
  weeklyBenefit: number
  /** Settlement before attorney adjustment. */
  baseSettlement: number
  /** Settlement after attorney adjustment (×1.25 if hasAttorney, else equals baseSettlement). */
  adjustedSettlement: number
  /** Whether the ×1.25 attorney adjustment was applied. */
  hasAttorneyAdjustment: boolean
  /** TTD: treatmentWeeks. PPD: scheduledWeeks × impairmentPct / 100. PTD: lifeExpectancyYears × 52. */
  weeksCovered?: number
  /** The state's weekly benefit cap in dollars (from WorkersCompStateData). */
  stateWeeklyCap: number
  /** The state's compensation rate as a decimal (e.g. 0.667 for 66.67%). */
  stateBenefitRate: number
  /** Which PPD method was used — only present on PPD results. */
  ppdMethod?: PPDMethod
  /** Non-fatal advisory messages, e.g. Texas non-subscriber warning. */
  warnings: string[]
  calculatedAt: string
}

export interface WorkersCompStateData {
  slug: string
  name: string
  abbreviation: string
  /** Compensation rate as a decimal, e.g. 0.667 for 66.67%. */
  benefitRate: number
  /** Maximum weekly benefit amount in dollars. */
  weeklyCapAmount: number
  /** Calendar year the weeklyCapAmount applies to. */
  weeklyCapYear: number
  /** PPD calculation method for this state. */
  ppdMethod: PPDMethod
  /** Maximum TTD duration in weeks. */
  maxWeeksTTD: number
  /** Plain-English notes about state-specific rules shown in the UI. */
  stateSpecificNotes: string
  /**
   * Texas-specific: employers who opt out of the workers comp system are called
   * non-subscribers. Injured workers sue them via personal injury, not WC.
   * The calculator surfaces a warning when this is true.
   */
  hasNonSubscriberSystem: boolean
  /**
   * True for Washington and Wyoming — monopolistic state fund states where
   * private insurance is banned. These states are skipped per AGENTS.md.
   */
  isMonopolisticFund: boolean
}

export interface BodyPartData {
  /** Unique key used as the select option value, e.g. 'arm', 'great_toe'. */
  key: string
  /** Human-readable label shown in the UI. */
  label: string
  /**
   * AMA Guides scheduled weeks of compensation for permanent loss of this body part.
   * For non-scheduled injuries (back/spine, whole body) this is the whole-body
   * weeks figure used in the percentage-of-person formula.
   */
  scheduledWeeks: number
  /**
   * True when this body part appears on the AMA scheduled-award table.
   * False for whole-body / spine injuries, which require the percentage-of-person
   * formula regardless of the state's default ppdMethod.
   */
  isScheduled: boolean
  /** UI grouping label, e.g. 'Upper Extremity', 'Lower Extremity', 'Sensory'. */
  category: string
}
