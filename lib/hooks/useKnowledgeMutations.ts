'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@/types'

interface CreateArticleInput {
  tenantId: string
  title: string
  content: string
  categoryId?: string
}

interface UpdateArticleInput {
  tenantId: string
  articleId: string
  title?: string
  content?: string
  categoryId?: string
}

interface DeleteArticleInput {
  tenantId: string
  articleId: string
}

/**
 * Hook для создания статьи с optimistic update
 */
export function useCreateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateArticleInput) => {
      const response = await fetch(`/api/manage/${input.tenantId}/knowledge/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        throw new Error('Failed to create article')
      }
      return response.json()
    },
    // Optimistic update
    onMutate: async (newArticle) => {
      // Отменяем текущие запросы для избежания race conditions
      await queryClient.cancelQueries({ queryKey: ['knowledge', 'articles', newArticle.tenantId] })

      // Сохраняем предыдущее состояние для rollback
      const previousArticles = queryClient.getQueryData<KnowledgeBaseArticle[]>([
        'knowledge',
        'articles',
        newArticle.tenantId,
      ])

      // Оптимистично обновляем кеш
      queryClient.setQueryData<KnowledgeBaseArticle[]>(
        ['knowledge', 'articles', newArticle.tenantId],
        (old = []) => [
          ...old,
          {
            id: `temp-${Date.now()}`,
            title: newArticle.title,
            content: newArticle.content,
            categoryId: newArticle.categoryId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as KnowledgeBaseArticle,
        ],
      )

      return { previousArticles }
    },
    // При ошибке - откатываем изменения
    onError: (err, newArticle, context) => {
      if (context?.previousArticles) {
        queryClient.setQueryData(['knowledge', 'articles', newArticle.tenantId], context.previousArticles)
      }
    },
    // После успеха - инвалидируем кеш для получения актуальных данных
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'articles', variables.tenantId] })
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'overview', variables.tenantId] })
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'stats', variables.tenantId] })
    },
  })
}

/**
 * Hook для обновления статьи с optimistic update
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateArticleInput) => {
      const response = await fetch(`/api/manage/${input.tenantId}/knowledge/articles/${input.articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        throw new Error('Failed to update article')
      }
      return response.json()
    },
    onMutate: async (updatedArticle) => {
      await queryClient.cancelQueries({ queryKey: ['knowledge', 'articles', updatedArticle.tenantId] })

      const previousArticles = queryClient.getQueryData<KnowledgeBaseArticle[]>([
        'knowledge',
        'articles',
        updatedArticle.tenantId,
      ])

      queryClient.setQueryData<KnowledgeBaseArticle[]>(
        ['knowledge', 'articles', updatedArticle.tenantId],
        (old = []) =>
          old.map((article) =>
            article.id === updatedArticle.articleId
              ? {
                  ...article,
                  ...updatedArticle,
                  updatedAt: new Date().toISOString(),
                }
              : article,
          ),
      )

      return { previousArticles }
    },
    onError: (err, updatedArticle, context) => {
      if (context?.previousArticles) {
        queryClient.setQueryData(['knowledge', 'articles', updatedArticle.tenantId], context.previousArticles)
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'articles', variables.tenantId] })
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'overview', variables.tenantId] })
    },
  })
}

/**
 * Hook для удаления статьи с optimistic update
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: DeleteArticleInput) => {
      const response = await fetch(`/api/manage/${input.tenantId}/knowledge/articles/${input.articleId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete article')
      }
      return response.json()
    },
    onMutate: async (deletedArticle) => {
      await queryClient.cancelQueries({ queryKey: ['knowledge', 'articles', deletedArticle.tenantId] })

      const previousArticles = queryClient.getQueryData<KnowledgeBaseArticle[]>([
        'knowledge',
        'articles',
        deletedArticle.tenantId,
      ])

      queryClient.setQueryData<KnowledgeBaseArticle[]>(
        ['knowledge', 'articles', deletedArticle.tenantId],
        (old = []) => old.filter((article) => article.id !== deletedArticle.articleId),
      )

      return { previousArticles }
    },
    onError: (err, deletedArticle, context) => {
      if (context?.previousArticles) {
        queryClient.setQueryData(['knowledge', 'articles', deletedArticle.tenantId], context.previousArticles)
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'articles', variables.tenantId] })
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'overview', variables.tenantId] })
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'stats', variables.tenantId] })
    },
  })
}
