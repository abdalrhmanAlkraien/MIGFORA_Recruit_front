import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDateTime, formatRelative, toDate } from '../../utils/date'
import Tooltip from './Tooltip'
import './styles/RelativeTime.css'

/**
 * RelativeTime — "3 minutes ago" with the full timestamp in a tooltip
 *
 * Props:
 *   value           — ISO string | Date | timestamp
 *   updateInterval  — ms between refreshes (default 60000; 0 disables)
 *   showTooltip     — default true
 */
const JUST_NOW_MS = 45000

function RelativeTime({ value, updateInterval = 60000, showTooltip = true }) {
  const { t, i18n } = useTranslation()

  const [, setTick] = useState(0)

  useEffect(() => {
    if (!updateInterval) return undefined
    const id = setInterval(() => setTick((n) => n + 1), updateInterval)
    return () => clearInterval(id)
  }, [updateInterval])

  const date = toDate(value)
  if (!date) return <span className="relative-time relative-time--empty">—</span>

  const lang  = i18n.language
  const label = Math.abs(Date.now() - date.getTime()) < JUST_NOW_MS
    ? t('time.just_now')
    : formatRelative(date, lang)

  const node = (
    <time className="relative-time" dateTime={date.toISOString()}>
      {label}
    </time>
  )

  return showTooltip ? <Tooltip content={formatDateTime(date, lang)}>{node}</Tooltip> : node
}

export default RelativeTime