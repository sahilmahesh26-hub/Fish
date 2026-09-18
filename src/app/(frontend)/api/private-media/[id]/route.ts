import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * Serves a customer's reference upload to authenticated staff only.
 *
 * Enquiry uploads are private: they live outside `public/`, the collection
 * denies public read, and this route re-checks the session on every request
 * rather than trusting an unguessable filename.
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || (user as { active?: boolean }).active === false) {
    // 404 rather than 403, so the endpoint does not confirm which IDs exist.
    return new Response('Not found', { status: 404 })
  }

  try {
    const doc = await payload.findByID({
      collection: 'private-media',
      id,
      overrideAccess: false,
      user,
    })

    if (!doc?.url) return new Response('Not found', { status: 404 })

    const upstream = await fetch(
      doc.url.startsWith('http') ? doc.url : `${payload.config.serverURL}${doc.url}`,
      { headers: { cookie: request.headers.get('cookie') ?? '' } },
    )

    if (!upstream.ok) return new Response('Not found', { status: 404 })

    return new Response(upstream.body, {
      headers: {
        'Content-Type': doc.mimeType ?? 'application/octet-stream',
        // Never cached by a shared cache.
        'Cache-Control': 'private, no-store',
        'Content-Disposition': `inline; filename="${encodeURIComponent(doc.filename ?? 'reference')}"`,
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
