'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/MultiplierSelector.tsx
// Severity selector — gradient active state, dark glass unselected
// ─────────────────────────────────────────────────────────────────────────────

import { SEVERITY_CONFIGS, SEVERITY_LEVELS_ORDERED, formatMultiplier } from '@/lib/calculations/painSuffering'
import type { SeverityLevel } from '@/lib/calculations/types'

interface MultiplierSelectorProps {
  selected: SeverityLevel
  onSelect: (level: SeverityLevel) => void
}

// Maps each severity to a color for the badge and glow
const SEVERITY_META: Record<SeverityLevel, { dot: string; badge: string; badgeText: string }> = {
  minor:        { dot: '#34D399', badge: 'rgba(52,211,153,0.12)',  badgeText: '#34D399' },
  moderate:     { dot: '#60A5FA', badge: 'rgba(96,165,250,0.12)',  badgeText: '#60A5FA' },
  serious:      { dot: '#FBBF24', badge: 'rgba(251,191,36,0.12)',  badgeText: '#FBBF24' },
  severe:       { dot: '#FB923C', badge: 'rgba(251,146,60,0.12)',  badgeText: '#FB923C' },
  catastrophic: { dot: '#F87171', badge: 'rgba(248,113,113,0.12)', badgeText: '#F87171' },
}

export default function MultiplierSelector({ selected, onSelect }: MultiplierSelectorProps) {
  const selectedConfig = SEVERITY_CONFIGS[selected]
  const meta = SEVERITY_META[selected]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>Injury Severity</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: meta.badge, color: meta.badgeText }}
        >
          {formatMultiplier(selectedConfig.multiplier)} multiplier
        </span>
      </div>

      <div role="radiogroup" aria-label="Injury severity level" className="grid grid-cols-5 gap-1.5">
        {SEVERITY_LEVELS_ORDERED.map((level) => {
          const config  = SEVERITY_CONFIGS[level]
          const levelMeta = SEVERITY_META[level]
          const isSelected = level === selected

          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(level)}
              className="relative flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={
                isSelected
                  ? {
                      background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                      border: '2px solid rgba(96,165,250,0.5)',
                      boxShadow: '0 0 16px rgba(96,165,250,0.25)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.06)',
                      border: '2px solid rgba(99,179,237,0.15)',
                    }
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: isSelected ? '#fff' : levelMeta.dot }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold leading-none"
                style={{ color: isSelected ? '#fff' : '#94A3B8' }}
              >
                {config.label}
              </span>
              <span
                className="text-xs leading-none"
                style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748B' }}
              >
                {formatMultiplier(config.multiplier)}
              </span>
            </button>
          )
        })}
      </div>

      <p
        className="text-xs leading-relaxed rounded-xl px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,179,237,0.12)',
          color: '#94A3B8',
        }}
      >
        <span className="font-semibold" style={{ color: '#E2E8F0' }}>{selectedConfig.label}: </span>
        {selectedConfig.description}
      </p>
    </div>
  )
}
