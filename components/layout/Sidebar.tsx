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

 // Упрощенная навигация - только дашборд (главная страница)
 return [
 {
 items: [
 {
 label: 'Главная',
 href: tenantId ? basePath : '/',
 icon: LayoutDashboard,
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
 <Link href={basePath} className="text-xl font-bold">
 GPT Agent
 </Link>
 </header>

 <nav className="flex-1 overflow-y-auto p-4">
 <ul className="space-y-1">
 {navigation.map((section) =>
 section.items.map((item) => {
 const Icon = item.icon
 const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href) ?? false

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
 <Icon className="h-5 w-5" />
 {item.label}
 </Link>
 </li>
 )
 })
 )}
 </ul>
 </nav>
 </div>
 </aside>
 </>
 )
}
