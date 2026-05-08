// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/painSuffering.ts
// Pure functions — no React, no side effects.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  EconomicDamages,
  MultiplierMethodInputs,
  PerDiemMethodInputs,
  MultiplierResult,
  PerDiemResult,
  PainSufferingCalculationResult,
  SeverityConfig,
  SeverityLevel,
  ValidationResult,
  ValidationError,
} from './types'

export const MULTIPLIER_MIN = 1.5
export const MULTIPLIER_MAX = 5.0
export const MULTIPLIER_STEP = 0.5
export const PER_DIEM_SOFT_MIN = 50
export const PER_DIEM_SOFT_MAX = 1000
export const RECOVERY_DAYS_MAX = 3650

export const SEVERITY_CONFIGS: Record<SeverityLevel, SeverityConfig> = {
  minor: {
    level: 'minor',
    label: 'Minor',
    multiplier: 1.5,
    description: 'Soft tissue injuries, full recovery expected, treatment under 3 months',
  },
  moderate: {
    level: 'moderate',
    label: 'Moderate',
    multiplier: 2.5,
    description: 'Fractures or sprains, 3–12 months of treatment, near-full recovery',
  },
  serious: {
    level: 'serious',
    label: 'Serious',
    multiplier: 3.5,
    description: 'Surgery required, 12+ months recovery, some permanent effects',
  },
  severe: {
    level: 'severe',
    label: 'Severe',
    multiplier: 4.5,
    description: 'Significant permanent injury, major impact on daily life and work',
  },
  catastrophic: {
    level: 'catastrophic',
    label: 'Catastrophic',
    multiplier: 5.0,
    description: 'Paralysis, traumatic brain injury, or permanent total disability',
  },
}

export const SEVERITY_LEVELS_ORDERED: SeverityLevel[] = [
  'minor',
  'moderate',
  'serious',
  'severe',
  'catastrophic',
]

export function sumSpecialDamages(damages: EconomicDamages): number {
  return (
    Math.max(0, damages.medicalBills) +
    Math.max(0, damages.futureMedical) +
    Math.max(0, damages.lostWages) +
    Math.max(0, damages.futureLostWages) +
    Math.max(0, damages.propertyDamage)
  )
}

export function clampMultiplier(value: number): number {
  return Math.min(MULTIPLIER_MAX, Math.max(MULTIPLIER_MIN, value))
}

export function calculateMultiplierMethod(inputs: MultiplierMethodInputs): MultiplierResult {
  const specialDamages = sumSpecialDamages(inputs)
  const multiplierUsed = clampMultiplier(inputs.multiplier)
  const painAndSuffering = specialDamages * multiplierUsed
  const totalEstimate = specialDamages + painAndSuffering
  const lowMultiplier = clampMultiplier(multiplierUsed - 0.5)
  const rangeLow = specialDamages + specialDamages * lowMultiplier
  const highMultiplier = clampMultiplier(multiplierUsed + 0.5)
  const rangeHigh = specialDamages + specialDamages * highMultiplier

  return {
    method: 'multiplier',
    specialDamages,
    multiplierUsed,
    painAndSuffering,
    totalEstimate,
    rangeLow,
    rangeHigh,
  }
}

export function calculatePerDiemMethod(inputs: PerDiemMethodInputs): PerDiemResult {
  const specialDamages = sumSpecialDamages(inputs)
  const dailyRateUsed = Math.max(0, inputs.dailyRate)
  const recoveryDaysUsed = Math.max(0, Math.min(inputs.recoveryDays, RECOVERY_DAYS_MAX))
  const painAndSuffering = dailyRateUsed * recoveryDaysUsed
  const totalEstimate = specialDamages + painAndSuffering

  return {
    method: 'per-diem',
    specialDamages,
    dailyRateUsed,
    recoveryDaysUsed,
    painAndSuffering,
    totalEstimate,
  }
}

export function calculatePainAndSuffering({
  multiplierInputs,
  perDiemInputs,
  stateSlug = null,
}: {
  multiplierInputs: MultiplierMethodInputs | null
  perDiemInputs: PerDiemMethodInputs | null
  stateSlug?: string | null
}): PainSufferingCalculationResult {
  const multiplierResult = multiplierInputs ? calculateMultiplierMethod(multiplierInputs) : null
  const perDiemResult = perDiemInputs ? calculatePerDiemMethod(perDiemInputs) : null
  const specialDamages =
    multiplierResult?.specialDamages ?? perDiemResult?.specialDamages ?? 0

  return {
    specialDamages,
    multiplierResult,
    perDiemResult,
    stateSlug,
    calculatedAt: new Date().toISOString(),
  }
}

export function validateEconomicDamages(damages: Partial<EconomicDamages>): ValidationResult {
  const errors: ValidationError[] = []
  const MAX_FIELD = 50_000_000
  const numericFields: Array<keyof EconomicDamages> = [
    'medicalBills',
    'futureMedical',
    'lostWages',
    'futureLostWages',
    'propertyDamage',
  ]

  for (const field of numericFields) {
    const value = damages[field]
    if (value === undefined || value === null || isNaN(Number(value))) {
      if (field === 'medicalBills') {
        errors.push({ field, message: 'Medical bills are required' })
      }
      continue
    }
    const n = Number(value)
    if (n < 0) {
      errors.push({ field, message: 'Value cannot be negative' })
    } else if (n > MAX_FIELD) {
      errors.push({ field, message: 'Value exceeds maximum allowed ($50,000,000)' })
    }
  }

  if (damages.medicalBills !== undefined && Number(damages.medicalBills) === 0) {
    errors.push({
      field: 'medicalBills',
      message: 'Enter your medical expenses to calculate pain & suffering damages',
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateMultiplierInputs(inputs: Partial<MultiplierMethodInputs>): ValidationResult {
  const errors: ValidationError[] = []
  if (
    inputs.multiplier === undefined ||
    isNaN(Number(inputs.multiplier)) ||
    Number(inputs.multiplier) < MULTIPLIER_MIN ||
    Number(inputs.multiplier) > MULTIPLIER_MAX
  ) {
    errors.push({
      field: 'multiplier',
      message: `Multiplier must be between ${MULTIPLIER_MIN} and ${MULTIPLIER_MAX}`,
    })
  }
  return { valid: errors.length === 0, errors }
}

export function validatePerDiemInputs(inputs: Partial<PerDiemMethodInputs>): ValidationResult {
  const errors: ValidationError[] = []
  const dailyRate = Number(inputs.dailyRate)
  const recoveryDays = Number(inputs.recoveryDays)

  if (!inputs.dailyRate || isNaN(dailyRate) || dailyRate <= 0) {
    errors.push({ field: 'dailyRate', message: 'Enter a daily rate greater than $0' })
  } else if (dailyRate > PER_DIEM_SOFT_MAX) {
    errors.push({
      field: 'dailyRate',
      message: `Daily rates above $${PER_DIEM_SOFT_MAX.toLocaleString()} are difficult to justify without attorney support`,
    })
  }

  if (!inputs.recoveryDays || isNaN(recoveryDays) || recoveryDays <= 0) {
    errors.push({ field: 'recoveryDays', message: 'Enter the number of days in recovery' })
  } else if (recoveryDays > RECOVERY_DAYS_MAX) {
    errors.push({
      field: 'recoveryDays',
      message: `Recovery period cannot exceed ${RECOVERY_DAYS_MAX} days (10 years)`,
    })
  }

  return { valid: errors.length === 0, errors }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function formatMultiplier(value: number): string {
  const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
  return `${formatted}x`
}

export function annualSalaryToDailyRate(annualSalary: number): number {
  if (annualSalary <= 0) return 0
  return Math.round(annualSalary / 365)
}

export function datesToRecoveryDays(injuryDate: Date, recoveryDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = recoveryDate.getTime() - injuryDate.getTime()
  return Math.max(0, Math.round(diff / msPerDay))
}
