'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/PainSufferingCalculator.tsx
// Tool #1 panel. Design-refresh (2026-09): the estimate is LIVE — it
// recomputes ~250ms after typing stops, with no submit needed. "Show my
// estimate" only reveals validation and scrolls to the result on mobile.
// Every formula still comes from lib/calculations/painSuffering.ts (protected).
// Layout: form (left) + sticky estimate card (right) on desktop; stacked on
// mobile. Next-step cards render under the grid once a result exists.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react'
import CalculatorInput from './CalculatorInput'
import MultiplierSelector from './MultiplierSelector'
import MethodToggle, { type CalculationMethod } from './MethodToggle'
import FaultSlider from './FaultSlider'
import CalculatorResult from './CalculatorResult'
import DisclaimerBanner from './DisclaimerBanner'
import { StepHeader, Progress, PrivacyNote } from './Steps'
import { EmptyResult, NextSteps } from './ResultFrame'
import { useDebouncedValue } from './hooks'
import { trackEvent } from '@/lib/analytics'
import type { NextStepCard } from '@/lib/nextSteps'
import {
  calculatePainAndSuffering,
  validateEconomicDamages,
  validateMultiplierInputs,
  validatePerDiemInputs,
  SEVERITY_CONFIGS,
  annualSalaryToDailyRate,
} from '@/lib/calculations/painSuffering'
import type { SeverityLevel, ValidationError } from '@/lib/calculations/types'

interface PainSufferingCalculatorProps {
  stateSlug?: string
  stateName?: string
  faultRule?: string
  nextSteps?: NextStepCard[]
}

interface FormState {
  medicalBills: string; futureMedical: string; lostWages: string
  futureLostWages: string; propertyDamage: string; severity: SeverityLevel
  dailyRate: string; recoveryDays: string; annualSalary: string
  plaintiffFaultPercent: string
}

const INITIAL_FORM: FormState = {
  medicalBills: '', futureMedical: '', lostWages: '', futureLostWages: '',
  propertyDamage: '', severity: 'moderate', dailyRate: '', recoveryDays: '', annualSalary: '',
  plaintiffFaultPercent: '0',
}

const TOOL = 'pain-suffering' as const
export const PS_CALC_ID = 'calculator'
export const PS_RESULT_ID = 'calculator-results'

function toRecord(errs: ValidationError[]) {
  return Object.fromEntries(errs.map((e) => [e.field, e.message]))
}

function parseForm(form: FormState) {
  const faultPct = Math.max(0, Math.min(99, parseFloat(form.plaintiffFaultPercent) || 0))
  return {
    medicalBills:          parseFloat(form.medicalBills)         || 0,
    futureMedical:         parseFloat(form.futureMedical)        || 0,
    lostWages:             parseFloat(form.lostWages)            || 0,
    futureLostWages:       parseFloat(form.futureLostWages)      || 0,
    propertyDamage:        parseFloat(form.propertyDamage)       || 0,
    multiplier:            SEVERITY_CONFIGS[form.severity].multiplier,
    dailyRate:             parseFloat(form.dailyRate)            || 0,
    recoveryDays:          parseFloat(form.recoveryDays)         || 0,
    plaintiffFaultPercent: faultPct,
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

export default function PainSufferingCalculator({ stateSlug, stateName, faultRule, nextSteps = [] }: PainSufferingCalculatorProps) {
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

  // Errors are computed from the live form but only *shown* for fields the
  // user has left, or everything once "Show my estimate" was pressed.
  const errors = useMemo(() => validate(form, activeMethod), [form, activeMethod])
  const visibleErrors = useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([k]) => submitted || touched[k])),
    [errors, submitted, touched],
  )

  // The estimate itself runs on the debounced form so it settles after typing.
  const result = useMemo(() => {
    if (Object.keys(validate(debouncedForm, activeMethod)).length) return null
    const p = parseForm(debouncedForm)
    const eco = {
      medicalBills: p.medicalBills, futureMedical: p.futureMedical,
      lostWages: p.lostWages, futureLostWages: p.futureLostWages, propertyDamage: p.propertyDamage,
    }
    return calculatePainAndSuffering({
      multiplierInputs: { ...eco, multiplier: p.multiplier, plaintiffFaultPercent: p.plaintiffFaultPercent },
      perDiemInputs: p.dailyRate > 0 && p.recoveryDays > 0
        ? { ...eco, dailyRate: p.dailyRate, recoveryDays: p.recoveryDays }
        : null,
      stateSlug: stateSlug ?? null,
    })
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
      // Let the error text render, then move focus to the first invalid field.
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
        el?.focus()
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 0)
      return
    }
    document.getElementById(PS_RESULT_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleReset() {
    setForm(INITIAL_FORM); setTouched({}); setSubmitted(false)
  }

  // Progress: 1 costs entered · 2 method/severity ready · 3 fault answered (0% counts)
  const step1Done = parsed.medicalBills > 0
  const step2Done = step1Done && (activeMethod === 'multiplier' || (parsed.dailyRate > 0 && parsed.recoveryDays > 0))
  const step3Done = step2Done && result !== null
  const doneCount = [step1Done, step2Done, step3Done].filter(Boolean).length
  const stateOf = (done: boolean, prevDone: boolean) => (done ? 'done' : prevDone ? 'active' : 'todo')

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Form ── */}
        <section id={PS_CALC_ID} aria-label="Pain and suffering calculator" className="calc-panel lg:col-span-7">
          <div className="calc-panel-header">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="heading-display" style={{ fontSize: 22 }}>
                  {stateName ? `Enter your ${stateName} damages` : 'Enter your damages'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--ink-3)' }}>
                  Three short steps. The estimate updates as you type.
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
                hint="Add up every bill and lost paycheck tied to the injury. A rough total is fine to start."
                state={stateOf(step1Done, true)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <CalculatorInput label="Medical bills (to date)" name="medicalBills" value={form.medicalBills} onChange={(v) => updateField('medicalBills', v)} onBlur={() => touch('medicalBills')} prefix="$" placeholder="0" helpText="All medical expenses incurred so far" error={visibleErrors.medicalBills} />
                <CalculatorInput label="Estimated future medical" name="futureMedical" value={form.futureMedical} onChange={(v) => updateField('futureMedical', v)} onBlur={() => touch('futureMedical')} prefix="$" placeholder="0" helpText="Future surgery, therapy, or ongoing care" error={visibleErrors.futureMedical} />
                <CalculatorInput label="Lost wages (to date)" name="lostWages" value={form.lostWages} onChange={(v) => updateField('lostWages', v)} onBlur={() => touch('lostWages')} prefix="$" placeholder="0" helpText="Income lost during your recovery" error={visibleErrors.lostWages} />
                <CalculatorInput label="Future lost earnings" name="futureLostWages" value={form.futureLostWages} onChange={(v) => updateField('futureLostWages', v)} onBlur={() => touch('futureLostWages')} prefix="$" placeholder="0" helpText="If injury reduces future earning capacity" error={visibleErrors.futureLostWages} />
              </div>
            </fieldset>

            {/* ── Step 2: Method ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={2}
                title="How severe is the injury?"
                hint="The multiplier method is the most widely used estimate. Per diem prices each day of recovery instead."
                state={stateOf(step2Done, step1Done)}
              />
              <MethodToggle active={activeMethod} onChange={changeMethod} />
              {/* key re-mounts the block so the 150ms fade/slide plays on method change */}
              <div className="mt-4 fade-in" key={activeMethod}>
                {activeMethod === 'multiplier' && (
                  <MultiplierSelector selected={form.severity} onSelect={(level: SeverityLevel) => updateField('severity', level)} />
                )}
                {activeMethod === 'per-diem' && (
                  <div className="flex flex-col gap-3">
                    <div className="note note-info">
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                        Enter your annual salary to auto-calculate your daily rate
                      </p>
                      <CalculatorInput label="Annual salary (optional helper)" name="annualSalary" value={form.annualSalary} onChange={handleSalaryHelper} prefix="$" placeholder="65,000" helpText="We'll divide by 365 to get your daily rate" className="mb-0" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <CalculatorInput label="Daily rate" name="dailyRate" value={form.dailyRate} onChange={(v) => updateField('dailyRate', v)} onBlur={() => touch('dailyRate')} prefix="$" placeholder="200" helpText="Dollar value per day of suffering ($100–$500 typical)" error={visibleErrors.dailyRate} />
                      <CalculatorInput label="Recovery days" name="recoveryDays" value={form.recoveryDays} onChange={(v) => updateField('recoveryDays', v)} onBlur={() => touch('recoveryDays')} suffix="days" placeholder="90" format="integer" helpText="Days from injury to maximum medical improvement" error={visibleErrors.recoveryDays} />
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
                otherParty="the other party"
              />
            </fieldset>

            {/* Actions */}
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

        {/* ── Live estimate ── */}
        <div
          id={PS_RESULT_ID}
          aria-label="Your settlement estimate"
          aria-live="polite"
          className="lg:col-span-5 lg:sticky"
          style={{ top: 'calc(var(--header-h) + 16px)', scrollMarginTop: 'calc(var(--header-h) + 12px)' }}
        >
          {result ? (
            <CalculatorResult result={result} activeMethod={activeMethod} inputs={parseForm(debouncedForm)} />
          ) : (
            <EmptyResult>
              <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>Your estimate appears here as you type.</p>
              <p>
                Start with your medical bills so far. You&rsquo;ll get a likely figure, a low-to-high range,
                and a breakdown of economic damages, pain and suffering, and any fault reduction.
              </p>
            </EmptyResult>
          )}
        </div>
      </div>

      <NextSteps cards={nextSteps} tool={TOOL} stateSlug={stateSlug} />
    </div>
  )
}
