import { useEffect } from 'react'

let lockCount = 0

/**
 * useScrollLock — locks body scroll while active; safe for nested overlays
 */
function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined

    lockCount += 1
    document.body.style.overflow = 'hidden'

    return () => {
      lockCount -= 1
      if (lockCount === 0) document.body.style.overflow = ''
    }
  }, [active])
}

export default useScrollLock