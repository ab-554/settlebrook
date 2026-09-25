// ─────────────────────────────────────────────────────────────────────────────
// lib/faultRules.ts
// Shared, data-driven fault-rule evaluation for the result cards of Tools #1
// and #2. The warning a user sees must come from the state's own `faultRule`
// (lib/data/states.ts / carAccidentStates.ts) — never from a hardcoded state
// name — so that, e.g., a pure-comparative state (California) never shows a
// contributory-negligence bar and a contributory state (North Carolina) warns
// on ANY fault. This is UI classification only; it does not touch the
// formulas in lib/calculations/*.
// ─────────────────────────────────────────────────────────────────────────────

import type { FaultRule } from './calculations/types'

export type FaultBarStatus =
  | 'none'          // pure comparative, or fault below the state's bar
  | 'contributory'  // contributory-negligence state and fault > 0 → recovery barred
  | 'modified-bar'  // modified comparative state and fault at/over its bar → recovery barred

/**
 * Classify a plaintiff's fault percentage against a state's fault rule.
 *
 * - pure-comparative        → never barred (award is only reduced by the percentage)
 * - modified-comparative-50 → barred when fault reaches 50% ("50% bar": equal fault loses)
 * - modified-comparative-51 → barred when fault reaches 51% ("51% bar": >50% loses)
 * - contributory            → barred on any fault at all
 */
export function getFaultBarStatus(faultRule: FaultRule | undefined | null, faultPct: number): FaultBarStatus {
  if (!faultRule || faultPct <= 0) return 'none'
  switch (faultRule) {
    case 'contributory':
      return 'contributory'
    case 'modified-comparative-50':
      return faultPct >= 50 ? 'modified-bar' : 'none'
    case 'modified-comparative-51':
      return faultPct >= 51 ? 'modified-bar' : 'none'
    case 'pure-comparative':
    default:
      return 'none'
  }
}

/** The bar percentage for a modified-comparative rule, or null for the other rules. */
export function getModifiedBarThreshold(faultRule: FaultRule | undefined | null): 50 | 51 | null {
  if (faultRule === 'modified-comparative-50') return 50
  if (faultRule === 'modified-comparative-51') return 51
  return null
}
