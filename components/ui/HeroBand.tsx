// ─────────────────────────────────────────────────────────────────────────────
// components/ui/HeroBand.tsx
// The top band of every tool and state page (design v2):
//   breadcrumb → H1 → one-line promise → TrustLine → three key-fact chips →
//   "Start calculating" anchor to the calculator.
// Server component. The band background is one of the three permitted
// gradients (.hero-band). Facts are real data from lib/data/* — the page
// decides what to show; nothing here invents a figure.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import {
  ArrowDown, Scale, CalendarClock, Landmark, Wallet, Percent, MapPin, Calculator, Layers, Car, Clock,
} from 'lucide-react'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import TrustLine from '@/components/ui/TrustLine'

export type FactIcon = 'scale' | 'calendar' | 'cap' | 'wallet' | 'percent' | 'map' | 'calculator' | 'layers' | 'car' | 'clock'
export type FactTone = 'default' | 'amber' | 'danger' | 'money' | 'primary'

export interface HeroFact {
  label: string
  value: string
  icon?: FactIcon
  tone?: FactTone
  /** Optional in-page anchor (e.g. "#state-law") — makes the chip a link */
  href?: string
}

const ICONS: Record<FactIcon, typeof Scale> = {
  scale: Scale,
  calendar: CalendarClock,
  cap: Landmark,
  wallet: Wallet,
  percent: Percent,
  map: MapPin,
  calculator: Calculator,
  layers: Layers,
  car: Car,
  clock: Clock,
}

interface HeroBandProps {
  breadcrumb: { label: string; href: string }[]
  title: ReactNode
  promise: ReactNode
  reviewed?: string
  sourcesCount?: number
  facts?: HeroFact[]
  factsLabel?: string
  ctaHref?: string
  ctaLabel?: string
  /** Optional secondary link rendered next to the CTA */
  secondary?: ReactNode
  /** Anything else to render under the CTA row (badges, notes) */
  children?: ReactNode
}

export function FactChips({ facts, label = 'Key facts' }: { facts: HeroFact[]; label?: string }) {
  if (!facts.length) return null
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label={label}>
      {facts.map((fact) => {
        const Icon = fact.icon ? ICONS[fact.icon] : null
        const cls = `fact-chip ${fact.tone && fact.tone !== 'default' ? `is-${fact.tone}` : ''} ${fact.href ? 'chip-press' : ''}`
        const body = (
          <>
            <span className="fact-chip-label">
              {Icon && <Icon aria-hidden="true" size={15} strokeWidth={2.2} />}
              {fact.label}
            </span>
            <span className="fact-chip-value">{fact.value}</span>
          </>
        )
        return (
          <li key={fact.label} className="flex">
            {fact.href ? (
              <a href={fact.href} className={`${cls} w-full`}>{body}</a>
            ) : (
              <div className={`${cls} w-full`}>{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function HeroBand({
  breadcrumb, title, promise, reviewed, sourcesCount, facts = [], factsLabel,
  ctaHref = '#calculator', ctaLabel = 'Start calculating', secondary, children,
}: HeroBandProps) {
  return (
    <header className="hero-band">
      <div className="container-page pt-6 pb-9 sm:pt-8 sm:pb-12">
        <BreadcrumbNav items={breadcrumb} />
        <div className="mt-5 max-w-4xl">
          <h1>{title}</h1>
          <p className="lede mt-4 max-w-3xl">{promise}</p>
          <TrustLine reviewed={reviewed} sourcesCount={sourcesCount} className="mt-4" />
        </div>

        {facts.length > 0 && (
          <div className="mt-7 max-w-4xl">
            <FactChips facts={facts} label={factsLabel} />
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
          <a href={ctaHref} className="btn-primary btn-lg sm:min-w-[240px]">
            {ctaLabel}
            <ArrowDown aria-hidden="true" size={20} strokeWidth={2.4} />
          </a>
          {secondary}
        </div>

        {children}
      </div>
    </header>
  )
}
