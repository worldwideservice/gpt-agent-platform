'use client'

import { useQuery } from '@tanstack/react-query'
import type { KnowledgeOverview } from '@/lib/services/knowledge'
import type { KnowledgeBaseStatsSummary, KnowledgeBaseCategory, KnowledgeBaseArticle } from '@/types'

export function useKnowledgeOverview(tenantId: string, enabled = true) {
  return useQuery<KnowledgeOverview>({
    queryKey: ['knowledge', 'overview', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/knowledge/overview`)
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge overview')
      }
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export function useKnowledgeStats(tenantId: string, enabled = true) {
  return useQuery<KnowledgeBaseStatsSummary>({
    queryKey: ['knowledge', 'stats', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/knowledge/stats`)
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge stats')
      }
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useKnowledgeCategories(tenantId: string, enabled = true) {
  return useQuery<KnowledgeBaseCategory[]>({
    queryKey: ['knowledge', 'categories', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/knowledge/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge categories')
      }
      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useKnowledgeArticles(
  tenantId: string,
  options?: { categoryId?: string; search?: string },
  enabled = true,
) {
  const params = new URLSearchParams()
  if (options?.categoryId) {
    params.set('categoryId', options.categoryId)
  }
  if (options?.search) {
    params.set('search', options.search)
  }

  const queryString = params.toString()

  return useQuery<KnowledgeBaseArticle[]>({
    queryKey: ['knowledge', 'articles', tenantId, options?.categoryId, options?.search],
    queryFn: async () => {
      const url = `/api/manage/${tenantId}/knowledge/articles${queryString ? `?${queryString}` : ''}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge articles')
      }
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
