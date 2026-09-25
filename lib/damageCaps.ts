// ─────────────────────────────────────────────────────────────────────────────
// lib/damageCaps.ts
// Presentation helper for the "Damage cap" hero chip and the result-card cap
// notice. lib/data/states.ts stores three fields per state — hasDamageCap,
// damageCap and damageCapNotes — but for several states the numeric cap is a
// medical-malpractice-only cap (e.g. Michigan $590,000, North Carolina
// $712,847) that does NOT apply to a general personal injury claim. Showing
// "cap applies" or "limits pain & suffering to $X" for those states would be
// misleading, so the scope of each state's cap is spelled out here, sourced
// from that state's own damageCapNotes. Audit list (25 Sep 2026):
//
//   california      Med mal only ($470k/$650k); no general PI cap      → med-mal
//   texas           Med mal $250k–$750k; punitive caps                 → med-mal + punitive
//   florida         General PI caps unconstitutional; punitive caps    → punitive only
//   new-york        No statutory cap                                   → none
//   pennsylvania    Constitutional prohibition                         → none
//   illinois        Caps ruled unconstitutional                        → none
//   ohio            General PI cap, $350k per plaintiff, catastrophic  → general
//                   injuries exempt
//   georgia         Caps ruled unconstitutional                        → none
//   arizona         Constitutional prohibition                         → none
//   washington      Caps ruled unconstitutional                        → none
//   colorado        General PI cap $1.5M (2025–26); lower med-mal cap  → general
//   michigan        Med mal cap (MCL 600.1483, CPI-adjusted; no figure  → med-mal
//                   stored); no general PI cap
//   nevada          Med mal cap $590k; punitive caps; no general PI cap → med-mal + punitive
//   north-carolina  Med mal cap $712,847; punitive caps; no general    → med-mal + punitive
//                   PI cap
//
// Adding a state without an entry here falls back to the raw fields (a
// numeric damageCap is treated as general; hasDamageCap with no figure is
// shown as "Cap applies to some claim types").
// ─────────────────────────────────────────────────────────────────────────────

import type { StateData } from './calculations/types'

export type DamageCapScope =
  | 'none'              // no cap on non-economic damages for personal injury
  | 'general'           // a cap applies to general personal injury claims
  | 'med-mal'           // cap applies to medical malpractice only
  | 'med-mal-punitive'  // med-mal cap plus punitive-damages caps; no general cap
  | 'punitive'          // punitive-damages caps only; no general cap

const CAP_SCOPE: Record<string, DamageCapScope> = {
  california: 'med-mal',
  texas: 'med-mal-punitive',
  florida: 'punitive',
  'new-york': 'none',
  pennsylvania: 'none',
  illinois: 'none',
  ohio: 'general',
  georgia: 'none',
  arizona: 'none',
  washington: 'none',
  colorado: 'general',
  michigan: 'med-mal',
  nevada: 'med-mal-punitive',
  'north-carolina': 'med-mal-punitive',
}

/** Short qualifier shown under a general cap, from the state's damageCapNotes. */
const GENERAL_CAP_NOTE: Record<string, string> = {
  ohio: 'catastrophic injuries exempt',
  colorado: 'lower cap for medical malpractice',
}

export function getDamageCapScope(state: Pick<StateData, 'slug' | 'hasDamageCap' | 'damageCap'>): DamageCapScope {
  const known = CAP_SCOPE[state.slug]
  if (known) return known
  if (!state.hasDamageCap) return 'none'
  return state.damageCap ? 'general' : 'med-mal'
}

/** True only when the state caps non-economic damages in a general personal injury claim. */
export function capAppliesToGeneralClaims(state: Pick<StateData, 'slug' | 'hasDamageCap' | 'damageCap'> | null | undefined): boolean {
  if (!state) return false
  return getDamageCapScope(state) === 'general' && typeof state.damageCap === 'number'
}

export interface DamageCapChip {
  value: string
  note?: string
  tone: 'money' | 'amber'
}

const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

/** The hero chip for a state's damage cap — truthful about scope. */
export function getDamageCapChip(state: Pick<StateData, 'slug' | 'hasDamageCap' | 'damageCap'>): DamageCapChip {
  const scope = getDamageCapScope(state)
  switch (scope) {
    case 'general':
      return state.damageCap
        ? { value: `${usd(state.damageCap)} general cap`, note: GENERAL_CAP_NOTE[state.slug], tone: 'amber' }
        : { value: 'Cap applies to some claim types', note: 'see key facts', tone: 'amber' }
    case 'med-mal':
      return { value: 'No general cap', note: 'med-mal cap applies', tone: 'money' }
    case 'med-mal-punitive':
      return { value: 'No general cap', note: 'med-mal and punitive caps apply', tone: 'money' }
    case 'punitive':
      return { value: 'No general cap', note: 'punitive caps apply', tone: 'money' }
    case 'none':
    default:
      return { value: 'No cap on non-economic damages', tone: 'money' }
  }
}
