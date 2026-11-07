import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './styles/FormField.css'
import './styles/NumberField.css'

/**
 * NumberField — numeric input with − / + steppers
 *
 * Props:
 *   label, name, error, required, disabled, placeholder — same as FormField
 *   value       — number | null
 *   onChange    — (number | null) => void   ← value, not an event
 *   min, max    — clamped on blur and when stepping
 *   step        — default 1; decimals are allowed when step is fractional (e.g. 0.5)
 *   suffix      — unit label inside the field, e.g. "episodes", "USD"
 *   helperText
 *
 * Keyboard: ArrowUp / ArrowDown step, Enter commits.
 */
const getDecimals = (step) => (String(step).split('.')[1] || '').length

function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step        = 1,
  suffix,
  placeholder = '',
  error       = '',
  helperText,
  required    = false,
  disabled    = false,
}) {
  const { t } = useTranslation()

  const [draft, setDraft] = useState(value ?? '')

  const inputId       = `field-${name}`
  const decimals      = getDecimals(step)
  const allowNegative = min === undefined || min < 0
  const pattern       = new RegExp(`^${allowNegative ? '-?' : ''}\\d*${decimals > 0 ? '(\\.\\d*)?' : ''}$`)
  const hasValue      = value !== null && value !== undefined
  const atMin         = min !== undefined && hasValue && value <= min
  const atMax         = max !== undefined && hasValue && value >= max

  const parse = (raw) => {
    const text = String(raw).trim()
    if (text === '') return null
    const number = Number(text)
    return Number.isFinite(number) ? number : NaN
  }

  const clamp = (number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, number))
  const round = (number) => Number(number.toFixed(decimals))

  useEffect(() => {
    setDraft((prev) => (parse(prev) === (value ?? null) ? prev : (value ?? '')))
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (number) => {
    const next = number === null ? null : round(clamp(number))
    setDraft(next ?? '')
    if (next !== value) onChange?.(next)
  }

  const handleChange = (e) => {
    const raw = e.target.value
    if (!pattern.test(raw)) return
    setDraft(raw)
    const number = parse(raw)
    if (!Number.isNaN(number)) onChange?.(number)
  }

  const handleBlur = () => {
    const number = parse(draft)
    if (Number.isNaN(number)) {
      setDraft(value ?? '')
      return
    }
    commit(number)
  }

  const stepBy = (direction) => {
    if (disabled) return
    commit(hasValue ? value + direction * step : (min ?? 0))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp')   { e.preventDefault(); stepBy(1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); stepBy(-1) }
    if (e.key === 'Enter')     handleBlur()
  }

  return (
    <div className={`form-field number-field ${error ? 'form-field--error' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <div className={`number-field__control ${disabled ? 'number-field__control--disabled' : ''}`}>
        <button
          type="button"
          tabIndex={-1}
          className="number-field__step"
          onClick={() => stepBy(-1)}
          disabled={disabled || atMin}
          aria-label={t('number.decrease')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        <input
          id={inputId}
          name={name}
          type="text"
          role="spinbutton"
          inputMode={decimals > 0 ? 'decimal' : 'numeric'}
          className="number-field__input"
          value={draft}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-valuenow={hasValue ? value : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={Boolean(error)}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />

        {suffix && <span className="number-field__suffix">{suffix}</span>}

        <button
          type="button"
          tabIndex={-1}
          className="number-field__step"
          onClick={() => stepBy(1)}
          disabled={disabled || atMax}
          aria-label={t('number.increase')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {error && <span className="form-field__error-msg">{error}</span>}
      {!error && helperText && <span className="form-field__helper">{helperText}</span>}
    </div>
  )
}

export default NumberField