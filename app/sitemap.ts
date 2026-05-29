// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// Updates:
//   • /car-accident-settlement-calculator/ bumped to priority 0.9 (full production
//     page, same tier as /pain-and-suffering-calculator/)
//   • All 14 car accident state pages added (0.8 for CA/TX, 0.7 for all others)
//   • workers-comp stub stays at 0.75 until Tool #3 is built
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { ALL_STATES, PRIORITY_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'

const BASE_URL = 'https://settlebrook.com'
const PRIORITY_STATE_SLUGS = new Set(PRIORITY_STATES.map((s) => s.slug))
// Tier 1 car accident states (CA, TX) get 0.8 — same as priority pain & suffering states
const CAR_ACCIDENT_TIER1_SLUGS = new Set(['california', 'texas'])

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
      url: `${BASE_URL}/pain-and-suffering-calculator/guide/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      // Full production page — same priority tier as Tool #1
      url: `${BASE_URL}/car-accident-settlement-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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

  // Car accident state pages — Tier 1 (CA, TX) at 0.8, all others at 0.7
  const carAccidentStatePages: MetadataRoute.Sitemap = CAR_ACCIDENT_STATES.map((state) => ({
    url: `${BASE_URL}/car-accident-settlement-calculator/${state.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: CAR_ACCIDENT_TIER1_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  return [...staticPages, ...statePages, ...carAccidentStatePages]
}
