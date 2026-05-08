'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/MethodToggle.tsx  —  Tab toggle, dark glass
// ─────────────────────────────────────────────────────────────────────────────

export type CalculationMethod = 'multiplier' | 'per-diem'

interface MethodToggleProps {
  active: CalculationMethod
  onChange: (method: CalculationMethod) => void
}

const METHODS: Array<{ id: CalculationMethod; label: string; description: string }> = [
  { id: 'multiplier', label: 'Multiplier Method',  description: 'Most common — used by insurance adjusters' },
  { id: 'per-diem',  label: 'Per Diem Method',     description: 'Daily rate × recovery days' },
]

export default function MethodToggle({ active, onChange }: MethodToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Calculation method"
      className="grid grid-cols-2 gap-1 rounded-2xl p-1.5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(99,179,237,0.15)',
      }}
    >
      {METHODS.map((method) => {
        const isActive = method.id === active
        return (
          <button
            key={method.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(method.id)}
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            style={
              isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(6,182,212,0.18))',
                    border: '1px solid rgba(96,165,250,0.35)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                  }
            }
          >
            <span
              className="text-sm font-semibold leading-tight"
              style={{ color: isActive ? '#F1F5F9' : '#94A3B8' }}
            >
              {method.label}
            </span>
            <span
              className="text-xs leading-tight"
              style={{ color: isActive ? '#94A3B8' : '#64748B' }}
            >
              {method.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
