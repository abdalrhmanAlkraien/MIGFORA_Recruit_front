import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/useThemeStore'
import useLanguageStore from '../store/useLanguageStore'
import { FormButton } from './common'
import './styles/Navbar.css'

const FLAGS = {
  en: (
    <svg width="20" height="15" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  ),
  ar: (
    <svg width="20" height="15" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#006C35" />
      <text x="30" y="22" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial">٢٣</text>
      <rect x="8" y="28" width="44" height="2" fill="white" />
    </svg>
  ),
}

const LANG_LABELS = { en: 'EN', ar: 'AR' }

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { token, clearAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  // const { lang, toggleLang } = useLanguageStore()
  const { lang, toggleLang, isEnabled: isLangEnabled } = useLanguageStore()

  const isRTL = lang === 'ar'

  console.log('Navbar lang:', lang, 'isRTL:', isRTL)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const hamburger = (
    <button
      className="navbar__icon-btn navbar__hamburger-btn"
      onClick={onToggleSidebar}
      title={t('navbar.toggle_sidebar')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  )

  const logo = (
    <Link to="/dashboard" className="navbar__logo">
      MIG<span className="navbar__logo-accent">FORA</span>
    </Link>
  )

  const langBtn = (
    <button
      className="navbar__lang-btn"
      onClick={toggleLang}
      title={lang === 'en' ? t('navbar.switch_arabic') : t('navbar.switch_english')}
    >
      <span className="navbar__lang-flag">{FLAGS[lang]}</span>
      <span className="navbar__lang-code">{LANG_LABELS[lang]}</span>
    </button>
  )

  const themeBtn = (
    <button
      className="navbar__icon-btn navbar__theme-btn"
      onClick={toggleTheme}
      title={theme === 'dark' ? t('navbar.switch_light') : t('navbar.switch_dark')}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )

  const logoutBtn = token ? (
    <FormButton variant="outline" onClick={handleLogout}>{t('navbar.logout')}</FormButton>
  ) : (
    <FormButton variant="primary" onClick={() => navigate('/login')}>{t('navbar.login')}</FormButton>
  )

  return (
    <nav className="navbar" key={lang}>
      {isRTL ? (
        <>
          <div className="navbar__actions">
            {logoutBtn}
            {themeBtn}
            {isLangEnabled && langBtn}
          </div>
          <div className="navbar__left navbar__left--pushed">
            {logo}
            {hamburger}
          </div>
        </>
      ) : (
        <>
          <div className="navbar__left">
            {hamburger}
            {logo}
          </div>
          <div className="navbar__actions">
            {isLangEnabled && langBtn}
            {themeBtn}
            {logoutBtn}
          </div>
        </>
      )}
    </nav>
  )
}