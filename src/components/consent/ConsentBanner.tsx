'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useConsent } from './ConsentProvider'
import { CONSENT_CATEGORIES } from '@/lib/consent'
import styles from './ConsentBanner.module.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Cookie consent.
 *
 * Two surfaces: a banner asking once, and a preferences dialog reachable from
 * the footer at any time.
 *
 * Deliberately non-deceptive — "Reject" carries exactly the same visual weight
 * as "Accept". Both are the same button component at the same size; neither is
 * hidden behind "Manage preferences", greyed out, or pushed off the edge.
 *
 * The banner is NOT a modal. It does not trap focus and does not block the
 * page, because refusing to decide is a legitimate choice and nothing optional
 * loads until someone does. The preferences dialog IS a modal, and traps focus
 * properly.
 */
export const ConsentBanner = () => {
  const {
    needsDecision,
    preferencesOpen,
    acceptAll,
    rejectAll,
    save,
    openPreferences,
    closePreferences,
  } = useConsent()

  if (!needsDecision && !preferencesOpen) return null

  return (
    <>
      {needsDecision && !preferencesOpen ? (
        <Banner onAccept={acceptAll} onReject={rejectAll} onManage={openPreferences} />
      ) : null}
      {preferencesOpen ? <PreferencesDialog onSave={save} onClose={closePreferences} /> : null}
    </>
  )
}

const Banner = ({
  onAccept,
  onReject,
  onManage,
}: {
  onAccept: () => void
  onReject: () => void
  onManage: () => void
}) => {
  const headingId = useId()
  const bannerRef = useRef<HTMLElement>(null)

  /*
   * Publish the banner's height so layout can make room for it.
   *
   * On a phone this is a full-width sheet across the bottom of the screen,
   * which is the right pattern for a consent gate and also means it sits on
   * top of whatever is at the foot of the first screen. On the homepage that
   * is "Start Your Search": the one control someone has to be able to reach
   * while they decide about cookies.
   *
   * Rather than move the sheet somewhere worse, it measures itself into
   * `--consent-h` and the hero subtracts that from its own height, so the
   * hero's content sits above the sheet instead of behind it. The variable is
   * cleared on unmount, so the moment a decision is made the hero takes the
   * full viewport back.
   */
  useEffect(() => {
    const element = bannerRef.current
    if (!element) return

    const root = document.documentElement
    const publish = () => {
      root.style.setProperty(
        '--consent-h',
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      )
    }

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(element)

    return () => {
      observer.disconnect()
      root.style.removeProperty('--consent-h')
    }
  }, [])

  return (
    <aside
      ref={bannerRef}
      className={styles.banner}
      // `region`, not `dialog`: it does not trap focus or block the page.
      role="region"
      aria-labelledby={headingId}
    >
      <div className={styles.bannerInner}>
        <div className={styles.copy}>
          <h2 id={headingId} className={styles.title}>
            Cookies on this site
          </h2>
          {/* Two lines, not five. The card sits over the hero until it is
              answered, so every line it loses is hero it stops covering. The
              detail it used to carry lives on the policy page it links to. */}
          <p className={styles.body}>
            Anonymous analytics only, off until you accept. Never your name, number or requirement.{' '}
            <Link href="/cookie-policy">Read the Cookie Policy</Link>.
          </p>
        </div>

        <div className={styles.actions}>
          {/* Accept and Reject are the same component at the same size. */}
          <button type="button" className={styles.primary} onClick={onAccept}>
            Accept analytics
          </button>
          <button type="button" className={styles.primary} onClick={onReject}>
            Reject analytics
          </button>
          <button type="button" className={styles.tertiary} onClick={onManage}>
            Manage preferences
          </button>
        </div>
      </div>
    </aside>
  )
}

const PreferencesDialog = ({
  onSave,
  onClose,
}: {
  onSave: (analytics: boolean) => void
  onClose: () => void
}) => {
  const headingId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((element) => element.offsetParent !== null)
      if (focusables.length === 0) return

      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className={styles.dialogTitle}>
          Cookie preferences
        </h2>

        <ul className={styles.categories} role="list">
          {CONSENT_CATEGORIES.map((category) => {
            const inputId = `consent-${category.id}`
            return (
              <li key={category.id} className={styles.category}>
                <div className={styles.categoryHeader}>
                  <input
                    id={inputId}
                    type="checkbox"
                    className={styles.checkbox}
                    checked={category.required ? true : analytics}
                    disabled={category.required}
                    onChange={(event) => setAnalytics(event.target.checked)}
                    aria-describedby={`${inputId}-description`}
                  />
                  <label htmlFor={inputId} className={styles.categoryLabel}>
                    {category.label}
                    {category.required ? <span className={styles.always}>Always on</span> : null}
                  </label>
                </div>
                <p id={`${inputId}-description`} className={styles.categoryBody}>
                  {category.description}
                </p>
                <p className={styles.categoryCookies}>
                  <span className={styles.categoryCookiesLabel}>Cookies:</span> {category.cookies}
                </p>
              </li>
            )
          })}
        </ul>

        <div className={styles.dialogActions}>
          <button type="button" className={styles.primary} onClick={() => onSave(analytics)}>
            Save Preferences
          </button>
          <button type="button" className={styles.tertiary} onClick={onClose}>
            Cancel
          </button>
        </div>

        <p className={styles.dialogFootnote}>
          You can change this at any time from the Cookie preferences link in the footer.{' '}
          <Link href="/cookie-policy">Read the Cookie Policy</Link>.
        </p>
      </div>
    </div>
  )
}
