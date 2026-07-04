import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  variant?: 'elevated' | 'outlined' | 'flat'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'rounded-2xl border border-gray-200 bg-white transition-all duration-150'
  const variantClasses = {
    elevated: 'shadow-sm',
    outlined: 'shadow-none',
    flat: 'border-transparent bg-transparent shadow-none',
  }
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }
  const interactiveClasses = hoverable ? 'cursor-pointer hover:scale-105 hover:shadow-elevated-hover active:scale-95 transform' : ''
  const interactiveAttrs = onClick ? { role: 'button', tabIndex: 0, onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick() } } } : {}

  return (
    <section
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`.trim()}
      onClick={onClick}
      {...interactiveAttrs}
      {...props}
    >
      {children}
    </section>
  )
}
