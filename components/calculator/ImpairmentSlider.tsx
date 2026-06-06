'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/ImpairmentSlider.tsx
// Tool #3 — Physician impairment rating input (0–100%).
// Mirrors the fault-slider pattern from CarAccidentCalculator.tsx:
//   • Range slider with blue filled-track (CSS custom property --val)
//   • Synced number input (allows keyboard entry with % suffix badge)
//   • Prominent current value display above the slider
//   • Physician note below the controls
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface ImpairmentSliderProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export default function ImpairmentSlider({ value, onChange, error }: ImpairmentSliderProps) {
  const sliderId = useId()
  const inputId  = useId()
  const errorId  = useId()

  const clamped = Math.max(0, Math.min(100, value))

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(Number(e.target.value))
    // Keep the CSS fill track in sync
    e.currentTarget.style.setProperty('--val', `${e.target.value}%`)
  }

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // Allow empty string while typing
    if (raw === '') { onChange(0); return }
    const n = parseInt(raw, 10)
    if (!isNaN(n)) onChange(Math.max(0, Math.min(100, n)))
  }

  return (
    <div className="mb-4">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={sliderId}
          className="text-sm font-medium"
          style={{ color: '#94A3B8' }}
        >
          Impairment Rating
        </label>
        {/* Prominent current-value badge */}
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color: '#60A5FA' }}
          aria-live="polite"
          aria-label={`${clamped}% impairment rating`}
        >
          {clamped}% impairment rating
        </span>
      </div>

      {/* Slider + number input row — identical layout to CarAccidentCalculator fault slider */}
      <div className="flex items-center gap-3">
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={clamped}
          onChange={handleSlider}
          onInput={(e) =>
            e.currentTarget.style.setProperty('--val', `${e.currentTarget.value}%`)
          }
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          aria-label="Impairment rating percentage"
          className="fault-slider flex-1"
          style={{
            appearance: 'none',
            height: '6px',
            borderRadius: '9999px',
            // Blue filled track from left to current value — matches fault slider
            background: `linear-gradient(to right, #3B82F6 var(--val, ${clamped}%), rgba(255,255,255,0.1) var(--val, ${clamped}%))`,
            cursor: 'pointer',
            ['--val' as string]: `${clamped}%`,
          } as React.CSSProperties}
        />

        {/* Synced numeric input */}
        <div className="relative flex-shrink-0 w-20">
          <input
            id={inputId}
            type="number"
            min={0}
            max={100}
            step={1}
            value={clamped === 0 ? '' : clamped}
            onChange={handleNumberInput}
            placeholder="0"
            className="w-full text-center font-bold text-sm rounded-lg py-2 pr-6 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${error ? '#F87171' : 'rgba(99,179,237,0.22)'}`,
              color: '#F1F5F9',
            }}
            aria-label="Impairment rating percentage"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none"
            style={{ color: '#60A5FA' }}
            aria-hidden="true"
          >
            %
          </span>
        </div>
      </div>

      {/* Physician note */}
      <p className="text-xs mt-2 leading-snug" style={{ color: '#64748B' }}>
        Enter the impairment rating assigned by your treating physician or independent
        medical examiner (IME). This figure appears in your medical evaluation report.
      </p>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium leading-snug mt-1.5"
          style={{ color: '#F87171' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
