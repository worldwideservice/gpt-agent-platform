'use client'

import { Filter, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'

const ArticlesPage = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Статьи</h1>
        <p className="text-sm text-slate-500">Материалы базы знаний, доступные для AI-агентов</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Статьи / Список
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-sm">
            <Filter className="h-4 w-4" /> Фильтры
          </Button>
          <Button className="gap-2 text-sm">
            <Plus className="h-4 w-4" /> Создать
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto h-14 w-14 rounded-full bg-slate-100" />
        <h3 className="mt-6 text-lg font-semibold text-slate-900">Статьи не найдены</h3>
        <p className="mt-2 text-sm text-slate-500">
          Добавьте новую статью, чтобы она была доступна агентам и сотрудникам.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button className="gap-2 text-sm">
            <Plus className="h-4 w-4" /> Создать статью
          </Button>
          <Button variant="outline" className="text-sm">
            Импортировать
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
