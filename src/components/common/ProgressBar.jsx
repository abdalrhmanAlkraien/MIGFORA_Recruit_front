import './styles/ProgressBar.css'

/**
 * ProgressBar — determinate or indeterminate progress
 *
 * Props:
 *   value          — 0..max
 *   max            — default 100
 *   label          — text above the bar
 *   valueLabel     — overrides the "62%" text (e.g. "$420 / $1,000")
 *   showValue      — default: true when a label is given
 *   tone           — 'orange' (default) | 'success' | 'warning' | 'danger' | 'info'
 *   size           — 'md' 8px (default) | 'sm' 4px
 *   indeterminate  — unknown progress (e.g. provider job without percentage)
 */
function ProgressBar({
  value         = 0,
  max           = 100,
  label,
  valueLabel,
  showValue,
  tone          = 'orange',
  size          = 'md',
  indeterminate = false,
}) {
  const percent         = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const displayValue    = valueLabel ?? `${Math.round(percent)}%`
  const shouldShowValue = (showValue ?? Boolean(label)) && !indeterminate

  return (
    <div className={`progress-bar progress-bar--${size} progress-bar--${tone}`}>
      {(label || shouldShowValue) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {shouldShowValue && <span className="progress-bar__value">{displayValue}</span>}
        </div>
      )}

      {indeterminate ? (
        <div className="progress-bar__track" role="progressbar" aria-label={label} aria-busy="true">
          <span className="progress-bar__indeterminate" />
        </div>
      ) : (
        <progress className="progress-bar__native" value={Math.min(value, max)} max={max} aria-label={label} />
      )}
    </div>
  )
}

export default ProgressBar