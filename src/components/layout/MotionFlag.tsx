'use client'

import { useEffect } from 'react'

/**
 * Opts the document into scroll-reveal animation.
 *
 * The CSS hides `[data-reveal]` elements only under `html[data-motion="on"]`,
 * which this component sets after confirming the visitor has not asked for
 * reduced motion. If JavaScript never runs, the flag is never set and every
 * revealed element stays visible — the page is complete either way.
 */
export const MotionFlag = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement

    const apply = () => {
      if (reducedMotion.matches) {
        root.removeAttribute('data-motion')
        // Anything already hidden must be shown again immediately.
        document
          .querySelectorAll('[data-reveal]')
          .forEach((element) => element.setAttribute('data-revealed', ''))
        return
      }
      root.setAttribute('data-motion', 'on')
    }

    apply()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))

    reducedMotion.addEventListener('change', apply)

    return () => {
      observer.disconnect()
      reducedMotion.removeEventListener('change', apply)
    }
  }, [])

  return null
}
