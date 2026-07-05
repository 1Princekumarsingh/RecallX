import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockUseAuth = vi.fn()
const mockUseQuery = vi.fn()

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: (...args: Parameters<typeof actual.useQuery>) => mockUseQuery(...args)
  }
})

describe('Dashboard resume navigation', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'tester' } })
    mockUseQuery.mockReturnValue({ data: { overall_accuracy: 80, total_questions: 10, completed_questions: 8, review_questions: 1, errors: 1, last_chapter_id: 5, last_chapter_name: 'Chapter 5', last_session_key: '5-practice-unlimited---' }, isLoading: false })
  })

  it('includes the session key when continuing from the dashboard', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: /continue chapter/i }))

    const link = screen.getByRole('link', { name: /continue chapter/i })
    expect(link).toHaveAttribute('href', '/quiz/5?session_key=5-practice-unlimited---')
  })

  it('falls back to the standard quiz URL when no session key is available', () => {
    mockUseQuery.mockReturnValue({ data: { overall_accuracy: 80, total_questions: 10, completed_questions: 8, review_questions: 1, errors: 1, last_chapter_id: 8, last_chapter_name: 'Chapter 8' }, isLoading: false })

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /continue chapter/i })
    expect(link).toHaveAttribute('href', '/quiz/8')
  })
})
