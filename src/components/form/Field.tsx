import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Field.module.css'

type BaseProps = {
  name: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

/**
 * Field wrapper.
 *
 * Every control gets a persistent visible `<label>` — placeholders are only
 * ever an example, never a substitute. The hint and error are wired through
 * `aria-describedby` so a screen reader announces them with the field.
 */
export const Field = ({
  name,
  label,
  hint,
  error,
  required,
  className,
  children,
}: BaseProps & { children: (ids: { id: string; describedBy?: string }) => ReactNode }) => {
  const id = `field-${name}`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn(styles.field, error && styles.hasError, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : (
          <span className={styles.optional}>optional</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      {children({ id, describedBy })}

      {error ? (
        <p id={errorId} className={styles.error}>
          {/* The icon is decorative; the message carries the meaning, so the
              error is never signalled by colour alone. */}
          <span aria-hidden="true">▲</span> {error}
        </p>
      ) : null}
    </div>
  )
}

export const TextInput = ({
  name,
  label,
  hint,
  error,
  required,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  defaultValue,
  spellCheck,
  className,
  onChange,
}: BaseProps & {
  type?: string
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  placeholder?: string
  defaultValue?: string
  /** Off for addresses, codes and identifiers, where a red squiggle is noise. */
  spellCheck?: boolean
  onChange?: (value: string) => void
}) => (
  <Field
    name={name}
    label={label}
    hint={hint}
    error={error}
    required={required}
    className={className}
  >
    {({ id, describedBy }) => (
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={defaultValue}
        spellCheck={spellCheck}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
    )}
  </Field>
)

export const TextArea = ({
  name,
  label,
  hint,
  error,
  required,
  rows = 4,
  placeholder,
  defaultValue,
  className,
  onChange,
}: BaseProps & {
  rows?: number
  placeholder?: string
  defaultValue?: string
  onChange?: (value: string) => void
}) => (
  <Field
    name={name}
    label={label}
    hint={hint}
    error={error}
    required={required}
    className={className}
  >
    {({ id, describedBy }) => (
      <textarea
        id={id}
        name={name}
        rows={rows}
        className={cn(styles.input, styles.textarea)}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
    )}
  </Field>
)

export const Select = ({
  name,
  label,
  hint,
  error,
  required,
  options,
  defaultValue,
  className,
  onChange,
}: BaseProps & {
  options: { label: string; value: string }[]
  defaultValue?: string
  onChange?: (value: string) => void
}) => (
  <Field
    name={name}
    label={label}
    hint={hint}
    error={error}
    required={required}
    className={className}
  >
    {({ id, describedBy }) => (
      <select
        id={id}
        name={name}
        className={cn(styles.input, styles.select)}
        defaultValue={defaultValue ?? ''}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange?.(event.target.value)}
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </Field>
)
