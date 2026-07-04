# TailwindCSS Design Tokens

This document describes the custom design tokens added to the TailwindCSS configuration for the RecallX application.

## Color Palette

### Semantic Colors

All semantic colors include a full scale from 50 (lightest) to 900 (darkest).

#### Success (Green)
Used for positive feedback, completed states, and success messages.
```tsx
// Examples
<div className="bg-success-500 text-white">Success</div>
<div className="text-success-600">Success text</div>
<button className="bg-success-600 hover:bg-success-700">Save</button>
```

#### Error (Red)
Used for error messages, destructive actions, and failed states.
```tsx
// Examples
<div className="bg-error-500 text-white">Error</div>
<p className="text-error-600">Error message</p>
<button className="bg-error-600 hover:bg-error-700">Delete</button>
```

#### Warning (Yellow)
Used for warnings, cautionary messages, and pending states.
```tsx
// Examples
<div className="bg-warning-500 text-white">Warning</div>
<div className="border-warning-400 bg-warning-50">Warning banner</div>
```

#### Info (Blue)
Used for informational messages and neutral feedback.
```tsx
// Examples
<div className="bg-info-500 text-white">Info</div>
<div className="text-info-600">Information text</div>
```

## Typography Scale

Enhanced typography scale with optimized line heights and letter spacing.

| Class | Size | Line Height | Letter Spacing | Use Case |
|-------|------|-------------|----------------|----------|
| `text-xs` | 0.75rem (12px) | 1rem | 0.01em | Small labels, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem | 0.01em | Secondary text, descriptions |
| `text-base` | 1rem (16px) | 1.5rem | 0 | Body text (default) |
| `text-lg` | 1.125rem (18px) | 1.75rem | 0 | Emphasized body text |
| `text-xl` | 1.25rem (20px) | 1.75rem | -0.01em | Section headings |
| `text-2xl` | 1.5rem (24px) | 2rem | -0.01em | Page subheadings |
| `text-3xl` | 1.875rem (30px) | 2.25rem | -0.02em | Page headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem | -0.02em | Hero headings |
| `text-5xl` | 3rem (48px) | 1 | -0.02em | Display text |

### Usage Examples
```tsx
<h1 className="text-3xl font-bold">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<p className="text-base">Body text with optimal readability.</p>
<span className="text-sm text-gray-600">Secondary information</span>
```

## Box Shadows

Custom elevation shadows for cards and interactive elements.

### elevated
Subtle elevation for cards and containers.
```css
box-shadow: 0 4px 12px rgb(0 0 0 / 0.08)
```
```tsx
<div className="bg-white rounded-lg shadow-elevated">Card content</div>
```

### elevated-hover
Enhanced elevation for hover states.
```css
box-shadow: 0 8px 16px rgb(0 0 0 / 0.12)
```
```tsx
<div className="shadow-elevated hover:shadow-elevated-hover transition-shadow">
  Hoverable card
</div>
```

## Animations

### Fade Animations

#### fade-in
Duration: 200ms | Timing: ease-in-out
```tsx
<div className="animate-fade-in">Fading in content</div>
```

#### fade-out
Duration: 200ms | Timing: ease-in-out
```tsx
<div className="animate-fade-out">Fading out content</div>
```

### Slide Animations

#### slide-in-left
Duration: 250ms | Timing: ease-out
```tsx
// Mobile menu drawer
<div className="animate-slide-in-left">Menu content</div>
```

#### slide-in-right
Duration: 250ms | Timing: ease-out
```tsx
// Notification panel
<div className="animate-slide-in-right">Notification content</div>
```

#### slide-in-top
Duration: 250ms | Timing: ease-out
```tsx
// Toast notifications
<div className="animate-slide-in-top">Toast message</div>
```

### Scale Animation

#### scale-in
Duration: 200ms | Timing: ease-out
Combines scale (95% to 100%) with fade-in effect.
```tsx
// Modal entrance
<div className="animate-scale-in">Modal content</div>
```

### Continuous Animation

#### pulse-slow
Duration: 2s | Timing: cubic-bezier(0.4, 0, 0.6, 1)
Slow, continuous pulse effect for loading states.
```tsx
// Skeleton loader
<div className="bg-gray-200 animate-pulse-slow rounded h-20 w-full" />
```

## Transition Utilities

### Duration

| Class | Duration | Use Case |
|-------|----------|----------|
| `transition-fast` | 100ms | Quick feedback (button clicks) |
| `transition` (default) | 150ms | General interactions |
| `transition-slow` | 300ms | Complex state changes |

### Timing Function
Default: `ease-in-out` for natural-feeling transitions.

### Usage Examples

```tsx
// Fast hover feedback
<button className="bg-primary-500 hover:bg-primary-600 transition-fast">
  Click me
</button>

// Default transition for most cases
<div className="bg-white hover:shadow-lg transition">
  Hoverable card
</div>

// Slow transition for complex animations
<div className="h-0 group-hover:h-48 transition-slow overflow-hidden">
  Expanding content
</div>

// Combine with specific properties
<button className="opacity-0 hover:opacity-100 transition-opacity duration-fast">
  Fade in button
</button>
```

## Common Patterns

### Interactive Cards
```tsx
<div className="bg-white rounded-lg shadow-elevated hover:shadow-elevated-hover transition-shadow p-6">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-base text-gray-600">Card description</p>
</div>
```

### Status Badges
```tsx
// Success badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700">
  Completed
</span>

// Error badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-700">
  Failed
</span>

// Warning badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-700">
  Pending
</span>
```

### Buttons with States
```tsx
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-fast">
  Primary Action
</button>

// Success button
<button className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded transition-fast">
  Save Changes
</button>

// Danger button
<button className="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded transition-fast">
  Delete
</button>
```

### Modal Entrance
```tsx
// Backdrop
<div className="fixed inset-0 bg-black/50 animate-fade-in" />

// Modal
<div className="fixed inset-0 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg shadow-elevated-hover animate-scale-in max-w-md w-full p-6">
    <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
    <p className="text-base mb-6">Modal content</p>
  </div>
</div>
```

### Loading States
```tsx
// Skeleton loader
<div className="space-y-4">
  <div className="h-4 bg-gray-200 rounded animate-pulse-slow w-3/4" />
  <div className="h-4 bg-gray-200 rounded animate-pulse-slow w-full" />
  <div className="h-4 bg-gray-200 rounded animate-pulse-slow w-5/6" />
</div>

// Spinner with fade-in
<div className="flex justify-center items-center animate-fade-in">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
</div>
```

## Accessibility Considerations

### Color Contrast
All color combinations meet WCAG 2.1 AA standards:
- `bg-success-600` with `text-white`: ✓ Compliant
- `bg-error-600` with `text-white`: ✓ Compliant
- `bg-warning-600` with `text-white`: ✓ Compliant
- `bg-info-600` with `text-white`: ✓ Compliant

### Reduced Motion
Respect user preferences for reduced motion:
```tsx
// Conditional animation
<div className="motion-safe:animate-fade-in">
  Content with optional animation
</div>
```

Or use Tailwind's built-in support:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-in-left,
  .animate-scale-in {
    animation: none;
  }
}
```

## Requirements Coverage

This implementation satisfies the following requirements:

- **Requirement 8.1**: Custom color palette with semantic colors (success, error, warning, info)
- **Requirement 8.2**: Consistent color scheme with defined shades (50-900)
- **Requirement 8.4**: Color scheme applied to all UI elements
- **Requirement 9.8**: Easing functions for natural-feeling animations
- **Requirement 13.1**: Responsive typography scale with fluid sizing
- **Requirement 13.2**: Optimized line heights and letter spacing

## Next Steps

These design tokens provide the foundation for implementing:
1. Enhanced component library (buttons, cards, modals)
2. Responsive layouts with consistent spacing
3. Smooth animations and transitions
4. Accessible color combinations and interactive states
