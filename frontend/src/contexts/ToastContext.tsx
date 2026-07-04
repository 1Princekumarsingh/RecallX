import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'
import Toast, { ToastVariant } from '@/components/common/Toast'

interface ToastItem {
  id: string
  title: string
  message?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const nextToast = { ...toast, id }

    setToasts((current) => {
      const next = [nextToast, ...current].slice(0, 5)
      return next
    })
  }, [])

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-4 sm:top-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
