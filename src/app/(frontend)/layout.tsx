import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { bricolage, manrope } from '@/lib/fonts'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'
import { JsonLd } from '@/components/ui/JsonLd'
import { Analytics } from '@/components/layout/Analytics'
import { MotionFlag } from '@/components/layout/MotionFlag'
import { getSiteSettings } from '@/lib/queries'
import { organisationSchema, websiteSchema } from '@/lib/schema'
import { titleTemplateFor } from '@/lib/seo'
import { siteUrl } from '@/lib/env'
import { asMedia, mediaSrc } from '@/lib/media'
import '@/styles/global.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  const faviconUrl = mediaSrc(asMedia(settings.favicon)?.url)

  return {
    metadataBase: new URL(siteUrl()),
    title: titleTemplateFor(settings),
    description:
      settings.defaultSeo?.description ??
      settings.shortDescription ??
      settings.tagline ??
      undefined,
    applicationName: settings.brandName ?? 'Finquiry',
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    openGraph: {
      type: 'website',
      siteName: settings.brandName ?? 'Finquiry',
      locale: 'en_IN',
    },
    formatDetection: { telephone: false },
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

        <a className="u-skip-link" href="#main-content">
          Skip to content
        </a>

        <SiteHeader />

        <main id="main-content">{children}</main>

        <SiteFooter />

        <JsonLd data={organisationSchema(settings)} />
        <JsonLd data={websiteSchema(settings)} />
        <Analytics settings={settings} />
      </body>
    </html>
  )
}

export default RootLayout
