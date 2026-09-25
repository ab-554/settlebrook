// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/ppdState.ts
// State-specific scheduled-loss PPD (permanent partial disability) formulas
// for Michigan, New Jersey, Virginia, Georgia, New York, Minnesota, and
// Colorado.
//
// NEW, ADDITIVE file per research/2026-09-24/ppd/PPD-MODULE-SPEC.md (and,
// for Colorado, research/2026-09-24/ppd/PPD-SPEC-ADDENDUM-COLORADO.md) —
// this does not modify workersComp.ts or any other existing function in
// lib/calculations/*. Pure functions only: no React, no I/O, no side effects.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SCHEDULED_LOSS_STATES,
  VIRGINIA_RATE_PERIODS,
  GEORGIA_MAX_WEEKLY,
  COLORADO_FLAT_WEEKLY_RATE,
  MINNESOTA_TABLE_A,
  MINNESOTA_TABLE_B,
  MINNESOTA_TABLE_CUTOFF_DATE,
  MINNESOTA_STATUTE_CITATION,
  type ScheduledLossStateSlug,
} from '@/lib/data/ppdSchedules2026'

// New York's current max weekly benefit — cross-referenced from
// lib/data/wcMaxBenefits2026.json per PPD-MODULE-SPEC.md's NY rule, rather
// than duplicated here, since that file is this site's single source of
// truth for state weekly benefit caps.
const NEW_YORK_MAX_WEEKLY = 1281.50

// Virginia's max/min resets every July 1 (fiscal, not calendar year).
// Sept 25, 2026 falls in the Jul-Dec 2026 half, so that's the period used
// here — see VIRGINIA_RATE_PERIODS in lib/data/ppdSchedules2026.ts for both
// halves of the year.
const VIRGINIA_CURRENT_MAX_WEEKLY = VIRGINIA_RATE_PERIODS.h2_2026.maxWeekly

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

// New Jersey's hand and foot each have two schedule values (N.J.S.A.
// 34:15-12(c)) — the "25% or more" figure applies once loss reaches 25%,
// otherwise the "under 25%" figure applies. Every other body part has a
// single schedule value.
function resolveMaxScheduleWeeks(state: ScheduledLossStateSlug, bodyPart: string, lossPercent: number): number {
  const schedule = SCHEDULED_LOSS_STATES[state].scheduleWeeks

  if (state === 'new-jersey' && bodyPart === 'hand') {
    return lossPercent >= 25 ? schedule.hand_25pct_or_more_loss_of_function : schedule.hand_under_25pct_loss_of_function
  }
  if (state === 'new-jersey' && bodyPart === 'foot') {
    return lossPercent >= 25 ? schedule.foot_25pct_or_more_loss_of_function : schedule.foot_under_25pct_loss_of_function
  }

  const weeks = schedule[bodyPart]
  if (weeks === undefined) {
    throw new Error(`No PPD schedule entry for body part "${bodyPart}" in ${state}`)
  }
  return weeks
}

export interface ScheduledPPDInput {
  state: ScheduledLossStateSlug
  bodyPart: string
  lossPercent: number
  aww?: number
  weeklyRateOverride?: number
}

export interface ScheduledPPDResult {
  weeks: number
  weeklyRate: number | null
  total: number | null
  citation: string
  notes: string[]
}

export function scheduledPPD(input: ScheduledPPDInput): ScheduledPPDResult {
  const { state, bodyPart, lossPercent, aww, weeklyRateOverride } = input
  const stateData = SCHEDULED_LOSS_STATES[state]

  const maxWeeks = resolveMaxScheduleWeeks(state, bodyPart, lossPercent)
  const weeks = roundToCents(maxWeeks * (lossPercent / 100))

  const notes: string[] = ['Minimum-rate rules not applied.']
  let weeklyRate: number | null = null

  switch (state) {
    case 'new-jersey': {
      weeklyRate = null
      notes.push(
        "New Jersey's weekly rate depends on the total weeks awarded — see the official 2026 schedule.",
      )
      break
    }
    case 'michigan': {
      weeklyRate = weeklyRateOverride ?? null
      if (weeklyRate === null) {
        notes.push('Enter your weekly compensation rate (shown on your benefit notice) to see a dollar total.')
      }
      break
    }
    case 'georgia': {
      if (aww !== undefined) {
        weeklyRate = roundToCents(Math.min((2 / 3) * aww, GEORGIA_MAX_WEEKLY))
        if (weeklyRate === GEORGIA_MAX_WEEKLY) {
          notes.push(`Capped at Georgia's statutory maximum of $${GEORGIA_MAX_WEEKLY.toFixed(2)}/week.`)
        }
      }
      break
    }
    case 'virginia': {
      if (aww !== undefined) {
        weeklyRate = roundToCents(Math.min((2 / 3) * aww, VIRGINIA_CURRENT_MAX_WEEKLY))
        notes.push(
          `Uses Virginia's ${VIRGINIA_RATE_PERIODS.h2_2026.period} maximum of $${VIRGINIA_CURRENT_MAX_WEEKLY.toFixed(2)}/week.`,
        )
      }
      notes.push('Paid after temporary total benefits end; combined limit of 500 weeks (Va. Code § 65.2-518).')
      break
    }
    case 'new-york': {
      if (aww !== undefined) {
        weeklyRate = roundToCents(Math.min((2 / 3) * aww, NEW_YORK_MAX_WEEKLY))
      }
      break
    }
    case 'colorado': {
      // Flat statutory rate — not a share of wages. AWW is intentionally
      // ignored even if the caller passes one.
      weeklyRate = COLORADO_FLAT_WEEKLY_RATE
      notes.push(
        `Colorado pays scheduled PPD at a flat statutory rate of $${COLORADO_FLAT_WEEKLY_RATE.toFixed(2)}/week (July 1, 2026 – June 30, 2027 benefit year) — average weekly wage is not used for scheduled injuries.`,
      )
      break
    }
  }

  const total = weeklyRate !== null ? roundToCents(weeks * weeklyRate) : null

  return {
    weeks,
    weeklyRate,
    total,
    citation: stateData.statuteCitation,
    notes,
  }
}

// ─── Minnesota: whole-body percentage, not a member schedule ──────────────────

// Table keys look like "5.5_to_less_than_10.5", "less_than_5.5", or
// "95.5_up_to_and_including_100" — parsed into a numeric [min, max) range
// (or [min, max] for the top band) rather than hardcoding 20 comparisons.
function parseMinnesotaBandKey(key: string): { min: number; max: number; maxInclusive: boolean } {
  if (key.startsWith('less_than_')) {
    return { min: -Infinity, max: parseFloat(key.slice('less_than_'.length)), maxInclusive: false }
  }
  if (key.endsWith('_up_to_and_including_100')) {
    return { min: parseFloat(key.slice(0, -'_up_to_and_including_100'.length)), max: 100, maxInclusive: true }
  }
  const match = key.match(/^([\d.]+)_to_less_than_([\d.]+)$/)
  if (match) {
    return { min: parseFloat(match[1]), max: parseFloat(match[2]), maxInclusive: false }
  }
  throw new Error(`Unrecognized Minnesota PPD band key: "${key}"`)
}

function findMinnesotaBandAmount(table: Record<string, number>, ratingPercent: number): number {
  for (const [key, amount] of Object.entries(table)) {
    const { min, max, maxInclusive } = parseMinnesotaBandKey(key)
    const inBand = ratingPercent >= min && (maxInclusive ? ratingPercent <= max : ratingPercent < max)
    if (inBand) return amount
  }
  throw new Error(`No Minnesota PPD band found for rating ${ratingPercent}%`)
}

export interface MinnesotaPPDInput {
  ratingPercent: number
  injuryDate: string // YYYY-MM-DD
}

export interface MinnesotaPPDResult {
  bandAmount: number
  total: number
  table: 'A' | 'B'
  citation: string
}

export function minnesotaPPD(input: MinnesotaPPDInput): MinnesotaPPDResult {
  const ratingPercent = Math.min(input.ratingPercent, 100)
  const table: 'A' | 'B' = input.injuryDate < MINNESOTA_TABLE_CUTOFF_DATE ? 'A' : 'B'
  const bandAmount = findMinnesotaBandAmount(table === 'A' ? MINNESOTA_TABLE_A : MINNESOTA_TABLE_B, ratingPercent)
  const total = roundToCents((ratingPercent / 100) * bandAmount)

  return {
    bandAmount,
    total,
    table,
    citation: MINNESOTA_STATUTE_CITATION,
  }
}
