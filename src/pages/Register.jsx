import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import appConfig from '../config/appConfig'
import { registerApi } from '../api/auth'
import { FormButton, FormAlert } from '../components/common'
import './styles/Register.css'

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    fullName: '', username: '', email: '', phone: '', password: '', confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password !== form.confirmPassword) {
      setError(t('auth.register.passwords_no_match'))
      return
    }
    setLoading(true)
    try {
      const res = await registerApi({
        fullName: form.fullName, username: form.username,
        email: form.email, phone: form.phone, password: form.password,
      })
      setSuccess(res.data?.[appConfig.auth.messageKey] || t('auth.register.success'))
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.[appConfig.auth.messageKey] || t('auth.register.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card auth-card--wide">

      <div className="auth-card__logo">
        MIG<span className="auth-card__logo-accent">FORA</span>
      </div>

      <div className="auth-card__heading">
        <h1 className="auth-card__title">{t('auth.register.title')}</h1>
        <p className="auth-card__subtitle">{t('auth.register.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-card__form">

        <div className="auth-grid">
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.full_name')}</label>
            <input className="auth-field__input" type="text" name="fullName"
              placeholder={t('auth.register.full_name_placeholder')}
              value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.username')}</label>
            <input className="auth-field__input" type="text" name="username"
              placeholder={t('auth.register.username_placeholder')}
              value={form.username} onChange={handleChange} required />
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.email')}</label>
            <input className="auth-field__input" type="email" name="email"
              placeholder={t('auth.register.email_placeholder')}
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.phone')}</label>
            <input className="auth-field__input" type="tel" name="phone"
              placeholder={t('auth.register.phone_placeholder')}
              value={form.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.password')}</label>
            <input className="auth-field__input" type="password" name="password"
              placeholder={t('auth.register.password_placeholder')}
              value={form.password} onChange={handleChange} required minLength={8} />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">{t('auth.register.confirm_password')}</label>
            <input className="auth-field__input" type="password" name="confirmPassword"
              placeholder={t('auth.register.confirm_password_placeholder')}
              value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        <FormAlert type="error"   message={error}   />
        <FormAlert type="success" message={success} />

        <FormButton type="submit" variant="primary" loading={loading} loadingText={t('auth.register.submitting')} fullWidth>
          {t('auth.register.submit')}
        </FormButton>

      </form>

      <p className="auth-card__footer">
        {t('auth.register.has_account')}{' '}
        <span className="auth-card__footer-link" onClick={() => navigate('/login')}>
          {t('auth.register.sign_in')}
        </span>
      </p>

    </div>
  )
}