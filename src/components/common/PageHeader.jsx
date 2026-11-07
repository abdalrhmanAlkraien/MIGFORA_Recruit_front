import useLanguageStore from '../../store/useLanguageStore'
import Breadcrumbs from './Breadcrumbs'
import './styles/PageHeader.css'

/**
 * PageHeader — page title row
 *
 * Props:
 *   title, subtitle
 *   action       — buttons (primary + outline)
 *   breadcrumbs  — [{ label, to? }] rendered above the title
 *   meta         — node under the title: ArtifactId, StatusBadge, version, RelativeTime…
 */
function PageHeader({ title, subtitle, action, breadcrumbs, meta }) {
  const { lang } = useLanguageStore()
  const isRTL = lang === 'ar'

  const text = (
    <div className="page-header__text" style={isRTL ? { textAlign: 'right' } : undefined}>
      <h1 className="page-header__title">{title}</h1>
      {meta && <div className="page-header__meta">{meta}</div>}
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </div>
  )

  const actionNode = action && <div className="page-header__action">{action}</div>

  return (
    <div className="page-header">
      {breadcrumbs?.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <div className="page-header__row" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        {isRTL ? <>{actionNode}{text}</> : <>{text}{actionNode}</>}
      </div>
    </div>
  )
}

export default PageHeader