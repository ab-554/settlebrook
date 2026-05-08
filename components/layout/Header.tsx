'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Header.tsx  —  Glassmorphism sticky nav
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CALC_NAV = [
  { label: 'Pain & Suffering', href: '/pain-and-suffering-calculator/', short: 'Pain & Suffering' },
  { label: 'Car Accident',     href: '/car-accident-settlement-calculator/', short: 'Car Accident' },
  { label: 'Workers Comp',     href: '/workers-comp-settlement-calculator/', short: 'Workers Comp' },
]

const SITE_NAV = [
  { label: 'About',   href: '/about/',   short: 'About' },
  { label: 'Contact', href: '/contact/', short: 'Contact' },
]

const ALL_NAV_ITEMS = [...CALC_NAV, ...SITE_NAV]

export default function Header() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(5, 10, 24, 0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(99,179,237,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-15" style={{ height: '60px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="Settlebrook home">
            <svg
              className="w-5 h-5 flex-shrink-0"
              style={{ color: '#60A5FA' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ color: '#F1F5F9' }}
            >
              Settlebrook
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1">
            {CALC_NAV.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  style={
                    active
                      ? { background: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.30)' }
                      : { color: '#94A3B8', border: '1px solid transparent' }
                  }
                >
                  {item.short}
                </Link>
              )
            })}
            {/* Divider */}
            <span className="mx-1 h-4 w-px" style={{ backgroundColor: 'rgba(99,179,237,0.18)' }} aria-hidden="true" />
            {SITE_NAV.map((item) => {
              const active = pathname === item.href || pathname === item.href.slice(0, -1)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  style={
                    active
                      ? { background: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.30)' }
                      : { color: '#94A3B8', border: '1px solid transparent' }
                  }
                >
                  {item.short}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <input type="checkbox" id="mobile-menu-toggle" className="peer sr-only" />
            <label
              htmlFor="mobile-menu-toggle"
              className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer rounded"
              aria-label="Toggle navigation"
            >
              <span className="w-5 h-0.5 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
              <span className="w-5 h-0.5 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
              <span className="w-5 h-0.5 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
            </label>
            <nav
              aria-label="Mobile navigation"
              className="absolute top-[60px] left-0 right-0 hidden peer-checked:block shadow-2xl z-50"
              style={{
                background: 'rgba(5,10,24,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(99,179,237,0.12)',
              }}
            >
              <ul className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
                {ALL_NAV_ITEMS.map((item, idx) => {
                  const active = isActive(item.href)
                  const isFirstSite = idx === CALC_NAV.length
                  return (
                    <li key={item.href}>
                      {isFirstSite && (
                        <div className="my-1 mx-4 h-px" style={{ backgroundColor: 'rgba(99,179,237,0.12)' }} aria-hidden="true" />
                      )}
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        style={
                          active
                            ? { background: 'rgba(96,165,250,0.15)', color: '#60A5FA' }
                            : { color: '#94A3B8' }
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </header>
  )
}
