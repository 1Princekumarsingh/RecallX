import { useCallback, useEffect, useRef, useState } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  delay?: number
  disabled?: boolean
}

export function useLongPress({ onLongPress, onClick, delay = 500, disabled = false }: UseLongPressOptions) {
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasLongPressedRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPressed(false)
    hasLongPressedRef.current = false
  }, [])

  const start = useCallback((_event?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLElement>) => {
    if (disabled) return

    setIsPressed(true)
    hasLongPressedRef.current = false

    timeoutRef.current = setTimeout(() => {
      onLongPress()
      hasLongPressedRef.current = true
      setIsPressed(false)
    }, delay)
  }, [delay, disabled, onLongPress])

  const stop = useCallback((_event?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLElement>) => {
    if (disabled) return

    if (!hasLongPressedRef.current && onClick) {
      onClick()
    }
    clear()
  }, [clear, disabled, onClick])

  const cancel = useCallback(() => {
    clear()
  }, [clear])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isPressed,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: cancel,
    onTouchCancel: cancel,
  }
}
