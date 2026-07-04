import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

export default function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`mx-auto my-6 w-full max-w-[28rem] rounded-[2.5rem] border border-slate-300 bg-slate-100 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.18)] ${className}`.trim()}>
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-inner">
        <div className="absolute inset-x-1/2 top-4 h-1.5 w-20 -translate-x-1/2 rounded-full bg-slate-300" />
        <div className="px-4 py-5 sm:px-6">{children}</div>
        <div className="absolute inset-x-1/2 bottom-4 h-1.5 w-24 -translate-x-1/2 rounded-full bg-slate-300" />
      </div>
    </div>
  )
}
