import type { Metadata, Viewport } from 'next'
import { Suspense, type ReactNode } from 'react'
import { bricolage, manrope } from '@/lib/fonts'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'
import { JsonLd } from '@/components/ui/JsonLd'
import { Analytics } from '@/components/layout/Analytics'
import { ConsentProvider } from '@/components/consent/ConsentProvider'
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { MotionFlag } from '@/components/layout/MotionFlag'
import { getSiteSettings } from '@/lib/queries'
import { organisationSchema, websiteSchema } from '@/lib/schema'
import { titleTemplateFor } from '@/lib/seo'
import { siteUrl } from '@/lib/env'
import '@/styles/global.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()

  /*
   * Icons are intentionally NOT read from the CMS.
   *
   * They come from the Next.js metadata file conventions in `src/app`
   * (favicon.ico, icon.svg, icon.png, apple-icon.png) plus `manifest.ts`. A
   * CMS-uploaded favicon goes through the media pipeline, which re-encodes to
   * WebP and serves from an absolute URL — the wrong MIME type for a favicon
   * and a source of 404s across environments. Regenerate the set by replacing
   * `assets/brand/icon.svg` and running `node scripts/generate-icons.mjs`.
   */
  return {
    metadataBase: new URL(siteUrl()),
    title: titleTemplateFor(settings),
    description:
      settings.defaultSeo?.description ??
      settings.shortDescription ??
      settings.tagline ??
      undefined,
    applicationName: settings.brandName ?? 'Finquiry',
    openGraph: {
      type: 'website',
      siteName: settings.brandName ?? 'Finquiry',
      locale: 'en_IN',
    },
    formatDetection: { telephone: false },
    // Feed autodiscovery, so a reader finds it from any page.
    alternates: {
      types: { 'application/rss+xml': [{ url: '/rss.xml', title: `${settings.brandName ?? 'Finquiry'} — Knowledge Hub` }] },
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F5F0E8',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const settings = await getSiteSettings()

  return (
    <html lang="en-IN" className={`${bricolage.variable} ${manrope.variable}`}>
      <body>
        {/* Sets html[data-motion="on"] only when animation is actually wanted,
            so reveal animations never hide content from a visitor without JS. */}
        <MotionFlag />

        {/* Wraps everything: the footer's "Cookie preferences" link and the
            banner both read the same consent state. */}
        <ConsentProvider>
          <a className="u-skip-link" href="#main-content">
            Skip to content
          </a>

          <SiteHeader />

          <main id="main-content">{children}</main>

          <SiteFooter />

          <ConsentBanner />

          {/*
            Analytics configuration is resolved on the server and passed down as
            plain values. Environment variables win over Site Settings so a
            staging deployment can switch analytics off without a content edit.
          */}
          <Suspense fallback={null}>
            <Analytics
              provider={process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? settings.analytics?.provider}
              measurementId={
                process.env.NEXT_PUBLIC_ANALYTICS_ID ?? settings.analytics?.measurementId
              }
              scriptUrl={
                process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? settings.analytics?.scriptUrl
              }
            />
          </Suspense>
        </ConsentProvider>

        <JsonLd data={organisationSchema(settings)} />
        <JsonLd data={websiteSchema(settings)} />
      </body>
    </html>
  )
}

export default RootLayout
