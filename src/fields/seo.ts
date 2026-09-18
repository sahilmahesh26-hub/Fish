import type { Field } from 'payload'

/**
 * Extra SEO controls appended to the official plugin's fields.
 *
 * The plugin owns the `meta` group (title, description, image plus the preview
 * widget). Rather than run a second, competing SEO panel we extend that one
 * group, so an editor only ever sees a single place to control SEO.
 */
export const seoExtraFields: Field[] = [
  {
    name: 'canonicalUrl',
    type: 'text',
    admin: {
      description:
        'Absolute URL. Only set this when the same content is also published somewhere else.',
    },
    validate: (value: unknown) => {
      if (!value) return true
      try {
        const url = new URL(String(value))
        return ['http:', 'https:'].includes(url.protocol) || 'Use http or https.'
      } catch {
        return 'Enter a full URL including https://'
      }
    },
  },
  {
    name: 'noIndex',
    type: 'checkbox',
    defaultValue: false,
    label: 'Hide from search engines',
    admin: {
      description: 'Adds noindex,nofollow and removes this page from the sitemap.',
    },
  },
]

/** Fields override passed to `seoPlugin`. */
export const seoFieldsOverride = ({ defaultFields }: { defaultFields: Field[] }): Field[] => [
  ...defaultFields,
  ...seoExtraFields,
]
