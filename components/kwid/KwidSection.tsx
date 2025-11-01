'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Kwid Section компонент - collapsible секции с иконками (Filament стиль)
 */
export interface KwidSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  collapsible?: boolean
  defaultCollapsed?: boolean
  children: React.ReactNode
  className?: string
}

export function KwidSection({
  title,
  description,
  icon: Icon,
  collapsible = false,
  defaultCollapsed = false,
  children,
  className,
}: KwidSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <section className={cn('fi-section rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900', className)}>
      <div
        className={cn(
          'fi-section-header flex items-center justify-between p-4',
          collapsible && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
          !collapsible && 'border-b border-gray-200 dark:border-gray-800'
        )}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className="fi-section-header-icon h-6 w-6 text-gray-400 dark:text-gray-500" />
          )}
          <div>
            <h3 className="fi-section-header-heading text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="fi-section-header-description mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {collapsible && (
          <div className="text-gray-400">
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
      {(!collapsible || !isCollapsed) && (
        <div className="fi-section-content-ctn">
          <div className="fi-section-content p-4 pt-0">{children}</div>
        </div>
      )}
    </section>
  )
}

