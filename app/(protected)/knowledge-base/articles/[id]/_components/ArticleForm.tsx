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

import type { KnowledgeBaseArticle } from '@/types'

interface ArticleFormProps {
  articleId: string
  initialArticle?: KnowledgeBaseArticle | null
  categories: Array<{ id: string; name: string }>
}

export const ArticleForm = ({ articleId, initialArticle, categories }: ArticleFormProps) => {
  const router = useRouter()
  const isNew = articleId === 'new'

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: initialArticle?.title ?? '',
    content: initialArticle?.content ?? '',
    categoryId: initialArticle?.categoryId ?? '',
    slug: '',
  })

  useEffect(() => {
    if (initialArticle) {
      setFormData({
        title: initialArticle.title,
        content: initialArticle.content,
        categoryId: initialArticle.categoryId,
        slug: '',
      })
    }
  }, [initialArticle])

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Название статьи обязательно')
      return
    }

    if (!formData.content.trim()) {
      alert('Содержание статьи обязательно')
      return
    }

    setIsSaving(true)

    try {
      const url = isNew ? '/api/knowledge-base/articles' : `/api/knowledge-base/articles/${articleId}`
      const method = isNew ? 'POST' : 'PATCH'

      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId || null,
        slug: formData.slug.trim() || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить статью')
      }

      const result = (await response.json()) as { success: boolean; data: KnowledgeBaseArticle }

      if (!result.success) {
        throw new Error('Не удалось сохранить статью')
      }

      router.push('/knowledge-base/articles')
    } catch (error) {
      console.error('Failed to save article', error)
      alert('Не удалось сохранить статью. Попробуйте еще раз.')
    } finally {
      setIsSaving(false)
    }
  }

  const categoryOptions = [
    { value: '', label: 'Без категории' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ]

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.push('/knowledge-base/articles')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4" /> Назад к списку
              </button>

              <div className="space-y-2">
                <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Link
                    href="/knowledge-base/articles"
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    Статьи
                  </Link>
                  <span>/</span>
                  <span className="font-semibold text-slate-500">
                    {isNew ? 'Новая статья' : initialArticle?.title ?? 'Редактирование'}
                  </span>
                </nav>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {isNew ? 'Создание статьи' : `Редактирование статьи`}
                </h1>
                <p className="max-w-2xl text-sm text-slate-500">
                  Создайте статью для базы знаний, которую смогут использовать AI-агенты
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
            <div className="space-y-4">
              <Input
                label="Название статьи*"
                placeholder="Например: Как начать работу с AI-агентом"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />

              <Select
                label="Категория"
                options={categoryOptions}
                value={formData.categoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
              />

              <Textarea
                label="Содержание статьи*"
                placeholder="Полное содержание статьи..."
                rows={20}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Информация</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Статьи базы знаний используются AI-агентами для ответов на вопросы пользователей. Чем
                  точнее и подробнее контент, тем лучше будут ответы агента.
                </p>
              </div>

              <Input
                label="Slug (URL)"
                placeholder="avtomaticheskiy-slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                description="Автоматически создаётся из названия, если не указан"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



