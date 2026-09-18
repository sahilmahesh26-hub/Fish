/**
 * Minimal Lexical helpers used on the server.
 *
 * The frontend renders rich text with Payload's own React converter; these
 * helpers exist for the cases where we need plain text (reading time, meta
 * descriptions, RSS) without pulling the renderer into a non-React context.
 */

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalRoot = { root?: LexicalNode } | null | undefined

export const richTextToPlainText = (value: LexicalRoot): string => {
  if (!value?.root) return ''

  const walk = (node: LexicalNode): string => {
    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.children)) {
      const inner = node.children.map(walk).join(node.type === 'paragraph' ? '' : ' ')
      // Keep block-level nodes separated so words are not glued together.
      return ['paragraph', 'heading', 'listitem', 'quote'].includes(node.type ?? '')
        ? `${inner}\n`
        : inner
    }
    return ''
  }

  return walk(value.root).replace(/\s+/g, ' ').trim()
}

/** First N characters of the rich text, cut on a word boundary. */
export const richTextExcerpt = (value: LexicalRoot, maxLength = 160): string => {
  const text = richTextToPlainText(value)
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
