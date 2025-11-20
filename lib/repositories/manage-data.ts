import { cache } from 'react'

// Removed agent dependencies - will be reimplemented for new architecture
// import { listAgents } from '@/lib/services/agents'
import { getKnowledgeOverview } from '@/lib/services/knowledge'
import { getWorkspaceSummary, type WorkspaceSummary } from '@/lib/repositories/manage-summary'
import { getIntegrationOverview } from '@/lib/services/integrations'
import type { KnowledgeOverview } from '@/lib/services/knowledge'
// Removed Agent type - will be reimplemented for new architecture
// import type { Agent } from '@/types'
import type { DashboardStats } from '@/types'
// Removed agent dependencies - will be reimplemented for new architecture

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
  agents: Array<unknown> // Removed Agent type - will be reimplemented
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
  const [summaryResult] = await Promise.allSettled([
    // Removed getDashboardStats - will be reimplemented for new architecture
    getWorkspaceSummary(organizationId),
  ])

  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null
  const error = summaryResult.status === 'rejected' ? ('fetchFailed' as ManageDataError) : undefined

  return {
    stats: ZERO_DASHBOARD_STATS, // Removed stats - will be reimplemented
    summary,
    error,
  }
})

export const loadManageAgentsData = cache(async (organizationId: string): Promise<ManageAgentsData> => {
  // Removed agent loading - will be reimplemented for new architecture
  const [summaryResult] = await Promise.allSettled([
    getWorkspaceSummary(organizationId),
  ])

  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null
  const error = summaryResult.status === 'rejected' ? 'fetchFailed' : undefined

  return {
    agents: [], // Removed agents - will be reimplemented
    total: 0,
    summary,
    error,
  }
})

export const loadManageKnowledgeData = cache(async (organizationId: string): Promise<ManageKnowledgeData> => {
  const results = await Promise.allSettled([
    getKnowledgeOverview(organizationId, { articlesLimit: 5, historyLimit: 10 }),
    // Removed listAgents - will be reimplemented for new architecture
    getWorkspaceSummary(organizationId),
  ])

  const [overviewResult, summaryResult] = results

  const overview = overviewResult.status === 'fulfilled'
    ? overviewResult.value
    : ({ stats: null, categories: [], articles: [], history: [], agentOptions: [] } satisfies KnowledgeOverview)

  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null

  const knowledgeFailed = overviewResult.status === 'rejected'
  const summaryFailed = summaryResult.status === 'rejected'

  const error = knowledgeFailed && summaryFailed ? ('fetchFailed' as ManageDataError) : undefined

  return {
    stats: overview.stats,
    categories: overview.categories,
    articles: overview.articles,
    history: overview.history,
    agentOptions: overview.agentOptions,
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
