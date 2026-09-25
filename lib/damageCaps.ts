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
//   ohio            General PI cap: greater of $250k or 3× economic,    → general
//                   max $350k per plaintiff (R.C. 2315.18); catastrophic
//                   injuries exempt
//   georgia         Caps ruled unconstitutional                        → none
//   arizona         Constitutional prohibition                         → none
//   washington      Caps ruled unconstitutional                        → none
//   colorado        General PI cap $1.5M (2025–26); lower med-mal cap  → general
//   michigan        Med mal cap only (MCL 600.1483, CPI-adjusted; no    → med-mal
//                   figure stored); no general PI cap — auto claims are
//                   gated by the MCL 500.3135 tort threshold instead
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

/**
 * Chip value overrides for general caps where the stored damageCap number
 * alone would mislead. Ohio's cap is a formula — the greater of $250,000 or
 * 3× economic damages, to a maximum of $350,000 per plaintiff (Ohio R.C.
 * 2315.18(B)(2), https://codes.ohio.gov/ohio-revised-code/section-2315.18) —
 * so the chip shows the range rather than the ceiling.
 */
const GENERAL_CAP_CHIP_VALUE: Record<string, string> = {
  ohio: '$250k–$350k non-economic cap',
}

/** One-sentence cap summary for the key-facts card (general-cap states only). */
const GENERAL_CAP_SUMMARY: Record<string, string> = {
  ohio: 'Ohio caps non-economic damages in most personal injury claims at the greater of $250,000 or three times economic damages, up to $350,000 per plaintiff (Ohio R.C. 2315.18); catastrophic injuries are exempt.',
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
        ? { value: GENERAL_CAP_CHIP_VALUE[state.slug] ?? `${usd(state.damageCap)} general cap`, note: GENERAL_CAP_NOTE[state.slug], tone: 'amber' }
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

/**
 * Key-facts sentence for a state whose cap applies to general claims. Falls
 * back to the plain dollar figure where no state-specific wording is needed.
 */
export function getGeneralCapSummary(state: Pick<StateData, 'slug' | 'hasDamageCap' | 'damageCap'>): string | null {
  if (!capAppliesToGeneralClaims(state)) return null
  return GENERAL_CAP_SUMMARY[state.slug] ?? `Non-economic damages in general personal injury claims may be capped at ${usd(state.damageCap as number)}.`
}

export interface GeneralCapNotice {
  /** The cap that applies to this claim — the statutory ceiling, or Ohio's formula result */
  capAmount: number
  text: string
}

/**
 * The result-card cap notice. Compares the NON-ECONOMIC estimate (the figure
 * the cap actually limits) against the cap that applies to general personal
 * injury claims in the state, and says so in the state's own terms:
 *   • Ohio — greater of $250,000 or 3× economic damages, max $350,000 per
 *     plaintiff (R.C. 2315.18(B)(2)); catastrophic injuries exempt
 *   • any other general-cap state — the flat statutory figure
 * Returns null when no general cap applies or the estimate is under it.
 * Presentation only — nothing here touches lib/calculations/*.
 */
export function getGeneralCapNotice(
  state: Pick<StateData, 'slug' | 'name' | 'hasDamageCap' | 'damageCap' | 'damageCapNotes'> | null | undefined,
  economicDamages: number,
  nonEconomicDamages: number,
): GeneralCapNotice | null {
  if (!state || !capAppliesToGeneralClaims(state)) return null
  const ceiling = state.damageCap as number

  if (state.slug === 'ohio') {
    const capAmount = Math.min(Math.max(250000, 3 * economicDamages), ceiling)
    if (nonEconomicDamages <= capAmount) return null
    return {
      capAmount,
      text:
        `Ohio caps non-economic damages at the greater of $250,000 or three times your economic damages, up to $350,000 per plaintiff (Ohio R.C. 2315.18). ` +
        `For your inputs that cap is ${usd(capAmount)}; your pain and suffering estimate of ${usd(nonEconomicDamages)} exceeds it, so actual recovery may be reduced. ` +
        `The cap does not apply to catastrophic injuries (permanent and substantial physical deformity, loss of use of a limb or bodily organ system, or a permanent injury that prevents independent self-care).`,
    }
  }

  if (nonEconomicDamages <= ceiling) return null
  return {
    capAmount: ceiling,
    text:
      `${state.name} caps non-economic damages in general personal injury claims at ${usd(ceiling)}. ` +
      `Your pain and suffering estimate of ${usd(nonEconomicDamages)} exceeds this cap, so actual recovery may be reduced. ${state.damageCapNotes}`,
  }
}
