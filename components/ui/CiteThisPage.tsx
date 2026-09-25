'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ui/CiteThisPage.tsx
// Compact "Cite this page" block at the end of every calculator hub, state
// page, blog post and the benefits table: page title · Settlebrook Editorial ·
// canonical URL · "Last reviewed <date>", with a one-click copy of the plain
// citation. Facts only — the title, the page's own review stamp and the
// canonical URL; no names, no new claims. Client component only for the
// clipboard button; everything else is static text. Visually quiet
// (.cite-block in globals.css).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { Copy, Quote } from 'lucide-react'

const SITE = 'https://www.settlebrook.com'

interface CiteThisPageProps {
  /** Page title as it should appear in a citation (no " | Settlebrook" suffix). */
  title: string
  /** Relative canonical path with trailing slash, e.g. "/pain-and-suffering-calculator/ohio/". */
  path: string
  /** The page's review stamp, e.g. "September 2026" or "September 24, 2026". */
  reviewed: string
  className?: string
}

export function buildCitation({ title, path, reviewed }: Pick<CiteThisPageProps, 'title' | 'path' | 'reviewed'>): string {
  return `"${title}." Settlebrook Editorial, ${SITE}${path}. Last reviewed ${reviewed}.`
}

export default function CiteThisPage({ title, path, reviewed, className = '' }: CiteThisPageProps) {
  const url = `${SITE}${path}`
  const citation = buildCitation({ title, path, reviewed })
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(citation)
      setCopied(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, permissions); the
      // citation text is still on screen to select by hand.
    }
  }

  return (
    <aside className={`cite-block no-print ${className}`.trim()} aria-labelledby="cite-heading">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p id="cite-heading" className="eyebrow inline-flex items-center gap-1.5 mb-1.5" style={{ fontSize: 'var(--caption)' }}>
            <Quote aria-hidden="true" size={14} strokeWidth={2.2} />
            Cite this page
          </p>
          <p className="cite-title">{title}</p>
          <p className="cite-meta">Settlebrook Editorial · Last reviewed {reviewed}</p>
          <p><a href={url} className="cite-url">{url}</a></p>
        </div>
        <button type="button" onClick={onCopy} className="btn-secondary btn-sm flex-shrink-0" aria-live="polite">
          <Copy aria-hidden="true" size={15} strokeWidth={2.2} />
          {copied ? 'Copied' : 'Copy citation'}
        </button>
      </div>
    </aside>
  )
}
