// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// Updates:
//   • /car-accident-settlement-calculator/ priority 0.9
//   • /workers-comp-settlement-calculator/ priority 0.9
//   • All pain & suffering, car accident, and workers' comp state pages mapped dynamically
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { ALL_STATES, PRIORITY_STATES } from '@/lib/data/states'
import { CAR_ACCIDENT_STATES } from '@/lib/data/carAccidentStates'
import { WORKERS_COMP_STATES } from '@/lib/data/workersCompStates'

const BASE_URL = 'https://settlebrook.com'
const PRIORITY_STATE_SLUGS = new Set(PRIORITY_STATES.map((s) => s.slug))
const CAR_ACCIDENT_TIER1_SLUGS = new Set(['california', 'texas'])
const WORKERS_COMP_TIER1_SLUGS = new Set(['california', 'texas', 'florida'])

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
      url: `${BASE_URL}/car-accident-settlement-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/workers-comp-settlement-calculator/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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
    priority: PRIORITY_STATE_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  const carAccidentStatePages: MetadataRoute.Sitemap = CAR_ACCIDENT_STATES.map((state) => ({
    url: `${BASE_URL}/car-accident-settlement-calculator/${state.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: CAR_ACCIDENT_TIER1_SLUGS.has(state.slug) ? 0.8 : 0.7,
  }))

  const workersCompStatePages: MetadataRoute.Sitemap = WORKERS_COMP_STATES.map((state) => ({
    url: `${BASE_URL}/workers-comp-settlement-calculator/${state.slug}/`,
    lastModified: new Date(),
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
