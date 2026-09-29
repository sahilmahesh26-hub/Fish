'use client'

import { useEffect, useRef } from 'react'
import styles from './Reveal.module.css'

/**
 * Reveals its children once, when they first come into view.
 *
 * Two rules keep this from becoming the fade-in-on-everything effect that
 * makes a site feel like a template:
 *
 *   1. It fires ONCE and then stops observing. Content that re-animates every
 *      time it scrolls back into view is the single most distracting pattern
 *      on the web, and it makes a page feel unfinished rather than alive.
 *
 *   2. The movement is small: 14px and a short fade. The point is to draw the
 *      eye down the page in the order the content should be read, not to
 *      perform. Anything larger becomes the subject instead of the content.
 *
 * Content is visible from the first paint and is only *then* hidden by the
 * observer, so if JavaScript never runs nothing is ever invisible. That
 * ordering matters: the naive version hides everything in CSS and reveals it
 * with JS, which means a failed script leaves a blank page.
 */
export const Reveal = ({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
}: {
  children: React.ReactNode
  as?: 'div' | 'li' | 'section' | 'article'
  /** Stagger, in ms. Used to walk a group in rather than pop it all at once. */
  delay?: number
  className?: string
}) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    /*
     * The state lives on the element, not in React.
     *
     * An earlier version held it in `useState`, which meant every revealed
     * element scheduled a render on scroll and tripped
     * `react-hooks/set-state-in-effect` for the already-in-view case. Nothing
     * outside this component ever reads the value, and the only consumer is a
     * CSS attribute selector, so writing the attribute directly is both
     * correct and considerably cheaper: a hundred of these cost zero renders.
     */
    const show = () => {
      element.dataset.state = 'shown'
    }

    /* With reduced motion there is no reason to run an observer at all. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show()
      return
    }

    /* Already in view on load, for example the first screen: show it without
       animating, because an element that animates in before the visitor has
       scrolled reads as a loading state. */
    if (element.getBoundingClientRect().top < window.innerHeight * 0.85) {
      show()
      return
    }

    element.dataset.state = 'armed'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        show()
        observer.disconnect()
      },
      /* Fires a little before the element reaches the fold, so the movement
         has finished by the time it is properly in view. */
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={[styles.reveal, className].filter(Boolean).join(' ')}
      data-state="idle"
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as never) : undefined}
    >
      {children}
    </Tag>
  )
}
