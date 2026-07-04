import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getViewportSize,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  isPortrait,
  isLandscape,
  getPixelRatio,
  isTouchDevice,
  prefersReducedMotion,
  prefersDarkMode,
  prefersHighContrast,
  getViewportCategory,
  onViewportResize,
} from './viewport'

describe('viewport utilities', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: originalInnerHeight,
    })
    vi.clearAllMocks()
  })

  describe('getViewportSize', () => {
    it('should return current viewport dimensions', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 })

      const size = getViewportSize()

      expect(size).toEqual({ width: 1024, height: 768 })
    })
  })

  describe('isMobileViewport', () => {
    it('should return true for widths below 768px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })

      expect(isMobileViewport()).toBe(true)
    })

    it('should return false for widths 768px and above', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 768 })

      expect(isMobileViewport()).toBe(false)
    })
  })

  describe('isTabletViewport', () => {
    it('should return true for widths between 768px and 1023px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 900 })

      expect(isTabletViewport()).toBe(true)
    })

    it('should return false for widths below 768px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })

      expect(isTabletViewport()).toBe(false)
    })

    it('should return false for widths 1024px and above', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })

      expect(isTabletViewport()).toBe(false)
    })
  })

  describe('isDesktopViewport', () => {
    it('should return true for widths 1024px and above', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 })

      expect(isDesktopViewport()).toBe(true)
    })

    it('should return false for widths below 1024px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 })

      expect(isDesktopViewport()).toBe(false)
    })
  })

  describe('isPortrait', () => {
    it('should return true when height > width', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 667 })

      expect(isPortrait()).toBe(true)
    })

    it('should return false when width > height', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 })

      expect(isPortrait()).toBe(false)
    })
  })

  describe('isLandscape', () => {
    it('should return true when width > height', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 })

      expect(isLandscape()).toBe(true)
    })

    it('should return false when height > width', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 667 })

      expect(isLandscape()).toBe(false)
    })
  })

  describe('getPixelRatio', () => {
    it('should return device pixel ratio', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 2,
      })

      expect(getPixelRatio()).toBe(2)
    })

    it('should return 1 if devicePixelRatio is not available', () => {
      const originalDPR = window.devicePixelRatio

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      expect(getPixelRatio()).toBe(1)

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: originalDPR,
      })
    })
  })

  describe('isTouchDevice', () => {
    it('should return true for touch devices', () => {
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        value: {},
      })

      expect(isTouchDevice()).toBe(true)
    })

    it('should return true when maxTouchPoints > 0', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 5,
      })

      expect(isTouchDevice()).toBe(true)
    })
  })

  describe('getViewportCategory', () => {
    it('should return "mobile" for widths below 768px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })

      expect(getViewportCategory()).toBe('mobile')
    })

    it('should return "tablet" for widths 768-1023px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 })

      expect(getViewportCategory()).toBe('tablet')
    })

    it('should return "desktop" for widths 1024-1279px', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1100 })

      expect(getViewportCategory()).toBe('desktop')
    })

    it('should return "wide" for widths 1280px and above', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 })

      expect(getViewportCategory()).toBe('wide')
    })
  })

  describe('prefersReducedMotion', () => {
    it('should return true when user prefers reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      })

      expect(prefersReducedMotion()).toBe(true)
    })

    it('should return false when user does not prefer reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      })

      expect(prefersReducedMotion()).toBe(false)
    })
  })

  describe('prefersDarkMode', () => {
    it('should return true when user prefers dark mode', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      })

      expect(prefersDarkMode()).toBe(true)
    })
  })

  describe('prefersHighContrast', () => {
    it('should return true when user prefers high contrast', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      })

      expect(prefersHighContrast()).toBe(true)
    })
  })

  describe('onViewportResize', () => {
    it('should register resize and orientation change listeners', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const callback = vi.fn()

      const cleanup = onViewportResize(callback)

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', callback)

      cleanup()
    })

    it('should call callback on resize with debounce', () => {
      vi.useFakeTimers()
      const callback = vi.fn()

      const cleanup = onViewportResize(callback, 150)

      window.dispatchEvent(new Event('resize'))
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(150)
      expect(callback).toHaveBeenCalledTimes(1)

      cleanup()
      vi.useRealTimers()
    })

    it('should remove listeners on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const callback = vi.fn()

      const cleanup = onViewportResize(callback)
      cleanup()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', callback)
    })
  })
})
