// ─────────────────────────────────────────────────────────────────────────────
// components/seo/BreadcrumbNav.tsx
// FIX M6: Added id={item.href} to Link element so schema.org BreadcrumbList
//         itemProp="item" has the required URL identifier. Without this, Google's
//         Rich Results validator rejects the microdata because ListItem.item
//         needs an @id (URL). The Link wraps a meta tag with the position.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'

interface BreadcrumbItem { label: string; href: string }
interface BreadcrumbNavProps { items: BreadcrumbItem[] }

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="flex items-center flex-wrap gap-1 text-xs" style={{ color: 'var(--ink-3)' }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={item.href}
              className="flex items-center gap-1"
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                // Last item: current page — no link, just the name
                <span
                  className="font-medium"
                  style={{ color: 'var(--ink-2)' }}
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                // FIX M6: id prop added to satisfy schema.org ListItem.item @id requirement
                <Link
                  href={item.href}
                  id={`https://www.settlebrook.com${item.href}`}
                  className="py-1"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <span aria-hidden="true" className="select-none" style={{ color: 'var(--line-strong)' }}>
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadcrumbNav
