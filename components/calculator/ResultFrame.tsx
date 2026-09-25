'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/ResultFrame.tsx
// Shared chrome for every calculator result:
//   • headline amount with count-up (respects prefers-reduced-motion)
//   • optional low / likely / high range bar (only when the math produces one)
//   • breakdown rows + proportional bar
//   • "How this was calculated" <details> linking to /methodology/
//   • Copy / Print actions (GA4: result_copy, result_print)
// NextSteps (2–3 contextual cards, GA4: next_step_click) is exported separately
// so calculators can place it under the form on desktop while the estimate
// card stays sticky. Nothing here computes; it renders what the tool-specific
// result component hands it.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/calculations/painSuffering'
import { trackEvent, type ToolId } from '@/lib/analytics'
import type { NextStepCard } from '@/lib/nextSteps'
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
  range?: { low: number; high: number; likely: number } | null
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
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>
          <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
        </svg>
        <div>{children}</div>
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

  const markerPct = range && range.high > range.low
    ? Math.max(0, Math.min(100, ((range.likely - range.low) / (range.high - range.low)) * 100))
    : 50

  return (
    <div className="flex flex-col gap-4">
      <div className="result-card">
        <div className="result-head">
          <span>{title}</span>
          <span className="font-medium" style={{ color: 'var(--ink-3)' }}>{methodLabel}</span>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          <div>
            <div className="result-range-label mb-1">{amountLabel ?? 'Likely estimate'}</div>
            <div className="result-amount" aria-label={`Estimated settlement: ${formatCurrency(amount)}`}>
              {formatCurrency(shown)}
            </div>
            {amountNote && <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>{amountNote}</p>}

            {range && (
              <div aria-label={`Range from ${formatCurrency(range.low)} to ${formatCurrency(range.high)}`}>
                <div className="range-bar" aria-hidden="true">
                  <span className="range-bar-marker" style={{ left: `${markerPct}%` }} />
                </div>
                <div className="range-bar-ticks">
                  <span><span className="result-range-label">Low </span>{formatCurrency(range.low)}</span>
                  <strong><span className="result-range-label">Likely </span>{formatCurrency(range.likely)}</strong>
                  <span><span className="result-range-label">High </span>{formatCurrency(range.high)}</span>
                </div>
              </div>
            )}
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
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="calc-details-body">
              {formula}
              <p className="mt-2">
                Every formula, source, and review date is disclosed on our{' '}
                <Link href="/methodology/" className="text-link">methodology page</Link>.
              </p>
            </div>
          </details>

          <div className="flex flex-wrap gap-2 no-print">
            <button type="button" onClick={onCopy} className="btn-secondary btn-sm" aria-live="polite">
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" /></svg>
              {copied ? 'Copied' : 'Copy result'}
            </button>
            <button type="button" onClick={onPrint} className="btn-secondary btn-sm">
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" strokeLinecap="round" /><rect x="6" y="14" width="12" height="7" /></svg>
              Print
            </button>
          </div>
        </div>
      </div>

      {children}

      <div className="note note-caution flex gap-2.5 items-start">
        <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--amber)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-sm leading-snug" style={{ color: 'var(--ink-2)' }}>{disclaimer}</p>
      </div>
    </div>
  )
}

/** Contextual next-step cards. Rendered by the calculator once a result exists. */
export function NextSteps({ cards, tool, stateSlug }: { cards: NextStepCard[]; tool: ToolId; stateSlug?: string }) {
  if (cards.length === 0) return null
  return (
    <nav aria-label="Next steps" className="no-print">
      <h3 className="heading-serif" style={{ fontSize: 19, marginBottom: 10 }}>Next steps</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => (
          <NextStepLink key={card.id} card={card} tool={tool} stateSlug={stateSlug} />
        ))}
      </div>
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
    </>
  )
  if (card.href.startsWith('#')) {
    return <a href={card.href} className="next-step" onClick={onClick}>{body}</a>
  }
  return <Link href={card.href} className="next-step" onClick={onClick}>{body}</Link>
}

/** Monospace formula line block used inside "How this was calculated". */
export function Formula({ lines }: { lines: string[] }) {
  return <code className="formula">{lines.join('\n')}</code>
}
