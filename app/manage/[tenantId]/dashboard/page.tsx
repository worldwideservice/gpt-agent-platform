import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { WebhookActivityCard } from '@/components/features/manage/WebhookActivityCard'
import { loadManageDashboardData } from '@/lib/repositories/manage-data'

interface DashboardPageProps {
  params: {
    tenantId: string
  }
}

type MetricConfig = {
  key: string
  label: string
  helper?: string
  value: number | null | undefined
  change?: number | null
}

const MetricsSkeleton = () => {
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

export default async function DashboardPage({ params }: DashboardPageProps) {
  const t = await getTranslations('manage.dashboard')
  const session = await auth()
  const organizationId = session?.user?.orgId ?? null

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase text-primary">{t('header.eyebrow')}</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('header.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.rich('header.tenant', {
            tenant: (chunk) => <span className="font-mono text-xs">{chunk}</span>,
            id: params.tenantId,
          })}
        </p>
      </header>

      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics organizationId={organizationId} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity.title')}</CardTitle>
            <CardDescription>{t('recentActivity.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-500 dark:text-gray-400">
            {t('recentActivity.placeholder')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
            <CardDescription>{t('quickActions.description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              {t('quickActions.actions.createAgent')}
            </button>
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              {t('quickActions.actions.uploadKnowledge')}
            </button>
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              {t('quickActions.actions.connectKommo')}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface DashboardMetricsProps {
  organizationId: string | null
}

async function DashboardMetrics({ organizationId }: DashboardMetricsProps) {
  const t = await getTranslations('manage.dashboard')

  if (!organizationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('states.unauthorized.title')}</CardTitle>
          <CardDescription>{t('states.unauthorized.description')}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 dark:text-gray-300">
          {t('states.unauthorized.helper')}
        </CardContent>
      </Card>
    )
  }

  const { stats, summary, error } = await loadManageDashboardData(organizationId)

  const metrics: MetricConfig[] = [
    {
      key: 'monthlyResponses',
      label: t('metrics.monthlyResponses.label'),
      helper: t('metrics.monthlyResponses.helper'),
      value: stats.monthlyResponses,
      change: stats.monthlyChange,
    },
    {
      key: 'weeklyResponses',
      label: t('metrics.weeklyResponses.label'),
      helper: t('metrics.weeklyResponses.helper'),
      value: stats.weeklyResponses,
    },
    {
      key: 'todayResponses',
      label: t('metrics.todayResponses.label'),
      helper: t('metrics.todayResponses.helper'),
      value: stats.todayResponses,
      change: stats.todayChange,
    },
    {
      key: 'activeAgents',
      label: t('metrics.activeAgents.label'),
      helper: t('metrics.activeAgents.helper'),
      value: stats.totalAgents,
    },
  ]

  return (
    <>
      <StatsGrid metrics={metrics} />
      {summary ? (
        <>
          <WorkspaceSummaryKnowledgeInsights summary={summary} />
          <WorkspaceSummaryIntegrationInsights summary={summary} />
          {summary.integrations.webhookHistory && summary.integrations.webhookHistory.length > 0 && (
            <WebhookActivityCard history={summary.integrations.webhookHistory} />
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('states.summaryUnavailable.title')}</CardTitle>
            <CardDescription>{t('states.summaryUnavailable.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-300">
            {error ? t('states.summaryUnavailable.helper') : t('states.summaryUnavailable.empty')}
          </CardContent>
        </Card>
      )}
    </>
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
