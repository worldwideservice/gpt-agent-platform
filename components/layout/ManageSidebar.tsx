'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useTenant } from '@/components/providers/TenantProvider'
import { cn } from '@/lib/utils'
import { MANAGE_NAV_SECTIONS } from '@/lib/config/manage-navigation'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { WorkspaceSelector } from './WorkspaceSelector'

export function ManageSidebar() {
  const pathname = usePathname()
  const { tenantId, organizationName } = useTenant()
  const tNavigation = useTranslations('manage.navigation')
  const tLayout = useTranslations('manage.layout')
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r bg-white dark:bg-gray-950">
      <SidebarHeader className="border-b p-4">
        {state === 'expanded' ? (
          <WorkspaceSelector />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-sm font-bold text-primary">
              {(organizationName ?? tLayout('organizationFallback')).charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {MANAGE_NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.titleKey}>
            <SidebarGroupLabel>{tNavigation(section.titleKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const href = item.href(tenantId)
                  const isActive = item.exact ? pathname === href : pathname?.startsWith(href)

                  return (
                    <SidebarMenuItem key={item.labelKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={tNavigation(item.labelKey)}
                        className={cn(
                          isActive
                            ? 'bg-primary/10 text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900'
                        )}
                      >
                        <Link
                          href={href}
                          target={item.isExternal ? '_blank' : undefined}
                          rel={item.isExternal ? 'noopener noreferrer' : undefined}
                        >
                          <item.icon />
                          <span>{tNavigation(item.labelKey)}</span>
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
  )
}
