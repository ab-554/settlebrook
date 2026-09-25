'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CalculatorResult.tsx
// Tool #1 result. Maps PainSufferingCalculationResult onto the shared
// ResultFrame: likely amount, low/likely/high range (multiplier method only —
// the per diem method produces no range, so none is shown), breakdown,
// formula lines, state-law callouts (wording unchanged), and the alternate
// method comparison.
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatMultiplier } from '@/lib/calculations/painSuffering'
import { getStateBySlug } from '@/lib/data/states'
import { getFaultBarStatus, getModifiedBarThreshold } from '@/lib/faultRules'
import type {
  PainSufferingCalculationResult,
  MultiplierResult,
  PerDiemResult,
} from '@/lib/calculations/types'
import ResultFrame, { Formula, type BreakdownRow } from './ResultFrame'

export interface ParsedInputs {
  medicalBills: number
  futureMedical: number
  lostWages: number
  futureLostWages: number
  propertyDamage: number
  multiplier: number
  dailyRate: number
  recoveryDays: number
  plaintiffFaultPercent: number
}

interface CalculatorResultProps {
  result: PainSufferingCalculationResult
  activeMethod: 'multiplier' | 'per-diem'
  inputs: ParsedInputs
}

const ECON_SWATCH = 'var(--primary)'
const PS_SWATCH = 'var(--money)'

export default function CalculatorResult({ result, activeMethod, inputs }: CalculatorResultProps) {
  const { multiplierResult, perDiemResult, specialDamages, stateSlug } = result

  const primaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? multiplierResult : perDiemResult
  const secondaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? perDiemResult : multiplierResult

  if (!primaryResult) return null

  const isMultiplier = primaryResult.method === 'multiplier'
  const painAndSuffering = primaryResult.painAndSuffering

  // For multiplier method use adjustedTotal (post-fault) as the hero number;
  // for per-diem we keep totalEstimate as-is (no fault reduction implemented there).
  const mResult = isMultiplier ? (primaryResult as MultiplierResult) : null
  const faultPct = mResult?.plaintiffFaultPercent ?? 0
  const faultReduction = mResult?.faultReduction ?? 0
  const totalEstimate = isMultiplier ? mResult!.adjustedTotal : primaryResult.totalEstimate

  const range = mResult ? { low: mResult.rangeLow, likely: mResult.adjustedTotal, high: mResult.rangeHigh } : null

  const stateData = stateSlug ? getStateBySlug(stateSlug) : null
  const showDamageCapWarning = stateData?.hasDamageCap && stateData.damageCap !== null && totalEstimate > stateData.damageCap
  // Fault warnings come from the state's own faultRule via lib/faultRules.ts —
  // pure comparative never bars, modified 50/51 bars at its threshold,
  // contributory bars on any fault. No state names are hardcoded here.
  const faultBar = getFaultBarStatus(stateData?.faultRule, faultPct)
  const showContributoryWarning = faultBar === 'contributory'
  const showModifiedComparativeWarning = faultBar === 'modified-bar'
  const showNoFaultNotice = stateData?.isNoFaultState === true
  const showFloridaNotice = stateData?.slug === 'florida'

  const preFaultTotal = specialDamages + painAndSuffering
  const econPct = preFaultTotal > 0 ? (specialDamages / preFaultTotal) * 100 : 0
  const psPct = preFaultTotal > 0 ? (painAndSuffering / preFaultTotal) * 100 : 0

  const rows: BreakdownRow[] = [
    { label: 'Economic damages (medical, wages, etc.)', value: specialDamages, swatch: ECON_SWATCH, pct: econPct },
    {
      label: isMultiplier && multiplierResult
        ? `Pain & suffering (${formatMultiplier(multiplierResult.multiplierUsed)} multiplier)`
        : 'Pain & suffering (per diem)',
      value: painAndSuffering, swatch: PS_SWATCH, pct: psPct,
    },
  ]
  if (isMultiplier && faultPct > 0 && faultReduction > 0) {
    rows.push({ label: `Fault reduction (${faultPct}%)`, value: faultReduction, negative: true })
  }
  rows.push({ label: 'Estimated total', value: totalEstimate, total: true })

  const multiplierBase = inputs.medicalBills + inputs.futureMedical + inputs.lostWages + inputs.futureLostWages
  const formulaLines = isMultiplier && mResult
    ? [
        `Multiplier base = ${formatCurrency(inputs.medicalBills)} medical + ${formatCurrency(inputs.futureMedical)} future medical + ${formatCurrency(inputs.lostWages)} lost wages + ${formatCurrency(inputs.futureLostWages)} future earnings = ${formatCurrency(multiplierBase)}`,
        `Economic damages = ${formatCurrency(multiplierBase)} + ${formatCurrency(inputs.propertyDamage)} property damage = ${formatCurrency(specialDamages)}`,
        `Pain & suffering = ${formatCurrency(multiplierBase)} × ${formatMultiplier(mResult.multiplierUsed)} = ${formatCurrency(painAndSuffering)}`,
        `Total before fault = ${formatCurrency(specialDamages)} + ${formatCurrency(painAndSuffering)} = ${formatCurrency(mResult.totalEstimate)}`,
        ...(faultPct > 0 ? [`Fault reduction = ${formatCurrency(mResult.totalEstimate)} × ${faultPct}% = −${formatCurrency(faultReduction)}`] : []),
        `Likely estimate = ${formatCurrency(totalEstimate)}`,
        `Range = same math at ${formatMultiplier(Math.max(1.0, mResult.multiplierUsed - 0.5))} and ${formatMultiplier(Math.min(6.0, mResult.multiplierUsed + 0.5))} → ${formatCurrency(mResult.rangeLow)} to ${formatCurrency(mResult.rangeHigh)}`,
      ]
    : [
        `Pain & suffering = ${formatCurrency((primaryResult as PerDiemResult).dailyRateUsed)}/day × ${(primaryResult as PerDiemResult).recoveryDaysUsed.toLocaleString()} days = ${formatCurrency(painAndSuffering)}`,
        `Economic damages = ${formatCurrency(specialDamages)}`,
        `Estimated total = ${formatCurrency(specialDamages)} + ${formatCurrency(painAndSuffering)} = ${formatCurrency(totalEstimate)}`,
      ]

  const copyText = [
    `Settlebrook pain & suffering estimate (${isMultiplier ? 'multiplier method' : 'per diem method'})`,
    stateData ? `State: ${stateData.name}` : null,
    `Likely estimate: ${formatCurrency(totalEstimate)}`,
    range ? `Range: ${formatCurrency(range.low)} to ${formatCurrency(range.high)}` : null,
    `Economic damages: ${formatCurrency(specialDamages)}`,
    `Pain & suffering: ${formatCurrency(painAndSuffering)}`,
    faultPct > 0 ? `Fault reduction (${faultPct}%): −${formatCurrency(faultReduction)}` : null,
    '',
    'Estimate only — not legal advice. Actual settlements depend on liability, insurance limits, evidence, and negotiation.',
    typeof window !== 'undefined' ? window.location.href : 'https://www.settlebrook.com/pain-and-suffering-calculator/',
  ].filter((l) => l !== null).join('\n')

  return (
    <ResultFrame
      tool="pain-suffering"
      title="Estimated total settlement"
      methodLabel={isMultiplier ? 'Multiplier method' : 'Per diem method'}
      amount={totalEstimate}
      amountNote={!isMultiplier && perDiemResult ? `${formatCurrency(perDiemResult.dailyRateUsed)}/day × ${perDiemResult.recoveryDaysUsed.toLocaleString()} days` : undefined}
      range={range}
      bar={[
        { pct: econPct, color: ECON_SWATCH, label: 'Economic damages' },
        { pct: psPct, color: PS_SWATCH, label: 'Pain & suffering' },
      ]}
      rows={rows}
      formula={<Formula lines={formulaLines} />}
      copyText={copyText}
      stateSlug={stateSlug ?? undefined}
      disclaimer={
        <>
          <strong style={{ color: 'var(--amber)' }}>Estimate only — not legal advice.</strong>{' '}
          Actual settlements depend on liability, insurance limits, evidence, and negotiation.
          Consult a licensed personal injury attorney for advice on your case.
        </>
      }
    >
      {/* State-specific warnings — wording unchanged */}
      {stateData && (showDamageCapWarning || showContributoryWarning || showModifiedComparativeWarning || showNoFaultNotice || showFloridaNotice) && (
        <div className="flex flex-col gap-3">
          {showDamageCapWarning && (
            <div className="note note-caution">
              <p className="font-semibold mb-1" style={{ color: 'var(--amber)' }}>{stateData.name} Damage Cap Notice:</p>
              <p>{stateData.name} limits pain &amp; suffering damages to {formatCurrency(stateData.damageCap!)}. Your estimate exceeds this limit. Actual recovery may be reduced. {stateData.damageCapNotes}</p>
            </div>
          )}
          {showContributoryWarning && (
            <div className="note note-danger" role="alert">
              <p className="font-semibold mb-1" style={{ color: 'var(--danger)' }}>Critical:</p>
              <p>{stateData.name} follows pure contributory negligence. Any fault on your part — even 1% — completely bars recovery. Your estimate above assumes zero fault on your part.</p>
            </div>
          )}
          {showModifiedComparativeWarning && (
            <div className="note note-danger" role="alert">
              <p className="font-semibold mb-1" style={{ color: 'var(--danger)' }}>Recovery Barred:</p>
              <p>In {stateData.name}, being {faultPct}% at fault exceeds the {getModifiedBarThreshold(stateData.faultRule)}% threshold. You would not be able to recover damages under {stateData.name} law.</p>
            </div>
          )}
          {showNoFaultNotice && (
            <div className="note note-info">
              <p><strong>{stateData.name} is a no-fault state.</strong> You must first file with your own insurance under PIP coverage. You can only sue for pain &amp; suffering if your injuries exceed your state&apos;s serious injury threshold.</p>
            </div>
          )}
          {showFloridaNotice && (
            <div className="note note-info">
              <p><strong>Florida Note:</strong> Since 2023 (HB837), Florida limits evidence of medical bills to amounts actually paid by insurance — not billed amounts. Insurance adjusters may calculate your economic damages lower than your total medical bills.</p>
            </div>
          )}
        </div>
      )}

      {/* Alternate-method comparison */}
      {secondaryResult && (
        <div className="card-flat" style={{ padding: '14px 16px' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="result-range-label">
                {secondaryResult.method === 'multiplier' ? 'Multiplier method' : 'Per diem method'} comparison
              </span>
              <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
                {secondaryResult.method === 'per-diem' && perDiemResult
                  ? `${formatCurrency(perDiemResult.dailyRateUsed)}/day × ${perDiemResult.recoveryDaysUsed.toLocaleString()} days`
                  : multiplierResult ? `${formatMultiplier(multiplierResult.multiplierUsed)} multiplier` : ''}
              </span>
            </div>
            <span className="text-xl font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
              {formatCurrency(secondaryResult.totalEstimate)}
            </span>
          </div>
        </div>
      )}
    </ResultFrame>
  )
}
