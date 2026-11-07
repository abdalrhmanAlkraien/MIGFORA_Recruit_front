import { useTranslation } from 'react-i18next'
import './styles/FormButton.css'

function FormButton({
  variant     = 'primary',
  type        = 'button',
  loading     = false,
  loadingText,
  disabled    = false,
  fullWidth   = false,
  onClick,
  children,
}) {
  const { t } = useTranslation()

  const classes = [
    'form-btn',
    `form-btn--${variant}`,
    fullWidth ? 'form-btn--full' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (loadingText || t('common.loading')) : children}
    </button>
  )
}

export default FormButton