// ─────────────────────────────────────────────────────────────────────────────
// lib/severityRange.ts
// The "what if severity were rated one level lower / higher" range shown on
// the multiplier-method result card (Tools #1 and #2). It re-runs the
// protected calculateMultiplierMethod() with the adjacent severity levels
// from SEVERITY_LEVELS_ORDERED / SEVERITY_CONFIGS — the same values the
// MultiplierSelector offers — and reports each adjusted (post-fault) total.
// No new math: every figure comes from the existing calculation function.
// At the ends of the scale (Minor, Catastrophic) only the side that exists is
// returned. Per diem and workers comp produce no range and never call this.
// ─────────────────────────────────────────────────────────────────────────────

import { calculateMultiplierMethod, SEVERITY_CONFIGS, SEVERITY_LEVELS_ORDERED } from './calculations/painSuffering'
import type { MultiplierMethodInputs } from './calculations/types'

export interface SeveritySide {
  /** e.g. "Minor" */
  label: string
  /** e.g. 1.5 */
  multiplier: number
  /** Adjusted total (after any fault reduction) at that severity */
  total: number
}

export interface SeverityRange {
  /** The current estimate (post-fault) */
  likely: number
  /** Present unless the current level is Minor */
  lower?: SeveritySide
  /** Present unless the current level is Catastrophic */
  higher?: SeveritySide
}

/**
 * Build the adjacent-severity range for a multiplier-method estimate.
 * Returns null when the multiplier does not match a severity level (the
 * calculators only ever pass SEVERITY_CONFIGS values, so this is defensive).
 */
export function getAdjacentSeverityRange(inputs: MultiplierMethodInputs, likely: number): SeverityRange | null {
  const idx = SEVERITY_LEVELS_ORDERED.findIndex((level) => SEVERITY_CONFIGS[level].multiplier === inputs.multiplier)
  if (idx === -1) return null

  const side = (i: number): SeveritySide | undefined => {
    const level = SEVERITY_LEVELS_ORDERED[i]
    if (!level) return undefined
    const cfg = SEVERITY_CONFIGS[level]
    const result = calculateMultiplierMethod({ ...inputs, multiplier: cfg.multiplier })
    return { label: cfg.label, multiplier: cfg.multiplier, total: result.adjustedTotal }
  }

  return { likely, lower: side(idx - 1), higher: side(idx + 1) }
}
