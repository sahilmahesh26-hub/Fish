import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { publishedOrStaff, isStaff, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { enforcePublishPermission } from '@/hooks/publishGuard'
import { previewUrl } from '@/lib/preview'

/**
 * Completed sourcing journeys, published only with the customer's consent.
 *
 * Nothing in here is seeded: a delivery story only exists once a real record
 * and a real permission exist. The consent checkbox is enforced on the server
 * in `validateConsent` below, not merely hidden in the admin UI.
 */
export const Deliveries: CollectionConfig = {
  slug: 'deliveries',
  labels: { singular: 'Delivery story', plural: 'Delivery stories' },
  admin: {
    useAsTitle: 'title',
    group: 'Sourcing',
    defaultColumns: ['title', 'requestId', 'destination', 'deliveryDate', '_status'],
    description:
      'Real, documented deliveries. Never publish private customer details, full addresses or internal vendor names.',
    preview: ({ slug }) => previewUrl('deliveries', String(slug ?? '')),
  },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  defaultSort: '-deliveryDate',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        // A testimonial is never stored without recorded written permission.
        // Enforced here so the rule holds for the REST and GraphQL APIs too,
        // not just for editors looking at the admin UI.
        const hasTestimonial =
          typeof data.testimonial === 'string' && data.testimonial.trim().length > 0
        if (hasTestimonial && data.testimonialConsent !== true) {
          throw new APIError(
            'A testimonial cannot be saved without confirming that written permission is on file.',
            400,
          )
        }
        return data
      },
    ],
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidateAfterChange('deliveries')],
    afterDelete: [revalidateAfterDelete('deliveries')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Record',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'requestId',
              type: 'text',
              label: 'Public reference',
              admin: {
                description:
                  'The Request ID shown publicly, e.g. FQ-2609-0001. Safe to display — it identifies the search, not the customer.',
              },
            },
            {
              name: 'requirement',
              type: 'textarea',
              required: true,
              label: 'Customer requirement',
              admin: { description: 'What the collector originally asked for, in their terms.' },
            },
            { name: 'specimen', type: 'text', required: true, label: 'Specimen sourced' },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'sourcing-categories',
              admin: { description: 'Used by the filters on the Deliveries index.' },
            },
            { name: 'variety', type: 'text' },
            { name: 'approximateSize', type: 'text' },
            {
              name: 'origin',
              type: 'text',
              required: true,
              admin: { description: 'City or state only — never a full address.' },
            },
            {
              name: 'destination',
              type: 'text',
              required: true,
              admin: { description: 'City or state only — never a full address.' },
            },
            { name: 'outcome', type: 'richText' },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'mainImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Gallery images' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'packingMedia',
              type: 'array',
              labels: { singular: 'Packing record', plural: 'Packing records' },
              admin: { description: 'Packing and dispatch documentation.' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'textarea',
              admin: {
                description:
                  'The customer’s own words. Leave blank unless you hold written permission.',
              },
            },
            {
              name: 'testimonialAttribution',
              type: 'text',
              admin: { description: 'Display name and city, e.g. "R.K., Pune".' },
            },
            {
              name: 'testimonialConsent',
              type: 'checkbox',
              defaultValue: false,
              label: 'Written permission to publish this testimonial is on file',
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'deliveryDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Featured stories can appear on the homepage.' },
    },
  ],
}
