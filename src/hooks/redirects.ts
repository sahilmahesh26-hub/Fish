import type { CollectionAfterChangeHook } from 'payload'
import { pathFor } from '@/lib/preview'

/**
 * Keeps published URLs working after a slug change.
 *
 * Only fires when the document was already published under the old slug —
 * renaming a draft that nobody could reach does not need a redirect.
 */
export const createRedirectOnSlugChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, operation }) => {
    if (operation !== 'update') return doc
    const oldSlug = previousDoc?.slug
    const newSlug = doc?.slug
    if (!oldSlug || !newSlug || oldSlug === newSlug) return doc
    if (previousDoc?._status !== 'published') return doc

    const from = pathFor(collection, String(oldSlug))
    const to = pathFor(collection, String(newSlug))

    try {
      const existing = await req.payload.find({
        collection: 'redirects',
        where: { from: { equals: from } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        await req.payload.update({
          collection: 'redirects',
          id: existing.docs[0].id,
          data: { to: { type: 'custom', url: to } },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
      } else {
        await req.payload.create({
          collection: 'redirects',
          data: { from, to: { type: 'custom', url: to } },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
      }
    } catch (error) {
      req.payload.logger.error(
        { err: error, from, to },
        'Could not record a redirect for a changed slug',
      )
    }

    return doc
  }
