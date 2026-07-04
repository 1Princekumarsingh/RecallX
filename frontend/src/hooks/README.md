# Responsive Hooks and Utilities

This directory contains hooks and utilities for implementing responsive behavior in the RecallX application.

## Hooks

### `useMediaQuery`

Hook for responsive logic based on CSS media queries.

**Parameters:**
- `query: string` - CSS media query string

**Returns:**
- `boolean` - Whether the media query matches

**Example:**
```tsx
import { useMediaQuery } from '@/hooks'

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

### `useBreakpoint`

Hook that returns the current responsive breakpoint.

**Returns:**
- `Breakpoint` - One of: `'mobile' | 'tablet' | 'desktop' | 'wide'`

**Breakpoint Definitions:**
- Mobile: 0px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1279px
- Wide: 1280px+

**Example:**
```tsx
import { useBreakpoint } from '@/hooks'

function Navigation() {
  const breakpoint = useBreakpoint()

  return (
    <nav>
      {breakpoint === 'mobile' && <MobileMenu />}
      {breakpoint !== 'mobile' && <DesktopNav />}
    </nav>
  )
}
```

### `useBreakpointMatch`

Hook that checks if the current breakpoint matches specified one(s).

**Parameters:**
- `target: Breakpoint | Breakpoint[]` - Breakpoint(s) to match

**Returns:**
- `boolean` - Whether current breakpoint matches

**Example:**
```tsx
import { useBreakpointMatch } from '@/hooks'

function Sidebar() {
  const showSidebar = useBreakpointMatch(['desktop', 'wide'])

  if (!showSidebar) return null

  return <aside>Sidebar Content</aside>
}

function AdaptiveLayout() {
  const isMobileOrTablet = useBreakpointMatch(['mobile', 'tablet'])

  return (
    <div className={isMobileOrTablet ? 'flex-col' : 'flex-row'}>
      {/* Layout content */}
    </div>
  )
}
```

## Viewport Utilities

The `viewport.ts` module provides utility functions for viewport detection and device characteristics.

### Size Detection

```tsx
import { 
  getViewportSize, 
  isMobileViewport, 
  isTabletViewport, 
  isDesktopViewport,
  getViewportCategory 
} from '@/lib/viewport'

// Get current dimensions
const { width, height } = getViewportSize()

// Check viewport type
if (isMobileViewport()) {
  // Apply mobile-specific logic
}

// Get category
const category = getViewportCategory() // 'mobile' | 'tablet' | 'desktop' | 'wide'
```

### Orientation Detection

```tsx
import { isPortrait, isLandscape } from '@/lib/viewport'

if (isPortrait()) {
  // Vertical orientation
}

if (isLandscape()) {
  // Horizontal orientation
}
```

### Device Detection

```tsx
import { 
  isTouchDevice, 
  getPixelRatio 
} from '@/lib/viewport'

if (isTouchDevice()) {
  // Enable touch-specific interactions
}

const dpr = getPixelRatio() // 1, 2, 3, etc.
if (dpr >= 2) {
  // High DPI display - use @2x images
}
```

### User Preferences

```tsx
import { 
  prefersReducedMotion, 
  prefersDarkMode, 
  prefersHighContrast 
} from '@/lib/viewport'

if (prefersReducedMotion()) {
  // Disable animations
}

if (prefersDarkMode()) {
  // Apply dark theme
}

if (prefersHighContrast()) {
  // Enhance contrast
}
```

### Resize Listener

```tsx
import { onViewportResize } from '@/lib/viewport'
import { useEffect } from 'react'

function ResponsiveComponent() {
  useEffect(() => {
    const cleanup = onViewportResize(() => {
      console.log('Viewport resized!')
    }, 150) // 150ms debounce

    return cleanup // Remove listener on unmount
  }, [])

  return <div>Content</div>
}
```

## Layout Components

See [components/layout/README.md](../components/layout/README.md) for `Container` and `ResponsiveGrid` component documentation.

## Best Practices

1. **Use `useBreakpoint` for simple breakpoint checks** - More performant than multiple `useMediaQuery` calls
2. **Use `useMediaQuery` for custom queries** - When you need specific viewport conditions
3. **Debounce resize handlers** - Always debounce resize events for better performance
4. **Respect user preferences** - Check `prefersReducedMotion` before adding animations
5. **Touch targets on mobile** - Ensure minimum 44px touch targets on mobile viewports
6. **Test across breakpoints** - Test responsive behavior at all breakpoint boundaries

## Requirements Validation

These hooks and utilities satisfy the following requirements:

- **Requirement 1.1**: Responsive layout system with mobile (< 768px), tablet (768-1023px), desktop (>1024px)
- **Requirement 1.2**: Enhanced navigation and menu system with viewport-specific rendering
- **Requirement 1.3**: Card component enhancement with responsive grids
- **Requirement 1.5**: Quiz interface optimization with swipe gestures
- **Requirement 1.6**: Form input with mobile keyboard types
- **Requirement 1.8**: Color scheme and theme consistency
- **Requirement 1.9**: Animation and transitions with reduced motion support
- **Requirement 1.17**: Mobile-specific touch interactions
- **Requirement 1.18**: Performance optimization with debounced listeners
