'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/ResultFrame.tsx
// Shared chrome for every calculator result:
//   • headline amount with count-up (respects prefers-reduced-motion)
//   • optional "if severity were rated one level lower / higher" range
//     (multiplier method only — the adjacent severity levels from
//     lib/severityRange.ts; per diem and workers comp show no range); the
//     fill animates in once on first render
//   • breakdown rows + proportional bar
//   • "How this was calculated" <details> linking to /methodology/
//   • Copy / Print actions (GA4: result_copy, result_print)
// NextSteps (2–3 contextual cards, GA4: next_step_click) is exported separately
// so calculators can place it under the form while the estimate card stays
// sticky. Nothing here computes; it renders what the tool-specific result
// component hands it.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, ClipboardList, Copy, Printer, TriangleAlert } from 'lucide-react'
import { formatCurrency, formatMultiplier } from '@/lib/calculations/painSuffering'
import { trackEvent, type ToolId } from '@/lib/analytics'
import type { NextStepCard } from '@/lib/nextSteps'
import type { SeverityRange } from '@/lib/severityRange'
import BalancedGrid from '@/components/ui/BalancedGrid'
import { useCountUp } from './hooks'

export interface BreakdownRow {
  label: ReactNode
  value: number
  /** Shown as "−$x" in danger color */
  negative?: boolean
  /** Bold total row with a top rule */
  total?: boolean
  /** Swatch color for the proportional bar legend */
  swatch?: string
  /** Optional percentage label (e.g. "64%") */
  pct?: number
}

export interface BarSegment { pct: number; color: string; label: string }

export interface ResultFrameProps {
  tool: ToolId
  /** Card header, e.g. "Estimated total settlement" */
  title: string
  /** Right-hand header tag, e.g. "Multiplier method" */
  methodLabel: string
  amount: number
  amountLabel?: string
  /** Optional second line under the amount */
  amountNote?: ReactNode
  /** Adjacent-severity range (multiplier method only); null/undefined hides the bar */
  range?: SeverityRange | null
  bar?: BarSegment[]
  rows: BreakdownRow[]
  /** Lines shown inside "How this was calculated" */
  formula: ReactNode
  /** Rendered inside the card, under the breakdown (stats, badges, notes) */
  extra?: ReactNode
  /** Anything to render between the card and the disclaimer (warnings, alternate estimate) */
  children?: ReactNode
  /** Plain-text summary used by "Copy result" */
  copyText: string
  /** The inline legal disclaimer, verbatim per tool */
  disclaimer: ReactNode
  stateSlug?: string
}

export function EmptyResult({ children }: { children: ReactNode }) {
  return (
    <div className="result-empty" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="icon-tile" style={{ width: 44, height: 44, borderRadius: 12 }}>
          <ClipboardList aria-hidden="true" size={22} strokeWidth={2} />
        </span>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

/** The "one level lower / higher" range: bar + the two adjacent severity totals. */
function SeverityRangeBar({ range }: { range: SeverityRange }) {
  const { lower, higher, likely } = range
  if (!lower && !higher) return null
  // Marker: between the two adjacent totals when both exist; pinned to the
  // end of the scale when the current level is Minor or Catastrophic.
  const markerPct = lower && higher && higher.total > lower.total
    ? Math.max(0, Math.min(100, ((likely - lower.total) / (higher.total - lower.total)) * 100))
    : lower ? 100 : 0
  const describe = [
    lower ? `one level lower (${lower.label}, ${formatMultiplier(lower.multiplier)}): ${formatCurrency(lower.total)}` : null,
    higher ? `one level higher (${higher.label}, ${formatMultiplier(higher.multiplier)}): ${formatCurrency(higher.total)}` : null,
  ].filter(Boolean).join('; ')

  return (
    <div className="range-wrap" role="group" aria-label={`If severity were rated ${describe}`}>
      <p className="range-caption">If severity were rated one level lower / higher</p>
      <div className="range-bar" aria-hidden="true">
        <span className="range-bar-fill" />
        <span className="range-bar-marker" style={{ left: `${markerPct}%` }} />
      </div>
      <div className="range-sides" aria-hidden="true">
        <div className="range-side">
          {lower ? (
            <>
              <span className="range-side-label">One level lower</span>
              <span className="range-side-sub">{lower.label} · {formatMultiplier(lower.multiplier)}</span>
              <span className="range-side-value">{formatCurrency(lower.total)}</span>
            </>
          ) : (
            <span className="range-side-label is-muted">Lowest severity level</span>
          )}
        </div>
        <div className="range-side is-likely">
          <span className="range-side-label">Current rating</span>
          <span className="range-side-sub">Likely</span>
          <span className="range-side-value">{formatCurrency(likely)}</span>
        </div>
        <div className="range-side is-right">
          {higher ? (
            <>
              <span className="range-side-label">One level higher</span>
              <span className="range-side-sub">{higher.label} · {formatMultiplier(higher.multiplier)}</span>
              <span className="range-side-value">{formatCurrency(higher.total)}</span>
            </>
          ) : (
            <span className="range-side-label is-muted">Highest severity level</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResultFrame({
  tool, title, methodLabel, amount, amountLabel, amountNote, range, bar, rows, formula,
  extra, children, copyText, disclaimer, stateSlug,
}: ResultFrameProps) {
  const shown = useCountUp(amount)
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<number | null>(null)

  useEffect(() => () => { if (copiedTimer.current) window.clearTimeout(copiedTimer.current) }, [])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, permissions). The
      // print path still works.
    }
    trackEvent('result_copy', { tool, state: stateSlug })
  }

  function onPrint() {
    trackEvent('result_print', { tool, state: stateSlug })
    window.print()
  }

  return (
    <div className="flex flex-col gap-4 fade-in">
      <div className="result-card">
        <div className="result-head">
          <span>{title}</span>
          <span className="font-medium" style={{ color: 'var(--ink-3)' }}>{methodLabel}</span>
        </div>

        <div className="px-5 py-6 sm:px-6 flex flex-col gap-6">
          <div>
            <div className="result-range-label mb-2">{amountLabel ?? 'Likely estimate'}</div>
            <div className="result-amount" aria-label={`Estimated settlement: ${formatCurrency(amount)}`}>
              {formatCurrency(shown)}
            </div>
            {amountNote && <p className="mt-3" style={{ color: 'var(--ink-2)', fontSize: 'var(--small)' }}>{amountNote}</p>}

            {range && <SeverityRangeBar range={range} />}
          </div>

          <div>
            <div className="result-range-label">Breakdown</div>
            {bar && bar.length > 0 && (
              <div className="breakdown-bar" aria-hidden="true">
                {bar.map((seg) => (
                  <span key={seg.label} style={{ width: `${Math.max(0, Math.min(100, seg.pct))}%`, background: seg.color }} title={seg.label} />
                ))}
              </div>
            )}
            <div>
              {rows.map((row, i) => (
                <div key={i} className={`breakdown-row ${row.total ? 'is-total' : ''} ${row.negative ? 'is-negative' : ''}`}>
                  <span className="label">
                    {row.swatch && <span className="swatch" style={{ background: row.swatch }} aria-hidden="true" />}
                    {row.label}
                    {row.pct !== undefined && (
                      <span className="ml-2 text-xs tabular-nums" style={{ color: 'var(--ink-3)' }}>{Math.round(row.pct)}%</span>
                    )}
                  </span>
                  <span className="value">{row.negative ? '−' : ''}{formatCurrency(row.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {extra}

          <details className="calc-details">
            <summary>
              How this was calculated
              <ChevronDown aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--ink-3)' }} />
            </summary>
            <div className="calc-details-body">
              {formula}
              <p className="mt-2">
                Every formula, source, and review date is disclosed on our{' '}
                <Link href="/methodology/" className="text-link">methodology page</Link>.
              </p>
            </div>
          </details>

          <div className="flex flex-wrap gap-2.5 no-print">
            <button type="button" onClick={onCopy} className="btn-secondary btn-sm" aria-live="polite">
              <Copy aria-hidden="true" size={16} strokeWidth={2.2} />
              {copied ? 'Copied' : 'Copy result'}
            </button>
            <button type="button" onClick={onPrint} className="btn-secondary btn-sm">
              <Printer aria-hidden="true" size={16} strokeWidth={2.2} />
              Print
            </button>
          </div>
        </div>
      </div>

      {children}

      <div className="note note-caution flex gap-3 items-start">
        <TriangleAlert aria-hidden="true" size={18} strokeWidth={2.2} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--amber)' }} />
        <p className="leading-snug" style={{ color: 'var(--ink-2)', fontSize: 'var(--small)' }}>{disclaimer}</p>
      </div>
    </div>
  )
}

/** Contextual next-step cards — large, three across. Always rendered under the calculator. */
export function NextSteps({ cards, tool, stateSlug }: { cards: NextStepCard[]; tool: ToolId; stateSlug?: string }) {
  if (cards.length === 0) return null
  return (
    <nav aria-label="Next steps" className="no-print">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="heading-display" style={{ fontSize: 'var(--h3)' }}>Next steps</h2>
        <span style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>Continue with what matters most for your claim</span>
      </div>
      {/* Balanced grid: 3 cards → 3 across from 1024px, 1 featured + 2 on tablets; 2 cards → 2 across */}
      <BalancedGrid count={cards.length} maxCols={3} gap={16}>
        {cards.map((card) => (
          <NextStepLink key={card.id} card={card} tool={tool} stateSlug={stateSlug} />
        ))}
      </BalancedGrid>
    </nav>
  )
}

function NextStepLink({ card, tool, stateSlug }: { card: NextStepCard; tool: ToolId; stateSlug?: string }) {
  const onClick = () => trackEvent('next_step_click', { tool, card_id: card.id, state: stateSlug })
  const body = (
    <>
      <span className="next-step-kicker">{card.kicker}</span>
      <span className="next-step-title">{card.title}</span>
      <span className="next-step-desc">{card.desc}</span>
      <span className="next-step-cta">
        Continue
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
      </span>
    </>
  )
  if (card.href.startsWith('#')) {
    return <a href={card.href} className="next-step card-hover" onClick={onClick}>{body}</a>
  }
  return <Link href={card.href} className="next-step card-hover" onClick={onClick}>{body}</Link>
}

/** Monospace formula line block used inside "How this was calculated". */
export function Formula({ lines }: { lines: string[] }) {
  return <code className="formula">{lines.join('\n')}</code>
}
