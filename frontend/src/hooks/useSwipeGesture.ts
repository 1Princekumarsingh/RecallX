import { useCallback, useRef, useState } from 'react'

interface UseSwipeGestureOptions {
  threshold?: number
  disabled?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function useSwipeGesture({
  threshold = 60,
  disabled = false,
  onSwipeLeft,
  onSwipeRight
}: UseSwipeGestureOptions = {}) {
  const [isSwiping, setIsSwiping] = useState(false)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return

    startXRef.current = event.touches[0]?.clientX ?? null
    startYRef.current = event.touches[0]?.clientY ?? null
    setIsSwiping(false)
  }, [disabled])

  const onTouchMove = useCallback((event: React.TouchEvent) => {
    if (disabled || startXRef.current === null || startYRef.current === null) return

    const deltaX = (event.touches[0]?.clientX ?? 0) - startXRef.current
    const deltaY = (event.touches[0]?.clientY ?? 0) - startYRef.current

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold / 2) {
      setIsSwiping(true)
    }
  }, [disabled, threshold])

  const onTouchEnd = useCallback((event: React.TouchEvent) => {
    if (disabled || startXRef.current === null || startYRef.current === null) return

    const deltaX = (event.changedTouches[0]?.clientX ?? 0) - startXRef.current
    const deltaY = (event.changedTouches[0]?.clientY ?? 0) - startYRef.current

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    startXRef.current = null
    startYRef.current = null
    setIsSwiping(false)
  }, [disabled, threshold, onSwipeLeft, onSwipeRight])

  return {
    isSwiping,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
