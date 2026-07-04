interface QuizNavigationBarProps {
  currentIndex: number
  totalQuestions: number
  answeredCount: number
  isAnswered: boolean
  isBookmarked: boolean
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  onToggleBookmark: () => void
  onTogglePalette: () => void
  onSubmit: () => void
}

export default function QuizNavigationBar({
  currentIndex,
  totalQuestions,
  answeredCount,
  isBookmarked,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onToggleBookmark,
  onTogglePalette,
  onSubmit
}: QuizNavigationBarProps) {
  const completionPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  return (
    <div className="border-t border-slate-200 bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <button
              onClick={onToggleBookmark}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 px-3 py-2 transition-all ${
                isBookmarked
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Mark for review'}
            >
              <svg className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <button
              onClick={onTogglePalette}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              title="View question palette"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Palette</span>
            </button>

            <button
              onClick={onSubmit}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Submit Quiz
            </button>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{answeredCount}/{totalQuestions} answered • {completionPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300" style={{ width: `${Math.min((currentIndex + 1) / totalQuestions * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
