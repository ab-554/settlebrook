// ─────────────────────────────────────────────────────────────────────────────
// components/ui/StateList.tsx
// Every place the site lists a tool's state pages uses this: the homepage
// state-guide cards, the "by state" section on each tool hub and state page,
// the hub / state-page rails and the footer. It always shows EVERY published
// state for the tool — alphabetical, as a compact 2–3 column chip list with a
// count badge — so there is no "see all N states" truncation anywhere.
//
// The list comes straight from the tool's data module (the same arrays the
// sitemap uses), so adding a state to lib/data/*States.ts is the only step.
// Server component (no hooks); safe to render inside the sticky rails.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ALL_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'

export type StateListTool = 'pain-suffering' | 'car-accident' | 'workers-comp'

export interface StateListEntry { slug: string; name: string; abbreviation: string }

const TOOL_META: Record<StateListTool, { label: string; short: string; hub: string }> = {
  'pain-suffering': { label: 'Pain & Suffering Calculator', short: 'Pain & Suffering', hub: '/pain-and-suffering-calculator/' },
  'car-accident':   { label: 'Car Accident Settlement Calculator', short: 'Car Accident', hub: '/car-accident-settlement-calculator/' },
  'workers-comp':   { label: 'Workers Comp Settlement Calculator', short: 'Workers Comp', hub: '/workers-comp-settlement-calculator/' },
}

/** Every published (indexed) state page for a tool, alphabetical by name. */
export function getToolStates(tool: StateListTool): StateListEntry[] {
  const source: StateListEntry[] =
    tool === 'pain-suffering' ? ALL_STATES
    : tool === 'car-accident' ? CAR_ACCIDENT_STATES
    : WORKERS_COMP_STATES.filter((s) => !NOINDEXED_WORKERS_COMP_SLUGS.has(s.slug))
  return source
    .map(({ slug, name, abbreviation }) => ({ slug, name, abbreviation }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getToolMeta(tool: StateListTool) {
  return TOOL_META[tool]
}

export function stateHref(tool: StateListTool, slug: string): string {
  return `${TOOL_META[tool].hub}${slug}/`
}

/** "14 states" pill. */
export function StateCountBadge({ count, className = '' }: { count: number; className?: string }) {
  return (
    <span className={`count-badge ${className}`.trim()}>
      {count} {count === 1 ? 'state' : 'states'}
    </span>
  )
}

interface StateChipsProps {
  tool: StateListTool
  /** Slug of the page being viewed — marked aria-current and not linked. */
  currentSlug?: string
  /** Leave the current state out of the list entirely (rails). */
  excludeCurrent?: boolean
  /** 'chip' = pill per state (default); 'inline' = compact comma-free run of links (footer). */
  variant?: 'chip' | 'inline'
  ariaLabel?: string
}

/** The chip list on its own (no card, no heading). */
export function StateChips({ tool, currentSlug, excludeCurrent = false, variant = 'chip', ariaLabel }: StateChipsProps) {
  const states = getToolStates(tool).filter((s) => !(excludeCurrent && s.slug === currentSlug))
  const meta = TOOL_META[tool]
  const list = (
    <ul className={variant === 'inline' ? 'state-inline' : 'state-chips'} aria-label={ariaLabel ?? `${meta.label} state pages`}>
      {states.map((s) => {
        const isCurrent = s.slug === currentSlug
        return (
          <li key={s.slug}>
            {isCurrent ? (
              <span className={variant === 'inline' ? 'state-inline-link is-current' : 'state-chip is-current'} aria-current="page">
                {variant === 'chip' && <abbr className="state-chip-abbr" title={s.name}>{s.abbreviation}</abbr>}
                {s.name}
              </span>
            ) : (
              <Link href={stateHref(tool, s.slug)} className={variant === 'inline' ? 'state-inline-link' : 'state-chip'}>
                {variant === 'chip' && <abbr className="state-chip-abbr" title={s.name}>{s.abbreviation}</abbr>}
                {s.name}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
  // The wrapper is the container-query root for the chip grid (2 columns in
  // narrow cards and the rail, 3 in wide sections) — see .state-chips-wrap.
  return variant === 'inline' ? list : <div className="state-chips-wrap">{list}</div>
}

interface StateListProps extends Omit<StateChipsProps, 'variant' | 'ariaLabel'> {
  /** 'card' wraps the list in a .card-flat with heading + badge + hub link; 'plain' is heading + badge + list. */
  variant?: 'card' | 'plain'
  /** Heading text (defaults to the tool's short name). */
  title?: string
  /** Heading level — h2 in page sections, h3 inside the homepage section. */
  headingLevel?: 'h2' | 'h3'
  /** One line under the heading (plain variant). */
  intro?: string
  /** id for in-page anchors (e.g. "by-state"). */
  id?: string
  /** Show the "Open the calculator" link at the bottom of the card. */
  hubLink?: boolean
  className?: string
}

export default function StateList({
  tool, currentSlug, excludeCurrent = false, variant = 'card', title, headingLevel = 'h3', intro, id, hubLink = true, className = '',
}: StateListProps) {
  const meta = TOOL_META[tool]
  const states = getToolStates(tool)
  const count = states.length
  const Heading = headingLevel
  const headingId = id ? `${id}-heading` : undefined

  if (variant === 'plain') {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        className={`state-list-plain ${className}`.trim()}
        style={id ? { scrollMarginTop: 'calc(var(--header-h) + 12px)' } : undefined}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
          <Heading id={headingId} className="heading-display" style={{ fontSize: 26 }}>
            {title ?? `${meta.label} by State`}
          </Heading>
          <StateCountBadge count={count} />
        </div>
        {intro && <p className="mb-4" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>{intro}</p>}
        <StateChips tool={tool} currentSlug={currentSlug} excludeCurrent={excludeCurrent} />
      </section>
    )
  }

  return (
    <div id={id} className={`card-flat card-pad state-list-card ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <Heading id={headingId} className="font-body font-bold" style={{ fontSize: 18 }}>
          {title ?? meta.short}
        </Heading>
        <StateCountBadge count={excludeCurrent && currentSlug ? count - 1 : count} />
      </div>
      <StateChips tool={tool} currentSlug={currentSlug} excludeCurrent={excludeCurrent} />
      {hubLink && (
        <Link href={meta.hub} className="state-list-hub">
          Open the {meta.short.toLowerCase()} calculator
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
        </Link>
      )}
    </div>
  )
}
