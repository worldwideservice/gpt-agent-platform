import { cache } from 'react'

import { listAgents } from '@/lib/services/agents'
import { getKnowledgeOverview } from '@/lib/services/knowledge'
import { getWorkspaceSummary, type WorkspaceSummary } from '@/lib/repositories/manage-summary'
import { getIntegrationOverview } from '@/lib/services/integrations'
import type { KnowledgeOverview } from '@/lib/services/knowledge'
import type { Agent } from '@/types'
import type { DashboardStats } from '@/types'
import { getDashboardStats } from '@/lib/repositories/agents'

export type ManageDataError = 'fetchFailed'

const ZERO_DASHBOARD_STATS: DashboardStats = {
  monthlyResponses: 0,
  monthlyChange: 0,
  weeklyResponses: 0,
  todayResponses: 0,
  todayChange: 0,
  totalAgents: 0,
}

export interface ManageDashboardData {
  stats: DashboardStats
  summary: WorkspaceSummary | null
  error?: ManageDataError
}

export interface ManageAgentsData {
  agents: Agent[]
  total: number
  summary: WorkspaceSummary | null
  error?: ManageDataError
}

export interface ManageKnowledgeData extends KnowledgeOverview {
  summary: WorkspaceSummary | null
  error?: ManageDataError
}

export interface ManageIntegrationsData {
  summary: WorkspaceSummary | null
  integrations: Array<Awaited<ReturnType<typeof getIntegrationOverview>>>
  error?: ManageDataError
}

export const loadManageDashboardData = cache(async (organizationId: string): Promise<ManageDashboardData> => {
  const [statsResult, summaryResult] = await Promise.allSettled([
    getDashboardStats(organizationId),
    getWorkspaceSummary(organizationId),
  ])

  const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null
  const error =
    statsResult.status === 'rejected' || summaryResult.status === 'rejected' ? ('fetchFailed' as ManageDataError) : undefined

  return {
    stats: stats ?? ZERO_DASHBOARD_STATS,
    summary,
    error,
  }
})

export const loadManageAgentsData = cache(async (organizationId: string): Promise<ManageAgentsData> => {
  const [agentsResult, summaryResult] = await Promise.allSettled([
    listAgents(organizationId, { limit: 50 }),
    getWorkspaceSummary(organizationId),
  ])

  const agentsValue = agentsResult.status === 'fulfilled' ? agentsResult.value : null
  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null
  const error = agentsResult.status === 'rejected' || summaryResult.status === 'rejected' ? 'fetchFailed' : undefined

  return {
    agents: agentsValue?.agents ?? [],
    total: agentsValue?.total ?? 0,
    summary,
    error,
  }
})

export const loadManageKnowledgeData = cache(async (organizationId: string): Promise<ManageKnowledgeData> => {
  const results = await Promise.allSettled([
    getKnowledgeOverview(organizationId, { articlesLimit: 5, historyLimit: 10 }),
    listAgents(organizationId, { limit: 50 }),
    getWorkspaceSummary(organizationId),
  ])

  const [overviewResult, agentsResult, summaryResult] = results

  const overview = overviewResult.status === 'fulfilled'
    ? overviewResult.value
    : ({ stats: null, categories: [], articles: [], history: [], agentOptions: [] } satisfies KnowledgeOverview)

  const agentOptions =
    agentsResult.status === 'fulfilled'
      ? agentsResult.value.agents.map((agent) => ({ id: agent.id, name: agent.name }))
      : overview.agentOptions

  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null

  const error = results.some((result) => result.status === 'rejected') ? ('fetchFailed' as ManageDataError) : undefined

  return {
    stats: overview.stats,
    categories: overview.categories,
    articles: overview.articles,
    history: overview.history,
    agentOptions,
    summary,
    error,
  }
})

export const loadManageIntegrationsData = cache(async (organizationId: string): Promise<ManageIntegrationsData> => {
  const results = await Promise.allSettled([
    getWorkspaceSummary(organizationId),
    getIntegrationOverview(organizationId),
  ])

  const summary = results[0].status === 'fulfilled' ? results[0].value : null
  const overview = results[1].status === 'fulfilled' ? [results[1].value] : ([] as ManageIntegrationsData['integrations'])
  const error = results.some((result) => result.status === 'rejected') ? ('fetchFailed' as ManageDataError) : undefined

  return {
    summary,
    integrations: overview,
    error,
  }
})
