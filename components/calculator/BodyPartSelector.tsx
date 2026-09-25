'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/BodyPartSelector.tsx
// Tool #3 — AMA scheduled body part dropdown.
// Groups options by category (Upper Extremity, Lower Extremity, Sensory,
// Non-Scheduled). Displays scheduled weeks as helper text in each option label.
// ─────────────────────────────────────────────────────────────────────────────

import { useId } from 'react'
import { BODY_PARTS } from '@/lib/data/bodyParts'

interface BodyPartSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
}

// Derive unique categories in the order they first appear in BODY_PARTS
const CATEGORIES = Array.from(new Set(BODY_PARTS.map((bp) => bp.category)))

export default function BodyPartSelector({
  value,
  onChange,
  label = 'Injured body part',
  error,
}: BodyPartSelectorProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="mb-4">
      <label htmlFor={id} className="field-label">{label}</label>
      <span className="field-help">Select the primary injured body part for PPD calculation</span>

      <div className="field-select-wrap">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`field-select ${error ? 'error' : ''}`}
          style={{ color: value ? 'var(--ink)' : 'var(--ink-3)' }}
        >
          <option value="" disabled>— Select body part —</option>
          {CATEGORIES.map((category) => (
            <optgroup key={category} label={category}>
              {BODY_PARTS.filter((bp) => bp.category === category).map((bp) => (
                <option key={bp.key} value={bp.key}>
                  {/* Show scheduled weeks so users understand the AMA table value */}
                  {bp.label} — {bp.scheduledWeeks} weeks
                  {!bp.isScheduled ? ' (whole body)' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className="field-select-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {error && (
        <p id={errorId} role="alert" className="field-error">{error}</p>
      )}
    </div>
  )
}
