import { QuizConfig, QuizState, QuizAnswer } from '@/types/quiz'

export function buildSessionKey(config: QuizConfig): string {
  return [
    config.chapter_id,
    config.mode,
    config.timer_mode,
    config.timer_value ?? '',
    config.batch_size ?? '',
    config.question_range?.start ?? '',
    config.question_range?.end ?? ''
  ].join('-')
}

export function serializeQuizState(state: QuizState) {
  return {
    ...state,
    answers: Object.fromEntries(state.answers as Map<number, QuizAnswer>)
  }
}

export function deserializeQuizState(raw: any): QuizState {
  const answers = new Map<number, QuizAnswer>()
  if (raw?.answers && typeof raw.answers === 'object') {
    for (const [key, value] of Object.entries(raw.answers)) {
      if (value && typeof value === 'object') {
        answers.set(Number(key), value as QuizAnswer)
      }
    }
  }

  return {
    ...raw,
    answers,
    questions: Array.isArray(raw.questions) ? raw.questions : [],
    current_question_index: typeof raw.current_question_index === 'number' ? raw.current_question_index : 0,
    start_time: typeof raw.start_time === 'number' ? raw.start_time : Date.now(),
    elapsed_time: typeof raw.elapsed_time === 'number' ? raw.elapsed_time : 0,
    is_paused: !!raw.is_paused,
    is_completed: !!raw.is_completed
  }
}
