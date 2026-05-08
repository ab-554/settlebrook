// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx  —  Dark footer with link columns
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { getPriorityStates } from '@/lib/data/states'

export default function Footer() {
  const priorityStates = getPriorityStates()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: '#050A18',
        borderTop: '1px solid rgba(99,179,237,0.10)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-10">
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#60A5FA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span className="font-display font-bold text-lg tracking-tight" style={{ color: '#F1F5F9' }}>Settlebrook</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">

          {/* Pain & Suffering */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#60A5FA' }}>
              Pain &amp; Suffering
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/pain-and-suffering-calculator/" className="text-sm transition-colors" style={{ color: '#94A3B8' }}>
                  Calculator (All States)
                </Link>
              </li>
              {priorityStates.map((state) => (
                <li key={state.slug}>
                  <Link href={`/pain-and-suffering-calculator/${state.slug}/`} className="text-sm transition-colors" style={{ color: '#94A3B8' }}>
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Accident */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#60A5FA' }}>
              Car Accident
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/car-accident-settlement-calculator/" className="text-sm transition-colors" style={{ color: '#94A3B8' }}>
                  Calculator (All States)
                </Link>
              </li>
              {priorityStates.slice(0, 2).map((state) => (
                <li key={state.slug}>
                  <span className="text-sm" style={{ color: 'rgba(148,163,184,0.35)' }}>{state.name} (coming soon)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Workers Comp + Site */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#60A5FA' }}>
              Workers Comp
            </h3>
            <ul className="flex flex-col gap-2.5 mb-7">
              <li>
                <Link href="/workers-comp-settlement-calculator/" className="text-sm transition-colors" style={{ color: '#94A3B8' }}>
                  Calculator (All States)
                </Link>
              </li>
            </ul>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#60A5FA' }}>
              Site
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about/', label: 'About' },
                { href: '/contact/', label: 'Contact' },
                { href: '/privacy-policy/', label: 'Privacy Policy' },
                { href: '/terms-of-use/', label: 'Terms of Use' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors" style={{ color: '#94A3B8' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-8 mb-6" style={{ borderTop: '1px solid rgba(99,179,237,0.08)' }}>
          <p className="text-xs leading-relaxed max-w-3xl" style={{ color: 'rgba(148,163,184,0.6)' }}>
            <span className="font-semibold" style={{ color: '#94A3B8' }}>Disclaimer: </span>
            The calculators and information on Settlebrook are for informational purposes only and
            do not constitute legal advice. Results are estimates based on common formulas — actual
            settlement values depend on the specific facts of your case, applicable state law,
            insurance coverage, and other factors. No attorney-client relationship is created by
            using this site. Always consult a licensed personal injury attorney in your state.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs" style={{ color: 'rgba(148,163,184,0.45)' }}>
          <p>© {currentYear} Settlebrook. All rights reserved.</p>
          <p>
            This site may display advertisements.{' '}
            <Link href="/privacy-policy/" className="underline transition-colors" style={{ color: 'rgba(148,163,184,0.45)' }}>
              Privacy Policy
            </Link>
          </p>
        </div>

      </div>
    </footer>
  )
}
