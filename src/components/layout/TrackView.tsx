'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, type AnalyticsEvent, type AnalyticsProps } from '@/lib/analytics'

type Props = {
  event: AnalyticsEvent
  /** A slug or other identifier already public in the URL. Never page content. */
  label?: string
}

/**
 * Records that a page was viewed, exactly once per mount.
 *
 * The ref guard matters in development, where React's strict mode runs effects
 * twice — without it every view would be double counted locally and the numbers
 * would disagree with production for no visible reason.
 *
 * `trackEvent` is already a no-op until consent is granted, so mounting this is
 * safe regardless of what the visitor has chosen.
 */
export const TrackView = ({ event, label }: Props) => {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    const props: AnalyticsProps | undefined = label ? { label } : undefined
    trackEvent(event, props)
  }, [event, label])

  return null
}
