// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/DisclaimerBanner.tsx
// Legal disclaimer — YMYL compliance. Dark glass theme.
// ─────────────────────────────────────────────────────────────────────────────

interface DisclaimerBannerProps {
  variant?: 'banner' | 'footer'
  stateName?: string
}

export default function DisclaimerBanner({ variant = 'banner', stateName }: DisclaimerBannerProps) {
  const locationSuffix = stateName ? ` in ${stateName}` : ''

  if (variant === 'banner') {
    return (
      <div
        role="note"
        aria-label="Legal disclaimer"
        className="flex items-start gap-3 rounded-xl px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,179,237,0.12)',
        }}
      >
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: '#64748B' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
        <p className="text-xs leading-snug" style={{ color: '#64748B' }}>
          <span className="font-semibold" style={{ color: '#94A3B8' }}>For informational purposes only.</span>{' '}
          This calculator provides estimates — not legal advice. Results vary based on your specific
          circumstances, state law, and insurance. Consult a licensed personal injury attorney
          {locationSuffix} for guidance on your case.
        </p>
      </div>
    )
  }

  return (
    <div
      role="note"
      aria-label="Legal disclaimer"
      className="rounded-2xl px-6 py-6 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(99,179,237,0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#60A5FA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
          Important Disclaimer
        </span>
      </div>

      <div className="flex flex-col gap-2 text-xs leading-relaxed" style={{ color: '#64748B' }}>
        <p>
          The settlement estimates produced by this calculator are for{' '}
          <strong style={{ color: '#94A3B8', fontWeight: 600 }}>informational purposes only</strong>{' '}
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

      <div className="flex flex-wrap gap-4 pt-2" style={{ borderTop: '1px solid rgba(99,179,237,0.10)' }}>
        <TrustBadge icon="shield" text="No personal data collected" />
        <TrustBadge icon="lock"   text="Free to use — no signup" />
        <TrustBadge icon="check"  text="Updated for 2025 state laws" />
      </div>
    </div>
  )
}

function TrustBadge({ icon, text }: { icon: 'shield' | 'lock' | 'check'; text: string }) {
  const paths: Record<typeof icon, string> = {
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    lock:   'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    check:  'M5 13l4 4L19 7',
  }
  return (
    <div className="flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#34D399' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} />
      </svg>
      <span className="text-xs" style={{ color: '#94A3B8' }}>{text}</span>
    </div>
  )
}
