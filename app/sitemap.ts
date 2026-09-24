// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// Updates:
//   • /car-accident-settlement-calculator/ priority 0.9
//   • /workers-comp-settlement-calculator/ priority 0.9
//   • All pain & suffering, car accident, and workers' comp state pages mapped dynamically
//   • 2026-09-23: lastModified now uses each page's real last content-change
//     date (git history) instead of build-time new Date() — update the
//     relevant constant below when you next materially change a page.
//     Noindexed workers-comp state pages are excluded (see
//     NOINDEXED_WORKERS_COMP_SLUGS in lib/data/workersCompStates.ts).
//   • 2026-09-24 (Sprint A4): the page list itself now comes from
//     lib/data/sitePaths.ts's getIndexablePaths() — the same function
//     components/ads/AdsenseScript.tsx uses to decide where the AdSense
//     script loads. This file only attaches lastModified/changeFrequency/
//     priority metadata per path; it no longer independently decides which
//     pages exist. A path missing its metadata below fails the build (see
//     resolvePathMeta's throw and assertPathsMatchIndexablePaths) rather
//     than silently falling back to a default, since a silent fallback
//     here is exactly the kind of drift that let /editorial-policy/ and
//     the benefits-table page ship without the AdSense script last sprint.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { PRIORITY_STATES } from '@/lib/data/states'
import { getIndexablePaths } from '@/lib/data/sitePaths'

const BASE_URL = 'https://www.settlebrook.com'
const PRIORITY_STATE_SLUGS = new Set(PRIORITY_STATES.map((s) => s.slug))
const CAR_ACCIDENT_TIER1_SLUGS = new Set(['california', 'texas'])
const WORKERS_COMP_TIER1_SLUGS = new Set(['california', 'texas', 'florida'])

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
interface PathMeta {
  lastModified: string
  changeFrequency: ChangeFrequency
  priority: number
}

// Real last content-change dates, sourced from `git log -1 --format=%aI -- <file>`
// as of 2026-09-24 (the day of the legal-accuracy fix sprint — commits cff534c,
// 93e2496 — and the 50-states/TTD-duration cleanup sprint that followed it).
const HOMEPAGE_LAST_MODIFIED = '2026-09-24'
const PAIN_SUFFERING_HUB_LAST_MODIFIED = '2026-09-24'
const PAIN_SUFFERING_GUIDE_LAST_MODIFIED = '2026-09-24'
const CAR_ACCIDENT_HUB_LAST_MODIFIED = '2026-09-24'
const WORKERS_COMP_HUB_LAST_MODIFIED = '2026-09-24'
const METHODOLOGY_LAST_MODIFIED = '2026-09-24'
const BLOG_INDEX_LAST_MODIFIED = '2026-09-24'
const BLOG_PPD_GUIDE_LAST_MODIFIED = '2026-09-24'
const BLOG_STATE_FARM_LAST_MODIFIED = '2026-08-19'
const ABOUT_LAST_MODIFIED = '2026-09-24'
const CONTACT_LAST_MODIFIED = '2026-09-24'
const PRIVACY_POLICY_LAST_MODIFIED = '2026-09-24'
const TERMS_OF_USE_LAST_MODIFIED = '2026-09-24'
const WORKERS_COMP_MAX_BENEFITS_LAST_MODIFIED = '2026-09-24'
const EDITORIAL_POLICY_LAST_MODIFIED = '2026-09-24'

// All state pages for a given tool share one template file, so they share
// that template's last-modified date until a state gets page-specific edits.
const PAIN_SUFFERING_STATE_LAST_MODIFIED = '2026-09-24'
const CAR_ACCIDENT_STATE_LAST_MODIFIED = '2026-09-24'
const WORKERS_COMP_STATE_LAST_MODIFIED = '2026-09-24'

// Per-post lastModified — new posts default to their publish date unless
// listed here. Add an entry when a published post is materially edited.
const BLOG_POST_LAST_MODIFIED: Record<string, string> = {
  '/blog/injury-claim-calculator/': '2026-09-24',
  '/blog/diminished-value-claim/': '2026-09-24',
  '/blog/ppd-settlement-calculator-guide/': BLOG_PPD_GUIDE_LAST_MODIFIED,
  '/blog/state-farm-pain-and-suffering-calculator/': BLOG_STATE_FARM_LAST_MODIFIED,
}

const STATIC_PATH_METADATA: Record<string, PathMeta> = {
  '/': { lastModified: HOMEPAGE_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1.0 },
  '/pain-and-suffering-calculator/': { lastModified: PAIN_SUFFERING_HUB_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  '/pain-and-suffering-calculator/guide/': { lastModified: PAIN_SUFFERING_GUIDE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
  '/car-accident-settlement-calculator/': { lastModified: CAR_ACCIDENT_HUB_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  '/workers-comp-settlement-calculator/': { lastModified: WORKERS_COMP_HUB_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  '/methodology/': { lastModified: METHODOLOGY_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
  '/workers-comp-maximum-weekly-benefits-by-state/': { lastModified: WORKERS_COMP_MAX_BENEFITS_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.75 },
  '/editorial-policy/': { lastModified: EDITORIAL_POLICY_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
  '/blog/': { lastModified: BLOG_INDEX_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
  '/about/': { lastModified: ABOUT_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
  '/contact/': { lastModified: CONTACT_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
  '/privacy-policy/': { lastModified: PRIVACY_POLICY_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.4 },
  '/terms-of-use/': { lastModified: TERMS_OF_USE_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.4 },
}

function resolvePathMeta(path: string): PathMeta {
  const staticMeta = STATIC_PATH_METADATA[path]
  if (staticMeta) return staticMeta

  const blogLastModified = BLOG_POST_LAST_MODIFIED[path]
  if (blogLastModified) {
    return { lastModified: blogLastModified, changeFrequency: 'monthly', priority: 0.7 }
  }

  const painSufferingMatch = path.match(/^\/pain-and-suffering-calculator\/([^/]+)\/$/)
  if (painSufferingMatch) {
    const slug = painSufferingMatch[1]
    return {
      lastModified: PAIN_SUFFERING_STATE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: PRIORITY_STATE_SLUGS.has(slug) ? 0.8 : 0.7,
    }
  }

  const carAccidentMatch = path.match(/^\/car-accident-settlement-calculator\/([^/]+)\/$/)
  if (carAccidentMatch) {
    const slug = carAccidentMatch[1]
    return {
      lastModified: CAR_ACCIDENT_STATE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: CAR_ACCIDENT_TIER1_SLUGS.has(slug) ? 0.8 : 0.7,
    }
  }

  const workersCompMatch = path.match(/^\/workers-comp-settlement-calculator\/([^/]+)\/$/)
  if (workersCompMatch) {
    const slug = workersCompMatch[1]
    return {
      lastModified: WORKERS_COMP_STATE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: WORKERS_COMP_TIER1_SLUGS.has(slug) ? 0.8 : 0.7,
    }
  }

  // A path getIndexablePaths() produced that none of the patterns above
  // recognize is a real gap, not something to paper over with a default —
  // that silent-default is exactly the failure mode this refactor exists
  // to close off. Fail the build instead.
  throw new Error(
    `app/sitemap.ts: no metadata rule matches indexable path "${path}". ` +
    `Add one in resolvePathMeta() (or STATIC_PATH_METADATA / BLOG_POST_LAST_MODIFIED) ` +
    `before this page can appear in the sitemap.`,
  )
}

// Defense-in-depth: components/ads/AdsenseScript.tsx calls getIndexablePaths()
// directly, so it structurally cannot list a different set of pages than this
// file does. This assertion exists to catch the one way that guarantee could
// still be broken — a future edit to this file that filters, skips, or
// otherwise emits a different path set than getIndexablePaths() itself
// returned. It runs every time sitemap() runs, which Next.js does at build
// time to generate the static /sitemap.xml route, so a mismatch fails the build.
function assertPathsMatchIndexablePaths(sitemapPaths: string[]): void {
  const indexable = getIndexablePaths()
  const sitemapSet = new Set(sitemapPaths)
  const indexableSet = new Set(indexable)

  const missingFromSitemap = indexable.filter((p) => !sitemapSet.has(p))
  const extraInSitemap = sitemapPaths.filter((p) => !indexableSet.has(p))

  if (missingFromSitemap.length > 0 || extraInSitemap.length > 0) {
    throw new Error(
      'app/sitemap.ts: sitemap output diverged from lib/data/sitePaths.ts\'s ' +
      'getIndexablePaths() — the same function the AdSense allowlist uses. ' +
      (missingFromSitemap.length > 0 ? `Missing from sitemap: ${missingFromSitemap.join(', ')}. ` : '') +
      (extraInSitemap.length > 0 ? `Extra in sitemap, not in getIndexablePaths(): ${extraInSitemap.join(', ')}.` : ''),
    )
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getIndexablePaths()

  assertPathsMatchIndexablePaths(paths)

  return paths.map((path) => {
    const meta = resolvePathMeta(path)
    return {
      url: `${BASE_URL}${path}`,
      lastModified: meta.lastModified,
      changeFrequency: meta.changeFrequency,
      priority: meta.priority,
    }
  })
}
