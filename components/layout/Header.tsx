'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Header.tsx — sticky white header (design v2)
// Desktop: brand · three calculators · States (searchable) · Guides ·
// Benefits table. Mobile: brand + a real <button> menu (aria-expanded) that
// opens a panel with the same links and the inline state picker.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Menu, X } from 'lucide-react'
import { BrandWordmark } from '@/components/ui/Brand'
import StatePicker, { StatePickerList } from './StatePicker'

const CALC_NAV = [
  { label: 'Pain & Suffering', href: '/pain-and-suffering-calculator/' },
  { label: 'Car Accident',     href: '/car-accident-settlement-calculator/' },
  { label: 'Workers Comp',     href: '/workers-comp-settlement-calculator/' },
]

const MORE_NAV = [
  { label: 'Guides',         href: '/blog/' },
  { label: 'Benefits table', href: '/workers-comp-maximum-weekly-benefits-by-state/' },
]

export default function Header() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const menuId = useId()

  // Close the mobile menu on route change and on Escape.
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="site-header">
      <div className="container-page">
        <div className="flex items-center justify-between gap-4" style={{ height: 'var(--header-h)' }}>

          <Link href="/" className="flex items-center flex-shrink-0 rounded-md" aria-label="Settlebrook home">
            <BrandWordmark size={32} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {CALC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <span aria-hidden="true" className="mx-1.5 h-6 w-px" style={{ background: 'var(--line-strong)' }} />
            <StatePicker />
            {MORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden btn-ghost"
            style={{ minWidth: 48, minHeight: 48, padding: '0 12px' }}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="text-sm font-semibold mr-2" aria-hidden="true">Menu</span>
            {open ? (
              <X aria-hidden="true" size={22} strokeWidth={2.2} />
            ) : (
              <Menu aria-hidden="true" size={22} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id={menuId}
        hidden={!open}
        className="lg:hidden"
        style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}
      >
        <nav aria-label="Mobile navigation" className="container-page py-4">
          <p className="eyebrow px-3.5 pt-1 pb-1.5">Calculators</p>
          <ul className="flex flex-col">
            {CALC_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-menu-item" aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                  <ChevronRight aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--ink-3)' }} />
                </Link>
              </li>
            ))}
            {MORE_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-menu-item" aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                  <ChevronRight aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--ink-3)' }} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
            <p className="eyebrow px-3.5 pb-2">Find your state</p>
            <div className="px-3.5 pb-2">
              <StatePickerList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
