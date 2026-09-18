import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { hasRole } from '@/access'
import type { User } from '@/payload-types'

/**
 * Blocks an editor without publishing rights from moving a document to
 * `published`, including through the REST and GraphQL APIs.
 *
 * Payload manages `_status` itself when drafts are enabled, so this cannot be a
 * field-level access rule without redeclaring a reserved field. Enforcing it in
 * `beforeChange` keeps the rule on the server for every entry point an editor
 * can actually reach.
 *
 * Local API calls are exempt. That is the same trust boundary Payload itself
 * uses — `payloadAPI === 'local'` means our own server code is the caller (the
 * seed script, a migration, an internal hook), not a request from outside. The
 * admin panel talks to Payload over REST, so editors remain guarded.
 */
export const enforcePublishPermission: CollectionBeforeChangeHook = ({
  data,
  req,
  originalDoc,
}) => {
  if (data?._status !== 'published') return data
  if (req.payloadAPI === 'local') return data

  const user = req.user as User | null

  if (hasRole(user, 'super-admin', 'admin')) return data
  if (hasRole(user, 'editor') && user?.canPublish === true) return data

  throw new APIError(
    originalDoc?._status === 'published'
      ? 'You do not have permission to republish this document. Save it as a draft instead.'
      : 'You do not have permission to publish. Save this as a draft and ask an admin to publish it.',
    403,
  )
}
