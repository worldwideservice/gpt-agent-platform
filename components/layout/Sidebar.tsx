'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './SidebarToggle'

// Простые fallback переводы (так как next-intl временно отключен)
const getTranslation = (key: string, fallback?: string): string => {
  const translations: Record<string, string> = {
    'dashboard': 'Инфопанель',
    'agents': 'Агенты ИИ',
    'chat': 'Тестовый чат',
    'knowledge': 'База знаний',
    'categories': 'Категории',
    'articles': 'Статьи',
    'pricing': 'Тарифы',
    'account': 'Аккаунт',
    'support': 'Поддержка',
    'organization': 'Организация',
    'gettingStarted': 'Начало работы',
    'accountSection': 'Аккаунт',
    'whatsNew': 'Что нового',
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'selectOrganization': 'Выбрать организацию',
  }
  
  // Поддержка вложенных ключей типа "nav.agents" или "common.selectOrganization"
  const parts = key.split('.')
  const simpleKey = parts[parts.length - 1]
  
  return translations[simpleKey] || translations[key] || fallback || key
}
import {
  Bot,
  ChevronDown,
  CreditCard,
  Folder,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  FileText,
  HelpCircle,
  Settings,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type SidebarOrganization = {
  id: string
  name: string
  slug: string
  role?: string
}

interface SidebarProps {
  organizations: SidebarOrganization[]
  activeOrganizationId?: string
  tenantId?: string
  isOpen?: boolean
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  external?: boolean
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const getNavigation = (tNav: any, tenantId?: string): NavSection[] => {
  const basePath = tenantId ? `/manage/${tenantId}` : ''
  
  return [
    {
      items: [{ label: tNav('dashboard'), href: basePath || '/', icon: LayoutDashboard }],
    },
    {
      title: tNav('agents'),
      items: [
        { label: tNav('agents'), href: `${basePath}/ai-agents`, icon: Bot },
        { label: tNav('chat'), href: `${basePath}/test-chat`, icon: MessageSquare },
      ],
    },
    {
      title: tNav('knowledge'),
      items: [
        { label: tNav('categories'), href: `${basePath}/knowledge-categories`, icon: Folder },
        { label: tNav('articles'), href: `${basePath}/knowledge-items`, icon: FileText },
      ],
    },
    {
      title: tNav('support'),
      items: [{ label: tNav('gettingStarted'), href: '/docs/ru/start-here/getting-started/', icon: HelpCircle }],
    },
    {
      title: tNav('accountSection'),
      items: [
        { label: 'Настройки аккаунта', href: `${basePath}/account-settings`, icon: Settings },
        { label: 'Тарифные планы', href: `${basePath}/pricing`, icon: CreditCard },
      ],
    },
    {
      title: tNav('whatsNew'),
      items: [
        {
          label: 'Смотреть на Facebook',
          href: 'https://www.facebook.com/gpt.agent',
          icon: Sparkles,
          external: true,
        },
        {
          label: 'Смотреть в Instagram',
          href: 'https://www.instagram.com/gpt.agent/',
          icon: Sparkles,
          external: true,
        },
      ],
    },
  ]
}

const getInitials = (value: string): string => {
  if (!value) {
    return '??'
  }

  const normalized = value.trim()

  if (normalized.length === 0) {
    return '??'
  }

  const [first, second] = normalized.split(' ')
  if (second) {
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
  }

  return normalized.slice(0, 2).toUpperCase()
}

export const Sidebar = ({ organizations, activeOrganizationId, tenantId, isOpen = false }: SidebarProps) => {
  const pathname = usePathname()
  const { close, groupIsCollapsed, toggleCollapsedGroup } = useSidebar()
  // Используем fallback переводы (next-intl временно отключен)
  const t = getTranslation
  const tNav = getTranslation
  const activeOrganization =
    organizations.find((organization) => organization.id === activeOrganizationId) ?? organizations.at(0)
  const navigation = getNavigation(tNav, tenantId)

  const handleItemClick = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      close()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fi-sidebar fixed inset-y-0 left-0 z-30 w-72 flex-col border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-transform duration-300 xl:w-80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:flex`}
      >
      <div className="flex h-full flex-col">
        <header className="fi-sidebar-header flex h-16 items-center bg-white px-6 ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 lg:shadow-sm">
          <div className="fi-logo flex text-xl font-bold leading-5 tracking-tight text-gray-950 dark:text-white">
            GPT Агент
          </div>
        </header>

        <div className="flex flex-col gap-4 px-6 pt-8">
          <Link href={tenantId ? `/manage/${tenantId}` : '/'} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-lg font-semibold text-white">
              {activeOrganization ? getInitials(activeOrganization.name) : 'GA'}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">GPT Агент</p>
              <p className="text-xs text-slate-500">Trainable virtual employee</p>
            </div>
          </Link>

          {activeOrganization && (
            <button
              type="button"
              className="fi-tenant-menu-trigger group flex w-full items-center justify-center gap-x-3 rounded-lg p-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-100 focus-visible:bg-gray-100 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
              aria-label={t('selectOrganization') || 'Select organization'}
            >
              <span className="flex-1 truncate text-left">{activeOrganization.name}</span>
            </button>
          )}
        </div>

        <nav
          aria-label="Главная навигация"
          className="fi-sidebar-nav flex-grow flex flex-col gap-y-7 overflow-y-auto overflow-x-hidden px-6 py-8"
          style={{ scrollbarGutter: 'stable' }}
        >
          <ul className="flex flex-col gap-y-7">
          {navigation.map((section, sectionIndex) => {
            const hasTitle = !!section.title
            const isCollapsed = hasTitle ? groupIsCollapsed(section.title || '') : false

            return (
              <li
                key={sectionIndex}
                data-group-label={hasTitle ? section.title : undefined}
                className="fi-sidebar-group flex flex-col gap-y-1"
              >
                {hasTitle ? (
                  <div className="flex items-center gap-x-3">
                    <span className="fi-sidebar-group-label flex-1 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">
                      {section.title}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleCollapsedGroup(section.title || '')
                      }}
                      className={cn(
                        'fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:text-gray-500 dark:hover:text-gray-400',
                        isCollapsed && '-rotate-180',
                      )}
                      title={section.title}
                      aria-expanded={!isCollapsed}
                      style={{
                        '--c-300': 'var(--gray-300)',
                        '--c-400': 'var(--gray-400)',
                        '--c-500': 'var(--gray-500)',
                        '--c-600': 'var(--gray-600)',
                      } as React.CSSProperties}
                    >
                      <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                      <span className="sr-only">{section.title}</span>
                    </button>
                  </div>
                ) : null}

                {(!hasTitle || !isCollapsed) && (
                  <div className="mt-2 flex flex-col">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = item.href === '/'
                        ? pathname === '/'
                        : pathname?.startsWith(item.href) ?? false

                      const baseClassName = cn(
                        'fi-sidebar-item-button relative flex items-center justify-center gap-x-3 rounded-lg px-2 py-2 outline-none transition duration-75 hover:bg-gray-100 focus-visible:bg-gray-100 dark:hover:bg-white/5 dark:focus-visible:bg-white/5',
                        isActive && 'bg-primary-50 dark:bg-primary-900/20',
                      )

                      const labelClassName = cn(
                        'fi-sidebar-item-label flex-1 truncate text-sm font-medium',
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-200',
                      )

                      if (item.external) {
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={baseClassName}
                            onClick={handleItemClick}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className={labelClassName}>{item.label}</span>
                          </a>
                        )
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={baseClassName}
                          onClick={handleItemClick}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className={labelClassName}>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </li>
            )
          })}
          </ul>
        </nav>
      </div>
    </aside>
    </>
  )
}


