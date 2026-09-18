'use client'

import { useEffect } from 'react'
import { trackEvent, ANALYTICS_EVENTS, type AnalyticsEvent } from '@/lib/analytics'

const KNOWN_EVENTS = new Set<string>(Object.values(ANALYTICS_EVENTS))

/** Which `data-event` markers are the Custom Aquariums call to action. */
const AQUARIUM_MARKERS = ['aquarium_cta', 'custom_aquarium']

/**
 * Maps a `data-event` marker to one of the agreed event names.
 *
 * A marker that is already an agreed name is used as it stands, so a component
 * can name its own event. Everything else is classified by what it is: a
 * WhatsApp handover, the Custom Aquariums call to action, or a start-the-search
 * call to action. Falling through to `start_search_click` for everything — as
 * this once did — quietly merged the aquarium CTA into the search CTA and left
 * `custom_aquarium_cta_clicked` never firing at all.
 */
const eventFor = (name: string): AnalyticsEvent => {
  if (KNOWN_EVENTS.has(name)) return name as AnalyticsEvent
  if (name.includes('whatsapp')) return ANALYTICS_EVENTS.whatsapp
  if (AQUARIUM_MARKERS.some((marker) => name.includes(marker))) {
    return ANALYTICS_EVENTS.customAquariumCta
  }
  return ANALYTICS_EVENTS.primaryCta
}

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

      trackEvent(eventFor(name), { label: name })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
