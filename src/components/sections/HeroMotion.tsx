'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * Pointer parallax for the hero artwork.
 *
 * Deliberately conservative:
 *  - only runs for a fine pointer (mouse/trackpad), never on touch;
 *  - never runs when the visitor prefers reduced motion;
 *  - writes two CSS custom properties inside a rAF, so the browser composites
 *    transforms instead of re-laying out;
 *  - if this component never mounts, the hero is already complete — the server
 *    markup is the real composition, not a placeholder.
 */
export const HeroMotion = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let frame = 0
    let active = false

    const onPointerMove = (event: PointerEvent) => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const rect = element.getBoundingClientRect()
        // Normalised to -1..1 around the centre of the hero frame.
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        element.style.setProperty('--pointer-x', x.toFixed(4))
        element.style.setProperty('--pointer-y', y.toFixed(4))
      })
    }

    const reset = () => {
      element.style.setProperty('--pointer-x', '0')
      element.style.setProperty('--pointer-y', '0')
    }

    const enable = () => {
      if (active) return
      active = true
      element.dataset.parallaxActive = 'true'
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      element.addEventListener('pointerleave', reset)
    }

    const disable = () => {
      if (!active) return
      active = false
      delete element.dataset.parallaxActive
      window.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', reset)
      reset()
    }

    const sync = () => {
      if (finePointer.matches && !reducedMotion.matches) enable()
      else disable()
    }

    sync()
    finePointer.addEventListener('change', sync)
    reducedMotion.addEventListener('change', sync)

    return () => {
      finePointer.removeEventListener('change', sync)
      reducedMotion.removeEventListener('change', sync)
      disable()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className={className} data-hero-frame>
      {children}
    </div>
  )
}
