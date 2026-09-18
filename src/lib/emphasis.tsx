import type { ReactNode } from 'react'

/**
 * Splits a headline on *asterisks* and wraps the marked runs in an element.
 *
 * Gives editors control over which word carries the Scarlet emphasis without
 * letting them write arbitrary markup into a heading.
 */
export const renderEmphasis = (text: string | null | undefined, className: string): ReactNode[] => {
  if (!text) return []

  return text.split(/(\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className={className}>
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={index}>{part}</span>
  })
}

/** Plain-text version of an emphasised headline, for metadata and aria labels. */
export const stripEmphasis = (text: string | null | undefined): string =>
  (text ?? '').replace(/\*/g, '')
