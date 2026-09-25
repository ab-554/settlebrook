'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/FaultSlider.tsx
// "Your share of fault" — slider + synced number input, plus the comparative /
// contributory negligence notes. Shared by Tools #1 and #2. The notes' legal
// wording is unchanged from the previous inline implementation.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface FaultSliderProps {
  value: string
  faultPct: number
  onChange: (value: string) => void
  isContributory: boolean
  stateName?: string
  /** "the other party" (Tool #1) or "the other driver" (Tool #2) */
  otherParty?: string
}

export default function FaultSlider({ value, faultPct, onChange, isContributory, stateName, otherParty = 'the other party' }: FaultSliderProps) {
  const sliderId = useId()
  const numberId = useId()

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <label htmlFor={sliderId} className="field-label mb-0">Your share of fault</label>
        <output htmlFor={sliderId} className="text-sm font-semibold tabular-nums" style={{ color: 'var(--ink)' }} aria-live="polite">
          {faultPct}%
        </output>
      </div>
      <p className="field-help">Enter 0 if {otherParty} was fully at fault.</p>

      <div className="flex items-center gap-3">
        <input
          id={sliderId}
          type="range"
          min={0}
          max={99}
          step={1}
          value={faultPct}
          onChange={(e) => onChange(e.target.value)}
          className="range-slider flex-1"
          style={{ ['--val' as string]: `${faultPct}%` } as React.CSSProperties}
          aria-label="Your share of fault percentage"
        />
        <div className="relative flex-shrink-0" style={{ width: 88 }}>
          <label htmlFor={numberId} className="sr-only">Your share of fault percentage</label>
          <input
            id={numberId}
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            step={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="field-input text-center has-suffix tabular-nums"
            style={{ paddingRight: 30, paddingLeft: 10 }}
          />
          <span aria-hidden="true" className="field-affix field-affix-suffix" style={{ right: 12 }}>%</span>
        </div>
      </div>

      {faultPct > 0 && !isContributory && (
        <p className="note note-caution mt-3" role="status">
          Your estimate is reduced by <strong>{faultPct}%</strong> based on your share of fault.
        </p>
      )}

      {faultPct > 0 && isContributory && (
        <p className="note note-danger mt-3" role="alert">
          <strong>Warning:</strong>{' '}
          In {stateName ?? 'this state'}, any fault on your part may{' '}
          <strong>bar recovery entirely</strong> under contributory negligence rules.
          Consult an attorney before assuming you can recover.
        </p>
      )}
    </div>
  )
}
