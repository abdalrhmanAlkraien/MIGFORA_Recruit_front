import { useTranslation } from 'react-i18next'
import './styles/Spinner.css'

function Spinner({ size = 'md', color = 'orange', label }) {
  const { t } = useTranslation()

  return (
    <div
      className={`spinner spinner--${size} spinner--${color}`}
      role="status"
      aria-label={label || t('common.loading')}
    />
  )
}

export default Spinner