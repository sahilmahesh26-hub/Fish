import type { CollectionConfig } from 'payload'
import { activeOrStaff, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'

export const SourcingCategories: CollectionConfig = {
  slug: 'sourcing-categories',
  labels: { singular: 'Sourcing category', plural: 'Sourcing categories' },
  admin: {
    useAsTitle: 'name',
    group: 'Sourcing',
    defaultColumns: ['name', 'active', 'order'],
    description:
      'The kinds of search Finquiry supports. These are never presented as stock — every card carries a "sourced on request" label.',
  },
  access: { read: activeOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'One sentence, shown on the category card.' },
    },
    { name: 'longDescription', type: 'richText' },
    { name: 'coverMedia', type: 'upload', relationTo: 'media' },
    {
      name: 'availabilityLabel',
      type: 'text',
      defaultValue: 'Sourced on request',
      required: true,
      admin: {
        description:
          'Always signals that this is a search, not stock. Keep wording that makes availability conditional.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Inactive categories are hidden from the site.' },
    },
  ],
}
