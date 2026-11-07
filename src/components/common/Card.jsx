import './styles/Card.css'

/**
 * Card — standard surface for page sections
 *
 * Props:
 *   title, subtitle
 *   actions   — node at the header end (buttons, DropdownMenu)
 *   footer    — node at the bottom (buttons align end)
 *   padding   — 'md' (default) | 'sm' | 'none' (use 'none' around a DataTable)
 *   variant   — 'default' | 'muted' | 'outlined'
 *   onClick   — makes the whole card clickable (keyboard: Enter / Space).
 *               Don't combine a clickable card with many inner buttons.
 *   className
 */
function Card({
  title,
  subtitle,
  actions,
  footer,
  padding   = 'md',
  variant   = 'default',
  onClick,
  className = '',
  children,
}) {
  const hasHeader     = title || subtitle || actions
  const isInteractive = Boolean(onClick)

  const classes = [
    'card',
    `card--${variant}`,
    isInteractive ? 'card--interactive' : '',
    className,
  ].filter(Boolean).join(' ')

  const handleKeyDown = (e) => {
    if (!isInteractive || e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(e)
    }
  }

  return (
    <section
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {hasHeader && (
        <header className="card__header">
          <div className="card__heading">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && (
            <div className="card__actions" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
        </header>
      )}

      <div className={`card__body card__body--${padding}`}>{children}</div>

      {footer && <footer className="card__footer">{footer}</footer>}
    </section>
  )
}

export default Card