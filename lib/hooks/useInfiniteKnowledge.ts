'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import type { KnowledgeBaseArticle } from '@/types'

interface PaginatedArticlesResponse {
  articles: KnowledgeBaseArticle[]
  nextCursor?: string
  hasMore: boolean
  total: number
}

interface UseInfiniteArticlesOptions {
  categoryId?: string
  search?: string
  pageSize?: number
}

/**
 * Hook для бесконечной прокрутки статей Knowledge Base
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useInfiniteArticles(tenantId, { pageSize: 20 })
 *
 * // В компоненте
 * <InfiniteScroll
 *   loadMore={fetchNextPage}
 *   hasMore={hasNextPage}
 *   isLoading={isFetchingNextPage}
 * >
 *   {data?.pages.flatMap(page => page.articles).map(article => ...)}
 * </InfiniteScroll>
 * ```
 */
export function useInfiniteArticles(
  tenantId: string,
  options: UseInfiniteArticlesOptions = {},
  enabled = true,
) {
  const { categoryId, search, pageSize = 20 } = options

  return useInfiniteQuery<PaginatedArticlesResponse>({
    queryKey: ['knowledge', 'articles-infinite', tenantId, categoryId, search, pageSize],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        ...(pageParam && { cursor: pageParam as string }),
        ...(categoryId && { categoryId }),
        ...(search && { search }),
      })

      const response = await fetch(`/api/manage/${tenantId}/knowledge/articles?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }

      return response.json()
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    initialPageParam: undefined,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

interface PaginatedHistoryResponse {
  items: Array<{
    id: string
    action: string
    timestamp: string
    details: Record<string, unknown>
  }>
  nextCursor?: string
  hasMore: boolean
  total: number
}

/**
 * Hook для бесконечной прокрутки истории обработки Knowledge Base
 */
export function useInfiniteProcessingHistory(tenantId: string, pageSize = 15, enabled = true) {
  return useInfiniteQuery<PaginatedHistoryResponse>({
    queryKey: ['knowledge', 'history-infinite', tenantId, pageSize],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        ...(pageParam && { cursor: pageParam as string }),
      })

      const response = await fetch(`/api/manage/${tenantId}/knowledge/history?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch processing history')
      }

      return response.json()
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    initialPageParam: undefined,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
