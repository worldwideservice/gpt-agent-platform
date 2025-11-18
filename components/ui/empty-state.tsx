import * as React from 'react'
import { AlertCircle, Database, FileQuestion, Search, ShieldAlert } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './Button'

/**
 * Типы пустых состояний согласно KWID
 */
export type EmptyStateType = 'no-data' | 'no-results' | 'no-access' | 'error'

/**
 * Иконки по умолчанию для каждого типа
 */
const DEFAULT_ICONS: Record<EmptyStateType, React.ComponentType<{ className?: string }>> = {
  'no-data': Database,
  'no-results': Search,
  'no-access': ShieldAlert,
  error: AlertCircle,
}

/**
 * Цвета иконок для каждого типа
 */
const ICON_COLORS: Record<EmptyStateType, string> = {
  'no-data': 'text-gray-400 dark:text-gray-600',
  'no-results': 'text-blue-400 dark:text-blue-600',
  'no-access': 'text-yellow-500 dark:text-yellow-600',
  error: 'text-red-500 dark:text-red-600',
}

interface EmptyStateProps {
  /**
   * Тип пустого состояния (определяет иконку и стиль по умолчанию)
   */
  type: EmptyStateType
  /**
   * Заголовок состояния
   */
  title: string
  /**
   * Описание состояния
   */
  description?: string
  /**
   * Кастомная иконка (переопределяет иконку по умолчанию)
   */
  icon?: React.ReactNode
  /**
   * Основное действие (кнопка)
   */
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  }
  /**
   * Вторичное действие (кнопка)
   */
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  }
  /**
   * CSS класс для контейнера
   */
  className?: string
}

/**
 * Компонент EmptyState согласно KWID референсу
 *
 * Используется для отображения пустых состояний таблиц, списков и других компонентов
 *
 * Референс: references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md (раздел "Пустые состояния")
 * План: docs/FRONTEND_ACTION_PLAN.md (Day 3-4)
 *
 * @example
 * ```tsx
 * // Нет данных
 * <EmptyState
 *   type="no-data"
 *   title="Нет агентов"
 *   description="Создайте первого AI агента для начала работы"
 *   action={{
 *     label: 'Создать агента',
 *     onClick: () => router.push('/manage/xxx/ai-agents/create')
 *   }}
 * />
 *
 * // Нет результатов поиска
 * <EmptyState
 *   type="no-results"
 *   title="Ничего не найдено"
 *   description="Попробуйте изменить параметры поиска"
 *   action={{
 *     label: 'Сбросить фильтры',
 *     onClick: () => resetFilters(),
 *     variant: 'secondary'
 *   }}
 * />
 *
 * // Ошибка
 * <EmptyState
 *   type="error"
 *   title="Не удалось загрузить данные"
 *   description="Произошла ошибка при загрузке. Пожалуйста, попробуйте снова."
 *   action={{
 *     label: 'Повторить',
 *     onClick: () => refetch()
 *   }}
 * />
 * ```
 */
export function EmptyState({
  type,
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const DefaultIcon = DEFAULT_ICONS[type]
  const iconColor = ICON_COLORS[type]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center dark:border-gray-700 dark:bg-gray-900/50',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Иконка */}
      <div className="mb-4">
        {icon ? (
          <div className="flex h-16 w-16 items-center justify-center">{icon}</div>
        ) : (
          <DefaultIcon className={cn('h-16 w-16', iconColor)} />
        )}
      </div>

      {/* Заголовок */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">{title}</h3>

      {/* Описание */}
      {description && (
        <p className="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}

      {/* Действия */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} variant={action.variant || 'default'} size="default">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              size="default"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Предустановленные компоненты для частых случаев
 */

/**
 * Пустое состояние "Нет данных"
 */
export function EmptyStateNoData({
  title = 'Нет данных',
  description,
  action,
  ...props
}: Omit<EmptyStateProps, 'type'>) {
  return <EmptyState type="no-data" title={title} description={description} action={action} {...props} />
}

/**
 * Пустое состояние "Нет результатов поиска"
 */
export function EmptyStateNoResults({
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить параметры поиска',
  action,
  ...props
}: Omit<EmptyStateProps, 'type'>) {
  return <EmptyState type="no-results" title={title} description={description} action={action} {...props} />
}

/**
 * Пустое состояние "Нет доступа"
 */
export function EmptyStateNoAccess({
  title = 'Нет доступа',
  description = 'У вас нет прав для просмотра этой информации',
  action,
  ...props
}: Omit<EmptyStateProps, 'type'>) {
  return <EmptyState type="no-access" title={title} description={description} action={action} {...props} />
}

/**
 * Пустое состояние "Ошибка"
 */
export function EmptyStateError({
  title = 'Произошла ошибка',
  description = 'Не удалось загрузить данные. Пожалуйста, попробуйте снова.',
  action,
  ...props
}: Omit<EmptyStateProps, 'type'>) {
  return <EmptyState type="error" title={title} description={description} action={action} {...props} />
}
