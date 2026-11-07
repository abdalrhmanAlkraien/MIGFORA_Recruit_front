import { useTranslation } from 'react-i18next'
import { formatCurrency, formatNumber } from '../../utils/number'
import { Card, ProgressBar, Skeleton } from '../common'
import './styles/StatsRow.css'

/**
 * StatsRow — four headline numbers for the workspace
 *
 * Props:
 *   stats   — { activeProjects, activeProjectsChange, pendingDecisions, runningJobs,
 *              queuedJobs, spendThisMonth, budgetThisMonth }
 *   loading — boolean
 */
const icon = (children) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {children}
  </svg>
)

const ICONS = {
  projects: icon(<>
    <rect x="2" y="4" width="20" height="14" rx="2"/>
    <polygon points="10 8 15 11 10 14 10 8"/>
  </>),
  decisions: icon(<>
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </>),
  jobs: icon(<>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </>),
  spend: icon(<>
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </>),
}

const getBudgetTone = (percent) => {
  if (percent >= 90) return 'danger'
  if (percent >= 70) return 'warning'
  return 'orange'
}

function StatsRow({ stats, loading = false }) {
  const { t, i18n } = useTranslation()

  const lang          = i18n.language
  const spend         = stats?.spendThisMonth ?? 0
  const budget        = stats?.budgetThisMonth ?? 0
  const budgetPercent = budget > 0 ? (spend / budget) * 100 : 0

  const items = [
    {
      key:   'projects',
      tone:  'brand',
      label: t('dashboard.stats.active_projects'),
      value: formatNumber(stats?.activeProjects, lang),
      hint:  t('dashboard.stats.projects_change', { count: stats?.activeProjectsChange ?? 0 }),
    },
    {
      key:   'decisions',
      tone:  stats?.pendingDecisions > 0 ? 'warning' : 'neutral',
      label: t('dashboard.stats.pending_decisions'),
      value: formatNumber(stats?.pendingDecisions, lang),
      hint:  t('dashboard.stats.decisions_hint'),
    },
    {
      key:   'jobs',
      tone:  'info',
      label: t('dashboard.stats.running_jobs'),
      value: formatNumber(stats?.runningJobs, lang),
      hint:  t('dashboard.stats.queued_jobs', { count: stats?.queuedJobs ?? 0 }),
    },
    {
      key:      'spend',
      tone:     budgetPercent >= 90 ? 'danger' : 'success',
      label:    t('dashboard.stats.spend_this_month'),
      value:    formatCurrency(spend, { lang }),
      hint:     t('dashboard.stats.budget_of', { budget: formatCurrency(budget, { lang }) }),
      progress: budget > 0,
    },
  ]

  return (
    <div className="stats-row" aria-busy={loading}>
      {items.map((item) => (
        <Card key={item.key} className="stat-card">
          <div className="stat-card__content">
            <div className="stat-card__top">
              <span className="stat-card__label">{item.label}</span>
              <span className={`stat-card__icon stat-card__icon--${item.tone}`} aria-hidden="true">
                {ICONS[item.key]}
              </span>
            </div>

            {loading ? (
              <>
                <Skeleton size="sm" />
                <Skeleton size="lg" />
              </>
            ) : (
              <>
                <span className="stat-card__value">{item.value}</span>
                {item.progress && (
                  <ProgressBar value={spend} max={budget} size="sm" tone={getBudgetTone(budgetPercent)} />
                )}
                <span className="stat-card__hint">{item.hint}</span>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StatsRow