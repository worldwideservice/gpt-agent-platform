'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
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
  LogOut,
  ChevronRight,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LogoCompact } from '@/components/ui/Logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ManageLayoutProps {
  session: {
    user: {
      id: string
      name?: string | null
      email?: string | null
      orgId: string
    }
  }
  organizations: Array<{
    id: string
    name: string
    slug: string
  }>
  activeOrganization: {
    id: string
    name: string
    slug: string
  } | null
  tenantId?: string
  children: React.ReactNode
}

const getInitials = (name: string): string => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export const ManageLayout = ({
  session,
  organizations,
  activeOrganization,
  tenantId,
  children,
}: ManageLayoutProps) => {
  const pathname = usePathname()
  const basePath = tenantId ? `/manage/${tenantId}` : '/'
  const userName = session.user.name ?? 'Пользователь'

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/login' })
  }

  const navigation = [
    {
      title: '',
      items: [
        {
          label: 'Инфопанель',
          href: basePath,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Агенты ИИ',
      items: [
        {
          label: 'Агенты ИИ',
          href: `${basePath}/ai-agents`,
          icon: Bot,
        },
        {
          label: 'Тестовый чат',
          href: `${basePath}/test-chat`,
          icon: MessageSquare,
        },
      ],
    },
    {
      title: 'База знаний',
      items: [
        {
          label: 'Категории',
          href: `${basePath}/knowledge-categories`,
          icon: Folder,
        },
        {
          label: 'Статьи',
          href: `${basePath}/knowledge-items`,
          icon: FileText,
        },
      ],
    },
    {
      title: '',
      items: [
        {
          label: 'Аналитика',
          href: `${basePath}/analytics`,
          icon: BarChart3,
        },
        {
          label: 'Webhooks',
          href: `${basePath}/webhooks`,
          icon: Webhook,
        },
      ],
    },
    {
      title: 'Аккаунт',
      items: [
        {
          label: 'Настройки аккаунта',
          href: `${basePath}/account-settings`,
          icon: Settings,
        },
        {
          label: 'Тарифные планы',
          href: `${basePath}/pricing`,
          icon: CreditCard,
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarHeader>
          <LogoCompact href={basePath} />
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((section, sectionIdx) => (
            <SidebarGroup key={sectionIdx}>
              {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      item.href === basePath
                        ? pathname === basePath
                        : pathname?.startsWith(item.href) ?? false

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white text-sm font-semibold"
                >
                  {getInitials(userName)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 text-sm font-medium">{userName}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </div>
  )
}

