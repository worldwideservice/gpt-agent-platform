'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Kwid Skeleton компонент - загрузочные состояния (Filament стиль)
 */
function KwidSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
      {...props}
    />
  )
}

export { KwidSkeleton }

