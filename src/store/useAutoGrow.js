import { useLayoutEffect } from 'react'

/**
 * useAutoGrow — resizes a textarea to fit its content between minRows and maxRows.
 * The textarea CSS must set an explicit px line-height and box-sizing: border-box.
 */
function useAutoGrow(ref, value, { minRows = 3, maxRows = 12 } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const styles     = window.getComputedStyle(el)
    const lineHeight = parseFloat(styles.lineHeight) || 22
    const padding    = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    const border     = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)

    const minHeight = lineHeight * minRows + padding + border
    const maxHeight = lineHeight * maxRows + padding + border

    el.style.height = 'auto'
    const contentHeight = el.scrollHeight + border
    el.style.height    = `${Math.min(Math.max(contentHeight, minHeight), maxHeight)}px`
    el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
  }, [ref, value, minRows, maxRows])
}

export default useAutoGrow