'use client'

import { useActionState, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { submitEnquiry, type EnquiryState } from '@/app/(frontend)/source-a-fish/actions'
import { STEPS, CONSENT_TEXT, UPLOAD_LIMITS, AUTOSAVED_FIELDS } from '@/lib/enquirySchema'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'
import { TextInput, TextArea, Select, Field } from './Field'
import { Button } from '@/components/ui/Button'
import styles from './EnquiryForm.module.css'

const STORAGE_KEY = 'finquiry.enquiry.draft'
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000

type Draft = { savedAt: number; values: Record<string, string> }

/**
 * Reads the autosaved draft.
 *
 * Anything older than 24 hours is discarded rather than restored, so a partly
 * typed requirement does not sit in a shared browser indefinitely.
 */
const readDraft = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const draft = JSON.parse(raw) as Draft
    if (!draft?.savedAt || Date.now() - draft.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY)
      return {}
    }
    return draft.values ?? {}
  } catch {
    // Private mode, blocked storage, corrupt JSON — the form still works.
    return {}
  }
}

const writeDraft = (values: Record<string, string>) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ savedAt: Date.now(), values } satisfies Draft),
    )
  } catch {
    // Autosave is a convenience, never a requirement.
  }
}

const clearDraft = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* no-op */
  }
}

const initialState: EnquiryState = { status: 'idle' }

export const EnquiryForm = ({ defaultCategory }: { defaultCategory?: string }) => {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState)
  const [step, setStep] = useState(0)
  const [fileError, setFileError] = useState<string>()
  const [fileName, setFileName] = useState<string>()

  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef<number>(0)
  const hasStarted = useRef(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const isLast = step === STEPS.length - 1

  /*
   * Restore the autosaved draft by writing straight into the controls.
   *
   * Not via React state: the draft can only be read after mount (localStorage
   * does not exist on the server), and feeding it back through `defaultValue`
   * would both risk a hydration mismatch and fail to update an input that has
   * already mounted. Assigning the values directly is simpler and reliable.
   */
  useEffect(() => {
    startedAt.current = Date.now()

    const form = formRef.current
    if (!form) return

    const saved = readDraft()
    for (const [name, value] of Object.entries(saved)) {
      const control = form.elements.namedItem(name)
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      ) {
        // Never restore into a file input, and never overwrite something the
        // visitor has already typed.
        if (control instanceof HTMLInputElement && control.type === 'file') continue
        if (control.value) continue
        control.value = value
      }
    }
  }, [])

  /** Saves only the allowlisted requirement fields — never identity, never
   *  the hidden anti-spam, attribution or server-action fields. */
  const saveDraft = useCallback(() => {
    const form = formRef.current
    if (!form) return
    const values: Record<string, string> = {}
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value !== 'string') continue
      if (!AUTOSAVED_FIELDS.includes(key)) continue
      if (value.length > 0) values[key] = value
    }
    writeDraft(values)
  }, [])

  // On success: clear the draft and hand off to the confirmation page, which
  // receives only the request ID and the fish description — never the rest.
  useEffect(() => {
    if (state.status !== 'success' || !state.requestId) return
    clearDraft()
    trackEvent(ANALYTICS_EVENTS.enquirySubmitted)
    const params = new URLSearchParams({ request: state.requestId })
    if (state.fishRequired) params.set('fish', state.fishRequired)
    router.push(`/thank-you?${params.toString()}`)
  }, [state, router])

  // Move focus to the error summary so the problem is announced, not silent.
  useEffect(() => {
    if (state.status === 'error') errorSummaryRef.current?.focus()
  }, [state])

  const goToStep = (next: number) => {
    saveDraft()
    setStep(next)
    trackEvent(ANALYTICS_EVENTS.enquiryStepCompleted, { step: next })
    // Announce the new step by moving focus to its heading.
    window.requestAnimationFrame(() => headingRef.current?.focus())
  }

  const onFirstInput = () => {
    if (hasStarted.current) return
    hasStarted.current = true
    trackEvent(ANALYTICS_EVENTS.enquiryStarted)
  }

  // Memoised so the step-error memo below does not recompute every render.
  const errors = useMemo(() => state.errors ?? {}, [state.errors])

  /** Steps that contain a field the server rejected, so they can be flagged. */
  const stepsWithErrors = useMemo(() => {
    const names = Object.keys(errors)
    return STEPS.map((definition) => definition.fields.some((field) => names.includes(field)))
  }, [errors])

  const utm = {
    source: searchParams.get('utm_source') ?? '',
    medium: searchParams.get('utm_medium') ?? '',
    campaign: searchParams.get('utm_campaign') ?? '',
    term: searchParams.get('utm_term') ?? '',
    content: searchParams.get('utm_content') ?? '',
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(undefined)
    setFileName(undefined)
    if (!file) return
    if (!UPLOAD_LIMITS.accept.includes(file.type)) {
      setFileError(`Upload a ${UPLOAD_LIMITS.acceptLabel} image.`)
      event.target.value = ''
      return
    }
    if (file.size > UPLOAD_LIMITS.maxBytes) {
      setFileError(`That file is larger than ${UPLOAD_LIMITS.maxLabel}.`)
      event.target.value = ''
      return
    }
    setFileName(file.name)
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className={styles.form}
      noValidate
      onInput={onFirstInput}
      onChange={saveDraft}
    >
      {/* Anti-spam. Hidden from people and from assistive technology; only a
          script filling every input would complete it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="sourcePage" value="/source-a-fish" />
      <input type="hidden" name="utmSource" value={utm.source} />
      <input type="hidden" name="utmMedium" value={utm.medium} />
      <input type="hidden" name="utmCampaign" value={utm.campaign} />
      <input type="hidden" name="utmTerm" value={utm.term} />
      <input type="hidden" name="utmContent" value={utm.content} />
      <ElapsedField startedAt={startedAt} />

      {/* Step indicator. A list, so its length and position are announced. */}
      <nav aria-label="Form progress" className={styles.progress}>
        <ol role="list" className={styles.progressList}>
          {STEPS.map((definition, index) => (
            <li key={definition.id}>
              <button
                type="button"
                className={styles.progressStep}
                aria-current={index === step ? 'step' : undefined}
                data-state={
                  stepsWithErrors[index]
                    ? 'error'
                    : index < step
                      ? 'done'
                      : index === step
                        ? 'current'
                        : 'todo'
                }
                onClick={() => goToStep(index)}
              >
                <span className={styles.progressNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.progressLabel}>
                  <span className="u-visually-hidden">{`Step ${index + 1} of ${STEPS.length}: `}</span>
                  {definition.title}
                  {stepsWithErrors[index] ? (
                    <span className="u-visually-hidden"> — has errors</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {state.status === 'error' ? (
        <div ref={errorSummaryRef} className={styles.summary} role="alert" tabIndex={-1}>
          <p className={styles.summaryTitle}>{state.message}</p>
          {Object.keys(errors).length > 0 ? (
            <ul className={styles.summaryList}>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a href={`#field-${field}`}>{message}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/*
        Every step stays mounted and is hidden with CSS rather than unmounted.
        That is what preserves values when moving between steps, and it means a
        native form submission still carries all five steps' fields.
      */}
      {STEPS.map((definition, index) => (
        <fieldset
          key={definition.id}
          className={styles.step}
          hidden={index !== step}
          aria-hidden={index !== step}
        >
          <legend className={styles.legend}>
            <h2
              className={styles.stepTitle}
              ref={index === step ? headingRef : undefined}
              tabIndex={-1}
            >
              <span className={styles.stepCount}>{`Step ${index + 1} of ${STEPS.length}`}</span>
              {definition.title}
            </h2>
            <p className={styles.stepDescription}>{definition.description}</p>
          </legend>

          <div className={styles.grid}>
            {definition.id === 'about-you' ? (
              <>
                <TextInput
                  name="fullName"
                  label="Full name"
                  required
                  autoComplete="name"
                  error={errors.fullName}
                  className={styles.full}
                />
                <TextInput
                  name="whatsapp"
                  label="WhatsApp number"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  hint="We will continue the conversation here."
                  placeholder="98765 43210"
                  error={errors.whatsapp}
                />
                <TextInput
                  name="email"
                  label="Email address"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  error={errors.email}
                />
                <TextInput
                  name="city"
                  label="City"
                  required
                  autoComplete="address-level2"
                  error={errors.city}
                />
                <TextInput
                  name="state"
                  label="State"
                  required
                  autoComplete="address-level1"
                  error={errors.state}
                />
                <TextInput
                  name="pincode"
                  label="PIN code"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  error={errors.pincode}
                />
              </>
            ) : null}

            {definition.id === 'the-fish' ? (
              <>
                <TextInput
                  name="fishRequired"
                  label="Fish required"
                  required
                  hint="In your own words — we will refine it with you."
                  placeholder="Super red arowana, around 10 inches"
                  defaultValue={defaultCategory}
                  error={errors.fishRequired}
                  className={styles.full}
                />
                <TextInput name="species" label="Species or common name" error={errors.species} />
                <TextInput name="variety" label="Variety or colour" error={errors.variety} />
                <TextInput
                  name="preferredSize"
                  label="Preferred size"
                  placeholder="10–12 inches"
                  error={errors.preferredSize}
                />
                <TextInput
                  name="sizeRange"
                  label="Acceptable size range"
                  hint="If you are flexible, say so here."
                  error={errors.sizeRange}
                />
                <TextInput
                  name="quantity"
                  label="Quantity"
                  inputMode="numeric"
                  error={errors.quantity}
                />
                <Select
                  name="alternativesAccepted"
                  label="Would you consider alternatives?"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No — this specimen only', value: 'no' },
                    { label: 'Described below', value: 'describe' },
                  ]}
                  error={errors.alternativesAccepted}
                />
                <TextArea
                  name="alternativesNotes"
                  label="Notes on alternatives"
                  error={errors.alternativesNotes}
                  className={styles.full}
                />
              </>
            ) : null}

            {definition.id === 'your-aquarium' ? (
              <>
                <TextInput
                  name="tankDimensions"
                  label="Aquarium dimensions"
                  placeholder="72 × 24 × 24 inches"
                  error={errors.tankDimensions}
                />
                <TextInput
                  name="waterVolume"
                  label="Approximate water volume"
                  error={errors.waterVolume}
                />
                <TextArea
                  name="tankInhabitants"
                  label="Current tank inhabitants"
                  hint="Helps us judge compatibility."
                  error={errors.tankInhabitants}
                  className={styles.full}
                />
                <Select
                  name="tankCycled"
                  label="Is the aquarium cycled and ready?"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Not sure', value: 'unsure' },
                    { label: 'Planning a new system', value: 'new-system' },
                  ]}
                  error={errors.tankCycled}
                />
                <TextArea
                  name="systemNotes"
                  label="Additional system notes"
                  error={errors.systemNotes}
                  className={styles.full}
                />
              </>
            ) : null}

            {definition.id === 'budget-timeline' ? (
              <>
                <TextInput
                  name="budgetRange"
                  label="Budget range"
                  hint="A range is fine — it helps us search in the right places."
                  error={errors.budgetRange}
                />
                <TextInput
                  name="timeline"
                  label="Purchase timeline"
                  placeholder="Within a month"
                  error={errors.timeline}
                />
                <TextInput name="deliveryCity" label="Delivery city" error={errors.deliveryCity} />
                <TextInput
                  name="deliveryPincode"
                  label="Delivery PIN code"
                  inputMode="numeric"
                  error={errors.deliveryPincode}
                />
              </>
            ) : null}

            {definition.id === 'reference-contact' ? (
              <>
                <Field
                  name="referenceImage"
                  label="Reference image"
                  hint={`${UPLOAD_LIMITS.acceptLabel}, up to ${UPLOAD_LIMITS.maxLabel}. Kept private and only seen by our sourcing team.`}
                  error={fileError ?? errors.referenceImage}
                  className={styles.full}
                >
                  {({ id, describedBy }) => (
                    <>
                      <input
                        id={id}
                        name="referenceImage"
                        type="file"
                        className={styles.file}
                        accept={UPLOAD_LIMITS.accept.join(',')}
                        aria-describedby={describedBy}
                        onChange={onFileChange}
                      />
                      {fileName ? (
                        <p className={styles.fileName} aria-live="polite">
                          Selected: {fileName}
                        </p>
                      ) : null}
                    </>
                  )}
                </Field>

                <TextArea
                  name="additionalRequirements"
                  label="Anything else we should know"
                  error={errors.additionalRequirements}
                  className={styles.full}
                />
                <TextInput
                  name="preferredContactTime"
                  label="Preferred contact time"
                  placeholder="Evenings after 7pm"
                  error={errors.preferredContactTime}
                />

                <div className={styles.full}>
                  <div className={styles.consent}>
                    <input
                      id="field-consent"
                      name="consent"
                      type="checkbox"
                      className={styles.checkbox}
                      aria-describedby={errors.consent ? 'field-consent-error' : undefined}
                      aria-invalid={errors.consent ? true : undefined}
                    />
                    <label htmlFor="field-consent" className={styles.consentLabel}>
                      {CONSENT_TEXT.replace(' and I have read the Privacy Policy.', '')} and I have
                      read the <Link href="/privacy-policy">Privacy Policy</Link>.
                    </label>
                  </div>
                  {errors.consent ? (
                    <p id="field-consent-error" className={styles.consentError}>
                      <span aria-hidden="true">▲</span> {errors.consent}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </fieldset>
      ))}

      <div className={styles.actions}>
        <div className={styles.navButtons}>
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={() => goToStep(step - 1)}>
              Back
            </Button>
          ) : null}

          {!isLast ? (
            <Button type="button" onClick={() => goToStep(step + 1)}>
              Next
            </Button>
          ) : null}

          {/*
            The submit button exists on every step, not just the last, so the
            form can be completed and sent from the keyboard at any point —
            the server validates the whole thing regardless.
          */}
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className={!isLast ? styles.quietSubmit : undefined}
          >
            {isPending ? 'Sending…' : 'Submit my requirement'}
          </Button>
        </div>

        <p className={styles.reassurance} aria-live="polite">
          {isPending
            ? 'Sending your requirement…'
            : 'Submitting a requirement does not confirm an order or guarantee availability. Our team will review your request and contact you on WhatsApp.'}
        </p>
      </div>
    </form>
  )
}

/** Records how long the form was open, used to reject instant bot submissions. */
const ElapsedField = ({ startedAt }: { startedAt: React.RefObject<number> }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const update = () => {
      if (ref.current) ref.current.value = String(Date.now() - startedAt.current)
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [startedAt])

  return <input ref={ref} type="hidden" name="elapsed" defaultValue="0" />
}
