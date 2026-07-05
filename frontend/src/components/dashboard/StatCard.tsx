import { ReactNode, useEffect, useState } from 'react'

type Accent = 'primary' | 'success' | 'warning' | 'error' | 'info'

interface Trend {
  direction: 'up' | 'down' | 'steady'
  label: string
}

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: ReactNode
  accent?: Accent
  progress?: number
  progressLabel?: string
  trend?: Trend
  tooltip?: string
  className?: string
  animate?: boolean
  precision?: number
  suffix?: string
}

const accentStyles: Record<Accent, { card: string; icon: string; track: string; fill: string }> = {
  primary: {
    card: 'border-primary-200 bg-gradient-to-br from-white to-primary-50',
    icon: 'bg-primary-100 text-primary-700',
    track: 'bg-primary-100',
    fill: 'bg-primary-600',
  },
  success: {
    card: 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50',
    icon: 'bg-emerald-100 text-emerald-700',
    track: 'bg-emerald-100',
    fill: 'bg-emerald-600',
  },
  warning: {
    card: 'border-amber-200 bg-gradient-to-br from-white to-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    track: 'bg-amber-100',
    fill: 'bg-amber-600',
  },
  error: {
    card: 'border-rose-200 bg-gradient-to-br from-white to-rose-50',
    icon: 'bg-rose-100 text-rose-700',
    track: 'bg-rose-100',
    fill: 'bg-rose-600',
  },
  info: {
    card: 'border-sky-200 bg-gradient-to-br from-white to-sky-50',
    icon: 'bg-sky-100 text-sky-700',
    track: 'bg-sky-100',
    fill: 'bg-sky-600',
  },
}

const trendIcons: Record<Trend['direction'], string> = {
  up: '▲',
  down: '▼',
  steady: '●',
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'primary',
  progress,
  progressLabel,
  trend,
  tooltip,
  className = '',
  animate = true,
  precision = 0,
  suffix = '',
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(typeof value === 'number' ? 0 : value)

  useEffect(() => {
    if (typeof value !== 'number' || !animate) {
      setDisplayValue(value)
      return
    }

    let frameId = 0
    const startTime = Date.now()
    const duration = 800
    const startValue = 0
    const endValue = value

    const step = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = startValue + (endValue - startValue) * eased
      setDisplayValue(Number(nextValue.toFixed(precision)))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
      } else {
        setDisplayValue(Number(endValue.toFixed(precision)))
      }
    }

    frameId = window.requestAnimationFrame(step)

    return () => window.cancelAnimationFrame(frameId)
  }, [animate, precision, value])

  const resolvedValue = typeof value === 'number' ? `${displayValue}${suffix}` : value
  const safeProgress = typeof progress === 'number' ? Math.min(100, Math.max(0, progress)) : undefined

  return (
    <article
      className={`group rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-7 ${accentStyles[accent].card} ${className}`.trim()}
      title={tooltip}
      aria-label={`${title}: ${resolvedValue}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 md:text-base">{title}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">{resolvedValue}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl md:h-16 md:w-16 ${accentStyles[accent].icon}`}>{icon}</div>
      </div>

      {subtitle ? <p className="mt-4 text-sm text-slate-600 md:text-base">{subtitle}</p> : null}

      {safeProgress !== undefined ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600 md:text-base">
            <span>{progressLabel ?? 'Progress'}</span>
            <span className="font-semibold text-slate-700">{Math.round(safeProgress)}%</span>
          </div>
          <div className={`h-3 overflow-hidden rounded-full ${accentStyles[accent].track}`}>
            <div className={`h-full rounded-full transition-all duration-500 ${accentStyles[accent].fill}`} style={{ width: `${safeProgress}%` }} />
          </div>
        </div>
      ) : null}

      {trend ? (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600 md:text-base">
          <span className="text-base md:text-lg" aria-hidden="true">{trendIcons[trend.direction]}</span>
          <span>{trend.label}</span>
        </div>
      ) : null}
    </article>
  )
}
