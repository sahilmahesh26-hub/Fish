import type { CollectionConfig } from 'payload'
import { anyone, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'

/** Knowledge Hub taxonomy. Supports nesting via an optional parent. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Knowledge Hub',
    defaultColumns: ['name', 'parent', 'order'],
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'description', type: 'textarea' },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Optional. Leave blank for a top-level category.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
