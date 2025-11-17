/**
 * Loading state for AI agents page
 */

import {
  PageHeaderSkeleton,
  GridSkeleton,
  AgentCardSkeleton,
  StatCardSkeleton,
} from '@/components/ui/loading-skeletons'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AiAgentsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Agents Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <GridSkeleton items={6} columns={2} component={AgentCardSkeleton} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
