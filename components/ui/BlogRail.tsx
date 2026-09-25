// ─────────────────────────────────────────────────────────────────────────────
// components/ui/BlogRail.tsx
// Right rail for long-form articles (blog posts, the pain & suffering guide):
// the three calculators, the latest guides (excluding the current one) and the
// methodology link. Server component; post availability comes from the same
// publishDate logic the sitemap uses.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ArrowRight, Calculator, Car, HardHat, HeartPulse, ShieldCheck } from 'lucide-react'
import { getLatestBlogPosts, getPostDisplayDate } from '@/lib/data/blogPosts'
import { RailCard } from './EditorialLayout'

const TOOLS = [
  { href: '/car-accident-settlement-calculator/', label: 'Car accident settlement', desc: 'Vehicle damage, injuries, policy limits', Icon: Car },
  { href: '/workers-comp-settlement-calculator/', label: 'Workers comp settlement', desc: 'TTD, PPD and PTD by state', Icon: HardHat },
  { href: '/pain-and-suffering-calculator/', label: 'Pain & suffering', desc: 'Multiplier and per diem methods', Icon: HeartPulse },
]

export default function BlogRail({ currentSlug }: { currentSlug?: string }) {
  const posts = getLatestBlogPosts(5).filter((p) => p.slug !== currentSlug).slice(0, 4)

  return (
    <>
      <RailCard>
        <h2 className="font-body font-semibold mb-3 inline-flex items-center gap-2" style={{ fontSize: 'var(--label)' }}>
          <Calculator aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--primary)' }} />
          Run the numbers
        </h2>
        <ul className="flex flex-col gap-1">
          {TOOLS.map(({ href, label, desc, Icon }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-3 py-2.5 rounded-lg" style={{ textDecoration: 'none' }}>
                <span className="icon-tile" style={{ width: 40, height: 40, borderRadius: 10 }}>
                  <Icon aria-hidden="true" size={20} strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold" style={{ color: 'var(--primary)', fontSize: 'var(--label)' }}>{label}</span>
                  <span className="block" style={{ color: 'var(--ink-3)', fontSize: 'var(--caption)' }}>{desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </RailCard>

      {posts.length > 0 && (
        <RailCard>
          <h2 className="font-body font-semibold mb-3" style={{ fontSize: 'var(--label)' }}>Latest guides</h2>
          <ul className="flex flex-col">
            {posts.map((post) => (
              <li key={post.slug} style={{ borderTop: '1px solid var(--line)' }}>
                <Link href={post.slug} className="block py-3" style={{ textDecoration: 'none' }}>
                  <span className="block font-semibold leading-snug" style={{ color: 'var(--ink)', fontSize: 'var(--small)' }}>{post.title}</span>
                  <time dateTime={post.publishDate} className="block mt-1" style={{ color: 'var(--ink-3)', fontSize: 'var(--caption)' }}>
                    {getPostDisplayDate(post)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog/" className="inline-flex items-center gap-1.5 mt-2 font-semibold text-link" style={{ fontSize: 'var(--small)', textDecoration: 'none' }}>
            All guides <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
          </Link>
        </RailCard>
      )}

      <RailCard>
        <h2 className="font-body font-semibold mb-2 inline-flex items-center gap-2" style={{ fontSize: 'var(--label)' }}>
          <ShieldCheck aria-hidden="true" size={18} strokeWidth={2.2} style={{ color: 'var(--money-deep)' }} />
          How we verify
        </h2>
        <p className="mb-3" style={{ color: 'var(--ink-2)', fontSize: 'var(--small)' }}>
          Every formula, statute and review date behind our figures is disclosed. No black-box scores.
        </p>
        <Link href="/methodology/" className="btn-secondary btn-sm w-full">Read our methodology</Link>
      </RailCard>
    </>
  )
}
