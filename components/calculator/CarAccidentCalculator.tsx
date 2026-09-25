'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CarAccidentCalculator.tsx
// Tool #2 — Car Accident Settlement Calculator panel. Same live-estimate
// behaviour as PainSufferingCalculator, plus:
//   • propertyDamage input (vehicle repair / total loss)
//   • PolicyLimitInput — optional at-fault driver policy limit advisory field
//   • Delegates all math to calculateCarAccident() in carAccident.ts
//   • Result rendered by CarAccidentResult (not CalculatorResult)
// Shared components (CalculatorInput, MultiplierSelector, MethodToggle,
// FaultSlider, DisclaimerBanner) are used unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react'
import CalculatorInput from './CalculatorInput'
import MultiplierSelector from './MultiplierSelector'
import MethodToggle, { type CalculationMethod } from './MethodToggle'
import FaultSlider from './FaultSlider'
import CarAccidentResult from './CarAccidentResult'
import DisclaimerBanner from './DisclaimerBanner'
import PolicyLimitInput from './PolicyLimitInput'
import { StepHeader, Progress, PrivacyNote } from './Steps'
import { EmptyResult, NextSteps } from './ResultFrame'
import { useDebouncedValue } from './hooks'
import { trackEvent } from '@/lib/analytics'
import type { NextStepCard } from '@/lib/nextSteps'
import {
  validateEconomicDamages,
  validateMultiplierInputs,
  validatePerDiemInputs,
  SEVERITY_CONFIGS,
  annualSalaryToDailyRate,
} from '@/lib/calculations/painSuffering'
import { calculateCarAccident } from '@/lib/calculations/carAccident'
import type { SeverityLevel, ValidationError } from '@/lib/calculations/types'

interface CarAccidentCalculatorProps {
  stateSlug?: string
  stateName?: string
  faultRule?: string
  nextSteps?: NextStepCard[]
}

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
  medicalBills: '', futureMedical: '', lostWages: '', futureLostWages: '', propertyDamage: '',
  severity: 'moderate', dailyRate: '', recoveryDays: '', annualSalary: '',
  plaintiffFaultPercent: '0', insurancePolicyLimit: '',
}

const TOOL = 'car-accident' as const
export const CAR_CALC_ID = 'calculator'
export const CAR_RESULT_ID = 'car-accident-results'

function toRecord(errs: ValidationError[]): Record<string, string> {
  return Object.fromEntries(errs.map((e) => [e.field, e.message]))
}

function parseForm(form: FormState) {
  const faultPct = Math.max(0, Math.min(99, parseFloat(form.plaintiffFaultPercent) || 0))
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

function validate(form: FormState, method: CalculationMethod): Record<string, string> {
  const p = parseForm(form)
  const eco = {
    medicalBills: p.medicalBills, futureMedical: p.futureMedical,
    lostWages: p.lostWages, futureLostWages: p.futureLostWages, propertyDamage: p.propertyDamage,
  }
  let errors = toRecord(validateEconomicDamages(eco).errors)
  if (method === 'multiplier') {
    errors = { ...errors, ...toRecord(validateMultiplierInputs({ multiplier: p.multiplier }).errors) }
  } else {
    errors = { ...errors, ...toRecord(validatePerDiemInputs({ dailyRate: p.dailyRate, recoveryDays: p.recoveryDays }).errors) }
  }
  return errors
}

export default function CarAccidentCalculator({ stateSlug, stateName, faultRule, nextSteps = [] }: CarAccidentCalculatorProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [activeMethod, setActiveMethod] = useState<CalculationMethod>('multiplier')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)

  const debouncedForm = useDebouncedValue(form, 250)
  const parsed = parseForm(form)
  const isContributory = faultRule === 'contributory'

  function markStarted() {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('calculator_start', { tool: TOOL, state: stateSlug })
  }
  function updateField(field: keyof FormState, value: string) {
    markStarted()
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  function touch(field: keyof FormState) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }
  function changeMethod(m: CalculationMethod) {
    markStarted()
    setActiveMethod(m)
  }
  function handleSalaryHelper(value: string) {
    updateField('annualSalary', value)
    const salary = parseFloat(value)
    if (!isNaN(salary) && salary > 0) updateField('dailyRate', String(annualSalaryToDailyRate(salary)))
  }

  const errors = useMemo(() => validate(form, activeMethod), [form, activeMethod])
  const visibleErrors = useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([k]) => submitted || touched[k])),
    [errors, submitted, touched],
  )

  const result = useMemo(() => {
    if (Object.keys(validate(debouncedForm, activeMethod)).length) return null
    const p = parseForm(debouncedForm)
    const eco = {
      medicalBills: p.medicalBills, futureMedical: p.futureMedical,
      lostWages: p.lostWages, futureLostWages: p.futureLostWages, propertyDamage: p.propertyDamage,
    }
    return calculateCarAccident(
      { ...eco, multiplier: p.multiplier, plaintiffFaultPercent: p.plaintiffFaultPercent, insurancePolicyLimit: p.insurancePolicyLimit },
      p.dailyRate > 0 && p.recoveryDays > 0 ? { ...eco, dailyRate: p.dailyRate, recoveryDays: p.recoveryDays } : null,
      stateSlug ?? null,
    )
  }, [debouncedForm, activeMethod, stateSlug])

  useEffect(() => {
    if (result && !completedRef.current) {
      completedRef.current = true
      trackEvent('calculator_complete', { tool: TOOL, state: stateSlug })
    }
  }, [result, stateSlug])

  function handleShow(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
        el?.focus()
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 0)
      return
    }
    document.getElementById(CAR_RESULT_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleReset() {
    setForm(INITIAL_FORM); setTouched({}); setSubmitted(false)
  }

  const step1Done = parsed.medicalBills > 0
  const step2Done = step1Done && (activeMethod === 'multiplier' || (parsed.dailyRate > 0 && parsed.recoveryDays > 0))
  const step3Done = step2Done && result !== null
  const doneCount = [step1Done, step2Done, step3Done].filter(Boolean).length
  const stateOf = (done: boolean, prevDone: boolean) => (done ? 'done' : prevDone ? 'active' : 'todo')

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <section id={CAR_CALC_ID} aria-label="Car accident settlement calculator" className="calc-panel lg:col-span-7">
          <div className="calc-panel-header">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="heading-serif" style={{ fontSize: 20 }}>
                  {stateName ? `Enter your ${stateName} car accident damages` : 'Enter your car accident damages'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--ink-3)' }}>
                  Three short steps plus an optional policy-limit check. The estimate updates as you type.
                </p>
              </div>
              <PrivacyNote />
            </div>
            <div className="mt-3">
              <Progress total={3} done={doneCount} />
            </div>
          </div>

          <form onSubmit={handleShow} noValidate className="calc-body">

            {/* ── Step 1: Economic damages ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={1}
                title="Your costs so far"
                hint="Medical bills, lost pay, and the damage to your car. A rough total is fine to start."
                state={stateOf(step1Done, true)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <CalculatorInput label="Medical bills (to date)" name="medicalBills" value={form.medicalBills} onChange={(v) => updateField('medicalBills', v)} onBlur={() => touch('medicalBills')} prefix="$" placeholder="0" helpText="All medical expenses incurred so far" error={visibleErrors.medicalBills} />
                <CalculatorInput label="Estimated future medical" name="futureMedical" value={form.futureMedical} onChange={(v) => updateField('futureMedical', v)} onBlur={() => touch('futureMedical')} prefix="$" placeholder="0" helpText="Future surgery, therapy, or ongoing care" error={visibleErrors.futureMedical} />
                <CalculatorInput label="Lost wages (to date)" name="lostWages" value={form.lostWages} onChange={(v) => updateField('lostWages', v)} onBlur={() => touch('lostWages')} prefix="$" placeholder="0" helpText="Income lost during your recovery" error={visibleErrors.lostWages} />
                <CalculatorInput label="Future lost earnings" name="futureLostWages" value={form.futureLostWages} onChange={(v) => updateField('futureLostWages', v)} onBlur={() => touch('futureLostWages')} prefix="$" placeholder="0" helpText="If injury reduces future earning capacity" error={visibleErrors.futureLostWages} />
                {/* propertyDamage — vehicle repair / total loss — Tool #2 specific field */}
                <CalculatorInput label="Vehicle damage / property loss" name="propertyDamage" value={form.propertyDamage} onChange={(v) => updateField('propertyDamage', v)} onBlur={() => touch('propertyDamage')} prefix="$" placeholder="0" helpText="Cost to repair or replace your vehicle" error={visibleErrors.propertyDamage} />
              </div>
            </fieldset>

            {/* ── Step 2: Calculation method ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={2}
                title="How severe is the injury?"
                hint="The multiplier method is what most adjusters use. Per diem prices each day of recovery instead."
                state={stateOf(step2Done, step1Done)}
              />
              <MethodToggle active={activeMethod} onChange={changeMethod} />
              <div className="mt-4">
                {activeMethod === 'multiplier' && (
                  <MultiplierSelector selected={form.severity} onSelect={(level: SeverityLevel) => updateField('severity', level)} />
                )}
                {activeMethod === 'per-diem' && (
                  <div className="flex flex-col gap-3">
                    <div className="note note-info">
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                        Enter your annual salary to auto-calculate your daily rate
                      </p>
                      <CalculatorInput label="Annual salary (optional helper)" name="annualSalary" value={form.annualSalary} onChange={handleSalaryHelper} prefix="$" placeholder="65,000" helpText="We'll divide by 365 to get your daily rate" className="mb-0" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <CalculatorInput label="Daily rate" name="dailyRate" value={form.dailyRate} onChange={(v) => updateField('dailyRate', v)} onBlur={() => touch('dailyRate')} prefix="$" placeholder="200" helpText="Dollar value per day of suffering ($100–$500 typical)" error={visibleErrors.dailyRate} />
                      <CalculatorInput label="Recovery days" name="recoveryDays" value={form.recoveryDays} onChange={(v) => updateField('recoveryDays', v)} onBlur={() => touch('recoveryDays')} suffix="days" placeholder="90" format="integer" helpText="Days from accident to maximum medical improvement" error={visibleErrors.recoveryDays} />
                    </div>
                  </div>
                )}
              </div>
            </fieldset>

            {/* ── Step 3: Plaintiff fault ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={3}
                title="Your share of fault, if any"
                hint="Insurers reduce what they pay by the share of blame they assign to you."
                state={stateOf(step3Done, step2Done)}
              />
              <FaultSlider
                value={form.plaintiffFaultPercent}
                faultPct={parsed.plaintiffFaultPercent}
                onChange={(v) => updateField('plaintiffFaultPercent', v)}
                isContributory={isContributory}
                stateName={stateName}
                otherParty="the other driver"
              />
            </fieldset>

            {/* ── Step 4: Insurance policy limit (optional advisory) ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={4}
                title="At-fault driver's insurance limit"
                hint="If you know their liability limit, we'll flag when your estimate is above it."
                state="active"
                optional
              />
              <PolicyLimitInput
                value={form.insurancePolicyLimit}
                onChange={(v) => updateField('insurancePolicyLimit', v)}
                error={visibleErrors.insurancePolicyLimit}
              />
            </fieldset>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button type="submit" className="btn-primary btn-lg flex-1">
                Show my estimate
              </button>
              {(startedRef.current || submitted) && (
                <button type="button" onClick={handleReset} className="btn-ghost">
                  Reset
                </button>
              )}
            </div>

            <div className="mt-5">
              <DisclaimerBanner variant="banner" stateName={stateName} />
            </div>
          </form>
        </section>

        <div
          id={CAR_RESULT_ID}
          aria-label="Your car accident settlement estimate"
          aria-live="polite"
          className="lg:col-span-5 lg:sticky"
          style={{ top: 'calc(var(--header-h) + 16px)', scrollMarginTop: 'calc(var(--header-h) + 12px)' }}
        >
          {result ? (
            <CarAccidentResult result={result} activeMethod={activeMethod} inputs={parseForm(debouncedForm)} />
          ) : (
            <EmptyResult>
              <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>Your estimate appears here as you type.</p>
              <p>
                Start with your medical bills so far. You&rsquo;ll get a likely figure, a low-to-high range,
                and a breakdown of economic damages, pain and suffering, and any fault reduction. Add the other
                driver&rsquo;s policy limit to see whether it caps your recovery.
              </p>
            </EmptyResult>
          )}
        </div>
      </div>

      {result && <NextSteps cards={nextSteps} tool={TOOL} stateSlug={stateSlug} />}
    </div>
  )
}
