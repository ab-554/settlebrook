'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/WorkersCompResult.tsx
// Tool #3 result on the shared ResultFrame. Key differences from Tools #1/#2:
//   • No pain & suffering line — WC does not include it (note wording unchanged)
//   • Shows: weekly benefit, benefit rate, weeks covered, base settlement,
//     attorney adjustment
//   • Renders the warnings[] array as caution notes (wording unchanged)
//   • No low/likely/high range — the WC math produces a single figure
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { formatCurrency } from '@/lib/calculations/painSuffering'
import { getBodyPartByKey } from '@/lib/data/bodyParts'
import type { WorkersCompResult as WorkersCompResultType } from '@/lib/calculations/types'
import ResultFrame, { Formula, type BreakdownRow } from './ResultFrame'

interface WorkersCompResultProps {
  result: WorkersCompResultType
  inputs: {
    stateSlug: string
    averageWeeklyWage: string
    benefitType: 'ttd' | 'ppd' | 'ptd'
    treatmentWeeks: string
    bodyPartKey: string
    impairmentPercent: number
    claimantAge: string
    hasAttorney: boolean
  }
}

const BENEFIT_LABELS: Record<string, string> = {
  ttd: 'Temporary Total Disability (TTD)',
  ppd: 'Permanent Partial Disability (PPD)',
  ptd: 'Permanent Total Disability (PTD)',
}

const PPD_METHOD_LABELS: Record<string, string> = {
  ama_schedule: 'AMA Scheduled Award',
  percentage_of_person: 'Percentage of Person',
}

const BASE_SWATCH = 'var(--line-strong)'
const ATTY_SWATCH = 'var(--accent)'

export default function WorkersCompResult({ result, inputs }: WorkersCompResultProps) {
  const {
    benefitType, weeklyBenefit, baseSettlement, adjustedSettlement, hasAttorneyAdjustment,
    weeksCovered, stateWeeklyCap, stateBenefitRate, ppdMethod, warnings,
  } = result

  const attorneyDelta = adjustedSettlement - baseSettlement
  const total = adjustedSettlement
  const basePct = total > 0 ? (baseSettlement / total) * 100 : 100
  const attorneyPct = total > 0 ? (attorneyDelta / total) * 100 : 0
  const isCapped = weeklyBenefit >= stateWeeklyCap
  const aww = parseFloat(inputs.averageWeeklyWage) || 0

  const rows: BreakdownRow[] = [
    {
      label:
        benefitType === 'ttd'
          ? `Base TTD (${weeksCovered ?? 0} wks × ${formatCurrency(weeklyBenefit)}/wk)`
          : benefitType === 'ppd'
            ? `Base PPD (${ppdMethod ? PPD_METHOD_LABELS[ppdMethod] : ''} formula)`
            : 'Base PTD (lifetime benefit stream, discounted)',
      value: baseSettlement,
      swatch: hasAttorneyAdjustment ? BASE_SWATCH : undefined,
    },
  ]
  if (hasAttorneyAdjustment && attorneyDelta > 0) {
    rows.push({ label: 'Attorney adjustment (+25%)', value: attorneyDelta, swatch: ATTY_SWATCH })
  }
  rows.push({ label: 'Estimated total', value: adjustedSettlement, total: true })

  const weeklyLine = `Weekly benefit = min(${formatCurrency(aww)} × ${(stateBenefitRate * 100).toFixed(1)}%, ${formatCurrency(stateWeeklyCap)} cap) = ${formatCurrency(weeklyBenefit)}`
  let typeLines: string[] = []
  if (benefitType === 'ttd') {
    typeLines = [`TTD = ${formatCurrency(weeklyBenefit)} × ${weeksCovered ?? 0} weeks = ${formatCurrency(baseSettlement)}`]
  } else if (benefitType === 'ppd') {
    const bodyPart = getBodyPartByKey(inputs.bodyPartKey)
    const pct = inputs.impairmentPercent
    typeLines = ppdMethod === 'percentage_of_person'
      ? [`PPD = ${formatCurrency(weeklyBenefit)} × 500 whole-body weeks × ${pct}% = ${formatCurrency(baseSettlement)}`]
      : [`PPD = ${bodyPart?.scheduledWeeks ?? ''} scheduled weeks × ${pct}% × ${formatCurrency(weeklyBenefit)} = ${formatCurrency(baseSettlement)}`]
  } else {
    const years = weeksCovered ? weeksCovered / 52 : 0
    typeLines = [`PTD = ${formatCurrency(weeklyBenefit)} × 52 × ${years} years remaining × 0.85 present-value factor = ${formatCurrency(baseSettlement)}`]
  }
  const formulaLines = [
    weeklyLine,
    ...typeLines,
    ...(hasAttorneyAdjustment ? [`With attorney = ${formatCurrency(baseSettlement)} × 1.25 = ${formatCurrency(adjustedSettlement)}`] : []),
  ]

  const copyText = [
    `Settlebrook workers comp estimate — ${BENEFIT_LABELS[benefitType] ?? benefitType.toUpperCase()}`,
    `Estimated settlement: ${formatCurrency(adjustedSettlement)}`,
    `Weekly benefit: ${formatCurrency(weeklyBenefit)}/wk${isCapped ? ' (capped at state maximum)' : ''}`,
    `Benefit rate: ${(stateBenefitRate * 100).toFixed(1)}% of AWW`,
    weeksCovered !== undefined ? `Weeks covered: ${weeksCovered % 1 === 0 ? weeksCovered.toLocaleString() : weeksCovered.toFixed(1)}` : null,
    hasAttorneyAdjustment ? 'Includes +25% attorney adjustment' : null,
    '',
    'Estimate only — not legal advice. Pain and suffering is not included in workers comp.',
    typeof window !== 'undefined' ? window.location.href : 'https://www.settlebrook.com/workers-comp-settlement-calculator/',
  ].filter((l) => l !== null).join('\n')

  return (
    <ResultFrame
      tool="workers-comp"
      title="Estimated workers comp settlement"
      methodLabel={BENEFIT_LABELS[benefitType] ?? benefitType.toUpperCase()}
      amount={adjustedSettlement}
      amountLabel="Estimated settlement"
      amountNote={hasAttorneyAdjustment ? 'Includes +25% attorney adjustment' : undefined}
      range={null}
      bar={hasAttorneyAdjustment ? [
        { pct: basePct, color: BASE_SWATCH, label: 'Base settlement' },
        { pct: attorneyPct, color: ATTY_SWATCH, label: 'Attorney adjustment' },
      ] : undefined}
      rows={rows}
      formula={<Formula lines={formulaLines} />}
      copyText={copyText}
      stateSlug={inputs.stateSlug || undefined}
      extra={
        <>
          <dl className="card-flat grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm" style={{ padding: '12px 14px', background: 'var(--paper-2)' }}>
            <div>
              <dt className="result-range-label">Weekly benefit</dt>
              <dd className="font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>
                {formatCurrency(weeklyBenefit)}/wk
                {isCapped && <span className="text-xs font-normal ml-1" style={{ color: 'var(--ink-3)' }}>(capped)</span>}
              </dd>
            </div>
            <div>
              <dt className="result-range-label">Benefit rate</dt>
              <dd className="font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>{(stateBenefitRate * 100).toFixed(1)}% of AWW</dd>
            </div>
            {weeksCovered !== undefined && (
              <div>
                <dt className="result-range-label">
                  {benefitType === 'ttd' ? 'Weeks covered' : benefitType === 'ppd' ? 'Effective weeks' : 'Life expectancy'}
                </dt>
                <dd className="font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>
                  {weeksCovered % 1 === 0 ? weeksCovered.toLocaleString() : weeksCovered.toFixed(1)} wks
                </dd>
              </div>
            )}
          </dl>
          {benefitType === 'ppd' && ppdMethod && (
            <div><span className="state-badge state-badge-blue">{PPD_METHOD_LABELS[ppdMethod] ?? ppdMethod}</span></div>
          )}
          {isCapped && (
            <p className="note note-info">
              Your calculated weekly benefit has been{' '}
              <strong>capped at the state maximum of {formatCurrency(stateWeeklyCap)}/week</strong>.
              Workers comp weekly benefits cannot exceed the state-set cap regardless of actual earnings.
            </p>
          )}
        </>
      }
      disclaimer={
        <>
          <strong style={{ color: 'var(--amber)' }}>Estimate only — not legal advice. </strong>
          Actual workers comp settlements depend on state-specific adjudication, medical
          evidence quality, impairment rating disputes, employer cooperation, and benefit
          rate changes. Consult a licensed workers compensation attorney for advice on your claim.
        </>
      }
    >
      {warnings.map((warning, i) => (
        <p key={i} className="note note-caution" role="alert" aria-label="Workers comp notice">{warning}</p>
      ))}

      <p className="note note-info">
        <strong>Pain &amp; suffering not included. </strong>
        Workers comp settlements do not include pain and suffering in most states — the
        workers comp system is a no-fault trade-off that limits recovery to wage replacement
        and medical benefits. If a third party (not your employer) caused your injury, you
        may have a separate personal injury claim that <em>does</em> include pain &amp; suffering.
        Use the{' '}
        <Link href="/pain-and-suffering-calculator/" className="text-link">Pain &amp; Suffering Calculator</Link>{' '}
        to estimate that portion separately.
      </p>
    </ResultFrame>
  )
}
