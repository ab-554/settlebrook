'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/hooks.ts
// Small hooks shared by the three calculators:
//   useDebouncedValue  — the live estimate recomputes ~250ms after typing stops
//   useCountUp         — animates a number toward its target with rAF; jumps
//                        straight to the target when prefers-reduced-motion is set
//   useReducedMotion   — the media query behind the above
// No external libraries.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

/**
 * Eases the displayed number from its previous value to `target`.
 * Duration is short (450ms) so the figure feels alive without ever feeling
 * slow; ease-out cubic so it lands softly on the real number.
 */
export function useCountUp(target: number, durationMs = 450): number {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced || durationMs <= 0) {
      fromRef.current = target
      setDisplay(target)
      return
    }
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = from + (target - from) * eased
      setDisplay(value)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
        setDisplay(target)
      }
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // Remember where we were interrupted so the next animation starts there.
      fromRef.current = display
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, reduced])

  return display
}
