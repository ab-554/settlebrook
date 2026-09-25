// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/Steps.tsx
// Step chrome shared by all three calculators: a numbered step header with a
// plain-language hint, and a segmented progress bar that fills as steps are
// completed. Presentation only.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import { Check, Lock } from 'lucide-react'

export type StepState = 'done' | 'active' | 'todo'

export function StepHeader({
  n,
  title,
  hint,
  state = 'active',
  optional = false,
  children,
}: {
  n: number
  title: ReactNode
  hint?: ReactNode
  state?: StepState
  optional?: boolean
  children?: ReactNode
}) {
  return (
    <legend className="w-full">
      <span className="calc-step-title">
        <span className={`calc-step-badge ${state === 'done' ? 'is-done' : state === 'todo' ? 'is-todo' : ''}`} aria-hidden="true">
          {state === 'done' ? <Check size={16} strokeWidth={3} /> : n}
        </span>
        <span className="sr-only">Step {n}{state === 'done' ? ', complete' : ''}: </span>
        <span>{title}</span>
        {optional && <span className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>Optional</span>}
        {children}
      </span>
      {hint && <span className="calc-step-hint block">{hint}</span>}
    </legend>
  )
}

export function Progress({ total, done, label = 'Progress' }: { total: number; done: number; label?: string }) {
  const segs = Array.from({ length: total }, (_, i) => i < done)
  return (
    <div
      className="calc-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-valuetext={`${done} of ${total} steps complete`}
    >
      {segs.map((isDone, i) => (
        <span key={i} className={`calc-progress-seg ${isDone ? 'is-done' : ''}`} />
      ))}
    </div>
  )
}

export function PrivacyNote({ className = '' }: { className?: string }) {
  return (
    <span className={`calc-privacy ${className}`}>
      <Lock aria-hidden="true" size={14} strokeWidth={2.2} />
      Your inputs stay in your browser
    </span>
  )
}
