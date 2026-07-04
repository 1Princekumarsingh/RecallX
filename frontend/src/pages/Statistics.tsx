import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '@/api/statistics'
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid'

export default function Statistics() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statisticsApi.getDashboard()
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading statistics. Please try again.</p>
      </div>
    )
  }

  // Calculate total study time estimation or use 0 as placeholder
  // V1 does not have lifetime study duration database recording yet
  const studyHours = 0
  const studyMinutes = 0

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-sm text-gray-600">A snapshot of your progress and study focus.</p>
      </header>

      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Study Time</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{studyHours}h {studyMinutes}m</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Questions Solved</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.completed_questions ?? 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Overall Accuracy</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {stats && typeof stats.overall_accuracy === 'number'
              ? `${stats.overall_accuracy.toFixed(1)}%`
              : '0.0%'}
          </div>
        </div>
      </ResponsiveGrid>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Status Distribution</h3>
        <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="sm">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <span className="block text-sm text-gray-500">Total Questions</span>
            <span className="text-2xl font-bold text-gray-900">{stats?.total_questions ?? 0}</span>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <span className="block text-sm text-green-700">Completed</span>
            <span className="text-2xl font-bold text-green-950">{stats?.completed_questions ?? 0}</span>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <span className="block text-sm text-blue-700">In Review</span>
            <span className="text-2xl font-bold text-blue-950">{stats?.review_questions ?? 0}</span>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <span className="block text-sm text-red-700">Errors</span>
            <span className="text-2xl font-bold text-red-950">{stats?.errors ?? 0}</span>
          </div>
        </ResponsiveGrid>
      </div>
    </div>
  )
}
