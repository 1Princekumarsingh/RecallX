import { useEffect, useState } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  title: string
  message?: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

const iconStyles: Record<ToastVariant, string> = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  warning: 'text-amber-600',
  info: 'text-sky-600',
}

const icons: Record<ToastVariant, JSX.Element> = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0v-2a1 1 0 11-2 0v2zm1-7a1 1 0 011 1v.01a1 1 0 11-2 0V7a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M8.257 3.099c.366-.775 1.42-.775 1.786 0l6.518 13.837A1 1 0 0115.518 18H4.482a1 1 0 01-.943-1.332L8.257 3.1zM10 7a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1zm0 7a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 01-1-1V6a1 1 0 012 0v4a1 1 0 01-1 1z" />
    </svg>
  ),
}

export default function Toast({ id, title, message, variant = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 20)
    if (variant !== 'error') {
      const dismissTimer = window.setTimeout(() => {
        setIsVisible(false)
        window.setTimeout(() => onClose(id), 220)
      }, duration)

      return () => {
        window.clearTimeout(timer)
        window.clearTimeout(dismissTimer)
      }
    }

    return () => {
      window.clearTimeout(timer)
    }
  }, [duration, id, onClose, variant])

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-250 animate-slide-in-top ${variantStyles[variant]} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0'
      }`}
      aria-live="polite"
    >
      <div className={`mt-0.5 flex-shrink-0 ${iconStyles[variant]}`}>{icons[variant]}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {message ? <p className="mt-1 text-sm opacity-90">{message}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => {
          setIsVisible(false)
          window.setTimeout(() => onClose(id), 220)
        }}
        className="flex-shrink-0 rounded-full p-1 transition hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
  )
}
