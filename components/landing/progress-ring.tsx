'use client'

import { useEffect, useRef } from 'react'

import { brandTokens } from '@/design-tokens'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  color?: string
}

/**
 * Progress Ring Component
 * Circular progress indicator with smooth animation
 */
export function ProgressRing({
  value,
  size = 100,
  strokeWidth = 8,
  className,
  showLabel = true,
  color = brandTokens.accent,
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (value / 100) * circumference
      circleRef.current.style.strokeDashoffset = offset.toString()
    }
  }, [value, circumference])

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold" style={{ color }}>
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
}

