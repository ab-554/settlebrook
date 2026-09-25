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
      <h2 id="worked-example-heading" className="heading-serif h2-editorial">
        Example: How an Estimate Works in {stateName}
      </h2>
      <p>
        There is no reliable published average for workers comp settlements —
        real outcomes vary too much by wages, injury type, and how a claim is
        resolved to reduce to a single number. Instead, here is a worked
        example using this page&apos;s own calculator with clearly labeled
        hypothetical inputs, so you can see exactly how the math works before
        running your own figures.
      </p>
      <div className="card-flat" style={{ padding: '18px 20px', marginBottom: 20 }}>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 0 }}>
          <li className="breakdown-row"><span className="label">Hypothetical Average Weekly Wage</span><span className="value">{formatCurrency(EXAMPLE_AWW)}/wk</span></li>
          <li className="breakdown-row"><span className="label">Benefit type</span><span className="value">Temporary Total Disability (TTD)</span></li>
          <li className="breakdown-row"><span className="label">Hypothetical treatment period</span><span className="value">{EXAMPLE_TREATMENT_WEEKS} weeks</span></li>
          <li className="breakdown-row"><span className="label">Weekly benefit ({stateName}&apos;s rate, capped at the state max)</span><span className="value">{formatCurrency(result.weeklyBenefit)}/wk</span></li>
          <li className="breakdown-row is-total"><span className="label">Base estimate ({EXAMPLE_TREATMENT_WEEKS} wks × weekly benefit)</span><span className="value" style={{ color: 'var(--accent)' }}>{formatCurrency(result.baseSettlement)}</span></li>
        </ul>
      </div>
      <p>
        These figures are illustrative only, not a prediction of your claim
        value. Use the{' '}
        <Link href={calculatorHref}>
          {stateName} workers comp settlement calculator
        </Link>{' '}
        above with your own wages and benefit type for a personalized estimate.
      </p>
    </section>
  )
}
