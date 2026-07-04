import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow sending http-only auth cookies
  withCredentials: true,
  // Increase timeout for Render free tier spin-up (default is 0 = no timeout)
  timeout: 60000, // 60 seconds to handle backend spin-up
})
// Do not attach Authorization header from localStorage here.
// The server accepts cookie-based sessions; callers may still set Authorization manually if needed.
api.interceptors.request.use((config) => config)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthMe = error.config?.url?.includes('/auth/me')
      const isLoginPage = window.location.pathname === '/login'
      if (!isAuthMe && !isLoginPage) {
        // Redirect to login when unauthorized. Client state is managed in AuthContext.
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
