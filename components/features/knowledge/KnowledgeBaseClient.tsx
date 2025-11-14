'use client'

import { useKnowledgeOverview } from '@/lib/hooks/useKnowledgeBase'
import { KnowledgeBaseOverview } from './KnowledgeBaseOverview'
import { KnowledgeBaseCollections } from './KnowledgeBaseCollections'
import { KnowledgeProcessingHistory } from './KnowledgeProcessingHistory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

interface KnowledgeBaseClientProps {
  tenantId: string
}

export function KnowledgeBaseClient({ tenantId }: KnowledgeBaseClientProps) {
  const { data, isLoading, error } = useKnowledgeOverview(tenantId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка загрузки</CardTitle>
          <CardDescription>Не удалось загрузить данные Knowledge Base</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 dark:text-gray-300">
          Попробуйте обновить страницу
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <KnowledgeBaseOverview tenantId={tenantId} stats={data.stats} />
      <KnowledgeBaseCollections categories={data.categories} articles={data.articles} />
      <KnowledgeProcessingHistory items={data.history} />
    </div>
  )
}
