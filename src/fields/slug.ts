import type { Field } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

/**
 * URL slug with automatic generation from a source field and a manual
 * override. The value is only auto-filled when the editor has not typed one,
 * so an intentional slug is never silently rewritten.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL path segment. Generated from the title; edit to override.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, operation, originalDoc }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return slugify(value)
        }
        const source = (data?.[sourceField] ?? originalDoc?.[sourceField]) as string | undefined
        if (operation === 'create' || operation === 'update') {
          if (typeof source === 'string' && source.trim().length > 0) {
            return slugify(source)
          }
        }
        return value
      },
    ],
  },
})
