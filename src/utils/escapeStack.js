/**
 * Escape stack — only the top-most open overlay reacts to Escape.
 * Drawer → Modal → Popover: one Escape press closes one layer.
 */
const stack = []

const handleKeyDown = (e) => {
  if (e.key !== 'Escape' || stack.length === 0) return
  e.preventDefault()
  e.stopPropagation()
  stack[stack.length - 1]()
}

export const pushEscape = (handler) => {
  if (stack.length === 0) window.addEventListener('keydown', handleKeyDown, true)
  stack.push(handler)

  return () => {
    const index = stack.lastIndexOf(handler)
    if (index !== -1) stack.splice(index, 1)
    if (stack.length === 0) window.removeEventListener('keydown', handleKeyDown, true)
  }
}