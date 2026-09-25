// ─────────────────────────────────────────────────────────────────────────────
// components/ui/BalancedGrid.tsx
// The one card-grid rule for the site: rows are always full, at every
// breakpoint, for any item count. Used by the homepage tool / state / guide
// cards, the blog index, the next-step cards under every calculator, and the
// state-guide cards on tool and state pages.
//
// How it balances (per breakpoint, `cap` = the most columns allowed there):
//   1. prefer a plain grid — the largest column count ≤ cap that divides n
//      (4 → 2×2, 6 → 3×2, 8 → 4×2 …)
//   2. otherwise "feature" the first item across the full row and lay the
//      rest out in the largest column count that divides n − 1
//      (5 → 1 + 4, 7 → 1 + 6, 3 on a two-column screen → 1 + 2)
//   n and n − 1 can't both be odd, so two columns always rescues an item
//   count the wider layouts can't split evenly — no grid ever ends on a
//   part-filled row.
//
// Breakpoints (match Tailwind's sm / lg / xl): < 640px one column; ≥ 640px
// up to 2; ≥ 1024px up to min(3, maxCols); ≥ 1280px up to maxCols. The
// CSS lives in globals.css (`.bgrid`, `.bgrid-c-*`, `.bgrid-f-*`). This is a
// plain component — no hooks, no server APIs — so client calculators can
// import it too.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'

export type BalancedGridMaxCols = 2 | 3 | 4

interface Tier { cols: number; featured: boolean }

/** Column count + whether the first item spans the row, for n items with at most `cap` columns. */
export function balanceRow(n: number, cap: number): Tier {
  if (n <= 1 || cap <= 1) return { cols: 1, featured: false }
  for (let c = cap; c >= 2; c--) if (n % c === 0) return { cols: c, featured: false }
  for (let c = cap; c >= 2; c--) if ((n - 1) % c === 0) return { cols: c, featured: true }
  return { cols: 1, featured: false } // unreachable for n ≥ 2 (see note above)
}

/** The class list for n items — exported so tests and stories can assert layouts. */
export function balancedGridClasses(n: number, maxCols: BalancedGridMaxCols = 3): string {
  const tiers: Array<[string, number]> = [
    ['sm', Math.min(2, maxCols)],
    ['lg', Math.min(3, maxCols)],
    ['xl', maxCols],
  ]
  const classes = ['bgrid']
  for (const [bp, cap] of tiers) {
    const { cols, featured } = balanceRow(n, cap)
    classes.push(`bgrid-c-${bp}-${cols}`)
    if (featured) classes.push(`bgrid-f-${bp}`)
  }
  return classes.join(' ')
}

interface BalancedGridProps {
  /** Number of direct children being rendered (drives the layout). */
  count: number
  /** Most columns allowed on wide screens (default 3). */
  maxCols?: BalancedGridMaxCols
  /** Gap in px (default 20). */
  gap?: number
  as?: 'div' | 'ul' | 'ol'
  className?: string
  children: ReactNode
  'aria-label'?: string
}

export default function BalancedGrid({
  count, maxCols = 3, gap = 20, as: Tag = 'div', className = '', children, ...rest
}: BalancedGridProps) {
  return (
    <Tag
      className={`${balancedGridClasses(count, maxCols)} ${className}`.trim()}
      style={{ ['--bgrid-gap' as string]: `${gap}px` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
