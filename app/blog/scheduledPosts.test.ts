// ─────────────────────────────────────────────────────────────────────────────
// app/blog/scheduledPosts.test.ts
// Posts 8-9 are scheduled (2026-10-29 / 2026-11-02). Each page gates itself
// with notFound() until a build runs on or after its publishDate, so a build
// before then must serve a real 404, not a live page. The clock is driven
// with vi.setSystemTime exactly as app/sitemap.test.ts does.
// ─────────────────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getBlogPostBySlug } from '@/lib/data/blogPosts'
import ImpairmentRatingPayoutPost from './impairment-rating-payout-calculator/page'
import CaliforniaCompromiseAndReleasePost from './california-compromise-and-release/page'

const SCHEDULED = [
  { slug: '/blog/impairment-rating-payout-calculator/', publishDate: '2026-10-29', Page: ImpairmentRatingPayoutPost },
  { slug: '/blog/california-compromise-and-release/', publishDate: '2026-11-02', Page: CaliforniaCompromiseAndReleasePost },
]

// Noon Eastern: blogPosts.ts compares publishDate with the America/New_York date.
function setSiteDate(isoDate: string): void {
  vi.setSystemTime(new Date(`${isoDate}T12:00:00-04:00`))
}

function dayBefore(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('scheduled blog posts 8-9', () => {
  it.each(SCHEDULED)('$slug is registered with its publishDate', ({ slug, publishDate }) => {
    expect(getBlogPostBySlug(slug)?.publishDate).toBe(publishDate)
  })

  it.each(SCHEDULED)('$slug 404s the day before its publishDate', ({ publishDate, Page }) => {
    setSiteDate(dayBefore(publishDate))
    expect(() => Page()).toThrowError(/404|NOT_FOUND/)
  })

  // The "renders once live" side is covered by `next build` (the page must
  // prerender) and scripts/check-noindex.mjs, which reads the built sitemap.
})
