'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './SidebarToggle'

// Простые fallback переводы (так как next-intl временно отключен)
const getTranslation = (key: string, fallback?: string): string => {
 const translations: Record<string, string> = {
 'selectOrganization': 'Выбрать организацию',
 }
 
 // Поддержка вложенных ключей типа "nav.agents" или "common.selectOrganization"
 const parts = key.split('.')
 const simpleKey = parts[parts.length - 1]
 
 return translations[simpleKey] || translations[key] || fallback || key
}
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Folder,
  FileText,
  BarChart3,
  Webhook,
  Settings,
  CreditCard,
  HelpCircle,
  Facebook,
  Instagram,
  ChevronRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { LogoCompact } from '@/components/ui/Logo'

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

 // Полная навигация по KWID + дополнительные
 return [
 {
 items: [
 {
 label: 'Инфопанель',
 href: tenantId ? basePath : '/',
 icon: LayoutDashboard,
 },
 ],
 },
 {
 title: 'Агенты ИИ',
 items: [
 {
 label: 'Агенты ИИ',
 href: tenantId ? `${basePath}/ai-agents` : '/ai-agents',
 icon: Bot,
 },
 {
 label: 'Тестовый чат',
 href: tenantId ? `${basePath}/test-chat` : '/test-chat',
 icon: MessageSquare,
 },
 ],
 },
 {
 title: 'База знаний',
 items: [
 {
 label: 'Категории',
 href: tenantId ? `${basePath}/knowledge-categories` : '/knowledge-categories',
 icon: Folder,
 },
 {
 label: 'Статьи',
 href: tenantId ? `${basePath}/knowledge-items` : '/knowledge-items',
 icon: FileText,
 },
 ],
 },
 {
 items: [
 {
 label: 'Аналитика',
 href: tenantId ? `${basePath}/analytics` : '/analytics',
 icon: BarChart3,
 },
 {
 label: 'Webhooks',
 href: tenantId ? `${basePath}/webhooks` : '/webhooks',
 icon: Webhook,
 },
 ],
 },
 {
 title: 'Поддержка',
 items: [
 {
 label: 'Начало работы',
 href: '/docs/ru/start-here/getting-started/',
 icon: HelpCircle,
 external: true,
 },
 ],
 },
 {
 title: 'Аккаунт',
 items: [
 {
 label: 'Настройки аккаунта',
 href: tenantId ? `${basePath}/account-settings` : '/account-settings',
 icon: Settings,
 },
 {
 label: 'Тарифные планы',
 href: tenantId ? `${basePath}/pricing` : '/pricing',
 icon: CreditCard,
 },
 ],
 },
 {
 title: 'Что нового',
 items: [
 {
 label: 'Смотреть на Facebook',
 href: 'https://facebook.com',
 icon: Facebook,
 external: true,
 },
 {
 label: 'Смотреть в Instagram',
 href: 'https://instagram.com',
 icon: Instagram,
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
 const { close } = useSidebar()
 const navigation = getNavigation(() => {}, tenantId)

 const handleItemClick = () => {
 if (window.matchMedia('(max-width: 1024px)').matches) {
 close()
 }
 }

 const basePath = tenantId ? `/manage/${tenantId}` : '/'

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
 className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-white transition-transform duration-300 ${
 isOpen ? 'translate-x-0' : '-translate-x-full'
 } lg:translate-x-0 lg:flex`}
 >
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center border-b border-gray-200 px-4">
          <LogoCompact href={basePath} />
        </header>

 <nav className="flex-1 overflow-y-auto p-4">
 <ul className="space-y-6">
 {navigation.map((section, sectionIdx) => (
 <li key={sectionIdx}>
 {section.title && (
 <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
 {section.title}
 </h3>
 )}
 <ul className="space-y-1">
 {section.items.map((item) => {
 const Icon = item.icon
 const isActive =
 item.href === '/'
 ? pathname === '/'
 : pathname?.startsWith(item.href) ?? false

 const linkContent = (
 <>
 <Icon className="h-5 w-5" />
 <span>{item.label}</span>
 {item.external && (
 <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
 )}
 </>
 )

 if (item.external) {
 return (
 <li key={item.href}>
 <a
 href={item.href}
 target="_blank"
 rel="noopener noreferrer"
 onClick={handleItemClick}
 className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
 isActive
 ? 'bg-gray-100 text-gray-900'
 : 'text-gray-700 hover:bg-gray-50'
 }`}
 >
 {linkContent}
 </a>
 </li>
 )
 }

 return (
 <li key={item.href}>
 <Link
 href={item.href}
 onClick={handleItemClick}
 className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
 isActive
 ? 'bg-gray-100 text-gray-900'
 : 'text-gray-700 hover:bg-gray-50'
 }`}
 >
 {linkContent}
 </Link>
 </li>
 )
 })}
 </ul>
 </li>
 ))}
 </ul>
 </nav>
 </div>
 </aside>
 </>
 )
}
