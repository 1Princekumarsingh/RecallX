import React from 'react'

export interface CircularProgressProps {
  percentage: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'success' | 'warning' | 'error'
  strokeWidth?: number
  showPercentage?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Circular progress indicator component
 * 
 * @example
 * <CircularProgress 
 *   percentage={85} 
 *   label="Accuracy"
 *   size="lg"
 *   color={85 >= 80 ? 'success' : 'warning'}
 * />
 */
export function CircularProgress({
  percentage,
  label,
  size = 'md',
  color = 'primary',
  strokeWidth = 8,
  showPercentage = true,
  children,
  className = ''
}: CircularProgressProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  
  // Size configuration
  const sizeConfig = {
    sm: { size: 120, fontSize: 24, labelFontSize: 12 },
    md: { size: 160, fontSize: 32, labelFontSize: 14 },
    lg: { size: 200, fontSize: 40, labelFontSize: 16 },
    xl: { size: 240, fontSize: 48, labelFontSize: 18 }
  }
  
  const config = sizeConfig[size]
  const radius = (config.size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference

  // Color configuration
  const colorConfig = {
    primary: { bg: 'bg-blue-50', text: 'text-blue-600', stroke: '#3b82f6' },
    success: { bg: 'bg-green-50', text: 'text-green-600', stroke: '#10b981' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-600', stroke: '#f59e0b' },
    error: { bg: 'bg-red-50', text: 'text-red-600', stroke: '#ef4444' }
  }

  const colors = colorConfig[color]

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative inline-flex items-center justify-center rounded-full ${colors.bg}`} style={{ width: config.size, height: config.size }}>
        {/* SVG Circle */}
        <svg
          width={config.size}
          height={config.size}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Content */}
        <div className="text-center z-10">
          {children ? (
            children
          ) : (
            <>
              {showPercentage && (
                <div className={`font-bold`} style={{ fontSize: config.fontSize, color: colors.stroke }}>
                  {clampedPercentage.toFixed(0)}%
                </div>
              )}
              {label && (
                <div className="text-gray-600 mt-1" style={{ fontSize: config.labelFontSize }}>
                  {label}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CircularProgress
