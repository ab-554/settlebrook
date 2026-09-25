// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics.ts
// Thin wrapper over the GA4 dataLayer installed by @next/third-parties'
// <GoogleAnalytics> in app/layout.tsx. Every event here carries only a tool
// id, a page path, and a card id — never a dollar amount, never an input
// value, never anything a user typed. These events exist to measure whether
// the design refresh moves calculator completions and pages-per-visit.
//
// Events:
//   calculator_start     first input on a calculator (once per page load)
//   calculator_complete  first result rendered (once per page load)
//   next_step_click      a next-step card was clicked ({ card_id })
//   result_copy          "Copy result" used
//   result_print         "Print" used
// ─────────────────────────────────────────────────────────────────────────────

export type ToolId = 'pain-suffering' | 'car-accident' | 'workers-comp'

type EventName =
  | 'calculator_start'
  | 'calculator_complete'
  | 'next_step_click'
  | 'result_copy'
  | 'result_print'

interface EventParams {
  tool?: ToolId
  card_id?: string
  state?: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: EventName, params: EventParams = {}): void {
  if (typeof window === 'undefined') return
  const payload = { ...params, page_path: window.location.pathname }
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, payload)
    } else if (Array.isArray(window.dataLayer)) {
      // gtag.js has not initialised yet (or is blocked) — queue on the
      // dataLayer in the same shape gtag() pushes.
      window.dataLayer.push({ event: name, ...payload })
    }
  } catch {
    // Analytics must never break the calculator.
  }
}
