// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx — white footer with calculators, a state-guides
// band listing EVERY published state per tool (components/ui/StateList.tsx —
// no truncated "by state" column), and every trust page (methodology,
// editorial policy, about, contact, privacy, terms). Server component.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { BrandWordmark } from '@/components/ui/Brand'
import { StateChips, StateCountBadge, getToolStates, getToolMeta, type StateListTool } from '@/components/ui/StateList'

const FOOTER_STATE_TOOLS: StateListTool[] = ['pain-suffering', 'car-accident', 'workers-comp']

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer mt-auto">
      <div className="container-page py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="inline-flex w-fit rounded-md" aria-label="Settlebrook home">
              <BrandWordmark size={30} />
            </Link>
            <p className="leading-relaxed max-w-sm" style={{ color: 'var(--ink-2)', fontSize: 'var(--label)' }}>
              Free settlement calculators for people with injury claims in the United States.
              Open formulas, official sources, no signup.
            </p>
            <p className="calc-privacy" style={{ fontSize: 'var(--small)' }}>
              <Lock aria-hidden="true" size={15} strokeWidth={2.2} />
              Your calculator inputs stay in your browser.
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Calculators</h2>
            <ul className="flex flex-col">
              <li><Link href="/pain-and-suffering-calculator/" className="footer-link">Pain &amp; Suffering</Link></li>
              <li><Link href="/car-accident-settlement-calculator/" className="footer-link">Car Accident Settlement</Link></li>
              <li><Link href="/workers-comp-settlement-calculator/" className="footer-link">Workers Comp Settlement</Link></li>
              <li><Link href="/workers-comp-maximum-weekly-benefits-by-state/" className="footer-link">Max Weekly Benefits by State</Link></li>
              <li><Link href="/pain-and-suffering-calculator/guide/" className="footer-link">How Pain &amp; Suffering Is Calculated</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="footer-heading">Settlebrook</h2>
            <ul className="flex flex-col">
              <li><Link href="/methodology/" className="footer-link">Methodology</Link></li>
              <li><Link href="/editorial-policy/" className="footer-link">Editorial Policy</Link></li>
              <li><Link href="/about/" className="footer-link">About</Link></li>
              <li><Link href="/blog/" className="footer-link">Guides</Link></li>
              <li><Link href="/contact/" className="footer-link">Contact</Link></li>
              <li><Link href="/privacy-policy/" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use/" className="footer-link">Terms of Use</Link></li>
            </ul>
          </div>

        </div>

        {/* State guides — every published state page, per tool */}
        <nav className="footer-states" aria-label="State guides">
          <h2 className="footer-heading">State guides</h2>
          <div className="footer-states-groups">
            {FOOTER_STATE_TOOLS.map((tool) => {
              const meta = getToolMeta(tool)
              const count = getToolStates(tool).length
              return (
                <div key={tool} className="footer-states-group">
                  <p className="flex items-center gap-2 mb-1 font-semibold" style={{ color: 'var(--ink)', fontSize: 'var(--label)' }}>
                    <Link href={meta.hub} className="footer-link" style={{ padding: 0 }}>{meta.short}</Link>
                    <StateCountBadge count={count} />
                  </p>
                  <StateChips tool={tool} variant="inline" ariaLabel={`${meta.label} state pages`} />
                </div>
              )
            })}
          </div>
        </nav>

        {/* Disclaimer */}
        <div className="pt-6" style={{ borderTop: '1px solid var(--line)' }}>
          <p className="leading-relaxed max-w-3xl" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>
            <span className="font-semibold" style={{ color: 'var(--ink-2)' }}>Disclaimer: </span>
            The calculators and information on Settlebrook are for informational purposes only and
            do not constitute legal advice. Results are estimates based on common formulas — actual
            settlement values depend on the specific facts of your case, applicable state law,
            insurance coverage, and other factors. No attorney-client relationship is created by
            using this site. Always consult a licensed personal injury attorney in your state.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" style={{ color: 'var(--ink-3)', fontSize: 'var(--small)' }}>
          <p>© {currentYear} Settlebrook. All rights reserved.</p>
          <p>
            This site may display advertisements.{' '}
            <Link href="/privacy-policy/" className="underline">Privacy Policy</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}
