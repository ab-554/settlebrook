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
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { ALL_STATES, PRIORITY_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES, NOINDEXED_WORKERS_COMP_SLUGS } from '@/lib/data/workersCompStates'

const BASE_URL = 'https://www.settlebrook.com'
const PRIORITY_STATE_SLUGS = new Set(PRIORITY_STATES.map((s) => s.slug))
const CAR_ACCIDENT_TIER1_SLUGS = new Set(['california', 'texas'])
const WORKERS_COMP_TIER1_SLUGS = new Set(['california', 'texas', 'florida'])

// Real last content-change dates, sourced from `git log -1 --format=%aI -- <file>`
// as of 2026-09-24 (the day of the legal-accuracy fix sprint — commits cff534c,
// 93e2496 — and the 50-states/TTD-duration cleanup sprint that followed it).
const HOMEPAGE_LAST_MODIFIED = '2026-09-24'
const PAIN_SUFFERING_HUB_LAST_MODIFIED = '2026-09-24'
const PAIN_SUFFERING_GUIDE_LAST_MODIFIED = '2026-09-24'
const CAR_ACCIDENT_HUB_LAST_MODIFIED = '2026-09-24'
const WORKERS_COMP_HUB_LAST_MODIFIED = '2026-09-24'
const METHODOLOGY_LAST_MODIFIED = '2026-09-24'
const BLOG_INDEX_LAST_MODIFIED = '2026-09-23'
const BLOG_PPD_GUIDE_LAST_MODIFIED = '2026-09-24'
const BLOG_STATE_FARM_LAST_MODIFIED = '2026-08-19'
const ABOUT_LAST_MODIFIED = '2026-09-24'
const CONTACT_LAST_MODIFIED = '2026-09-24'
const PRIVACY_POLICY_LAST_MODIFIED = '2026-09-24'
const TERMS_OF_USE_LAST_MODIFIED = '2026-09-24'

// All state pages for a given tool share one template file, so they share
// that template's last-modified date until a state gets page-specific edits.
const PAIN_SUFFERING_STATE_LAST_MODIFIED = '2026-09-24'
const CAR_ACCIDENT_STATE_LAST_MODIFIED = '2026-09-24'
const WORKERS_COMP_STATE_LAST_MODIFIED = '2026-09-24'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: HOMEPAGE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pain-and-suffering-calculator/`,
      lastModified: PAIN_SUFFERING_HUB_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pain-and-suffering-calculator/guide/`,
      lastModified: PAIN_SUFFERING_GUIDE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/car-accident-settlement-calculator/`,
      lastModified: CAR_ACCIDENT_HUB_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/workers-comp-settlement-calculator/`,
      lastModified: WORKERS_COMP_HUB_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/methodology/`,
      lastModified: METHODOLOGY_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/`,
      lastModified: BLOG_INDEX_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/ppd-settlement-calculator-guide/`,
      lastModified: BLOG_PPD_GUIDE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/state-farm-pain-and-suffering-calculator/`,
      lastModified: BLOG_STATE_FARM_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: ABOUT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: CONTACT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy/`,
      lastModified: PRIVACY_POLICY_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-use/`,
      lastModified: TERMS_OF_USE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const statePages: MetadataRoute.Sitemap = ALL_STATES.map((state) => ({
    url: `${BASE_URL}/pain-and-suffering-calculator/${state.slug}/`,
    lastModified: PAIN_SUFFERING_STATE_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: PRIORITY_STATE_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  const carAccidentStatePages: MetadataRoute.Sitemap = CAR_ACCIDENT_STATES.map((state) => ({
    url: `${BASE_URL}/car-accident-settlement-calculator/${state.slug}/`,
    lastModified: CAR_ACCIDENT_STATE_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: CAR_ACCIDENT_TIER1_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  // Noindexed workers-comp states (thin, stubbed content — see
  // NOINDEXED_WORKERS_COMP_SLUGS) are left out of the sitemap entirely.
  const workersCompStatePages: MetadataRoute.Sitemap = WORKERS_COMP_STATES
    .filter((state) => !NOINDEXED_WORKERS_COMP_SLUGS.has(state.slug))
    .map((state) => ({
      url: `${BASE_URL}/workers-comp-settlement-calculator/${state.slug}/`,
      lastModified: WORKERS_COMP_STATE_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: WORKERS_COMP_TIER1_SLUGS.has(state.slug) ? 0.8 : 0.7,
    }))

  return [
    ...staticPages,
    ...statePages,
    ...carAccidentStatePages,
    ...workersCompStatePages,
  ]
}
