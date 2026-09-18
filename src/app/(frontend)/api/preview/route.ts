import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { pathFor } from '@/lib/preview'

/**
 * Enables draft preview.
 *
 * Two gates, both required: the shared `PREVIEW_SECRET`, and a live Payload
 * session belonging to active staff. The secret alone is not enough — a leaked
 * preview URL cannot expose unpublished content to the public.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')

  const expected = process.env.PREVIEW_SECRET

  if (!expected) {
    return new Response('Preview is not configured. Set PREVIEW_SECRET.', { status: 501 })
  }
  if (secret !== expected) {
    return new Response('Invalid preview token.', { status: 401 })
  }
  if (!collection || !slug) {
    return new Response('Missing collection or slug.', { status: 400 })
  }

  // Confirm a real, active staff session before enabling draft mode.
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || (user as { active?: boolean }).active === false) {
    return new Response('You must be signed in to the Finquiry admin to preview drafts.', {
      status: 403,
    })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(pathFor(collection, slug))
}
