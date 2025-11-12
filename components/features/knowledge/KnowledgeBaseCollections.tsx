import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@/types'

interface KnowledgeBaseCollectionsProps {
  categories: KnowledgeBaseCategory[]
  articles: KnowledgeBaseArticle[]
}

export function KnowledgeBaseCollections({ categories, articles }: KnowledgeBaseCollectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Категории</CardTitle>
          <CardDescription>Все разделы, доступные агентам</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">Категории ещё не созданы.</p>
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
                    {category.articlesCount} шт.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статьи</CardTitle>
          <CardDescription>Последние материалы в базе знаний</CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">Статьи ещё не добавлены. Загрузите файлы или создайте статью.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-50">{article.title}</p>
                  {article.slug && (
                    <p className="text-xs text-gray-500">/{article.slug}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Обновлено {article.updatedAt.toLocaleDateString('ru-RU')} ·{' '}
                    {article.isPublished ? 'Опубликовано' : 'Черновик'}
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
