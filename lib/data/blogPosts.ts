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
}

export const BLOG_POSTS: BlogPost[] = [
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

export function getLatestBlogPosts(limit: number): BlogPost[] {
  return BLOG_POSTS.slice(0, limit)
}
