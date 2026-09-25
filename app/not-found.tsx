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
    <main className="page-band flex flex-col items-center justify-center text-center px-4" style={{ minHeight: '70vh' }}>
      <div className="max-w-xl mx-auto py-20 flex flex-col items-center gap-5">
        <span className="trust-pill">404</span>

        <h1>Page Not Found</h1>

        <p className="lede">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Try one of
          our free calculators below, or head back to the homepage.
        </p>

        <Link href="/" className="btn-primary btn-lg">
          Back to Homepage →
        </Link>

        <ul className="mt-4 flex flex-col gap-1">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link href={tool.href} className="text-link inline-block py-2 text-sm">
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
