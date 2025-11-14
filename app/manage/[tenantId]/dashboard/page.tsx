import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { WebhookActivityCard } from '@/components/features/manage/WebhookActivityCard'
import { DashboardMetricsClient } from '@/components/features/dashboard/DashboardMetricsClient'
import { DashboardChartsClient } from '@/components/features/dashboard/DashboardChartsClient'
import { loadManageDashboardData } from '@/lib/repositories/manage-data'

interface DashboardPageProps {
  params: {
    tenantId: string
  }
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

      <DashboardMetricsClient tenantId={params.tenantId} />
      <DashboardChartsClient tenantId={params.tenantId} />

      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />}>
        <DashboardSummary organizationId={organizationId} />
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

interface DashboardSummaryProps {
  organizationId: string | null
}

async function DashboardSummary({ organizationId }: DashboardSummaryProps) {
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

  const { summary, error } = await loadManageDashboardData(organizationId)

  return summary ? (
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
  )
}
