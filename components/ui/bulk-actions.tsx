'use client'

import { useState } from 'react'
import { Trash2, MoreHorizontal, X } from 'lucide-react'
import { Button } from './Button'
import { Checkbox } from './checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * BulkActions компонент согласно KWID референсу
 *
 * Используется для массовых операций над записями в таблицах
 *
 * Референс: references-kwid/ADDITIONAL_UI_ELEMENTS_DETAILED_REPORT.md (раздел 8)
 *
 * @example
 * ```tsx
 * const [selectedIds, setSelectedIds] = useState<string[]>([])
 *
 * <BulkActions
 *   selectedCount={selectedIds.length}
 *   totalCount={items.length}
 *   onSelectAll={() => setSelectedIds(items.map(i => i.id))}
 *   onDeselectAll={() => setSelectedIds([])}
 *   onDelete={() => handleBulkDelete(selectedIds)}
 *   entityName="запись"
 * />
 * ```
 */

interface BulkActionsProps {
  /**
   * Количество выбранных записей
   */
  selectedCount: number
  /**
   * Общее количество записей (для "Выбрать все X")
   */
  totalCount: number
  /**
   * Название сущности в единственном числе (запись, агент, статья)
   */
  entityName: string
  /**
   * Название сущности во множественном числе (записи, агентов, статей)
   */
  entityNamePlural?: string
  /**
   * Callback при выборе всех записей
   */
  onSelectAll: () => void
  /**
   * Callback при снятии выделения
   */
  onDeselectAll: () => void
  /**
   * Callback при удалении выбранных
   */
  onDelete: () => void
  /**
   * Дополнительные действия
   */
  additionalActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }>
  /**
   * CSS класс
   */
  className?: string
}

export function BulkActions({
  selectedCount,
  totalCount,
  entityName,
  entityNamePlural,
  onSelectAll,
  onDeselectAll,
  onDelete,
  additionalActions = [],
  className,
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const pluralName = entityNamePlural || `${entityName}ов`
  const selectedText =
    selectedCount === 1
      ? `Выбрана 1 ${entityName}`
      : `Выбрано ${selectedCount} ${pluralName}`

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800',
        'animate-in slide-in-from-bottom-2 fade-in-0 duration-300',
        className,
      )}
      role="toolbar"
      aria-label="Массовые действия"
    >
      {/* Текст выбора */}
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{selectedText}</p>

      {/* Разделитель */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Кнопка "Выбрать всё" */}
      {selectedCount < totalCount && (
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          Выбрать всё {totalCount}
        </Button>
      )}

      {/* Кнопка "Убрать выделение" */}
      <Button variant="ghost" size="sm" onClick={onDeselectAll}>
        <X className="mr-1 h-4 w-4" />
        Убрать выделение
      </Button>

      {/* Разделитель */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Кнопка "Удалить" */}
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="mr-1 h-4 w-4" />
        Удалить отмеченное
      </Button>

      {/* Дополнительные действия */}
      {additionalActions.length > 0 && (
        <>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                Открыть действия
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {additionalActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

/**
 * Checkbox для заголовка таблицы (выбрать все)
 */
interface BulkSelectHeaderProps {
  /**
   * Все ли записи выбраны
   */
  checked: boolean
  /**
   * Частично ли выбраны (indeterminate)
   */
  indeterminate?: boolean
  /**
   * Callback при изменении
   */
  onCheckedChange: (checked: boolean) => void
  /**
   * Aria label
   */
  ariaLabel?: string
}

export function BulkSelectHeader({
  checked,
  indeterminate,
  onCheckedChange,
  ariaLabel = 'Выбрать все записи',
}: BulkSelectHeaderProps) {
  return (
    <Checkbox
      checked={checked}
      data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
    />
  )
}

/**
 * Checkbox для строки таблицы
 */
interface BulkSelectRowProps {
  /**
   * Выбрана ли запись
   */
  checked: boolean
  /**
   * Callback при изменении
   */
  onCheckedChange: (checked: boolean) => void
  /**
   * Название записи (для aria-label)
   */
  label: string
}

export function BulkSelectRow({ checked, onCheckedChange, label }: BulkSelectRowProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={`Выбрать ${label}`}
    />
  )
}
