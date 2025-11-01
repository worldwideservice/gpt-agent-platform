'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

import { KwidButton, KwidInput, KwidSelect, KwidTextarea, KwidSwitch, KwidSection } from '@/components/kwid'

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
    slug: initialArticle?.slug ?? '',
    isPublished: initialArticle?.isPublished ?? true,
  })

  useEffect(() => {
    if (initialArticle) {
      setFormData({
        title: initialArticle.title,
        content: initialArticle.content,
        categoryId: initialArticle.categoryId ?? '',
        slug: initialArticle.slug ?? '',
        isPublished: initialArticle.isPublished,
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
        isPublished: formData.isPublished,
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
      <KwidSection title={isNew ? 'Создание статьи' : `Редактирование статьи`}>
        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.push('/knowledge-base/articles')}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-custom-600 dark:text-gray-400 dark:hover:text-custom-400"
              >
                <ArrowLeft className="h-4 w-4" /> Назад к списку
              </button>

              <div className="space-y-2">
                <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  <Link
                    href="/knowledge-base/articles"
                    className="font-semibold text-custom-600 hover:underline dark:text-custom-400"
                  >
                    Статьи
                  </Link>
                  <span>/</span>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    {isNew ? 'Новая статья' : initialArticle?.title ?? 'Редактирование'}
                  </span>
                </nav>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {isNew ? 'Создание статьи' : `Редактирование статьи`}
                </h1>
                <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Создайте статью для базы знаний, которую смогут использовать AI-агенты
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <KwidButton type="button" onClick={handleSave} disabled={isSaving} variant="primary" size="md">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Сохранение…' : 'Сохранить'}
              </KwidButton>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
            <KwidSection
              title="Содержание статьи"
              description="Основная информация и контент"
            >
              <div className="space-y-4">
                <KwidInput
                  label="Название статьи*"
                  placeholder="Например: Как начать работу с AI-агентом"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Активно</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Когда выключено, статья не будет использоваться агентами.
                    </p>
                  </div>
                  <KwidSwitch
                    checked={formData.isPublished}
                    onCheckedChange={(value) => setFormData((prev) => ({ ...prev, isPublished: value }))}
                  />
                </div>

                <KwidSelect
                  label="Категория"
                  options={categoryOptions}
                  value={formData.categoryId}
                  onChange={(value: string) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                />

                <KwidTextarea
                  label="Содержание статьи*"
                  placeholder="Полное содержание статьи..."
                  rows={20}
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>
            </KwidSection>

            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Информация</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Статьи базы знаний используются AI-агентами для ответов на вопросы пользователей. Чем
                  точнее и подробнее контент, тем лучше будут ответы агента.
                </p>
              </div>

              <KwidInput
                label="Slug (URL)"
                placeholder="avtomaticheskiy-slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                hint="Автоматически создаётся из названия, если не указан"
              />
            </div>
          </div>
        </div>
      </KwidSection>
    </div>
  )
}

