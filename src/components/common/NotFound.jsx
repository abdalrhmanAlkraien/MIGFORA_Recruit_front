import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormButton } from '../common'
import './styles/NotFound.css'
import useLanguageStore from '../../store/useLanguageStore'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { lang } = useLanguageStore()
  const isRTL = lang === 'ar'

  return (
    <div className="not-found" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="not-found__content">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">{t('not_found.title')}</h1>
        <p className="not-found__subtitle">{t('not_found.subtitle')}</p>
        <FormButton variant="primary" onClick={() => navigate('/dashboard')}>
          {t('not_found.back_home')}
        </FormButton>
      </div>
    </div>
  )
}