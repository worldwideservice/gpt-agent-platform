import { type AgentListItem } from '@/components/features/agents/AgentsTable'
import { AgentForm } from '@/components/features/agents/AgentForm'
import { AgentsDashboardSection } from '@/components/features/manage/AgentsDashboardSection'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { auth } from '@/auth'
import { getAgents } from '@/lib/repositories/agents'
import { getWorkspaceSummary, type WorkspaceSummary } from '@/lib/repositories/manage-summary'
import type { Agent } from '@/types'

interface AiAgentsPageProps {
  params: {
    tenantId: string
  }
}

export default async function AiAgentsPage({ params }: AiAgentsPageProps) {
  const session = await auth()
  let initialAgents: AgentListItem[] = []
  let initialError: string | null = null

  const summaryPromise = session?.user?.orgId ? getWorkspaceSummary(session.user.orgId) : Promise.resolve(null)

  if (!session?.user?.orgId) {
    initialError = 'Нет доступа к организации. Авторизуйтесь, чтобы увидеть список агентов.'
  } else {
    try {
      const { agents } = await getAgents({ organizationId: session.user.orgId, limit: 50 })
      initialAgents = mapAgentsToListItems(agents)
    } catch (error) {
      console.error('Failed to load agents for manage UI', error)
      initialError = 'Не удалось загрузить агентов из Supabase.'
    }
  }

  const summary = await summaryPromise
  const fallbackSummary: WorkspaceSummary = {
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
      webhookSuccessRate: 100,
    },
    knowledgeTimeline: [],
    knowledgeHeatmap: [],
  }
  const summaryData = summary ?? fallbackSummary

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase text-primary">Агенты</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Агенты ИИ</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте агентами для workspace&nbsp;
          <span className="font-mono">{params.tenantId}</span>
        </p>
      </div>
      {summaryData && (
        <div className="space-y-6">
          <WorkspaceSummaryIntegrationInsights summary={summaryData} />
          <WorkspaceSummaryKnowledgeInsights summary={summaryData} />
        </div>
      )}
      {summaryData.agents.total > 0 && (
        <Card className="grid gap-3 md:grid-cols-3">
          <CardHeader className="col-span-3">
            <CardTitle className="text-lg">Обзор агентов</CardTitle>
            <CardDescription>Сводка по workspace из Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="border-r border-dashed border-border p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">Всего агентов</p>
            <p className="text-2xl font-semibold">{summaryData.agents.total}</p>
          </CardContent>
          <CardContent className="border-r border-dashed border-border p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">Активные</p>
            <p className="text-2xl font-semibold">{summaryData.agents.active}</p>
          </CardContent>
          <CardContent className="p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="text-xs uppercase">Неактивные</p>
            <p className="text-2xl font-semibold">{summaryData.agents.inactive}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentsDashboardSection
            tenantId={params.tenantId}
            initialAgents={initialAgents}
            initialError={initialError}
            summary={summaryData}
          />
        </div>
        <AgentForm tenantId={params.tenantId} />
      </div>
    </div>
  )
}

const mapAgentsToListItems = (agents: Agent[]): AgentListItem[] =>
  agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    status: agent.status,
    model: agent.model,
    ownerName: agent.ownerName,
    updatedAt: agent.updatedAt,
  }))
