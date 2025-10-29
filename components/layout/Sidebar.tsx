'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  Facebook,
  Instagram,
  Plug
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    items: [
      { label: 'Инфопанель', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Агенты',
    items: [
      { label: 'Агенты ИИ', href: '/agents', icon: Bot },
      { label: 'Тестовый чат', href: '/chat', icon: MessageSquare },
    ],
  },
  {
    title: 'Контент',
    items: [
      { label: 'База знаний', href: '/knowledge-base', icon: BookOpen },
      { label: 'Интеграции', href: '/integrations', icon: Plug },
    ],
  },
  {
    title: 'Настройки',
    items: [
      { label: 'Аккаунт', href: '/account', icon: Settings },
      { label: 'Поддержка', href: '/support', icon: HelpCircle },
    ],
  },
  {
    title: 'Что нового',
    items: [
      { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
      { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    ],
  },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">GPT</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">GPT Agent</h1>
            <p className="text-xs text-gray-500">Trainable virtual employee</p>
          </div>
        </div>

        <nav className="space-y-6">
          {navigation.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isExternal = item.href.startsWith('http')
                  const isDashboard = item.href === '/'
                  const isActive = isDashboard ? pathname === '/' : pathname.startsWith(item.href)

                  const content = (
                    <>
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )

                  const className = cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  )

                  if (isExternal) {
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

