'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Bot,
  BookOpen,
  ChevronDown,
  Code,
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

const getNavigation = (tNav: any): NavSection[] => [
  {
    items: [{ label: tNav('dashboard'), href: '/', icon: LayoutDashboard }],
  },
  {
    title: tNav('agents'),
    items: [
      { label: tNav('agents'), href: '/agents', icon: Bot },
      { label: tNav('chat'), href: '/chat', icon: MessageSquare },
    ],
  },
  {
    title: tNav('knowledge'),
    items: [
      { label: tNav('categories'), href: '/knowledge-base/categories', icon: Folder },
      { label: tNav('articles'), href: '/knowledge-base/articles', icon: FileText },
    ],
  },
  {
    title: tNav('developers'),
    items: [
      { label: tNav('apiDocs'), href: '/api-docs', icon: Code },
      { label: 'GraphQL Playground', href: '/graphql-playground', icon: Code },
      { label: tNav('testKommo'), href: '/test-kommo', icon: Settings },
    ],
  },
  {
    title: tNav('support'),
    items: [{ label: tNav('gettingStarted'), href: '/support', icon: HelpCircle }],
  },
  {
    title: tNav('accountSection'),
    items: [
      { label: tNav('account'), href: '/account', icon: Settings },
      { label: tNav('pricing'), href: '/pricing', icon: CreditCard },
    ],
  },
  {
    title: tNav('whatsNew'),
    items: [
      {
        label: tNav('facebook'),
        href: 'https://facebook.com',
        icon: Sparkles,
        external: true,
      },
      {
        label: tNav('instagram'),
        href: 'https://instagram.com',
        icon: Sparkles,
        external: true,
      },
    ],
  },
]

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

export const Sidebar = ({ organizations, activeOrganizationId }: SidebarProps) => {
  const pathname = usePathname()
  const t = useTranslations()
  const tNav = useTranslations('nav')
  const activeOrganization =
    organizations.find((organization) => organization.id === activeOrganizationId) ?? organizations.at(0)
  const navigation = getNavigation(tNav)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:flex xl:w-80">
      <div className="flex h-full flex-col overflow-y-auto px-6 py-8">
        <div className="mb-8 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
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
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              aria-label={t('common.selectOrganization') || 'Select organization'}
            >
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-slate-400">{tNav('organization')}</span>
                <span className="mt-1 text-sm font-semibold text-slate-900">{activeOrganization.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        <nav aria-label="Главная навигация" className="flex-1 space-y-8">
          {navigation.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {section.title && (
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)

                  const className = cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )

                  const content = (
                    <>
                      <Icon className="h-5 w-5 text-slate-400 group-hover:text-primary-600" />
                      <span className="flex-1">{item.label}</span>
                    </>
                  )

                  if (item.external) {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {content}
                        </a>
                      </li>
                    )
                  }

                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={className}>
                        {content}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}


