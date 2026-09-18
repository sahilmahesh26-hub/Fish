'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ResolvedLink } from '@/lib/links'
import { Button } from '@/components/ui/Button'
import styles from './MobileMenu.module.css'

type NavItem = { id?: string | null; label: string; href: string; description?: string | null }

type Props = {
  navItems: NavItem[]
  cta: ResolvedLink | null
  brandName: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Full-screen navigation for viewports below 1024px.
 *
 * Handles the four things a dialog has to get right: body scroll is locked
 * while open, focus is trapped inside the panel, Escape closes it, and focus
 * returns to the trigger afterwards.
 */
export const MobileMenu = ({ navItems, cta, brandName }: Props) => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const pathname = usePathname()

  const close = useCallback(() => setOpen(false), [])

  /*
   * Navigating away closes the menu.
   *
   * Derived during render rather than in an effect: reacting to `pathname` in
   * an effect would render the panel once over the new page and then close it,
   * a visible flash and a cascading render. Adjusting state during render is
   * React's documented pattern for exactly this case.
   */
  const [routeWhenOpened, setRouteWhenOpened] = useState(pathname)
  if (open && pathname !== routeWhenOpened) {
    setOpen(false)
    setRouteWhenOpened(pathname)
  }

  useEffect(() => {
    if (!open) return

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    // Compensate for the removed scrollbar so the page behind does not jump.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    // Move focus into the panel once it exists.
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((element) => element.offsetParent !== null)

      if (focusables.length === 0) return

      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    // Captured now: by cleanup time the ref may point elsewhere.
    const trigger = triggerRef.current

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      // Return focus to whatever opened the menu.
      trigger?.focus()
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setRouteWhenOpened(pathname)
          setOpen((value) => !value)
        }}
      >
        <span className={styles.triggerBars} aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="u-visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      {open ? (
        <div
          className={styles.overlay}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={`${brandName} navigation`}
        >
          <div className={styles.panel} ref={panelRef}>
            <div className={styles.panelHeader}>
              <span className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true" />
                {brandName}
              </span>
              <button type="button" className={styles.close} onClick={close}>
                <span aria-hidden="true">×</span>
                <span className="u-visually-hidden">Close menu</span>
              </button>
            </div>

            <nav aria-label="Primary">
              <ul className={styles.list} role="list">
                {navItems.map((item) => (
                  <li key={item.id ?? item.href}>
                    <Link href={item.href} className={styles.link}>
                      <span className={styles.linkLabel}>{item.label}</span>
                      {item.description ? (
                        <span className={styles.linkDescription}>{item.description}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {cta ? (
              <div className={styles.panelFooter}>
                <Button
                  href={cta.href}
                  external={cta.external}
                  size="lg"
                  className={styles.panelCta}
                  event="mobile_nav_cta"
                >
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
