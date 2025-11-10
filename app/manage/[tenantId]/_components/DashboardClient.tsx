"use client"

import { useQuery } from "@tanstack/react-query"
import { SimpleDashboardStats } from "@/components/dashboard/SimpleDashboardStats"
import { LineChartCard } from "@/components/dashboard/LineChartCard"
import { BarChartCard } from "@/components/dashboard/BarChartCard"
import { RecentUpdates } from "@/components/dashboard/RecentUpdates"
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay"

export function DashboardClient() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard")
      if (!response.ok) throw new Error("Failed to fetch stats")
      return response.json()
    },
  })

  const { data: charts, isLoading: isLoadingCharts } = useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/charts")
      if (!response.ok) throw new Error("Failed to fetch charts")
      return response.json()
    },
  })

  const { data: updates, isLoading: isLoadingUpdates } = useQuery({
    queryKey: ["dashboard-updates"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/updates")
      if (!response.ok) throw new Error("Failed to fetch updates")
      return response.json()
    },
  })

  if (isLoadingStats || isLoadingCharts || isLoadingUpdates) {
    return <LoadingOverlay />
  }

  return (
    <div className="space-y-8 p-6">
      {stats && <SimpleDashboardStats stats={stats} />}
      <div className="grid gap-6 md:grid-cols-2">
        {charts?.lineChart && <LineChartCard data={charts.lineChart} />}
        {charts?.barChart && <BarChartCard data={charts.barChart} />}
      </div>
      {updates && <RecentUpdates updates={updates} />}
    </div>
  )
}
