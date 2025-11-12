'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useTenant } from '@/components/providers/TenantProvider'
import { cn } from '@/lib/utils'
import { MANAGE_NAV_SECTIONS } from '@/lib/config/manage-navigation'

export function ManageSidebar() {
  const pathname = usePathname()
  const { tenantId, organizationName } = useTenant()
  const tNavigation = useTranslations('manage.navigation')
  const tLayout = useTranslations('manage.layout')

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:bg-white lg:dark:bg-gray-950">
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {organizationName ?? tLayout('organizationFallback')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenantId}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          {MANAGE_NAV_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {tNavigation(section.titleKey)}
              </p>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const href = item.href(tenantId)
                  const isActive = item.exact ? pathname === href : pathname?.startsWith(href)

                  return (
                    <li key={item.labelKey}>
                      <Link
                        href={href}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                          isActive
                            ? 'bg-primary/10 text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900',
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{tNavigation(item.labelKey)}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}
