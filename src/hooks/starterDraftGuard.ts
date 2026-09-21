import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { richTextToPlainText } from '@/lib/richText'

/**
 * The sentence `pnpm seed` writes into every starter article body.
 *
 * Kept as a constant rather than a loose string so the seed and this guard
 * cannot drift apart. If you change the wording in `src/seed/helpers.ts`,
 * change it here too, or the guard silently stops guarding.
 */
export const STARTER_DRAFT_MARKER = 'This article is a starter draft'

/**
 * Refuses to publish an article that still contains its seeded placeholder
 * body.
 *
 * The seed creates six titled, categorised drafts so the Knowledge templates
 * have something to render in development. Their bodies say "Replace this body
 * with the real guidance before publishing". Nothing stopped an editor hitting
 * Publish on one of those and putting that instruction on the public site,
 * where it reads as a broken page and carries none of the article's promised
 * content.
 *
 * The check runs on the body actually being saved, so replacing the text and
 * publishing in a single action works exactly as expected. It only ever blocks
 * the transition to `published`; saving a starter draft as a draft is the
 * normal state and stays untouched.
 */
export const blockStarterDraftPublish: CollectionBeforeChangeHook = ({
  data,
  req,
  originalDoc,
}) => {
  if (data?._status !== 'published') return data
  /*
   * Local API calls are exempt, the same trust boundary `enforcePublishPermission`
   * uses: `payloadAPI === 'local'` means our own server code is the caller, which
   * here is `pnpm qa:fixtures apply` deliberately publishing articles so the
   * Knowledge templates, Article structured data and the sitemap have something
   * to render. The admin panel talks to Payload over REST, so an editor is still
   * stopped.
   */
  if (req?.payloadAPI === 'local') return data

  const content = data?.content ?? originalDoc?.content
  if (!content) return data

  const text = richTextToPlainText(content as never)
  if (!text.includes(STARTER_DRAFT_MARKER)) return data

  throw new APIError(
    'This article still contains the seeded starter text. Replace the body with the real article before publishing it.',
    400,
  )
}
