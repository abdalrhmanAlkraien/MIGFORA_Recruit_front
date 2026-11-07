import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useLanguageStore from '../../store/useLanguageStore'
import Tooltip from './Tooltip'
import './styles/Breadcrumbs.css'

/**
 * Breadcrumbs — hierarchy trail (Project › Chapter 2 › Scene 4 › Shot 12)
 *
 * Props:
 *   items     — [{ label, to? }] — the last item is the current page
 *   maxItems  — collapse middle items into "…" above this count (default 4)
 */
function Breadcrumbs({ items = [], maxItems = 4 }) {
  const { lang } = useLanguageStore()
  const { t } = useTranslation()

  const isRTL     = lang === 'ar'
  const tailCount = Math.max(1, maxItems - 2)

  const visible = items.length > maxItems
    ? [
        items[0],
        { label: '…', ellipsis: true, hidden: items.slice(1, items.length - tailCount) },
        ...items.slice(items.length - tailCount),
      ]
    : items

  return (
    <nav className="breadcrumbs" aria-label={t('breadcrumbs.label')}>
      <ol className="breadcrumbs__list">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1

          return (
            <li key={`${item.label}-${index}`} className="breadcrumbs__item">
              {item.ellipsis && (
                <Tooltip content={item.hidden.map((h) => h.label).join(' › ')}>
                  <span className="breadcrumbs__ellipsis">…</span>
                </Tooltip>
              )}

              {!item.ellipsis && (isLast || !item.to) && (
                <span className="breadcrumbs__current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}

              {!item.ellipsis && !isLast && item.to && (
                <Link to={item.to} className="breadcrumbs__link">{item.label}</Link>
              )}

              {!isLast && (
                <span className={`breadcrumbs__separator ${isRTL ? 'breadcrumbs__separator--rtl' : ''}`} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs