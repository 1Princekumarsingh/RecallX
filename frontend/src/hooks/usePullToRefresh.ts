import { useCallback, useRef, useState } from 'react'
import { isMobileViewport } from '@/lib/viewport'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

export function usePullToRefresh({ onRefresh, threshold = 80, disabled = false }: UsePullToRefreshOptions) {
  const startYRef = useRef<number | null>(null)
  const isRefreshingRef = useRef(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isReadyToRefresh, setIsReadyToRefresh] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const reset = useCallback(() => {
    setPullDistance(0)
    setIsReadyToRefresh(false)
  }, [])

  const handleStart = useCallback((event: React.TouchEvent<HTMLElement>) => {
    if (disabled || !isMobileViewport() || isRefreshingRef.current) return

    const scrollTop = event.currentTarget.scrollTop
    if (scrollTop > 0) return

    startYRef.current = event.touches[0]?.clientY ?? null
  }, [disabled])

  const handleMove = useCallback((event: React.TouchEvent<HTMLElement>) => {
    if (disabled || startYRef.current === null || isRefreshingRef.current) return

    const currentY = event.touches[0]?.clientY ?? 0
    const delta = Math.max(0, currentY - startYRef.current)

    if (delta > 0) {
      event.preventDefault()
      setPullDistance(delta)
      setIsReadyToRefresh(delta >= threshold)
    }
  }, [disabled, threshold])

  const handleEnd = useCallback(async () => {
    if (disabled || isRefreshingRef.current) {
      reset()
      return
    }

    if (isReadyToRefresh) {
      setIsRefreshing(true)
      isRefreshingRef.current = true
      await onRefresh()
      setIsRefreshing(false)
      isRefreshingRef.current = false
    }

    reset()
  }, [disabled, isReadyToRefresh, onRefresh, reset])

  const transformStyle = {
    transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance, threshold)}px)` : undefined,
    transition: isRefreshing ? 'transform 200ms ease-in-out' : 'transform 150ms ease-out',
  } as const

  return {
    pullDistance,
    isReadyToRefresh,
    isRefreshing,
    transformStyle,
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
    onTouchCancel: handleEnd,
  }
}
