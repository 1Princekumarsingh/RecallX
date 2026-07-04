import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

interface LoginFormData {
  username: string
}

interface ApiErrorResponse {
  response?: {
    data?: {
      detail?: string
    }
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: 'onBlur' })
  const usernameValue = watch('username', '')
  const usernameInputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...usernameRegisterProps } = register('username', {
    required: 'Username is required',
    minLength: {
      value: 1,
      message: 'Username must be at least 1 character',
    },
    maxLength: {
      value: 50,
      message: 'Username must be at most 50 characters',
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores',
    },
  })

  useEffect(() => {
    if (errors.username && usernameInputRef.current) {
      usernameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      usernameInputRef.current.focus()
    }
  }, [errors.username])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data.username)
      addToast({
        title: 'Welcome back',
        message: `Signed in as ${data.username}.`,
        variant: 'success',
        duration: 3000,
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse
      const message =
        apiError.response?.data?.detail ||
        'Login failed. Please check your username and try again.'
      setError(message)
      addToast({ title: 'Login failed', message, variant: 'error', duration: 5000 })
    } finally {
      setIsLoading(false)
    }
  }

  const isUsernameValid = useMemo(() => /^[a-zA-Z0-9_]+$/.test(usernameValue.trim()), [usernameValue])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">RecallX</h1>
          <p className="text-gray-600">Exam preparation and active recall learning</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Welcome</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                id="username"
                ref={(element) => {
                  ref(element)
                  usernameInputRef.current = element
                }}
                label="Username"
                type="text"
                autoComplete="username"
                inputMode="text"
                {...usernameRegisterProps}
                placeholder="Enter your username"
                error={errors.username?.message}
                success={Boolean(usernameValue.trim()) && !errors.username && isUsernameValid}
                currentLength={usernameValue.length}
                maxLength={50}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New user? Just enter a username to create an account automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
