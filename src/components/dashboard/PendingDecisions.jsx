import { useTranslation } from 'react-i18next'
import { Card, CopyableText, EmptyState, RelativeTime, Skeleton, StatusBadge } from '../common'
import './styles/PendingDecisions.css'

/**
 * PendingDecisions — artifact versions waiting for the current user's decision
 *
 * Props:
 *   decisions — [{ id, artifactType, project, status, submittedAt }]
 *   loading   — boolean
 */
function PendingDecisions({ decisions = [], loading = false }) {
  const { t } = useTranslation()

  return (
    <Card title={t('dashboard.decisions.title')} subtitle={t('dashboard.decisions.subtitle')}>
      {loading && (
        <div className="decision-list__loading" aria-busy="true">
          {[0, 1, 2].map((index) => <Skeleton key={index} lines={2} />)}
        </div>
      )}

      {!loading && decisions.length === 0 && (
        <EmptyState title={t('dashboard.decisions.empty')} />
      )}

      {!loading && decisions.length > 0 && (
        <ul className="decision-list">
          {decisions.map((item) => (
            <li key={item.id} className="decision-list__item">
              <div className="decision-list__main">
                <span className="decision-list__title">{item.artifactType}</span>
                <span className="decision-list__meta">
                  <CopyableText value={item.id} size="sm" />
                  <span className="decision-list__project">{item.project}</span>
                </span>
              </div>

              <div className="decision-list__side">
                <StatusBadge status={item.status} />
                <span className="decision-list__time">
                  <RelativeTime value={item.submittedAt} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default PendingDecisions