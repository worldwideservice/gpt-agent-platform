import { z } from 'zod'

import {
  getKnowledgeBaseStats,
  getKnowledgeBaseCategories,
  getKnowledgeBaseArticles,
} from '@/lib/repositories/knowledge-base'
// Removed agent dependencies - will be reimplemented for new architecture

import type {
  KnowledgeBaseArticle,
  KnowledgeBaseCategory,
  KnowledgeBaseStatsSummary,
} from '@/types'
// Removed agent types - will be reimplemented for new architecture
import { logger } from '@/lib/utils/logger'

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
  history: Array<unknown> // Removed AgentAsset type - will be reimplemented
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
    const [statsResult, categoriesResult, articlesResult] = await Promise.all([
      getKnowledgeBaseStats(organizationId).catch(() => null),
      getKnowledgeBaseCategories(organizationId).catch(() => [] as KnowledgeBaseCategory[]),
      getKnowledgeBaseArticles(organizationId).catch(() => [] as KnowledgeBaseArticle[]),
      // Removed agent-related calls - will be reimplemented for new architecture
    ])

    // Removed agent options - will be reimplemented
    const agentOptions: Array<{ id: string; name: string }> = []

    return {
      stats: statsResult,
      categories: categoriesResult,
      articles: articlesResult.slice(0, articlesLimit),
      history: [], // Removed agent assets history - will be reimplemented
      agentOptions,
    }
  } catch (error) {
    logger.error('KnowledgeService.getKnowledgeOverview failed', { error, organizationId })
    throw new Error('Не удалось загрузить данные базы знаний')
  }
}

export const KnowledgeService = {
  getKnowledgeOverview,
}

export type KnowledgeService = typeof KnowledgeService
