import type { CollectionConfig } from 'payload'
import { publishedOrStaff, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { enforcePublishPermission } from '@/hooks/publishGuard'

export const AquariumProjects: CollectionConfig = {
  slug: 'aquarium-projects',
  labels: { singular: 'Aquarium service / project', plural: 'Aquarium services & projects' },
  admin: {
    useAsTitle: 'title',
    group: 'Aquariums',
    defaultColumns: ['title', 'serviceType', '_status'],
  },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  hooks: {
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidateAfterChange('aquarium-projects')],
    afterDelete: [revalidateAfterDelete('aquarium-projects')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'summary', type: 'textarea', required: true, maxLength: 300 },
            { name: 'content', type: 'richText' },
            { name: 'coverMedia', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Gallery images' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      defaultValue: 'service',
      options: [
        { label: 'Service', value: 'service' },
        { label: 'Completed project', value: 'project' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
