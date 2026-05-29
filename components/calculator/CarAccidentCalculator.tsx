'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CarAccidentCalculator.tsx
// Tool #2 — Car Accident Settlement Calculator main panel.
// Extends PainSufferingCalculator.tsx with:
//   • propertyDamage input field (vehicle repair / total loss)
//   • PolicyLimitInput — optional at-fault driver policy limit advisory field
//   • Delegates all math to calculateCarAccident() in carAccident.ts
//   • Result rendered by CarAccidentResult (not CalculatorResult)
// All reused components (CalculatorInput, MultiplierSelector, MethodToggle,
// DisclaimerBanner) are imported unchanged per AGENTS.md.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import CalculatorInput from './CalculatorInput'
import MultiplierSelector from './MultiplierSelector'
import MethodToggle, { type CalculationMethod } from './MethodToggle'
import CarAccidentResult from './CarAccidentResult'
import DisclaimerBanner from './DisclaimerBanner'
import PolicyLimitInput from './PolicyLimitInput'
import {
  validateEconomicDamages,
  validateMultiplierInputs,
  validatePerDiemInputs,
  SEVERITY_CONFIGS,
  annualSalaryToDailyRate,
} from '@/lib/calculations/painSuffering'
import { calculateCarAccident } from '@/lib/calculations/carAccident'
import type {
  SeverityLevel,
  CarAccidentResult as CarAccidentResultType,
  ValidationError,
} from '@/lib/calculations/types'

// ─── Props ───────────────────────────────────────────────────────────────────

interface CarAccidentCalculatorProps {
  stateSlug?: string
  stateName?: string
  faultRule?: string
}

// ─── Internal form shape ─────────────────────────────────────────────────────

interface FormState {
  medicalBills: string
  futureMedical: string
  lostWages: string
  futureLostWages: string
  propertyDamage: string
  severity: SeverityLevel
  dailyRate: string
  recoveryDays: string
  annualSalary: string
  plaintiffFaultPercent: string
  insurancePolicyLimit: string
}

const INITIAL_FORM: FormState = {
  medicalBills: '',
  futureMedical: '',
  lostWages: '',
  futureLostWages: '',
  propertyDamage: '',
  severity: 'moderate',
  dailyRate: '',
  recoveryDays: '',
  annualSalary: '',
  plaintiffFaultPercent: '0',
  insurancePolicyLimit: '',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CarAccidentCalculator({
  stateSlug,
  stateName,
  faultRule,
}: CarAccidentCalculatorProps) {
  const [form, setForm]       = useState<FormState>(INITIAL_FORM)
  const [activeMethod, setActiveMethod] = useState<CalculationMethod>('multiplier')
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [result, setResult]   = useState<CarAccidentResultType | null>(null)
  const [hasCalc, setHasCalc] = useState(false)

  const faultPct       = Math.max(0, Math.min(99, parseFloat(form.plaintiffFaultPercent) || 0))
  const isContributory = faultRule === 'contributory'

  // ── Field helpers ──────────────────────────────────────────────────────────

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear the individual field error on every keystroke
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  /** Salary helper: populate dailyRate automatically when annual salary is entered. */
  function handleSalaryHelper(value: string) {
    updateField('annualSalary', value)
    const salary = parseFloat(value)
    if (!isNaN(salary) && salary > 0)
      updateField('dailyRate', String(annualSalaryToDailyRate(salary)))
  }

  /** Parse all form string fields to numbers for the calculation functions. */
  function parseNums() {
    return {
      medicalBills:          parseFloat(form.medicalBills)          || 0,
      futureMedical:         parseFloat(form.futureMedical)         || 0,
      lostWages:             parseFloat(form.lostWages)             || 0,
      futureLostWages:       parseFloat(form.futureLostWages)       || 0,
      propertyDamage:        parseFloat(form.propertyDamage)        || 0,
      multiplier:            SEVERITY_CONFIGS[form.severity].multiplier,
      dailyRate:             parseFloat(form.dailyRate)             || 0,
      recoveryDays:          parseFloat(form.recoveryDays)          || 0,
      plaintiffFaultPercent: faultPct,
      // Policy limit is optional — parse to undefined when empty so policyLimitWarning
      // returns null rather than comparing against NaN.
      insurancePolicyLimit:  form.insurancePolicyLimit
        ? parseFloat(form.insurancePolicyLimit) || undefined
        : undefined,
    }
  }

  function toRecord(errs: ValidationError[]): Record<string, string> {
    return Object.fromEntries(errs.map((e) => [e.field, e.message]))
  }

  // ── Calculate ──────────────────────────────────────────────────────────────

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    const p = parseNums()

    const eco = {
      medicalBills:    p.medicalBills,
      futureMedical:   p.futureMedical,
      lostWages:       p.lostWages,
      futureLostWages: p.futureLostWages,
      propertyDamage:  p.propertyDamage,
    }

    // Run validation — same pattern as PainSufferingCalculator
    let allErrors = toRecord(validateEconomicDamages(eco).errors)
    if (activeMethod === 'multiplier')
      allErrors = { ...allErrors, ...toRecord(validateMultiplierInputs({ multiplier: p.multiplier }).errors) }
    else
      allErrors = { ...allErrors, ...toRecord(validatePerDiemInputs({ dailyRate: p.dailyRate, recoveryDays: p.recoveryDays }).errors) }

    if (Object.keys(allErrors).length) {
      setErrors(allErrors)
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Run the car accident calculation (thin wrapper around painSuffering.ts)
    const calc = calculateCarAccident(
      {
        ...eco,
        multiplier:            p.multiplier,
        plaintiffFaultPercent: p.plaintiffFaultPercent,
        insurancePolicyLimit:  p.insurancePolicyLimit,
      },
      // Per diem inputs — only pass when both fields are filled in
      p.dailyRate > 0 && p.recoveryDays > 0
        ? { ...eco, dailyRate: p.dailyRate, recoveryDays: p.recoveryDays }
        : null,
      stateSlug ?? null,
    )

    setResult(calc)
    setHasCalc(true)
    setErrors({})
    // Scroll to results after state update
    setTimeout(
      () => document.getElementById('car-accident-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      100,
    )
  }

  function handleReset() {
    setForm(INITIAL_FORM)
    setErrors({})
    setResult(null)
    setHasCalc(false)
  }

  // ── Ad slot placeholder — matches PainSufferingCalculator pattern ──────────
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex flex-col gap-5" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>

      <DisclaimerBanner variant="banner" stateName={stateName} />
      <AdSlot id="CAR_AD_SLOT_TOP" />

      <section aria-label="Car accident settlement calculator" className="calc-panel">

        <div className="calc-panel-header">
          <h2 className="text-lg font-bold leading-tight" style={{ color: '#F1F5F9' }}>
            {stateName ? `Enter Your ${stateName} Car Accident Damages` : 'Enter Your Car Accident Damages'}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
            Enter your damages below to estimate your car accident settlement
          </p>
        </div>

        <form onSubmit={handleCalculate} noValidate className="px-6 py-6 flex flex-col">

          {/* ── Step 1: Economic damages ── */}
          <fieldset>
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">1</span>
              Your Economic Damages
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorInput
                label="Medical Bills (to date)"
                name="medicalBills"
                value={form.medicalBills}
                onChange={(v) => updateField('medicalBills', v)}
                prefix="$" placeholder="0"
                helpText="All medical expenses incurred so far"
                error={errors.medicalBills}
              />
              <CalculatorInput
                label="Estimated Future Medical"
                name="futureMedical"
                value={form.futureMedical}
                onChange={(v) => updateField('futureMedical', v)}
                prefix="$" placeholder="0"
                helpText="Future surgery, therapy, or ongoing care"
                error={errors.futureMedical}
              />
              <CalculatorInput
                label="Lost Wages (to date)"
                name="lostWages"
                value={form.lostWages}
                onChange={(v) => updateField('lostWages', v)}
                prefix="$" placeholder="0"
                helpText="Income lost during your recovery"
                error={errors.lostWages}
              />
              <CalculatorInput
                label="Future Lost Earnings"
                name="futureLostWages"
                value={form.futureLostWages}
                onChange={(v) => updateField('futureLostWages', v)}
                prefix="$" placeholder="0"
                helpText="If injury reduces future earning capacity"
                error={errors.futureLostWages}
              />
              {/* propertyDamage — vehicle repair / total loss — Tool #2 specific field */}
              <CalculatorInput
                label="Vehicle Damage / Property Loss"
                name="propertyDamage"
                value={form.propertyDamage}
                onChange={(v) => updateField('propertyDamage', v)}
                prefix="$" placeholder="0"
                helpText="Cost to repair or replace your vehicle"
                error={errors.propertyDamage}
              />
            </div>
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 2: Calculation method ── */}
          <fieldset className="mt-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">2</span>
              Choose Calculation Method
            </legend>

            <MethodToggle active={activeMethod} onChange={setActiveMethod} />

            <div className="mt-4">
              {activeMethod === 'multiplier' && (
                <MultiplierSelector
                  selected={form.severity}
                  onSelect={(level: SeverityLevel) => updateField('severity', level)}
                />
              )}

              {activeMethod === 'per-diem' && (
                <div className="flex flex-col gap-4">
                  {/* Annual salary helper */}
                  <div
                    className="rounded-xl px-4 py-3 flex flex-col gap-3"
                    style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)' }}
                  >
                    <p className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                      💡 Enter your annual salary to auto-calculate your daily rate
                    </p>
                    <CalculatorInput
                      label="Annual Salary (optional helper)"
                      name="annualSalary"
                      value={form.annualSalary}
                      onChange={handleSalaryHelper}
                      prefix="$" placeholder="65000"
                      helpText="We'll divide by 365 to get your daily rate"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CalculatorInput
                      label="Daily Rate"
                      name="dailyRate"
                      value={form.dailyRate}
                      onChange={(v) => updateField('dailyRate', v)}
                      prefix="$" placeholder="200"
                      helpText="Dollar value per day of suffering ($100–$500 typical)"
                      error={errors.dailyRate}
                    />
                    <CalculatorInput
                      label="Recovery Days"
                      name="recoveryDays"
                      value={form.recoveryDays}
                      onChange={(v) => updateField('recoveryDays', v)}
                      suffix="days" placeholder="90"
                      helpText="Days from accident to maximum medical improvement"
                      error={errors.recoveryDays}
                    />
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 3: Plaintiff fault ── */}
          <fieldset className="mt-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">3</span>
              Your Share of Fault (if any)
            </legend>

            <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
              Enter 0 if the other driver was fully at fault
            </p>

            {/* Slider + numeric input — identical pattern to PainSufferingCalculator */}
            <div className="flex items-center gap-3 mb-4">
              <input
                id="car-plaintiffFaultPercent"
                type="range"
                min={0}
                max={99}
                step={1}
                value={faultPct}
                onChange={(e) => updateField('plaintiffFaultPercent', e.target.value)}
                onInput={(e) => e.currentTarget.style.setProperty('--val', `${e.currentTarget.value}%`)}
                className="fault-slider flex-1"
                style={{
                  appearance: 'none',
                  height: '6px',
                  borderRadius: '9999px',
                  background: `linear-gradient(to right, #3B82F6 var(--val, 0%), rgba(255,255,255,0.1) var(--val, 0%))`,
                  cursor: 'pointer',
                  '--val': `${faultPct}%`,
                } as React.CSSProperties}
                aria-label="Your share of fault percentage"
              />
              <div className="relative flex-shrink-0 w-20">
                <input
                  type="number"
                  min={0}
                  max={99}
                  step={1}
                  value={form.plaintiffFaultPercent}
                  onChange={(e) => updateField('plaintiffFaultPercent', e.target.value)}
                  className="w-full text-center font-bold text-sm rounded-lg py-2 pr-6 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(99,179,237,0.22)',
                    color: '#F1F5F9',
                  }}
                  aria-label="Your share of fault percentage"
                />
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none"
                  style={{ color: '#60A5FA' }}
                >
                  %
                </span>
              </div>
            </div>

            {/* Comparative negligence info note */}
            {faultPct > 0 && !isContributory && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs leading-snug"
                style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.20)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FBBF24' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                <p style={{ color: '#A8843A' }}>
                  Your estimate is reduced by{' '}
                  <span className="font-semibold" style={{ color: '#FBBF24' }}>{faultPct}%</span>{' '}
                  based on your share of fault.
                </p>
              </div>
            )}

            {/* Contributory negligence hard warning */}
            {faultPct > 0 && isContributory && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs leading-snug mt-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.30)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F87171' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p style={{ color: '#FCA5A5' }}>
                  <span className="font-semibold" style={{ color: '#F87171' }}>Warning:</span>{' '}
                  In {stateName ?? 'this state'}, any fault on your part may{' '}
                  <span className="font-semibold">bar recovery entirely</span> under contributory negligence rules.
                  Consult an attorney before assuming you can recover.
                </p>
              </div>
            )}
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 4: Insurance policy limit (optional advisory) ── */}
          <fieldset className="mt-6 mb-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">4</span>
              At-Fault Driver&apos;s Insurance Limit
              <span className="text-xs font-normal ml-1" style={{ color: '#64748B' }}>(optional)</span>
            </legend>

            <PolicyLimitInput
              value={form.insurancePolicyLimit}
              onChange={(v) => updateField('insurancePolicyLimit', v)}
              error={errors.insurancePolicyLimit}
            />
          </fieldset>

          {/* ── Actions ── */}
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

      {/* ── Results section ── */}
      {result && (
        <section
          id="car-accident-results"
          aria-label="Your car accident settlement estimate"
          aria-live="polite"
          className="scroll-mt-4"
        >
          <AdSlot id="CAR_AD_SLOT_MID" />
          <div className="mt-4">
            <CarAccidentResult result={result} activeMethod={activeMethod} />
          </div>
        </section>
      )}

      <AdSlot id="CAR_AD_SLOT_BOTTOM" />
    </div>
  )
}
