// ─────────────────────────────────────────────────────────────────────────────
// app/indexability.test.ts
// Regression test for the stray `robots: { index: false }` that sat on
// /blog/settlement-exceeds-policy-limits/ while the same URL was listed in
// sitemap.xml. A sitemap entry that the page itself noindexes is a direct
// contradiction Google reports as "Submitted URL marked 'noindex'".
//
// Two checks:
//   1. Every published blog post's own metadata is index/follow.
//   2. Every path getIndexablePaths() returns — the single list that feeds
//      sitemap.xml and the AdSense allowlist — resolves to a page whose
//      metadata is index/follow. This is the same list scripts/check-noindex.mjs
//      verifies against the rendered HTML after `next build`; this test catches
//      it earlier, at the metadata-export level, with a readable failure.
//
// A page that sets no `robots` inherits the indexable default in
// app/layout.tsx, so `undefined` counts as indexable here. (The post-build
// script checks the real rendered <meta name="robots">, which covers a
// regression in that inherited default.)
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'
import { getIndexablePaths } from '@/lib/data/sitePaths'
import { getPublishedBlogPosts } from '@/lib/data/blogPosts'

const APP_DIR = path.resolve(__dirname)

type RobotsValue = Metadata['robots']
type PageModule = {
  metadata?: Metadata
  generateMetadata?: (props: { params: Promise<Record<string, string>> }) => Promise<Metadata>
}

// Returns the reasons a robots value blocks indexing or link-following, or an
// empty array when it is fine. Handles both the string form ('noindex, ...')
// and the object form, including the nested googleBot override.
function robotsProblems(robots: RobotsValue): string[] {
  if (robots === undefined || robots === null) return []
  if (typeof robots === 'string') {
    return /noindex|nofollow|\bnone\b/i.test(robots) ? [`robots is "${robots}"`] : []
  }
  const problems: string[] = []
  if (robots.index === false) problems.push('robots.index is false')
  if (robots.follow === false) problems.push('robots.follow is false')
  const bot = robots.googleBot
  if (bot && typeof bot === 'object') {
    if (bot.index === false) problems.push('googleBot.index is false')
    if (bot.follow === false) problems.push('googleBot.follow is false')
  } else if (typeof bot === 'string' && /noindex|nofollow|\bnone\b/i.test(bot)) {
    problems.push(`googleBot is "${bot}"`)
  }
  return problems
}

// '/blog/foo/' → app/blog/foo/page.tsx. State pages have no file of their own:
// '/<tool>/<state>/' → app/<tool>/[state]/page.tsx with params { state }.
function resolvePage(urlPath: string): { file: string; params: Record<string, string> } {
  const segments = urlPath.split('/').filter(Boolean)
  const direct = path.join(APP_DIR, ...segments, 'page.tsx')
  if (fs.existsSync(direct)) return { file: direct, params: {} }

  const dynamic = path.join(APP_DIR, ...segments.slice(0, -1), '[state]', 'page.tsx')
  if (segments.length > 1 && fs.existsSync(dynamic)) {
    return { file: dynamic, params: { state: segments[segments.length - 1] } }
  }
  throw new Error(`No page.tsx found for indexable path ${urlPath}`)
}

async function metadataFor(urlPath: string): Promise<Metadata> {
  const { file, params } = resolvePage(urlPath)
  const mod: PageModule = await import(/* @vite-ignore */ file)
  if (mod.generateMetadata) return mod.generateMetadata({ params: Promise.resolve(params) })
  if (mod.metadata) return mod.metadata
  throw new Error(`${urlPath} exports neither metadata nor generateMetadata`)
}

describe('page indexability', () => {
  it('every published blog post has index/follow metadata', async () => {
    const posts = getPublishedBlogPosts()
    expect(posts.length).toBeGreaterThan(0)

    for (const post of posts) {
      const meta = await metadataFor(post.slug)
      expect(robotsProblems(meta.robots), post.slug).toEqual([])
    }
  })

  it('every path in getIndexablePaths() has index/follow metadata', async () => {
    const offenders: string[] = []

    for (const urlPath of getIndexablePaths()) {
      const meta = await metadataFor(urlPath)
      const problems = robotsProblems(meta.robots)
      if (problems.length > 0) offenders.push(`${urlPath} — ${problems.join('; ')}`)
    }

    // One assertion over all paths so a failure lists every contradiction at once.
    expect(offenders, `in the sitemap but noindexed:\n${offenders.join('\n')}`).toEqual([])
  })

  it('robotsProblems flags the shapes that caused the original bug', () => {
    expect(robotsProblems({ index: false, follow: false })).toHaveLength(2)
    expect(robotsProblems({ index: true, follow: true, googleBot: { index: false } })).toHaveLength(1)
    expect(robotsProblems('noindex, nofollow')).toHaveLength(1)
    expect(robotsProblems(undefined)).toEqual([])
    expect(robotsProblems({ index: true, follow: true })).toEqual([])
  })
})
