import { LucideIcon, BarChart3, Bot, BookOpenText, Plug, MessageSquareDot, Settings } from 'lucide-react'

type NavItem = {
  labelKey: string
  descriptionKey?: string
  icon: LucideIcon
  href: (tenantId: string) => string
  exact?: boolean
}

export type NavSection = {
  titleKey: string
  items: NavItem[]
}

export const MANAGE_NAV_SECTIONS: NavSection[] = [
  {
    titleKey: 'main.title',
    items: [
      {
        labelKey: 'main.dashboard.label',
        descriptionKey: 'main.dashboard.description',
        icon: BarChart3,
        href: (tenantId) => `/manage/${tenantId}/dashboard`,
        exact: true,
      },
      {
        labelKey: 'main.agents.label',
        descriptionKey: 'main.agents.description',
        icon: Bot,
        href: (tenantId) => `/manage/${tenantId}/ai-agents`,
      },
    ],
  },
  {
    titleKey: 'knowledge.title',
    items: [
      {
        labelKey: 'knowledge.base.label',
        icon: BookOpenText,
        href: (tenantId) => `/manage/${tenantId}/knowledge-base`,
      },
      {
        labelKey: 'knowledge.testChat.label',
        icon: MessageSquareDot,
        href: (tenantId) => `/manage/${tenantId}/test-chat`,
      },
    ],
  },
  {
    titleKey: 'integrations.title',
    items: [
      {
        labelKey: 'integrations.items.integrations.label',
        icon: Plug,
        href: (tenantId) => `/manage/${tenantId}/integrations`,
      },
      {
        labelKey: 'integrations.items.settings.label',
        icon: Settings,
        href: (tenantId) => `/manage/${tenantId}/settings`,
      },
    ],
  },
]
