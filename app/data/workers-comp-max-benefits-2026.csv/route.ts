// ─────────────────────────────────────────────────────────────────────────────
// app/data/workers-comp-max-benefits-2026.csv/route.ts
// Static CSV export of lib/data/wcMaxBenefits2026.json, generated at build time
// (force-static) so /workers-comp-maximum-weekly-benefits-by-state/ can offer
// a download link without a separate build script or paid tooling.
// ─────────────────────────────────────────────────────────────────────────────

import wcMaxBenefits from '@/lib/data/wcMaxBenefits2026.json'

export const dynamic = 'force-static'

// RFC 4180: wrap in quotes and escape embedded quotes whenever a field
// contains a comma, quote, or newline (several ttd_rate/notes values do).
function csvField(value: string | number | null): string {
  if (value === null) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const header = [
    'State',
    'Max Weekly TTD',
    'Min Weekly',
    'Rate',
    'Effective Period',
    'Status',
    'Basis',
    'Source URL',
  ]

  const rows = wcMaxBenefits.map((row) => [
    csvField(row.state),
    csvField(row.max_weekly),
    csvField(row.min_weekly),
    csvField(row.ttd_rate),
    csvField(row.effective_period),
    csvField(row.status),
    csvField(row.basis),
    csvField(row.source_url),
  ].join(','))

  const csv = [header.join(','), ...rows].join('\n') + '\n'

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="workers-comp-max-benefits-2026.csv"',
    },
  })
}
