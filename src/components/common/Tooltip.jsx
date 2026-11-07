import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import useEscape from '../../hooks/useEscape'
import './styles/Tooltip.css'

/**
 * Tooltip — short hint on hover / keyboard focus
 *
 * Props:
 *   content    — text or node (nothing renders when empty)
 *   placement  — 'top' (default) | 'bottom' — flips when there is no room
 *   delay      — ms before showing (default 300)
 *   disabled
 *   children   — the trigger
 *
 * Use for disabled reasons, full IDs and timestamps. Never put essential info only in a tooltip.
 */
const GAP    = 8
const GUTTER = 8

function Tooltip({ content, placement = 'top', delay = 300, disabled = false, children }) {
  const anchorRef = useRef(null)
  const tipRef    = useRef(null)
  const timerRef  = useRef(null)
  const tooltipId = useId()

  const [open, setOpen]         = useState(false)
  const [position, setPosition] = useState(null)

  const show = () => {
    if (disabled || !content) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(true), delay)
  }

  const hide = () => {
    clearTimeout(timerRef.current)
    setOpen(false)
    setPosition(null)
  }

  useEscape(open, hide)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (!open) return undefined
    window.addEventListener('scroll', hide, true)
    return () => window.removeEventListener('scroll', hide, true)
  }, [open])

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tipRef.current) return

    const anchor = anchorRef.current.getBoundingClientRect()
    const tip    = tipRef.current.getBoundingClientRect()

    let side = placement
    if (side === 'top' && anchor.top - tip.height - GAP < GUTTER) side = 'bottom'
    if (side === 'bottom' && anchor.bottom + tip.height + GAP > window.innerHeight - GUTTER) side = 'top'

    const top  = side === 'top' ? anchor.top - tip.height - GAP : anchor.bottom + GAP
    const left = Math.min(
      Math.max(GUTTER, anchor.left + anchor.width / 2 - tip.width / 2),
      window.innerWidth - tip.width - GUTTER
    )

    setPosition({ top, left, side })
  }, [open, placement, content])

  return (
    <>
      <span
        ref={anchorRef}
        className="tooltip__anchor"
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {open && createPortal(
        <div
          ref={tipRef}
          id={tooltipId}
          role="tooltip"
          className={`tooltip tooltip--${position?.side || placement} ${position ? 'tooltip--ready' : ''}`}
          style={position ? { top: position.top, left: position.left } : undefined}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

export default Tooltip