// ─────────────────────────────────────────────────────────────────────────────
// components/ui/TrustLine.tsx
// The calm trust stamp under every calculator and article H1:
//   Last reviewed {date} · Settlebrook Editorial · Editorial policy
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'

interface TrustLineProps {
  /** "September 2026" — the page's LAST_REVIEWED constant */
  reviewed?: string
  /** For blog posts: the publish date text instead of a review stamp */
  published?: string
  className?: string
}

export default function TrustLine({ reviewed, published, className = '' }: TrustLineProps) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${className}`} style={{ color: 'var(--ink-3)' }}>
      {reviewed && (
        <span className="inline-flex items-center gap-1.5">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--accent)' }}>
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" />
          </svg>
          Last reviewed {reviewed}
        </span>
      )}
      {published && <span>{published}</span>}
      <span aria-hidden="true">·</span>
      <span>Settlebrook Editorial</span>
      <span aria-hidden="true">·</span>
      <Link href="/editorial-policy/" className="text-link">Editorial policy</Link>
    </p>
  )
}
