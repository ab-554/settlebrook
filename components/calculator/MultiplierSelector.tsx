'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/MultiplierSelector.tsx
// Injury severity → multiplier. A five-option radio group with arrow-key
// navigation; the selected level's plain-language description sits below it.
// Multiplier values come from SEVERITY_CONFIGS (protected math module).
// ─────────────────────────────────────────────────────────────────────────────

import { SEVERITY_CONFIGS, SEVERITY_LEVELS_ORDERED, formatMultiplier } from '@/lib/calculations/painSuffering'
import type { SeverityLevel } from '@/lib/calculations/types'

interface MultiplierSelectorProps {
  selected: SeverityLevel
  onSelect: (level: SeverityLevel) => void
}

export default function MultiplierSelector({ selected, onSelect }: MultiplierSelectorProps) {
  const selectedConfig = SEVERITY_CONFIGS[selected]

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = SEVERITY_LEVELS_ORDERED.indexOf(selected)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      onSelect(SEVERITY_LEVELS_ORDERED[(idx + 1) % SEVERITY_LEVELS_ORDERED.length])
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      onSelect(SEVERITY_LEVELS_ORDERED[(idx - 1 + SEVERITY_LEVELS_ORDERED.length) % SEVERITY_LEVELS_ORDERED.length])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="field-label mb-0">Injury severity</span>
        <span className="state-badge state-badge-green tabular-nums">
          {formatMultiplier(selectedConfig.multiplier)} multiplier
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Injury severity level"
        className="seg seg-severity"
        onKeyDown={onKeyDown}
      >
        {SEVERITY_LEVELS_ORDERED.map((level) => {
          const config = SEVERITY_CONFIGS[level]
          const isSelected = level === selected
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(level)}
              className="seg-btn"
              style={{ padding: '8px 4px', fontSize: 13 }}
            >
              {config.label}
              <span className="seg-sub tabular-nums">{formatMultiplier(config.multiplier)}</span>
            </button>
          )
        })}
      </div>

      <p className="note" aria-live="polite">
        <strong>{selectedConfig.label}: </strong>
        {selectedConfig.description}
      </p>
    </div>
  )
}
