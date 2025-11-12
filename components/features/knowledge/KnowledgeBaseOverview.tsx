'use client'

import { BookOpenCheck, UploadCloud } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { KnowledgeBaseStatsSummary } from '@/types'

interface KnowledgeBaseOverviewProps {
  tenantId: string
  stats: KnowledgeBaseStatsSummary | null
}

export function KnowledgeBaseOverview({ tenantId, stats }: KnowledgeBaseOverviewProps) {
  const t = useTranslations('manage.knowledge.overview')
  const cards = [
    { label: t('stats.articles'), value: stats?.publishedArticlesCount ?? 0 },
    { label: t('stats.categories'), value: stats?.categoriesCount ?? 0 },
    { label: t('stats.pending'), value: stats?.pendingAssetsCount ?? 0 },
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
            <CardTitle>{t('upload.title')}</CardTitle>
          </div>
          <CardDescription>{t('upload.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('upload.helper')}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookOpenCheck className="mr-2 h-4 w-4" />
              {t('upload.actions.openArticles')}
            </Button>
            <Button size="sm">{t('upload.actions.upload')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('history.title')}</CardTitle>
          <CardDescription>
            {stats
              ? t('history.queue', { count: stats.pendingAssetsCount })
              : t('history.placeholder')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {t.rich('history.empty', {
              tenant: (chunks) => <span className="font-mono">{chunks}</span>,
              id: tenantId,
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
