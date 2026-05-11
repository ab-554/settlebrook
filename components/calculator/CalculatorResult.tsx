'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CalculatorResult.tsx
// Result card — gold amounts, blue/cyan bar, dark glass
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatMultiplier } from '@/lib/calculations/painSuffering'
import { getStateBySlug } from '@/lib/data/states'
import type {
  PainSufferingCalculationResult,
  MultiplierResult,
  PerDiemResult,
} from '@/lib/calculations/types'

interface CalculatorResultProps {
  result: PainSufferingCalculationResult
  activeMethod: 'multiplier' | 'per-diem'
}

export default function CalculatorResult({ result, activeMethod }: CalculatorResultProps) {
  const { multiplierResult, perDiemResult, specialDamages, stateSlug } = result

  const primaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? multiplierResult : perDiemResult
  const secondaryResult: MultiplierResult | PerDiemResult | null =
    activeMethod === 'multiplier' ? perDiemResult : multiplierResult

  if (!primaryResult) return null

  const isMultiplier      = primaryResult.method === 'multiplier'
  const painAndSuffering  = primaryResult.painAndSuffering

  // For multiplier method use adjustedTotal (post-fault) as the hero number;
  // for per-diem we keep totalEstimate as-is (no fault reduction implemented there).
  const mResult       = isMultiplier ? (primaryResult as MultiplierResult) : null
  const faultPct      = mResult?.plaintiffFaultPercent ?? 0
  const faultReduction = mResult?.faultReduction ?? 0
  const totalEstimate = isMultiplier
    ? (mResult!.adjustedTotal)
    : primaryResult.totalEstimate

  const rangeLow  = mResult?.rangeLow  ?? null
  const rangeHigh = mResult?.rangeHigh ?? null

  const stateData = stateSlug ? getStateBySlug(stateSlug) : null

  const showDamageCapWarning = stateData?.hasDamageCap && stateData.damageCap !== null && totalEstimate > stateData.damageCap
  const showContributoryWarning = stateData?.faultRule === 'contributory' && faultPct > 0
  const showModifiedComparativeWarning = 
    (stateData?.faultRule === 'modified-comparative-50' && faultPct >= 50) ||
    (stateData?.faultRule === 'modified-comparative-51' && faultPct > 50)
  const showNoFaultNotice = stateData?.isNoFaultState === true
  const showFloridaNotice = stateData?.slug === 'florida'

  return (
    <div className="flex flex-col gap-4" aria-live="polite" aria-label="Settlement estimate results">

      {/* Primary result */}
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
        {/* Header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.30) 0%, rgba(6,182,212,0.18) 100%)',
            borderBottom: '1px solid rgba(99,179,237,0.18)',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Estimated Total Settlement</span>
          <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>
            {activeMethod === 'multiplier' ? 'Multiplier Method' : 'Per Diem Method'}
          </span>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Amount */}
          <div className="text-center">
            <div
              className="result-amount"
              aria-label={`Estimated settlement: ${formatCurrency(totalEstimate)}`}
            >
              {formatCurrency(totalEstimate)}
            </div>

            {isMultiplier && rangeLow !== null && rangeHigh !== null && (
              <div className="mt-2 flex items-center justify-center gap-4 text-sm" style={{ color: '#94A3B8' }}>
                <span>
                  <span className="result-range-label mr-1">LOW</span>
                  {formatCurrency(rangeLow)}
                </span>
                <span style={{ color: 'rgba(99,179,237,0.3)' }}>—</span>
                <span className="font-semibold" style={{ color: '#E2E8F0' }}>
                  <span className="result-range-label mr-1" style={{ color: '#60A5FA' }}>MID</span>
                  {formatCurrency(totalEstimate)}
                </span>
                <span style={{ color: 'rgba(99,179,237,0.3)' }}>—</span>
                <span>
                  <span className="result-range-label mr-1">HIGH</span>
                  {formatCurrency(rangeHigh)}
                </span>
              </div>
            )}

            {!isMultiplier && perDiemResult && (
              <p className="mt-2 text-sm" style={{ color: '#94A3B8' }}>
                {formatCurrency(perDiemResult.dailyRateUsed)}/day × {perDiemResult.recoveryDaysUsed.toLocaleString()} days
              </p>
            )}
          </div>

          {/* Breakdown bar */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Breakdown</div>

            {totalEstimate > 0 && (
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${Math.round((specialDamages / totalEstimate) * 100)}%`,
                    background: 'rgba(148,163,184,0.45)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${Math.round((painAndSuffering / totalEstimate) * 100)}%`,
                    background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                  }}
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <BreakdownRow
                dotColor="rgba(148,163,184,0.6)"
                label="Economic Damages (medical, wages, etc.)"
                value={specialDamages}
                percentage={totalEstimate > 0 ? (specialDamages / totalEstimate) * 100 : 0}
              />
              <BreakdownRow
                dotColor="#3B82F6"
                label={
                  isMultiplier && multiplierResult
                    ? `Pain & Suffering (${formatMultiplier(multiplierResult.multiplierUsed)} multiplier)`
                    : 'Pain & Suffering (per diem)'
                }
                value={painAndSuffering}
                percentage={totalEstimate > 0 ? (painAndSuffering / totalEstimate) * 100 : 0}
                highlight
              />

              {/* Fault reduction line — only shown when plaintiff has some fault */}
              {isMultiplier && faultPct > 0 && faultReduction > 0 && (
                <div className="flex items-center justify-between gap-2 mt-1 pt-2" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#F87171' }}
                      aria-hidden="true"
                    />
                    <span className="text-xs leading-snug" style={{ color: '#F87171' }}>
                      Fault Reduction ({faultPct}%)
                    </span>
                  </div>
                  <span className="text-sm tabular-nums font-semibold flex-shrink-0" style={{ color: '#F87171' }}>
                    -{formatCurrency(faultReduction)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State-specific warnings */}
      {stateData && (
        <div className="flex flex-col gap-3">
          {showDamageCapWarning && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#FCD34D' }}>{stateData.name} Damage Cap Notice:</p>
              <p className="text-xs leading-relaxed" style={{ color: '#FCD34D' }}>{stateData.name} limits pain & suffering damages to {formatCurrency(stateData.damageCap!)}. Your estimate exceeds this limit. Actual recovery may be reduced. {stateData.damageCapNotes}</p>
            </div>
          )}

          {showContributoryWarning && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#FCA5A5' }}>⚠️ Critical:</p>
              <p className="text-xs leading-relaxed" style={{ color: '#FCA5A5' }}>North Carolina follows pure contributory negligence. Any fault on your part — even 1% — completely bars recovery. Your estimate above assumes zero fault on your part.</p>
            </div>
          )}

          {showModifiedComparativeWarning && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#FCA5A5' }}>⚠️ Recovery Barred:</p>
              <p className="text-xs leading-relaxed" style={{ color: '#FCA5A5' }}>In {stateData.name}, being {faultPct}% at fault exceeds the {stateData.faultRule === 'modified-comparative-50' ? '50' : '51'}% threshold. You would not be able to recover damages under {stateData.name} law.</p>
            </div>
          )}

          {showNoFaultNotice && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#93C5FD' }}><strong>{stateData.name} is a no-fault state.</strong> You must first file with your own insurance under PIP coverage. You can only sue for pain & suffering if your injuries exceed your state&apos;s serious injury threshold.</p>
            </div>
          )}

          {showFloridaNotice && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#93C5FD' }}><strong>Florida Note:</strong> Since 2023 (HB837), Florida limits evidence of medical bills to amounts actually paid by insurance — not billed amounts. Insurance adjusters may calculate your economic damages lower than your total medical bills.</p>
            </div>
          )}
        </div>
      )}

      {/* Secondary comparison */}
      {secondaryResult && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(99,179,237,0.12)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(99,179,237,0.08)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              {secondaryResult.method === 'multiplier' ? 'Multiplier Method' : 'Per Diem Method'} Comparison
            </span>
            <span className="text-xs" style={{ color: '#475569' }}>alternate estimate</span>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm" style={{ color: '#94A3B8' }}>Total estimate</span>
              {secondaryResult.method === 'per-diem' && perDiemResult && (
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {formatCurrency(perDiemResult.dailyRateUsed)}/day × {perDiemResult.recoveryDaysUsed.toLocaleString()} days
                </span>
              )}
              {secondaryResult.method === 'multiplier' && multiplierResult && (
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {formatMultiplier(multiplierResult.multiplierUsed)} multiplier
                </span>
              )}
            </div>
            <span className="text-2xl font-bold tabular-nums" style={{ color: '#FBBF24' }}>
              {formatCurrency(secondaryResult.totalEstimate)}
            </span>
          </div>
        </div>
      )}

      {/* Inline disclaimer */}
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
          <span className="font-semibold" style={{ color: '#FBBF24' }}>Estimate only — not legal advice.</span>{' '}
          Actual settlements depend on liability, insurance limits, evidence, and negotiation.
          Consult a licensed personal injury attorney for advice on your case.
        </p>
      </div>
    </div>
  )
}

function BreakdownRow({
  dotColor, label, value, percentage, highlight = false,
}: {
  dotColor: string; label: string; value: number; percentage: number; highlight?: boolean
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
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs tabular-nums" style={{ color: '#64748B' }}>{Math.round(percentage)}%</span>
        <span
          className="text-sm tabular-nums font-semibold"
          style={{ color: highlight ? '#60A5FA' : '#94A3B8' }}
        >
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  )
}
