'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useTenant } from '@/components/providers/TenantProvider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { GlobalSearch } from './GlobalSearch'
import { LicenseAlert } from './LicenseAlert'
import { NotificationsButton } from './NotificationsButton'
import { NotificationsPanel } from './NotificationsPanel'
import { UserMenu } from './UserMenu'
import { logger } from '@/lib/utils/logger'

export function ManageHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { tenantId } = useTenant()
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  // Fetch license info
  const { data: licenseData } = useQuery({
    queryKey: ['license', tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/organization/${tenantId}/license`)
      if (!res.ok) throw new Error('Failed to fetch license')
      return res.json()
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?orgId=${tenantId}`)
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json()
    },
    enabled: !!tenantId,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead', orgId: tenantId }),
      })
      if (!res.ok) throw new Error('Failed to mark all as read')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to mark all notifications as read', error as Error)
    },
  })

  // Delete all notifications mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/notifications?orgId=${tenantId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete all notifications')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to delete all notifications', error as Error)
    },
  })

  // Delete single notification mutation
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}?orgId=${tenantId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete notification')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to delete notification', error as Error)
    },
  })

  const license = licenseData?.license
  const licenseExpiryDate = license?.expiresAt ? new Date(license.expiresAt) : null

  const notifications = notificationsData?.notifications || []
  const notificationsCount = notificationsData?.unreadCount || 0

  // Map notifications to expected format
  const mappedNotifications = notifications.map((n: any) => ({
    id: n.id,
    title: n.title,
    description: n.message || '',
    timestamp: new Date(n.createdAt),
    read: n.isRead,
    actionLabel: n.linkText,
    actionHref: n.linkUrl,
  }))

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate()
  }

  const handleDeleteAll = () => {
    deleteAllMutation.mutate()
  }

  const handleDeleteOne = (id: string) => {
    deleteOneMutation.mutate(id)
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex flex-1 items-center gap-4">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="h-6" />
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
        notifications={mappedNotifications}
        onMarkAllRead={handleMarkAllRead}
        onDeleteAll={handleDeleteAll}
        onDeleteOne={handleDeleteOne}
      />
    </>
  )
}
