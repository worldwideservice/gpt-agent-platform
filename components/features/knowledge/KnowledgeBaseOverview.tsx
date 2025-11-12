'use client'

import { BookOpenCheck, UploadCloud } from 'lucide-react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { KnowledgeBaseStatsSummary } from '@/types'

interface KnowledgeBaseOverviewProps {
  tenantId: string
  stats: KnowledgeBaseStatsSummary | null
}

export function KnowledgeBaseOverview({ tenantId, stats }: KnowledgeBaseOverviewProps) {
  const cards = [
    { label: 'Статей', value: stats?.publishedArticlesCount ?? 0 },
    { label: 'Категорий', value: stats?.categoriesCount ?? 0 },
    { label: 'Знаний в очереди', value: stats?.pendingAssetsCount ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl">{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <UploadCloud className="h-5 w-5" />
            <CardTitle>Загрузите знания, чтобы начать</CardTitle>
          </div>
          <CardDescription>
            Документы, статьи и FAQ будут автоматически разбиты на чанки, проиндексированы и связаны с агентами.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Поддерживаются PDF, DOCX, Markdown и HTML. Каждый файл обрабатывается воркером и попадает в Supabase.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookOpenCheck className="mr-2 h-4 w-4" />
              Открыть статьи
            </Button>
            <Button size="sm">Загрузить файл</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История обработок</CardTitle>
          <CardDescription>
            {stats
              ? `В очереди обработки: ${stats.pendingAssetsCount}`
              : 'Отображение реальных данных появляется после интеграции с Supabase.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Пока история пустая. Добавьте документы для workspace <span className="font-mono">{tenantId}</span>, чтобы увидеть прогресс.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
