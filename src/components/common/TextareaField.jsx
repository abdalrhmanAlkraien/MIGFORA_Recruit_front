import { useRef } from 'react'
import './styles/FormField.css'
import './styles/TextareaField.css'
import useAutoGrow from '../../store/useAutoGrow'

/**
 * TextareaField — auto-growing textarea with the FormField shell
 *
 * Props:
 *   label, name, value, onChange (event), placeholder, error, required, disabled — same as FormField
 *   minRows     — default 3
 *   maxRows     — default 12 (scrolls after)
 *   maxLength   — soft limit: counter turns red, text is not cut (validate before submit)
 *   showCount   — show counter even without maxLength
 *   helperText  — hint shown under the field when there is no error
 */
function TextareaField({
  label,
  name,
  value       = '',
  onChange,
  placeholder = '',
  error       = '',
  required    = false,
  disabled    = false,
  minRows     = 3,
  maxRows     = 12,
  maxLength,
  showCount   = false,
  helperText,
}) {
  const textareaRef = useRef(null)
  useAutoGrow(textareaRef, value, { minRows, maxRows })

  const inputId    = `field-${name}`
  const length     = value?.length || 0
  const hasLimit   = maxLength !== undefined
  const overLimit  = hasLimit && length > maxLength
  const nearLimit  = hasLimit && !overLimit && length >= maxLength * 0.9
  const showCounter = showCount || hasLimit
  const showFooter  = Boolean(error || helperText || showCounter)

  const countClasses = [
    'textarea-field__count',
    nearLimit ? 'textarea-field__count--near' : '',
    overLimit ? 'textarea-field__count--over' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`form-field textarea-field ${error || overLimit ? 'form-field--error' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <textarea
        ref={textareaRef}
        id={inputId}
        name={name}
        rows={minRows}
        className="form-field__input textarea-field__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error) || overLimit}
      />

      {showFooter && (
        <div className="textarea-field__footer">
          {error && <span className="form-field__error-msg">{error}</span>}
          {!error && helperText && <span className="textarea-field__helper">{helperText}</span>}
          {showCounter && (
            <span className={countClasses}>
              {hasLimit ? `${length} / ${maxLength}` : length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default TextareaField