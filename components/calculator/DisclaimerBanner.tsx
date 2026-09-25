// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/DisclaimerBanner.tsx
// Legal disclaimer — YMYL compliance. Calm, readable, never removed from a
// calculator page. Wording unchanged from the previous version.
// ─────────────────────────────────────────────────────────────────────────────

interface DisclaimerBannerProps {
  variant?: 'banner' | 'footer'
  stateName?: string
}

export default function DisclaimerBanner({ variant = 'banner', stateName }: DisclaimerBannerProps) {
  const locationSuffix = stateName ? ` in ${stateName}` : ''

  if (variant === 'banner') {
    return (
      <p role="note" aria-label="Legal disclaimer" className="note">
        <strong>For informational purposes only.</strong>{' '}
        This calculator provides estimates — not legal advice. Results vary based on your specific
        circumstances, state law, and insurance. Consult a licensed personal injury attorney
        {locationSuffix} for guidance on your case.
      </p>
    )
  }

  return (
    <section
      role="note"
      aria-label="Legal disclaimer"
      className="card-flat prose-col"
      style={{ padding: '24px', margin: '48px 0 8px' }}
    >
      <h2 className="heading-display" style={{ fontSize: 22, marginBottom: 10 }}>Important disclaimer</h2>

      <div className="flex flex-col gap-3" style={{ color: 'var(--ink-2)', fontSize: '16px', lineHeight: '1.65' }}>
        <p>
          The settlement estimates produced by this calculator are for{' '}
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>informational purposes only</strong>{' '}
          and do not constitute legal advice. The multiplier method and per diem method are commonly
          used formulas — but actual settlement values depend on factors this tool cannot assess:
          liability disputes, comparative fault findings, insurance policy limits, medical
          documentation quality, attorney negotiation, and applicable state law{locationSuffix}.
        </p>
        <p>
          No attorney-client relationship is created by using this tool. Consult with a licensed
          personal injury attorney{locationSuffix} before making any decisions. Most attorneys offer
          free consultations and work on contingency.
        </p>
        <p>
          Pain and suffering caps, fault rules, and statutes of limitations change. Always verify
          legal details with a qualified attorney or official state sources.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 mt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <TrustBadge icon="shield" text="No personal data collected" />
        <TrustBadge icon="lock"   text="Free to use — no signup" />
        <TrustBadge icon="check"  text="Updated for 2026 state laws" />
      </div>
    </section>
  )
}

function TrustBadge({ icon, text }: { icon: 'shield' | 'lock' | 'check'; text: string }) {
  const paths: Record<typeof icon, string> = {
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    lock:   'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    check:  'M5 13l4 4L19 7',
  }
  return (
    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-3)' }}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} />
      </svg>
      {text}
    </span>
  )
}
