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
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>
        {label}
        {helpText && (
          <span id={helpId} className="block text-xs mt-0.5" style={{ color: '#64748B' }}>
            {helpText}
          </span>
        )}
      </label>

      <div className="relative flex items-center">
        {prefix && (
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium select-none pointer-events-none"
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
          className={`dark-input px-4 py-3 rounded-xl ${error ? 'error' : ''} disabled:opacity-40 disabled:cursor-not-allowed`}
          style={prefix ? { paddingLeft: '2.5rem' } : suffix ? { paddingRight: '3.5rem' } : {}}
        />

        {suffix && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none"
            style={{ color: '#64748B' }}
          >
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium leading-snug mt-1.5" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
