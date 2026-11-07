import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import appConfig from '../config/appConfig'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/useThemeStore'
import { loginApi } from '../api/auth'
import { FormButton, FormAlert } from '../components/common'
import './styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [showPass, setShowPass]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res   = await loginApi({ [appConfig.loginIdentifier]: identifier, password })
      const data  = res.data
      setAuth(data[appConfig.auth.tokenKey], data[appConfig.auth.userKey])
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.[appConfig.auth.messageKey] || t('errors.login_failed')
      )
    } finally {
      setLoading(false)
    }
  }

  const identifierLabel = {
    email:    t('auth.login.email_label'),
    username: t('auth.login.username_label'),
    phone:    t('auth.login.phone_label'),
  }[appConfig.loginIdentifier]

  const identifierType = {
    email: 'email', username: 'text', phone: 'tel',
  }[appConfig.loginIdentifier]

  return (
    <div className="auth-card">

      <div className="auth-card__logo">
        MIG<span className="auth-card__logo-accent">FORA</span>
      </div>

      <div className="auth-card__heading">
        <h1 className="auth-card__title">{t('auth.login.title')}</h1>
        <p className="auth-card__subtitle">{t('auth.login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-card__form">

        <div className="auth-field">
          <label className="auth-field__label">{identifierLabel}</label>
          <input
            className="auth-field__input"
            type={identifierType}
            placeholder={`${identifierLabel}...`}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label">{t('auth.login.password_label')}</label>
          <div className="auth-field__input-wrap">
            <input
              className="auth-field__input auth-field__input--has-icon"
              type={showPass ? 'text' : 'password'}
              placeholder={`${t('auth.login.password_label')}...`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="button" className="auth-field__eye" onClick={() => setShowPass((p) => !p)} tabIndex={-1}>
              {showPass ? (
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M10.477 6.535A4 4 0 0 1 14 10c0 .23-.02.454-.059.672M7.21 7.21A4 4 0 0 0 6 10a4 4 0 0 0 5.465 3.755M4.58 4.58C2.977 5.645 1.677 7.173 1 10c1.073 4.267 4.5 7 9 7a10.9 10.9 0 0 0 4.42-.92M8 2.07A10.9 10.9 0 0 1 10 2c4.5 0 7.927 2.733 9 7a10.94 10.94 0 0 1-1.585 3.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M1 10c1.073-4.267 4.5-7 9-7s7.927 2.733 9 7c-1.073 4.267-4.5 7-9 7s-7.927-2.733-9-7Z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <FormAlert type="error" message={error} />

        <FormButton type="submit" variant="primary" loading={loading} loadingText={t('auth.login.submitting')} fullWidth>
          {t('auth.login.submit')}
        </FormButton>

      </form>

      <p className="auth-card__footer">
        {t('auth.login.no_account')}{' '}
        <span className="auth-card__footer-link" onClick={() => navigate('/register')}>
          {t('auth.login.create_one')}
        </span>
      </p>

      <div className="auth-card__theme">
        <button className="auth-card__theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
          {theme === 'dark' ? t('auth.login.switch_light') : t('auth.login.switch_dark')}
        </button>
      </div>

    </div>
  )
}