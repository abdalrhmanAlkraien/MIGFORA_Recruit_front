import './styles/FormField.css'
import './styles/RadioCardGroup.css'

/**
 * RadioCardGroup — single choice shown as selectable cards (e.g. Film / Series / Short Stories)
 *
 * Props:
 *   label, name, error, required, disabled
 *   value     — selected value
 *   onChange  — (value, option) => void
 *   options   — [{ value, label, description?, icon?, meta?, disabled? }]
 *   columns   — 'auto' (default) | 2 | 3 | 4 — collapses to one column on narrow screens
 */
function RadioCardGroup({
  label,
  name,
  value,
  onChange,
  options  = [],
  columns  = 'auto',
  error    = '',
  required = false,
  disabled = false,
}) {
  const classes = [
    'form-field',
    'radio-card-group',
    error ? 'form-field--error' : '',
  ].filter(Boolean).join(' ')

  return (
    <fieldset className={classes} disabled={disabled} aria-invalid={Boolean(error)}>
      {label && (
        <legend className="form-field__label radio-card-group__legend">
          {label}
          {required && <span className="form-field__required">*</span>}
        </legend>
      )}

      <div className={`radio-card-group__grid radio-card-group__grid--${columns}`}>
        {options.map((option) => {
          const optionId   = `field-${name}-${option.value}`
          const isSelected = value === option.value
          const isDisabled = disabled || option.disabled

          const cardClasses = [
            'radio-card-group__card',
            isSelected ? 'radio-card-group__card--selected' : '',
            isDisabled ? 'radio-card-group__card--disabled' : '',
          ].filter(Boolean).join(' ')

          return (
            <label key={option.value} htmlFor={optionId} className={cardClasses}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                className="radio-card-group__input"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange?.(option.value, option)}
              />

              {option.icon && <span className="radio-card-group__icon">{option.icon}</span>}

              <span className="radio-card-group__text">
                <span className="radio-card-group__label">{option.label}</span>
                {option.description && (
                  <span className="radio-card-group__description">{option.description}</span>
                )}
                {option.meta && <span className="radio-card-group__meta">{option.meta}</span>}
              </span>

              <span className="radio-card-group__indicator" aria-hidden="true" />
            </label>
          )
        })}
      </div>

      {error && <span className="form-field__error-msg">{error}</span>}
    </fieldset>
  )
}

export default RadioCardGroup