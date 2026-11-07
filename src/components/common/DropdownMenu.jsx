import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Popover from './Popover'
import './styles/DropdownMenu.css'

/**
 * DropdownMenu — action menu (kebab or custom trigger)
 *
 * Props:
 *   items      — [{ key, label, icon?, onClick, danger?, disabled?, hint? } | { key, divider: true }]
 *   label      — accessible name when the trigger has no text (default: t('common.more_actions'))
 *   placement  — 'bottom-end' (default) | 'bottom-start'
 *   disabled   — boolean
 *   children   — optional trigger content (text); default is a kebab icon
 *
 * Danger items must open a ConfirmDialog in their onClick — never delete directly.
 */
function DropdownMenu({ items = [], label, placement = 'bottom-end', disabled = false, children }) {
  const { t } = useTranslation()

  const triggerRef = useRef(null)
  const menuRef    = useRef(null)

  const [open, setOpen] = useState(false)

  const getEnabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll('.dropdown-menu__item:not(:disabled)') || [])

  const focusItem = (direction) => {
    const nodes = getEnabledItems()
    if (!nodes.length) return
    const current = nodes.indexOf(document.activeElement)
    const next = current === -1
      ? (direction > 0 ? 0 : nodes.length - 1)
      : (current + direction + nodes.length) % nodes.length
    nodes[next].focus()
  }

  useEffect(() => {
    if (!open) return undefined
    const frame = requestAnimationFrame(() => focusItem(1))
    return () => cancelAnimationFrame(frame)
  }, [open])

  const handleClose = (reason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  }

  const handleItemClick = (item) => {
    setOpen(false)
    triggerRef.current?.focus()
    item.onClick?.()
  }

  const handleMenuKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(1) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); focusItem(-1) }
    if (e.key === 'Home')      { e.preventDefault(); getEnabledItems()[0]?.focus() }
    if (e.key === 'End')       { e.preventDefault(); getEnabledItems().at(-1)?.focus() }
    if (e.key === 'Tab')       setOpen(false)
  }

  const triggerClasses = [
    'dropdown-menu__trigger',
    children ? 'dropdown-menu__trigger--text' : '',
    open ? 'dropdown-menu__trigger--open' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={children ? undefined : (label || t('common.more_actions'))}
        title={children ? undefined : (label || t('common.more_actions'))}
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); setOpen((prev) => !prev) }}
      >
        {children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5"  r="1.8"/>
            <circle cx="12" cy="12" r="1.8"/>
            <circle cx="12" cy="19" r="1.8"/>
          </svg>
        )}
      </button>

      <Popover open={open} anchorRef={triggerRef} onClose={handleClose} placement={placement}>
        <div ref={menuRef} role="menu" className="dropdown-menu" onKeyDown={handleMenuKeyDown}>
          {items.map((item) => (
            item.divider ? (
              <div key={item.key} role="separator" className="dropdown-menu__divider" />
            ) : (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`dropdown-menu__item ${item.danger ? 'dropdown-menu__item--danger' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className="dropdown-menu__icon">{item.icon}</span>}
                <span className="dropdown-menu__label">{item.label}</span>
                {item.hint && <span className="dropdown-menu__hint">{item.hint}</span>}
              </button>
            )
          ))}
        </div>
      </Popover>
    </>
  )
}

export default DropdownMenu