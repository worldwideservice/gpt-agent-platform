import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { KnowledgeBaseCollections } from '@/components/features/knowledge/KnowledgeBaseCollections'
import { KnowledgeProcessingHistory } from '@/components/features/knowledge/KnowledgeProcessingHistory'
import { KnowledgeUploadPanel } from '@/components/features/knowledge/KnowledgeUploadPanel'
import { KnowledgeBaseOverview } from '@/components/features/knowledge/KnowledgeBaseOverview'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { loadManageKnowledgeData } from '@/lib/repositories/manage-data'
import { PageBreadcrumbs } from '@/components/layout/PageBreadcrumbs'
import type { AgentAsset } from '@/lib/repositories/agent-assets'
import type { KnowledgeBaseArticle, KnowledgeBaseCategory, KnowledgeBaseStatsSummary } from '@/types'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface KnowledgeBasePageProps {
  params: Promise<{
    tenantId: string
  }>
}

export default async function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const { tenantId } = await params
  const t = await getTranslations('manage.knowledge.page')
  const session = await auth()
  const organizationId = session?.user?.orgId ?? null

  let stats: KnowledgeBaseStatsSummary | null = null
  let categories: KnowledgeBaseCategory[] = []
  let articles: KnowledgeBaseArticle[] = []
  let history: AgentAsset[] = []
  let agentOptions: Array<{ id: string; name: string }> = []
  let summary: WorkspaceSummary | null = null
  let notice: string | null = null

  if (!organizationId) {
    notice = t('notice.noOrganization')
  } else {
    const data = await loadManageKnowledgeData(organizationId)
    stats = data.stats
    categories = data.categories
    articles = data.articles
    history = data.history
    agentOptions = data.agentOptions
    summary = data.summary
    if (data.error) {
      notice = t('notice.fetchFailed')
    }
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs />

      <header>
        <p className="text-sm uppercase text-primary">{t('header.eyebrow')}</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('header.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.rich('header.subtitle', {
            tenant: (chunk) => <span className="font-mono">{chunk}</span>,
            id: tenantId,
          })}
        </p>
      </header>

      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div>
      )}

      <KnowledgeBaseOverview tenantId={tenantId} stats={stats} />

      {summary && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <CardTitle>{t('summary.title')}</CardTitle>
              </div>
              <CardDescription>{t('summary.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <p className="text-xs uppercase text-gray-500">{t('summary.categories')}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{summary.knowledge.categories}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">{t('summary.published')}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{summary.knowledge.publishedArticles}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">{t('summary.pending')}</p>
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
            <CardTitle>{t('webhook.title')}</CardTitle>
            <CardDescription>{t('webhook.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            <p>
              {t('webhook.eventType', { event: summary.integrations.lastWebhookEvent.eventType ?? t('webhook.empty') })}
            </p>
            <p>{t('webhook.status', { status: summary.integrations.lastWebhookEvent.status ?? t('webhook.empty') })}</p>
            {summary.integrations.lastWebhookEvent.error && (
              <p className="text-rose-500">{t('webhook.error', { message: summary.integrations.lastWebhookEvent.error })}</p>
            )}
            <p>
              {t('webhook.timestamp', {
                timestamp: summary.integrations.lastWebhookEvent.createdAt
                  ? new Date(summary.integrations.lastWebhookEvent.createdAt).toLocaleString()
                  : t('webhook.empty'),
              })}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
