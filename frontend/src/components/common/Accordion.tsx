import { ReactNode, useState } from 'react'

export interface AccordionProps {
  title: string | ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  titleClassName?: string
  contentClassName?: string
}

/**
 * Accordion component for collapsible content sections
 * 
 * @example
 * <Accordion title="Explanation" defaultOpen={true}>
 *   <p>This is the explanation content</p>
 * </Accordion>
 */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = '',
  titleClassName = '',
  contentClassName = ''
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-150 flex items-center justify-between hover:scale-[1.01] ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-250 ease-in-out ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className={`px-6 py-4 border-t border-gray-200 bg-white animate-accordion-expand ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default Accordion
