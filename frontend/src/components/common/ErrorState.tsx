import { ReactNode } from 'react'
import Button from './Button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  icon?: ReactNode
}

export default function ErrorState({ title = 'Something went wrong', message, onRetry, icon }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      {icon ? <div className="mb-4 rounded-full bg-white p-4 text-red-600">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-red-700">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-red-600">{message}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}
