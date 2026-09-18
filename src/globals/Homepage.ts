import type { GlobalConfig } from 'payload'
import { anyone, isStaff } from '@/access'
import { linkField } from '@/blocks/shared'
import {
  SectionIntroBlock,
  MediaCopySplitBlock,
  ProcessRouteBlock,
  CategoryGridBlock,
  SpecimenRecordBlock,
  DeliveryStoriesBlock,
  AquariumFeatureBlock,
  TrustStatementsBlock,
  FeaturedArticlesBlock,
  FaqsBlock,
  CtaBlock,
  RichTextBlock,
  ImageGalleryBlock,
  VideoBlock,
} from '@/blocks'
import { revalidateGlobal } from '@/hooks/revalidate'

/**
 * The homepage.
 *
 * The hero is a fixed group because its composition is art-directed and the
 * page must always open with it. Everything below the hero is a blocks list,
 * so an editor can reorder sections by dragging and hide any of them with the
 * block's own "Hide this section" switch — without a developer.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Content',
    description:
      'Edit every homepage section here. Drag sections to reorder them; each one can be hidden without deleting its content.',
  },
  access: { read: anyone, update: isStaff },
  versions: { drafts: { autosave: { interval: 800 } }, max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: false,
              fields: [
                { name: 'eyebrow', type: 'text' },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Wrap a word or phrase in *asterisks* to set it in Scarlet, e.g. Every Collector Is *Searching* for Something.',
                  },
                },
                { name: 'body', type: 'textarea' },
                { name: 'trustLine', type: 'text' },
                linkField('primaryCta', 'Primary CTA'),
                linkField('secondaryCta', 'Secondary CTA'),
                {
                  name: 'fishImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Transparent cutout of one fish (PNG or WebP). It overlaps the hero shapes and drifts gently. Replace this to change the hero artwork.',
                  },
                },
                {
                  name: 'annotation',
                  type: 'text',
                  maxLength: 80,
                  admin: { description: 'Small annotation printed beside the artwork.' },
                },
                {
                  name: 'scrollHint',
                  type: 'text',
                  defaultValue: 'Scroll to see how it works',
                  maxLength: 60,
                },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              label: false,
              blocks: [
                SectionIntroBlock,
                ProcessRouteBlock,
                CategoryGridBlock,
                SpecimenRecordBlock,
                TrustStatementsBlock,
                DeliveryStoriesBlock,
                AquariumFeatureBlock,
                FeaturedArticlesBlock,
                FaqsBlock,
                MediaCopySplitBlock,
                RichTextBlock,
                ImageGalleryBlock,
                VideoBlock,
                CtaBlock,
              ],
              admin: {
                description:
                  'The homepage body. Drag to reorder, use "Hide this section" to take one off the page, and click Add to bring in a new section.',
              },
            },
          ],
        },
      ],
    },
  ],
}
