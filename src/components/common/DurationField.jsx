import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDuration, parseDuration } from '../../utils/duration'
import './styles/FormField.css'
import './styles/DurationField.css'

/**
 * DurationField — runtime input, stored in seconds
 *
 * Accepts "1:30:00", "45:00", "90" (bare number = plainUnit), "1h 30m", "45m", "30s".
 * Text is reformatted on blur / Enter.
 *
 * Props:
 *   label, name, error, required, disabled, placeholder — same as FormField
 *   value       — seconds (number | null)
 *   onChange    — (seconds | null) => void
 *   format      — 'auto' (default) | 'mm:ss' | 'hh:mm:ss'
 *   plainUnit   — 'minutes' (default) | 'seconds'
 *   min, max    — seconds
 *   helperText  — defaults to the accepted-formats hint
 */
function DurationField({
  label,
  name,
  value,
  onChange,
  format      = 'auto',
  plainUnit   = 'minutes',
  min,
  max,
  placeholder = '0:00',
  error       = '',
  helperText,
  required    = false,
  disabled    = false,
}) {
  const { t } = useTranslation()

  const [draft, setDraft]           = useState(formatDuration(value, format))
  const [isFocused, setIsFocused]   = useState(false)
  const [parseError, setParseError] = useState('')

  const inputId      = `field-${name}`
  const visibleError = error || parseError

  useEffect(() => {
    if (!isFocused && !parseError) setDraft(formatDuration(value, format))
  }, [value, format, isFocused, parseError])

  const commit = () => {
    const seconds = parseDuration(draft, plainUnit)

    if (Number.isNaN(seconds)) {
      setParseError(t('duration.invalid'))
      return
    }
    if (seconds !== null && min !== undefined && seconds < min) {
      setParseError(t('duration.min', { value: formatDuration(min, format) }))
      return
    }
    if (seconds !== null && max !== undefined && seconds > max) {
      setParseError(t('duration.max', { value: formatDuration(max, format) }))
      return
    }

    setParseError('')
    setDraft(formatDuration(seconds, format))
    if (seconds !== value) onChange?.(seconds)
  }

  const handleBlur = () => {
    setIsFocused(false)
    commit()
  }

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    commit()
  }

  return (
    <div className={`form-field duration-field ${visibleError ? 'form-field--error' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <div className="duration-field__control">
        <span className="duration-field__icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </span>

        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="text"
          autoComplete="off"
          className="form-field__input duration-field__input"
          value={draft}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(visibleError)}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => { setDraft(e.target.value); setParseError('') }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </div>

      {visibleError && <span className="form-field__error-msg">{visibleError}</span>}
      {!visibleError && (
        <span className="form-field__helper">{helperText || t('duration.hint')}</span>
      )}
    </div>
  )
}

export default DurationField