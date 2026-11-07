import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import useLanguageStore from '../../store/useLanguageStore'
import useScrollLock from '../../hooks/useScrollLock'
import './styles/Drawer.css'
import useEscape from '../../hooks/useEscape'

/**
 * Drawer — slide-in panel shell
 *
 * Props:
 *   open, title, onClose
 *   subtitle  — optional line under the title
 *   size      — 'sm' 360px | 'md' 440px | 'lg' 600px | 'xl' 860px
 *   error     — banner under the header
 *   footer    — buttons (primary + ghost)
 *
 * Owns: portal, overlay, scroll lock, Escape (via escape stack), slide transition.
 */
function Drawer({ open, title, subtitle, onClose, size = 'md', footer, error, children }) {
  const { lang } = useLanguageStore()
  const { t } = useTranslation()

  useScrollLock(open)
  useEscape(open, () => onClose?.())

  const isRTL = lang === 'ar'

  const drawerClasses = [
    'drawer',
    `drawer--${size}`,
    isRTL ? 'drawer--rtl' : '',
    open ? 'drawer--open' : '',
  ].filter(Boolean).join(' ')

  return createPortal(
    <>
      <div
        className={`drawer__overlay ${open ? 'drawer__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={drawerClasses} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}>
        <div className="drawer__header">
          <div className="drawer__heading">
            <h2 className="drawer__title">{title}</h2>
            {subtitle && <p className="drawer__subtitle">{subtitle}</p>}
          </div>
          <button className="drawer__close" onClick={onClose} aria-label={t('common.close')}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="drawer__error" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div className="drawer__body">{children}</div>

        {footer && <div className="drawer__footer">{footer}</div>}
      </div>
    </>,
    document.body
  )
}

export default Drawer