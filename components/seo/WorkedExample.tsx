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
      <h2 id="worked-example-heading" className="heading-serif h2-editorial">
        Example: How an Estimate Works in {stateName}
      </h2>
      <p>
        There is no reliable published average {toolLabel} — real
        outcomes vary too much by evidence, venue, and insurance coverage to
        reduce to a single number. Instead, here is a worked example using this
        page&apos;s own calculator with clearly labeled hypothetical inputs, so
        you can see exactly how the math works before running your own figures.
      </p>
      <div className="card-flat" style={{ padding: '18px 20px', marginBottom: 20 }}>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 0 }}>
          <li className="breakdown-row"><span className="label">Hypothetical medical bills</span><span className="value">{formatCurrency(EXAMPLE_MEDICAL_BILLS)}</span></li>
          <li className="breakdown-row"><span className="label">Hypothetical lost wages</span><span className="value">{formatCurrency(EXAMPLE_LOST_WAGES)}</span></li>
          <li className="breakdown-row"><span className="label">Severity</span><span className="value">{EXAMPLE_SEVERITY.label} ({EXAMPLE_SEVERITY.multiplier}× multiplier)</span></li>
          <li className="breakdown-row"><span className="label">Special damages (medical + wages)</span><span className="value">{formatCurrency(result.specialDamages)}</span></li>
          <li className="breakdown-row"><span className="label">Pain &amp; suffering (special damages × multiplier)</span><span className="value">{formatCurrency(result.painAndSuffering)}</span></li>
          <li className="breakdown-row is-total"><span className="label">Total estimate, 0% fault</span><span className="value" style={{ color: 'var(--accent)' }}>{formatCurrency(result.totalEstimate)}</span></li>
        </ul>
      </div>
      <p>
        {stateName} follows <strong>{faultRuleLabel}</strong>: {faultRuleExplanation} Any
        fault percentage you enter changes the final number — the calculator
        applies it automatically.
      </p>
      <p>
        These figures are illustrative only, not a prediction of your case
        value. Use the{' '}
        <Link href={calculatorHref}>
          {stateName} {toolLabel} calculator
        </Link>{' '}
        above with your own numbers for a personalized estimate.
      </p>
    </section>
  )
}
