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
      <header
        className={cn(
          'fi-section-header flex flex-col gap-3 px-6 py-4',
          collapsible && 'cursor-pointer'
        )}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className="fi-section-header-icon h-6 w-6 text-gray-400 dark:text-gray-500" />
            )}
            <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
              {title}
            </h3>
          </div>
          {collapsible && (
            <button
              type="button"
              className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:text-gray-500 dark:hover:text-gray-400"
              style={{
                '--c-300': 'var(--gray-300)',
                '--c-400': 'var(--gray-400)',
                '--c-500': 'var(--gray-500)',
                '--c-600': 'var(--gray-600)',
              } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation()
                setIsCollapsed(!isCollapsed)
              }}
            >
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  !isCollapsed && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>
        {description && (
          <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </header>
      {(!collapsible || !isCollapsed) && (
        <div className="fi-section-content p-6">{children}</div>
      )}
    </section>
  )
}

