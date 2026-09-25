// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/ppdState.test.ts
// The 9 hand-computed cases from research/2026-09-24/ppd/PPD-MODULE-SPEC.md's
// "Required unit tests" table — must pass exactly.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { scheduledPPD, minnesotaPPD } from './ppdState'

describe('scheduledPPD', () => {
  it('NY hand, 50% loss, AWW $1,200 -> 122 weeks x $800.00 = $97,600.00', () => {
    const result = scheduledPPD({ state: 'new-york', bodyPart: 'hand', lossPercent: 50, aww: 1200 })
    expect(result.weeks).toBe(122)
    expect(result.weeklyRate).toBe(800.00)
    expect(result.total).toBe(97600.00)
  })

  it('VA hand, 20% loss, AWW $900 -> 30 weeks x $600.00 = $18,000.00', () => {
    const result = scheduledPPD({ state: 'virginia', bodyPart: 'hand', lossPercent: 20, aww: 900 })
    expect(result.weeks).toBe(30)
    expect(result.weeklyRate).toBe(600.00)
    expect(result.total).toBe(18000.00)
  })

  it('GA arm, 10% rating, AWW $1,500 -> 22.5 weeks x $800.00 (capped) = $18,000.00', () => {
    const result = scheduledPPD({ state: 'georgia', bodyPart: 'arm', lossPercent: 10, aww: 1500 })
    expect(result.weeks).toBe(22.5)
    expect(result.weeklyRate).toBe(800.00)
    expect(result.total).toBe(18000.00)
  })

  it('MI hand, 50% loss, rate override $700 -> 107.5 weeks x $700 = $75,250.00', () => {
    const result = scheduledPPD({ state: 'michigan', bodyPart: 'hand', lossPercent: 50, weeklyRateOverride: 700 })
    expect(result.weeks).toBe(107.5)
    expect(result.weeklyRate).toBe(700)
    expect(result.total).toBe(75250.00)
  })

  it('MI hand, 50% loss, no rate -> 107.5 weeks, total null', () => {
    const result = scheduledPPD({ state: 'michigan', bodyPart: 'hand', lossPercent: 50 })
    expect(result.weeks).toBe(107.5)
    expect(result.weeklyRate).toBeNull()
    expect(result.total).toBeNull()
  })

  it('NJ hand, 30% loss -> 90 weeks (300 x 30%), total null', () => {
    const result = scheduledPPD({ state: 'new-jersey', bodyPart: 'hand', lossPercent: 30 })
    expect(result.weeks).toBe(90)
    expect(result.weeklyRate).toBeNull()
    expect(result.total).toBeNull()
  })

  it('CO hand below wrist, 20% loss (AWW ignored) -> 20.8 weeks x $459.45 = $9,556.56', () => {
    const result = scheduledPPD({ state: 'colorado', bodyPart: 'hand_below_wrist', lossPercent: 20, aww: 1500 })
    expect(result.weeks).toBe(20.8)
    expect(result.weeklyRate).toBe(459.45)
    expect(result.total).toBe(9556.56)
  })

  it('NJ hand, 20% loss -> 52 weeks (260 x 20%), total null', () => {
    const result = scheduledPPD({ state: 'new-jersey', bodyPart: 'hand', lossPercent: 20 })
    expect(result.weeks).toBe(52)
    expect(result.weeklyRate).toBeNull()
    expect(result.total).toBeNull()
  })
})

describe('minnesotaPPD', () => {
  it('10% rating, injury 2026-09-01 -> 10% x $121,800 = $12,180.00 (table A)', () => {
    const result = minnesotaPPD({ ratingPercent: 10, injuryDate: '2026-09-01' })
    expect(result.table).toBe('A')
    expect(result.bandAmount).toBe(121800)
    expect(result.total).toBe(12180.00)
  })

  it('10% rating, injury 2026-10-15 -> 10% x $146,297 = $14,629.70 (table B)', () => {
    const result = minnesotaPPD({ ratingPercent: 10, injuryDate: '2026-10-15' })
    expect(result.table).toBe('B')
    expect(result.bandAmount).toBe(146297)
    expect(result.total).toBe(14629.70)
  })
})
