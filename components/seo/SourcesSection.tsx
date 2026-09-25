// ─────────────────────────────────────────────────────────────────────────────
// components/seo/SourcesSection.tsx
// Renders lib/data/sources.json entries as a "Sources" section. Primary
// sources first, secondary (statute mirrors) labeled accordingly. Hidden
// entirely when the entry list is empty. Added 2026-09-24 legal accuracy sprint.
// Design-refresh: styled as a numbered citation list (.sources-list).
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
    <section aria-labelledby="sources-heading" className="mt-10">
      <h2 id="sources-heading" className="heading-serif h2-editorial">
        Sources
      </h2>
      <ol className="sources-list">
        {ordered.map((source) => (
          <li key={source.url}>
            <span>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
              {source.tier === 'secondary' && (
                <span className="src-tier"> (statute text via Justia/FindLaw)</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
