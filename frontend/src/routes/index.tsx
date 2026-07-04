import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Subjects = lazy(() => import('@/pages/Subjects'))
const Chapters = lazy(() => import('@/pages/Chapters'))
const QuestionImport = lazy(() => import('@/pages/QuestionImport'))
const Quiz = lazy(() => import('@/pages/Quiz'))
const QuizResults = lazy(() => import('@/pages/QuizResults'))
const QuizReview = lazy(() => import('@/pages/QuizReview'))
const History = lazy(() => import('@/pages/History'))
const Statistics = lazy(() => import('@/pages/Statistics'))

function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>}>{children}</Suspense>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Quiz Route - Full screen, no layout */}
      <Route
        path="/quiz/:chapterId"
        element={
          <ProtectedRoute>
            <LazyRoute>
              <Quiz />
            </LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Quiz Results Route - Full screen, no layout */}
      <Route
        path="/quiz/results/:chapterId"
        element={
          <ProtectedRoute>
            <LazyRoute>
              <QuizResults />
            </LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Quiz Review Route - Full screen, no layout */}
      <Route
        path="/quiz/review/:chapterId"
        element={
          <ProtectedRoute>
            <LazyRoute>
              <QuizReview />
            </LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<LazyRoute><Dashboard /></LazyRoute>} />
        <Route path="subjects" element={<LazyRoute><Subjects /></LazyRoute>} />
        <Route path="subjects/:subjectId/chapters" element={<LazyRoute><Chapters /></LazyRoute>} />
        <Route path="subjects/:subjectId/chapters/:chapterId/import" element={<LazyRoute><QuestionImport /></LazyRoute>} />
        <Route path="history" element={<LazyRoute><History /></LazyRoute>} />
        <Route path="statistics" element={<LazyRoute><Statistics /></LazyRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
