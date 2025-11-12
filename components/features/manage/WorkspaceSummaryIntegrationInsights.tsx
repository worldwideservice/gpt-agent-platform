import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { IntegrationAlertCard } from '@/components/features/manage/IntegrationAlertCard'
import { WebhookSuccessRateCard } from '@/components/features/manage/WebhookSuccessRateCard'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface WorkspaceSummaryIntegrationInsightsProps {
  summary: WorkspaceSummary
}

export function WorkspaceSummaryIntegrationInsights({ summary }: WorkspaceSummaryIntegrationInsightsProps) {
  const { webhookHistory } = summary.integrations
  const hasIntegrationsData = summary.integrations.kommoConnected || (summary.integrations.webhookHistory?.length ?? 0) > 0

  if (!hasIntegrationsData) {
    return null
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Интеграции и вебхуки</CardTitle>
            <CardDescription>Сводка по Kommo и webhook событиям.</CardDescription>
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            <p>Последние события: {webhookHistory?.length ?? 0}</p>
            <p>Success rate: {summary.integrations.webhookSuccessRate}%</p>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <IntegrationAlertCard summary={summary} />
        <WebhookSuccessRateCard
          rate={summary.integrations.webhookSuccessRate}
          totalEvents={webhookHistory?.length ?? 0}
        />
      </div>
    </section>
  )
}
