'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/WorkersCompResult.tsx
// Tool #3 result card — mirrors CarAccidentResult.tsx structure.
// Key differences from Tools #1 and #2:
//   • No pain & suffering line — WC does not include it
//   • Shows: weekly benefit, benefit type, base settlement, attorney adjustment
//   • Renders the warnings[] array as amber advisory boxes
//   • Includes a third-party claim note when applicable
// All color values match the design system in AGENTS.md.
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from '@/lib/calculations/painSuffering'
import type { WorkersCompResult } from '@/lib/calculations/types'

interface WorkersCompResultProps {
  result: WorkersCompResult
}

// ─── Benefit type display labels ─────────────────────────────────────────────

const BENEFIT_LABELS: Record<string, string> = {
  ttd: 'Temporary Total Disability (TTD)',
  ppd: 'Permanent Partial Disability (PPD)',
  ptd: 'Permanent Total Disability (PTD)',
}

const PPD_METHOD_LABELS: Record<string, string> = {
  ama_schedule: 'AMA Scheduled Award',
  percentage_of_person: 'Percentage of Person',
}

// ─── Sub-component: breakdown row ────────────────────────────────────────────

function BreakdownRow({
  dotColor,
  label,
  value,
  highlight = false,
  isNegative = false,
}: {
  dotColor: string
  label: string
  value: number
  highlight?: boolean
  isNegative?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
        <span
          className="text-xs leading-snug truncate"
          style={{ color: highlight ? '#E2E8F0' : '#94A3B8', fontWeight: highlight ? 600 : 400 }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-sm tabular-nums font-semibold flex-shrink-0"
        style={{ color: isNegative ? '#F87171' : highlight ? '#60A5FA' : '#94A3B8' }}
      >
        {isNegative ? '' : ''}{formatCurrency(value)}
      </span>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkersCompResult({ result }: WorkersCompResultProps) {
  const {
    benefitType,
    weeklyBenefit,
    baseSettlement,
    adjustedSettlement,
    hasAttorneyAdjustment,
    weeksCovered,
    stateWeeklyCap,
    stateBenefitRate,
    ppdMethod,
    warnings,
  } = result

  // Attorney adjustment dollar amount (shown as a positive line item — it increases the total)
  const attorneyDelta = adjustedSettlement - baseSettlement

  // Bar chart percentages — base vs attorney uplift
  const total          = adjustedSettlement
  const basePct        = total > 0 ? (baseSettlement / total) * 100 : 100
  const attorneyPct    = total > 0 ? (attorneyDelta / total) * 100 : 0

  // Weekly benefit cap notice — shown when the raw AWW × rate exceeds the cap
  const isCapped = weeklyBenefit >= stateWeeklyCap

  return (
    <div className="flex flex-col gap-4" aria-live="polite" aria-label="Workers comp settlement estimate results">

      {/* ── Warning boxes (amber) ── */}
      {warnings.map((warning, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{ background: 'rgba(251,191,36,0.09)', border: '1px solid rgba(251,191,36,0.30)' }}
          role="alert"
          aria-label="Workers comp notice"
        >
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: '#FBBF24' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-xs leading-snug" style={{ color: '#A8843A' }}>
            {warning}
          </p>
        </div>
      ))}

      {/* ── Primary result card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,179,237,0.25)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 0 40px rgba(96,165,250,0.10)',
        }}
      >
        {/* Card header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.30) 0%, rgba(6,182,212,0.18) 100%)',
            borderBottom: '1px solid rgba(99,179,237,0.18)',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
            Estimated Workers Comp Settlement
          </span>
          <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>
            {BENEFIT_LABELS[benefitType] ?? benefitType.toUpperCase()}
          </span>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">

          {/* Hero amount */}
          <div className="text-center">
            <div
              className="result-amount"
              aria-label={`Estimated workers comp settlement: ${formatCurrency(adjustedSettlement)}`}
            >
              {formatCurrency(adjustedSettlement)}
            </div>
            {hasAttorneyAdjustment && (
              <p className="mt-1 text-xs" style={{ color: '#34D399' }}>
                Includes +25% attorney adjustment
              </p>
            )}
          </div>

          {/* Key stats row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,179,237,0.10)' }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                Weekly Benefit
              </span>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#FBBF24' }}>
                {formatCurrency(weeklyBenefit)}/wk
                {isCapped && (
                  <span className="text-xs font-normal ml-1" style={{ color: '#64748B' }}>(capped)</span>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                Benefit Rate
              </span>
              <span className="text-sm font-bold" style={{ color: '#60A5FA' }}>
                {(stateBenefitRate * 100).toFixed(1)}% of AWW
              </span>
            </div>
            {weeksCovered !== undefined && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                  {benefitType === 'ttd' ? 'Weeks Covered' : benefitType === 'ppd' ? 'Effective Weeks' : 'Life Expectancy'}
                </span>
                <span className="text-sm font-bold tabular-nums" style={{ color: '#E2E8F0' }}>
                  {weeksCovered % 1 === 0
                    ? weeksCovered.toLocaleString()
                    : weeksCovered.toFixed(1)}{' '}
                  wks
                </span>
              </div>
            )}
          </div>

          {/* PPD method badge */}
          {benefitType === 'ppd' && ppdMethod && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(96,165,250,0.12)',
                  border: '1px solid rgba(96,165,250,0.25)',
                  color: '#60A5FA',
                }}
              >
                {PPD_METHOD_LABELS[ppdMethod] ?? ppdMethod}
              </span>
            </div>
          )}

          {/* Breakdown bar + rows */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Breakdown
            </div>

            {total > 0 && (
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.07)' }}>
                {/* Base settlement segment */}
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${Math.round(basePct)}%`,
                    background: 'rgba(148,163,184,0.45)',
                  }}
                  aria-hidden="true"
                />
                {/* Attorney uplift segment */}
                {hasAttorneyAdjustment && (
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${Math.round(attorneyPct)}%`,
                      background: 'linear-gradient(90deg, #34D399, #06B6D4)',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <BreakdownRow
                dotColor="rgba(148,163,184,0.6)"
                label={
                  benefitType === 'ttd'
                    ? `Base TTD (${weeksCovered ?? 0} wks × ${formatCurrency(weeklyBenefit)}/wk)`
                    : benefitType === 'ppd'
                      ? `Base PPD (${ppdMethod ? PPD_METHOD_LABELS[ppdMethod] : ''} formula)`
                      : `Base PTD (lifetime benefit stream, discounted)`
                }
                value={baseSettlement}
                highlight
              />

              {/* Attorney adjustment line — only when applied */}
              {hasAttorneyAdjustment && attorneyDelta > 0 && (
                <BreakdownRow
                  dotColor="#34D399"
                  label="Attorney Adjustment (+25%)"
                  value={attorneyDelta}
                />
              )}

              {/* Total line */}
              {hasAttorneyAdjustment && (
                <div
                  className="flex items-center justify-between gap-2 mt-1 pt-2"
                  style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#E2E8F0' }}>Total Estimate</span>
                  <span className="text-sm tabular-nums font-bold" style={{ color: '#FBBF24' }}>
                    {formatCurrency(adjustedSettlement)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Weekly cap notice */}
          {isCapped && (
            <div
              className="rounded-xl px-4 py-3 text-xs leading-snug"
              style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)' }}
            >
              <p style={{ color: '#93C5FD' }}>
                Your calculated weekly benefit has been{' '}
                <strong>capped at the state maximum of {formatCurrency(stateWeeklyCap)}/week</strong>.
                Workers comp weekly benefits cannot exceed the state-set cap regardless of actual earnings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── No pain & suffering note ── */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{
          background: 'rgba(96,165,250,0.06)',
          border: '1px solid rgba(96,165,250,0.18)',
        }}
      >
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: '#60A5FA' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <p className="text-xs leading-snug" style={{ color: '#93C5FD' }}>
          <span className="font-semibold" style={{ color: '#60A5FA' }}>Pain &amp; suffering not included. </span>
          Workers comp settlements do not include pain and suffering in most states — the
          workers comp system is a no-fault trade-off that limits recovery to wage replacement
          and medical benefits. If a third party (not your employer) caused your injury, you
          may have a separate personal injury claim that <em>does</em> include pain &amp; suffering.
          Use the{' '}
          <a href="/pain-and-suffering-calculator/" style={{ color: '#60A5FA', textDecoration: 'underline' }}>
            Pain &amp; Suffering Calculator
          </a>{' '}
          to estimate that portion separately.
        </p>
      </div>

      {/* ── Inline legal disclaimer — matches CarAccidentResult.tsx pattern ── */}
      <div
        className="rounded-xl px-4 py-3 flex gap-3"
        style={{
          background: 'rgba(251,191,36,0.07)',
          border: '1px solid rgba(251,191,36,0.20)',
        }}
      >
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: '#FBBF24' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-xs leading-snug" style={{ color: '#92794A' }}>
          <span className="font-semibold" style={{ color: '#FBBF24' }}>Estimate only — not legal advice. </span>
          Actual workers comp settlements depend on state-specific adjudication, medical
          evidence quality, impairment rating disputes, employer cooperation, and benefit
          rate changes. Consult a licensed workers compensation attorney for advice on your claim.
        </p>
      </div>
    </div>
  )
}
