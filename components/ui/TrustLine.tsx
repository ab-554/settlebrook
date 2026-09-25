// ─────────────────────────────────────────────────────────────────────────────
// components/ui/TrustLine.tsx
// The calm trust stamp under every calculator and article H1:
//   Last reviewed {date} · Settlebrook Editorial · {n} sources · Editorial policy
// Every item is a real, verifiable fact about the page — the source count is
// the length of the page's own SourcesSection list, never a marketing number.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { CalendarCheck, BookOpen, ShieldCheck } from 'lucide-react'

interface TrustLineProps {
  /** "September 2026" — the page's LAST_REVIEWED constant */
  reviewed?: string
  /** For blog posts: the publish date text instead of a review stamp */
  published?: string
  /** Number of cited sources on this page (rendered only when > 0) */
  sourcesCount?: number
  /** Anchor of the page's Sources section */
  sourcesHref?: string
  className?: string
}

function Dot() {
  return <span aria-hidden="true" style={{ color: 'var(--line-strong)' }}>·</span>
}

export default function TrustLine({ reviewed, published, sourcesCount, sourcesHref = '#sources', className = '' }: TrustLineProps) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${className}`}
      style={{ color: 'var(--ink-3)', fontSize: 'var(--small)', fontWeight: 500 }}
    >
      {reviewed && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarCheck aria-hidden="true" size={16} strokeWidth={2.2} style={{ color: 'var(--money-deep)' }} />
          Last reviewed {reviewed}
        </span>
      )}
      {published && <span>{published}</span>}
      <Dot />
      <span>Settlebrook Editorial</span>
      {typeof sourcesCount === 'number' && sourcesCount > 0 && (
        <>
          <Dot />
          <a href={sourcesHref} className="inline-flex items-center gap-1.5 text-link" style={{ textDecoration: 'none' }}>
            <BookOpen aria-hidden="true" size={16} strokeWidth={2.2} />
            {sourcesCount} {sourcesCount === 1 ? 'source' : 'sources'}
          </a>
        </>
      )}
      <Dot />
      <Link href="/editorial-policy/" className="inline-flex items-center gap-1.5 text-link" style={{ textDecoration: 'none' }}>
        <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.2} />
        Editorial policy
      </Link>
    </p>
  )
}
