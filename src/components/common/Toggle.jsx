import './styles/Toggle.css'

/**
 * Toggle — on/off switch for settings
 *
 * Props:
 *   label, description, name
 *   checked    — boolean
 *   onChange   — (checked) => void
 *   size       — 'md' (default) | 'sm'
 *   layout     — 'inline' (switch then text) | 'row' (text start, switch end — settings rows)
 *   ariaLabel  — accessible name when there is no visible label
 *   disabled
 */
function Toggle({
  label,
  description,
  name,
  checked  = false,
  onChange,
  size     = 'md',
  layout   = 'inline',
  ariaLabel,
  disabled = false,
}) {
  const switchId = `field-${name}`

  const text = (label || description) && (
    <span className="toggle__text">
      {label && <label className="toggle__label" htmlFor={switchId}>{label}</label>}
      {description && <span className="toggle__description">{description}</span>}
    </span>
  )

  const switchClasses = [
    'toggle__switch',
    `toggle__switch--${size}`,
    checked ? 'toggle__switch--on' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`toggle toggle--${layout} ${disabled ? 'toggle--disabled' : ''}`}>
      {layout === 'row' && text}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        className={switchClasses}
        onClick={() => onChange?.(!checked)}
      >
        <span className="toggle__thumb" />
      </button>

      {layout === 'inline' && text}
    </div>
  )
}

export default Toggle