# Responsive Utilities Implementation Guide

This guide documents the responsive breakpoint utilities, hooks, and layout components implemented for the UI/UX Mobile Improvements feature.

## Overview

The responsive system consists of three main parts:

1. **Hooks** (`src/hooks/`): React hooks for responsive logic
2. **Utilities** (`src/lib/viewport.ts`): Viewport detection utilities
3. **Layout Components** (`src/components/layout/`): Container and grid components

## Quick Start

### Import and Use Hooks

```tsx
import { useMediaQuery, useBreakpoint, useBreakpointMatch } from '@/hooks'

function MyComponent() {
  // Method 1: Custom media query
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  // Method 2: Get current breakpoint
  const breakpoint = useBreakpoint() // 'mobile' | 'tablet' | 'desktop' | 'wide'
  
  // Method 3: Match specific breakpoint(s)
  const showDesktopNav = useBreakpointMatch(['desktop', 'wide'])
  
  return (
    <nav>
      {breakpoint === 'mobile' ? <MobileMenu /> : <DesktopNav />}
    </nav>
  )
}
```

### Import and Use Layout Components

```tsx
import { Container, ResponsiveGrid } from '@/components/layout'

function SubjectsPage() {
  return (
    <Container size="lg">
      <h1>My Subjects</h1>
      
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <SubjectCard />
        <SubjectCard />
        <SubjectCard />
      </ResponsiveGrid>
    </Container>
  )
}
```

### Import and Use Viewport Utilities

```tsx
import { 
  isMobileViewport, 
  isTouchDevice, 
  prefersReducedMotion 
} from '@/lib/viewport'

// Use in non-React contexts or for one-time checks
if (isMobileViewport() && isTouchDevice()) {
  // Enable mobile touch interactions
}

if (prefersReducedMotion()) {
  // Disable animations
}
```

## Implementation Details

### 1. Responsive Hooks

#### `useMediaQuery(query: string): boolean`

**Purpose**: Match any CSS media query dynamically.

**When to use**: Custom viewport conditions not covered by standard breakpoints.

**Example Use Cases**:
- Check for specific screen orientations
- Detect high DPI displays
- Custom width ranges

```tsx
function QuizInterface() {
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const isHighDPI = useMediaQuery('(min-resolution: 2dppx)')
  
  return (
    <div className={isLandscape ? 'flex-row' : 'flex-col'}>
      {/* Quiz content */}
    </div>
  )
}
```

#### `useBreakpoint(): Breakpoint`

**Purpose**: Get the current breakpoint ('mobile' | 'tablet' | 'desktop' | 'wide').

**When to use**: When you need to know the exact breakpoint for logic or rendering.

**Breakpoint Thresholds**:
- Mobile: 0-767px
- Tablet: 768-1023px
- Desktop: 1024-1279px
- Wide: 1280px+

```tsx
function Navigation() {
  const breakpoint = useBreakpoint()
  
  // Render different layouts based on breakpoint
  if (breakpoint === 'mobile') {
    return <MobileNavigation />
  }
  
  return <DesktopNavigation />
}
```

#### `useBreakpointMatch(target: Breakpoint | Breakpoint[]): boolean`

**Purpose**: Check if current breakpoint matches one or more targets.

**When to use**: When you need a boolean check for specific breakpoints.

```tsx
function Sidebar() {
  const showSidebar = useBreakpointMatch(['desktop', 'wide'])
  
  if (!showSidebar) return null
  
  return <aside>Sidebar content</aside>
}
```

### 2. Viewport Utilities

All utilities in `src/lib/viewport.ts` are pure functions that can be used in non-React contexts.

#### Size Detection

```tsx
import { 
  getViewportSize, 
  isMobileViewport, 
  isTabletViewport, 
  isDesktopViewport,
  getViewportCategory 
} from '@/lib/viewport'

// Get exact dimensions
const { width, height } = getViewportSize()

// Boolean checks
if (isMobileViewport()) {
  // < 768px
}

if (isTabletViewport()) {
  // 768-1023px
}

if (isDesktopViewport()) {
  // >= 1024px
}

// Get category
const category = getViewportCategory() // 'mobile' | 'tablet' | 'desktop' | 'wide'
```

#### Device Characteristics

```tsx
import { 
  isTouchDevice, 
  getPixelRatio,
  isPortrait,
  isLandscape 
} from '@/lib/viewport'

// Touch detection
if (isTouchDevice()) {
  // Enable swipe gestures
  // Increase touch target sizes
}

// High DPI displays
const dpr = getPixelRatio()
if (dpr >= 2) {
  // Use @2x images
}

// Orientation
if (isPortrait()) {
  // Vertical layout
}
```

#### User Preferences

```tsx
import { 
  prefersReducedMotion, 
  prefersDarkMode, 
  prefersHighContrast 
} from '@/lib/viewport'

// Accessibility
if (prefersReducedMotion()) {
  // Disable animations
  // Use instant transitions
}

if (prefersHighContrast()) {
  // Enhance contrast ratios
}

// Theme preference
if (prefersDarkMode()) {
  // Apply dark theme
}
```

#### Resize Listener

```tsx
import { onViewportResize } from '@/lib/viewport'

// In a React component
useEffect(() => {
  const cleanup = onViewportResize(() => {
    console.log('Viewport resized!')
  }, 150) // 150ms debounce

  return cleanup
}, [])
```

### 3. Layout Components

#### `Container`

**Purpose**: Provide consistent max-width and padding across viewports.

**Props**:
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` (default: `'lg'`)
- `className`: Additional CSS classes
- `as`: HTML element to render (default: `'div'`)

**Size Guide**:
- `sm`: 640px - Narrow content (articles)
- `md`: 768px - Medium content (forms)
- `lg`: 1024px - Standard content (default)
- `xl`: 1280px - Wide content (dashboards)
- `full`: No constraint (hero sections)

**Padding**:
- Mobile: 16px (`px-4`)
- Tablet: 24px (`md:px-6`)
- Desktop: 32px (`lg:px-8`)

```tsx
// Page layout
function Page() {
  return (
    <Container size="lg" className="py-8">
      <h1 className="text-3xl font-bold mb-6">Page Title</h1>
      <p>Content with consistent padding and max-width</p>
    </Container>
  )
}

// Full-width hero
function Hero() {
  return (
    <Container size="full" className="bg-blue-500 py-16">
      <h1 className="text-4xl font-bold text-white">Welcome</h1>
    </Container>
  )
}
```

#### `ResponsiveGrid`

**Purpose**: Adaptive CSS Grid that changes columns based on viewport.

**Props**:
- `columns`: `{ mobile?: 1, tablet?: 1|2, desktop?: 1|2|3|4 }` (default: `{ mobile: 1, tablet: 2, desktop: 3 }`)
- `gap`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `className`: Additional CSS classes
- `as`: HTML element to render (default: `'div'`)

**Gap Sizes**:
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

```tsx
// Subject cards - 1-2-3 layout
function SubjectsList() {
  return (
    <ResponsiveGrid>
      {subjects.map(s => <SubjectCard key={s.id} subject={s} />)}
    </ResponsiveGrid>
  )
}

// Stats - 1-2-4 layout with large gaps
function StatsGrid() {
  return (
    <ResponsiveGrid 
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap="lg"
    >
      <StatCard title="Total" value={250} />
      <StatCard title="Mastered" value={120} />
      <StatCard title="Review" value={80} />
      <StatCard title="New" value={50} />
    </ResponsiveGrid>
  )
}
```

## Complete Integration Example

Here's a full example showing how all pieces work together:

```tsx
import { useBreakpoint, useMediaQuery } from '@/hooks'
import { Container, ResponsiveGrid } from '@/components/layout'
import { isTouchDevice, prefersReducedMotion } from '@/lib/viewport'
import { useEffect, useState } from 'react'

function SubjectsPage() {
  const breakpoint = useBreakpoint()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [touchEnabled, setTouchEnabled] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  useEffect(() => {
    setTouchEnabled(isTouchDevice())
    setAnimationsEnabled(!prefersReducedMotion())
  }, [])

  return (
    <Container size="xl">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          My Subjects
        </h1>
        <p className="text-gray-600">
          {breakpoint === 'mobile' 
            ? 'Tap a card to view details' 
            : 'Click or select a subject to get started'}
        </p>
      </header>

      {/* Stats grid - responsive columns */}
      <ResponsiveGrid 
        columns={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap="md"
        className="mb-8"
      >
        <StatCard 
          title="Total Subjects" 
          value={12}
          icon="📚"
          animate={animationsEnabled}
        />
        <StatCard 
          title="In Progress" 
          value={5}
          icon="📖"
          animate={animationsEnabled}
        />
        <StatCard 
          title="Completed" 
          value={7}
          icon="✅"
          animate={animationsEnabled}
        />
        <StatCard 
          title="Questions" 
          value={248}
          icon="❓"
          animate={animationsEnabled}
        />
      </ResponsiveGrid>

      {/* Subject cards grid */}
      <ResponsiveGrid 
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap="lg"
      >
        {subjects.map(subject => (
          <SubjectCard 
            key={subject.id}
            subject={subject}
            touchEnabled={touchEnabled}
            compact={isMobile}
            animate={animationsEnabled}
          />
        ))}
      </ResponsiveGrid>

      {/* Conditional sidebar on desktop */}
      {breakpoint !== 'mobile' && (
        <aside className="mt-8 lg:mt-0 lg:fixed lg:right-8 lg:top-24 lg:w-64">
          <QuickActions />
        </aside>
      )}
    </Container>
  )
}
```

## Best Practices

### 1. Choose the Right Tool

- **useBreakpoint**: When you need the exact breakpoint name
- **useBreakpointMatch**: When you need a boolean check
- **useMediaQuery**: When you need custom media queries
- **Viewport utilities**: For one-time checks or non-React code

### 2. Performance Optimization

```tsx
// ✅ Good - Single breakpoint check
const breakpoint = useBreakpoint()
const showFeature = breakpoint === 'desktop' || breakpoint === 'wide'

// ✅ Better - Use useBreakpointMatch
const showFeature = useBreakpointMatch(['desktop', 'wide'])

// ❌ Avoid - Multiple media query hooks
const isDesktop = useMediaQuery('(min-width: 1024px)')
const isWide = useMediaQuery('(min-width: 1280px)')
```

### 3. Responsive Component Pattern

```tsx
function ResponsiveComponent() {
  const breakpoint = useBreakpoint()
  
  // Define behavior based on breakpoint
  const config = {
    mobile: { columns: 1, gap: 'sm', showSidebar: false },
    tablet: { columns: 2, gap: 'md', showSidebar: false },
    desktop: { columns: 3, gap: 'lg', showSidebar: true },
    wide: { columns: 4, gap: 'lg', showSidebar: true },
  }[breakpoint]
  
  return (
    <div className="flex">
      <main className="flex-1">
        <ResponsiveGrid columns={config.columns} gap={config.gap}>
          {/* Content */}
        </ResponsiveGrid>
      </main>
      {config.showSidebar && <Sidebar />}
    </div>
  )
}
```

### 4. Accessibility

```tsx
function AccessibleResponsiveComponent() {
  const reduceMotion = prefersReducedMotion()
  const highContrast = prefersHighContrast()
  const breakpoint = useBreakpoint()
  
  return (
    <Container 
      className={cn(
        'transition-all',
        reduceMotion && 'transition-none',
        highContrast && 'contrast-high'
      )}
    >
      <ResponsiveGrid>
        {/* Content */}
      </ResponsiveGrid>
    </Container>
  )
}
```

## Testing

All utilities and components have comprehensive tests:

```bash
# Run all responsive tests
npm run test -- useMediaQuery.test.ts
npm run test -- useBreakpoint.test.ts
npm run test -- viewport.test.ts
npm run test -- Container.test.tsx
npm run test -- ResponsiveGrid.test.tsx
```

## Requirements Coverage

This implementation satisfies the following design requirements:

### Requirement 1.1: Responsive Layout System
✅ Mobile (< 768px), Tablet (768-1023px), Desktop (>1024px) breakpoints  
✅ Fluid typography and responsive sizing  
✅ Touch target sizing on mobile (44x44px minimum)  
✅ Orientation change handling (300ms reflow)  
✅ Prevents horizontal scrolling  
✅ CSS Grid and Flexbox for layouts  

### Requirement 1.2: Enhanced Navigation and Menu System
✅ Viewport-specific navigation rendering  
✅ Breakpoint-based component switching  

### Requirement 1.3: Card Component Enhancement
✅ Responsive grid layouts (1-2-3+ columns)  

### Requirement 1.8: Color Scheme and Theme Consistency
✅ Consistent spacing and sizing across breakpoints  

### Component Features
- **useMediaQuery**: Custom media query matching with SSR support
- **useBreakpoint**: Current breakpoint detection with debounced resize handling
- **useBreakpointMatch**: Boolean breakpoint matching for conditional rendering
- **Container**: Responsive padding (16px → 24px → 32px) and max-width constraints
- **ResponsiveGrid**: Configurable column layouts with gap control
- **Viewport utilities**: Device detection, orientation, user preferences, resize handling

## Migration Guide

If you have existing responsive code, here's how to migrate:

### Before (manual media queries)
```tsx
function OldComponent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### After (using hooks)
```tsx
function NewComponent() {
  const isMobile = useBreakpointMatch('mobile')
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

## Support and Documentation

- **Hooks Documentation**: `src/hooks/README.md`
- **Layout Components**: `src/components/layout/README.md`
- **Design Document**: `.kiro/specs/ui-ux-mobile-improvements/design.md`
- **Requirements**: `.kiro/specs/ui-ux-mobile-improvements/requirements.md`

## Summary

The responsive utilities implementation provides:

1. ✅ **useMediaQuery hook** for custom media query matching
2. ✅ **useBreakpoint hook** returning current breakpoint
3. ✅ **ResponsiveGrid component** with configurable columns
4. ✅ **Container component** with responsive padding and max-width
5. ✅ **Viewport utilities** for device detection and user preferences
6. ✅ Comprehensive test coverage for all utilities
7. ✅ Full TypeScript support with proper types
8. ✅ SSR-safe implementations
9. ✅ Performance optimized with debouncing
10. ✅ Accessibility-first design

All requirements for Task 1.2 have been successfully implemented! 🎉
