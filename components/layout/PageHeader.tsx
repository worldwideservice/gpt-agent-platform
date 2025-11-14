'use client'

import { cn } from '@/lib/utils'
import { PageBreadcrumbs } from './PageBreadcrumbs'

interface PageHeaderProps {
  /**
   * Заголовок страницы (H1)
   */
  title: string
  /**
   * Описание страницы (опционально)
   */
  description?: string
  /**
   * Дополнительные действия в правой части (кнопки и т.д.)
   */
  actions?: React.ReactNode
  /**
   * Показывать ли breadcrumbs
   */
  showBreadcrumbs?: boolean
  /**
   * Кастомные breadcrumbs (если не указаны - генерируются автоматически)
   */
  breadcrumbItems?: Array<{ label: string; href?: string; icon?: React.ReactNode }>
  /**
   * CSS класс для контейнера
   */
  className?: string
  /**
   * CSS класс для заголовка
   */
  titleClassName?: string
}

/**
 * Компонент PageHeader для страниц manage согласно KWID
 *
 * Включает:
 * - Breadcrumbs (автоматические или кастомные)
 * - Заголовок страницы (H1)
 * - Описание (опционально)
 * - Действия справа (кнопки Create и т.д.)
 *
 * Референс: references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Агенты ИИ"
 *   description="Управление вашими AI агентами"
 *   actions={
 *     <Button asChild>
 *       <Link href="/manage/xxx/ai-agents/create">Создать</Link>
 *     </Button>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  showBreadcrumbs = true,
  breadcrumbItems,
  className,
  titleClassName,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 space-y-4', className)}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <PageBreadcrumbs items={breadcrumbItems} />
      )}

      {/* Заголовок и действия */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1
            className={cn(
              'text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl',
              titleClassName,
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>

        {/* Действия */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
