import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { updateProfileApi } from '../../api/profile'
import { FormField, FormButton, FormAlert, Drawer } from '../common'

export default function ProfileDrawer({ isOpen, onClose, profile, onSave }) {
  const { t } = useTranslation()
  const [form, setForm]       = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', email: profile.email || '' })
  }, [profile])

  useEffect(() => {
    if (!isOpen) { setError(''); setSuccess('') }
  }, [isOpen])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim())  { setError(t('profile.name_required'));  return }
    if (!form.email.trim()) { setError(t('profile.email_required')); return }
    setError('')
    setLoading(true)
    updateProfileApi(form)
      .then((res) => { setSuccess(t('profile.save_success')); setLoading(false); onSave(res.data) })
      .catch(()   => { setError(t('profile.save_failed')); setLoading(false) })
  }

  return (
    <Drawer
      open={isOpen}
      title={t('profile.drawer_title')}
      onClose={onClose}
      size="sm"
      error={error}
      footer={
        <>
          <FormButton variant="ghost" onClick={onClose} fullWidth>{t('common.cancel')}</FormButton>
          <FormButton variant="primary" loading={loading} loadingText={t('common.saving')} onClick={handleSubmit} fullWidth>
            {t('common.save')}
          </FormButton>
        </>
      }
    >
      <FormAlert type="success" message={success} />

      <FormField
        label={t('profile.name_label')}
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder={t('profile.name_placeholder')}
        required
      />
      <FormField
        label={t('profile.email_label')}
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder={t('profile.email_placeholder')}
        required
      />
    </Drawer>
  )
}