import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Input from './Input'

describe('Input accessibility', () => {
  it('associates validation feedback with the input and exposes it to assistive tech', () => {
    render(<Input id="email" label="Email" error="Email is required" helperText="We will never share your email" />)

    const input = screen.getByLabelText(/email/i)
    const errorMessage = screen.getByRole('alert')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(errorMessage).toHaveTextContent('Email is required')
    expect(errorMessage).toHaveAttribute('aria-live', 'polite')
  })
})
