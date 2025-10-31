'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Filter, FileText, Plus, Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
        <h1 className="text-3xl font-semibold text-slate-900">Статьи</h1>
        <p className="text-sm text-slate-500">Материалы базы знаний, доступные для AI-агентов</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Статьи / Список</div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Поиск статей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Поиск статей"
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 text-sm">
            <Filter className="h-4 w-4" /> Фильтры
          </Button>
          <Link href="/knowledge-base/articles/new">
            <Button className="gap-2 text-sm">
              <Plus className="h-4 w-4" /> Создать
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-slate-900">
            {searchTerm ? 'Статьи не найдены' : 'Статьи не найдены'}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {searchTerm
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте новую статью, чтобы она была доступна агентам и сотрудникам.'}
          </p>
          {!searchTerm && (
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/knowledge-base/articles/new">
                <Button className="gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Создать статью
                </Button>
              </Link>
              <Button variant="outline" className="text-sm">
                Импортировать
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
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
                <TableRow key={article.id} className="border-b border-slate-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <Link
                        href={`/knowledge-base/articles/${article.id}`}
                        className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {article.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{getCategoryName(article.categoryId)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        article.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {article.isPublished ? 'Активна' : 'Черновик'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{formatDate(article.createdAt)}</TableCell>
                  <TableCell className="text-sm text-slate-600">{formatDate(article.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3 text-sm font-medium">
                      <Link
                        href={`/knowledge-base/articles/${article.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Открыть
                      </Link>
                      <Link
                        href={`/knowledge-base/articles/${article.id}/edit`}
                        className="text-slate-500 transition-colors hover:text-slate-700"
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-rose-500 transition-colors hover:text-rose-600"
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








