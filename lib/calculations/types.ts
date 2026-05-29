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
