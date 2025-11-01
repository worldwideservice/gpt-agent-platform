'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Kwid Tooltip компонент - всплывающие подсказки (Filament стиль)
 * Упрощенная версия без Radix UI для избежания зависимостей
 */
export interface KwidTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const KwidTooltip = React.forwardRef<HTMLDivElement, KwidTooltipProps>(
  ({ children, content, side = 'top', className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      >
        {children}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-950 shadow-md dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50',
              side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
              side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
              side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
              side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'
            )}
          >
            {content}
          </div>
        )}
      </div>
    )
  }
)
KwidTooltip.displayName = 'KwidTooltip'

export { KwidTooltip }

