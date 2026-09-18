import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/cn'
import styles from './RichText.module.css'

type Props = {
  data: unknown
  className?: string
}

/**
 * Renders Lexical content through Payload's own converter.
 *
 * Using the structured converter rather than `dangerouslySetInnerHTML` means
 * stored content can never inject markup or script — the renderer only emits
 * the node types the editor config allows.
 */
export const RichText = ({ data, className }: Props) => {
  if (!data) return null
  return (
    <div className={cn(styles.prose, className)}>
      <PayloadRichText data={data as SerializedEditorState} />
    </div>
  )
}
