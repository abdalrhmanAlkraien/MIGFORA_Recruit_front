import { useTranslation } from 'react-i18next'
import './styles/StatusBadge.css'

/**
 * StatusBadge
 *
 * Props:
 *   status — key from STATUS_VARIANT_MAP (unknown → neutral)
 *   label  — overrides t('status.<STATUS>')
 *
 * Variants: success · warning · danger · info · neutral · locked (lock icon) ·
 *           role (no dot) · format (no dot) · package-*
 */
const STATUS_VARIANT_MAP = {
  // success
  DONE: 'success', ACTIVE: 'success', COMPLETED: 'success', PASSED: 'success', APPROVED: 'success',
  // warning
  SCHEDULED: 'warning', PENDING: 'warning', RUNNING: 'warning', UPLOADING: 'warning',
  CHANGES_REQUESTED: 'warning', NEEDS_REVALIDATION: 'warning',
  // danger
  FAILED: 'danger', MISSED: 'danger', CRITICAL: 'danger', HIGH: 'danger', REJECTED: 'danger',
  // info
  MEDIUM: 'info', IN_REVIEW: 'info', WAITING: 'info',
  // neutral
  DRAFT: 'neutral', UNKNOWN: 'neutral', LOW: 'neutral', QUEUED: 'neutral',
  CANCELLED: 'neutral', SUPERSEDED: 'neutral', RETIRED: 'neutral',
  // locked baseline
  LOCKED: 'locked',
  // workspace roles
  OWNER: 'role', VIEW: 'role', EDIT: 'role', REVIEW: 'role',
  // project formats
  FILM: 'format', SERIES: 'format', SHORT_STORIES: 'format',
  // packages
  BASIC: 'package-basic', GROWTH: 'package-growth', ENTERPRISE: 'package-enterprise',
}

const NO_DOT_VARIANTS = ['role', 'format', 'locked']

function StatusBadge({ status, label }) {
  const { t } = useTranslation()

  const key          = status?.toUpperCase()
  const variant      = STATUS_VARIANT_MAP[key] || 'neutral'
  const displayLabel = label || t(`status.${key}`, { defaultValue: status?.replaceAll('_', ' ') || '—' })

  return (
    <span className={`status-badge status-badge--${variant}`}>
      {variant === 'locked' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2"/>
          <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
        </svg>
      )}
      {!NO_DOT_VARIANTS.includes(variant) && <span className="status-badge__dot" />}
      {displayLabel}
    </span>
  )
}

export default StatusBadge