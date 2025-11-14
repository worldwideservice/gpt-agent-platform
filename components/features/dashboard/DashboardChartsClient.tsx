'use client'

import { useMonthlyResponses, useDailyResponses } from '@/lib/hooks/useDashboardMetrics'
import { MonthlyResponsesChart } from './MonthlyResponsesChart'
import { DailyResponsesChart } from './DailyResponsesChart'

interface DashboardChartsClientProps {
  tenantId: string
}

export function DashboardChartsClient({ tenantId }: DashboardChartsClientProps) {
  const { data: monthlyData, isLoading: isLoadingMonthly } = useMonthlyResponses(tenantId, 6)
  const { data: dailyData, isLoading: isLoadingDaily } = useDailyResponses(tenantId, 9)

  const monthlyChartData = monthlyData?.map((point) => ({
    month: point.label,
    responses: point.value,
  })) ?? []

  const dailyChartData = dailyData?.map((point) => ({
    day: point.label,
    responses: point.value,
  })) ?? []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <MonthlyResponsesChart
        data={monthlyChartData}
        isLoading={isLoadingMonthly}
      />
      <DailyResponsesChart
        data={dailyChartData}
        isLoading={isLoadingDaily}
      />
    </div>
  )
}
