'use client'

import { useDashboardStats } from '@/lib/hooks/useDashboardMetrics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { TrendingUp, Calendar, MessageCircle, Bot, ArrowUp, ArrowDown } from 'lucide-react'

interface DashboardMetricsClientProps {
  tenantId: string
}

type MetricConfig = {
  key: string
  label: string
  helper?: string
  value: number | null | undefined
  change?: number | null
  icon?: React.ReactNode
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
      label: 'Ответы ИИ за этот месяц',
      helper: 'к прошлому месяцу',
      value: stats.monthlyResponses,
      change: stats.monthlyChange,
    },
    {
      key: 'weeklyResponses',
      label: 'Ответы ИИ за последние 7 дней',
      helper: 'Последние 7 дней',
      value: stats.weeklyResponses,
      icon: <Calendar className="h-5 w-5 text-gray-400" />,
    },
    {
      key: 'todayResponses',
      label: 'Ответы ИИ сегодня',
      value: stats.todayResponses,
    },
    {
      key: 'activeAgents',
      label: 'Агенты',
      helper: 'Всего агентов',
      value: stats.totalAgents,
      icon: <Bot className="h-5 w-5 text-gray-400" />,
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
          icon={metric.icon}
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
  icon,
}: {
  label: string
  value: number | null | undefined
  change?: number | null
  helper?: string
  icon?: React.ReactNode
}) {
  const isPositive = typeof change === 'number' && change > 0
  const isNegative = typeof change === 'number' && change < 0

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <span>{label}</span>
          {icon && <span>{icon}</span>}
        </CardDescription>
        <CardTitle className="text-3xl font-bold">{formatNumber(value)}</CardTitle>
      </CardHeader>
      {(helper || typeof change === 'number') && (
        <CardContent className="flex items-center gap-2 pt-0 text-xs">
          {typeof change === 'number' ? (
            <div className={`flex items-center gap-1 font-semibold ${
              isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-500' : 'text-gray-500'
            }`}>
              {isPositive && <ArrowUp className="h-4 w-4" />}
              {isNegative && <ArrowDown className="h-4 w-4" />}
              <span>{formatChange(change)}</span>
            </div>
          ) : null}
          {helper && <span className="text-gray-500">{helper}</span>}
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
