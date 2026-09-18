import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { publishedToggleOrStaff, isStaff, isAdmin } from '@/access'
import { publishedToggle } from '@/fields/publishedToggle'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'displayName',
    group: 'Sourcing',
    defaultColumns: ['displayName', 'city', 'consent', 'published'],
    description: 'Only real, approved quotes. Nothing here is ever seeded or invented.',
  },
  access: { read: publishedToggleOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        // Publication requires recorded consent — enforced server-side.
        if (data.published === true && data.consent !== true) {
          throw new APIError(
            'A testimonial cannot be published without confirming that approval is on file.',
            400,
          )
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange('testimonials')],
    afterDelete: [revalidateAfterDelete('testimonials')],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'How the customer agreed to be credited, e.g. "R.K." or a first name.',
      },
    },
    { name: 'city', type: 'text' },
    { name: 'quote', type: 'textarea', required: true, maxLength: 600 },
    {
      name: 'relatedDelivery',
      type: 'relationship',
      relationTo: 'deliveries',
      admin: { description: 'Optional. Links this quote to a published delivery story.' },
    },
    {
      name: 'consent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Approval to publish is confirmed and on file',
      admin: { position: 'sidebar' },
    },
    publishedToggle(),
  ],
}
