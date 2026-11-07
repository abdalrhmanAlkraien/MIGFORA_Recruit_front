import { useTranslation } from 'react-i18next'
import { Card, DataTable, EmptyState, ProgressBar, RelativeTime, StatusBadge } from '../common'
import './styles/ProjectsInProgress.css'

/**
 * ProjectsInProgress — workspace projects with format, stage and progress
 *
 * Props:
 *   projects — [{ id, name, format, stage, progress, updatedAt }]
 *   loading  — boolean
 */
function ProjectsInProgress({ projects = [], loading = false }) {
  const { t } = useTranslation()

  const columns = [
    {
      key:      'name',
      header:   t('dashboard.projects.project'),
      sortable: true,
      render:   (row) => (
        <span className="projects-table__name">
          <span className="projects-table__title">{row.name}</span>
          <span className="projects-table__id">{row.id}</span>
        </span>
      ),
    },
    {
      key:    'format',
      header: t('dashboard.projects.format'),
      render: (row) => <StatusBadge status={row.format} />,
    },
    {
      key:       'stage',
      header:    t('dashboard.projects.stage'),
      className: 'projects-table__stage',
      render:    (row) => t(`dashboard.stage.${row.stage}`, { defaultValue: row.stage }),
    },
    {
      key:       'progress',
      header:    t('dashboard.projects.progress'),
      sortable:  true,
      className: 'projects-table__progress',
      render:    (row) => <ProgressBar value={row.progress} size="sm" showValue />,
    },
    {
      key:       'updatedAt',
      header:    t('dashboard.projects.updated'),
      sortable:  true,
      className: 'projects-table__updated',
      sortValue: (row) => new Date(row.updatedAt).getTime(),
      render:    (row) => <RelativeTime value={row.updatedAt} />,
    },
  ]

  return (
    <Card
      title={t('dashboard.projects.title')}
      subtitle={t('dashboard.projects.subtitle')}
      padding="none"
    >
      <DataTable
        name="dashboard-projects"
        columns={columns}
        rows={projects}
        loading={loading}
        skeletonRows={4}
        emptyState={
          <EmptyState
            title={t('dashboard.projects.empty_title')}
            subtitle={t('dashboard.projects.empty_subtitle')}
          />
        }
      />
    </Card>
  )
}

export default ProjectsInProgress