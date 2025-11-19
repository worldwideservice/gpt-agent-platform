'use client'

import { useSession } from 'next-auth/react'

import { useTenant } from '@/components/providers/TenantProvider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { GlobalSearch } from './GlobalSearch'
import { LicenseAlert } from './LicenseAlert'
import { NotificationsPanelClient } from '@/components/features/notifications/NotificationsPanelClient'
import { UserMenu } from './UserMenu'

export function ManageHeader() {
  const { tenantId } = useTenant()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="h-6" />
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <LicenseAlert tenantId={tenantId} />
        <NotificationsPanelClient />
        <UserMenu
          userName={session?.user?.name || 'Admin'}
          userEmail={session?.user?.email || undefined}
          userImage={session?.user?.image || undefined}
        />
      </div>
    </header>
  )
}
