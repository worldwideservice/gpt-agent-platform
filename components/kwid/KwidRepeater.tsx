'use client'

import * as React from 'react'
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { KwidButton } from './KwidButton'
import { KwidSection } from './KwidSection'

/**
 * Kwid Repeater компонент - для повторяющихся полей (data_entry_rules)
 * С drag & drop для изменения порядка
 */
export interface KwidRepeaterItem {
  id: string
  [key: string]: unknown
}

export interface KwidRepeaterProps<T extends KwidRepeaterItem> {
  items: T[]
  onItemsChange: (items: T[]) => void
  renderItem: (item: T, index: number) => React.ReactNode
  renderCollapsibleContent?: (item: T, index: number) => React.ReactNode
  onAdd?: () => T | Partial<T>
  onRemove?: (id: string) => void
  emptyMessage?: string
  addLabel?: string
  collapseAllLabel?: string
  expandAllLabel?: string
  itemTitle?: (item: T) => string
  className?: string
}

export function KwidRepeater<T extends KwidRepeaterItem>({
  items,
  onItemsChange,
  renderItem,
  renderCollapsibleContent,
  onAdd,
  onRemove,
  emptyMessage = 'No items',
  addLabel = 'Add Field',
  collapseAllLabel = 'Collapse all',
  expandAllLabel = 'Expand all',
  itemTitle,
  className,
}: KwidRepeaterProps<T>) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const handleAdd = () => {
    if (onAdd) {
      const newItem = onAdd()
      const itemWithId = {
        ...newItem,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      } as T
      onItemsChange([...items, itemWithId])
      setExpandedItems(new Set([...expandedItems, itemWithId.id]))
    }
  }

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id)
    }
    onItemsChange(items.filter((item) => item.id !== id))
    const newExpanded = new Set(expandedItems)
    newExpanded.delete(id)
    setExpandedItems(newExpanded)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < items.length) {
      ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
      onItemsChange(newItems)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  const expandAll = () => {
    setExpandedItems(new Set(items.map((item) => item.id)))
  }

  const allExpanded = items.length > 0 && items.every((item) => expandedItems.has(item.id))
  const allCollapsed = expandedItems.size === 0

  return (
    <div className={cn('space-y-4', className)}>
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KwidButton variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            {addLabel}
          </KwidButton>
          {items.length > 0 && (
            <>
              {!allExpanded && (
                <KwidButton variant="outline" size="sm" onClick={expandAll}>
                  {expandAllLabel}
                </KwidButton>
              )}
              {!allCollapsed && (
                <KwidButton variant="outline" size="sm" onClick={collapseAll}>
                  {collapseAllLabel}
                </KwidButton>
              )}
            </>
          )}
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            const title = itemTitle ? itemTitle(item) : `Item ${index + 1}`

            return (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-800">
                  {/* Drag handle */}
                  <button
                    type="button"
                    className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Move item"
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  {/* Item content */}
                  <div className="flex-1">{renderItem(item, index)}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {renderCollapsibleContent && (
                      <KwidButton
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </KwidButton>
                    )}
                    <KwidButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </KwidButton>
                  </div>
                </div>

                {/* Collapsible content */}
                {renderCollapsibleContent && isExpanded && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    {renderCollapsibleContent(item, index)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

