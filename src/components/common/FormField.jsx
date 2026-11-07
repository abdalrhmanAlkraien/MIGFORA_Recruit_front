import './styles/FormField.css'

/**
 * FormField — MIGFORA standard label + input unit
 *
 * Props:
 *   label       — string, field label text
 *   name        — string, input name attribute
 *   type        — input type (default: 'text')
 *   value       — controlled value
 *   onChange    — change handler
 *   placeholder — placeholder string
 *   error       — inline field-level error string (optional)
 *   required    — boolean (default: false)
 *   disabled    — boolean (default: false)
 *   minLength   — number (optional)
 *   autoComplete — string (optional)
 */
function FormField({
  label,
  name,
  type        = 'text',
  value,
  onChange,
  placeholder = '',
  error       = '',
  required    = false,
  disabled    = false,
  minLength,
  autoComplete,
}) {
  const inputId = `field-${name}`

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <input
        id={inputId}
        className="form-field__input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
      />

      {error && (
        <span className="form-field__error-msg">{error}</span>
      )}
    </div>
  )
}

export default FormField