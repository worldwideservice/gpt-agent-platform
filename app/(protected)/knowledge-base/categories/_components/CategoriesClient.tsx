'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Filter, FolderOpen, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import type { KnowledgeBaseCategory } from '@/types'

interface CategoriesClientProps {
  initialCategories: KnowledgeBaseCategory[]
}

interface CategoriesApiResponse {
  success: boolean
  data: KnowledgeBaseCategory[]
  error?: string
}

export const CategoriesClient = ({ initialCategories }: CategoriesClientProps) => {
  const [categories, setCategories] = useState<KnowledgeBaseCategory[]>(initialCategories)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchCategories = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/knowledge-base/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = (await response.json()) as CategoriesApiResponse

      if (!payload.success) {
        throw new Error(payload.error ?? 'Неизвестная ошибка загрузки категорий')
      }

      setCategories(payload.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      console.error('Failed to fetch categories', err)
      setError('Не удалось загрузить категории. Попробуйте обновить страницу.')
      setCategories([])
    }
  }, [])

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.')) {
        return
      }

      try {
        const response = await fetch(`/api/knowledge-base/categories/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Не удалось удалить категорию')
        }

        const payload = (await response.json()) as { success: boolean }

        if (!payload.success) {
          throw new Error('Не удалось удалить категорию')
        }

        await fetchCategories()
      } catch (err) {
        console.error('Failed to delete category', err)
        setError('Не удалось удалить категорию')
      }
    },
    [fetchCategories],
  )

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Категории</h1>
        <p className="text-sm text-slate-500">Управляйте структурами базы знаний</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Категории / Список</div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-sm">
            <Filter className="h-4 w-4" /> Фильтры
          </Button>
          <Link href="/knowledge-base/categories/new">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Заголовок</TableHead>
              <TableHead>Подкатегории</TableHead>
              <TableHead>Статьи</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
                  Загрузка категорий...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
                  Категории не найдены. Создайте первую категорию, чтобы начать работу.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="border-b border-slate-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-slate-400" />
                      <Link
                        href={`/knowledge-base/categories/${category.id}`}
                        className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {category.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">0</TableCell>
                  <TableCell className="text-sm text-slate-600">{category.articlesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3 text-sm font-medium">
                      <Link
                        href={`/knowledge-base/categories/${category.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Открыть
                      </Link>
                      <Link
                        href={`/knowledge-base/categories/${category.id}/edit`}
                        className="text-slate-500 transition-colors hover:text-slate-700"
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-rose-500 transition-colors hover:text-rose-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}













