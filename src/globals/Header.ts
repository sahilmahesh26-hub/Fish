import type { GlobalConfig } from 'payload'
import { anyone, isStaff } from '@/access'
import { linkField } from '@/blocks/shared'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & navigation',
  admin: {
    group: 'Configuration',
    description: 'Primary navigation, header CTA and announcement bar.',
  },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Navigation item', plural: 'Navigation items' },
      admin: {
        description:
          'Drag to reorder. Keep labels short — more than eight items crowds the desktop bar.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 28 },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'Path starting with "/", e.g. /how-it-works' },
          validate: (value: unknown) =>
            typeof value === 'string' && value.startsWith('/')
              ? true
              : 'Navigation paths must start with "/".',
        },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Optional. Shown under the label in the mobile menu.' },
        },
      ],
    },
    linkField('cta', 'Header CTA'),
    {
      name: 'announcement',
      type: 'group',
      label: 'Announcement bar',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'text', type: 'text', maxLength: 140 },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
