import type { ReactNode } from 'react'
import type { Page, SiteSetting } from '@/payload-types'
import { SectionIntro } from '@/components/sections/SectionIntro'
import { RichTextSection } from '@/components/sections/RichTextSection'
import { MediaCopySplit } from '@/components/sections/MediaCopySplit'
import { ProcessRoute } from '@/components/sections/ProcessRoute'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { SpecimenRecord } from '@/components/sections/SpecimenRecord'
import { DeliveryStories } from '@/components/sections/DeliveryStories'
import { AquariumFeature } from '@/components/sections/AquariumFeature'
import { ImageGallery } from '@/components/sections/ImageGallery'
import { VideoSection } from '@/components/sections/VideoSection'
import { TrustStatements } from '@/components/sections/TrustStatements'
import { FeaturedArticles } from '@/components/sections/FeaturedArticles'
import { Faqs } from '@/components/sections/Faqs'
import { Cta } from '@/components/sections/Cta'
import { Hero } from '@/components/sections/Hero'

type AnyBlock = NonNullable<Page['layout']>[number]

/**
 * Maps CMS blocks to components.
 *
 * Two rules keep this resilient to content changes:
 *  - a block flagged `hidden` renders nothing, so an editor can take a section
 *    off the page without losing its content;
 *  - an unrecognised `blockType` renders nothing rather than throwing, so a
 *    block removed from the code never breaks a published page.
 */
export const RenderBlocks = ({
  blocks,
  settings,
}: {
  blocks: AnyBlock[] | null | undefined
  settings: SiteSetting
}): ReactNode => {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        if ('hidden' in block && block.hidden) return null
        const key = block.id ?? `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} hero={block as never} settings={settings} />
          case 'sectionIntro':
            return <SectionIntro key={key} block={block} />
          case 'richText':
            return <RichTextSection key={key} block={block} />
          case 'mediaCopySplit':
            return <MediaCopySplit key={key} block={block} settings={settings} />
          case 'processRoute':
            return <ProcessRoute key={key} block={block} settings={settings} />
          case 'categoryGrid':
            return <CategoryGrid key={key} block={block} settings={settings} />
          case 'specimenRecord':
            return <SpecimenRecord key={key} block={block} />
          case 'deliveryStories':
            return <DeliveryStories key={key} block={block} settings={settings} />
          case 'aquariumFeature':
            return <AquariumFeature key={key} block={block} settings={settings} />
          case 'imageGallery':
            return <ImageGallery key={key} block={block} />
          case 'video':
            return <VideoSection key={key} block={block} />
          case 'trustStatements':
            return <TrustStatements key={key} block={block} />
          case 'featuredArticles':
            return <FeaturedArticles key={key} block={block} settings={settings} />
          case 'faqs':
            return <Faqs key={key} block={block} />
          case 'cta':
            return <Cta key={key} block={block} settings={settings} />
          default:
            return null
        }
      })}
    </>
  )
}
