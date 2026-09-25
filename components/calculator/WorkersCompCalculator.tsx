'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/WorkersCompCalculator.tsx
// Tool #3 — Workers Comp Settlement Calculator panel (live estimate):
//   • Step 1: State selector + Average Weekly Wage
//   • Step 2: Benefit type (TTD / PPD / PTD)
//   • Step 3: Benefit-specific inputs
//   • Step 4: Has Attorney toggle
//   • Calls calculateWorkersComp() from workersComp.ts (protected)
//   • Texas non-subscriber warning, Illinois PPD note, PTD note — wording unchanged
//   • Non-generic PPD states (MI, MN, NJ, VA): PPD output replaced by the
//     statute explanation, exactly as before (LEGAL-FIXES.md A.12)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import CalculatorInput from './CalculatorInput'
import BodyPartSelector from './BodyPartSelector'
import ImpairmentSlider from './ImpairmentSlider'
import WorkersCompResult from './WorkersCompResult'
import DisclaimerBanner from './DisclaimerBanner'
import { StepHeader, Progress, PrivacyNote } from './Steps'
import { EmptyResult, NextSteps } from './ResultFrame'
import { useDebouncedValue } from './hooks'
import { trackEvent } from '@/lib/analytics'
import type { NextStepCard } from '@/lib/nextSteps'
import { calculateWorkersComp } from '@/lib/calculations/workersComp'
import { WORKERS_COMP_STATES, NON_GENERIC_PPD_SLUGS, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'

// ─── States where the generic AMA-scheduled-weeks PPD formula does not match
// the state's real method (LEGAL-FIXES.md A.12). PPD output is hidden for
// these states and replaced with a short explanation + statute link.
// State-specific PPD module planned — do not re-enable generic PPD here.
const NON_GENERIC_PPD_INFO: Record<string, { explanation: string; statuteLabel: string; statuteUrl: string }> = {
  michigan: {
    explanation:
      'Michigan PPD uses a fixed statutory schedule of weeks per body part (thumb 65, hand 215, arm 269, leg 215, foot 162, eye 162) under MCL 418.361 — not the AMA Guides, and not scaled by an impairment percentage the way this calculator\'s generic formula assumes.',
    statuteLabel: 'MCL 418.361 — specific loss schedule',
    statuteUrl: 'https://codes.findlaw.com/mi/chapter-418-workers-disability-compensation/mi-comp-laws-418-361/',
  },
  minnesota: {
    explanation:
      'Minnesota PPD is not weeks-based at all. A physician rates whole-body impairment as a percentage under the state\'s own Administrative Rules Chapter 5223, and that percentage is multiplied by a dollar figure from the statutory table in Minn. Stat. § 176.101, subd. 2a to produce a lump-sum award.',
    statuteLabel: 'Minn. Stat. § 176.101',
    statuteUrl: 'https://www.revisor.mn.gov/statutes/cite/176.101',
  },
  'new-jersey': {
    explanation:
      'New Jersey PPD uses its own statutory schedule of weeks per body part (arm 330, hand up to 300, foot up to 285, thumb 80, etc.) under R.S. 34:15-12(c) — not the AMA Guides.',
    statuteLabel: 'NJDOL schedule of disabilities',
    statuteUrl: 'https://www.nj.gov/labor/workerscompensation/assets/PDFs/Legal/2022_schedule.pdf',
  },
  virginia: {
    explanation:
      'Virginia PPD uses its own statutory schedule of weeks per body part (arm 200, hand 150, foot 125, leg 175, thumb 60, single eye 100, single ear 50) under Va. Code § 65.2-503, proportionally awarded for partial loss of use — not the AMA Guides.',
    statuteLabel: 'Va. Code § 65.2-503',
    statuteUrl: 'https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/',
  },
}

interface WorkersCompCalculatorProps {
  stateSlug?: string
  stateName?: string
  nextSteps?: NextStepCard[]
}

type BenefitType = 'ttd' | 'ppd' | 'ptd'

const BENEFIT_TYPES: { id: BenefitType; label: string; short: string; description: string }[] = [
  { id: 'ttd', label: 'TTD', short: 'Temporary total', description: 'Temporary Total Disability — unable to work while recovering' },
  { id: 'ppd', label: 'PPD', short: 'Permanent partial', description: 'Permanent Partial Disability — permanent impairment to a body part' },
  { id: 'ptd', label: 'PTD', short: 'Permanent total', description: 'Permanent Total Disability — unable to return to any gainful employment' },
]

interface FormState {
  stateSlug: string
  averageWeeklyWage: string
  benefitType: BenefitType
  treatmentWeeks: string
  bodyPartKey: string
  impairmentPercent: number
  claimantAge: string
  hasAttorney: boolean
}

const INITIAL_FORM: FormState = {
  stateSlug: '',
  averageWeeklyWage: '',
  benefitType: 'ttd',
  treatmentWeeks: '',
  bodyPartKey: '',
  impairmentPercent: 0,
  claimantAge: '',
  hasAttorney: false,
}

const TOOL = 'workers-comp' as const
export const WC_CALC_ID = 'calculator'
export const WC_RESULT_ID = 'wc-results'

// ─── Validation (unchanged rules) ────────────────────────────────────────────
function validateForm(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.stateSlug) {
    errors.stateSlug = 'Select your state to calculate state-specific benefits'
  }

  const aww = parseFloat(form.averageWeeklyWage)
  if (!form.averageWeeklyWage || isNaN(aww) || aww <= 0) {
    errors.averageWeeklyWage = 'Enter your Average Weekly Wage (gross weekly earnings)'
  } else if (aww > 50000) {
    errors.averageWeeklyWage = 'Weekly wage exceeds $50,000 — verify your entry'
  }

  if (form.benefitType === 'ttd') {
    const weeks = parseFloat(form.treatmentWeeks)
    if (!form.treatmentWeeks || isNaN(weeks) || weeks <= 0) {
      errors.treatmentWeeks = 'Enter the number of weeks you were unable to work'
    } else if (weeks > 1000) {
      errors.treatmentWeeks = 'Treatment weeks exceed 1,000 — verify your entry'
    }
  }

  if (form.benefitType === 'ppd') {
    if (!form.bodyPartKey) {
      errors.bodyPartKey = 'Select the primary injured body part'
    }
    if (form.impairmentPercent <= 0) {
      errors.impairmentPercent = 'Enter your physician-assigned impairment rating'
    }
  }

  if (form.benefitType === 'ptd') {
    const age = parseInt(form.claimantAge, 10)
    if (!form.claimantAge || isNaN(age) || age < 18 || age > 85) {
      errors.claimantAge = 'Enter your age at time of injury (18–85)'
    }
  }

  return errors
}

export default function WorkersCompCalculator({
  stateSlug: propStateSlug,
  stateName: propStateName,
  nextSteps = [],
}: WorkersCompCalculatorProps) {
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM, stateSlug: propStateSlug ?? '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const stateSelectId = useId()
  const attorneyId = useId()

  const debouncedForm = useDebouncedValue(form, 250)
  const selectedState = WORKERS_COMP_STATES.find((s) => s.slug === form.stateSlug) ?? null

  function markStarted() {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('calculator_start', { tool: TOOL, state: propStateSlug })
  }
  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    markStarted()
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  function touch(field: keyof FormState) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }

  const errors = useMemo(() => validateForm(form), [form])
  const visibleErrors = useMemo(
    () => Object.fromEntries(Object.entries(errors).filter(([k]) => submitted || touched[k])),
    [errors, submitted, touched],
  )

  const result = useMemo(() => {
    if (Object.keys(validateForm(debouncedForm)).length) return null
    return calculateWorkersComp({
      state:             debouncedForm.stateSlug,
      benefitType:       debouncedForm.benefitType,
      averageWeeklyWage: parseFloat(debouncedForm.averageWeeklyWage) || 0,
      hasAttorney:       debouncedForm.hasAttorney,
      treatmentWeeks:    debouncedForm.benefitType === 'ttd' ? parseFloat(debouncedForm.treatmentWeeks) || 0 : undefined,
      bodyPartKey:       debouncedForm.benefitType === 'ppd' ? debouncedForm.bodyPartKey : undefined,
      impairmentPercent: debouncedForm.benefitType === 'ppd' ? debouncedForm.impairmentPercent : undefined,
      claimantAge:       debouncedForm.benefitType === 'ptd' ? parseInt(debouncedForm.claimantAge, 10) || 40 : undefined,
    })
  }, [debouncedForm])

  useEffect(() => {
    if (result && !completedRef.current) {
      completedRef.current = true
      trackEvent('calculator_complete', { tool: TOOL, state: propStateSlug })
    }
  }, [result, propStateSlug])

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
    document.getElementById(WC_RESULT_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleReset() {
    setForm({ ...INITIAL_FORM, stateSlug: propStateSlug ?? '' })
    setTouched({}); setSubmitted(false)
  }

  // Hub only: once a state is chosen, offer its dedicated page as a next step.
  const resultState = WORKERS_COMP_STATES.find((s) => s.slug === debouncedForm.stateSlug) ?? null
  const dynamicSteps: NextStepCard[] = useMemo(() => {
    if (propStateSlug || !resultState || NOINDEXED_WORKERS_COMP_SLUGS.has(resultState.slug)) return nextSteps
    const stateCard: NextStepCard = {
      id: 'state-page',
      kicker: 'Your state',
      title: `${resultState.name} workers comp settlement guide`,
      desc: 'Rates, caps, PPD rules, and deadlines specific to your state.',
      href: `/workers-comp-settlement-calculator/${resultState.slug}/`,
    }
    return [stateCard, ...nextSteps.filter((c) => c.id !== 'choose-state')].slice(0, 3)
  }, [propStateSlug, resultState, nextSteps])

  const aww = parseFloat(form.averageWeeklyWage) || 0
  const step1Done = !!form.stateSlug && aww > 0 && !errors.averageWeeklyWage
  const step2Done = step1Done
  const step3Done = step2Done && !errors.treatmentWeeks && !errors.bodyPartKey && !errors.impairmentPercent && !errors.claimantAge && result !== null
  const doneCount = [step1Done, step2Done, step3Done, step3Done].filter(Boolean).length
  const stateOf = (done: boolean, prevDone: boolean) => (done ? 'done' : prevDone ? 'active' : 'todo')

  const showNonGenericPPD = !!result && result.benefitType === 'ppd' && !!resultState && NON_GENERIC_PPD_SLUGS.has(resultState.slug)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <section id={WC_CALC_ID} aria-label="Workers comp settlement calculator" className="calc-panel lg:col-span-7">
          <div className="calc-panel-header">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="heading-display" style={{ fontSize: 22 }}>
                  {propStateName ? `${propStateName} workers comp estimate` : 'Your workers comp estimate'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--ink-3)' }}>
                  Estimate TTD, PPD, or PTD benefits based on your state&apos;s workers comp rates. Updates as you type.
                </p>
              </div>
              <PrivacyNote />
            </div>
            <div className="mt-3">
              <Progress total={4} done={doneCount} />
            </div>
          </div>

          <form onSubmit={handleShow} noValidate className="calc-body">

            {/* ── Step 1: State + AWW ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={1}
                title="Your state and weekly wage"
                hint="Benefits and caps vary by state. Use your gross weekly pay before the injury."
                state={stateOf(step1Done, true)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <div className="mb-4">
                  <label htmlFor={stateSelectId} className="field-label">State of injury</label>
                  <span className="field-help">Benefits and caps vary by state</span>
                  <div className="field-select-wrap">
                    <select
                      id={stateSelectId}
                      value={form.stateSlug}
                      onChange={(e) => updateField('stateSlug', e.target.value)}
                      onBlur={() => touch('stateSlug')}
                      disabled={!!propStateSlug}
                      aria-invalid={visibleErrors.stateSlug ? 'true' : 'false'}
                      className={`field-select ${visibleErrors.stateSlug ? 'error' : ''}`}
                      style={{ color: form.stateSlug ? 'var(--ink)' : 'var(--ink-3)' }}
                    >
                      <option value="" disabled>— Select state —</option>
                      {WORKERS_COMP_STATES.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                    <span className="field-select-chevron" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </div>
                  {visibleErrors.stateSlug && (
                    <p role="alert" className="field-error">{visibleErrors.stateSlug}</p>
                  )}
                </div>

                <CalculatorInput
                  label="Average weekly wage (AWW)"
                  name="averageWeeklyWage"
                  value={form.averageWeeklyWage}
                  onChange={(v) => updateField('averageWeeklyWage', v)}
                  onBlur={() => touch('averageWeeklyWage')}
                  prefix="$"
                  placeholder="1,200"
                  helpText="Your gross weekly earnings before the injury"
                  error={visibleErrors.averageWeeklyWage}
                />
              </div>

              {/* State benefit rate summary — shown after state selection */}
              {selectedState && (
                <dl className="card-flat grid grid-cols-3 gap-3 text-sm" style={{ padding: '12px 14px', background: 'var(--bg-2)' }}>
                  <div>
                    <dt className="result-range-label">State rate</dt>
                    <dd className="font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>{(selectedState.benefitRate * 100).toFixed(1)}% of AWW</dd>
                  </div>
                  <div>
                    <dt className="result-range-label">Weekly cap</dt>
                    <dd className="font-semibold tabular-nums" style={{ color: 'var(--primary)' }}>${selectedState.weeklyCapAmount.toLocaleString()}/wk</dd>
                    <dd className="text-xs" style={{ color: 'var(--ink-3)' }}>{selectedState.weeklyCapEffectivePeriod}</dd>
                  </div>
                  <div>
                    <dt className="result-range-label">Max TTD weeks</dt>
                    <dd className="font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>
                      {Number.isFinite(selectedState.maxWeeksTTD) ? `${selectedState.maxWeeksTTD} wks` : 'No fixed limit'}
                    </dd>
                  </div>
                </dl>
              )}

              {/* Texas non-subscriber warning — surfaces before calculation */}
              {selectedState?.hasNonSubscriberSystem && (
                <p className="note note-caution mt-3" role="alert">
                  <strong>Texas Non-Subscriber Alert: </strong>
                  Texas employers can opt out of workers compensation. If your employer is a
                  non-subscriber, you cannot file a WC claim — you must file a personal injury
                  lawsuit instead. Verify your employer&apos;s status before proceeding.
                </p>
              )}
            </fieldset>

            {/* ── Step 2: Benefit type ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={2}
                title="Type of disability benefit"
                hint="Pick the benefit that matches where you are in recovery."
                state={stateOf(step2Done, step1Done)}
              />
              <div role="radiogroup" aria-label="Disability benefit type" className="seg" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {BENEFIT_TYPES.map((bt) => {
                  const isActive = form.benefitType === bt.id
                  return (
                    <button
                      key={bt.id}
                      type="button"
                      id={`wc-benefit-${bt.id}`}
                      role="radio"
                      aria-checked={isActive}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => updateField('benefitType', bt.id)}
                      className="seg-btn"
                    >
                      {bt.label}
                      <span className="seg-sub">{bt.short}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-sm mt-2 leading-snug" style={{ color: 'var(--ink-3)' }} aria-live="polite">
                {BENEFIT_TYPES.find((bt) => bt.id === form.benefitType)?.description}
              </p>
            </fieldset>

            {/* ── Step 3: Benefit-specific inputs ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={3}
                title={
                  form.benefitType === 'ttd' ? 'Duration of disability'
                    : form.benefitType === 'ppd' ? 'Injury details'
                    : 'Claimant details'
                }
                state={stateOf(step3Done, step2Done)}
              />

              {form.benefitType === 'ttd' && (
                <div className="max-w-xs">
                  <CalculatorInput
                    label="Weeks unable to work"
                    name="treatmentWeeks"
                    value={form.treatmentWeeks}
                    onChange={(v) => updateField('treatmentWeeks', v)}
                    onBlur={() => touch('treatmentWeeks')}
                    suffix="weeks"
                    placeholder="12"
                    format="decimal"
                    helpText={
                      selectedState
                        ? Number.isFinite(selectedState.maxWeeksTTD)
                          ? `${selectedState.name} TTD maximum: ${selectedState.maxWeeksTTD} weeks`
                          : `${selectedState.name} sets no fixed week limit — paid until maximum medical improvement or return to work`
                        : 'Number of weeks you were totally disabled'
                    }
                    error={visibleErrors.treatmentWeeks}
                  />
                </div>
              )}

              {form.benefitType === 'ppd' && (
                <div className="flex flex-col gap-2">
                  <BodyPartSelector
                    value={form.bodyPartKey}
                    onChange={(v) => { updateField('bodyPartKey', v); touch('bodyPartKey') }}
                    error={visibleErrors.bodyPartKey}
                  />
                  <ImpairmentSlider
                    value={form.impairmentPercent}
                    onChange={(v) => { updateField('impairmentPercent', v); touch('impairmentPercent') }}
                    error={visibleErrors.impairmentPercent}
                  />
                  {/* Illinois PPD method note */}
                  {selectedState?.ppdMethod === 'percentage_of_person' && (
                    <p className="note note-info">
                      <strong>{selectedState.name}</strong> uses the{' '}
                      <strong>percentage-of-person</strong> PPD method rather than the AMA
                      scheduled-weeks table. PPD is calculated as:{' '}
                      <em>weekly benefit × 500 whole-body weeks × impairment %</em>.
                    </p>
                  )}
                </div>
              )}

              {form.benefitType === 'ptd' && (
                <div className="max-w-xs flex flex-col gap-2">
                  <CalculatorInput
                    label="Age at time of injury"
                    name="claimantAge"
                    value={form.claimantAge}
                    onChange={(v) => updateField('claimantAge', v)}
                    onBlur={() => touch('claimantAge')}
                    suffix="years"
                    placeholder="40"
                    format="integer"
                    helpText="Used to calculate remaining life expectancy for PTD lump-sum estimate"
                    error={visibleErrors.claimantAge}
                  />
                  <p className="note note-info">
                    PTD settlements are present-value estimates of lifetime benefit streams,
                    discounted at 15% to reflect a lump-sum negotiated value. Actual PTD
                    settlements require independent medical and vocational evidence.
                  </p>
                </div>
              )}
            </fieldset>

            {/* ── Step 4: Attorney representation toggle ── */}
            <fieldset className="calc-step">
              <StepHeader
                n={4}
                title="Attorney representation"
                state={stateOf(step3Done, step3Done)}
                optional
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id={attorneyId}
                  role="switch"
                  aria-checked={form.hasAttorney}
                  onClick={() => updateField('hasAttorney', !form.hasAttorney)}
                  className="switch"
                >
                  <span className="sr-only">I have an attorney</span>
                  <span className="switch-knob" aria-hidden="true" />
                </button>
                <label htmlFor={attorneyId} className="text-sm font-medium cursor-pointer" style={{ color: 'var(--ink)' }}>
                  {form.hasAttorney ? 'I have an attorney' : 'No attorney (self-represented)'}
                </label>
              </div>
              <p className={`note mt-3 ${form.hasAttorney ? 'note-info' : ''}`}>
                {form.hasAttorney
                  ? 'Attorney adjustment applied (+25%). Represented claimants receive higher settlements on average — attorney fees typically run 15–25% of the final award.'
                  : 'Represented claimants receive higher settlements on average. Toggle on if you have or plan to retain a workers comp attorney.'}
              </p>
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
              <DisclaimerBanner variant="banner" stateName={propStateName} />
            </div>
          </form>
        </section>

        <div
          id={WC_RESULT_ID}
          aria-label="Your workers comp settlement estimate"
          aria-live="polite"
          className="lg:col-span-5 lg:sticky"
          style={{ top: 'calc(var(--header-h) + 16px)', scrollMarginTop: 'calc(var(--header-h) + 12px)' }}
        >
          {result && showNonGenericPPD && resultState ? (
            <div className="note note-info flex flex-col gap-2" style={{ padding: '16px' }}>
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>
                {resultState.name} PPD isn&apos;t calculated by this tool yet
              </p>
              <p className="text-sm leading-relaxed">
                {NON_GENERIC_PPD_INFO[resultState.slug].explanation}
              </p>
              <a
                href={NON_GENERIC_PPD_INFO[resultState.slug].statuteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link text-sm"
              >
                {NON_GENERIC_PPD_INFO[resultState.slug].statuteLabel} →
              </a>
              {!propStateSlug && (
                <Link href={`/workers-comp-settlement-calculator/${resultState.slug}/`} className="text-link text-sm">
                  Open the {resultState.name} page for its own PPD estimator →
                </Link>
              )}
            </div>
          ) : result ? (
            <WorkersCompResult result={result} inputs={debouncedForm} />
          ) : (
            <EmptyResult>
              <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>Your estimate appears here as you type.</p>
              <p>
                Choose your state and enter your average weekly wage. You&rsquo;ll see your capped weekly
                benefit, the weeks it covers, and the estimated settlement for the benefit type you pick.
              </p>
            </EmptyResult>
          )}
        </div>
      </div>

      {!showNonGenericPPD && <NextSteps cards={dynamicSteps} tool={TOOL} stateSlug={propStateSlug} />}
    </div>
  )
}
