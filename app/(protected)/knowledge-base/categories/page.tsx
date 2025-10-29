'use client'

import Link from 'next/link'
import { Filter, FolderOpen, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'

interface CategoryRow {
  id: string
  name: string
  subcategories: number
  articles: number
}

const categories: CategoryRow[] = [
  { id: 'general', name: 'Общее', subcategories: 0, articles: 0 },
]

const CategoriesPage = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Категории</h1>
        <p className="text-sm text-slate-500">Управляйте структурами базы знаний</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Категории / Список
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Заголовок</th>
              <th className="px-6 py-4 font-semibold">Подкатегории</th>
              <th className="px-6 py-4 font-semibold">Статьи</th>
              <th className="px-6 py-4 text-right font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t border-slate-100 text-slate-700 transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <Link href={`/knowledge-base/categories/${category.id}`} className="font-medium text-primary-600">
                    {category.name}
                  </Link>
                </td>
                <td className="px-6 py-4">{category.subcategories}</td>
                <td className="px-6 py-4">{category.articles}</td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-3 text-sm">
                    <Link href={`/knowledge-base/categories/${category.id}`}>Открыть</Link>
                    <button type="button" className="text-primary-600">
                      Редактировать
                    </button>
                    <button type="button" className="text-rose-500">
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoriesPage
