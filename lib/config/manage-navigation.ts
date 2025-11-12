import { LucideIcon, BarChart3, Bot, BookOpenText, Plug, MessageSquareDot, Settings } from 'lucide-react'

type NavItem = {
  label: string
  description?: string
  icon: LucideIcon
  href: (tenantId: string) => string
  exact?: boolean
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export const MANAGE_NAV_SECTIONS: NavSection[] = [
  {
    title: 'Главное',
    items: [
      {
        label: 'Дашборд',
        description: 'Обзор метрик и активности',
        icon: BarChart3,
        href: (tenantId) => `/manage/${tenantId}/dashboard`,
        exact: true,
      },
      {
        label: 'Агенты ИИ',
        description: 'Список и статусы агентов',
        icon: Bot,
        href: (tenantId) => `/manage/${tenantId}/ai-agents`,
      },
    ],
  },
  {
    title: 'Знания и сценарии',
    items: [
      {
        label: 'База знаний',
        icon: BookOpenText,
        href: (tenantId) => `/manage/${tenantId}/knowledge-base`,
      },
      {
        label: 'Чат и тестирование',
        icon: MessageSquareDot,
        href: (tenantId) => `/manage/${tenantId}/test-chat`,
      },
    ],
  },
  {
    title: 'Интеграции и настройки',
    items: [
      {
        label: 'Интеграции',
        icon: Plug,
        href: (tenantId) => `/manage/${tenantId}/integrations`,
      },
      {
        label: 'Настройки',
        icon: Settings,
        href: (tenantId) => `/manage/${tenantId}/settings`,
      },
    ],
  },
]
