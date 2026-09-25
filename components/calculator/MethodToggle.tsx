'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/MethodToggle.tsx — multiplier / per diem segmented control
// ─────────────────────────────────────────────────────────────────────────────

export type CalculationMethod = 'multiplier' | 'per-diem'

interface MethodToggleProps {
  active: CalculationMethod
  onChange: (method: CalculationMethod) => void
}

const METHODS: Array<{ id: CalculationMethod; label: string; description: string }> = [
  { id: 'multiplier', label: 'Multiplier method', description: 'Most common method' },
  { id: 'per-diem',   label: 'Per diem method',   description: 'Daily rate × recovery days' },
]

export default function MethodToggle({ active, onChange }: MethodToggleProps) {
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(active === 'multiplier' ? 'per-diem' : 'multiplier')
    }
  }
  return (
    <div role="radiogroup" aria-label="Calculation method" className="seg" style={{ gridTemplateColumns: '1fr 1fr' }} onKeyDown={onKeyDown}>
      {METHODS.map((method) => {
        const isActive = method.id === active
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(method.id)}
            className="seg-btn"
          >
            {method.label}
            <span className="seg-sub">{method.description}</span>
          </button>
        )
      })}
    </div>
  )
}
