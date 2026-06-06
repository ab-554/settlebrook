'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/WorkersCompCalculator.tsx
// Tool #3 — Workers Comp Settlement Calculator main panel.
// Mirrors CarAccidentCalculator.tsx structure:
//   • Step 1: State selector + Average Weekly Wage
//   • Step 2: Benefit type toggle (TTD / PPD / PTD)
//   • Step 3: Benefit-specific inputs (varies per type)
//   • Step 4: Has Attorney toggle
//   • Calls calculateWorkersComp() from workersComp.ts
//   • Passes WorkersCompResult to WorkersCompResult component
//   • Texas non-subscriber warning panel
//   • AD_SLOT_MID between form and results
//   • Same glassmorphism card + AGENTS.md color tokens throughout
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import CalculatorInput from './CalculatorInput'
import BodyPartSelector from './BodyPartSelector'
import ImpairmentSlider from './ImpairmentSlider'
import WorkersCompResult from './WorkersCompResult'
import DisclaimerBanner from './DisclaimerBanner'
import { calculateWorkersComp } from '@/lib/calculations/workersComp'
import { WORKERS_COMP_STATES } from '@/lib/data/workersCompStates'
import type { WorkersCompResult as WorkersCompResultType } from '@/lib/calculations/types'

// ─── Props ───────────────────────────────────────────────────────────────────

interface WorkersCompCalculatorProps {
  stateSlug?: string
  stateName?: string
}

// ─── Benefit type toggle option ───────────────────────────────────────────────

type BenefitType = 'ttd' | 'ppd' | 'ptd'

const BENEFIT_TYPES: { id: BenefitType; label: string; description: string }[] = [
  {
    id: 'ttd',
    label: 'TTD',
    description: 'Temporary Total Disability — unable to work while recovering',
  },
  {
    id: 'ppd',
    label: 'PPD',
    description: 'Permanent Partial Disability — permanent impairment to a body part',
  },
  {
    id: 'ptd',
    label: 'PTD',
    description: 'Permanent Total Disability — unable to return to any gainful employment',
  },
]

// ─── Internal form shape ─────────────────────────────────────────────────────

interface FormState {
  stateSlug: string
  averageWeeklyWage: string
  benefitType: BenefitType
  // TTD
  treatmentWeeks: string
  // PPD
  bodyPartKey: string
  impairmentPercent: number
  // PTD
  claimantAge: string
  // Shared
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

// ─── Validation helpers ───────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkersCompCalculator({
  stateSlug: propStateSlug,
  stateName: propStateName,
}: WorkersCompCalculatorProps) {
  const [form, setForm]       = useState<FormState>({
    ...INITIAL_FORM,
    // Pre-fill state when the component is rendered on a state page
    stateSlug: propStateSlug ?? '',
  })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [result, setResult]   = useState<WorkersCompResultType | null>(null)
  const [hasCalc, setHasCalc] = useState(false)

  // Resolve state data for the selected slug (used for non-subscriber warning)
  const selectedState = WORKERS_COMP_STATES.find((s) => s.slug === form.stateSlug) ?? null

  // ── Field helpers ──────────────────────────────────────────────────────────

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as string]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field as string]; return n })
    }
  }

  // ── Ad slot placeholder — matches CarAccidentCalculator pattern ────────────
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

  // ── Calculate ──────────────────────────────────────────────────────────────

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const calc = calculateWorkersComp({
      state:             form.stateSlug,
      benefitType:       form.benefitType,
      averageWeeklyWage: parseFloat(form.averageWeeklyWage) || 0,
      hasAttorney:       form.hasAttorney,
      // TTD
      treatmentWeeks:    form.benefitType === 'ttd' ? parseFloat(form.treatmentWeeks) || 0 : undefined,
      // PPD
      bodyPartKey:       form.benefitType === 'ppd' ? form.bodyPartKey : undefined,
      impairmentPercent: form.benefitType === 'ppd' ? form.impairmentPercent : undefined,
      // PTD
      claimantAge:       form.benefitType === 'ptd' ? parseInt(form.claimantAge, 10) || 40 : undefined,
    })

    setResult(calc)
    setHasCalc(true)
    setErrors({})
    setTimeout(
      () => document.getElementById('wc-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      100,
    )
  }

  function handleReset() {
    setForm({ ...INITIAL_FORM, stateSlug: propStateSlug ?? '' })
    setErrors({})
    setResult(null)
    setHasCalc(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex flex-col gap-5" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>

      <DisclaimerBanner variant="banner" stateName={propStateName} />
      <AdSlot id="WC_AD_SLOT_TOP" />

      <section aria-label="Workers comp settlement calculator" className="calc-panel">

        <div className="calc-panel-header">
          <h2 className="text-lg font-bold leading-tight" style={{ color: '#F1F5F9' }}>
            {propStateName
              ? `${propStateName} Workers Comp Settlement Calculator`
              : 'Workers Comp Settlement Calculator'}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
            Estimate TTD, PPD, or PTD benefits based on your state&apos;s workers comp rates
          </p>
        </div>

        <form onSubmit={handleCalculate} noValidate className="px-6 py-6 flex flex-col">

          {/* ── Step 1: State + AWW ── */}
          <fieldset>
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">1</span>
              Your State &amp; Average Weekly Wage
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* State selector — disabled when a state is pre-filled from the page route */}
              <div className="mb-4">
                <label
                  htmlFor="wc-state-select"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#94A3B8' }}
                >
                  State of Injury
                  <span className="block text-xs mt-0.5" style={{ color: '#64748B' }}>
                    Benefits and caps vary by state
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="wc-state-select"
                    value={form.stateSlug}
                    onChange={(e) => updateField('stateSlug', e.target.value)}
                    disabled={!!propStateSlug}
                    aria-invalid={errors.stateSlug ? 'true' : 'false'}
                    className="w-full px-4 py-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${errors.stateSlug ? '#F87171' : 'rgba(99,179,237,0.22)'}`,
                      color: form.stateSlug ? '#F1F5F9' : '#64748B',
                      fontSize: '14px',
                    }}
                  >
                    <option value="" disabled style={{ background: '#0D1526', color: '#64748B' }}>
                      — Select state —
                    </option>
                    {WORKERS_COMP_STATES.map((s) => (
                      <option key={s.slug} value={s.slug} style={{ background: '#0D1526', color: '#E2E8F0' }}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60A5FA' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.stateSlug && (
                  <p role="alert" className="text-xs font-medium leading-snug mt-1.5" style={{ color: '#F87171' }}>
                    {errors.stateSlug}
                  </p>
                )}
              </div>

              <CalculatorInput
                label="Average Weekly Wage (AWW)"
                name="averageWeeklyWage"
                value={form.averageWeeklyWage}
                onChange={(v) => updateField('averageWeeklyWage', v)}
                prefix="$"
                placeholder="1200"
                helpText="Your gross weekly earnings before the injury"
                error={errors.averageWeeklyWage}
              />
            </div>

            {/* State benefit rate summary — shown after state selection */}
            {selectedState && (
              <div
                className="rounded-xl px-4 py-3 flex flex-wrap gap-4 mt-1"
                style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.14)' }}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>State Rate</span>
                  <span className="text-sm font-bold" style={{ color: '#60A5FA' }}>
                    {(selectedState.benefitRate * 100).toFixed(1)}% of AWW
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Weekly Cap ({selectedState.weeklyCapYear})</span>
                  <span className="text-sm font-bold" style={{ color: '#34D399' }}>
                    ${selectedState.weeklyCapAmount.toLocaleString()}/wk
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Max TTD Weeks</span>
                  <span className="text-sm font-bold" style={{ color: '#E2E8F0' }}>
                    {selectedState.maxWeeksTTD} wks
                  </span>
                </div>
              </div>
            )}

            {/* Texas non-subscriber warning — surfaces before calculation */}
            {selectedState?.hasNonSubscriberSystem && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs leading-snug mt-3"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.28)' }}
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FBBF24' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p style={{ color: '#A8843A' }}>
                  <span className="font-semibold" style={{ color: '#FBBF24' }}>Texas Non-Subscriber Alert: </span>
                  Texas employers can opt out of workers compensation. If your employer is a
                  non-subscriber, you cannot file a WC claim — you must file a personal injury
                  lawsuit instead. Verify your employer&apos;s status before proceeding.
                </p>
              </div>
            )}
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 2: Benefit type toggle ── */}
          <fieldset className="mt-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">2</span>
              Type of Disability Benefit
            </legend>

            {/* Toggle buttons — mirrors MethodToggle.tsx visual pattern */}
            <div
              className="grid grid-cols-3 gap-2 rounded-xl p-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)' }}
              role="group"
              aria-label="Disability benefit type"
            >
              {BENEFIT_TYPES.map((bt) => {
                const isActive = form.benefitType === bt.id
                return (
                  <button
                    key={bt.id}
                    type="button"
                    id={`wc-benefit-${bt.id}`}
                    onClick={() => updateField('benefitType', bt.id)}
                    aria-pressed={isActive}
                    className="rounded-lg py-2.5 px-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                        : 'transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      border: isActive ? 'none' : '1px solid transparent',
                    }}
                  >
                    {bt.label}
                  </button>
                )
              })}
            </div>

            {/* Benefit type description */}
            <p className="text-xs mt-2 leading-snug" style={{ color: '#64748B' }}>
              {BENEFIT_TYPES.find((bt) => bt.id === form.benefitType)?.description}
            </p>
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 3: Benefit-specific inputs ── */}
          <fieldset className="mt-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">3</span>
              {form.benefitType === 'ttd' && 'Duration of Disability'}
              {form.benefitType === 'ppd' && 'Injury Details'}
              {form.benefitType === 'ptd' && 'Claimant Details'}
            </legend>

            {/* TTD: treatment weeks */}
            {form.benefitType === 'ttd' && (
              <div className="max-w-xs">
                <CalculatorInput
                  label="Weeks Unable to Work"
                  name="treatmentWeeks"
                  value={form.treatmentWeeks}
                  onChange={(v) => updateField('treatmentWeeks', v)}
                  suffix="weeks"
                  placeholder="12"
                  helpText={
                    selectedState
                      ? `${selectedState.name} TTD maximum: ${selectedState.maxWeeksTTD} weeks`
                      : 'Number of weeks you were totally disabled'
                  }
                  error={errors.treatmentWeeks}
                />
              </div>
            )}

            {/* PPD: body part + impairment slider */}
            {form.benefitType === 'ppd' && (
              <div className="flex flex-col gap-4">
                <BodyPartSelector
                  value={form.bodyPartKey}
                  onChange={(v) => updateField('bodyPartKey', v)}
                  error={errors.bodyPartKey}
                />
                <ImpairmentSlider
                  value={form.impairmentPercent}
                  onChange={(v) => updateField('impairmentPercent', v)}
                  error={errors.impairmentPercent}
                />
                {/* Illinois PPD method note */}
                {selectedState?.ppdMethod === 'percentage_of_person' && (
                  <div
                    className="rounded-xl px-4 py-3 text-xs leading-snug"
                    style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)' }}
                  >
                    <p style={{ color: '#93C5FD' }}>
                      <strong>{selectedState.name}</strong> uses the{' '}
                      <strong>percentage-of-person</strong> PPD method rather than the AMA
                      scheduled-weeks table. PPD is calculated as:{' '}
                      <em>weekly benefit × 500 whole-body weeks × impairment %</em>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PTD: claimant age */}
            {form.benefitType === 'ptd' && (
              <div className="max-w-xs">
                <CalculatorInput
                  label="Age at Time of Injury"
                  name="claimantAge"
                  value={form.claimantAge}
                  onChange={(v) => updateField('claimantAge', v)}
                  suffix="years"
                  placeholder="40"
                  helpText="Used to calculate remaining life expectancy for PTD lump-sum estimate"
                  error={errors.claimantAge}
                />
                <div
                  className="rounded-xl px-4 py-3 text-xs leading-snug"
                  style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)' }}
                >
                  <p style={{ color: '#93C5FD' }}>
                    PTD settlements are present-value estimates of lifetime benefit streams,
                    discounted at 15% to reflect a lump-sum negotiated value. Actual PTD
                    settlements require independent medical and vocational evidence.
                  </p>
                </div>
              </div>
            )}
          </fieldset>

          <hr className="my-5" style={{ borderColor: 'rgba(99,179,237,0.10)' }} />

          {/* ── Step 4: Attorney representation toggle ── */}
          <fieldset className="mt-6 mb-6">
            <legend className="text-sm font-bold flex items-center gap-2.5 mb-3" style={{ color: '#E2E8F0' }}>
              <span className="calc-step-badge">4</span>
              Attorney Representation
            </legend>

            <div className="flex items-center gap-4">
              {/* Toggle switch */}
              <button
                type="button"
                id="wc-has-attorney"
                role="switch"
                aria-checked={form.hasAttorney}
                onClick={() => updateField('hasAttorney', !form.hasAttorney)}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                style={{
                  background: form.hasAttorney
                    ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                    : 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(99,179,237,0.22)',
                }}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200"
                  style={{ transform: form.hasAttorney ? 'translateX(20px)' : 'translateX(2px)', marginTop: '0.5px' }}
                  aria-hidden="true"
                />
              </button>
              <label htmlFor="wc-has-attorney" className="text-sm" style={{ color: '#E2E8F0', cursor: 'pointer' }}>
                {form.hasAttorney ? 'I have an attorney' : 'No attorney (self-represented)'}
              </label>
            </div>

            {/* Attorney adjustment note */}
            <div
              className="mt-3 rounded-xl px-4 py-3 text-xs leading-snug"
              style={{
                background: form.hasAttorney ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${form.hasAttorney ? 'rgba(52,211,153,0.22)' : 'rgba(99,179,237,0.10)'}`,
              }}
            >
              <p style={{ color: form.hasAttorney ? '#34D399' : '#64748B' }}>
                {form.hasAttorney
                  ? '✓ Attorney adjustment applied (+25%). Represented claimants receive higher settlements on average — attorney fees typically run 15–25% of the final award.'
                  : 'Represented claimants receive higher settlements on average. Toggle on if you have or plan to retain a workers comp attorney.'}
              </p>
            </div>
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
          id="wc-results"
          aria-label="Your workers comp settlement estimate"
          aria-live="polite"
          className="scroll-mt-4"
        >
          <AdSlot id="WC_AD_SLOT_MID" />
          <div className="mt-4">
            <WorkersCompResult result={result} />
          </div>
        </section>
      )}

      <AdSlot id="WC_AD_SLOT_BOTTOM" />
    </div>
  )
}
