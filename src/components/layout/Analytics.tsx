'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useConsent } from '@/components/consent/ConsentProvider'
import { ANALYTICS_EVENTS, setAnalyticsEnabled, trackEvent } from '@/lib/analytics'
import { AnalyticsClicks } from './AnalyticsClicks'

type Props = {
  provider?: string | null
  measurementId?: string | null
  scriptUrl?: string | null
}

/**
 * Loads the configured analytics provider — but only after consent.
 *
 * The gate is structural, not a runtime flag: with no consent the `<Script>`
 * is never rendered, so no third-party request is made at all. Withdrawing
 * consent unmounts it, and `setAnalyticsEnabled(false)` stops any queued event
 * from firing.
 *
 * Nothing is loaded in development either, so local traffic never reaches a
 * production property.
 */
export const Analytics = ({ provider, measurementId, scriptUrl }: Props) => {
  const { consent } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isProduction = process.env.NODE_ENV === 'production'
  const configured = Boolean(provider && provider !== 'none' && measurementId)
  const allowed = Boolean(consent?.analytics) && configured && isProduction

  // Keep the event helper in step, so a queued call cannot fire after refusal.
  useEffect(() => {
    setAnalyticsEnabled(allowed)
  }, [allowed])

  /*
   * Client-side navigation does not reload the page, so each provider's own
   * automatic page view fires once and then never again. This sends one per
   * route change — including the query string, which distinguishes the
   * filtered listing views.
   */
  useEffect(() => {
    if (!allowed) return
    const query = searchParams.toString()
    trackEvent(ANALYTICS_EVENTS.pageView, { label: query ? `${pathname}?${query}` : pathname })
  }, [allowed, pathname, searchParams])

  if (!allowed) return null

  return (
    <>
      {provider === 'plausible' ? (
        <Script
          defer
          data-domain={measurementId as string}
          src={scriptUrl ?? 'https://plausible.io/js/script.js'}
          strategy="afterInteractive"
        />
      ) : null}

      {provider === 'umami' ? (
        <Script
          defer
          data-website-id={measurementId as string}
          src={scriptUrl ?? 'https://analytics.umami.is/script.js'}
          strategy="afterInteractive"
        />
      ) : null}

      {provider === 'ga4' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true,send_page_view:false});`}
          </Script>
        </>
      ) : null}

      <AnalyticsClicks />
    </>
  )
}
