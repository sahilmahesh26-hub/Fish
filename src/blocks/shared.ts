import type { Field } from 'payload'

/** Background treatments available to blocks. Keeps the four-colour system
 *  enforceable — an editor cannot introduce an off-brand surface. */
export const backgroundField = (defaultValue = 'linen'): Field => ({
  name: 'background',
  type: 'select',
  defaultValue,
  options: [
    { label: 'Sandy Linen (default)', value: 'linen' },
    { label: 'Sandy Linen, raised', value: 'linen-raised' },
    { label: 'Deep Navy', value: 'navy' },
    { label: 'Scarlet', value: 'scarlet' },
  ],
  admin: {
    description:
      'Scarlet and Deep Navy are accents. Use them for at most one or two sections per page.',
  },
})

/** A link that can point at an internal route or an external URL. */
export const linkField = (name = 'link', label = 'Link'): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: { description: 'Button or link text.' },
    },
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Internal page', value: 'internal' },
        { label: 'External URL', value: 'external' },
        { label: 'WhatsApp (uses Site Settings)', value: 'whatsapp' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'href',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'internal',
        description: 'Path starting with "/", for example /source-a-fish',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        // An untouched link group is simply not rendered, so it must not block
        // a save. Validation begins once the editor gives the link a label.
        if (!siblingData?.label) return true
        if (siblingData?.type !== 'internal') return true
        if (typeof value !== 'string' || value.length === 0) return 'Enter a path.'
        if (!value.startsWith('/')) return 'Internal paths must start with "/".'
        return true
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'external',
        description: 'Full URL including https://',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!siblingData?.label) return true
        if (siblingData?.type !== 'external') return true
        if (typeof value !== 'string' || value.length === 0) return 'Enter a URL.'
        try {
          const parsed = new URL(value)
          if (!['http:', 'https:'].includes(parsed.protocol)) return 'Use http or https.'
          return true
        } catch {
          return 'Enter a valid absolute URL.'
        }
      },
    },
    {
      name: 'whatsappMessage',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'whatsapp',
        description: 'Optional prefilled message. Leave blank to use the Site Settings default.',
      },
    },
  ],
})

/** Lets an editor hide a section without deleting its content. */
export const visibilityField = (): Field => ({
  name: 'hidden',
  type: 'checkbox',
  defaultValue: false,
  label: 'Hide this section',
  admin: {
    description: 'Keeps the content but removes the section from the public page.',
  },
})
