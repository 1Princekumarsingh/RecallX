import { useState, useEffect, useRef } from 'react'

interface QuizHeaderProps {
  title: string
  mode: 'practice' | 'exam'
  timer_mode: 'unlimited' | 'per_question' | 'whole_test'
  timer_value?: number
  start_time: number
  currentQuestionIndex?: number
  onTimeUp?: () => void
  onQuestionTimeUp?: () => void
  onExit: () => void
}

export default function QuizHeader({
  title,
  mode,
  timer_mode,
  timer_value,
  start_time,
  currentQuestionIndex = 0,
  onTimeUp,
  onQuestionTimeUp,
  onExit
}: QuizHeaderProps) {
  const [elapsed, setElapsed] = useState(0)
  const [questionRemaining, setQuestionRemaining] = useState(timer_value ?? 0)
  const [showWarning, setShowWarning] = useState(false)

  const onTimeUpRef = useRef(onTimeUp)
  const onQuestionTimeUpRef = useRef(onQuestionTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    onQuestionTimeUpRef.current = onQuestionTimeUp
  }, [onQuestionTimeUp])

  useEffect(() => {
    const interval = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - start_time) / 1000)
      setElapsed(newElapsed)

      if (timer_mode === 'whole_test' && timer_value) {
        const remaining = (timer_value * 60) - newElapsed
        if (remaining <= 300 && remaining > 0) {
          setShowWarning(true)
        }
        if (remaining <= 0) {
          onTimeUpRef.current?.()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [start_time, timer_mode, timer_value])

  useEffect(() => {
    if (timer_mode !== 'per_question' || !timer_value) return

    setQuestionRemaining(timer_value)
    setShowWarning(false)

    const interval = setInterval(() => {
      setQuestionRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onQuestionTimeUpRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer_mode, timer_value, currentQuestionIndex])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeDisplay = () => {
    const sharedClasses = 'rounded-2xl border px-3 py-2 shadow-sm'

    if (timer_mode === 'unlimited') {
      return (
        <div className={`${sharedClasses} border-slate-200 bg-slate-50`}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Elapsed</div>
          <div className="font-mono text-lg font-semibold text-slate-900">{formatTime(elapsed)}</div>
        </div>
      )
    }

    if (timer_mode === 'per_question' && timer_value) {
      const isLowTime = questionRemaining <= 10 && questionRemaining > 0
      const tone = isLowTime ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'

      return (
        <div className={`${sharedClasses} ${tone} ${isLowTime ? 'animate-pulse' : ''}`}>
          <div className="text-[11px] font-semibold uppercase tracking-wide">Question timer</div>
          <div className="font-mono text-lg font-semibold">{formatTime(questionRemaining)}</div>
        </div>
      )
    }

    if (timer_mode === 'whole_test' && timer_value) {
      const remaining = Math.max(0, (timer_value * 60) - elapsed)
      const isLowTime = remaining <= 300 && remaining > 0
      const tone = remaining <= 60 ? 'border-rose-200 bg-rose-50 text-rose-700' : isLowTime ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'

      return (
        <div className={`${sharedClasses} ${tone} ${isLowTime ? 'animate-pulse' : ''}`}>
          <div className="text-[11px] font-semibold uppercase tracking-wide">Time left</div>
          <div className="font-mono text-lg font-semibold">{formatTime(remaining)}</div>
          {showWarning && isLowTime && (
            <div className="text-[11px] font-medium">Hurry up</div>
          )}
        </div>
      )
    }

    return null
  }

  const handleExit = () => {
    const confirmed = window.confirm(
      'Are you sure you want to exit? Your progress will be saved and you can resume later.'
    )
    if (confirmed) {
      onExit()
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                mode === 'practice'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-violet-100 text-violet-700'
              }`}>
                {mode === 'practice' ? 'Practice' : 'Exam'}
              </span>
              {timer_mode !== 'unlimited' && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                  {timer_mode === 'per_question' ? 'Timed question' : 'Timed test'}
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            {getTimeDisplay()}
          </div>

          <button
            onClick={handleExit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Save & Exit</span>
          </button>
        </div>

        <div className="mt-3 flex justify-center md:hidden">
          {getTimeDisplay()}
        </div>
      </div>
    </div>
  )
}
