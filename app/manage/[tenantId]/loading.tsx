/**
 * Loading state for tenant management pages
 * Shown during page transitions and data fetching
 */

import { PageHeaderSkeleton, DashboardSkeleton } from '@/components/ui/loading-skeletons'

export default function ManageLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <DashboardSkeleton />
    </div>
  )
}
