'use client'

import { useFormatter, useTranslations } from 'next-intl'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@/types'

interface KnowledgeBaseCollectionsProps {
  categories: KnowledgeBaseCategory[]
  articles: KnowledgeBaseArticle[]
}

export function KnowledgeBaseCollections({ categories, articles }: KnowledgeBaseCollectionsProps) {
  const t = useTranslations('manage.knowledge.collections')
  const format = useFormatter()
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('categories.title')}</CardTitle>
          <CardDescription>{t('categories.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">{t('categories.empty')}</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {t('categories.count', { count: category.articlesCount })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('articles.title')}</CardTitle>
          <CardDescription>{t('articles.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">{t('articles.empty')}</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-50">{article.title}</p>
                  {article.slug && (
                    <p className="text-xs text-gray-500">/{article.slug}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {t('articles.updated', {
                      date: format.dateTime(new Date(article.updatedAt), { dateStyle: 'medium' }),
                      status: article.isPublished
                        ? t('articles.status.published')
                        : t('articles.status.draft'),
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
