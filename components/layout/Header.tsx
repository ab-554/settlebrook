'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Header.tsx — sticky paper header
// Desktop: brand · three calculators · States (searchable) · Guides ·
// Benefits table. Mobile: brand + a real <button> menu (aria-expanded) that
// opens a panel with the same links and the inline state picker.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
        <div className="flex items-center justify-between" style={{ height: 'var(--header-h)' }}>

          <Link href="/" className="flex items-center flex-shrink-0 rounded-md" aria-label="Settlebrook home">
            <BrandWordmark size={28} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
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
            <span aria-hidden="true" className="mx-1 h-5 w-px" style={{ background: 'var(--line-strong)' }} />
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
            style={{ minWidth: 44, padding: '0 10px' }}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="text-sm font-semibold mr-1.5" aria-hidden="true">Menu</span>
            {open ? (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id={menuId}
        hidden={!open}
        className="lg:hidden"
        style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}
      >
        <nav aria-label="Mobile navigation" className="container-page py-3">
          <p className="eyebrow px-3 pt-1 pb-1">Calculators</p>
          <ul className="flex flex-col">
            {CALC_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-menu-item" aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </li>
            ))}
            {MORE_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-menu-item" aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
            <p className="eyebrow px-3 pb-2">Find your state</p>
            <div className="px-3 pb-2">
              <StatePickerList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
