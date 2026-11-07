import Avatar from './Avatar'
import Tooltip from './Tooltip'
import './styles/Avatar.css'
import './styles/AvatarGroup.css'

/**
 * AvatarGroup — overlapping avatars with "+N"
 *
 * Props:
 *   users  — [{ id?, name, src? }]
 *   max    — visible avatars before "+N" (default 4)
 *   size   — same as Avatar (default 'sm')
 */
function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const visible = users.slice(0, max)
  const hidden  = users.slice(max)

  return (
    <span className={`avatar-group avatar-group--${size}`}>
      {visible.map((user) => (
        <span key={user.id ?? user.name} className="avatar-group__item">
          <Avatar name={user.name} src={user.src} size={size} showTooltip />
        </span>
      ))}

      {hidden.length > 0 && (
        <span className="avatar-group__item">
          <Tooltip content={hidden.map((user) => user.name).join(', ')}>
            <span className={`avatar avatar--${size} avatar--more`}>+{hidden.length}</span>
          </Tooltip>
        </span>
      )}
    </span>
  )
}

export default AvatarGroup