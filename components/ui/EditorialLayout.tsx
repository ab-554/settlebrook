// ─────────────────────────────────────────────────────────────────────────────
// components/ui/EditorialLayout.tsx
// Three-column editorial shell (design v2): sticky table of contents on the
// left, the prose (~760px) in the centre, and a sticky tools / next-steps rail
// on the right from 1200px. Below that: one column, with the TOC as a
// collapsible "On this page" at the top and the rail after the article.
// Server component — the TOC is the only client piece and it only reads H2s.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import TableOfContents from './TableOfContents'

interface EditorialLayoutProps {
  /** id given to the prose column; the TOC scans H2s inside it */
  rootId?: string
  /** Right rail content (cards). Omit for a centred two-column layout. */
  rail?: ReactNode
  /** Anchor of the calculator on tool pages — adds "Back to calculator" to the TOC */
  backHref?: string
  tocTitle?: string
  children: ReactNode
  className?: string
}

export default function EditorialLayout({
  rootId = 'editorial-root', rail, backHref, tocTitle, children, className = '',
}: EditorialLayoutProps) {
  return (
    <div className={`editorial-grid ${rail ? '' : 'no-rail'} ${className}`}>
      <aside className="editorial-toc no-print" aria-label="Table of contents">
        <TableOfContents rootId={rootId} variant="desktop" backHref={backHref} title={tocTitle} />
      </aside>

      <div id={rootId} className="editorial-main">
        <TableOfContents rootId={rootId} variant="mobile" title={tocTitle} />
        {children}
      </div>

      {rail && (
        <aside className="editorial-rail flex flex-col gap-4 no-print" aria-label="Related tools and next steps">
          {rail}
        </aside>
      )}
    </div>
  )
}

/** A plain card for the right rail. */
export function RailCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card-flat card-pad ${className}`}>{children}</div>
}
