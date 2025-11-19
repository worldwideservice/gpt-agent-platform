import {
  LucideIcon,
  LayoutDashboard,
  Bot,
  MessageSquare,
  Folder,
  FileText,
  BookOpen,
  User,
  CreditCard,
  Facebook,
  Instagram,
} from 'lucide-react'

type NavItem = {
  labelKey: string
  descriptionKey?: string
  icon: LucideIcon
  href: (tenantId: string) => string
  exact?: boolean
  isExternal?: boolean
}

export type NavSection = {
  titleKey?: string // Optional for flat items like Dashboard
  items: NavItem[]
}

export const MANAGE_NAV_SECTIONS: NavSection[] = [
  {
    // Инфопанель (Dashboard) - Top level item, no section title in UI usually, but structure might require it.
    // In the screenshot "Инфопанель" is separate.
    // We'll keep it in a section but maybe the UI renders it differently if titleKey is missing?
    // Looking at the screenshot, "Инфопанель" is a link, then "Агенты ИИ" is a collapsible section.
    // The current type definition enforces titleKey. Let's see how it's used in ManageSidebar.tsx.
    // For now, I will group them logically.
    titleKey: 'main.title', // This might need adjustment if the UI renders the title.
    items: [
      {
        labelKey: 'main.dashboard.label',
        descriptionKey: 'main.dashboard.description',
        icon: LayoutDashboard,
        href: (tenantId) => `/manage/${tenantId}/dashboard`,
        exact: true,
      },
    ],
  },
  {
    titleKey: 'main.agents.section', // "Агенты ИИ"
    items: [
      {
        labelKey: 'main.agents.label', // "Агенты ИИ"
        descriptionKey: 'main.agents.description',
        icon: Bot,
        href: (tenantId) => `/manage/${tenantId}/ai-agents`,
      },
      {
        labelKey: 'main.testChat.label', // "Тестовый чат"
        icon: MessageSquare,
        href: (tenantId) => `/manage/${tenantId}/test-chat`,
      },
    ],
  },
  {
    titleKey: 'knowledge.title', // "База знаний"
    items: [
      {
        labelKey: 'knowledge.categories.label', // "Категории"
        icon: Folder,
        href: (tenantId) => `/manage/${tenantId}/knowledge-categories`,
      },
      {
        labelKey: 'knowledge.articles.label', // "Статьи"
        icon: FileText,
        href: (tenantId) => `/manage/${tenantId}/knowledge-items`,
      },
    ],
  },
  {
    titleKey: 'support.title', // "Поддержка"
    items: [
      {
        labelKey: 'support.gettingStarted.label', // "Начало работы"
        icon: BookOpen,
        href: () => 'https://gpt-agent-ai.com/docs/ru/start-here/getting-started/',
        isExternal: true,
      },
    ],
  },
  {
    titleKey: 'account.title', // "Аккаунт"
    items: [
      {
        labelKey: 'account.settings.label', // "Настройки аккаунта"
        icon: User,
        href: (tenantId) => `/manage/${tenantId}/account-settings`, // Changed from /settings to /account-settings to match report if needed, or keep /settings but move it here. Report said /account-settings.
      },
      {
        labelKey: 'account.pricing.label', // "Тарифные планы"
        icon: CreditCard,
        href: (tenantId) => `/manage/${tenantId}/pricing`,
      },
    ],
  },
  {
    titleKey: 'whatsNew.title', // "Что нового"
    items: [
      {
        labelKey: 'whatsNew.facebook.label', // "Смотреть на Facebook"
        icon: Facebook,
        href: () => 'https://www.facebook.com/gpt.agent',
        isExternal: true,
      },
      {
        labelKey: 'whatsNew.instagram.label', // "Смотреть в Instagram"
        icon: Instagram,
        href: () => 'https://www.instagram.com/gpt.agent/',
        isExternal: true,
      },
    ],
  },
]
