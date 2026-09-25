'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/ImpairmentSlider.tsx
// Tool #3 — Physician impairment rating input (0–100%): range slider with a
// synced number input and the physician note below.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface ImpairmentSliderProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export default function ImpairmentSlider({ value, onChange, error }: ImpairmentSliderProps) {
  const sliderId = useId()
  const inputId = useId()
  const errorId = useId()

  const clamped = Math.max(0, Math.min(100, value))

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') { onChange(0); return }
    const n = parseInt(raw, 10)
    if (!isNaN(n)) onChange(Math.max(0, Math.min(100, n)))
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <label htmlFor={sliderId} className="field-label mb-0">Impairment rating</label>
        <output htmlFor={sliderId} className="text-sm font-semibold tabular-nums" style={{ color: 'var(--ink)' }} aria-live="polite">
          {clamped}% impairment
        </output>
      </div>
      <p className="field-help">
        Enter the impairment rating assigned by your treating physician or independent
        medical examiner (IME). This figure appears in your medical evaluation report.
      </p>

      <div className="flex items-center gap-3">
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          aria-label="Impairment rating percentage"
          className="range-slider flex-1"
          style={{ ['--val' as string]: `${clamped}%` } as React.CSSProperties}
        />
        <div className="relative flex-shrink-0" style={{ width: 88 }}>
          <label htmlFor={inputId} className="sr-only">Impairment rating percentage</label>
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={1}
            value={clamped === 0 ? '' : clamped}
            onChange={handleNumberInput}
            placeholder="0"
            className={`field-input text-center has-suffix tabular-nums ${error ? 'error' : ''}`}
            style={{ paddingRight: 30, paddingLeft: 10 }}
          />
          <span aria-hidden="true" className="field-affix field-affix-suffix" style={{ right: 12 }}>%</span>
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="field-error">{error}</p>
      )}
    </div>
  )
}
