// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.test.ts
// Regression test for the 2026-09-27 production build failure: sitemap()
// threw `no metadata rule matches indexable path "/blog/<slug>/"` for every
// scheduled blog post, because resolvePathMeta() only knew about the posts
// hand-listed in BLOG_POST_LAST_MODIFIED. The build was fine until a post's
// publishDate arrived, then getIndexablePaths() started returning it and the
// /sitemap.xml prerender failed.
//
// The tests drive the clock with vi.setSystemTime so they exercise each
// post's "goes live" boundary exactly as the daily rebuild would. They are
// generic over BLOG_POSTS, so a newly added post is covered automatically —
// no test edit needed (that is the whole point: no per-post bookkeeping).
// ─────────────────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import sitemap from './sitemap'
import { BLOG_POSTS, getBlogPostBySlug, isPostPublished } from '@/lib/data/blogPosts'

const BASE_URL = 'https://www.settlebrook.com'

// Noon Eastern on the given day. blogPosts.ts compares publishDate against
// the America/New_York calendar date, so noon-ET sits safely inside the day
// regardless of the machine's own timezone.
function setSiteDate(isoDate: string): void {
  vi.setSystemTime(new Date(`${isoDate}T12:00:00-04:00`))
}

function sitemapUrls(): string[] {
  return sitemap().map((entry) => entry.url)
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('app/sitemap.ts', () => {
  it('does not throw and lists every blog post once all posts are published', () => {
    setSiteDate('2026-12-31')

    let urls: string[] = []
    expect(() => {
      urls = sitemapUrls()
    }).not.toThrow()

    for (const post of BLOG_POSTS) {
      expect(urls, `sitemap is missing ${post.slug}`).toContain(`${BASE_URL}${post.slug}`)
    }
  })

  it('does not throw on any post\'s publishDate, and lists exactly the posts published by then', () => {
    const publishDates = Array.from(new Set(BLOG_POSTS.map((p) => p.publishDate))).sort()

    for (const date of publishDates) {
      setSiteDate(date)

      let urls: string[] = []
      expect(() => {
        urls = sitemapUrls()
      }, `sitemap() threw on ${date}`).not.toThrow()

      for (const post of BLOG_POSTS) {
        const listed = urls.includes(`${BASE_URL}${post.slug}`)
        expect(listed, `${post.slug} on ${date}`).toBe(post.publishDate <= date)
      }
    }
  })

  it('keeps a scheduled post out of the sitemap (and unpublished) the day before its publishDate', () => {
    // Every post dated after the earliest one is "scheduled" relative to some
    // earlier day; checking the day before each publishDate covers posts 6-7
    // (2026-10-03 / 2026-10-05) without hard-coding them.
    for (const post of BLOG_POSTS) {
      const [y, m, d] = post.publishDate.split('-').map(Number)
      const dayBefore = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)
      setSiteDate(dayBefore)

      expect(isPostPublished(getBlogPostBySlug(post.slug)!), `${post.slug} on ${dayBefore}`).toBe(false)
      expect(sitemapUrls(), `${post.slug} on ${dayBefore}`).not.toContain(`${BASE_URL}${post.slug}`)
    }
  })

  it('stamps a post with no explicit lastModified override using its own publishDate', () => {
    setSiteDate('2026-12-31')
    const entries = sitemap()

    // Posts 3-5 are the ones that originally broke the build: they have no
    // BLOG_POST_LAST_MODIFIED entry, so their lastModified must fall back to
    // publishDate.
    for (const slug of [
      '/blog/settlement-exceeds-policy-limits/',
      '/blog/workers-comp-weekly-benefit-calculator/',
      '/blog/minor-car-accident-settlement/',
    ]) {
      const entry = entries.find((e) => e.url === `${BASE_URL}${slug}`)
      expect(entry, slug).toBeDefined()
      expect(entry!.lastModified).toBe(getBlogPostBySlug(slug)!.publishDate)
    }
  })
})
