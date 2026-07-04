/**
 * ResponsiveExample Component
 * 
 * Demonstrates the usage of responsive hooks, utilities, and layout components.
 * This is an example/reference component showing best practices.
 * 
 * To use: Import in any page to see responsive behavior in action.
 */

import { useEffect, useState } from 'react'
import { useBreakpoint, useMediaQuery, useBreakpointMatch } from '@/hooks'
import { Container, ResponsiveGrid } from '@/components/layout'
import { 
  getViewportSize, 
  isTouchDevice, 
  prefersReducedMotion,
  isPortrait,
  getPixelRatio 
} from '@/lib/viewport'

interface InfoCardProps {
  title: string
  value: string | number | boolean
  description: string
  color?: string
}

function InfoCard({ title, value, description, color = 'blue' }: InfoCardProps) {
  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
      <h3 className="font-semibold text-${color}-900 mb-2">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600 mb-1`}>
        {String(value)}
      </p>
      <p className="text-sm text-${color}-700">{description}</p>
    </div>
  )
}

export function ResponsiveExample() {
  // Hooks
  const breakpoint = useBreakpoint()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useBreakpointMatch(['desktop', 'wide'])
  
  // State for viewport info
  const [viewportInfo, setViewportInfo] = useState({
    width: 0,
    height: 0,
    touch: false,
    reduceMotion: false,
    portrait: false,
    pixelRatio: 1,
  })

  useEffect(() => {
    const updateInfo = () => {
      const { width, height } = getViewportSize()
      setViewportInfo({
        width,
        height,
        touch: isTouchDevice(),
        reduceMotion: prefersReducedMotion(),
        portrait: isPortrait(),
        pixelRatio: getPixelRatio(),
      })
    }

    updateInfo()
    window.addEventListener('resize', updateInfo)
    return () => window.removeEventListener('resize', updateInfo)
  }, [])

  return (
    <Container size="xl" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Responsive Utilities Demo
        </h1>
        <p className="text-gray-600">
          This page demonstrates the responsive hooks, utilities, and layout components.
        </p>
      </div>

      {/* Current Breakpoint Indicator */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Current Breakpoint</h2>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold capitalize">{breakpoint}</span>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {['mobile', 'tablet', 'desktop', 'wide'].map((bp) => (
                <span
                  key={bp}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    breakpoint === bp
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-700 text-blue-100'
                  }`}
                >
                  {bp}
                </span>
              ))}
            </div>
            <p className="text-sm text-blue-100">
              Resize your browser window to see the breakpoint change
            </p>
          </div>
        </div>
      </div>

      {/* Viewport Information Grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Viewport Information</h2>
      <ResponsiveGrid 
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap="md"
        className="mb-8"
      >
        <InfoCard
          title="Width × Height"
          value={`${viewportInfo.width} × ${viewportInfo.height}`}
          description="Current viewport dimensions"
          color="blue"
        />
        <InfoCard
          title="Touch Device"
          value={viewportInfo.touch ? 'Yes' : 'No'}
          description="Touch capability detected"
          color={viewportInfo.touch ? 'green' : 'gray'}
        />
        <InfoCard
          title="Pixel Ratio"
          value={`${viewportInfo.pixelRatio}x`}
          description="Device pixel density"
          color="purple"
        />
        <InfoCard
          title="Orientation"
          value={viewportInfo.portrait ? 'Portrait' : 'Landscape'}
          description="Current screen orientation"
          color="indigo"
        />
        <InfoCard
          title="Reduced Motion"
          value={viewportInfo.reduceMotion ? 'On' : 'Off'}
          description="User motion preference"
          color={viewportInfo.reduceMotion ? 'orange' : 'gray'}
        />
        <InfoCard
          title="Media Queries"
          value={isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
          description="Via useMediaQuery hook"
          color="teal"
        />
      </ResponsiveGrid>

      {/* Hook Results */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Hook Results</h2>
      <ResponsiveGrid 
        columns={{ mobile: 1, tablet: 1, desktop: 2 }}
        gap="lg"
        className="mb-8"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">useBreakpoint()</h3>
          <div className="space-y-2 text-sm">
            <p className="font-mono bg-gray-100 p-2 rounded">
              breakpoint = "{breakpoint}"
            </p>
            <p className="text-gray-600">
              Returns the current breakpoint name. Updates automatically on resize.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">useBreakpointMatch()</h3>
          <div className="space-y-2 text-sm">
            <p className="font-mono bg-gray-100 p-2 rounded">
              isDesktop = {String(isDesktop)}
            </p>
            <p className="text-gray-600">
              Returns boolean for breakpoint match. Example checks for ['desktop', 'wide'].
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">useMediaQuery()</h3>
          <div className="space-y-2 text-sm">
            <p className="font-mono bg-gray-100 p-2 rounded">
              isMobile = {String(isMobile)}
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              isTablet = {String(isTablet)}
            </p>
            <p className="text-gray-600">
              Returns boolean for custom media queries. Accepts any CSS media query string.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Viewport Utilities</h3>
          <div className="space-y-2 text-sm">
            <p className="font-mono bg-gray-100 p-2 rounded">
              getViewportSize()
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              isTouchDevice()
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              prefersReducedMotion()
            </p>
            <p className="text-gray-600">
              Utility functions for device detection and user preferences.
            </p>
          </div>
        </div>
      </ResponsiveGrid>

      {/* Layout Components Demo */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Layout Components</h2>
      
      <div className="space-y-8">
        {/* Container Demo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Container Component</h3>
          <p className="text-gray-600 mb-4">
            The Container component provides consistent max-width and responsive padding.
          </p>
          <div className="space-y-4">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Container key={size} size={size} className="bg-blue-100 border border-blue-300">
                <p className="text-blue-900 text-sm font-mono">
                  Container size="{size}" - Max-width: {
                    size === 'sm' ? '640px' :
                    size === 'md' ? '768px' :
                    size === 'lg' ? '1024px' :
                    size === 'xl' ? '1280px' : 'full'
                  }
                </p>
              </Container>
            ))}
          </div>
        </div>

        {/* ResponsiveGrid Demo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">ResponsiveGrid Component</h3>
          <p className="text-gray-600 mb-4">
            Current grid: {
              isMobile ? '1 column' :
              isTablet ? '2 columns' :
              breakpoint === 'desktop' ? '3 columns' :
              '4 columns'
            }
          </p>
          
          <ResponsiveGrid 
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="md"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-6 text-white text-center"
              >
                <span className="text-2xl font-bold">Card {num}</span>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      </div>

      {/* Responsive Behavior Guide */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Try These Actions</h3>
        <ul className="space-y-2 text-yellow-800 text-sm">
          <li>• Resize your browser window to see breakpoint changes</li>
          <li>• Rotate your device (mobile/tablet) to see orientation changes</li>
          <li>• Check on different devices to see touch detection</li>
          <li>• Enable reduced motion in your OS settings to see that preference</li>
          <li>• View on high DPI displays to see pixel ratio detection</li>
        </ul>
      </div>

      {/* Code Examples */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Examples</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">
{`// Import hooks
import { useBreakpoint, useMediaQuery } from '@/hooks'

// Use in component
const breakpoint = useBreakpoint()
const isMobile = useMediaQuery('(max-width: 767px)')

// Conditional rendering
{breakpoint === 'mobile' ? <MobileView /> : <DesktopView />}`}
            </pre>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">
{`// Import layout components
import { Container, ResponsiveGrid } from '@/components/layout'

// Use in component
<Container size="lg">
  <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
    <Card />
    <Card />
    <Card />
  </ResponsiveGrid>
</Container>`}
            </pre>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ResponsiveExample
