'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ads/AdsenseScript.tsx
// Loads the AdSense auto-ads script only on real content pages. Google's
// AdSense policy prohibits ads on error/empty pages, and Auto Ads scans the
// whole page for placement — so this must not load on the not-found page
// (app/not-found.tsx), whether reached via notFound() or an unmatched route.
// ─────────────────────────────────────────────────────────────────────────────

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { ALL_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES } from '@/lib/data/workersCompStates'

const STATIC_CONTENT_PATHS = new Set([
  '/',
  '/pain-and-suffering-calculator/',
  '/pain-and-suffering-calculator/guide/',
  '/car-accident-settlement-calculator/',
  '/workers-comp-settlement-calculator/',
  '/methodology/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-use/',
  '/blog/',
  '/blog/injury-claim-calculator/',
  '/blog/diminished-value-claim/',
  '/blog/ppd-settlement-calculator-guide/',
  '/blog/state-farm-pain-and-suffering-calculator/',
  // '/blog/settlement-exceeds-policy-limits/' intentionally omitted — that
  // post is published: false in lib/data/blogPosts.ts and its route calls
  // notFound(), so its pathname currently renders the not-found page. Add
  // it here in the same change that flips `published` to true, or this
  // page would load ads on what the browser sees as a 404.
])

const PAIN_SUFFERING_SLUGS = new Set(ALL_STATES.map((s) => s.slug))
const CAR_ACCIDENT_SLUGS = new Set(CAR_ACCIDENT_STATES.map((s) => s.slug))
const WORKERS_COMP_SLUGS = new Set(WORKERS_COMP_STATES.map((s) => s.slug))

function isRealContentPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (STATIC_CONTENT_PATHS.has(pathname)) return true

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length !== 2) return false
  const [tool, slug] = segments

  if (tool === 'pain-and-suffering-calculator') return PAIN_SUFFERING_SLUGS.has(slug)
  if (tool === 'car-accident-settlement-calculator') return CAR_ACCIDENT_SLUGS.has(slug)
  if (tool === 'workers-comp-settlement-calculator') return WORKERS_COMP_SLUGS.has(slug)
  return false
}

export default function AdsenseScript() {
  const pathname = usePathname()

  if (!isRealContentPath(pathname)) return null

  return (
    <Script
      id="adsense-init"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9642525412838279"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
