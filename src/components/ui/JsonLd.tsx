import { jsonLd } from '@/lib/schema'

/**
 * Emits a JSON-LD script tag.
 *
 * The payload is produced by our own builders from CMS data and serialised with
 * `JSON.stringify`, so no user-controlled string reaches the DOM unescaped.
 */
export const JsonLd = ({ data }: { data: Record<string, unknown> | null }) => {
  const serialised = jsonLd(data)
  if (!serialised) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialised.replace(/</g, '\\u003c') }}
    />
  )
}
