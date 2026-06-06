'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/BodyPartSelector.tsx
// Tool #3 — AMA scheduled body part dropdown.
// Groups options by category (Upper Extremity, Lower Extremity, Sensory,
// Non-Scheduled). Displays scheduled weeks as helper text in each option label.
// Styling mirrors CalculatorInput.tsx dark-glass convention from AGENTS.md.
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
  label = 'Injured Body Part',
  error,
}: BodyPartSelectorProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: '#94A3B8' }}
      >
        {label}
        <span className="block text-xs mt-0.5" style={{ color: '#64748B' }}>
          Select the primary injured body part for PPD calculation
        </span>
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className="w-full px-4 py-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${error ? '#F87171' : 'rgba(99,179,237,0.22)'}`,
            color: value ? '#F1F5F9' : '#64748B',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled style={{ background: '#0D1526', color: '#64748B' }}>
            — Select body part —
          </option>

          {CATEGORIES.map((category) => (
            <optgroup
              key={category}
              label={category}
              style={{ background: '#0D1526', color: '#94A3B8', fontWeight: 600 }}
            >
              {BODY_PARTS.filter((bp) => bp.category === category).map((bp) => (
                <option
                  key={bp.key}
                  value={bp.key}
                  style={{ background: '#0D1526', color: '#E2E8F0' }}
                >
                  {/* Show scheduled weeks so users understand the AMA table value */}
                  {bp.label} — {bp.scheduledWeeks} weeks
                  {!bp.isScheduled ? ' (whole body)' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Custom chevron icon — matches dark-glass inputs */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#60A5FA' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
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
