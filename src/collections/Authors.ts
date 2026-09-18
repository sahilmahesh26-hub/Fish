import type { CollectionConfig } from 'payload'
import { anyone, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    group: 'Knowledge Hub',
    defaultColumns: ['name', 'title', 'updatedAt'],
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'title', type: 'text', label: 'Role / title' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'social',
      type: 'array',
      maxRows: 5,
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        { name: 'platform', type: 'text', required: true },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            try {
              const u = new URL(String(value))
              return ['http:', 'https:'].includes(u.protocol) || 'Use http or https.'
            } catch {
              return 'Enter a valid absolute URL.'
            }
          },
        },
      ],
    },
  ],
}
