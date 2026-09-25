'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/BackToCalculator.tsx
// Sticky "Back to calculator" pill that appears once the calculator panel has
// scrolled off the top of the viewport. Fixed top-right under the header so it
// cannot collide with an AdSense anchor ad at the bottom of the screen.
// One passive scroll listener, throttled with rAF; no layout thrash.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'

export default function BackToCalculator({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const check = () => {
      ticking = false
      const el = document.getElementById(targetId)
      if (!el) return
      const rect = el.getBoundingClientRect()
      setVisible(rect.bottom < 0)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(check)
      }
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    <a
      href={`#${targetId}`}
      className={`back-to-calc no-print ${visible ? 'is-visible' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5m-7 7 7-7 7 7" />
      </svg>
      Back to calculator
    </a>
  )
}
