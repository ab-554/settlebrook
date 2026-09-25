'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CarAccidentResult.tsx
// Tool #2 result card — mirrors CalculatorResult.tsx on the shared
// ResultFrame but adds:
//   • policyLimitWarning banner (amber, advisory)
//   • vehicle property damage in the economic line
//   • car-accident-specific state law callouts (no-fault threshold note)
// All callout wording is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatMultiplier } from '@/lib/calculations/painSuffering'
import { getCarAccidentStateBySlug } from '@/lib/data/carAccidentStates'
import { getStateBySlug } from '@/lib/data/states'
import { getFaultBarStatus, getModifiedBarThreshold } from '@/lib/faultRules'
import { getAdjacentSeverityRange } from '@/lib/severityRange'
import { capAppliesToGeneralClaims } from '@/lib/damageCaps'
import type {
  CarAccidentResult as CarAccidentResultType,
  MultiplierResult,
  PerDiemResult,
} from '@/lib/calculations/types'
import ResultFrame, { Formula, type BreakdownRow } from './ResultFrame'
import type { ParsedInputs } from './CalculatorResult'

interface CarAccidentResultProps {
  result: CarAccidentResultType
  activeMethod: 'multiplier' | 'per-diem'
  inputs: ParsedInputs & { insurancePolicyLimit?: number }
}

const ECON_SWATCH = 'var(--primary)'
const PS_SWATCH = 'var(--money)'

export default function CarAccidentResult({ result, activeMethod, inputs }: CarAccidentResultProps) {
  const { multiplierResult, perDiemResult, specialDamages, policyLimitWarning, stateSlug } = result

  const primaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? multiplierResult : perDiemResult
  const secondaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? perDiemResult : multiplierResult

  if (!primaryResult) return null

  const isMultiplier = primaryResult.method === 'multiplier'
  const painAndSuffering = primaryResult.painAndSuffering
  const mResult = isMultiplier ? (primaryResult as MultiplierResult) : null
  const faultPct = mResult?.plaintiffFaultPercent ?? 0
  const faultReduction = mResult?.faultReduction ?? 0
  const multiplierUsed = mResult?.multiplierUsed ?? null
  const totalEstimate = isMultiplier ? mResult!.adjustedTotal : primaryResult.totalEstimate
  // Range = the same calculation at the adjacent severity levels (lib/severityRange.ts).
  // The ±0.5 rangeLow/rangeHigh fields on the result are not part of our methodology and are not shown.
  const range = mResult
    ? getAdjacentSeverityRange({
        medicalBills: inputs.medicalBills, futureMedical: inputs.futureMedical, lostWages: inputs.lostWages,
        futureLostWages: inputs.futureLostWages, propertyDamage: inputs.propertyDamage,
        multiplier: mResult.multiplierUsed, plaintiffFaultPercent: inputs.plaintiffFaultPercent,
      }, mResult.adjustedTotal)
    : null
  const pdResult = primaryResult.method === 'per-diem' ? (primaryResult as PerDiemResult) : perDiemResult

  const carState = stateSlug ? getCarAccidentStateBySlug(stateSlug) : null
  const stateData = stateSlug ? getStateBySlug(stateSlug) : null

  // Cap notice only where the cap applies to general personal injury claims (lib/damageCaps.ts):
  // several states' damageCap figure is a medical-malpractice-only cap.
  const showDamageCapWarning = capAppliesToGeneralClaims(stateData) && stateData!.damageCap !== null && totalEstimate > stateData!.damageCap!
  // Fault warnings come from the state's own faultRule via lib/faultRules.ts —
  // pure comparative never bars, modified 50/51 bars at its threshold,
  // contributory bars on any fault. No state names are hardcoded here.
  const faultBar = getFaultBarStatus(stateData?.faultRule, faultPct)
  const showContributoryWarning = faultBar === 'contributory'
  const showModifiedComparativeWarning = faultBar === 'modified-bar'
  // Car-accident-specific: no-fault serious-injury threshold notice
  const showNoFaultThresholdNotice = carState?.isNoFaultState === true

  const preFaultTotal = specialDamages + painAndSuffering
  const econPct = preFaultTotal > 0 ? (specialDamages / preFaultTotal) * 100 : 0
  const psPct = preFaultTotal > 0 ? (painAndSuffering / preFaultTotal) * 100 : 0

  const rows: BreakdownRow[] = [
    { label: 'Economic damages (medical, wages, property)', value: specialDamages, swatch: ECON_SWATCH, pct: econPct },
    {
      label: isMultiplier && multiplierUsed !== null
        ? `Pain & suffering (${formatMultiplier(multiplierUsed)} multiplier)`
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
        `Economic damages = ${formatCurrency(multiplierBase)} + ${formatCurrency(inputs.propertyDamage)} vehicle damage = ${formatCurrency(specialDamages)}  (vehicle damage is never multiplied)`,
        `Pain & suffering = ${formatCurrency(multiplierBase)} × ${formatMultiplier(mResult.multiplierUsed)} = ${formatCurrency(painAndSuffering)}`,
        `Total before fault = ${formatCurrency(specialDamages)} + ${formatCurrency(painAndSuffering)} = ${formatCurrency(mResult.totalEstimate)}`,
        ...(faultPct > 0 ? [`Fault reduction = ${formatCurrency(mResult.totalEstimate)} × ${faultPct}% = −${formatCurrency(faultReduction)}`] : []),
        `Likely estimate = ${formatCurrency(totalEstimate)}`,
        ...(range?.lower ? [`One level lower (${range.lower.label}, ${formatMultiplier(range.lower.multiplier)}) = same math → ${formatCurrency(range.lower.total)}`] : []),
        ...(range?.higher ? [`One level higher (${range.higher.label}, ${formatMultiplier(range.higher.multiplier)}) = same math → ${formatCurrency(range.higher.total)}`] : []),
        ...(inputs.insurancePolicyLimit ? [`Policy limit check: ${formatCurrency(totalEstimate)} vs ${formatCurrency(inputs.insurancePolicyLimit)} limit (advisory only)`] : []),
      ]
    : [
        `Pain & suffering = ${formatCurrency((primaryResult as PerDiemResult).dailyRateUsed)}/day × ${(primaryResult as PerDiemResult).recoveryDaysUsed.toLocaleString()} days = ${formatCurrency(painAndSuffering)}`,
        `Economic damages (incl. vehicle damage) = ${formatCurrency(specialDamages)}`,
        `Estimated total = ${formatCurrency(specialDamages)} + ${formatCurrency(painAndSuffering)} = ${formatCurrency(totalEstimate)}`,
      ]

  const copyText = [
    `Settlebrook car accident settlement estimate (${isMultiplier ? 'multiplier method' : 'per diem method'})`,
    carState ? `State: ${carState.name}` : null,
    `Likely estimate: ${formatCurrency(totalEstimate)}`,
    range?.lower ? `If severity were one level lower (${range.lower.label}, ${formatMultiplier(range.lower.multiplier)}): ${formatCurrency(range.lower.total)}` : null,
    range?.higher ? `If severity were one level higher (${range.higher.label}, ${formatMultiplier(range.higher.multiplier)}): ${formatCurrency(range.higher.total)}` : null,
    `Economic damages (incl. vehicle): ${formatCurrency(specialDamages)}`,
    `Pain & suffering: ${formatCurrency(painAndSuffering)}`,
    faultPct > 0 ? `Fault reduction (${faultPct}%): −${formatCurrency(faultReduction)}` : null,
    policyLimitWarning ? `Policy limit notice: ${policyLimitWarning}` : null,
    '',
    'Estimate only — not legal advice. Actual settlements depend on liability, insurance limits, policy exclusions, evidence quality, and negotiation.',
    typeof window !== 'undefined' ? window.location.href : 'https://www.settlebrook.com/car-accident-settlement-calculator/',
  ].filter((l) => l !== null).join('\n')

  return (
    <ResultFrame
      tool="car-accident"
      title="Estimated car accident settlement"
      methodLabel={isMultiplier ? 'Multiplier method' : 'Per diem method'}
      amount={totalEstimate}
      amountNote={!isMultiplier && pdResult ? `${formatCurrency(pdResult.dailyRateUsed)}/day × ${pdResult.recoveryDaysUsed.toLocaleString()} days` : undefined}
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
          Actual settlements depend on liability, insurance limits, policy exclusions, evidence quality, and negotiation.
          Consult a licensed personal injury attorney for advice on your case.
        </>
      }
    >
      {/* Policy limit advisory warning */}
      {policyLimitWarning && (
        <div className="note note-caution" role="alert" aria-label="Policy limit warning">
          <strong>Policy Limit Notice: </strong>
          {policyLimitWarning}
        </div>
      )}

      {/* State-specific law callouts — wording unchanged */}
      {(stateData || carState) && (showDamageCapWarning || showContributoryWarning || showModifiedComparativeWarning || showNoFaultThresholdNotice) && (
        <div className="flex flex-col gap-3">
          {showDamageCapWarning && stateData && (
            <div className="note note-caution">
              <p className="font-semibold mb-1" style={{ color: 'var(--amber)' }}>{stateData.name} Damage Cap Notice:</p>
              <p>{stateData.name} limits pain &amp; suffering damages to {formatCurrency(stateData.damageCap!)}. Your estimate exceeds this limit. Actual recovery may be reduced. {stateData.damageCapNotes}</p>
            </div>
          )}
          {showContributoryWarning && stateData && (
            <div className="note note-danger" role="alert">
              <p className="font-semibold mb-1" style={{ color: 'var(--danger)' }}>Critical — Contributory Negligence:</p>
              <p>{stateData.name} uses pure contributory negligence. Any fault on your part — even 1% — completely bars recovery from the at-fault driver in a car accident claim. Consult an attorney before assuming you can recover.</p>
            </div>
          )}
          {showModifiedComparativeWarning && stateData && (
            <div className="note note-danger" role="alert">
              <p className="font-semibold mb-1" style={{ color: 'var(--danger)' }}>Recovery Barred:</p>
              <p>
                In {stateData.name}, being {faultPct}% at fault exceeds the{' '}
                {getModifiedBarThreshold(stateData.faultRule)}% threshold.
                Under {stateData.name} law you would not be able to recover damages.
              </p>
            </div>
          )}
          {showNoFaultThresholdNotice && carState && (
            <div className="note note-info">
              <p>
                <strong>{carState.name} is a no-fault insurance state.</strong>{' '}
                Your own PIP coverage pays first for medical bills and lost wages.
                To sue the at-fault driver for pain &amp; suffering you must meet
                the state&apos;s serious injury threshold.{' '}
                {carState.stateSpecificNotes && <span>{carState.stateSpecificNotes}</span>}
              </p>
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
