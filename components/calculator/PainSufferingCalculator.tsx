'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/PainSufferingCalculator.tsx
// Main calculator panel — dark glass theme throughout
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import CalculatorInput from './CalculatorInput'
import MultiplierSelector from './MultiplierSelector'
import MethodToggle, { type CalculationMethod } from './MethodToggle'
import CalculatorResult from './CalculatorResult'
import DisclaimerBanner from './DisclaimerBanner'
import {
  calculatePainAndSuffering,
  validateEconomicDamages,
  validateMultiplierInputs,
  validatePerDiemInputs,
  SEVERITY_CONFIGS,
  annualSalaryToDailyRate,
} from '@/lib/calculations/painSuffering'
import type { SeverityLevel, PainSufferingCalculationResult, ValidationError } from '@/lib/calculations/types'

interface PainSufferingCalculatorProps {
  stateSlug?: string
  stateName?: string
}
interface FormState {
  medicalBills: string; futureMedical: string; lostWages: string
  futureLostWages: string; propertyDamage: string; severity: SeverityLevel
  dailyRate: string; recoveryDays: string; annualSalary: string
}

const INITIAL_FORM: FormState = {
  medicalBills: '', futureMedical: '', lostWages: '', futureLostWages: '',
  propertyDamage: '', severity: 'moderate', dailyRate: '', recoveryDays: '', annualSalary: '',
}

export default function PainSufferingCalculator({ stateSlug, stateName }: PainSufferingCalculatorProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [activeMethod, setActiveMethod] = useState<CalculationMethod>('multiplier')
  const [errors, setErrors]  = useState<Record<string, string>>({})
  const [result, setResult]  = useState<PainSufferingCalculationResult | null>(null)
  const [hasCalc, setHasCalc] = useState(false)

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }
  function handleSalaryHelper(value: string) {
    updateField('annualSalary', value)
    const salary = parseFloat(value)
    if (!isNaN(salary) && salary > 0) updateField('dailyRate', String(annualSalaryToDailyRate(salary)))
  }
  function parseNums() {
    return {
      medicalBills:   parseFloat(form.medicalBills)   || 0,
      futureMedical:  parseFloat(form.futureMedical)  || 0,
      lostWages:      parseFloat(form.lostWages)      || 0,
      futureLostWages:parseFloat(form.futureLostWages)|| 0,
      propertyDamage: parseFloat(form.propertyDamage) || 0,
      multiplier:     SEVERITY_CONFIGS[form.severity].multiplier,
      dailyRate:      parseFloat(form.dailyRate)      || 0,
      recoveryDays:   parseFloat(form.recoveryDays)   || 0,
    }
  }
  function toRecord(errs: ValidationError[]) {
    return Object.fromEntries(errs.map((e) => [e.field, e.message]))
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    const p = parseNums()
    const eco = { medicalBills: p.medicalBills, futureMedical: p.futureMedical, lostWages: p.lostWages, futureLostWages: p.futureLostWages, propertyDamage: p.propertyDamage }
    let allErrors = toRecord(validateEconomicDamages(eco).errors)
    if (activeMethod === 'multiplier') allErrors = { ...allErrors, ...toRecord(validateMultiplierInputs({ multiplier: p.multiplier }).errors) }
    else allErrors = { ...allErrors, ...toRecord(validatePerDiemInputs({ dailyRate: p.dailyRate, recoveryDays: p.recoveryDays }).errors) }
    if (Object.keys(allErrors).length) {
      setErrors(allErrors)
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const calc = calculatePainAndSuffering({
      multiplierInputs: { ...eco, multiplier: p.multiplier },
      perDiemInputs: p.dailyRate > 0 && p.recoveryDays > 0 ? { ...eco, dailyRate: p.dailyRate, recoveryDays: p.recoveryDays } : null,
      stateSlug: stateSlug ?? null,
    })
    setResult(calc)
    setHasCalc(true)
    setErrors({})
    setTimeout(() => document.getElementById('calculator-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleReset() {
    setForm(INITIAL_FORM); setErrors({}); setResult(null); setHasCalc(false)
  }

  /* ── AD SLOT helper ── */
  const AdSlot = ({ id }: { id: string }) => (
    <div
      id={id}
      aria-label="Advertisement"
      className="w-full min-h-[90px] rounded-xl flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(99,179,237,0.10)' }}
    >
      <span className="text-xs select-none" style={{ color: 'rgba(148,163,184,0.22)' }}>{id}</span>
    </div>
  )

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">

      <DisclaimerBanner variant="banner" stateName={stateName} />
      <AdSlot id="AD_SLOT_TOP" />

      {/* Calculator panel */}
      <section aria-label="Pain and suffering calculator" className="calc-panel">

        {/* Header */}
        <div className="calc-panel-header">
          {/* FIX H13: On state pages, the old h2 duplicated the page H1 almost exactly.
              Now shows a distinct, action-oriented heading when stateName is set. */}
          <h2 className="text-lg font-bold leading-tight" style={{ color: '#F1F5F9' }}>
            {stateName
              ? `Enter Your ${stateName} Damages Below`
              : 'Enter Your Damages Below'
            }
          </h2>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
            Enter your damages below to estimate your settlement
          </p>
        </div>

        <form onSubmit={handleCalculate} noValidate className="px-6 py-6 flex flex-col gap-6">

          {/* ── Step 1: Economic damages ── */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-bold flex items-center gap-2.5" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">1</span>
              Your Economic Damages
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorInput label="Medical Bills (to date)" name="medicalBills" value={form.medicalBills} onChange={(v) => updateField('medicalBills', v)} prefix="$" placeholder="0" helpText="All medical expenses incurred so far" error={errors.medicalBills} />
              <CalculatorInput label="Estimated Future Medical" name="futureMedical" value={form.futureMedical} onChange={(v) => updateField('futureMedical', v)} prefix="$" placeholder="0" helpText="Future surgery, therapy, or ongoing care" error={errors.futureMedical} />
              <CalculatorInput label="Lost Wages (to date)" name="lostWages" value={form.lostWages} onChange={(v) => updateField('lostWages', v)} prefix="$" placeholder="0" helpText="Income lost during your recovery" error={errors.lostWages} />
              <CalculatorInput label="Future Lost Earnings" name="futureLostWages" value={form.futureLostWages} onChange={(v) => updateField('futureLostWages', v)} prefix="$" placeholder="0" helpText="If injury reduces future earning capacity" error={errors.futureLostWages} />
            </div>
          </fieldset>

          <hr style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 2: Method ── */}
          <fieldset className="flex flex-col gap-4">
            <legend className="text-sm font-bold flex items-center gap-2.5" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">2</span>
              Choose Calculation Method
            </legend>

            <MethodToggle active={activeMethod} onChange={setActiveMethod} />

            {activeMethod === 'multiplier' && (
              <MultiplierSelector selected={form.severity} onSelect={(level: SeverityLevel) => updateField('severity', level)} />
            )}

            {activeMethod === 'per-diem' && (
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-xl px-4 py-3 flex flex-col gap-3"
                  style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)' }}
                >
                  <p className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                    💡 Enter your annual salary to auto-calculate your daily rate
                  </p>
                  <CalculatorInput label="Annual Salary (optional helper)" name="annualSalary" value={form.annualSalary} onChange={handleSalaryHelper} prefix="$" placeholder="65000" helpText="We'll divide by 365 to get your daily rate" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput label="Daily Rate" name="dailyRate" value={form.dailyRate} onChange={(v) => updateField('dailyRate', v)} prefix="$" placeholder="200" helpText="Dollar value per day of suffering ($100–$500 typical)" error={errors.dailyRate} />
                  <CalculatorInput label="Recovery Days" name="recoveryDays" value={form.recoveryDays} onChange={(v) => updateField('recoveryDays', v)} suffix="days" placeholder="90" helpText="Days from injury to maximum medical improvement" error={errors.recoveryDays} />
                </div>
              </div>
            )}
          </fieldset>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              className="btn-primary flex-1 py-3.5 px-6 text-base font-bold rounded-2xl animate-pulse-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Calculate My Estimate
            </button>
            {hasCalc && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-2xl font-semibold text-sm py-3.5 px-5 transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(99,179,237,0.18)',
                  color: '#94A3B8',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </section>

      {result && (
        <section id="calculator-results" aria-label="Your settlement estimate" aria-live="polite" className="scroll-mt-4">
          <AdSlot id="AD_SLOT_MID" />
          <div className="mt-4">
            <CalculatorResult result={result} activeMethod={activeMethod} />
          </div>
        </section>
      )}

      <AdSlot id="AD_SLOT_BOTTOM" />
    </div>
  )
}
