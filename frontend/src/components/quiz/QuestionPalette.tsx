import { QuizState } from '@/types/quiz'

interface QuestionPaletteProps {
  state: QuizState
  onQuestionSelect: (index: number) => void
  onClose?: () => void
}

export default function QuestionPalette({ state, onQuestionSelect, onClose }: QuestionPaletteProps) {
  const getQuestionStatus = (index: number) => {
    const question = state.questions[index]
    const answer = state.answers.get(question.id)
    
    if (!answer) return 'not_visited'
    
    if (answer.is_bookmarked && answer.selected_answer) return 'marked'
    if (answer.is_bookmarked) return 'marked'
    if (answer.selected_answer) return 'answered'
    if (answer.is_visited) return 'unanswered'
    return 'not_visited'
  }

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return 'bg-primary-600 text-white border-primary-600'
    
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
      case 'marked':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
      case 'unanswered':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
      case 'not_visited':
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Question Palette</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4 hidden gap-2 text-sm text-slate-600 sm:grid sm:grid-cols-2">
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border border-emerald-300 bg-emerald-100"></div><span>Answered</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border border-violet-300 bg-violet-100"></div><span>Marked</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border border-rose-300 bg-rose-100"></div><span>Not answered</span></div>
        <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border border-slate-300 bg-slate-100"></div><span>Not visited</span></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
        {state.questions.map((question, index) => {
          const status = getQuestionStatus(index)
          const isCurrent = index === state.current_question_index
          
          return (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-200 sm:h-12 sm:w-full sm:min-h-[44px] ${getStatusColor(status, isCurrent)} ${isCurrent ? 'ring-2 ring-primary-300 ring-offset-2' : ''}`}
              title={`Question ${question.question_number}`}
            >
              {question.question_number}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Total:</span>
          <span className="font-semibold text-slate-900">{state.questions.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Answered:</span>
          <span className="font-semibold text-emerald-600">
            {Array.from(state.answers.values()).filter(a => a.selected_answer !== null).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Not answered:</span>
          <span className="font-semibold text-rose-600">
            {Array.from(state.answers.values()).filter(a => a.selected_answer === null && a.is_visited).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Marked:</span>
          <span className="font-semibold text-violet-600">
            {Array.from(state.answers.values()).filter(a => a.is_bookmarked).length}
          </span>
        </div>
      </div>
    </div>
  )
}
