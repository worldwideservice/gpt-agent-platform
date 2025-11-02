'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Kwid Badge компонент - значки статусов (Filament стиль)
 */
const kwidBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-custom-600 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-custom-600 text-white hover:bg-custom-500 dark:bg-custom-500 dark:hover:bg-custom-400',
        primary: 'bg-custom-600 text-white hover:bg-custom-500 dark:bg-custom-500 dark:hover:bg-custom-400',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
        success: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface KwidBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kwidBadgeVariants> {}

function KwidBadge({ className, variant, ...props }: KwidBadgeProps) {
  return <div className={cn(kwidBadgeVariants({ variant }), className)} {...props} />
}

export { KwidBadge, kwidBadgeVariants }

