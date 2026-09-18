import type { Metadata } from 'next'
import { getHomepage, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { stripEmphasis } from '@/lib/emphasis'
import { Hero } from '@/components/sections/Hero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'

export const generateMetadata = async (): Promise<Metadata> => {
  const [homepage, settings] = await Promise.all([getHomepage(), getSiteSettings()])
  return buildMetadata({
    meta: homepage.meta,
    title: stripEmphasis(homepage.hero?.headline) || settings.brandName,
    description: homepage.hero?.body,
    path: '/',
    settings,
  })
}

const HomePage = async () => {
  const [homepage, settings] = await Promise.all([getHomepage(), getSiteSettings()])

  return (
    <>
      <Hero hero={homepage.hero} settings={settings} />
      {/* Anchor target for the hero's scroll indicator. */}
      <div id="main-content-start" />
      <RenderBlocks blocks={homepage.sections as never} settings={settings} />
    </>
  )
}

export default HomePage
