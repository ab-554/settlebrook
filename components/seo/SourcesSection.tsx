// ─────────────────────────────────────────────────────────────────────────────
// components/seo/SourcesSection.tsx
// Renders lib/data/sources.json entries as a "Sources" section. Primary
// sources first, secondary (statute mirrors) labeled accordingly. Hidden
// entirely when the entry list is empty. Added 2026-09-24 legal accuracy sprint.
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceEntry {
  label: string
  url: string
  supports: string
  tier: 'primary' | 'secondary'
}

export default function SourcesSection({ sources }: { sources: SourceEntry[] }) {
  if (!sources || sources.length === 0) return null

  const ordered = [
    ...sources.filter((s) => s.tier === 'primary'),
    ...sources.filter((s) => s.tier !== 'primary'),
  ]

  return (
    <section aria-labelledby="sources-heading">
      <h2
        id="sources-heading"
        className="heading-gradient"
        style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
      >
        Sources
      </h2>
      <ol style={{ color: '#94A3B8', paddingLeft: '20px', listStyleType: 'decimal', lineHeight: '1.8' }}>
        {ordered.map((source) => (
          <li key={source.url} style={{ marginBottom: '12px' }}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#60A5FA' }}
            >
              {source.label}
            </a>
            {source.tier === 'secondary' && (
              <span style={{ color: '#64748B' }}> (statute text via Justia/FindLaw)</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
