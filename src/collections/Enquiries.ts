import type { CollectionConfig } from 'payload'
import { isStaff, isAdmin, nobody, hasRole } from '@/access'

/**
 * Private sourcing enquiries.
 *
 * Public access is `nobody` for every operation, including create: the form
 * submits to a server action which validates the payload and then writes with
 * `overrideAccess: true`. That keeps the only public write path behind our own
 * schema, rate limiting and spam checks, rather than exposing a collection
 * endpoint that accepts arbitrary fields.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'requestId',
    group: 'Enquiries',
    defaultColumns: ['requestId', 'fullName', 'fishRequired', 'status', 'createdAt'],
    description: 'Customer sourcing requests. Private — never exposed on the public site.',
    listSearchableFields: ['requestId', 'fullName', 'fishRequired', 'city'],
  },
  access: {
    read: isStaff,
    create: nobody,
    update: isStaff,
    delete: isAdmin,
    // Deactivated accounts and non-staff never see the collection at all.
    admin: ({ req }) => hasRole(req.user, 'super-admin', 'admin', 'editor'),
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      name: 'requestId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Sourcing', value: 'sourcing' },
        { label: 'Options shared', value: 'options-shared' },
        { label: 'Approved', value: 'approved' },
        { label: 'Closed', value: 'closed' },
        { label: 'Unsuccessful', value: 'unsuccessful' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Customer',
          fields: [
            { name: 'fullName', type: 'text', required: true },
            { name: 'whatsapp', type: 'text', required: true, label: 'WhatsApp number' },
            { name: 'email', type: 'email' },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'state', type: 'text', required: true, admin: { width: '40%' } },
                {
                  name: 'pincode',
                  type: 'text',
                  required: true,
                  label: 'PIN code',
                  admin: { width: '20%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Requirement',
          fields: [
            { name: 'fishRequired', type: 'text', required: true },
            { name: 'species', type: 'text', label: 'Species / common name' },
            { name: 'variety', type: 'text', label: 'Variety or colour' },
            {
              type: 'row',
              fields: [
                { name: 'preferredSize', type: 'text', admin: { width: '33%' } },
                {
                  name: 'sizeRange',
                  type: 'text',
                  label: 'Acceptable size range',
                  admin: { width: '33%' },
                },
                { name: 'quantity', type: 'number', min: 1, admin: { width: '34%' } },
              ],
            },
            {
              name: 'alternativesAccepted',
              type: 'select',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Described below', value: 'describe' },
              ],
            },
            { name: 'alternativesNotes', type: 'textarea' },
          ],
        },
        {
          label: 'Aquarium',
          fields: [
            { name: 'tankDimensions', type: 'text', label: 'Existing aquarium dimensions' },
            { name: 'waterVolume', type: 'text', label: 'Approximate water volume' },
            { name: 'tankInhabitants', type: 'textarea', label: 'Current tank inhabitants' },
            {
              name: 'tankCycled',
              type: 'select',
              label: 'Is the aquarium cycled and ready?',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Not sure', value: 'unsure' },
                { label: 'Not applicable — planning a new system', value: 'new-system' },
              ],
            },
            { name: 'systemNotes', type: 'textarea', label: 'Additional system notes' },
          ],
        },
        {
          label: 'Commercial',
          fields: [
            { name: 'budgetRange', type: 'text' },
            { name: 'timeline', type: 'text', label: 'Purchase timeline' },
            {
              type: 'row',
              fields: [
                { name: 'deliveryCity', type: 'text', admin: { width: '60%' } },
                {
                  name: 'deliveryPincode',
                  type: 'text',
                  label: 'Delivery PIN code',
                  admin: { width: '40%' },
                },
              ],
            },
            { name: 'additionalRequirements', type: 'textarea' },
            { name: 'preferredContactTime', type: 'text' },
            {
              name: 'referenceImage',
              type: 'relationship',
              relationTo: 'private-media',
              admin: { description: 'Customer-supplied reference. Stored privately.' },
            },
          ],
        },
        {
          label: 'Internal',
          fields: [
            {
              name: 'internalNotes',
              type: 'textarea',
              admin: { description: 'Never shown to the customer.' },
            },
            {
              name: 'meta',
              type: 'group',
              label: 'Submission metadata',
              admin: { readOnly: true },
              fields: [
                { name: 'sourcePage', type: 'text' },
                {
                  name: 'consentAt',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' } },
                },
                {
                  name: 'consentText',
                  type: 'textarea',
                  admin: { description: 'The exact wording the customer agreed to.' },
                },
                {
                  name: 'utm',
                  type: 'group',
                  fields: [
                    { name: 'source', type: 'text' },
                    { name: 'medium', type: 'text' },
                    { name: 'campaign', type: 'text' },
                    { name: 'term', type: 'text' },
                    { name: 'content', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
