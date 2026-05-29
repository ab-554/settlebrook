'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/PolicyLimitInput.tsx
// Tool #2 — optional advisory field: at-fault driver's insurance policy limit.
// This field never changes the calculation — it only triggers a warning in
// CarAccidentResult when the adjusted estimate exceeds the stated limit.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface PolicyLimitInputProps {
  value: string
  onChange: (value: string) => void
  /** Optional error string — shown below the input in red when set. */
  error?: string
}

export default function PolicyLimitInput({ value, onChange, error }: PolicyLimitInputProps) {
  const id = useId()
  const errorId = `${id}-error`
  const helpId  = `${id}-help`
  const describedBy = [error ? errorId : null, helpId].filter(Boolean).join(' ')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // Accept only non-negative numeric input (same guard as CalculatorInput)
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw)
  }

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: '#94A3B8' }}
      >
        At-Fault Driver&apos;s Policy Limit
        <span className="ml-2 text-xs font-normal" style={{ color: '#60A5FA' }}>
          (optional — advisory only)
        </span>
      </label>

      {/* Help text explaining the advisory-only nature of this field */}
      <span
        id={helpId}
        className="block text-xs mb-2"
        style={{ color: '#64748B' }}
      >
        We&apos;ll warn you if your estimate exceeds this limit — it does not
        change the calculated total.
      </span>

      <div className="relative flex items-center">
        {/* Dollar prefix — matches CalculatorInput prefix styling */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium select-none pointer-events-none"
          style={{ color: error ? '#F87171' : '#64748B' }}
        >
          $
        </span>

        <input
          id={id}
          name="insurancePolicyLimit"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder="100000"
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`dark-input px-4 py-3 rounded-xl ${error ? 'error' : ''}`}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

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
