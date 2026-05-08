'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CalculatorInput.tsx
// Dark glass input — explicit color so text is always visible
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface CalculatorInputProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  helpText?: string
  prefix?: string
  suffix?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  min?: number
  max?: number
}

export default function CalculatorInput({
  label, name, value, onChange, helpText, prefix, suffix,
  placeholder = '0', error, disabled = false, min = 0, max,
}: CalculatorInputProps) {
  const id = useId()
  const errorId  = `${id}-error`
  const helpId   = `${id}-help`
  const describedBy = [error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="calc-label leading-tight">
        {label}
      </label>

      {helpText && (
        <p id={helpId} className="text-xs leading-snug" style={{ color: '#64748B' }}>
          {helpText}
        </p>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <span
            aria-hidden="true"
            className="absolute left-3 text-sm font-medium select-none pointer-events-none"
            style={{ color: error ? '#F87171' : '#64748B' }}
          >
            {prefix}
          </span>
        )}

        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`dark-input ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''} ${error ? 'error' : ''} disabled:opacity-40 disabled:cursor-not-allowed`}
          style={prefix ? { paddingLeft: '1.75rem' } : suffix ? { paddingRight: '3rem' } : {}}
        />

        {suffix && (
          <span
            aria-hidden="true"
            className="absolute right-3 text-xs select-none pointer-events-none"
            style={{ color: '#64748B' }}
          >
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium leading-snug" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
