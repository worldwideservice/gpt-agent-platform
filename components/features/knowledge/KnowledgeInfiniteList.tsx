'use client'

import { useState } from 'react'
import { useInfiniteArticles } from '@/lib/hooks/useInfiniteKnowledge'
import { InfiniteScroll } from '@/components/ui/infinite-scroll'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Input } from '@/components/ui'
import { Search } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface KnowledgeInfiniteListProps {
  tenantId: string
  categoryId?: string
}

/**
 * Пример компонента с бесконечной прокруткой статей
 */
export function KnowledgeInfiniteList({ tenantId, categoryId }: KnowledgeInfiniteListProps) {
  const [search, setSearch] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteArticles(
    tenantId,
    {
      categoryId,
      search,
      pageSize: 20,
    },
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка загрузки</CardTitle>
          <CardDescription>Не удалось загрузить статьи</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const allArticles = data?.pages.flatMap((page) => page.articles) ?? []
  const totalCount = data?.pages[0]?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск статей..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          Найдено: <span className="font-semibold">{totalCount}</span>
        </div>
      </div>

      <InfiniteScroll
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage ?? false}
        isLoading={isFetchingNextPage}
        endMessage={<div>Все статьи загружены</div>}
        className="space-y-3"
      >
        {allArticles.map((article) => (
          <Card key={article.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription className="line-clamp-2">{article.content}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Обновлено: {new Date(article.updatedAt).toLocaleDateString('ru-RU')}</span>
                {article.categoryId && <span className="rounded bg-primary/10 px-2 py-1">Категория</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>

      {allArticles.length === 0 && !isLoading && (
        <EmptyState
          type="no-results"
          title="Статьи не найдены"
          description="Попробуйте изменить параметры поиска"
          action={{
            label: 'Очистить поиск',
            onClick: () => setSearch(''),
            variant: 'secondary',
          }}
        />
      )}
    </div>
  )
}
