// ─────────────────────────────────────────────────────────────────────────────
// lib/data/sitePaths.ts
// Single source of truth for every indexable page path on the site.
// getIndexablePaths() is consumed by BOTH app/sitemap.ts (to build the
// sitemap) and components/ads/AdsenseScript.tsx (to decide where the
// AdSense script loads) — so a page that's in the sitemap always gets the
// script, and a page that isn't (the 404 page, noindexed workers-comp
// stub states, an unpublished blog post) never does. Nothing else should
// hand-maintain a separate list of "real content" paths.
// ─────────────────────────────────────────────────────────────────────────────

import { ALL_STATES } from './states'
import { CAR_ACCIDENT_STATES } from './carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from './workersCompStates'
import { getPublishedBlogPosts } from './blogPosts'

// Truly static pages — not generated from a state or post list. Order here
// is only cosmetic (it controls sitemap.xml's URL order); it has no effect
// on which pages get the AdSense script.
const STATIC_PATHS: string[] = [
  '/',
  '/pain-and-suffering-calculator/',
  '/pain-and-suffering-calculator/guide/',
  '/car-accident-settlement-calculator/',
  '/workers-comp-settlement-calculator/',
  '/methodology/',
  '/workers-comp-maximum-weekly-benefits-by-state/',
  '/editorial-policy/',
  '/blog/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-use/',
]

export function getIndexablePaths(): string[] {
  const blogPaths = getPublishedBlogPosts().map((post) => post.slug)

  const painSufferingStatePaths = ALL_STATES.map(
    (state) => `/pain-and-suffering-calculator/${state.slug}/`,
  )

  const carAccidentStatePaths = CAR_ACCIDENT_STATES.map(
    (state) => `/car-accident-settlement-calculator/${state.slug}/`,
  )

  // Noindexed workers-comp states (thin, stubbed content — see
  // NOINDEXED_WORKERS_COMP_SLUGS) are excluded here too, same as sitemap.ts.
  const workersCompStatePaths = WORKERS_COMP_STATES
    .filter((state) => !NOINDEXED_WORKERS_COMP_SLUGS.has(state.slug))
    .map((state) => `/workers-comp-settlement-calculator/${state.slug}/`)

  return [
    ...STATIC_PATHS,
    ...blogPaths,
    ...painSufferingStatePaths,
    ...carAccidentStatePaths,
    ...workersCompStatePaths,
  ]
}
