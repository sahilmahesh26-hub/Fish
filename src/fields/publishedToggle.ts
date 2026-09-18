import type { Field } from 'payload'
import { canPublish } from '@/access'

/**
 * Explicit published flag for collections that do not use Payload drafts.
 * Gated by the same publishing permission as the draft system.
 */
export const publishedToggle = (): Field => ({
  name: 'published',
  type: 'checkbox',
  defaultValue: false,
  access: {
    create: canPublish,
    update: canPublish,
  },
  admin: {
    position: 'sidebar',
    description: 'Only published records appear on the public site.',
  },
})
