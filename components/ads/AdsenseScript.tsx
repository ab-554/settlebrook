'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ads/AdsenseScript.tsx
// Loads the AdSense auto-ads script only on real content pages. Google's
// AdSense policy prohibits ads on error/empty pages, and Auto Ads scans the
// whole page for placement — so this must not load on the not-found page
// (app/not-found.tsx), whether reached via notFound() or an unmatched route.
//
// 2026-09-24 (Sprint A4): the allowed-path set is no longer hand-maintained
// here. It comes from lib/data/sitePaths.ts's getIndexablePaths() — the same
// function app/sitemap.ts uses to build sitemap.xml — so a page in the
// sitemap always gets this script, and a page that isn't (the 404 page,
// noindexed workers-comp stub states, an unpublished blog post) never does.
// Previously this file kept its own separate list, which silently missed
// /editorial-policy/ and the benefits-table page after they shipped.
// ─────────────────────────────────────────────────────────────────────────────

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { getIndexablePaths } from '@/lib/data/sitePaths'

const INDEXABLE_PATHS = new Set(getIndexablePaths())

export default function AdsenseScript() {
  const pathname = usePathname()

  if (!pathname || !INDEXABLE_PATHS.has(pathname)) return null

  return (
    <Script
      id="adsense-init"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9642525412838279"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
