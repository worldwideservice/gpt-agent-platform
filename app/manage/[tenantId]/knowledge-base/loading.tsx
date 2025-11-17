/**
 * Loading state for knowledge base page
 */

import {
  PageHeaderSkeleton,
  GridSkeleton,
  DocumentCardSkeleton,
  StatCardSkeleton,
} from '@/components/ui/loading-skeletons'

export default function KnowledgeBaseLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Documents Grid */}
      <GridSkeleton items={9} columns={3} component={DocumentCardSkeleton} />
    </div>
  )
}
