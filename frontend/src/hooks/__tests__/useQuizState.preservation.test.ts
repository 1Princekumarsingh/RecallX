import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useQuizState } from '../useQuizState'
import { serializeQuizState, deserializeQuizState } from '@/lib/quizProgress'
import type { QuizAnswer, QuizConfig, QuizQuestion } from '@/types/quiz'

const questions: QuizQuestion[] = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  question_number: index + 1,
  question_text: `Question ${index + 1}`,
  option_a: 'A',
  option_b: 'B',
  option_c: 'C',
  option_d: 'D',
  correct_answer: 'A'
}))

const config: QuizConfig = {
  chapter_id: 7,
  mode: 'practice',
  timer_mode: 'unlimited',
  timer_value: 60,
  batch_size: 4,
  question_range: { start: 1, end: 4 }
}

describe('useQuizState preservation behavior', () => {
  it('initializes a fresh quiz at question 1 with blank answers and the selected config', () => {
    const { result } = renderHook(() => useQuizState(config, questions))

    expect(result.current.state.current_question_index).toBe(0)
    expect(result.current.state.answers.size).toBe(questions.length)
    expect(result.current.state.config).toMatchObject(config)

    questions.forEach(question => {
      const answer = result.current.state.answers.get(question.id)
      expect(answer).toBeDefined()
      expect(answer?.selected_answer).toBeNull()
      expect(answer?.is_bookmarked).toBe(false)
      expect(answer?.is_visited).toBe(false)
    })
  })

  it('updates answer state correctly for multiple answer selections', () => {
    const { result } = renderHook(() => useQuizState(config, questions))

    act(() => {
      result.current.actions.selectAnswer(1, 'A')
      result.current.actions.selectAnswer(2, 'C')
      result.current.actions.selectAnswer(3, 'B')
    })

    const firstAnswer = result.current.state.answers.get(1)
    const secondAnswer = result.current.state.answers.get(2)
    const thirdAnswer = result.current.state.answers.get(3)

    expect(firstAnswer?.selected_answer).toBe('A')
    expect(firstAnswer?.is_visited).toBe(true)
    expect(secondAnswer?.selected_answer).toBe('C')
    expect(thirdAnswer?.selected_answer).toBe('B')
  })

  it('toggles bookmark state correctly and preserves it across state updates', () => {
    const { result } = renderHook(() => useQuizState(config, questions))

    act(() => {
      result.current.actions.toggleBookmark(2)
      result.current.actions.toggleBookmark(2)
    })

    const bookmarked = result.current.state.answers.get(2)
    expect(bookmarked?.is_bookmarked).toBe(false)
  })

  it('moves between questions and respects navigation boundaries', () => {
    const { result } = renderHook(() => useQuizState(config, questions))

    act(() => {
      result.current.actions.nextQuestion()
      result.current.actions.nextQuestion()
      result.current.actions.previousQuestion()
    })

    expect(result.current.state.current_question_index).toBe(1)

    act(() => {
      result.current.actions.goToQuestion(3)
    })
    expect(result.current.state.current_question_index).toBe(3)

    act(() => {
      result.current.actions.nextQuestion()
    })
    expect(result.current.state.current_question_index).toBe(3)
  })

  it('preserves quiz state through serialization and rehydration for save and exit flows', () => {
    const { result } = renderHook(() => useQuizState(config, questions))

    act(() => {
      result.current.actions.selectAnswer(1, 'A')
      result.current.actions.toggleBookmark(1)
      result.current.actions.goToQuestion(2)
    })

    const serialized = serializeQuizState(result.current.state)
    const restored = deserializeQuizState(serialized)

    expect(restored.current_question_index).toBe(2)
    expect(restored.answers.get(1)?.selected_answer).toBe('A')
    expect(restored.answers.get(1)?.is_bookmarked).toBe(true)
  })
})
