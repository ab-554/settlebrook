// ─────────────────────────────────────────────────────────────────────────────
// app/blog/page.tsx
// Blog index. Structure mirrors app/methodology/page.tsx:
//   • Same metadata shape (title without " | Settlebrook" — template appends it)
//   • Same paper header band + relative canonical + relative OG/Twitter image paths
//   • WebPage + BreadcrumbList JSON-LD, BreadcrumbNav in the header
// The post list lives in lib/data/blogPosts.ts (shared with the homepage's
// "latest posts" section). When a new post ships, add it there and to
// app/sitemap.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import { getPublishedBlogPosts, getPostDisplayDate } from '@/lib/data/blogPosts'

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

      <main className="min-h-screen">

        {/* ── HEADER BAND ── */}
        <header className="page-band">
          <div className="container-page py-8 sm:py-12">
            <BreadcrumbNav
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: canonicalUrl },
              ]}
            />
            <p className="eyebrow mt-5 mb-2">Plain English · Cited sources · No sales pitch</p>
            <h1>Settlement Guides &amp; Insights</h1>
          </div>
        </header>

        {/* Main content */}
        <div className="container-page py-10 sm:py-14 flex flex-col gap-10">

          {/* Intro */}
          <div className="editorial">
            <p>
              Our calculators give you a number. These guides explain where that number
              comes from and what the person on the other side of the table is looking at
              when they decide what your claim is worth. An insurance adjuster and a
              plaintiff attorney are working from the same playbook &mdash; multiplier
              methods, impairment ratings, statutory rate tables &mdash; and the gap between
              a lowball first offer and a fair settlement usually comes down to who
              understands that playbook better.
            </p>
            <p>
              Everything here is written in plain English, using the same formulas and
              official sources we publish on our{' '}
              <Link href="/methodology/">methodology page</Link>
              . We cover how specific insurers evaluate claims, how individual benefit
              types (like permanent partial disability) are actually calculated
              state-by-state, and the mechanics behind the multiplier and per diem
              methods our tools use. Every guide is reviewed against current law and
              cites its sources &mdash; see our{' '}
              <Link href="/editorial-policy/">editorial policy</Link>
              {' '}for how that review works.
            </p>
          </div>

          {/* Post list */}
          <section aria-labelledby="posts-heading">
            <h2 id="posts-heading" className="sr-only">
              Published guides
            </h2>

            {/* Single column on mobile; the grid holds its shape as posts are added */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getPublishedBlogPosts().map((post) => (
                <Link key={post.slug} href={post.slug} className="card card-pad block">
                  <time dateTime={post.publishDate} className="eyebrow">
                    {getPostDisplayDate(post)}
                  </time>
                  <h3 className="heading-serif mt-2" style={{ fontSize: 22 }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                    {post.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                    Read the guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </div>

      </main>
    </>
  )
}
