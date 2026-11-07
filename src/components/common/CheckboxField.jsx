import { useEffect, useRef } from 'react'
import './styles/FormField.css'
import './styles/CheckboxField.css'

/**
 * CheckboxField — checkbox with label and optional description
 *
 * Props:
 *   label, description, name
 *   checked        — boolean
 *   onChange       — (checked, event) => void
 *   indeterminate  — boolean (partial selection, e.g. "select all" in a table)
 *   ariaLabel      — accessible name when there is no visible label
 *   disabled, error
 */
function CheckboxField({
  label,
  description,
  name,
  checked       = false,
  onChange,
  indeterminate = false,
  ariaLabel,
  disabled      = false,
  error         = '',
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const inputId = `field-${name}`

  const classes = [
    'checkbox-field',
    disabled ? 'checkbox-field--disabled' : '',
    error ? 'checkbox-field--error' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <label className="checkbox-field__row" htmlFor={inputId}>
        <input
          ref={inputRef}
          id={inputId}
          type="checkbox"
          name={name}
          className="checkbox-field__input"
          checked={checked}
          disabled={disabled}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange?.(e.target.checked, e)}
        />

        <span className="checkbox-field__box" aria-hidden="true">
          {indeterminate ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          ) : checked && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </span>

        {(label || description) && (
          <span className="checkbox-field__text">
            {label && <span className="checkbox-field__label">{label}</span>}
            {description && <span className="checkbox-field__description">{description}</span>}
          </span>
        )}
      </label>

      {error && <span className="form-field__error-msg">{error}</span>}
    </div>
  )
}

export default CheckboxField