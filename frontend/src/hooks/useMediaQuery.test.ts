import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  let matchMediaMock: any

  beforeEach(() => {
    // Mock window.matchMedia
    matchMediaMock = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial match state', () => {
    const query = '(min-width: 768px)'
    const listeners: Array<(e: any) => void> = []

    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: (event: string, handler: (e: any) => void) => {
        listeners.push(handler)
      },
      removeEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useMediaQuery(query))

    expect(result.current).toBe(true)
    expect(matchMediaMock).toHaveBeenCalledWith(query)
  })

  it('should return false when query does not match', () => {
    const query = '(min-width: 1920px)'
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useMediaQuery(query))

    expect(result.current).toBe(false)
  })

  it('should update when media query changes', () => {
    const query = '(min-width: 768px)'
    let changeHandler: (e: any) => void = () => {}

    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: (event: string, handler: (e: any) => void) => {
        changeHandler = handler
      },
      removeEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useMediaQuery(query))

    expect(result.current).toBe(false)

    // Simulate media query change
    act(() => {
      changeHandler({ matches: true } as any)
    })

    expect(result.current).toBe(true)
  })

  it('should cleanup event listener on unmount', () => {
    const query = '(min-width: 768px)'
    const removeEventListener = vi.fn()

    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener,
    })

    const { unmount } = renderHook(() => useMediaQuery(query))

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update when query parameter changes', () => {
    const listeners: Array<(e: any) => void> = []
    const removeListeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => {
      let currentMatches = query === '(min-width: 768px)'
      let listener: (e: any) => void

      return {
        get matches() {
          return currentMatches
        },
        addEventListener: (event: string, handler: (e: any) => void) => {
          listener = handler
          listeners.push(handler)
        },
        removeEventListener: (event: string, handler: (e: any) => void) => {
          const index = listeners.indexOf(handler)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        },
      }
    })

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      {
        initialProps: { query: '(min-width: 768px)' },
      }
    )

    expect(result.current).toBe(true)

    // Change the query
    rerender({ query: '(min-width: 1024px)' })

    expect(result.current).toBe(false)
  })

  it('should handle SSR environment (no window)', () => {
    const originalMatchMedia = window.matchMedia

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: undefined,
    })

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    })
  })
})
