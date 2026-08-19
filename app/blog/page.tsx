// ─────────────────────────────────────────────────────────────────────────────
// app/blog/page.tsx
// Blog index. Structure mirrors app/methodology/page.tsx:
//   • Same metadata shape (title without " | Settlebrook" — template appends it)
//   • Same hero + relative canonical + relative OG/Twitter image paths
//   • WebPage + BreadcrumbList JSON-LD, BreadcrumbNav in the article body
// The post list is a hand-maintained array — one entry per published post. When
// a second post ships, add it here and to app/sitemap.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'

const canonicalUrl = '/blog/'

export const metadata: Metadata = {
  // Title stays short — the root layout template appends " | Settlebrook" (13 chars)
  title: 'Settlement Guides & Insights — Blog',
  description:
    'Plain-English guides on how insurers value injury claims, how pain and suffering is calculated, and how to estimate what your settlement is actually worth.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Settlement Guides & Insights — Blog | Settlebrook',
    description:
      'Plain-English guides on how insurers value injury claims, how pain and suffering is calculated, and how to estimate what your settlement is actually worth.',
    url: canonicalUrl,
    siteName: 'Settlebrook',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Settlebrook — Settlement Guides and Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Guides & Insights — Blog | Settlebrook',
    description:
      'Plain-English guides on how insurers value injury claims, how pain and suffering is calculated, and how to estimate what your settlement is actually worth.',
    images: ['/og-image.png'],
  },
}

// ─── Post list ────────────────────────────────────────────────────────────────
// One entry per published post, newest first. `description` doubles as the card
// line and matches the post's own meta description.

const POSTS = [
  {
    slug: '/blog/state-farm-pain-and-suffering-calculator/',
    title: 'How State Farm Calculates Pain and Suffering',
    description:
      'There is no official state farm pain and suffering calculator, but its internal evaluation process is known. Learn how to estimate your true payout now.',
    date: 'August 20, 2026',
    dateTime: '2026-08-20',
  },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Settlement Guides & Insights — Blog',
  url: canonicalUrl,
  description:
    'Plain-English guides on how insurers value injury claims, how pain and suffering is calculated, and how to estimate what your settlement is actually worth.',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Settlebrook',
    url: 'https://www.settlebrook.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Settlebrook',
    url: 'https://www.settlebrook.com',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
  ],
}

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen" style={{ backgroundColor: '#050A18' }}>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4"
          style={{
            minHeight: '46vh',
            background: 'radial-gradient(ellipse at top, #1E3A5F 0%, #050A18 70%)',
          }}
        >
          {/* Orbs */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div className="orb-1 absolute rounded-full" style={{ width: 480, height: 480, top: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)', filter: 'blur(48px)' }} />
            <div className="orb-2 absolute rounded-full" style={{ width: 380, height: 380, bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)', filter: 'blur(48px)' }} />
            <div className="orb-3 absolute rounded-full" style={{ width: 300, height: 300, top: '45%', left: '55%', background: 'radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          </div>

          <div className="relative max-w-5xl mx-auto py-16 sm:py-20 flex flex-col items-center gap-7">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <span className="trust-pill">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#34D399', animation: 'pulseGlow 2s infinite' }} />
                Plain English · Cited Sources · No Sales Pitch
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-in-up-d1 heading-gradient"
              style={{ fontSize: 'clamp(32px, 5.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Settlement Guides &amp; Insights
            </h1>
          </div>
        </section>

        {/* Main content */}
        <article className="max-w-7xl mx-auto px-6 sm:px-8 py-14 flex flex-col gap-10">

          {/* Breadcrumb */}
          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: canonicalUrl },
            ]}
          />

          {/* Intro */}
          <p className="max-w-3xl text-base leading-relaxed" style={{ color: '#94A3B8' }}>
            Our calculators give you a number. These guides explain where that number
            comes from and what the person on the other side of the table is looking at
            when they decide what your claim is worth. Everything here is written in
            plain English, using the same formulas and sources we publish on our{' '}
            <Link href="/methodology/" className="underline transition-colors" style={{ color: '#60A5FA' }}>
              methodology page
            </Link>
            .
          </p>

          {/* Post list */}
          <section aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">
              Published guides
            </h2>

            {/* Single column on mobile; the grid holds its shape as posts are added */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={post.slug}
                  className="glass-card block p-6 sm:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <time
                    dateTime={post.dateTime}
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: '#60A5FA' }}
                  >
                    {post.date}
                  </time>
                  <h3
                    className="mt-3 font-bold leading-snug"
                    style={{ fontSize: 22, color: '#E2E8F0', letterSpacing: '-0.01em' }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                    {post.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium" style={{ color: '#60A5FA' }}>
                    Read the guide
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </article>

      </main>
    </>
  )
}
