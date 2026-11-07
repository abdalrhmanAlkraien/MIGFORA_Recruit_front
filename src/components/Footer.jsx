import { useTranslation } from 'react-i18next'
import './styles/Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <span className="footer__copy">
        © {new Date().getFullYear()}{' '}
        <span className="footer__brand">
          MIG<span className="footer__accent">FORA</span>
        </span>
      </span>
      <span className="footer__tagline">
        {t('footer.tagline')}
      </span>
    </footer>
  )
}