import { useTranslation } from 'react-i18next'
import { Avatar, Card, EmptyState, RelativeTime, Skeleton } from '../common'
import './styles/RecentActivity.css'

/**
 * RecentActivity — latest workspace events
 *
 * Props:
 *   activity — [{ id, actor, action, target, project, at }]
 *              action: submitted | approved | requested_changes | locked | generated | invited
 *   loading  — boolean
 */
function RecentActivity({ activity = [], loading = false }) {
  const { t } = useTranslation()

  return (
    <Card title={t('dashboard.activity.title')}>
      {loading && (
        <div className="activity-list__loading" aria-busy="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="activity-list__skeleton">
              <Skeleton variant="circle" size="sm" />
              <Skeleton lines={2} />
            </div>
          ))}
        </div>
      )}

      {!loading && activity.length === 0 && (
        <EmptyState title={t('dashboard.activity.empty')} />
      )}

      {!loading && activity.length > 0 && (
        <ul className="activity-list">
          {activity.map((item) => (
            <li key={item.id} className="activity-list__item">
              <Avatar name={item.actor} size="sm" />

              <div className="activity-list__body">
                <p className="activity-list__text">
                  <span className="activity-list__actor">{item.actor}</span>
                  {' '}{t(`dashboard.activity.${item.action}`, { defaultValue: item.action })}{' '}
                  <span className="activity-list__target">{item.target}</span>
                </p>
                <span className="activity-list__meta">
                  {item.project} · <RelativeTime value={item.at} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default RecentActivity