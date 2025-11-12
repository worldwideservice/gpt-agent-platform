import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { KnowledgeBaseCollections } from '@/components/features/knowledge/KnowledgeBaseCollections'
import { KnowledgeProcessingHistory } from '@/components/features/knowledge/KnowledgeProcessingHistory'
import { KnowledgeUploadPanel } from '@/components/features/knowledge/KnowledgeUploadPanel'
import { KnowledgeBaseOverview } from '@/components/features/knowledge/KnowledgeBaseOverview'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { auth } from '@/auth'
import { getAgentAssetsForOrganization } from '@/lib/repositories/agent-assets'
import { getAgents } from '@/lib/repositories/agents'
import { getKnowledgeBaseArticles, getKnowledgeBaseCategories, getKnowledgeBaseStats } from '@/lib/repositories/knowledge-base'
import { getWorkspaceSummary } from '@/lib/repositories/manage-summary'
import type { KnowledgeBaseArticle, KnowledgeBaseCategory, KnowledgeBaseStatsSummary } from '@/types'
import type { AgentAsset } from '@/lib/repositories/agent-assets'

interface KnowledgeBasePageProps {
  params: {
    tenantId: string
  }
}

export default async function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const session = await auth()
  let stats: KnowledgeBaseStatsSummary | null = null
  let categories: KnowledgeBaseCategory[] = []
  let articles: KnowledgeBaseArticle[] = []
  let history: AgentAsset[] = []
  let agentOptions: Array<{ id: string; name: string }> = []

  const summaryPromise = session?.user?.orgId ? getWorkspaceSummary(session.user.orgId) : Promise.resolve(null)
  let summary: Awaited<ReturnType<typeof getWorkspaceSummary> | null> = null

  if (session?.user?.orgId) {
    ;[stats, categories, articles, history, agentOptions, summary] = await Promise.all([
      getKnowledgeBaseStats(session.user.orgId),
      getKnowledgeBaseCategories(session.user.orgId),
      getKnowledgeBaseArticles(session.user.orgId).then((list) => list.slice(0, 5)),
      getAgentAssetsForOrganization(session.user.orgId, 10),
      getAgents({ organizationId: session.user.orgId, limit: 50 }).then((result) =>
        result.agents.map((agent) => ({ id: agent.id, name: agent.name })),
      ),
      summaryPromise,
    ])
  } else {
    summary = await summaryPromise
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">База знаний</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Знания компании</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте статьями и файлами, которые используют агенты внутри workspace{' '}
          <span className="font-mono">{params.tenantId}</span>
        </p>
      </header>
      {!session?.user?.orgId && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Нет доступа к данным организации. Перезайдите в аккаунт, чтобы увидеть статистику базы знаний.
        </div>
      )}
      <KnowledgeBaseOverview tenantId={params.tenantId} stats={stats} />
      {summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <CardTitle>Сводка по workspace</CardTitle>
              </div>
              <CardDescription>Quick statistics по знаниям и интеграциям.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <p className="text-xs uppercase text-gray-500">Категорий</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{summary.knowledge.categories}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Публикаций</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {summary.knowledge.publishedArticles}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Ожидают обработки</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{summary.knowledge.pendingAssets}</p>
              </div>
            </CardContent>
          </Card>
          <WorkspaceSummaryKnowledgeInsights summary={summary} />
          <WorkspaceSummaryIntegrationInsights summary={summary} />
        </div>
      )}
      <KnowledgeBaseCollections categories={categories} articles={articles} />
      {agentOptions.length > 0 && <KnowledgeUploadPanel agents={agentOptions} />}
      <KnowledgeProcessingHistory items={history} />
      {summary?.integrations.lastWebhookEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Последнее webhook событие Kommo</CardTitle>
            <CardDescription>Поступившие события показывают, что происходит в CRM.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            <p>Тип события: {summary.integrations.lastWebhookEvent.eventType}</p>
            <p>Статус: {summary.integrations.lastWebhookEvent.status}</p>
            {summary.integrations.lastWebhookEvent.error && (
              <p className="text-rose-500">Ошибка: {summary.integrations.lastWebhookEvent.error}</p>
            )}
            <p>
              Время:{' '}
              {summary.integrations.lastWebhookEvent.createdAt
                ? new Date(summary.integrations.lastWebhookEvent.createdAt).toLocaleString('ru-RU')
                : '—'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
