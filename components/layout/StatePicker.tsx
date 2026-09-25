'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/StatePicker.tsx
// Searchable picker for the state pages we actually publish. One row per
// state, with a chip per tool that has a page for it. Used in the desktop
// header (as a popover) and inside the mobile menu (inline).
// Pure client state — no fetches. The list is built at module load from the
// same data modules the sitemap uses, so a new state appears here automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ALL_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'

interface StateRow {
  slug: string
  name: string
  abbreviation: string
  tools: { id: 'ps' | 'car' | 'wc'; label: string; href: string }[]
}

function buildRows(): StateRow[] {
  const map = new Map<string, StateRow>()
  const ensure = (slug: string, name: string, abbreviation: string) => {
    let row = map.get(slug)
    if (!row) {
      row = { slug, name, abbreviation, tools: [] }
      map.set(slug, row)
    }
    return row
  }
  for (const s of ALL_STATES) {
    ensure(s.slug, s.name, s.abbreviation).tools.push({
      id: 'ps',
      label: 'Pain & suffering',
      href: `/pain-and-suffering-calculator/${s.slug}/`,
    })
  }
  for (const s of CAR_ACCIDENT_STATES) {
    ensure(s.slug, s.name, s.abbreviation).tools.push({
      id: 'car',
      label: 'Car accident',
      href: `/car-accident-settlement-calculator/${s.slug}/`,
    })
  }
  for (const s of WORKERS_COMP_STATES) {
    if (NOINDEXED_WORKERS_COMP_SLUGS.has(s.slug)) continue
    ensure(s.slug, s.name, s.abbreviation).tools.push({
      id: 'wc',
      label: 'Workers comp',
      href: `/workers-comp-settlement-calculator/${s.slug}/`,
    })
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

const ROWS = buildRows()

interface StatePickerProps {
  /** 'popover' renders a trigger button + floating panel; 'inline' renders the list directly. */
  variant?: 'popover' | 'inline'
  onNavigate?: () => void
}

export function StatePickerList({ onNavigate, autoFocus = false }: { onNavigate?: () => void; autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ROWS
    return ROWS.filter((r) => r.name.toLowerCase().includes(q) || r.abbreviation.toLowerCase() === q)
  }, [query])

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">Search states</label>
      <div className="relative mb-2">
        <svg
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          style={{ color: 'var(--ink-3)' }}
        >
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your state, e.g. Texas"
          className="field-input"
          style={{ paddingLeft: 36, minHeight: 44, fontSize: 15 }}
          aria-controls={`${inputId}-list`}
        />
      </div>
      <p className="text-xs mb-2" style={{ color: 'var(--ink-3)' }}>
        {ROWS.length} states have dedicated pages. The general calculators work for every state.
      </p>
      <ul id={`${inputId}-list`} className="max-h-80 overflow-y-auto rounded-lg" style={{ border: '1px solid var(--line)' }} aria-live="polite">
        {filtered.length === 0 && (
          <li className="px-3 py-4 text-sm" style={{ color: 'var(--ink-3)' }}>
            No dedicated page for that state yet. Use a general calculator from the menu — the formulas apply nationwide.
          </li>
        )}
        {filtered.map((row) => (
          <li key={row.slug} className="picker-row">
            <span className="picker-state">
              <span className="text-xs font-semibold mr-2" style={{ color: 'var(--ink-3)' }}>{row.abbreviation}</span>
              {row.name}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {row.tools.map((t) => (
                <Link key={t.id} href={t.href} className="picker-link" onClick={onNavigate}>
                  {t.label}
                </Link>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function StatePicker({ variant = 'popover', onNavigate }: StatePickerProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (variant === 'inline') {
    return <StatePickerList onNavigate={onNavigate} />
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={`nav-link ${open ? 'is-active' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        States
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="ml-1">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Choose your state"
          className="picker-pop absolute right-0 mt-2 p-3"
          style={{ width: 'min(92vw, 460px)', zIndex: 50 }}
        >
          <StatePickerList autoFocus onNavigate={() => { setOpen(false); onNavigate?.() }} />
        </div>
      )}
    </div>
  )
}
