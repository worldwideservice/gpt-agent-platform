import { IntegrationsList, type IntegrationListItem } from '@/components/features/integrations/IntegrationsList'
import { KommoStatusPanel } from '@/components/features/integrations/KommoStatusPanel'
import { KommoWebhookEventsPanel } from '@/components/features/integrations/KommoWebhookEventsPanel'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { WebhookActivityCard } from '@/components/features/manage/WebhookActivityCard'
import { auth } from '@/auth'
import { getWorkspaceSummary } from '@/lib/repositories/manage-summary'

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
  const session = await auth()
  let notice: string | null = null

  const summary = session?.user?.orgId ? await getWorkspaceSummary(session.user.orgId) : null

  const integrationDetails = summary?.integrations

  const items: IntegrationListItem[] = [
    {
      id: 'kommo',
      name: 'Kommo CRM',
      description: 'OAuth + Webhooks, синхронизация сделок и каналов',
      status: integrationDetails?.kommoConnected ? 'connected' : 'not_connected',
      details: {
        baseDomain: integrationDetails?.kommoDomain ?? undefined,
        note:
          integrationDetails?.lastWebhookEvent?.status === 'failed'
            ? `Последнее webhook: ${integrationDetails.lastWebhookEvent.eventType} (${integrationDetails.lastWebhookEvent.error ?? 'ошибка'})`
            : 'Подключите Kommo, чтобы активировать правила, sequences и webhooks.',
      },
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Уведомления о событиях агентов в каналах Slack',
      status: 'coming_soon',
    },
  ]

  if (searchParams?.status === 'success' && searchParams.provider === 'kommo') {
    notice = 'Kommo успешно подключена. Данные будут синхронизированы автоматически.'
  } else if (searchParams?.error && searchParams.provider === 'kommo') {
    notice = `Не удалось подключить Kommo: ${searchParams.error}`
  }

  if (!session?.user?.orgId) {
    notice = 'Нет доступа к организации. Авторизуйтесь, чтобы настраивать интеграции.'
  } else if (integrationDetails?.lastWebhookEvent?.error) {
    notice = `Последнее webhook событие завершилось с ошибкой: ${integrationDetails.lastWebhookEvent.error}`
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">Интеграции</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Подключения и вебхуки</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте OAuth, webhook и API ключами для workspace{' '}
          <span className="font-mono">{params.tenantId}</span>
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
