'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ui/TableOfContents.tsx
// "On this page" navigation, built on the client from the H2s inside the
// editorial root (#rootId). The article itself stays server-rendered; this
// component only reads headings, gives any id-less H2 a stable slug id, and
// highlights the section currently in view (one rAF-throttled scroll
// listener). Two variants share the same scan:
//   desktop — the sticky left rail (≥1200px), with a "Back to calculator" link
//   mobile  — a collapsible <details> at the top of the article (<1200px)
// No external libraries beyond lucide icons.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { ArrowUp, ChevronDown, List } from 'lucide-react'

interface TocItem { id: string; text: string }

interface TableOfContentsProps {
  rootId: string
  variant?: 'desktop' | 'mobile'
  /** Anchor of the calculator (e.g. "#calculator") — renders the back link */
  backHref?: string
  backLabel?: string
  title?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'section'
}

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  const n = parseInt(raw, 10)
  return (Number.isFinite(n) ? n : 68) + 24
}

export default function TableOfContents({
  rootId, variant = 'desktop', backHref, backLabel = 'Back to calculator', title = 'On this page',
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root) return
    const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2'))
      .filter((h) => h.dataset.toc !== 'skip' && (h.textContent ?? '').trim().length > 0)
    const seen = new Set<string>()
    const list: TocItem[] = headings.map((h) => {
      if (!h.id) {
        let id = slugify(h.textContent ?? '')
        let n = 2
        while (seen.has(id) || document.getElementById(id)) id = `${slugify(h.textContent ?? '')}-${n++}`
        h.id = id
      }
      seen.add(h.id)
      return { id: h.id, text: (h.textContent ?? '').trim() }
    })
    setItems(list)
    if (list.length === 0) return

    let ticking = false
    const update = () => {
      ticking = false
      const offset = headerOffset()
      let current = list[0].id
      for (const h of headings) {
        if (h.getBoundingClientRect().top - offset <= 0) current = h.id
        else break
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [rootId])

  const list = (
    <ol className="toc-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`toc-link ${active === item.id ? 'is-active' : ''}`}
            aria-current={active === item.id ? 'location' : undefined}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  )

  if (variant === 'mobile') {
    return (
      <details className="toc-mobile no-print">
        <summary>
          <span className="inline-flex items-center gap-2">
            <List aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--primary)' }} />
            {title}
          </span>
          <ChevronDown aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--ink-3)' }} />
        </summary>
        {items.length > 0 ? list : (
          <p className="px-4 py-3" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>Loading sections…</p>
        )}
      </details>
    )
  }

  return (
    <nav aria-label={title} className="toc">
      {backHref && (
        <a href={backHref} className="toc-back">
          <ArrowUp aria-hidden="true" size={16} strokeWidth={2.4} />
          {backLabel}
        </a>
      )}
      <p className="toc-title">{title}</p>
      {list}
    </nav>
  )
}
