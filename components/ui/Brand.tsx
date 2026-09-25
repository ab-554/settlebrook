// ─────────────────────────────────────────────────────────────────────────────
// components/ui/Brand.tsx
// The Settlebrook mark and wordmark as inline SVG + text, so they render crisp
// at every size and inherit the page fonts. The same mark is exported as
// app/icon.svg and rasterised into public/favicon.ico, the 16/32/48/192/512
// PNGs, apple-touch-icon.png, logo.png and og-image.png (see
// design-review/v2/README.md for the regeneration script). Keep the geometry
// here and there in sync.
// Design v2 (2026-09-25): primary-blue tile (#1D4ED8) with a white "S" ribbon.
// The bright tile stays legible on both light and dark browser tabs.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND_TILE = '#1D4ED8'
export const BRAND_RIBBON = '#FFFFFF'

interface MarkProps {
  size?: number
  className?: string
}

/** Rounded primary-blue tile with a white "S" ribbon — the brook that settles. */
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
      <rect width="64" height="64" rx="14" fill={BRAND_TILE} />
      <path
        d="M45 19.5c-2.5-4-9-6-15.5-4.5C23 16.5 18.5 20 18.5 25c0 5.5 5 8 13.5 9.5S46 38 46 43.5c0 5.5-5.5 9-13.5 9-6 0-11.5-2-14-6"
        fill="none"
        stroke={BRAND_RIBBON}
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

/** Mark + "Settlebrook" wordmark. "brook" takes the primary colour. */
export function BrandWordmark({ size = 30, className }: WordmarkProps) {
  const fontSize = Math.round(size * 0.8)
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <BrandMark size={size} />
      <span
        className="font-display font-bold leading-none"
        style={{ fontSize, color: 'var(--ink)', letterSpacing: '-0.025em' }}
      >
        Settle<span style={{ color: 'var(--primary)' }}>brook</span>
      </span>
    </span>
  )
}
