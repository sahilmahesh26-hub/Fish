'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Carousel.module.css'

/**
 * A scroll-snap carousel with arrows and dots.
 *
 * Every reference board uses this control, and the site had nothing like it:
 * content just stacked. That is a large part of why it read as static.
 *
 * Built on native scroll-snap rather than a transform-driven slider, which
 * buys a lot for free and is the reason it is about eighty lines instead of
 * a dependency:
 *
 *   - touch and trackpad swipe already work, with the platform's own physics
 *   - the track is a real scroll container, so keyboard and screen-reader
 *     users can reach every slide even if the arrows are never touched
 *   - no layout thrash, because nothing is being transformed on a timer
 *
 * The arrows and dots are progressive enhancement over that, not the
 * mechanism. If the JavaScript never arrives, the track is still a horizontally
 * scrollable list of everything.
 */
export const Carousel = ({
  children,
  label,
  className,
}: {
  children: React.ReactNode
  /** Names the region for assistive technology, e.g. "Sourcing categories". */
  label: string
  className?: string
}) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /* Measured from the DOM rather than from `children`, because a slide can be
     conditionally rendered and counting the prop would over-report. */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => setCount(track.children.length)
    update()
    const observer = new MutationObserver(update)
    observer.observe(track, { childList: true })
    return () => observer.disconnect()
  }, [])

  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const first = track.children[0] as HTMLElement | undefined
    if (!first) return
    /* Slide pitch includes the gap, so it is measured between two slides
       rather than assumed from the first one's width. */
    const second = track.children[1] as HTMLElement | undefined
    const pitch = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    setIndex(Math.round(track.scrollLeft / Math.max(pitch, 1)))
    setAtStart(track.scrollLeft < 8)
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8)
  }, [])

  useEffect(() => {
    onScroll()
  }, [onScroll, count])

  const go = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const first = track.children[0] as HTMLElement | undefined
    if (!first) return
    const second = track.children[1] as HTMLElement | undefined
    const pitch = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    track.scrollBy({ left: pitch * direction, behavior: 'smooth' })
  }

  const goTo = (target: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[target] as HTMLElement | undefined
    if (!slide) return
    track.scrollTo({
      left: slide.offsetLeft - (track.children[0] as HTMLElement).offsetLeft,
      behavior: 'smooth',
    })
  }

  return (
    <div className={[styles.carousel, className].filter(Boolean).join(' ')}>
      <ul
        ref={trackRef}
        className={styles.track}
        onScroll={onScroll}
        /* A labelled group, not a list of links: the label is what tells a
           screen-reader user what this shelf contains before they enter it. */
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </ul>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ol className={styles.dots}>
          {Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                className={styles.dot}
                data-active={i === index ? '' : undefined}
                onClick={() => goTo(i)}
                aria-label={`Go to item ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
