// ─────────────────────────────────────────────────────────────────────────────
// components/ui/Brand.tsx
// The Settlebrook mark and wordmark as inline SVG + text, so they render crisp
// at every size and inherit the page fonts. The same mark is exported as
// app/icon.svg and rasterised into public/favicon.ico, the 48/192/512 PNGs,
// apple-touch-icon.png, logo.png and og-image.png (see scripts in the
// design-refresh commit message). Keep the geometry here and there in sync.
// ─────────────────────────────────────────────────────────────────────────────

interface MarkProps {
  size?: number
  className?: string
}

/** Rounded deep-green tile with a cream "S" ribbon — the brook that settles. */
export function BrandMark({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#0E5E52" />
      <path
        d="M45 19.5c-2.5-4-9-6-15.5-4.5C23 16.5 18.5 20 18.5 25c0 5.5 5 8 13.5 9.5S46 38 46 43.5c0 5.5-5.5 9-13.5 9-6 0-11.5-2-14-6"
        fill="none"
        stroke="#FAF7F2"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface WordmarkProps {
  /** Height of the mark in px; the text scales with it. */
  size?: number
  className?: string
}

/** Mark + "Settlebrook" wordmark. "brook" takes the accent, as the old logo did. */
export function BrandWordmark({ size = 28, className }: WordmarkProps) {
  const fontSize = Math.round(size * 0.82)
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <BrandMark size={size} />
      <span
        className="font-display font-semibold leading-none"
        style={{ fontSize, color: 'var(--ink)', letterSpacing: '-0.015em' }}
      >
        Settle<span style={{ color: 'var(--accent)' }}>brook</span>
      </span>
    </span>
  )
}
