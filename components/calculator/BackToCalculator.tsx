'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/BackToCalculator.tsx
// "Back to calculator" pill that appears once the calculator panel has
// scrolled off the top of the viewport. Design v2: the pill is position:sticky
// inside the editorial container (never position:fixed), so it scrolls with
// the article and cannot be covered by, or cover, an AdSense anchor ad. It is
// hidden ≥1200px where the sticky table of contents carries the same link.
// One passive scroll listener, throttled with rAF; no layout thrash.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

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
    <div className={`back-to-calc no-print ${visible ? 'is-visible' : ''}`}>
      <a href={`#${targetId}`} aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
        <ArrowUp aria-hidden="true" size={16} strokeWidth={2.4} />
        Back to calculator
      </a>
    </div>
  )
}
