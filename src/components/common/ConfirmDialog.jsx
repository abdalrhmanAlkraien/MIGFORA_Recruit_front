import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import FormButton from './FormButton'
import FormField from './FormField'
import './styles/ConfirmDialog.css'

/**
 * ConfirmDialog — confirmation for destructive or irreversible actions
 *
 * Props:
 *   isOpen, title, message, onConfirm, onCancel
 *   confirmLabel  — default t('common.confirm')
 *   cancelLabel   — default t('confirm_dialog.cancel')
 *   isDanger      — default true → danger button + red icon; false → primary button + info icon
 *   loading       — disables both buttons, confirm shows the loading label
 *   requireText   — user must type this exact text first (e.g. project name, "LOCK")
 *
 * Renders above Drawers and Modals. Cancel is focused first.
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  isDanger = true,
  loading  = false,
  requireText,
}) {
  const { t } = useTranslation()

  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (isOpen) setTyped('')
  }, [isOpen])

  const canConfirm   = !loading && (!requireText || typed === requireText)
  const handleCancel = () => { if (!loading) onCancel?.() }

  return (
    <Modal
      open={isOpen}
      onClose={handleCancel}
      size="sm"
      layer="confirm"
      showClose={false}
      ariaLabel={title}
      className="confirm-dialog"
      footer={
        <>
          <FormButton variant="ghost" onClick={handleCancel} disabled={loading} fullWidth>
            {cancelLabel || t('confirm_dialog.cancel')}
          </FormButton>
          <FormButton
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={!canConfirm}
            loading={loading}
            fullWidth
          >
            {confirmLabel || t('common.confirm')}
          </FormButton>
        </>
      }
    >
      <div className="confirm-dialog__content">
        <div className={`confirm-dialog__icon confirm-dialog__icon--${isDanger ? 'danger' : 'info'}`}>
          {isDanger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9"  x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8"  x2="12.01" y2="8"/>
            </svg>
          )}
        </div>

        <h3 className="confirm-dialog__title">{title}</h3>
        {message && <p className="confirm-dialog__message">{message}</p>}

        {requireText && (
          <div className="confirm-dialog__require">
            <FormField
              label={t('confirm_dialog.type_to_confirm', { text: requireText })}
              name="confirm-require-text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ConfirmDialog