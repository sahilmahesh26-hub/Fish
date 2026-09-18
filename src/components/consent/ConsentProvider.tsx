'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  CONSENT_VERSION,
  clearAnalyticsCookies,
  getConsentServerSnapshot,
  getConsentSnapshot,
  parseConsent,
  subscribeConsent,
  writeConsentCookie,
  type ConsentState,
} from '@/lib/consent'

type ConsentContextValue = {
  /** null when no valid decision has been recorded. */
  consent: ConsentState | null
  /** True when the banner should ask. */
  needsDecision: boolean
  preferencesOpen: boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (analytics: boolean) => void
  openPreferences: () => void
  closePreferences: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export const useConsent = (): ConsentContextValue => {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('useConsent must be used inside ConsentProvider')
  return context
}

/**
 * Holds the visitor's cookie choice.
 *
 * The cookie is read through `useSyncExternalStore` rather than copied into
 * state inside an effect: the server render and the hydration pass stay
 * consistent, and a write notifies every reader at once.
 *
 * The default is refusal. Nothing optional loads until someone says yes.
 */
export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  const consent = useMemo(() => parseConsent(raw), [raw])

  const commit = useCallback((analytics: boolean) => {
    writeConsentCookie({
      version: CONSENT_VERSION,
      necessary: true,
      analytics,
      decidedAt: new Date().toISOString(),
    })
    setPreferencesOpen(false)

    // Withdrawing clears the first-party analytics cookies we can reach; the
    // analytics component unmounts its script on the same state change.
    if (!analytics) clearAnalyticsCookies()
  }, [])

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      needsDecision: consent === null,
      preferencesOpen,
      acceptAll: () => commit(true),
      rejectAll: () => commit(false),
      save: commit,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [consent, preferencesOpen, commit],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}
