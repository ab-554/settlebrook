// ─────────────────────────────────────────────────────────────────────────────
// lib/calculations/workersComp.test.ts
// Guards the workers comp formula after the unsourced +25% attorney adjustment
// was removed: the estimate is the statutory formula only, and the result no
// longer carries any attorney-related fields.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { calculateWorkersComp } from './workersComp'
import { WORKERS_COMP_STATES } from '@/lib/data/workersCompStates'

describe('calculateWorkersComp TTD', () => {
  it('Texas, AWW $1,000, 10 weeks -> $700/week, $7,000.00', () => {
    const result = calculateWorkersComp({
      state: 'texas',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
    })
    expect(result.weeklyBenefit).toBe(700)
    expect(result.baseSettlement).toBe(7000.0)
  })

  it('California, AWW $3,000, 10 weeks -> weekly cap x 10', () => {
    const california = WORKERS_COMP_STATES.find((s) => s.slug === 'california')!
    // 66.67% of $3,000 is far above the cap, so the cap must bind.
    expect(3000 * california.benefitRate).toBeGreaterThan(california.weeklyCapAmount)

    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 3000,
      treatmentWeeks: 10,
    })
    expect(result.weeklyBenefit).toBe(california.weeklyCapAmount)
    expect(result.baseSettlement).toBe(california.weeklyCapAmount * 10)
  })
})

describe('WorkersCompResult shape', () => {
  it('has no attorney adjustment keys on a successful result', () => {
    const result = calculateWorkersComp({
      state: 'texas',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
    })
    expect(result).not.toHaveProperty('adjustedSettlement')
    expect(result).not.toHaveProperty('hasAttorneyAdjustment')
  })

  it('has no attorney adjustment keys on the unknown-state fallback', () => {
    const result = calculateWorkersComp({
      state: 'not-a-state',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
    })
    expect(result.baseSettlement).toBe(0)
    expect(result).not.toHaveProperty('adjustedSettlement')
    expect(result).not.toHaveProperty('hasAttorneyAdjustment')
  })
})
