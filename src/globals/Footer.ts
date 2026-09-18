import type { GlobalConfig } from 'payload'
import { anyone, isStaff } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'brandStatement',
      type: 'textarea',
      maxLength: 320,
      admin: { description: 'Two sentences at most, shown beside the logo.' },
    },
    {
      name: 'navGroups',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Footer column', plural: 'Footer columns' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'policyLinks',
      type: 'array',
      labels: { singular: 'Policy link', plural: 'Policy links' },
      admin: { description: 'Shown in the small print row at the bottom.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'showContactDetails',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Pulls the email, WhatsApp number and address from Site Settings.' },
    },
    {
      name: 'copyrightFormat',
      type: 'text',
      defaultValue: '© {year} {brand}. All rights reserved.',
      admin: { description: 'Use {year} and {brand} as placeholders.' },
    },
  ],
}
