// ─────────────────────────────────────────────────────────────────────────────
// components/seo/WorkedExample.tsx
// Replaces unsourced "average settlement" sections. Computes a real result
// from the existing multiplier-method calculator with clearly labeled
// hypothetical inputs — no new legal claims, no invented figures.
// Added 2026-09-24 legal accuracy sprint. Does not touch lib/calculations/*.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { calculateMultiplierMethod, formatCurrency, SEVERITY_CONFIGS } from '@/lib/calculations/painSuffering'

// Fixed, labeled hypothetical — same for every state so the only variable
// between pages is the state's own fault rule and multiplier math.
const EXAMPLE_MEDICAL_BILLS = 12_000
const EXAMPLE_LOST_WAGES = 4_000
const EXAMPLE_SEVERITY = SEVERITY_CONFIGS.moderate

interface WorkedExampleProps {
  toolLabel: string
  stateName: string
  faultRuleLabel: string
  faultRuleExplanation: string
  calculatorHref: string
}

export default function WorkedExample({
  toolLabel,
  stateName,
  faultRuleLabel,
  faultRuleExplanation,
  calculatorHref,
}: WorkedExampleProps) {
  const result = calculateMultiplierMethod({
    medicalBills: EXAMPLE_MEDICAL_BILLS,
    futureMedical: 0,
    lostWages: EXAMPLE_LOST_WAGES,
    futureLostWages: 0,
    propertyDamage: 0,
    multiplier: EXAMPLE_SEVERITY.multiplier,
    plaintiffFaultPercent: 0,
  })

  return (
    <section aria-labelledby="worked-example-heading">
      <h2
        id="worked-example-heading"
        className="heading-gradient"
        style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px', marginTop: '40px' }}
      >
        Example: How an Estimate Works in {stateName}
      </h2>
      <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
        There is no reliable published average {toolLabel} — real
        outcomes vary too much by evidence, venue, and insurance coverage to
        reduce to a single number. Instead, here is a worked example using this
        page&apos;s own calculator with clearly labeled hypothetical inputs, so
        you can see exactly how the math works before running your own figures.
      </p>
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,179,237,0.10)' }}
      >
        <ul style={{ color: '#94A3B8', lineHeight: '1.9', listStyleType: 'none', paddingLeft: 0, marginBottom: '12px' }}>
          <li>Hypothetical medical bills: <strong style={{ color: '#FBBF24' }}>{formatCurrency(EXAMPLE_MEDICAL_BILLS)}</strong></li>
          <li>Hypothetical lost wages: <strong style={{ color: '#FBBF24' }}>{formatCurrency(EXAMPLE_LOST_WAGES)}</strong></li>
          <li>Severity: <strong style={{ color: '#E2E8F0' }}>{EXAMPLE_SEVERITY.label}</strong> ({EXAMPLE_SEVERITY.multiplier}× multiplier)</li>
        </ul>
        <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '16px 0' }} />
        <ul style={{ color: '#94A3B8', lineHeight: '1.9', listStyleType: 'none', paddingLeft: 0 }}>
          <li>Special damages (medical + wages): <strong style={{ color: '#E2E8F0' }}>{formatCurrency(result.specialDamages)}</strong></li>
          <li>Pain &amp; suffering (special damages × multiplier): <strong style={{ color: '#E2E8F0' }}>{formatCurrency(result.painAndSuffering)}</strong></li>
          <li>Total estimate, 0% fault: <strong style={{ color: '#34D399' }}>{formatCurrency(result.totalEstimate)}</strong></li>
        </ul>
      </div>
      <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
        {stateName} follows <strong style={{ color: '#E2E8F0' }}>{faultRuleLabel}</strong>: {faultRuleExplanation} Any
        fault percentage you enter changes the final number — the calculator
        applies it automatically.
      </p>
      <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
        These figures are illustrative only, not a prediction of your case
        value. Use the{' '}
        <Link href={calculatorHref} style={{ color: '#60A5FA' }}>
          {stateName} {toolLabel} calculator
        </Link>{' '}
        above with your own numbers for a personalized estimate.
      </p>
    </section>
  )
}
