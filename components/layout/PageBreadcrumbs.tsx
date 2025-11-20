'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTenant } from '@/components/providers/TenantProvider'

/**
 * Карта путей для breadcrumbs согласно референсу KWID
 * Приоритет: Специфичные пути > Общие пути
 */
const BREADCRUMB_LABELS: Record<string, string> = {
  // Dashboard
  dashboard: 'Инфопанель',

  // AI Agents
  'ai-agents': 'Агенты ИИ',
  create: 'Создать',
  edit: 'Редактировать',

  // Knowledge Base
  'knowledge-base': 'База знаний',
  'knowledge-categories': 'Категории',
  'knowledge-items': 'Статьи',
  categories: 'Категории',
  articles: 'Статьи',


  // Integrations
  integrations: 'Интеграции',
  kommo: 'Kommo',

  // Settings
  settings: 'Настройки',
  profile: 'Профиль',
  security: 'Безопасность',
  billing: 'Оплата',
  team: 'Команда',

  // Pricing
  pricing: 'Тарифы',
}

/**
 * Генерирует breadcrumb items на основе текущего пути
 */
function generateBreadcrumbs(pathname: string, tenantId: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ label: string; href?: string; icon?: React.ReactNode }> = []

  // Начинаем с "Главная" если мы не на главной странице
  if (segments.length > 2) {
    breadcrumbs.push({
      label: 'Главная',
      href: `/manage/${tenantId}`,
    })
  }

  // Пропускаем 'manage' и tenantId
  let currentPath = `/manage/${tenantId}`
  const pathSegments = segments.slice(2) // Убираем 'manage' и tenantId

  pathSegments.forEach((segment, index) => {
    // Проверяем, является ли сегмент UUID/ID (не добавляем в breadcrumbs)
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
                 /^\d+$/.test(segment)

    if (!isId) {
      currentPath += `/${segment}`
      const label = BREADCRUMB_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      // Последний элемент - текущая страница (без ссылки)
      if (index === pathSegments.length - 1) {
        breadcrumbs.push({ label })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    }
  })

  return breadcrumbs
}

interface PageBreadcrumbsProps {
  /**
   * Кастомные breadcrumbs (переопределяют автоматические)
   */
  items?: Array<{ label: string; href?: string; icon?: React.ReactNode }>
  /**
   * Показывать иконку "Главная" для первого элемента
   */
  showHomeIcon?: boolean
  /**
   * CSS класс для контейнера
   */
  className?: string
}

/**
 * Компонент PageBreadcrumbs согласно референсу KWID
 *
 * Автоматически генерирует breadcrumbs на основе текущего пути
 * или принимает кастомные items
 *
 * Референс: references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md (строки 77-83)
 *
 * @example
 * ```tsx
 * // Автоматическая генерация
 * <PageBreadcrumbs />
 *
 * // Кастомные breadcrumbs
 * <PageBreadcrumbs items={[
 *   { label: 'Главная', href: '/manage/xxx' },
 *   { label: 'Агенты', href: '/manage/xxx/ai-agents' },
 *   { label: 'Редактировать' }
 * ]} />
 * ```
 */
export function PageBreadcrumbs({
  items,
  showHomeIcon = true,
  className,
}: PageBreadcrumbsProps) {
  const pathname = usePathname()
  const { tenantId } = useTenant()

  // Используем кастомные items или генерируем автоматически
  const breadcrumbs = items || generateBreadcrumbs(pathname, tenantId ?? '')

  // Не показываем breadcrumbs если меньше 2 элементов
  if (breadcrumbs.length < 2) {
    return null
  }

  return (
    <nav className={className} aria-label="Breadcrumb navigation">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            const isFirst = index === 0

            return (
              <div key={index} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1.5">
                      {isFirst && showHomeIcon && <Home className="h-4 w-4" />}
                      {item.icon && item.icon}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || '#'}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {isFirst && showHomeIcon && <Home className="h-4 w-4" />}
                        {item.icon && item.icon}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </BreadcrumbSeparator>
                )}
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  )
}
