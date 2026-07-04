import { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      {icon ? <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-600">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-gray-600">{description}</p> : null}
      {action ? (
        <div className="mt-6">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
