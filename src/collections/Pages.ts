import type { CollectionConfig } from 'payload'
import { publishedOrStaff, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { layoutBlocks } from '@/blocks'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { createRedirectOnSlugChange } from '@/hooks/redirects'
import { previewUrl } from '@/lib/preview'
import { enforcePublishPermission } from '@/hooks/publishGuard'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'pageType', '_status', 'updatedAt'],
    description: 'Every public route. Build the page body from the layout blocks.',
    livePreview: {
      url: ({ data }) => previewUrl('pages', String(data?.slug ?? '')),
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 834, height: 1194 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
    preview: ({ slug }) => previewUrl('pages', String(slug ?? '')),
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  versions: {
    drafts: { autosave: { interval: 800 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  hooks: {
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidateAfterChange('pages'), createRedirectOnSlugChange('pages')],
    afterDelete: [revalidateAfterDelete('pages')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'pageType',
              type: 'select',
              required: true,
              defaultValue: 'standard',
              options: [
                { label: 'Standard page', value: 'standard' },
                { label: 'Policy / legal', value: 'policy' },
                { label: 'Utility (404, thank you)', value: 'utility' },
              ],
              admin: {
                position: 'sidebar',
                description:
                  'Policy pages render with a legal-document layout and a review notice.',
              },
            },
            {
              name: 'legalReviewRequired',
              type: 'checkbox',
              defaultValue: false,
              label: 'Draft — requires legal review before publication',
              admin: {
                condition: (data) => data?.pageType === 'policy',
                description:
                  'Shows a visible notice on the page and blocks it from the sitemap until unticked.',
              },
            },
            {
              name: 'hero',
              type: 'group',
              label: 'Page hero',
              admin: {
                description: 'The opening of the page. Leave the heading blank to omit it.',
              },
              fields: [
                { name: 'eyebrow', type: 'text' },
                {
                  name: 'heading',
                  type: 'text',
                  admin: { description: 'Defaults to the page title when blank.' },
                },
                { name: 'intro', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: layoutBlocks,
              admin: {
                description:
                  'Drag to reorder. Each block has its own "Hide this section" switch if you want to keep content without showing it.',
              },
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Marks this page as a navigation candidate. The actual menu order is set in the Header global.',
      },
    },
  ],
}
