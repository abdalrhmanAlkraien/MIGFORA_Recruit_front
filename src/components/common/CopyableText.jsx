import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useToastStore from '../../store/useToastStore'
import Tooltip from './Tooltip'
import './styles/CopyableText.css'

/**
 * CopyableText — ID, hash or key with a copy button
 *
 * Props:
 *   value     — what gets copied
 *   children  — optional display (defaults to value)
 *   mono      — monospace (default true)
 *   size      — 'sm' | 'md' (default)
 */
function CopyableText({ value, children, mono = true, size = 'md' }) {
  const { addToast } = useToastStore()
  const { t } = useTranslation()

  const timerRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      addToast(t('copy.failed'), 'error')
    }
  }

  const actionLabel = copied ? t('copy.copied') : t('copy.copy')

  return (
    <span className={`copyable copyable--${size} ${mono ? 'copyable--mono' : ''}`}>
      <span className="copyable__text" title={String(value)}>{children ?? value}</span>

      <Tooltip content={actionLabel} delay={150}>
        <button
          type="button"
          className={`copyable__button ${copied ? 'copyable__button--copied' : ''}`}
          onClick={handleCopy}
          aria-label={actionLabel}
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
        </button>
      </Tooltip>
    </span>
  )
}

export default CopyableText