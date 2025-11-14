import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { IntegrationsList, type IntegrationListItem } from '@/components/features/integrations/IntegrationsList'
import { KommoStatusPanel } from '@/components/features/integrations/KommoStatusPanel'
import { KommoWebhookEventsPanel } from '@/components/features/integrations/KommoWebhookEventsPanel'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { WebhookActivityCard } from '@/components/features/manage/WebhookActivityCard'
import { loadManageIntegrationsData } from '@/lib/repositories/manage-data'
import { PageBreadcrumbs } from '@/components/layout/PageBreadcrumbs'

interface IntegrationsPageProps {
  params: {
    tenantId: string
  }
  searchParams?: {
    status?: string
    provider?: string
    error?: string
  }
}

export default async function IntegrationsPage({ params, searchParams }: IntegrationsPageProps) {
  const t = await getTranslations('manage.integrations.page')
  const session = await auth()
  const organizationId = session?.user?.orgId ?? null

  let notice: string | null = null
  let items: IntegrationListItem[] = []
  let summary = null

  if (!organizationId) {
    notice = t('notices.noOrganization')
  } else {
    const data = await loadManageIntegrationsData(organizationId)
    summary = data.summary
    if (data.error) {
      notice = t('notices.fetchFailed')
    }
  }

  if (searchParams?.status === 'success' && searchParams.provider === 'kommo') {
    notice = t('notices.kommoSuccess')
  } else if (searchParams?.error && searchParams.provider === 'kommo') {
    notice = t('notices.kommoError', { message: searchParams.error })
  }

  items = [
    {
      id: 'kommo',
      name: 'Kommo CRM',
      description: t('items.kommo.description'),
      status: summary?.integrations.kommoConnected ? 'connected' : 'not_connected',
      details: {
        baseDomain: summary?.integrations.kommoDomain ?? undefined,
        note:
          summary?.integrations.lastWebhookEvent?.status === 'failed'
            ? t('items.kommo.failure', {
                event: summary.integrations.lastWebhookEvent.eventType,
                error: summary.integrations.lastWebhookEvent.error ?? t('items.kommo.genericError'),
              })
            : t('items.kommo.placeholder'),
      },
    },
    {
      id: 'slack',
      name: 'Slack',
      description: t('items.slack.description'),
      status: 'coming_soon',
    },
  ]

  return (
    <div className="space-y-6">
      <PageBreadcrumbs />

      <header>
        <p className="text-sm uppercase text-primary">{t('header.eyebrow')}</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('header.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.rich('header.subtitle', {
            tenant: (chunk) => <span className="font-mono">{chunk}</span>,
            id: params.tenantId,
          })}
        </p>
      </header>
      <KommoStatusPanel notice={notice} />
      {summary && (
        <div className="space-y-6">
          <WorkspaceSummaryIntegrationInsights summary={summary} />
          <WorkspaceSummaryKnowledgeInsights summary={summary} />
        </div>
      )}
      {summary?.integrations.webhookHistory && summary.integrations.webhookHistory.length > 0 && (
        <WebhookActivityCard history={summary.integrations.webhookHistory} />
      )}
      <KommoWebhookEventsPanel />
      <IntegrationsList tenantId={params.tenantId} items={items} notice={notice} />
    </div>
  )
}
