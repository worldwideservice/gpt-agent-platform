'use client'

import { useDashboardStats } from '@/lib/hooks/useDashboardMetrics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

interface DashboardMetricsClientProps {
  tenantId: string
}

type MetricConfig = {
  key: string
  label: string
  helper?: string
  value: number | null | undefined
  change?: number | null
}

export function DashboardMetricsClient({ tenantId }: DashboardMetricsClientProps) {
  const { data: stats, isLoading, error } = useDashboardStats(tenantId)

  if (isLoading) {
    return <MetricsSkeleton />
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка загрузки</CardTitle>
          <CardDescription>Не удалось загрузить метрики Dashboard</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const metrics: MetricConfig[] = [
    {
      key: 'monthlyResponses',
      label: 'Ответы за месяц',
      helper: 'Всего',
      value: stats.monthlyResponses,
      change: stats.monthlyChange,
    },
    {
      key: 'weeklyResponses',
      label: 'Ответы за неделю',
      helper: 'Последние 7 дней',
      value: stats.weeklyResponses,
    },
    {
      key: 'todayResponses',
      label: 'Ответы сегодня',
      helper: 'За сегодня',
      value: stats.todayResponses,
      change: stats.todayChange,
    },
    {
      key: 'activeAgents',
      label: 'Активные агенты',
      helper: 'Всего',
      value: stats.totalAgents,
    },
  ]

  return <StatsGrid metrics={metrics} />
}

function MetricsSkeleton() {
  const cards = Array.from({ length: 4 })
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {cards.map((_, index) => (
        <div key={index} className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-950">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  )
}

function StatsGrid({ metrics }: { metrics: MetricConfig[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.key}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          helper={metric.helper}
        />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  change,
  helper,
}: {
  label: string
  value: number | null | undefined
  change?: number | null
  helper?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{formatNumber(value)}</CardTitle>
      </CardHeader>
      {(helper || typeof change === 'number') && (
        <CardContent className="pt-0 text-xs text-gray-500">
          {typeof change === 'number' ? (
            <span className={`font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {formatChange(change)}
            </span>
          ) : null}
          {helper ? <span className={typeof change === 'number' ? 'ml-2' : ''}>{helper}</span> : null}
        </CardContent>
      )}
    </Card>
  )
}

const formatNumber = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0'
  }

  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value)
}

const formatChange = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0%'
  }

  const absValue = Math.abs(value)
  const formatter = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: absValue < 10 ? 1 : 0,
  })

  const formatted = formatter.format(absValue)

  if (value > 0) {
    return `+${formatted}%`
  }

  if (value < 0) {
    return `-${formatted}%`
  }

  return '0%'
}
