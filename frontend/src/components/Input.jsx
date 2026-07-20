import { useId } from 'react'

// Accessible text input/textarea with a programmatically associated <label>,
// optional helper + error text wired via aria-describedby and aria-invalid.
export default function Input({
  label,
  type = 'text',
  error,
  helper,
  textarea = false,
  required = false,
  className = '',
  id: providedId,
  ...rest
}) {
  const autoId = useId()
  const id = providedId || autoId
  const describedBy = []
  if (helper) describedBy.push(`${id}-helper`)
  if (error) describedBy.push(`${id}-error`)

  const Field = textarea ? 'textarea' : 'input'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-content">
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <Field
        id={id}
        type={textarea ? undefined : type}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy.join(' ') || undefined}
        className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-content shadow-soft
          placeholder:text-content-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          ${error ? 'border-error focus-visible:ring-error' : 'border-line focus-visible:ring-primary'}`}
        {...rest}
      />
      {helper && !error && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-content-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs font-medium text-error">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}
