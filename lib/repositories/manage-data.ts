import { cache } from 'react'

import { getAgents } from '@/lib/repositories/agents'
import { getAgentAssetsForOrganization } from '@/lib/repositories/agent-assets'
import { getKnowledgeBaseArticles, getKnowledgeBaseCategories, getKnowledgeBaseStats } from '@/lib/repositories/knowledge-base'
import { getWorkspaceSummary, type WorkspaceSummary } from '@/lib/repositories/manage-summary'
import type {
  KnowledgeBaseArticle,
  KnowledgeBaseCategory,
  KnowledgeBaseStatsSummary,
} from '@/types'
import type { AgentAsset } from '@/lib/repositories/agent-assets'
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

export interface ManageKnowledgeData {
  stats: KnowledgeBaseStatsSummary | null
  categories: KnowledgeBaseCategory[]
  articles: KnowledgeBaseArticle[]
  history: AgentAsset[]
  agentOptions: Array<{ id: string; name: string }>
  summary: WorkspaceSummary | null
  error?: ManageDataError
}

export interface ManageIntegrationsData {
  summary: WorkspaceSummary | null
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
    getAgents({ organizationId, limit: 50 }),
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
    getKnowledgeBaseStats(organizationId),
    getKnowledgeBaseCategories(organizationId),
    getKnowledgeBaseArticles(organizationId),
    getAgentAssetsForOrganization(organizationId, 10),
    getAgents({ organizationId, limit: 50 }),
    getWorkspaceSummary(organizationId),
  ])

  const [statsResult, categoriesResult, articlesResult, historyResult, agentsResult, summaryResult] = results

  const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
  const articles =
    articlesResult.status === 'fulfilled' ? articlesResult.value.slice(0, 5) : ([] as KnowledgeBaseArticle[])
  const history = historyResult.status === 'fulfilled' ? historyResult.value : ([] as AgentAsset[])
  const agentOptions =
    agentsResult.status === 'fulfilled'
      ? agentsResult.value.agents.map((agent) => ({ id: agent.id, name: agent.name }))
      : []
  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null

  const error = results.some((result) => result.status === 'rejected') ? ('fetchFailed' as ManageDataError) : undefined

  return {
    stats,
    categories,
    articles,
    history,
    agentOptions,
    summary,
    error,
  }
})

export const loadManageIntegrationsData = cache(async (organizationId: string): Promise<ManageIntegrationsData> => {
  const summaryResult = await Promise.allSettled([getWorkspaceSummary(organizationId)])
  const [result] = summaryResult
  const summary = result.status === 'fulfilled' ? result.value : null
  const error = result.status === 'rejected' ? ('fetchFailed' as ManageDataError) : undefined

  return {
    summary,
    error,
  }
})
