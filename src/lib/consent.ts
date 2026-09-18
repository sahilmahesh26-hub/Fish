/**
 * Cookie consent model.
 *
 * First-party only. One cookie, one JSON value, no third-party consent
 * platform — the site has exactly two optional categories, which does not
 * justify shipping a heavy CMP.
 */

export const CONSENT_COOKIE = 'finquiry_consent'

/** One year. Long enough not to nag, short enough to be a real re-ask. */
export const CONSENT_MAX_AGE_DAYS = 365

/** Bumped when the categories change, which invalidates stored consent. */
export const CONSENT_VERSION = 1

export type ConsentCategory = 'necessary' | 'analytics'

export type ConsentState = {
  version: number
  /** Always true. Listed so the stored record is self-describing. */
  necessary: true
  analytics: boolean
  /** ISO timestamp of the decision, for the audit trail. */
  decidedAt: string
}

export const CONSENT_CATEGORIES: {
  id: ConsentCategory
  label: string
  description: string
  required: boolean
  cookies: string
}[] = [
  {
    id: 'necessary',
    label: 'Necessary',
    description:
      'Needed for the site to work: remembering this choice, keeping your place in the sourcing form, and protecting the form from abuse. These are never optional.',
    required: true,
    cookies: `${CONSENT_COOKIE} (1 year), plus short-lived form protection`,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'Anonymous measurement of which pages are read and which buttons are used, so we can improve the site. Never your name, number, email or the details of your requirement.',
    required: false,
    cookies: 'Set by the configured analytics provider; see the Cookie Policy',
  },
]

/** No optional category is on until someone says so. */
export const DEFAULT_CONSENT: ConsentState = {
  version: CONSENT_VERSION,
  necessary: true,
  analytics: false,
  decidedAt: '',
}

/**
 * Parses a stored consent value.
 *
 * Returns null for anything unreadable, unrecognised or from an older version,
 * which makes the banner reappear rather than silently assuming permission.
 */
export const parseConsent = (raw: string | undefined | null): ConsentState | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>
    if (parsed?.version !== CONSENT_VERSION) return null
    if (typeof parsed.analytics !== 'boolean') return null
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : '',
    }
  } catch {
    return null
  }
}

export const serialiseConsent = (state: ConsentState): string =>
  encodeURIComponent(JSON.stringify(state))

/** Reads consent in the browser. */
export const readConsentCookie = (): ConsentState | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1))
}

/**
 * Writes consent as a first-party cookie.
 *
 * `SameSite=Lax` because the value is read on ordinary top-level navigation.
 * `Secure` is set whenever the page is served over HTTPS. Not `HttpOnly`: the
 * client has to read it to decide whether to load analytics at all.
 */
export const writeConsentCookie = (state: ConsentState): void => {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${CONSENT_COOKIE}=${serialiseConsent(state)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  notify()
}

/**
 * Best-effort cleanup of cookies belonging to a withdrawn category.
 *
 * A first-party script cannot delete a third-party cookie, and cannot delete
 * one scoped to a path it does not know. What it can do is clear the known
 * first-party analytics cookies on this domain and its dot-prefixed parent,
 * which is what the common providers set.
 */
export const clearAnalyticsCookies = (): void => {
  if (typeof document === 'undefined') return

  // Google Analytics (_ga, _ga_XXXX, _gid, _gat*) and Plausible's ignore flag.
  const prefixes = ['_ga', '_gid', '_gat', 'plausible_ignore', 'umami.']
  const host = window.location.hostname
  const domains = [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]

  for (const entry of document.cookie.split('; ')) {
    const name = entry.split('=')[0]
    if (!prefixes.some((prefix) => name.startsWith(prefix))) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Domain=${domain}; Max-Age=0; SameSite=Lax`
    }
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }
}

/* -------------------------------------------------------------------------- */
/* External store                                                             */
/* -------------------------------------------------------------------------- */

/**
 * `document.cookie` as a subscribable store.
 *
 * Exposed this way so React can read it with `useSyncExternalStore` instead of
 * copying it into state inside an effect. That keeps the server render and the
 * hydration pass consistent, and means a write notifies every reader.
 */
const listeners = new Set<() => void>()

export const subscribeConsent = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The raw cookie value. A string (or null) so snapshot equality is stable. */
export const getConsentSnapshot = (): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
  return match ? match.slice(CONSENT_COOKIE.length + 1) : null
}

/**
 * The server knows nothing about the visitor's cookie, so it renders as though
 * no decision exists — and the banner is suppressed until hydration confirms
 * one way or the other. Erring toward "no consent" is the safe direction.
 */
export const getConsentServerSnapshot = (): string | null => null

const notify = () => listeners.forEach((listener) => listener())
