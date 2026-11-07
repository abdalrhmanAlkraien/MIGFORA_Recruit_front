import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatBytes, matchesAccept } from '../../utils/file'
import './styles/UploadDropzone.css'

/**
 * UploadDropzone — drag & drop or browse. Validates files; never uploads them.
 *
 * Props:
 *   onFiles   — (File[]) => void — accepted files; the consumer uploads and renders FileItem rows
 *   onReject  — ([{ file, reason }]) => void — optional; reason: 'type' | 'size' | 'count'
 *   accept    — same syntax as <input accept>, e.g. 'image/*,.pdf'
 *   multiple  — default true
 *   maxSize   — bytes per file
 *   maxFiles  — max files per drop / selection
 *   disabled
 *   title     — overrides the default title
 *   hint      — overrides the generated "Accepted / Max size" hint
 *   compact   — single-row layout for drawers and side panels
 */
function UploadDropzone({
  onFiles,
  onReject,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  disabled = false,
  title,
  hint,
  compact  = false,
}) {
  const { t } = useTranslation()

  const inputRef  = useRef(null)
  const dragDepth = useRef(0)

  const [isDragging, setIsDragging] = useState(false)
  const [rejections, setRejections] = useState([])

  const processFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    const limit    = multiple ? (maxFiles ?? Infinity) : 1
    const accepted = []
    const rejected = []

    files.forEach((file) => {
      if (!matchesAccept(file, accept))                     rejected.push({ file, reason: 'type' })
      else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' })
      else if (accepted.length >= limit)                     rejected.push({ file, reason: 'count' })
      else                                                   accepted.push(file)
    })

    setRejections(rejected)
    if (accepted.length) onFiles?.(accepted)
    if (rejected.length) onReject?.(rejected)
  }

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    if (disabled) return
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    if (!disabled) processFiles(e.dataTransfer.files)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPicker()
    }
  }

  const rejectionMessage = ({ file, reason }) => {
    if (reason === 'size')  return t('upload.error_size', { name: file.name, max: formatBytes(maxSize) })
    if (reason === 'count') return t('upload.error_count', { name: file.name, max: multiple ? maxFiles : 1 })
    return t('upload.error_type', { name: file.name })
  }

  const generatedHint = [
    accept ? t('upload.hint_types', { types: accept.split(',').map((s) => s.trim()).join(', ') }) : '',
    maxSize !== undefined ? t('upload.hint_size', { max: formatBytes(maxSize) }) : '',
  ].filter(Boolean).join(' · ')

  const classes = [
    'upload-dropzone',
    compact ? 'upload-dropzone--compact' : '',
    isDragging ? 'upload-dropzone--dragging' : '',
    disabled ? 'upload-dropzone--disabled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="upload-dropzone-wrap">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={classes}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="upload-dropzone__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </span>

        <span className="upload-dropzone__text">
          <span className="upload-dropzone__title">
            {title || (isDragging ? t('upload.drop_here') : (
              <>
                {t('upload.title')}{' '}
                <span className="upload-dropzone__browse">{t('upload.browse')}</span>
              </>
            ))}
          </span>
          {(hint || generatedHint) && (
            <span className="upload-dropzone__hint">{hint || generatedHint}</span>
          )}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="upload-dropzone__input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        onChange={(e) => {
          processFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {rejections.length > 0 && (
        <ul className="upload-dropzone__errors" role="alert">
          {rejections.map((rejection) => (
            <li key={`${rejection.file.name}-${rejection.reason}`}>{rejectionMessage(rejection)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UploadDropzone