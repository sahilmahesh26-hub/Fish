import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark'
type Size = 'md' | 'lg'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Analytics event name. Never carries form values — see `src/lib/analytics.ts`. */
  event?: string
}

type LinkProps = CommonProps & {
  href: string
  external?: boolean
  type?: never
  disabled?: never
}

type ButtonProps = CommonProps & {
  href?: never
  external?: never
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export const Button = (props: LinkProps | ButtonProps) => {
  const { children, variant = 'primary', size = 'md', className, event } = props
  const classes = cn(styles.button, styles[variant], styles[size], className)

  if ('href' in props && props.href) {
    // External links get the full rel set; `noopener` closes the
    // window.opener hole and `noreferrer` avoids leaking the referring URL.
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          data-event={event}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={props.href} className={classes} data-event={event}>
        {children}
      </Link>
    )
  }

  const { type = 'button', disabled, onClick } = props as ButtonProps
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-event={event}
    >
      {children}
    </button>
  )
}
