'use client'

import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { NotificationItem } from './NotificationItem'
import { cn } from '@/lib/utils'
import { useTenant } from '@/components/providers/TenantProvider'
import { logger } from '@/lib/utils/logger'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  action_url?: string | null
  is_read: boolean
  created_at: string
}

interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  unreadCount: number
}

/**
 * Клиентский компонент панели уведомлений
 * Использует React Query для управления состоянием
 */
export function NotificationsPanelClient() {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Fetch notifications
  const { data, isLoading, error } = useQuery<NotificationsResponse>({
    queryKey: ['notifications', tenantId, filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter === 'unread') {
        params.append('isRead', 'false')
      }
      params.append('limit', '50')

      const response = await fetch(
        `/api/manage/${tenantId}/notifications?${params.toString()}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch notifications')
      }

      return response.json()
    },
    enabled: !!tenantId && isOpen,
    refetchInterval: 30000, // Refresh every 30 seconds when panel is open
  })

  // Mutation: Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/manage/${tenantId}/notifications/${notificationId}`,
        {
          method: 'PUT',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark notification as read')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to mark notification as read:', error)
    },
  })

  // Mutation: Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/manage/${tenantId}/notifications/read-all`,
        {
          method: 'PUT',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark all as read')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to mark all notifications as read:', error)
    },
  })

  // Mutation: Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/manage/${tenantId}/notifications/${notificationId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete notification')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
    onError: (error) => {
      logger.error('Failed to delete notification:', error)
    },
  })

  // Handlers
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate(notificationId)
    },
    [markAsReadMutation]
  )

  const handleDelete = useCallback(
    (notificationId: string) => {
      deleteNotificationMutation.mutate(notificationId)
    },
    [deleteNotificationMutation]
  )

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate()
  }, [markAllAsReadMutation])

  // Get unread count for badge
  const unreadCount = data?.unreadCount ?? 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-lg font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="h-8 text-xs"
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="mr-1 h-3 w-3" />
              )}
              Прочитать все
            </Button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-gray-200 px-4">
          <button
            className={cn(
              'flex-1 border-b-2 pb-2 text-sm font-medium transition-colors',
              filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={cn(
              'flex-1 border-b-2 pb-2 text-sm font-medium transition-colors',
              filter === 'unread'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setFilter('unread')}
          >
            Непрочитанные {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Notifications list */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
              <p className="text-sm text-red-600">
                Ошибка загрузки уведомлений
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ['notifications', tenantId],
                  })
                }
              >
                Повторить
              </Button>
            </div>
          ) : !data?.notifications || data.notifications.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
              <Bell className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                {filter === 'unread'
                  ? 'Нет непрочитанных уведомлений'
                  : 'Нет уведомлений'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {data && data.notifications && data.notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2 text-center">
              <p className="text-xs text-gray-500">
                Показано {data.notifications.length} из {data.pagination.total}
              </p>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
