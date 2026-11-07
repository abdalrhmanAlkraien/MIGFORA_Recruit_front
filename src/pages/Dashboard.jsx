import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import appConfig from '../config/appConfig'
import { getDashboardSummaryApi } from '../api/dashboard'
import { FormAlert, FormButton, PageHeader } from '../components/common'
import StatsRow from '../components/dashboard/StatsRow'
import ProjectsInProgress from '../components/dashboard/ProjectsInProgress'
import SpendChart from '../components/dashboard/SpendChart'
import PendingDecisions from '../components/dashboard/PendingDecisions'
import ActiveJobs from '../components/dashboard/ActiveJobs'
import RecentActivity from '../components/dashboard/RecentActivity'
import './styles/Dashboard.css'

/**
 * Dashboard — workspace home (M01-F04)
 * Stats, projects in progress, spend, pending decisions, active jobs, recent activity.
 */
function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const loadSummary = () => {
    setLoading(true)
    setError('')
    getDashboardSummaryApi()
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.response?.data?.[appConfig.auth.messageKey] || t('common.error')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSummary() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="dashboard">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.greeting', { name: user?.name || '' })}
        action={
          <>
            <FormButton variant="outline" onClick={loadSummary} disabled={loading}>
              {t('dashboard.refresh')}
            </FormButton>
            {/* /projects/new is added with the Projects page */}
            <FormButton variant="primary" onClick={() => navigate('/projects/new')}>
              {t('dashboard.new_project')}
            </FormButton>
          </>
        }
      />

      <FormAlert type="error" message={error} />

      <StatsRow stats={summary?.stats} loading={loading} />

      <div className="dashboard__grid">
        <div className="dashboard__column">
          <ProjectsInProgress projects={summary?.projects || []} loading={loading} />
          <SpendChart spend={summary?.spend || []} loading={loading} />
        </div>

        <div className="dashboard__column">
          <PendingDecisions decisions={summary?.decisions || []} loading={loading} />
          <ActiveJobs jobs={summary?.jobs || []} loading={loading} />
          <RecentActivity activity={summary?.activity || []} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard