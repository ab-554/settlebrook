// ─────────────────────────────────────────────────────────────────────────────
// lib/data/blogPosts.ts
// Single source of truth for blog posts. Shared by app/blog/page.tsx (full
// index), app/page.tsx (latest 5), lib/data/sitePaths.ts (sitemap + the
// AdSense allowlist derive from getIndexablePaths(), which calls
// getPublishedBlogPosts() here), each post's own page.tsx (its notFound()
// gate), and any hub page that cross-links to a post.
//
// 2026-09-25 (Sprint B3): replaced the published boolean with a real
// publishDate (YYYY-MM-DD, America/New_York) — a post goes live on its own
// once the site is rebuilt on or after that date, no flag flip needed. This
// is a static-export site, so "live" only takes effect at build time; see
// .github/workflows/daily-rebuild.yml for the daily rebuild that makes a
// scheduled publishDate actually take effect on the day it arrives.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_TIME_ZONE = 'America/New_York'

export interface BlogPost {
  slug: string
  title: string
  description: string
  // YYYY-MM-DD, interpreted in America/New_York. The post is live once the
  // site is built on or after this date — see isPostPublished().
  publishDate: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '/blog/injury-claim-calculator/',
    title: 'Injury Claim Calculator: How Insurers Value Your Claim',
    description:
      'See how injury claims are valued, then use our free injury claim calculator to estimate your own settlement range.',
    publishDate: '2026-09-24',
  },
  {
    slug: '/blog/diminished-value-claim/',
    title: 'Diminished Value Claims After a Car Accident',
    description:
      'What a diminished value claim is, how the 17c formula works, and how diminished value fits into your overall car accident settlement.',
    publishDate: '2026-09-24',
  },
  {
    slug: '/blog/settlement-exceeds-policy-limits/',
    title: 'When Your Injury Claim Exceeds Policy Limits',
    description:
      "Your damages are worth more than the at-fault driver's insurance will pay. Here's what happens next, and where the rest of the money can come from.",
    publishDate: '2026-09-27',
  },
  {
    slug: '/blog/workers-comp-weekly-benefit-calculator/',
    title: "How Your Workers' Comp Weekly Check Is Calculated (2026)",
    description:
      "How workers' comp weekly benefits are calculated in 2026: average weekly wage, the 66 2/3% rate, state max/min caps, waiting periods, and a worked example.",
    publishDate: '2026-09-29',
  },
  {
    slug: '/blog/minor-car-accident-settlement/',
    title: 'Minor Car Accident Settlements: Injury vs. No Injury',
    description:
      "How minor car accident settlements differ when there's a soft-tissue injury versus no injury at all, plus a free calculator to estimate yours.",
    publishDate: '2026-10-01',
  },
  {
    slug: '/blog/ppd-settlement-calculator-guide/',
    title: 'PPD Settlement Calculator & Payout Guide',
    description:
      'Learn exactly how your PPD settlement is calculated. Our permanent partial disability guide explains impairment ratings, state formulas, and payout amounts.',
    publishDate: '2026-09-23',
  },
  {
    slug: '/blog/state-farm-pain-and-suffering-calculator/',
    title: 'How State Farm Calculates Pain and Suffering',
    description:
      'There is no official State Farm pain and suffering calculator. This guide explains what shapes a bodily injury offer and how to estimate your own pain and suffering figure.',
    publishDate: '2026-08-20',
  },
]

// Today's date in America/New_York as YYYY-MM-DD — string-comparable against
// publishDate since both are zero-padded YYYY-MM-DD. Recomputed on each call
// rather than cached at module load, since a long-running dev server should
// see a rollover at midnight the same way a fresh build would.
function getTodayInSiteTimeZone(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function isPostPublished(post: BlogPost): boolean {
  return post.publishDate <= getTodayInSiteTimeZone()
}

export function getPublishedBlogPosts(): BlogPost[] {
  return BLOG_POSTS
    .filter(isPostPublished)
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : a.publishDate > b.publishDate ? -1 : 0))
}

export function getLatestBlogPosts(limit: number): BlogPost[] {
  return getPublishedBlogPosts().slice(0, limit)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

// Human-readable form of publishDate ("September 24, 2026"), for the visible
// <time> text on blog cards and post headers. Built from the date parts
// directly (not `new Date(post.publishDate)`, which parses as UTC midnight
// and can render as the prior day in a timezone west of UTC) so it always
// reads correctly regardless of the viewer's or server's local timezone.
export function getPostDisplayDate(post: BlogPost): string {
  const [year, month, day] = post.publishDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
