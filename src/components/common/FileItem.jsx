import { useTranslation } from 'react-i18next'
import { formatBytes, getFileKind } from '../../utils/file'
import './styles/FileItem.css'

/**
 * FileItem — one file row: thumbnail / type icon, name, size, status, progress, actions
 *
 * Props:
 *   name, size (bytes), type (mime)
 *   previewUrl — image thumbnail (consumer creates it with URL.createObjectURL and revokes it)
 *   status     — 'pending' | 'uploading' | 'done' | 'error'
 *   progress   — 0–100 while uploading
 *   error      — message when status is 'error'
 *   meta       — extra mono text, e.g. reference ID "REF-CHAR-004-03"
 *   onRemove   — removes the row. For files already stored on the server, open a ConfirmDialog first.
 *   onRetry    — shown when status is 'error'
 */

const icon = (children) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {children}
  </svg>
)

const KIND_ICONS = {
  image: icon(<>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </>),
  video: icon(<>
    <rect x="2" y="5" width="15" height="14" rx="2"/>
    <polygon points="22 7 17 12 22 17 22 7"/>
  </>),
  audio: icon(<>
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </>),
  document: icon(<>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </>),
  other: icon(<>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </>),
}

function FileItem({
  name,
  size,
  type,
  previewUrl,
  status   = 'done',
  progress = 0,
  error,
  meta,
  onRemove,
  onRetry,
}) {
  const { t } = useTranslation()

  const kind = getFileKind(type, name)

  const statusText = {
    pending:   t('file.pending'),
    uploading: t('file.uploading', { progress: Math.round(progress) }),
    done:      t('file.done'),
    error:     error || t('file.failed'),
  }[status]

  return (
    <div className={`file-item file-item--${status}`}>
      <div className="file-item__thumb">
        {previewUrl
          ? <img src={previewUrl} alt="" className="file-item__image" />
          : <span className="file-item__kind">{KIND_ICONS[kind]}</span>}
      </div>

      <div className="file-item__body">
        <div className="file-item__top">
          <span className="file-item__name" title={name}>{name}</span>
          {meta && <span className="file-item__meta">{meta}</span>}
        </div>

        <div className="file-item__details">
          {size !== undefined && <span>{formatBytes(size)}</span>}
          <span className="file-item__status">{statusText}</span>
        </div>

        {status === 'uploading' && (
          <progress className="file-item__progress" value={progress} max={100} aria-label={name} />
        )}
      </div>

      <div className="file-item__actions">
        {status === 'error' && onRetry && (
          <button
            type="button"
            className="file-item__action"
            onClick={onRetry}
            aria-label={t('file.retry')}
            title={t('file.retry')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            className="file-item__action file-item__action--remove"
            onClick={onRemove}
            aria-label={t('file.remove')}
            title={t('file.remove')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default FileItem