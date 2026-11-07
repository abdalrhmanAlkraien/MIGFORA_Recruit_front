import useLanguageStore from '../../store/useLanguageStore'
import './styles/EmptyState.css'

function EmptyState({ icon, title, subtitle, action }) {
  const { lang } = useLanguageStore()
  const isRTL = lang === 'ar'

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon || (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        )}
      </div>

      <p className="empty-state__title">{title}</p>

      {subtitle && (
        <p
          className="empty-state__subtitle"
          style={{ unicodeBidi: 'plaintext', textAlign: isRTL ? 'right' : 'center' }}
        >
          {subtitle}
        </p>
      )}

      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}

export default EmptyState