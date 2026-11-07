import { useTranslation } from 'react-i18next'
import { Card, EmptyState, ProgressBar, Skeleton, StatusBadge } from '../common'
import './styles/ActiveJobs.css'

/**
 * ActiveJobs — generation jobs currently running or waiting on a provider
 *
 * Props:
 *   jobs    — [{ id, label, project, provider, status, progress (number | null) }]
 *   loading — boolean
 */
function ActiveJobs({ jobs = [], loading = false }) {
  const { t } = useTranslation()

  return (
    <Card title={t('dashboard.jobs.title')} subtitle={t('dashboard.jobs.subtitle')}>
      {loading && (
        <div className="job-list__loading" aria-busy="true">
          {[0, 1].map((index) => <Skeleton key={index} lines={2} />)}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <EmptyState title={t('dashboard.jobs.empty')} />
      )}

      {!loading && jobs.length > 0 && (
        <ul className="job-list">
          {jobs.map((job) => {
            const hasProgress = job.progress !== null && job.progress !== undefined

            return (
              <li key={job.id} className="job-list__item">
                <div className="job-list__header">
                  <div className="job-list__text">
                    <span className="job-list__label">{job.label}</span>
                    <span className="job-list__meta">{job.provider} · {job.project}</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <ProgressBar
                  value={hasProgress ? job.progress : 0}
                  indeterminate={!hasProgress}
                  tone={job.status === 'WAITING' ? 'info' : 'orange'}
                  size="sm"
                />
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

export default ActiveJobs