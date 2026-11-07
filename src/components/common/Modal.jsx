import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import useEscape from '../../hooks/useEscape'
import useScrollLock from '../../hooks/useScrollLock'
import './styles/Modal.css'

/**
 * Modal — centered dialog for non-destructive tasks (forms, previews, comparisons)
 *
 * Props:
 *   open, onClose
 *   title, subtitle
 *   size            — 'sm' 400 | 'md' 560 (default) | 'lg' 760 | 'xl' 960
 *   footer          — buttons (primary + ghost)
 *   error           — banner under the header
 *   closeOnOverlay  — default true
 *   showClose       — default true
 *   layer           — 'modal' (default) | 'confirm' (used by ConfirmDialog, renders above)
 *   ariaLabel       — accessible name when there is no title
 *   className       — extra class on the panel
 *
 * Owns: portal, overlay, scroll lock, Escape, focus on open, focus trap, focus restore.
 * Add data-autofocus to the element that should receive focus first.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusable = (root) =>
  Array.from(root?.querySelectorAll(FOCUSABLE) || []).filter((el) => el.offsetParent !== null)

function Modal({
  open,
  onClose,
  title,
  subtitle,
  size           = 'md',
  footer,
  error,
  closeOnOverlay = true,
  showClose      = true,
  layer          = 'modal',
  ariaLabel,
  className      = '',
  children,
}) {
  const { t } = useTranslation()

  const panelRef = useRef(null)
  const titleId  = useId()

  useScrollLock(open)
  useEscape(open, () => onClose?.())

  useEffect(() => {
    if (!open) return undefined

    const previous = document.activeElement
    const frame = requestAnimationFrame(() => {
      const panel  = panelRef.current
      const target = panel?.querySelector('[data-autofocus]')
        || getFocusable(panel?.querySelector('.modal__body'))[0]
        || getFocusable(panel)[0]
        || panel
      target?.focus()
    })

    return () => {
      cancelAnimationFrame(frame)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open])

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return

    const nodes = getFocusable(panelRef.current)
    if (!nodes.length) {
      e.preventDefault()
      return
    }

    const first = nodes[0]
    const last  = nodes[nodes.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  const hasHeader = title || subtitle || showClose

  return createPortal(
    <div
      className={`modal modal--${layer}`}
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={`modal__panel modal__panel--${size} ${className}`}
        onKeyDown={handleKeyDown}
      >
        {hasHeader && (
          <div className="modal__header">
            <div className="modal__heading">
              {title && <h2 id={titleId} className="modal__title">{title}</h2>}
              {subtitle && <p className="modal__subtitle">{subtitle}</p>}
            </div>
            {showClose && (
              <button type="button" className="modal__close" onClick={onClose} aria-label={t('common.close')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="modal__error" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div className="modal__body">{children}</div>

        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal