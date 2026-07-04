import { useCallback, useMemo, useState } from 'react'

export interface ValidationRuleSet {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
}

interface UseFieldValidationOptions {
  initialValue?: string
  rules?: ValidationRuleSet
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useFieldValidation({
  initialValue = '',
  rules,
  validateOnChange = true,
  validateOnBlur = true
}: UseFieldValidationOptions = {}) {
  const [value, setValue] = useState(initialValue)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const validate = useCallback((nextValue: string) => {
    if (!rules) return undefined

    const trimmedValue = nextValue.trim()

    if (rules.required) {
      const requiredMessage = typeof rules.required === 'string' ? rules.required : 'This field is required'
      if (!trimmedValue) return requiredMessage
    }

    if (rules.minLength && trimmedValue.length < rules.minLength.value) {
      return rules.minLength.message
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength.value) {
      return rules.maxLength.message
    }

    if (rules.pattern && !rules.pattern.value.test(trimmedValue)) {
      return rules.pattern.message
    }

    return undefined
  }, [rules])

  const handleChange = useCallback((nextValue: string) => {
    setValue(nextValue)

    if (validateOnChange) {
      const validationError = validate(nextValue)
      setError(validationError)
    }
  }, [validate, validateOnChange])

  const handleBlur = useCallback(() => {
    setTouched(true)

    if (validateOnBlur) {
      setError(validate(value))
    }
  }, [validate, validateOnBlur, value])

  const reset = useCallback(() => {
    setValue(initialValue)
    setTouched(false)
    setError(undefined)
  }, [initialValue])

  const isValid = useMemo(() => !error && Boolean(value.trim()), [error, value])

  return {
    value,
    setValue,
    error,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validate,
    reset,
    setError,
    setTouched
  }
}
