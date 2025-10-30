'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import type { KnowledgeBaseCategory } from '@/types'

interface CategoryFormProps {
  categoryId: string
  initialCategory?: KnowledgeBaseCategory | null
  categories: KnowledgeBaseCategory[]
}

export const CategoryForm = ({ categoryId, initialCategory, categories }: CategoryFormProps) => {
  const router = useRouter()
  const isNew = categoryId === 'new'

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: initialCategory?.name ?? '',
    description: initialCategory?.description ?? '',
    parentId: initialCategory?.parentId ?? '',
  })

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name,
        description: initialCategory.description ?? '',
        parentId: initialCategory.parentId ?? '',
      })
    }
  }, [initialCategory])

  const parentOptions = [
    { value: '', label: 'Без родительской категории' },
    ...categories
      .filter((category) => category.id !== categoryId)
      .map((category) => ({
        value: category.id,
        label: category.name,
      })),
  ]

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Название категории обязательно')
      return
    }

    setIsSaving(true)

    try {
      const url = isNew ? '/api/knowledge-base/categories' : `/api/knowledge-base/categories/${categoryId}`
      const method = isNew ? 'POST' : 'PATCH'

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        parentId: formData.parentId || null,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить категорию')
      }

      const result = (await response.json()) as { success: boolean; data: KnowledgeBaseCategory }

      if (!result.success) {
        throw new Error('Не удалось сохранить категорию')
      }

      router.push('/knowledge-base/categories')
    } catch (error) {
      console.error('Failed to save category', error)
      alert('Не удалось сохранить категорию. Попробуйте еще раз.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.push('/knowledge-base/categories')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4" /> Назад к списку
              </button>

              <div className="space-y-2">
                <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Link href="/knowledge-base/categories" className="font-semibold text-primary-600 hover:underline">
                    Категории
                  </Link>
                  <span>/</span>
                  <span className="font-semibold text-slate-500">
                    {isNew ? 'Новая категория' : initialCategory?.name ?? 'Редактирование'}
                  </span>
                </nav>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {isNew ? 'Создание категории' : `Редактирование категории`}
                </h1>
                <p className="max-w-2xl text-sm text-slate-500">
                  Создайте категорию для организации статей базы знаний
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Input
                label="Название категории*"
                placeholder="Например: FAQ, Документация, Политика"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />

              <Select
                label="Родительская категория"
                value={formData.parentId ?? ''}
                onChange={(value: string) => setFormData((prev) => ({ ...prev, parentId: value }))}
                options={parentOptions}
              />

              <Textarea
                label="Описание"
                placeholder="Описание категории (необязательно)"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Информация</h3>
              <p className="mt-2 text-sm text-slate-500">
                Категории помогают организовать статьи базы знаний. Вы можете создавать подкатегории,
                назначая родительскую категорию.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






