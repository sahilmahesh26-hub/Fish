'use client'

import { useEffect } from 'react'
import { trackEvent, ANALYTICS_EVENTS, type AnalyticsEvent } from '@/lib/analytics'

/**
 * One delegated listener for CTA and WhatsApp clicks.
 *
 * Reads only the `data-event` attribute that our own components set — it never
 * reads form fields, input values or link query strings, so no personal data
 * can reach an analytics provider through this path.
 */
export const AnalyticsClicks = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-event]')
      const name = target?.dataset.event
      if (!name) return

      const isWhatsApp = name.includes('whatsapp')
      const mapped: AnalyticsEvent = isWhatsApp
        ? ANALYTICS_EVENTS.whatsapp
        : ANALYTICS_EVENTS.primaryCta

      trackEvent(mapped, { label: name })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
