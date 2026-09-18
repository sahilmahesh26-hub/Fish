'use client'

import { useConsent } from './ConsentProvider'

/**
 * Reopens the cookie preferences dialog.
 *
 * A button, not a link — it opens a dialog rather than navigating. Lives in the
 * footer so a decision is always reversible from any page, which is the point
 * of consent rather than a one-time gate.
 */
export const CookiePreferencesLink = ({ className }: { className?: string }) => {
  const { openPreferences } = useConsent()

  return (
    <button type="button" className={className} onClick={openPreferences}>
      Cookie preferences
    </button>
  )
}
