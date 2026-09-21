import type { Block } from 'payload'
import { backgroundField, linkField, visibilityField } from './shared'

/* ==========================================================================
   Layout blocks
   --------------------------------------------------------------------------
   A controlled set — not an open page builder. Each block has validation,
   an admin description and a preview label so a non-technical editor can see
   what they are adding before they add it.
   ========================================================================== */

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  admin: { group: 'Page openers' },
  fields: [
    visibilityField(),
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the headline.' } },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: { description: 'Use "*" around a word or phrase to emphasise it in Scarlet.' },
    },
    { name: 'body', type: 'textarea', admin: { description: 'Two or three sentences at most.' } },
    {
      name: 'trustLine',
      type: 'text',
      admin: { description: 'Short reassurance under the CTAs.' },
    },
    linkField('primaryCta', 'Primary CTA'),
    linkField('secondaryCta', 'Secondary CTA'),
    {
      name: 'fishImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Transparent PNG/WebP cutout of a single fish. Shown overlapping the hero shapes.',
      },
    },
    {
      name: 'annotation',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Small hand-note style annotation beside the artwork.' },
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich Text', plural: 'Rich Text blocks' },
  admin: { group: 'Content' },
  fields: [
    visibilityField(),
    backgroundField(),
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (reading width)', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
      ],
    },
    { name: 'content', type: 'richText', required: true },
  ],
}

export const SectionIntroBlock: Block = {
  slug: 'sectionIntro',
  interfaceName: 'SectionIntroBlock',
  labels: { singular: 'Section Intro', plural: 'Section Intros' },
  admin: { group: 'Content' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'start',
      options: [
        { label: 'Left', value: 'start' },
        { label: 'Centred', value: 'center' },
      ],
    },
  ],
}

export const MediaCopySplitBlock: Block = {
  slug: 'mediaCopySplit',
  interfaceName: 'MediaCopySplitBlock',
  labels: { singular: 'Media and Copy Split', plural: 'Media and Copy Splits' },
  admin: { group: 'Content' },
  fields: [
    visibilityField(),
    backgroundField(),
    {
      name: 'mediaPosition',
      type: 'radio',
      defaultValue: 'end',
      options: [
        { label: 'Media on the left', value: 'start' },
        { label: 'Media on the right', value: 'end' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'mediaShape',
      type: 'select',
      defaultValue: 'pool',
      options: [
        { label: 'Organic pool mask', value: 'pool' },
        { label: 'Oval', value: 'oval' },
        { label: 'Soft rectangle', value: 'rect' },
      ],
    },
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'content', type: 'richText' },
    linkField('cta', 'Call to action'),
  ],
}

export const ProcessRouteBlock: Block = {
  slug: 'processRoute',
  interfaceName: 'ProcessRouteBlock',
  labels: { singular: 'Process Route', plural: 'Process Routes' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description:
          'Numbered steps connected by a current line. Alternates on desktop and stacks into a vertical route on mobile.',
      },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      required: true,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        description: 'Between two and eight steps. The numbering is generated automatically.',
        components: {},
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'copy', type: 'textarea', required: true },
      ],
    },
    linkField('cta', 'Call to action'),
  ],
}

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: { singular: 'Category Grid', plural: 'Category Grids' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description:
          'Editorial grid of sourcing categories with varied card sizes and controlled overlaps.',
      },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'all',
      options: [
        { label: 'All active categories', value: 'all' },
        { label: 'Hand-picked selection', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'sourcing-categories',
      hasMany: true,
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'selected',
        description: 'Order here controls the order on the page.',
      },
    },
    linkField('cta', 'Call to action'),
  ],
}

export const SpecimenRecordBlock: Block = {
  slug: 'specimenRecord',
  interfaceName: 'SpecimenRecordBlock',
  labels: { singular: 'Specimen Record', plural: 'Specimen Records' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField('linen-raised'),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description:
          "A collector's specimen sheet. Leave media blank to show a labelled placeholder rather than an invented specimen.",
      },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'Small caveat printed under the record.' },
    },
    { name: 'mainImage', type: 'upload', relationTo: 'media' },
    {
      name: 'detailImages',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Detail crop', plural: 'Detail crops' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'record',
      type: 'group',
      label: 'Record fields',
      admin: { description: 'Leave a field blank to omit that row. Never enter invented details.' },
      fields: [
        { name: 'requestId', type: 'text', label: 'Request ID stamp' },
        { name: 'measurement', type: 'text', label: 'Approximate measurement' },
        { name: 'origin', type: 'text' },
        {
          name: 'mediaStatus',
          type: 'select',
          options: [
            { label: 'Photos and video confirmed', value: 'confirmed' },
            { label: 'Photos confirmed, video pending', value: 'partial' },
            { label: 'Awaiting media', value: 'pending' },
          ],
        },
        { name: 'notes', type: 'textarea' },
      ],
    },
  ],
}

export const DeliveryStoriesBlock: Block = {
  slug: 'deliveryStories',
  interfaceName: 'DeliveryStoriesBlock',
  labels: { singular: 'Delivery Stories', plural: 'Delivery Stories blocks' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description:
          'Published delivery records as sourcing postcards. Shows the empty state below until real records are published.',
      },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'featured',
      options: [
        { label: 'Featured records, newest first', value: 'featured' },
        { label: 'Hand-picked selection', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'deliveries',
      type: 'relationship',
      relationTo: 'deliveries',
      hasMany: true,
      admin: { condition: (_data, siblingData) => siblingData?.mode === 'selected' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: { condition: (_data, siblingData) => siblingData?.mode === 'featured' },
    },
    {
      name: 'emptyState',
      type: 'group',
      label: 'Empty state',
      admin: { description: 'Shown when no delivery record is published yet.' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          name: 'behaviour',
          type: 'radio',
          defaultValue: 'show',
          options: [
            { label: 'Show the empty state', value: 'show' },
            { label: 'Hide the whole section', value: 'hide' },
          ],
        },
      ],
    },
    linkField('cta', 'Call to action'),
  ],
}

export const AquariumFeatureBlock: Block = {
  slug: 'aquariumFeature',
  interfaceName: 'AquariumFeatureBlock',
  labels: { singular: 'Aquarium Feature', plural: 'Aquarium Features' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'mainImage', type: 'upload', relationTo: 'media' },
    {
      name: 'detailImages',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Detail crop', plural: 'Detail crops' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'services',
      type: 'array',
      maxRows: 10,
      labels: { singular: 'Service', plural: 'Services' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    linkField('cta', 'Call to action'),
  ],
}

export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
  admin: { group: 'Media' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'heading', type: 'text' },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      maxRows: 24,
      required: true,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Videos' },
  admin: { group: 'Media' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'heading', type: 'text' },
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'upload',
      options: [
        { label: 'Uploaded file', value: 'upload' },
        { label: 'External URL', value: 'external' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_d, s) => s?.source === 'upload' },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_d, s) => s?.source === 'external',
        description: 'YouTube or Vimeo watch/embed URL.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Required for uploaded video so the player never loads blank.' },
    },
    {
      name: 'captionsTrack',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'WebVTT captions file. Required for video that carries meaning.' },
    },
    {
      name: 'transcript',
      type: 'richText',
      admin: { description: 'Text alternative for the video.' },
    },
  ],
}

export const TrustStatementsBlock: Block = {
  slug: 'trustStatements',
  interfaceName: 'TrustStatementsBlock',
  labels: { singular: 'Trust Statements', plural: 'Trust Statement blocks' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField('navy'),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Three strong editorial ideas plus smaller proof points.' },
    },
    {
      name: 'statements',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      required: true,
      labels: { singular: 'Statement', plural: 'Statements' },
      admin: { description: 'Three reads best. More than four weakens the hierarchy.' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'copy', type: 'textarea', required: true },
      ],
    },
    {
      name: 'proofPoints',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Proof point', plural: 'Proof points' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
}

export const FeaturedArticlesBlock: Block = {
  slug: 'featuredArticles',
  interfaceName: 'FeaturedArticlesBlock',
  labels: { singular: 'Featured Articles', plural: 'Featured Article blocks' },
  admin: { group: 'Signature sections' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Magazine shelf: one lead article plus supporting ones.' },
    },
    { name: 'body', type: 'textarea' },
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'latest',
      options: [
        { label: 'Latest published articles', value: 'latest' },
        { label: 'Hand-picked selection', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (_d, s) => s?.mode === 'selected' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 9,
      admin: { condition: (_d, s) => s?.mode === 'latest' },
    },
    {
      name: 'emptyState',
      type: 'group',
      label: 'Empty state',
      admin: {
        description:
          'Shown while no article is published yet, for example on a new site where every article is still a draft.',
      },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          name: 'behaviour',
          type: 'radio',
          defaultValue: 'show',
          options: [
            { label: 'Show the empty state', value: 'show' },
            { label: 'Hide the whole section', value: 'hide' },
          ],
        },
      ],
    },
    linkField('cta', 'Call to action'),
  ],
}

export const FaqsBlock: Block = {
  slug: 'faqs',
  interfaceName: 'FaqsBlock',
  labels: { singular: 'FAQs', plural: 'FAQ blocks' },
  admin: { group: 'Content' },
  fields: [
    visibilityField(),
    backgroundField(),
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'category',
      options: [
        { label: 'All published FAQs in a category', value: 'category' },
        { label: 'Hand-picked selection', value: 'selected' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Sourcing', value: 'sourcing' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Aquariums', value: 'aquariums' },
        { label: 'General', value: 'general' },
      ],
      admin: { condition: (_d, s) => s?.mode === 'category' },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { condition: (_d, s) => s?.mode === 'selected' },
    },
    {
      name: 'emitStructuredData',
      type: 'checkbox',
      defaultValue: true,
      label: 'Add FAQ structured data',
      admin: {
        description:
          'Only enable where these exact questions and answers are visible on the page, Google requires the rendered content to match.',
      },
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'CTA', plural: 'CTAs' },
  admin: { group: 'Page closers' },
  fields: [
    visibilityField(),
    backgroundField('scarlet'),
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    linkField('primaryCta', 'Primary CTA'),
    linkField('secondaryCta', 'Secondary CTA'),
  ],
}

/** Every block available to the Pages collection's layout field. */
export const layoutBlocks: Block[] = [
  HeroBlock,
  SectionIntroBlock,
  RichTextBlock,
  MediaCopySplitBlock,
  ProcessRouteBlock,
  CategoryGridBlock,
  SpecimenRecordBlock,
  DeliveryStoriesBlock,
  AquariumFeatureBlock,
  ImageGalleryBlock,
  VideoBlock,
  TrustStatementsBlock,
  FeaturedArticlesBlock,
  FaqsBlock,
  CtaBlock,
]
