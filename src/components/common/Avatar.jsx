import { useEffect, useState } from 'react'
import Tooltip from './Tooltip'
import './styles/Avatar.css'

/**
 * Avatar — user image or initials with a stable color per name
 *
 * Props:
 *   name         — used for initials, color and accessible label
 *   src          — image URL (falls back to initials on error)
 *   size         — 'xs' 20 | 'sm' 28 | 'md' 36 (default) | 'lg' 48
 *   showTooltip  — show the name on hover
 */
const TONE_COUNT = 6

const getInitials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?'

const getTone = (name = '') => {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash % TONE_COUNT
}

function Avatar({ name = '', src, size = 'md', showTooltip = false }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => { setFailed(false) }, [src])

  const avatar = (
    <span className={`avatar avatar--${size} avatar--tone-${getTone(name)}`} role="img" aria-label={name}>
      {src && !failed ? (
        <img src={src} alt="" className="avatar__image" onError={() => setFailed(true)} />
      ) : (
        <span className="avatar__initials" aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  )

  return showTooltip && name ? <Tooltip content={name}>{avatar}</Tooltip> : avatar
}

export default Avatar