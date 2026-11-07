import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMonth } from '../../utils/date'
import { formatCurrency } from '../../utils/number'
import { Card, EmptyState, Skeleton } from '../common'
import './styles/SpendChart.css'

/**
 * SpendChart — generation spend per month (colors come from CSS tokens)
 *
 * Props:
 *   spend   — [{ month: 'YYYY-MM', amount }]
 *   loading — boolean
 */
function SpendTooltip({ active, payload, label }) {
  const { i18n } = useTranslation()
  if (!active || !payload?.length) return null

  return (
    <div className="spend-chart__tooltip">
      <span className="spend-chart__tooltip-label">{label}</span>
      <span className="spend-chart__tooltip-value">
        {formatCurrency(payload[0].value, { lang: i18n.language })}
      </span>
    </div>
  )
}

function SpendChart({ spend = [], loading = false }) {
  const { t, i18n } = useTranslation()

  const lang = i18n.language
  const data = spend.map((item) => ({ label: formatMonth(item.month, lang), amount: item.amount }))

  return (
    <Card title={t('dashboard.spend.title')} subtitle={t('dashboard.spend.subtitle')}>
      {loading && <Skeleton variant="rect" size="lg" />}

      {!loading && data.length === 0 && (
        <EmptyState title={t('dashboard.spend.empty')} />
      )}

      {!loading && data.length > 0 && (
        <div className="spend-chart">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={(value) => formatCurrency(value, { lang, compact: true })}
              />
              <Tooltip content={<SpendTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export default SpendChart