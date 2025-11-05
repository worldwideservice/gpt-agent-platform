'use client'

import { Badge } from '@/components/ui'
import { CheckCircle2, Award, Star, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  title: string
  description?: string
  icon?: 'check' | 'award' | 'star' | 'trophy'
  unlocked?: boolean
  progress?: number // 0-100
  className?: string
}

const iconMap = {
  check: CheckCircle2,
  award: Award,
  star: Star,
  trophy: Trophy,
}

/**
 * Achievement Badge Component
 * Gamification element for showing user achievements
 */
export function AchievementBadge({
  title,
  description,
  icon = 'star',
  unlocked = false,
  progress = 0,
  className,
}: AchievementBadgeProps) {
  const Icon = iconMap[icon]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-300',
        unlocked
          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        unlocked && 'hover:scale-105 hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'rounded-full p-2 transition-colors',
            unlocked
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4
            className={cn(
              'font-semibold text-sm',
              unlocked ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {title}
          </h4>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{progress}%</p>
            </div>
          )}
        </div>
        {unlocked && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
    </div>
  )
}

