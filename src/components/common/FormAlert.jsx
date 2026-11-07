import './styles/FormAlert.css'

/**
 * FormAlert — form-level error or success banner
 *
 * Props:
 *   type     — 'error' | 'success'
 *   message  — string to display (renders nothing if empty)
 */
function FormAlert({ type = 'error', message = '' }) {
  if (!message) return null

  return (
    <div className={`form-alert form-alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="form-alert__icon">
        {type === 'error' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )}
      </span>
      {message}
    </div>
  )
}

export default FormAlert