import type { CollectionConfig } from 'payload'
import { publishedOrStaff, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { createRedirectOnSlugChange } from '@/hooks/redirects'
import { enforcePublishPermission } from '@/hooks/publishGuard'
import { setReadingTime } from '@/hooks/readingTime'
import { previewUrl } from '@/lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    group: 'Knowledge Hub',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    description: 'Knowledge Hub articles.',
    livePreview: {
      url: ({ data }) => previewUrl('posts', String(data?.slug ?? '')),
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 834, height: 1194 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
    preview: ({ slug }) => previewUrl('posts', String(slug ?? '')),
  },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  versions: {
    drafts: { autosave: { interval: 800 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [enforcePublishPermission, setReadingTime],
    afterChange: [revalidateAfterChange('posts'), createRedirectOnSlugChange('posts')],
    afterDelete: [revalidateAfterDelete('posts')],
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
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 300,
              admin: {
                description: 'One or two sentences. Used on cards and as the SEO fallback.',
              },
            },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              maxDepth: 1,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
              admin: {
                description:
                  'Leave blank to fall back to the newest articles in the same category.',
              },
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically on first publish. Edit to backdate.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?._status === 'published' && !value) return new Date().toISOString()
            return value
          },
        ],
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Minutes, calculated from the article body on save.',
      },
    },
  ],
}
