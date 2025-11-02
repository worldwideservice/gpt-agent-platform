'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Filter, FolderOpen, Plus, Trash2 } from 'lucide-react'

import { KwidButton } from '@/components/kwid'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { useTenantId } from '@/hooks/useTenantId'

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
  const tenantId = useTenantId()
  const [categories, setCategories] = useState<KnowledgeBaseCategory[]>(initialCategories)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/knowledge-base/categories')
      if (response.ok) {
        const payload = (await response.json()) as CategoriesApiResponse
        if (payload.success) {
          setCategories(payload.data)
        } else {
          setError(payload.error || 'Ошибка загрузки категорий')
        }
      } else {
        setError('Не удалось загрузить категории')
      }
    } catch (err) {
      console.error('Failed to fetch categories', err)
      setError('Не удалось загрузить категории')
    }
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
        return
      }

      startTransition(async () => {
        try {
          const response = await fetch(`/api/knowledge-base/categories/${id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Не удалось удалить категорию')
          }

          await fetchCategories()
        } catch (err) {
          console.error('Failed to delete category', err)
          setError('Не удалось удалить категорию')
        }
      })
    },
    [fetchCategories],
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Категории базы знаний</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Управляйте категориями базы знаний</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href={tenantId ? `/manage/${tenantId}/knowledge-categories/new` : '/knowledge-base/categories/new'} className="w-full sm:w-auto">
            <KwidButton variant="primary" size="md" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />Создать категорию
            </KwidButton>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Нет категорий. Создайте первую категорию, чтобы начать работу.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {category.description || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={tenantId ? `/manage/${tenantId}/knowledge-categories/${category.id}` : `/knowledge-base/categories/${category.id}`}>
                        <KwidButton variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </KwidButton>
                      </Link>
                      <KwidButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </KwidButton>
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

