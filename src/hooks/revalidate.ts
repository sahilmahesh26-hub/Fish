import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { pathFor } from '@/lib/preview'

/** Next 16 requires a cacheLife profile; 'max' purges the entry outright. */
const CACHE_PROFILE = 'max'

/**
 * Cache invalidation after a publish.
 *
 * Everything the frontend reads is fetched under a cache tag named after its
 * collection, so one `revalidateTag` refreshes every listing that includes the
 * document, while `revalidatePath` refreshes its own route.
 */
const revalidate = (collection: string, slug?: string) => {
  try {
    revalidateTag(collection, CACHE_PROFILE)
    revalidateTag('global', CACHE_PROFILE)
    if (slug) revalidatePath(pathFor(collection, slug))
    revalidatePath('/')
  } catch {
    // `revalidate*` throws outside a request scope — for example during the
    // seed script. A failure to bust a cache must never fail a content save.
  }
}

export const revalidateAfterChange =
  (collection: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    if (req.context?.skipRevalidate) return doc
    revalidate(collection, typeof doc?.slug === 'string' ? doc.slug : undefined)
    // A renamed slug leaves the old path cached, so clear that too.
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidate(collection, String(previousDoc.slug))
    }
    return doc
  }

export const revalidateAfterDelete =
  (collection: string): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (req.context?.skipRevalidate) return doc
    revalidate(collection, typeof doc?.slug === 'string' ? doc.slug : undefined)
    return doc
  }

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context?.skipRevalidate) return doc
  try {
    revalidateTag('global', CACHE_PROFILE)
    revalidatePath('/', 'layout')
  } catch {
    // See note above.
  }
  return doc
}
