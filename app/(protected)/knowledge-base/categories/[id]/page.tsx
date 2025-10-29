'use client'

import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'

const CategoryDetailsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <button type="button" className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
            <ArrowLeft className="h-3.5 w-3.5" /> Назад к списку категорий
          </button>
          <h1 className="text-3xl font-semibold text-slate-900">Общее</h1>
          <p className="text-sm text-slate-500">Категория для общих статей и инструкций</p>
        </div>
        <Button className="gap-2 text-sm">
          <Plus className="h-4 w-4" /> Создать
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyCard title="Подкатегории отсутствуют" actionLabel="Создать подкатегорию" />
        <EmptyCard
          title="Статьи в «Общее»"
          actionLabel="Создать статью"
          description="Статьи, добавленные в эту категорию, появятся здесь."
        />
      </div>
    </div>
  )
}

const EmptyCard = ({
  title,
  actionLabel,
  description,
}: {
  title: string
  actionLabel: string
  description?: string
}) => (
  <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white text-center shadow-sm">
    <div className="h-12 w-12 rounded-full bg-slate-100" />
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}
    </div>
    <Button variant="outline" size="sm">
      {actionLabel}
    </Button>
  </div>
)

export default CategoryDetailsPage
