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

interface SubscriptionStatus {
  isValid: boolean
  status: string
  daysLeft: number
  expiryDate: string | null
  planName: string
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

  // Fetch subscription status
  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ['subscription-status', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/subscription/status`)
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }
      return response.json()
    },
    enabled: !!tenantId && isOpen,
    refetchInterval: 60000, // Refresh every minute
  })

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
          ) : (
            <div className="divide-y divide-gray-100">
              {/* License expiration notification (priority) */}
              {subscriptionStatus && !subscriptionStatus.isValid && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-semibold text-red-800">
                        Лицензия истекла: ответы ИИ отключены
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        Ответы ИИ отключены, так как срок действия вашей лицензии истек.
                      </p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            window.location.href = `/manage/${tenantId}/pricing`
                          }}
                        >
                          Продлить лицензию
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* License expiring soon warning (7 days or less) */}
              {subscriptionStatus &&
                subscriptionStatus.isValid &&
                subscriptionStatus.daysLeft <= 7 &&
                subscriptionStatus.daysLeft > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-semibold text-yellow-800">
                          Лицензия скоро истечет
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          У вас осталось {subscriptionStatus.daysLeft} {subscriptionStatus.daysLeft === 1 ? 'день' : 'дней'} до истечения подписки.
                        </p>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                            onClick={() => {
                              window.location.href = `/manage/${tenantId}/pricing`
                            }}
                          >
                            Продлить сейчас
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Regular notifications */}
              {!data?.notifications || data.notifications.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <Bell className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    {filter === 'unread'
                      ? 'Нет непрочитанных уведомлений'
                      : 'Нет уведомлений'}
                  </p>
                </div>
              ) : (
                data.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
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
