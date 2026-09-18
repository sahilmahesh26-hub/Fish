import Script from 'next/script'
import type { SiteSetting } from '@/payload-types'
import { AnalyticsClicks } from './AnalyticsClicks'

/**
 * Loads the configured analytics provider, if there is one.
 *
 * Environment variables win over Site Settings so a staging deployment can
 * disable analytics without an editor having to change content. When nothing is
 * configured — the default — no third-party script is loaded at all.
 */
export const Analytics = ({ settings }: { settings: SiteSetting }) => {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? settings.analytics?.provider
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID ?? settings.analytics?.measurementId
  const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? settings.analytics?.scriptUrl

  if (!provider || provider === 'none' || !id) return null

  return (
    <>
      {provider === 'plausible' ? (
        <Script
          defer
          data-domain={id}
          src={scriptUrl ?? 'https://plausible.io/js/script.js'}
          strategy="afterInteractive"
        />
      ) : null}

      {provider === 'umami' ? (
        <Script
          defer
          data-website-id={id}
          src={scriptUrl ?? 'https://analytics.umami.is/script.js'}
          strategy="afterInteractive"
        />
      ) : null}

      {provider === 'ga4' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      <AnalyticsClicks />
    </>
  )
}
