import { z } from 'zod'

import {
  getKnowledgeBaseStats,
  getKnowledgeBaseCategories,
  getKnowledgeBaseArticles,
} from '@/lib/repositories/knowledge-base'
import { getAgentAssetsForOrganization } from '@/lib/repositories/agent-assets'
import { listAgents } from '@/lib/services/agents'

import type {
  KnowledgeBaseArticle,
  KnowledgeBaseCategory,
  KnowledgeBaseStatsSummary,
} from '@/types'
import type { AgentAsset } from '@/lib/repositories/agent-assets'

const overviewSchema = z
  .object({
    articlesLimit: z.number().int().min(1).max(100).optional(),
    historyLimit: z.number().int().min(1).max(100).optional(),
    includeAgentOptions: z.boolean().optional(),
  })
  .optional()

const assertOrganizationId = (organizationId: string) => {
  if (!organizationId || typeof organizationId !== 'string') {
    throw new Error('Требуется идентификатор организации')
  }
}

export interface KnowledgeOverview {
  stats: KnowledgeBaseStatsSummary | null
  categories: KnowledgeBaseCategory[]
  articles: KnowledgeBaseArticle[]
  history: AgentAsset[]
  agentOptions: Array<{ id: string; name: string }>
}

export const getKnowledgeOverview = async (
  organizationId: string,
  options?: unknown,
): Promise<KnowledgeOverview> => {
  assertOrganizationId(organizationId)

  const parsed = overviewSchema.parse(options)
  const articlesLimit = parsed?.articlesLimit ?? 5
  const historyLimit = parsed?.historyLimit ?? 10
  const includeAgentOptions = parsed?.includeAgentOptions ?? true

  try {
    const [statsResult, categoriesResult, articlesResult, historyResult, agentsResult] = await Promise.all([
      getKnowledgeBaseStats(organizationId).catch(() => null),
      getKnowledgeBaseCategories(organizationId).catch(() => [] as KnowledgeBaseCategory[]),
      getKnowledgeBaseArticles(organizationId).catch(() => [] as KnowledgeBaseArticle[]),
      getAgentAssetsForOrganization(organizationId, historyLimit).catch(() => [] as AgentAsset[]),
      includeAgentOptions
        ? listAgents(organizationId, { limit: 50 }).catch(() => null)
        : Promise.resolve(null),
    ])

    const agentOptions = agentsResult?.agents
      ? agentsResult.agents.map((agent) => ({ id: agent.id, name: agent.name }))
      : []

    return {
      stats: statsResult,
      categories: categoriesResult,
      articles: articlesResult.slice(0, articlesLimit),
      history: historyResult,
      agentOptions,
    }
  } catch (error) {
    console.error('KnowledgeService.getKnowledgeOverview failed', { error, organizationId })
    throw new Error('Не удалось загрузить данные базы знаний')
  }
}

export const KnowledgeService = {
  getKnowledgeOverview,
}

export type KnowledgeService = typeof KnowledgeService
