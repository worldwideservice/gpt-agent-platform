'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Filter, FileText, Plus, Search, Trash2 } from 'lucide-react'

import { KwidButton, KwidInput } from '@/components/kwid'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import type { KnowledgeBaseArticle } from '@/types'

interface ArticlesClientProps {
  initialArticles: KnowledgeBaseArticle[]
  categories: Array<{ id: string; name: string }>
}

interface ArticlesApiResponse {
  success: boolean
  data: KnowledgeBaseArticle[]
  error?: string
}

const formatDate = (date: Date | string): string => {
  const value = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(value.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

export const ArticlesClient = ({ initialArticles, categories }: ArticlesClientProps) => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchArticles = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/knowledge-base/articles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = (await response.json()) as ArticlesApiResponse

      if (!payload.success) {
        throw new Error(payload.error ?? 'Неизвестная ошибка загрузки статей')
      }

      setArticles(payload.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      console.error('Failed to fetch articles', err)
      setError('Не удалось загрузить статьи. Попробуйте обновить страницу.')
      setArticles([])
    }
  }, [])

  useEffect(() => {
    setArticles(initialArticles)
  }, [initialArticles])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Вы уверены, что хотите удалить эту статью? Это действие нельзя отменить.')) {
        return
      }

      try {
        const response = await fetch(`/api/knowledge-base/articles/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Не удалось удалить статью')
        }

        const payload = (await response.json()) as { success: boolean }

        if (!payload.success) {
          throw new Error('Не удалось удалить статью')
        }

        await fetchArticles()
      } catch (err) {
        console.error('Failed to delete article', err)
        setError('Не удалось удалить статью')
      }
    },
    [fetchArticles],
  )

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryName = (categoryId: string | null): string => {
    if (!categoryId) {
      return 'Без категории'
    }

    const category = categories.find((c) => c.id === categoryId)
    return category?.name ?? 'Без категории'
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Статьи</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Материалы базы знаний, доступные для AI-агентов</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Статьи / Список</div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <KwidInput
              type="search"
              placeholder="Поиск статей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Поиск статей"
              className="pl-10"
            />
          </div>
          <KwidButton variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Фильтры
          </KwidButton>
          <Link href="/knowledge-base/articles/new">
            <KwidButton variant="primary" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Создать
            </KwidButton>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert">
          {error}
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FileText className="h-7 w-7 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
            {searchTerm ? 'Статьи не найдены' : 'Статьи не найдены'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте новую статью, чтобы она была доступна агентам и сотрудникам.'}
          </p>
          {!searchTerm && (
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/knowledge-base/articles/new">
                <KwidButton variant="primary" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Создать статью
                </KwidButton>
              </Link>
              <KwidButton variant="outline" size="sm">
                Импортировать
              </KwidButton>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создана</TableHead>
                <TableHead>Обновлена</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Link
                        href={`/knowledge-base/articles/${article.id}`}
                        className="font-medium text-custom-600 hover:text-custom-700 hover:underline dark:text-custom-400 dark:hover:text-custom-300"
                      >
                        {article.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">{getCategoryName(article.categoryId)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        article.isPublished
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {article.isPublished ? 'Активна' : 'Черновик'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">{formatDate(article.createdAt)}</TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">{formatDate(article.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3 text-sm font-medium">
                      <Link
                        href={`/knowledge-base/articles/${article.id}`}
                        className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300"
                      >
                        Открыть
                      </Link>
                      <Link
                        href={`/knowledge-base/articles/${article.id}/edit`}
                        className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Удалить
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}











