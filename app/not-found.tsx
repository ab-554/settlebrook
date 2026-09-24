// app/not-found.tsx
// Renders for notFound() calls (e.g. an unknown state slug) and for
// unmatched routes. No AdSense script loads here — see
// components/ads/AdsenseScript.tsx, which checks the current path against
// the site's known real-content routes and skips itself on this page.

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

const TOOLS = [
  { href: '/pain-and-suffering-calculator/', label: 'Pain & Suffering Calculator' },
  { href: '/car-accident-settlement-calculator/', label: 'Car Accident Settlement Calculator' },
  { href: '/workers-comp-settlement-calculator/', label: 'Workers Comp Settlement Calculator' },
]

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{
        minHeight: '70vh',
        background: 'radial-gradient(ellipse at top, #1E3A5F 0%, #050A18 70%)',
      }}
    >
      <div className="max-w-xl mx-auto py-20 flex flex-col items-center gap-6">
        <span className="trust-pill">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#34D399' }} />
          404
        </span>

        <h1
          className="heading-gradient"
          style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Page Not Found
        </h1>

        <p className="text-base leading-relaxed" style={{ color: '#94A3B8' }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Try one of
          our free calculators below, or head back to the homepage.
        </p>

        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
          Back to Homepage →
        </Link>

        <div className="mt-6 flex flex-col gap-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="text-sm underline transition-colors"
              style={{ color: '#60A5FA' }}
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
