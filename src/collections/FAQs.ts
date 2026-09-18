import type { CollectionConfig } from 'payload'
import { publishedToggleOrStaff, isStaff, isAdmin } from '@/access'
import { publishedToggle } from '@/fields/publishedToggle'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['question', 'category', 'order', 'published'],
  },
  access: { read: publishedToggleOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateAfterChange('faqs')],
    afterDelete: [revalidateAfterDelete('faqs')],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Sourcing', value: 'sourcing' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Aquariums', value: 'aquariums' },
        { label: 'General', value: 'general' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    publishedToggle(),
  ],
}
