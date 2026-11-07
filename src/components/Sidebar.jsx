import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SidebarProfile from './profile/SidebarProfile'
import './styles/Sidebar.css'

export default function Sidebar({ isOpen, onToggle }) {
  const { t } = useTranslation()

  const NAV_ITEMS = [
    {
      section: t('sidebar.nav.dashboard'),
      items: [
        {
          label: t('sidebar.nav.dashboard'),
          path: '/dashboard',
          icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          ),
        },
      ],
    },
  ]

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onToggle() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onToggle])

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>

      <div className="sidebar__header">
        {isOpen && (
          <span className="sidebar__logo">
            MIG<span className="sidebar__logo-accent">FORA</span>
          </span>
        )}
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section} className="sidebar__group">
            {isOpen && (
              <span className="sidebar__group-label">{group.section}</span>
            )}
            {group.items.map((item) => (

                <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                title={!isOpen ? item.label : undefined}
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                {isOpen && (
                  <span className="sidebar__link-label">{item.label}</span>
                )}
              </NavLink>

            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <SidebarProfile isOpen={isOpen} />
        {isOpen && (
          <div className="sidebar__copyright">
            {t('sidebar.copyright', { year: new Date().getFullYear() })}
          </div>
        )}
      </div>

    </aside>
  )
}