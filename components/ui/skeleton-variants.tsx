import * as React from 'react'

import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

/**
 * Skeleton для таблицы
 *
 * Референс: references-kwid/HEADER_DETAILED_REPORT.md (строки 929-941)
 * План: docs/FRONTEND_ACTION_PLAN.md (Day 5-7)
 *
 * @example
 * ```tsx
 * <TableSkeleton rows={5} columns={4} />
 * ```
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}: {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}) {
  return (
    <div className={cn('w-full space-y-3', className)} role="status" aria-label="Загрузка таблицы">
      {/* Header */}
      {showHeader && (
        <div className="flex gap-4 border-b pb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`header-${colIndex}`} className="h-5 flex-1" />
          ))}
        </div>
      )}

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-12 flex-1" />
          ))}
        </div>
      ))}

      <span className="sr-only">Загрузка данных таблицы...</span>
    </div>
  )
}

/**
 * Skeleton для карточки
 *
 * @example
 * ```tsx
 * <CardSkeleton />
 * ```
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950', className)}
      role="status"
      aria-label="Загрузка карточки"
    >
      {/* Header */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>

      <span className="sr-only">Загрузка карточки...</span>
    </div>
  )
}

/**
 * Skeleton для формы
 *
 * @example
 * ```tsx
 * <FormSkeleton fields={5} />
 * ```
 */
export function FormSkeleton({ fields = 5, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Загрузка формы">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={`field-${index}`} className="space-y-2">
          {/* Label */}
          <Skeleton className="h-5 w-32" />
          {/* Input */}
          <Skeleton className="h-10 w-full" />
          {/* Helper text */}
          {index % 2 === 0 && <Skeleton className="h-4 w-48" />}
        </div>
      ))}

      {/* Submit button */}
      <Skeleton className="h-10 w-32" />

      <span className="sr-only">Загрузка формы...</span>
    </div>
  )
}

/**
 * Skeleton для списка
 *
 * @example
 * ```tsx
 * <ListSkeleton items={10} />
 * ```
 */
export function ListSkeleton({ items = 10, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-label="Загрузка списка">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`item-${index}`} className="flex items-center gap-4 rounded-lg border p-4">
          {/* Avatar/Icon */}
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Action */}
          <Skeleton className="h-9 w-20 shrink-0" />
        </div>
      ))}

      <span className="sr-only">Загрузка списка...</span>
    </div>
  )
}

/**
 * Skeleton для Dashboard stats cards
 *
 * @example
 * ```tsx
 * <DashboardStatsSkeleton cards={4} />
 * ```
 */
export function DashboardStatsSkeleton({ cards = 4, className }: { cards?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)} role="status" aria-label="Загрузка статистики">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={`stat-${index}`} className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-1 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}

      <span className="sr-only">Загрузка статистики...</span>
    </div>
  )
}

/**
 * Skeleton для графиков/charts
 *
 * @example
 * ```tsx
 * <ChartSkeleton />
 * ```
 */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950', className)}
      role="status"
      aria-label="Загрузка графика"
    >
      {/* Title */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Chart area */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`bar-${index}`} className="flex items-end gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className={`h-${8 + (index % 4) * 4} flex-1`} />
          </div>
        ))}
      </div>

      <span className="sr-only">Загрузка графика...</span>
    </div>
  )
}

/**
 * Skeleton для страницы с заголовком
 *
 * @example
 * ```tsx
 * <PageSkeleton />
 * ```
 */
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Загрузка страницы">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <TableSkeleton rows={8} columns={5} />
      </div>

      <span className="sr-only">Загрузка страницы...</span>
    </div>
  )
}

/**
 * Skeleton для Agent Card (специфичный для проекта)
 */
export function AgentCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950', className)}
      role="status"
      aria-label="Загрузка агента"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>

      <span className="sr-only">Загрузка информации об агенте...</span>
    </div>
  )
}
