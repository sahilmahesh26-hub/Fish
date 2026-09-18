/**
 * Provider-agnostic analytics event names.
 *
 * Only these events are ever sent, and each one carries at most a page path and
 * a label already present in the UI. Names, phone numbers, email addresses,
 * budgets, uploaded references and requirement text are never included — see
 * `trackEvent` below, which accepts no free-form payload by design.
 */
export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  primaryCta: 'start_search_click',
  whatsapp: 'whatsapp_click',
  enquiryStarted: 'enquiry_form_started',
  enquiryStepCompleted: 'enquiry_step_completed',
  enquirySubmitted: 'enquiry_submitted',
  requestConfirmationViewed: 'request_confirmation_viewed',
  articleViewed: 'article_viewed',
  deliveryViewed: 'delivery_story_viewed',
  customAquariumCta: 'custom_aquarium_cta_clicked',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

/** The only metadata an event may carry. Deliberately not `Record<string, unknown>`. */
export type AnalyticsProps = {
  /** A step number, never its contents. */
  step?: number
  /** A slug or CTA identifier already public in the URL or markup. */
  label?: string
}

type Queue = { event: AnalyticsEvent; props?: AnalyticsProps }[]

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void
    umami?: { track: (event: string, data?: AnalyticsProps) => void }
    gtag?: (command: string, event: string, params?: AnalyticsProps) => void
    __finquiryAnalyticsQueue?: Queue
  }
}

/**
 * Master switch, driven by cookie consent.
 *
 * Starts false. `trackEvent` is a no-op until the Analytics component confirms
 * a provider is configured, the visitor consented, and this is production — so
 * a stray call cannot fire before or after permission.
 */
let enabled = false

export const setAnalyticsEnabled = (value: boolean): void => {
  enabled = value
}

/**
 * Sends an event to whichever provider is configured.
 *
 * No-ops silently when analytics is switched off, which is the default.
 */
export const trackEvent = (event: AnalyticsEvent, props?: AnalyticsProps): void => {
  if (typeof window === 'undefined') return
  if (!enabled) return

  if (typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined)
    return
  }
  if (window.umami?.track) {
    window.umami.track(event, props)
    return
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, props)
  }
}
