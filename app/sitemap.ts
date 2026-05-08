// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// FIX H14: car-accident and workers-comp stub pages bumped from 0.5 → 0.75
//          These are core commercial pages. Priority 0.5 is for tag/category
//          pages. Even as stubs they're your #2 and #3 revenue targets.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { ALL_STATES, PRIORITY_STATES } from '@/lib/data/states'

const BASE_URL = 'https://settlebrook.com'
const PRIORITY_STATE_SLUGS = new Set(PRIORITY_STATES.map((s) => s.slug))

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pain-and-suffering-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      // FIX H14: was 0.5 — bumped to 0.75 (core commercial page, even as stub)
      url: `${BASE_URL}/car-accident-settlement-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      // FIX H14: was 0.5 — bumped to 0.75 (core commercial page, even as stub)
      url: `${BASE_URL}/workers-comp-settlement-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-use/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const statePages: MetadataRoute.Sitemap = ALL_STATES.map((state) => ({
    url: `${BASE_URL}/pain-and-suffering-calculator/${state.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    // Priority states (CA, TX, FL, NY) stay at 0.8; all others at 0.7
    priority: PRIORITY_STATE_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  return [...staticPages, ...statePages]
}
