import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getProfileApi } from '../api/profile'
import ProfileDrawer from '../components/profile/ProfileDrawer'
import { PageHeader, FormButton, StatusBadge } from '../components/common'
import './styles/Profile.css'

export default function Profile() {
  const { t } = useTranslation()
  const [profile, setProfile]       = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    getProfileApi()
      .then((res) => setProfile(res.data))
      .catch(() => {})
  }, [])

  const handleSave = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }))
    setDrawerOpen(false)
  }

  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="profile">

      <PageHeader
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        action={
          <FormButton variant="primary" onClick={() => setDrawerOpen(true)}>
            {t('profile.edit_btn')}
          </FormButton>
        }
      />

      <div className="profile__card" onClick={() => setDrawerOpen(true)} title={t('profile.edit_btn')}>
        <div className="profile__avatar">{initial}</div>
        <div className="profile__info">
          <span className="profile__name">{profile?.name || '—'}</span>
          <span className="profile__email">{profile?.email || '—'}</span>
          {profile?.package && <StatusBadge status={profile.package} />}
        </div>
        <div className="profile__card-arrow">›</div>
      </div>

      <ProfileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
        onSave={handleSave}
      />

    </div>
  )
}