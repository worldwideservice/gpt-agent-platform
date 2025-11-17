/**
 * Loading Skeleton Components
 * Pre-built skeleton screens for common UI patterns
 */

import { Skeleton } from './Skeleton'
import { Card, CardContent, CardHeader } from './Card'

/**
 * Card Skeleton
 * Loading state for card components
 */
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Table Skeleton
 * Loading state for data tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex gap-4 border-b pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * List Skeleton
 * Loading state for vertical lists
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Stat Card Skeleton
 * Loading state for metric/stat cards
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/3" />
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard Skeleton
 * Loading state for dashboard pages
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

/**
 * Form Skeleton
 * Loading state for forms
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

/**
 * Chat Message Skeleton
 * Loading state for chat/conversation interfaces
 */
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

/**
 * Agent Card Skeleton
 * Loading state for AI agent cards
 */
export function AgentCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Document Card Skeleton
 * Loading state for document/knowledge base cards
 */
export function DocumentCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Grid Skeleton
 * Loading state for grid layouts
 */
export function GridSkeleton({
  items = 6,
  columns = 3,
  component: Component = CardSkeleton,
}: {
  items?: number
  columns?: 2 | 3 | 4
  component?: React.ComponentType
}) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {Array.from({ length: items }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}

/**
 * Page Header Skeleton
 * Loading state for page headers with breadcrumbs
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title and actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * Analytics Chart Skeleton
 * Loading state for charts and graphs
 */
export function ChartSkeleton({ height = 'h-80' }: { height?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${height}`} />
        <div className="mt-4 flex justify-center gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Empty State Skeleton
 * Minimal loading for empty states
 */
export function EmptyStateSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Skeleton className="mb-4 h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
        <Skeleton className="mt-6 h-10 w-32" />
      </CardContent>
    </Card>
  )
}
