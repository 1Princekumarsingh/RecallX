# Design Document: UI/UX Mobile Improvements

## Overview

This design document outlines the comprehensive approach to enhancing the RecallX quiz application's user interface, user experience, and mobile responsiveness. The improvements focus exclusively on frontend presentation, interaction patterns, visual design, and responsive layouts while maintaining all existing backend functionality and API contracts.

### Design Goals

1. **Mobile-First Responsiveness**: Transform the application into a fully responsive experience optimized for mobile (320px-768px), tablet (769px-1024px), and desktop (>1024px) viewports
2. **Enhanced Visual Design**: Implement a cohesive, accessible, and modern design system with consistent styling patterns
3. **Improved Interactions**: Create smooth, purposeful animations and transitions that enhance usability
4. **Touch Optimization**: Implement mobile-specific touch interactions and gestures for natural touchscreen usage
5. **Accessibility Compliance**: Ensure WCAG 2.1 AA compliance for keyboard navigation, screen readers, and visual accessibility
6. **Performance Optimization**: Maintain fast load times and smooth interactions across all devices

### Design Principles

- **Progressive Enhancement**: Start with mobile design and enhance for larger screens
- **Consistency**: Use standardized components and patterns throughout the application
- **Feedback-Driven**: Provide immediate, clear feedback for all user actions
- **Accessibility-First**: Build accessibility into every component from the start
- **Performance-Conscious**: Optimize animations, images, and interactions for smooth performance

### Technology Stack

- **Framework**: React 18.2.0 with TypeScript
- **Styling**: TailwindCSS 3.4.1 with custom theme extensions
- **Routing**: React Router DOM 6.21.1
- **State Management**: TanStack Query 5.17.19 for server state
- **Build Tool**: Vite 5.0.11
- **Package Manager**: npm

## Architecture

### Component Architecture Overview

The UI/UX improvements will follow a layered component architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                    (Pages & Route Views)                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Feature Components                      │
│          (subjects, chapters, quiz, questions)               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Common UI Components                      │
│    (Button, Card, Modal, Toast, Input, Loading States)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Layout Components                       │
│        (Header, Navigation, Sidebar, Container)              │
└─────────────────────────────────────────────────────────────┘
```


### Responsive Design Architecture

#### Breakpoint Strategy

TailwindCSS breakpoints will be used consistently:

- **Mobile**: Default (no prefix) - 320px to 767px
- **Tablet**: `md:` prefix - 768px to 1023px
- **Desktop**: `lg:` prefix - 1024px and above
- **Wide Desktop**: `xl:` prefix - 1280px and above

#### Layout Patterns

**Mobile Layout Pattern**:
```
┌─────────────────────────────┐
│     Header (Fixed Top)      │
│   [☰ Menu]  [Title]  [User] │
├─────────────────────────────┤
│                             │
│    Main Content Area        │
│    (Full Width, Padded)     │
│                             │
│                             │
└─────────────────────────────┘
```

**Desktop Layout Pattern**:
```
┌─────────────────────────────────────────┐
│         Header (Fixed Top)              │
│  [Logo] [Nav] [Nav] [Nav]     [User]   │
├─────────────────────────────────────────┤
│                                         │
│        Main Content Area                │
│        (Max-Width Container)            │
│                                         │
└─────────────────────────────────────────┘
```

#### Grid System

The responsive grid system will adapt based on viewport:

- **Mobile**: Single column (1 col)
- **Tablet**: 2 columns for cards, forms remain single column
- **Desktop**: 3-4 columns for cards, 2 columns for forms
- **Wide Desktop**: Up to 4-5 columns for dense content

### State Management Architecture

UI state will be managed at appropriate levels:

1. **Local Component State**: Animation states, hover states, focus management
2. **Context State**: Theme preferences (future), notification queue, modal stack
3. **URL State**: Filters, sorting, pagination (via React Router)
4. **Server State**: All data fetching managed by TanStack Query (existing)

### Animation Architecture

Animations will be implemented using:

1. **CSS Transitions**: For simple hover, focus, and state changes
2. **CSS Animations**: For entrance/exit animations (fade, slide, scale)
3. **TailwindCSS Transition Utilities**: For consistent timing and easing
4. **Framer Motion** (if needed): For complex gesture-based animations (optional enhancement)


## Components and Interfaces

### 1. Responsive Layout System Components

#### Container Component

**Purpose**: Provides consistent max-width and padding across viewports

**Interface**:
```typescript
interface ContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}
```

**Responsive Behavior**:
- Mobile: Full width with 16px horizontal padding
- Tablet: Full width with 24px horizontal padding
- Desktop: Max-width based on size prop (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Prevents horizontal scrolling through `overflow-x-hidden`

#### ResponsiveGrid Component

**Purpose**: Adaptive grid layout for cards and content blocks

**Interface**:
```typescript
interface ResponsiveGridProps {
  children: ReactNode
  columns?: {
    mobile?: 1
    tablet?: 1 | 2
    desktop?: 1 | 2 | 3 | 4
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}
```

**Default Column Configuration**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Gap Sizes**:
- sm: 16px (gap-4)
- md: 24px (gap-6)
- lg: 32px (gap-8)

### 2. Navigation System Components

#### Header Component

**Purpose**: Top navigation bar that adapts to viewport size

**Interface**:
```typescript
interface HeaderProps {
  user: User | null
  onLogout: () => void
}
```

**Mobile Behavior**:
- Fixed positioning at top
- Hamburger menu icon (left)
- Application title (center)
- User menu icon (right)
- Height: 56px (14 in Tailwind)

**Desktop Behavior**:
- Fixed positioning at top
- Logo (left)
- Horizontal navigation links (center-left)
- User menu dropdown (right)
- Height: 64px (16 in Tailwind)

#### MobileMenu Component

**Purpose**: Slide-in navigation drawer for mobile devices

**Interface**:
```typescript
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: NavigationItem[]
  currentPath: string
}

interface NavigationItem {
  label: string
  path: string
  icon?: ReactNode
}
```

**Animation Behavior**:
- Slides in from left with 250ms transition
- Semi-transparent backdrop (bg-black/50)
- Closes on backdrop click, Escape key, or navigation
- Traps focus while open


#### DesktopNav Component

**Purpose**: Horizontal navigation bar for desktop viewports

**Interface**:
```typescript
interface DesktopNavProps {
  navigationItems: NavigationItem[]
  currentPath: string
}
```

**Features**:
- Active link highlighting with underline and color change
- Hover states with smooth transitions
- Keyboard navigation support (Tab, Enter)

### 3. Card Components

#### Card Component (Base)

**Purpose**: Flexible card container with consistent styling

**Interface**:
```typescript
interface CardProps {
  children: ReactNode
  variant?: 'elevated' | 'outlined' | 'flat'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
  className?: string
}
```

**Variants**:
- `elevated`: White background with shadow (default)
- `outlined`: White background with border, no shadow
- `flat`: Transparent background, no border or shadow

**Hover Behavior** (when hoverable=true):
- Scale up slightly (scale-[1.02])
- Increase shadow elevation
- Transition duration: 150ms
- Desktop only (no hover on mobile)

#### SubjectCard Component

**Purpose**: Display subject information with metadata

**Interface**:
```typescript
interface SubjectCardProps {
  subject: {
    id: string
    name: string
    chapter_count: number
    question_count: number
    completion_percentage: number
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onNavigate: (id: string) => void
}
```

**Responsive Layout**:
- Mobile: Stacked layout, full-width action buttons
- Desktop: Horizontal layout with action icons

**Status Indicators**:
- Completion bar with color-coded gradient:
  - 0-50%: Red gradient
  - 51-79%: Yellow gradient
  - 80-100%: Green gradient

#### ChapterCard Component

**Purpose**: Display chapter information with practice actions

**Interface**:
```typescript
interface ChapterCardProps {
  chapter: {
    id: string
    name: string
    question_count: number
    accuracy: number
    status_breakdown: {
      NEW: number
      MASTERED: number
      REVIEW: number
      ERROR: number
      ALMOST_FORGOT: number
    }
  }
  onStartPractice: (id: string) => void
  onContinue: (id: string) => void
  onImport: (id: string) => void
}
```

**Status Badges**:
- NEW: Gray background (#6B7280)
- MASTERED: Green background (#10B981)
- REVIEW: Blue background (#3B82F6)
- ERROR: Red background (#EF4444)
- ALMOST_FORGOT: Yellow background (#F59E0B)


#### QuestionCard Component

**Purpose**: Display question preview in import/review screens

**Interface**:
```typescript
interface QuestionCardProps {
  question: {
    id: string
    question_text: string
    options: { A: string; B: string; C: string; D: string }
    correct_answer: 'A' | 'B' | 'C' | 'D'
    validation_errors?: string[]
  }
  editable?: boolean
  onEdit?: (id: string, updates: Partial<Question>) => void
  onDelete?: (id: string) => void
}
```

**Features**:
- Alternating background colors for visual separation
- Inline editing when editable=true
- Error badge display with red styling
- Expandable/collapsible for long content

### 4. Modal and Dialog Components

#### Modal Component (Enhanced)

**Purpose**: Reusable modal container with responsive behavior

**Interface**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
  preventClose?: boolean
  showCloseButton?: boolean
}
```

**Responsive Behavior**:
- Mobile: Full-screen overlay (size prop ignored)
- Desktop: Centered modal with max-width (sm: 400px, md: 600px, lg: 800px)

**Animation**:
- Backdrop: Fade in 200ms
- Modal: Fade + scale (from 95% to 100%) in 200ms
- Exit: Reverse animation

**Accessibility**:
- Focus trap within modal
- Escape key closes (unless preventClose=true)
- Focus returns to trigger element on close
- aria-modal="true" and role="dialog"

#### ConfirmDialog Component

**Purpose**: Confirmation dialog for destructive actions

**Interface**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmVariant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}
```

**Features**:
- Color-coded confirm button based on severity
- Loading state during async operations
- Auto-focus on cancel button for safety

### 5. Form Components

#### Input Component (Enhanced)

**Purpose**: Styled input with validation and accessibility features

**Interface**:
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  success?: boolean
  icon?: ReactNode
  maxLength?: number
  showCharCount?: boolean
}
```

**Features**:
- Success checkmark icon when valid
- Error icon and message below field
- Character counter for maxLength inputs
- Focus state with primary color ring
- Appropriate mobile keyboard types (email, number, tel)


#### Button Component

**Purpose**: Consistent button styles across application

**Interface**:
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}
```

**Variants**:
- **primary**: Solid background (primary-600), white text, hover darker
- **secondary**: Outlined (border-primary-600), primary text, hover light background
- **tertiary**: No background, primary text, hover light background
- **danger**: Solid red background (red-600), white text, hover darker

**Sizes**:
- sm: 32px height (py-1.5 px-3), 14px text
- md: 40px height (py-2 px-4), 16px text
- lg: 48px height (py-3 px-6), 18px text

**Mobile Minimum Size**: 44px on mobile viewports (touch target requirement)

**Loading State**:
- Replace text with spinner
- Disable button
- Maintain width to prevent layout shift

### 6. Loading State Components

#### Spinner Component

**Purpose**: Loading indicator for async operations

**Interface**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  label?: string
}
```

**Sizes**:
- sm: 16px (w-4 h-4)
- md: 24px (w-6 h-6)
- lg: 32px (w-8 h-8)

#### SkeletonLoader Component

**Purpose**: Content placeholder that matches expected layout

**Interface**:
```typescript
interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'text' | 'avatar' | 'custom'
  count?: number
  className?: string
}
```

**Behavior**:
- Animated shimmer effect (pulse animation)
- Matches layout dimensions of expected content
- Gray background (bg-gray-200)

#### EmptyState Component

**Purpose**: Display when no data exists

**Interface**:
```typescript
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Features**:
- Centered layout with icon
- Descriptive message
- Optional call-to-action button
- Illustration or icon with muted colors

#### ErrorState Component

**Purpose**: Display error messages with retry functionality

**Interface**:
```typescript
interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  showIcon?: boolean
}
```


### Animation Presets

```javascript
animation: {
  'fade-in': 'fadeIn 200ms ease-in-out',
  'fade-out': 'fadeOut 200ms ease-in-out',
  'slide-in-left': 'slideInLeft 250ms ease-out',
  'slide-in-right': 'slideInRight 250ms ease-out',
  'slide-in-top': 'slideInTop 250ms ease-out',
  'scale-in': 'scaleIn 200ms ease-out',
  'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideInLeft: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  slideInRight: {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  slideInTop: {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(0)' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}

transition: {
  'DEFAULT': '150ms ease-in-out',
  'fast': '100ms ease-in-out',
  'slow': '300ms ease-in-out',
}
```

### Box Shadow Extensions

```javascript
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  'elevated': '0 4px 12px rgb(0 0 0 / 0.08)',
  'elevated-hover': '0 8px 16px rgb(0 0 0 / 0.12)',
}
```

## Mobile Touch Interactions

### Gesture System

#### Swipe Gesture Handler

**Purpose**: Enable swipe navigation in quiz interface

**Interface**:
```typescript
interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number // Minimum distance in pixels (default: 50)
  preventScroll?: boolean
}

function useSwipeGesture(options: UseSwipeGestureOptions): {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
}
```

**Implementation Details**:
- Track touch start position (clientX, clientY)
- Calculate delta on touch move
- Trigger callback if threshold exceeded
- Prevent default if preventScroll=true
- Visual feedback: Slide content slightly during swipe

#### Long Press Handler

**Purpose**: Show context menus on mobile

**Interface**:
```typescript
interface UseLongPressOptions {
  onLongPress: () => void
  delay?: number // milliseconds (default: 500)
}

function useLongPress(options: UseLongPressOptions): {
  onTouchStart: () => void
  onTouchEnd: () => void
  onTouchMove: () => void
}
```


#### Pull-to-Refresh Handler

**Purpose**: Refresh list data with pull-down gesture

**Interface**:
```typescript
interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number // Pull distance to trigger (default: 80px)
}

function usePullToRefresh(options: UsePullToRefreshOptions): {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
  isRefreshing: boolean
}
```

**Visual Feedback**:
- Show refresh indicator when pulling
- Animate spinner when threshold reached
- Hide indicator after refresh completes

#### Touch Target Sizing

All interactive elements will meet minimum touch target sizes:

- **Minimum Size**: 44x44px on mobile viewports (iOS HIG guideline)
- **Recommended Size**: 48x48px for primary actions (Material Design)
- **Spacing**: Minimum 8px between adjacent touch targets

**Implementation Strategy**:
```css
/* Apply to all buttons and interactive elements on mobile */
@media (max-width: 767px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Increase padding if content is smaller */
  button, a {
    padding: max(12px, (44px - 1em) / 2);
  }
}
```

### Haptic Feedback (Progressive Enhancement)

**Purpose**: Provide tactile feedback for actions on supporting devices

**Interface**:
```typescript
enum HapticPattern {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

function triggerHaptic(pattern: HapticPattern): void {
  if ('vibrate' in navigator) {
    const patterns: Record<HapticPattern, number[]> = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50],
    }
    navigator.vibrate(patterns[pattern])
  }
}
```

**Usage**:
- Button clicks: Light haptic
- Success actions: Success pattern
- Errors: Error pattern
- Delete actions: Warning pattern

### Preventing Unwanted Interactions

#### Double-Tap Prevention

**Strategy**: Debounce click handlers with 300ms delay

```typescript
function useDebounceClick<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastCallRef = useRef<number>(0)
  
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCallRef.current < delay) {
      return
    }
    lastCallRef.current = now
    callback(...args)
  }) as T
}
```

#### Pinch-Zoom Prevention

For specific UI elements (quiz options, buttons):

```css
.no-zoom {
  touch-action: manipulation;
  user-select: none;
}
```


## Accessibility Design

### Keyboard Navigation

#### Focus Management System

**Focus Trap**: Implement for modals and drawers

```typescript
function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return
    
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const modal = document.querySelector('[role="dialog"]')
    const elements = modal?.querySelectorAll(focusableElements)
    
    if (!elements || elements.length === 0) return
    
    const firstElement = elements[0] as HTMLElement
    const lastElement = elements[elements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    modal?.addEventListener('keydown', handleTabKey)
    firstElement.focus()
    
    return () => modal?.removeEventListener('keydown', handleTabKey)
  }, [isActive])
}
```

#### Skip Links

**Purpose**: Allow keyboard users to skip repetitive navigation

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

**Skip Link Targets**:
- Skip to main content
- Skip to navigation
- Skip to search (if applicable)

#### Focus Indicators

All interactive elements will have visible focus indicators:

```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid theme('colors.primary.600');
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 3px;
    outline-color: currentColor;
  }
}
```

### Screen Reader Support

#### ARIA Labels and Descriptions

**Icon-Only Buttons**:
```tsx
<button aria-label="Delete subject">
  <TrashIcon />
</button>
```

**Form Inputs**:
```tsx
<input
  id="subject-name"
  aria-describedby="subject-name-helper"
  aria-invalid={!!error}
  aria-required={required}
/>
{error && <p id="subject-name-error" role="alert">{error}</p>}
```

**Dynamic Content**:
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {successMessage}
</div>

<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {errorMessage}
</div>
```

#### Semantic HTML Structure

```html
<body>
  <a href="#main-content" class="sr-only">Skip to main content</a>
  
  <header>
    <nav aria-label="Main navigation">
      <!-- Navigation items -->
    </nav>
  </header>
  
  <main id="main-content">
    <h1>Page Title</h1>
    
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section Title</h2>
      <!-- Section content -->
    </section>
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
</body>
```


### Color Contrast Compliance

All text and interactive elements will meet WCAG 2.1 AA standards:

- **Normal text** (< 18px or < 14px bold): Minimum 4.5:1 contrast ratio
- **Large text** (≥ 18px or ≥ 14px bold): Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio for borders/icons

**Verification Strategy**:
- Use Tailwind's default color palette (already optimized for contrast)
- Test custom colors with contrast checker tools
- Avoid light text on light backgrounds or dark text on dark backgrounds

**Example Compliant Combinations**:
```typescript
const contrastPairs = {
  'bg-white text-gray-900': '21:1',      // Excellent
  'bg-primary-600 text-white': '4.5:1',  // AA compliant
  'bg-success-500 text-white': '3.4:1',  // AA large text
  'bg-gray-100 text-gray-700': '7.2:1',  // Excellent
}
```

### Reduced Motion Support

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Alternative Feedback**: Provide instant state changes instead of animations when motion is reduced

```tsx
function AnimatedComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  
  return (
    <div
      className={prefersReducedMotion ? 'opacity-100' : 'animate-fade-in'}
    >
      {/* Content */}
    </div>
  )
}
```

## Error Handling

### Form Validation Patterns

#### Real-Time Validation

**Strategy**: Validate on blur for better UX

```typescript
interface UseFieldValidationOptions {
  rules: ValidationRule[]
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

function useFieldValidation(options: UseFieldValidationOptions) {
  const [error, setError] = useState<string>()
  const [touched, setTouched] = useState(false)
  
  const validate = (value: any) => {
    for (const rule of options.rules) {
      const result = rule.validate(value)
      if (!result.valid) {
        setError(result.message)
        return false
      }
    }
    setError(undefined)
    return true
  }
  
  const handleBlur = () => {
    setTouched(true)
    if (options.validateOnBlur) {
      validate(value)
    }
  }
  
  return { error: touched ? error : undefined, validate, handleBlur }
}
```

#### Validation Rules

Common validation rules for RecallX forms:

```typescript
const validationRules = {
  required: (message = 'This field is required') => ({
    validate: (value: any) => ({
      valid: !!value && value.toString().trim().length > 0,
      message,
    }),
  }),
  
  minLength: (min: number, message?: string) => ({
    validate: (value: string) => ({
      valid: value.length >= min,
      message: message || `Minimum ${min} characters required`,
    }),
  }),
  
  maxLength: (max: number, message?: string) => ({
    validate: (value: string) => ({
      valid: value.length <= max,
      message: message || `Maximum ${max} characters allowed`,
    }),
  }),
  
  pattern: (regex: RegExp, message: string) => ({
    validate: (value: string) => ({
      valid: regex.test(value),
      message,
    }),
  }),
}
```

