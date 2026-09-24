// ─────────────────────────────────────────────────────────────────────────────
// lib/data/blogPosts.ts
// Single source of truth for published blog posts, newest first. Shared by
// app/blog/page.tsx (full list) and app/page.tsx (latest 5). When a new post
// ships, add it here and to app/sitemap.ts — everywhere else picks it up
// automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  dateTime: string
  // Defaults to true when omitted. A post with published: false stays in
  // this array (so its own page.tsx can look up its metadata) but is
  // excluded from the index, homepage, sitemap, and cross-links, and its
  // own route calls notFound() to return a real 404 until this flips.
  published?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '/blog/injury-claim-calculator/',
    title: 'Injury Claim Calculator: How Insurers Value Your Claim',
    description:
      'See how insurers actually calculate a personal injury claim, then use our free injury claim calculator to estimate your own settlement range.',
    date: 'September 24, 2026',
    dateTime: '2026-09-24',
  },
  {
    slug: '/blog/diminished-value-claim/',
    title: 'Diminished Value Claims After a Car Accident',
    description:
      'What a diminished value claim is, how insurers use the 17c formula, and how diminished value fits into your overall car accident settlement.',
    date: 'September 24, 2026',
    dateTime: '2026-09-24',
  },
  {
    slug: '/blog/settlement-exceeds-policy-limits/',
    title: 'When Your Injury Claim Exceeds Policy Limits',
    description:
      "Your damages are worth more than the at-fault driver's insurance will pay. Here's what happens next, and where the rest of the money can come from.",
    date: 'September 27, 2026',
    dateTime: '2026-09-27',
    published: false,
  },
  {
    slug: '/blog/ppd-settlement-calculator-guide/',
    title: 'PPD Settlement Calculator & Payout Guide',
    description:
      'Learn exactly how your PPD settlement is calculated. Our permanent partial disability guide explains impairment ratings, state formulas, and payout amounts.',
    date: 'September 23, 2026',
    dateTime: '2026-09-23',
  },
  {
    slug: '/blog/state-farm-pain-and-suffering-calculator/',
    title: 'How State Farm Calculates Pain and Suffering',
    description:
      'There is no official state farm pain and suffering calculator, but its internal evaluation process is known. Learn how to estimate your true payout now.',
    date: 'August 20, 2026',
    dateTime: '2026-08-20',
  },
]

export function getPublishedBlogPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.published !== false)
}

export function getLatestBlogPosts(limit: number): BlogPost[] {
  return getPublishedBlogPosts().slice(0, limit)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
