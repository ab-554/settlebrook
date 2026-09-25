'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/PolicyLimitInput.tsx
// Tool #2 — optional advisory field: at-fault driver's insurance policy limit.
// This field never changes the calculation — it only triggers a warning in
// CarAccidentResult when the adjusted estimate exceeds the stated limit.
// ─────────────────────────────────────────────────────────────────────────────

import CalculatorInput from './CalculatorInput'

interface PolicyLimitInputProps {
  value: string
  onChange: (value: string) => void
  /** Optional error string — shown below the input in red when set. */
  error?: string
}

export default function PolicyLimitInput({ value, onChange, error }: PolicyLimitInputProps) {
  return (
    <CalculatorInput
      label="At-fault driver's policy limit"
      name="insurancePolicyLimit"
      value={value}
      onChange={onChange}
      prefix="$"
      placeholder="100,000"
      helpText="We'll warn you if your estimate exceeds this limit — it does not change the calculated total."
      error={error}
      className="mb-0"
    />
  )
}
