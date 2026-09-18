/**
 * Small builders for Lexical editor state.
 *
 * The seed script has to produce valid editor JSON without running the editor,
 * so these construct the exact node shapes Payload's Lexical adapter expects.
 */

type TextNode = {
  type: 'text'
  text: string
  format: number
  style: string
  mode: 'normal'
  detail: number
  version: 1
}

const BOLD = 1

const text = (value: string, format = 0): TextNode => ({
  type: 'text',
  text: value,
  format,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const block = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr' as const,
  children,
  ...extra,
})

/** Paragraph. Wrap a run in **asterisks** to make it bold. */
export const p = (value: string) => {
  const children = value
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') ? text(part.slice(2, -2), BOLD) : text(part),
    )
  return block('paragraph', children, { textFormat: 0, textStyle: '' })
}

/** Heading, h2–h4 only — h1 belongs to the page itself. */
export const h = (tag: 'h2' | 'h3' | 'h4', value: string) =>
  block('heading', [text(value)], { tag })

/** Unordered or ordered list. */
export const list = (items: string[], ordered = false) =>
  block(
    'list',
    items.map((item, index) =>
      block('listitem', [text(item)], { value: index + 1, checked: undefined }),
    ),
    {
      listType: ordered ? 'number' : 'bullet',
      start: 1,
      tag: ordered ? 'ol' : 'ul',
    },
  )

/** Wraps nodes into a complete editor state. */
export const doc = (...children: unknown[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
})
