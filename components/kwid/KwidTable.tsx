'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { KwidButton } from './KwidButton'
import { KwidInput } from './KwidInput'

/**
 * Kwid Table компонент - реплика стиля Filament таблиц
 * С поддержкой фильтрации, пагинации, сортировки
 */

export interface KwidTableColumn<T> {
  key: string
  header: string
  accessor?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  className?: string
}

export interface KwidTableProps<T> {
  data: T[]
  columns: KwidTableColumn<T>[]
  onRowClick?: (row: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  sorting?: {
    column?: string
    direction?: 'asc' | 'desc'
    onSort: (column: string, direction: 'asc' | 'desc') => void
  }
  emptyMessage?: string
  className?: string
}

export function KwidTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  pagination,
  sorting,
  emptyMessage = 'No data available',
  className,
}: KwidTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSort = (column: string) => {
    if (!sorting || !columns.find((c) => c.key === column)?.sortable) return

    const direction =
      sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc'
    sorting.onSort(column, direction)
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <KwidInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="fi-ta-table relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 font-semibold text-gray-900 dark:text-white',
                    column.sortable && sorting && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700',
                    column.width && `w-[${column.width}]`,
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && sorting && (
                      <span className="text-gray-400">
                        {sorting.column === column.key &&
                          (sorting.direction === 'asc' ? '↑' : '↓')}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={cn(
                    'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-6 py-4 text-gray-900 dark:text-white', column.className)}
                    >
                      {column.accessor
                        ? column.accessor(row)
                        : (row as Record<string, unknown>)[column.key]?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span>
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <KwidButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </KwidButton>
            <KwidButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </KwidButton>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {totalPages}
            </span>
            <KwidButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </KwidButton>
            <KwidButton
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </KwidButton>
          </div>
        </div>
      )}
    </div>
  )
}

