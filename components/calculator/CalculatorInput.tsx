'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/CalculatorInput.tsx
// Shared numeric field. The parent keeps the raw numeric string ("12000.5");
// this component shows it with thousands separators, accepts only digits and
// one decimal point, and picks the right mobile keyboard. Inline error text is
// announced via role="alert". Reused by all three tools unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'

interface CalculatorInputProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  helpText?: string
  prefix?: string
  suffix?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  min?: number
  max?: number
  /** 'currency' formats with thousands separators (default); 'integer' allows whole numbers only. */
  format?: 'currency' | 'decimal' | 'integer'
  autoComplete?: string
  className?: string
}

function formatDisplay(raw: string, format: 'currency' | 'decimal' | 'integer'): string {
  if (raw === '') return ''
  if (format === 'integer') return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const [int, dec] = raw.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec !== undefined ? `${grouped}.${dec}` : grouped
}

export default function CalculatorInput({
  label, name, value, onChange, onBlur, helpText, prefix, suffix,
  placeholder = '0', error, disabled = false, min = 0, max,
  format = 'currency', autoComplete = 'off', className = '',
}: CalculatorInputProps) {
  const id = useId()
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  const describedBy = [error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, '')
    if (raw === '') { onChange(''); return }
    if (format === 'integer') {
      if (/^\d*$/.test(raw)) onChange(raw)
      return
    }
    if (/^\d*\.?\d*$/.test(raw)) onChange(raw)
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="field-label">{label}</label>
      {helpText && <span id={helpId} className="field-help">{helpText}</span>}

      <div className="relative">
        {prefix && (
          <span aria-hidden="true" className="field-affix field-affix-prefix">{prefix}</span>
        )}
        <input
          id={id}
          name={name}
          type="text"
          inputMode={format === 'integer' ? 'numeric' : 'decimal'}
          autoComplete={autoComplete}
          value={formatDisplay(value, format)}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`field-input ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''} ${error ? 'error' : ''}`}
        />
        {suffix && (
          <span aria-hidden="true" className="field-affix field-affix-suffix">{suffix}</span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="field-error">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5m0 3h.01" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
