import React from 'react'

export interface ResponsiveGridProps {
  children: React.ReactNode
  /**
   * Number of columns for each breakpoint
   * Defaults: mobile: 1, tablet: 2, desktop: 3
   */
  columns?: {
    mobile?: 1
    tablet?: 1 | 2
    desktop?: 1 | 2 | 3 | 4
  }
  /**
   * Gap size between grid items
   * - sm: 16px (gap-4)
   * - md: 24px (gap-6) [default]
   * - lg: 32px (gap-8)
   */
  gap?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * HTML element to render as (default: 'div')
   */
  as?: keyof JSX.IntrinsicElements
}

/**
 * Responsive grid layout component with configurable columns
 * 
 * Adapts grid columns based on viewport size using CSS Grid.
 * Prevents horizontal scrolling and provides consistent gaps.
 * 
 * @example
 * // Default 1-2-3 column responsive grid
 * <ResponsiveGrid>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </ResponsiveGrid>
 * 
 * @example
 * // Custom column configuration with large gap
 * <ResponsiveGrid
 *   columns={{ mobile: 1, tablet: 2, desktop: 4 }}
 *   gap="lg"
 * >
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </ResponsiveGrid>
 * 
 * @example
 * // Single column on all breakpoints
 * <ResponsiveGrid columns={{ mobile: 1, tablet: 1, desktop: 1 }}>
 *   <div>Full width item</div>
 * </ResponsiveGrid>
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.8, 3.6, 14.5
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
  as: Component = 'div',
}: ResponsiveGridProps) {
  // Set default values if not provided
  const mobileCols = columns.mobile ?? 1
  const tabletCols = columns.tablet ?? 2
  const desktopCols = columns.desktop ?? 3

  // Map gap size to Tailwind classes
  const gapClasses = {
    sm: 'gap-4', // 16px
    md: 'gap-6', // 24px
    lg: 'gap-8', // 32px
  }

  // Build grid-cols classes for each breakpoint
  // Mobile (default, no prefix): always 1 column for mobile
  const mobileGridClass = `grid-cols-${mobileCols}`
  
  // Tablet (md:): 768px+
  const tabletGridClass = `md:grid-cols-${tabletCols}`
  
  // Desktop (lg:): 1024px+
  const desktopGridClass = `lg:grid-cols-${desktopCols}`

  return (
    <Component
      className={`
        grid
        ${mobileGridClass}
        ${tabletGridClass}
        ${desktopGridClass}
        ${gapClasses[gap]}
        w-full
        ${className}
      `.trim()}
    >
      {children}
    </Component>
  )
}
