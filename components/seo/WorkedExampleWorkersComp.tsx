// ─────────────────────────────────────────────────────────────────────────────
// components/seo/WorkedExampleWorkersComp.tsx
// Replaces unsourced "average settlement" / "25% uplift" sections on workers
// comp pages. Computes a real result from the existing calculateWorkersComp()
// function with clearly labeled hypothetical inputs — no new legal claims,
// no invented figures. Added 2026-09-24 legal accuracy sprint. Does not touch
// lib/calculations/*.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { calculateWorkersComp } from '@/lib/calculations/workersComp'
import { formatCurrency } from '@/lib/calculations/painSuffering'

// Fixed, labeled hypothetical — same for every state so the only variable
// between pages is the state's own benefit rate and weekly cap.
const EXAMPLE_AWW = 800
const EXAMPLE_TREATMENT_WEEKS = 8

interface WorkedExampleWorkersCompProps {
  stateSlug: string
  stateName: string
  calculatorHref: string
}

export default function WorkedExampleWorkersComp({
  stateSlug,
  stateName,
  calculatorHref,
}: WorkedExampleWorkersCompProps) {
  const result = calculateWorkersComp({
    state: stateSlug,
    benefitType: 'ttd',
    averageWeeklyWage: EXAMPLE_AWW,
    hasAttorney: false,
    treatmentWeeks: EXAMPLE_TREATMENT_WEEKS,
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
        There is no reliable published average for workers comp settlements —
        real outcomes vary too much by wages, injury type, and how a claim is
        resolved to reduce to a single number. Instead, here is a worked
        example using this page&apos;s own calculator with clearly labeled
        hypothetical inputs, so you can see exactly how the math works before
        running your own figures.
      </p>
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,179,237,0.10)' }}
      >
        <ul style={{ color: '#94A3B8', lineHeight: '1.9', listStyleType: 'none', paddingLeft: 0, marginBottom: '12px' }}>
          <li>Hypothetical Average Weekly Wage: <strong style={{ color: '#FBBF24' }}>{formatCurrency(EXAMPLE_AWW)}/wk</strong></li>
          <li>Benefit type: <strong style={{ color: '#E2E8F0' }}>Temporary Total Disability (TTD)</strong></li>
          <li>Hypothetical treatment period: <strong style={{ color: '#E2E8F0' }}>{EXAMPLE_TREATMENT_WEEKS} weeks</strong></li>
        </ul>
        <hr style={{ borderColor: 'rgba(99,179,237,0.15)', margin: '16px 0' }} />
        <ul style={{ color: '#94A3B8', lineHeight: '1.9', listStyleType: 'none', paddingLeft: 0 }}>
          <li>Weekly benefit ({stateName}&apos;s rate, capped at the state max): <strong style={{ color: '#E2E8F0' }}>{formatCurrency(result.weeklyBenefit)}/wk</strong></li>
          <li>Base estimate ({EXAMPLE_TREATMENT_WEEKS} wks × weekly benefit): <strong style={{ color: '#34D399' }}>{formatCurrency(result.baseSettlement)}</strong></li>
        </ul>
      </div>
      <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '18px' }}>
        These figures are illustrative only, not a prediction of your claim
        value. Use the{' '}
        <Link href={calculatorHref} style={{ color: '#60A5FA' }}>
          {stateName} workers comp settlement calculator
        </Link>{' '}
        above with your own wages and benefit type for a personalized estimate.
      </p>
    </section>
  )
}
