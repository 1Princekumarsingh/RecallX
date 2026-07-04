import { useCallback, useRef } from 'react'

export function useDebounceClick(delay = 300) {
  const timeoutRef = useRef<number | null>(null)

  return useCallback((callback: () => void) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      callback()
      timeoutRef.current = null
    }, delay)
  }, [delay])
}
