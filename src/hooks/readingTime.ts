import type { CollectionBeforeChangeHook } from 'payload'
import { richTextToPlainText } from '@/lib/richText'

const WORDS_PER_MINUTE = 210

/** Recalculates `readingTime` from the article body on every save. */
export const setReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (!data?.content) return data
  const words = richTextToPlainText(data.content).split(/\s+/).filter(Boolean).length
  return {
    ...data,
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}
