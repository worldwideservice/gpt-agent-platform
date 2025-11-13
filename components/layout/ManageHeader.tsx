'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { useTenant } from '@/components/providers/TenantProvider'
import { GlobalSearch } from './GlobalSearch'
import { LicenseAlert } from './LicenseAlert'
import { NotificationsButton } from './NotificationsButton'
import { NotificationsPanel } from './NotificationsPanel'
import { UserMenu } from './UserMenu'

export function ManageHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { tenantId } = useTenant()
  const { data: session } = useSession()

  // TODO: Get actual license expiry date from API/database
  const licenseExpiryDate = new Date('2025-10-30')

  // TODO: Get actual notifications from API
  const mockNotifications = [
    {
      id: '1',
      title: 'Лицензия истекла: ответы ИИ отключены',
      description: `Для "World Wide Services" ответы ИИ отключены, так как срок действия вашей лицензии истек.`,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      actionLabel: 'Продлить лицензию',
      actionHref: `/manage/${tenantId}/pricing`,
    },
  ]

  const notificationsCount = mockNotifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    // TODO: Implement mark all as read API call
    console.log('Mark all as read')
  }

  const handleDeleteAll = () => {
    // TODO: Implement delete all notifications API call
    console.log('Delete all notifications')
  }

  const handleDeleteOne = (id: string) => {
    // TODO: Implement delete single notification API call
    console.log('Delete notification:', id)
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex flex-1 items-center gap-4">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-2">
          <LicenseAlert expiryDate={licenseExpiryDate} tenantId={tenantId} />
          <NotificationsButton
            count={notificationsCount}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            isActive={notificationsOpen}
          />
          <UserMenu
            userName={session?.user?.name || 'Admin'}
            userEmail={session?.user?.email || undefined}
            userImage={session?.user?.image || undefined}
          />
        </div>
      </header>

      <NotificationsPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        notifications={mockNotifications}
        onMarkAllRead={handleMarkAllRead}
        onDeleteAll={handleDeleteAll}
        onDeleteOne={handleDeleteOne}
      />
    </>
  )
}
