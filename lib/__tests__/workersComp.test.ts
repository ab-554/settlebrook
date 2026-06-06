import { calculateWorkersComp } from '../calculations/workersComp';
import { BODY_PARTS } from '../data/bodyParts';

describe('Workers Comp Calculator', () => {

  it('1. TTD calculation - California, AWW $1000, 12 weeks', () => {
    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 12,
      hasAttorney: false,
    });
    expect(result.weeklyBenefit).toBeCloseTo(666.7, 1);
    expect(result.baseSettlement).toBeCloseTo(8000.4, 1);
  });

  it('2. PPD calculation - California, AWW $1200, Arm (312 weeks), 20% impairment', () => {
    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ppd',
      averageWeeklyWage: 1200,
      bodyPartKey: 'arm',
      impairmentPercent: 20,
      hasAttorney: false,
    });
    expect(result.weeksCovered).toBeCloseTo(62.4, 2);
    expect(result.weeklyBenefit).toBeCloseTo(800.04, 2);
    expect(result.baseSettlement).toBeCloseTo(49922.50, 2);
  });

  it('3. Weekly cap enforcement - California, AWW $3000', () => {
    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 3000,
      treatmentWeeks: 1,
      hasAttorney: false,
    });
    expect(result.weeklyBenefit).toBe(1619);
  });

  it('4. Attorney adjustment - any inputs, hasAttorney true', () => {
    const baseResult = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
      hasAttorney: false,
    });
    const adjustedResult = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
      hasAttorney: true,
    });
    expect(adjustedResult.adjustedSettlement).toBeCloseTo(baseResult.baseSettlement * 1.25, 2);
  });

  it('5. Texas non-subscriber warning', () => {
    const result = calculateWorkersComp({
      state: 'texas',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
      hasAttorney: false,
    });
    const hasTexasWarning = result.warnings.some(w => w.includes('Texas') && w.includes('non-subscriber') || w.includes('personal injury lawsuit'));
    expect(hasTexasWarning).toBe(true);
  });

  it('6. Illinois PPD percentage_of_person method', () => {
    const result = calculateWorkersComp({
      state: 'illinois',
      benefitType: 'ppd',
      averageWeeklyWage: 1000,
      bodyPartKey: 'arm', // Despite being scheduled, IL uses percentage of person
      impairmentPercent: 10,
      hasAttorney: false,
    });
    expect(result.ppdMethod).toBe('percentage_of_person');
    expect(result.weeksCovered).toBeCloseTo(50, 2); // 500 * 0.10
  });

  it('7. PTD lump sum - Age 40, AWW $800, California', () => {
    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ptd',
      averageWeeklyWage: 800,
      claimantAge: 40,
      hasAttorney: false,
    });
    // weeklyBenefit = 800 * 0.6667 = 533.36
    // annualBenefit = 533.36 * 52 = 27734.72
    // lifeExpectancy = 38
    // baseSettlement = 27734.72 * 38 * 0.85 = 895831.456
    expect(result.baseSettlement).toBeCloseTo(895831.46, 1);
  });

  it('8. Body parts data integrity', () => {
    expect(BODY_PARTS.length).toBe(16);

    BODY_PARTS.forEach(bp => {
      expect(bp.scheduledWeeks).toBeGreaterThan(0);

      if (bp.key === 'back_spine' || bp.key === 'whole_body') {
        expect(bp.isScheduled).toBe(false);
      } else {
        expect(bp.isScheduled).toBe(true);
      }
    });
  });

  it('9. Invalid state slug', () => {
    const result = calculateWorkersComp({
      state: 'invalid-state',
      benefitType: 'ttd',
      averageWeeklyWage: 1000,
      treatmentWeeks: 10,
      hasAttorney: false,
    });
    expect(result.weeklyBenefit).toBe(0);
    expect(result.baseSettlement).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('not supported');
  });

  it('10. Zero AWW edge case', () => {
    const result = calculateWorkersComp({
      state: 'california',
      benefitType: 'ttd',
      averageWeeklyWage: 0,
      treatmentWeeks: 10,
      hasAttorney: false,
    });
    expect(result.weeklyBenefit).toBe(0);
    expect(result.baseSettlement).toBe(0);
    expect(result.warnings.some(w => w.includes('Average Weekly Wage'))).toBe(true);
  });

});
