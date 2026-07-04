/**
 * Viewport size detection utilities
 * 
 * Provides utilities for detecting viewport dimensions and characteristics
 * that are useful for responsive behavior beyond media queries.
 */

/**
 * Breakpoint thresholds matching TailwindCSS configuration
 */
export const VIEWPORT_BREAKPOINTS = {
  mobile: { min: 320, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: 1279 },
  wide: { min: 1280, max: Infinity },
} as const

/**
 * Get current viewport dimensions
 */
export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Check if current viewport is mobile size (<768px)
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < VIEWPORT_BREAKPOINTS.tablet.min
}

/**
 * Check if current viewport is tablet size (768px - 1023px)
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false
  const width = window.innerWidth
  return width >= VIEWPORT_BREAKPOINTS.tablet.min && width <= VIEWPORT_BREAKPOINTS.tablet.max
}

/**
 * Check if current viewport is desktop size (>=1024px)
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= VIEWPORT_BREAKPOINTS.desktop.min
}

/**
 * Check if device is in portrait orientation
 */
export function isPortrait(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerHeight > window.innerWidth
}

/**
 * Check if device is in landscape orientation
 */
export function isLandscape(): boolean {
  return !isPortrait()
}

/**
 * Get device pixel ratio (for detecting high DPI displays)
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio || 1
}

/**
 * Check if device is likely a touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE specific
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Get safe area insets for devices with notches (iOS)
 * Returns padding values to avoid notch areas
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const style = getComputedStyle(document.documentElement)

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  }
}

/**
 * Check if user prefers reduced motion
 * Used for accessibility - disable animations if true
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers dark color scheme
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Get viewport width category
 */
export function getViewportCategory(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  const width = getViewportSize().width

  if (width >= VIEWPORT_BREAKPOINTS.wide.min) return 'wide'
  if (width >= VIEWPORT_BREAKPOINTS.desktop.min) return 'desktop'
  if (width >= VIEWPORT_BREAKPOINTS.tablet.min) return 'tablet'
  return 'mobile'
}

/**
 * Add resize listener with debouncing
 * Returns cleanup function to remove listener
 * 
 * @param callback - Function to call on resize
 * @param delay - Debounce delay in milliseconds (default: 150ms)
 */
export function onViewportResize(
  callback: () => void,
  delay: number = 150
): () => void {
  if (typeof window === 'undefined') return () => {}

  let timeoutId: ReturnType<typeof setTimeout>

  const debouncedCallback = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(callback, delay)
  }

  window.addEventListener('resize', debouncedCallback)
  window.addEventListener('orientationchange', callback)

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId)
    window.removeEventListener('resize', debouncedCallback)
    window.removeEventListener('orientationchange', callback)
  }
}
