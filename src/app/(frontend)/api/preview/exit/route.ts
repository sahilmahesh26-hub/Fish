import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Turns draft preview off and returns to the public homepage. */
export const GET = async () => {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
