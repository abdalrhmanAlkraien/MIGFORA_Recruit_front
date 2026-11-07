import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './styles/Popover.css'
import useEscape from '../../hooks/useEscape'


/**
 * Popover — floating panel anchored to a trigger element
 *
 * Props:
 *   open        — boolean
 *   anchorRef   — ref of the element the panel attaches to
 *   onClose     — (reason) => void, reason: 'outside' | 'escape'
 *   placement   — 'bottom-start' | 'bottom-end' (flips to top when there is no room)
 *   matchWidth  — panel width = anchor width
 *   offset      — gap between anchor and panel in px (default 6)
 *   className   — extra class on the panel
 */

const VIEWPORT_GUTTER = 8

function Popover({
    open,
    anchorRef,
    onClose,
    placement = 'bottom-start',
    matchWidth = false,
    offset = 6,
    className = '',
    children,
}) {
    const panelRef = useRef(null)
    const onCloseRef = useRef(onClose)
    useEscape(open, () => onCloseRef.current?.('escape'))

    const [position, setPosition] = useState(null)

    useEffect(() => { onCloseRef.current = onClose })

    const updatePosition = useCallback(() => {
        const anchor = anchorRef.current
        const panel = panelRef.current
        if (!anchor || !panel) return

        const anchorRect = anchor.getBoundingClientRect()
        if (matchWidth) panel.style.width = `${anchorRect.width}px`
        const panelRect = panel.getBoundingClientRect()

        const spaceBelow = window.innerHeight - anchorRect.bottom
        const spaceAbove = anchorRect.top
        const flipped = spaceBelow < panelRect.height + offset && spaceAbove > spaceBelow

        const top = flipped
            ? Math.max(VIEWPORT_GUTTER, anchorRect.top - panelRect.height - offset)
            : anchorRect.bottom + offset

        const isRTL = document.documentElement.getAttribute('dir') === 'rtl'
        const alignEnd = placement.endsWith('end') !== isRTL
        const rawLeft = alignEnd ? anchorRect.right - panelRect.width : anchorRect.left
        const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_GUTTER
        const left = Math.min(Math.max(VIEWPORT_GUTTER, rawLeft), maxLeft)

        setPosition((prev) => (
            prev && prev.top === top && prev.left === left && prev.flipped === flipped
                ? prev
                : { top, left, flipped }
        ))
    }, [anchorRef, matchWidth, offset, placement])

    useLayoutEffect(() => {
        if (open) updatePosition()
        else setPosition(null)
    }, [open, updatePosition])

    useEffect(() => {
        if (!open) return undefined

        const handlePointerDown = (e) => {
            if (panelRef.current?.contains(e.target)) return
            if (anchorRef.current?.contains(e.target)) return
            onCloseRef.current?.('outside')
        }

        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') return
            e.stopPropagation()               // keeps a parent Drawer from closing too
            onCloseRef.current?.('escape')
        }

        const observer = new ResizeObserver(updatePosition)
        if (panelRef.current) observer.observe(panelRef.current)

        document.addEventListener('mousedown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown, true)
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)

        return () => {
            observer.disconnect()
            document.removeEventListener('mousedown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown, true)
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition, true)
        }
    }, [open, anchorRef, updatePosition])

    if (!open) return null

    const classes = [
        'popover',
        position ? 'popover--ready' : '',
        position?.flipped ? 'popover--flipped' : '',
        className,
    ].filter(Boolean).join(' ')

    return createPortal(
        <div
            ref={panelRef}
            className={classes}
            style={position ? { top: position.top, left: position.left } : undefined}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>,
        document.body
    )
}

export default Popover