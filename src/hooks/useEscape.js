import { useEffect, useRef } from 'react'
import { pushEscape } from '../utils/escapeStack'

/**
 * useEscape — registers handler on the escape stack while active is true
 */
function useEscape(active, handler) {
  const handlerRef = useRef(handler)

  useEffect(() => { handlerRef.current = handler })

  useEffect(() => {
    if (!active) return undefined
    return pushEscape(() => handlerRef.current?.())
  }, [active])
}

export default useEscape