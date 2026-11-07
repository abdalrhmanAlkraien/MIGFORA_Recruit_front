import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { getProfileApi } from '../../api/profile'
import './styles/SidebarProfile.css'

const PACKAGE_BADGE_CLASS = {
  BASIC:      'sidebar-profile__badge--basic',
  GROWTH:     'sidebar-profile__badge--growth',
  ENTERPRISE: 'sidebar-profile__badge--enterprise',
}

const AVATAR_COLOR_CLASS = {
  '#FF9900': 'sidebar-profile__avatar--orange',
  '#3B82F6': 'sidebar-profile__avatar--blue',
  '#7C3AED': 'sidebar-profile__avatar--purple',
}

export default function SidebarProfile({ isOpen }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProfileApi()
      .then((res) => setProfile(res.data))
      .catch(() => {})
  }, [])

  const displayName  = profile?.name        || user?.name    || 'User'
  const displayEmail = profile?.email       || user?.email   || ''
  const packageLabel = profile?.package     || user?.package || null
  const avatarColor  = profile?.avatarColor || '#FF9900'
  const initial      = displayName.charAt(0).toUpperCase()

  const badgeClass  = PACKAGE_BADGE_CLASS[packageLabel] || 'sidebar-profile__badge--basic'
  const avatarClass = AVATAR_COLOR_CLASS[avatarColor]   || 'sidebar-profile__avatar--orange'

  return (
    <div
      className={`sidebar-profile ${!isOpen ? 'sidebar-profile--rail' : ''}`}
      onClick={() => navigate('/profile')}
      title={!isOpen ? displayName : undefined}
    >
      {isOpen && packageLabel && (
        <div className={`sidebar-profile__badge ${badgeClass}`}>
          {packageLabel}
        </div>
      )}

      <div className="sidebar-profile__row">
        <div className={`sidebar-profile__avatar ${avatarClass}`}>
          {initial}
        </div>
        {isOpen && (
          <>
            <div className="sidebar-profile__info">
              <span className="sidebar-profile__name">{displayName}</span>
              <span className="sidebar-profile__email">{displayEmail}</span>
            </div>
            <div className="sidebar-profile__arrow">›</div>
          </>
        )}
      </div>
    </div>
  )
}