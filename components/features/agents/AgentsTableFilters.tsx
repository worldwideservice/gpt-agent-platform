'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/date-picker'

/**
 * Задача 4.1: Advanced Filters для агентов
 * Компонент фильтров для таблицы агентов
 */

const AI_MODELS = [
  { value: 'gpt-4.1', label: 'OpenAI GPT-4.1' },
  { value: 'gemini-2.5-flash', label: 'Google Gemini 2.5 Flash' },
  { value: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
  { value: 'gpt-5', label: 'OpenAI GPT-5' },
]

export function AgentsTableFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Получаем текущие значения из URL
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const model = searchParams.get('model') || ''
  const dateFromStr = searchParams.get('dateFrom')
  const dateToStr = searchParams.get('dateTo')

  // Преобразуем строки дат в Date объекты
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined
  const dateTo = dateToStr ? new Date(dateToStr) : undefined

  /**
   * Обновляет URL параметры и сбрасывает страницу на 1
   */
  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Сброс страницы при изменении фильтров
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  /**
   * Обновляет фильтр даты
   */
  const updateDateFilter = (key: string, date: Date | undefined) => {
    if (date) {
      updateFilter(key, date.toISOString())
    } else {
      updateFilter(key, undefined)
    }
  }

  /**
   * Обработчик изменения поискового запроса с debounce
   */
  const handleSearchChange = (value: string) => {
    updateFilter('search', value || undefined)
  }

  /**
   * Сброс всех фильтров
   */
  const clearFilters = () => {
    router.push(pathname)
  }

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters =
    search || status !== 'all' || model || dateFrom || dateTo

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Поиск по имени */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Фильтр по статусу */}
        <div>
          <Select
            value={status}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
              <SelectItem value="draft">Черновики</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Фильтр по модели */}
        <div>
          <Select
            value={model || 'all'}
            onValueChange={(value) =>
              updateFilter('model', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Модель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все модели</SelectItem>
              {AI_MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Кнопка сброса фильтров */}
        <div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Фильтры по дате */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Дата создания от
          </label>
          <DatePicker
            date={dateFrom}
            onSelect={(date) => updateDateFilter('dateFrom', date)}
            placeholder="От даты..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Дата создания до
          </label>
          <DatePicker
            date={dateTo}
            onSelect={(date) => updateDateFilter('dateTo', date)}
            placeholder="До даты..."
          />
        </div>
      </div>
    </div>
  )
}
