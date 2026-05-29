// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/carAccident.ts
// Tool #2 — Car Accident Settlement Calculator logic.
// Thin wrapper around painSuffering.ts — all core math stays in that file.
// Only Tool #2-specific concerns live here: policy limit advisory and the
// getFaultRuleLabel helper used by the result UI.
// ─────────────────────────────────────────────────────────────────────────────

import {
  calculateMultiplierMethod,
  calculatePerDiemMethod,
  sumSpecialDamages,
} from './painSuffering'
import type {
  CarAccidentInputs,
  CarAccidentPerDiemInputs,
  CarAccidentResult,
  MultiplierResult,
  PerDiemResult,
} from './types'

/**
 * Returns a plain-English warning string when the calculated total exceeds
 * the at-fault driver's known insurance policy limit, or null if no warning
 * is needed. This is purely advisory — it never changes the calculated total.
 */
export function policyLimitWarning(
  total: number,
  limit: number | undefined
): string | null {
  if (!limit || limit <= 0 || total <= limit) return null
  return `Your estimate exceeds the at-fault driver's policy limit of $${limit.toLocaleString()}. Actual recovery may be capped unless the driver has personal assets or you carry underinsured motorist (UIM) coverage.`
}

/**
 * Maps the internal FaultRule string to a concise human-readable label
 * suitable for the result card and state law callout in the UI.
 */
export function getFaultRuleLabel(faultRule: string): string {
  switch (faultRule) {
    case 'pure-comparative':
      return 'Pure Comparative Fault — any fault % still allows recovery'
    case 'modified-comparative-51':
      return 'Modified Comparative Fault — barred at 51% or more fault'
    case 'modified-comparative-50':
      return 'Modified Comparative Fault — barred at 50% or more fault'
    case 'contributory':
      return 'Contributory Negligence — any fault bars recovery entirely'
    default:
      return 'Comparative Fault'
  }
}

/**
 * Main Tool #2 calculation entry point.
 *
 * Accepts CarAccidentInputs (which extends EconomicDamages and adds
 * multiplier, plaintiffFaultPercent, and insurancePolicyLimit) and an
 * optional CarAccidentPerDiemInputs for the per diem method.
 *
 * The insurancePolicyLimit field is stripped before delegating to the base
 * painSuffering functions — those functions must not be modified per AGENTS.md.
 * The policy limit is only used for the advisory warning in the result.
 *
 * multiplierInputs is required (not nullable) because the car accident
 * calculator always runs the multiplier method as the primary calculation.
 * perDiemInputs is optional — pass null to skip the per diem method.
 */
export function calculateCarAccident(
  multiplierInputs: CarAccidentInputs,
  perDiemInputs: CarAccidentPerDiemInputs | null,
  stateSlug: string | null = null
): CarAccidentResult {
  // Destructure insurancePolicyLimit off the multiplier inputs before passing
  // to calculateMultiplierMethod, which only accepts MultiplierMethodInputs.
  const { insurancePolicyLimit, ...mInputs } = multiplierInputs

  // sumSpecialDamages on mInputs for the result (mirrors what calculateMultiplierMethod does
  // internally so the returned specialDamages is consistent).
  const specialDamages = sumSpecialDamages(mInputs)

  const multiplierResult: MultiplierResult = calculateMultiplierMethod(mInputs)

  // Per diem is optional — run only when perDiemInputs are provided.
  let perDiemResult: PerDiemResult | null = null
  if (perDiemInputs) {
    // Strip insurancePolicyLimit before delegating — same pattern as above.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { insurancePolicyLimit: _policyLimit, ...pdInputs } = perDiemInputs
    perDiemResult = calculatePerDiemMethod(pdInputs)
  }

  // Use adjustedTotal (post-fault-reduction) as the figure to compare against
  // the policy limit — this is the most accurate representation of what the
  // plaintiff would actually seek to recover.
  const total = multiplierResult.adjustedTotal

  return {
    multiplierResult,
    perDiemResult,
    specialDamages,
    policyLimitWarning: policyLimitWarning(total, insurancePolicyLimit),
    stateSlug,
    calculatedAt: new Date().toISOString(),
  }
}
