import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { auth } from '@/auth'
import { AgentsDashboardSection } from '@/components/features/manage/AgentsDashboardSection'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { loadManageAgentsData } from '@/lib/repositories/manage-data'
import type { AgentListItem } from '@/components/features/agents/AgentsTable'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'
import type { Agent } from '@/types'

interface AiAgentsPageProps {
  params: Promise<{
    tenantId: string
  }>
}

const EMPTY_SUMMARY: WorkspaceSummary = {
  agents: {
    total: 0,
    active: 0,
    inactive: 0,
  },
  knowledge: {
    categories: 0,
    publishedArticles: 0,
    pendingAssets: 0,
  },
  integrations: {
    kommoConnected: false,
    kommoDomain: null,
    webhookHistory: [],
    webhookSuccessRate: 0,
  },
  knowledgeTimeline: [],
  knowledgeHeatmap: [],
}

export default async function AiAgentsPage({ params }: AiAgentsPageProps) {
  const { tenantId } = await params
  const t = await getTranslations('manage.agents.page')
  const session = await auth()
  const organizationId = session?.user?.orgId ?? null

  let initialAgents: AgentListItem[] = []
  let summary: WorkspaceSummary = EMPTY_SUMMARY
  let initialError: string | null = null

  if (!organizationId) {
    initialError = t('errors.noOrganization')
  } else {
    const data = await loadManageAgentsData(organizationId)
    initialAgents = mapAgentsToListItems(data.agents)
    summary = data.summary ?? EMPTY_SUMMARY
    if (data.error) {
      initialError = t('errors.fetchFailed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header с breadcrumbs согласно KWID */}
      <PageHeader
        title={t('header.title')}
        description={t.rich('header.subtitle', {
          tenant: (chunk) => <span className="font-mono">{chunk}</span>,
          id: tenantId,
        }) as any}
        actions={
          <Button asChild>
            <Link href={`/manage/${tenantId}/ai-agents/create`}>
              Создать агента
            </Link>
          </Button>
        }
      />

      <div className="space-y-6">
        <WorkspaceSummaryIntegrationInsights summary={summary} />
        <WorkspaceSummaryKnowledgeInsights summary={summary} />
      </div>

      {summary.agents.total > 0 && (
        <Card className="grid gap-3 md:grid-cols-3">
          <CardHeader className="col-span-3">
            <CardTitle className="text-lg">{t('summary.title')}</CardTitle>
            <CardDescription>{t('summary.description')}</CardDescription>
          </CardHeader>
          <CardContent className="border-r border-dashed border-border p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">{t('summary.total')}</p>
            <p className="text-2xl font-semibold">{summary.agents.total}</p>
          </CardContent>
          <CardContent className="border-r border-dashed border-border p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">{t('summary.active')}</p>
            <p className="text-2xl font-semibold">{summary.agents.active}</p>
          </CardContent>
          <CardContent className="p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">{t('summary.inactive')}</p>
            <p className="text-2xl font-semibold">{summary.agents.inactive}</p>
          </CardContent>
        </Card>
      )}

      <div className="w-full">
        <AgentsDashboardSection
          tenantId={tenantId}
          initialAgents={initialAgents}
          initialError={initialError}
          summary={summary}
        />
      </div>
    </div>
  )
}

function mapAgentsToListItems(agents: Agent[]): AgentListItem[] {
  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    isActive: agent.status === 'active',
    status: agent.status,
    model: agent.model,
    ownerName: agent.ownerName,
    updatedAt: agent.updatedAt,
  }))
}
