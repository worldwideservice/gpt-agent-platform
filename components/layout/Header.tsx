'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell, Calendar, Search, X } from 'lucide-react'
import Link from 'next/link'

import { KwidButton, KwidInput } from '@/components/kwid'
import { formatTimestamp } from '@/lib/repositories/notifications'

import type { Notification } from '@/lib/repositories/notifications'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  subscriptionRenewsAt?: string | null
  tenantId?: string
}

const formatInitials = (value?: string | null): string => {
  if (!value) {
    return '??'
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return '??'
  }

  const [first, second] = trimmed.split(' ')

  if (second) {
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
  }

  return trimmed.slice(0, 2).toUpperCase()
}

export const Header = ({ user, subscriptionRenewsAt, tenantId }: HeaderProps) => {
  const today = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date())

  const userName = user.name ?? 'Пользователь'
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoadingNotifications(true)
      const response = await fetch('/api/notifications?limit=20')

      if (response.ok) {
        const payload = (await response.json()) as {
          success: boolean
          data: Notification[]
          unreadCount: number
        }

        if (payload.success) {
          setNotifications(payload.data)
          setUnreadCount(payload.unreadCount)
        }
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev)
  }

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch('/api/notifications/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_all_read' }),
      })

      if (response.ok) {
        await fetchNotifications()
      }
    } catch (error) {
      // Silent error handling
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Вы уверены, что хотите удалить все уведомления?')) {
      return
    }

    try {
      const response = await fetch('/api/notifications/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete_all' }),
      })

      if (response.ok) {
        await fetchNotifications()
      }
    } catch (error) {
      // Silent error handling
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchNotifications()
      }
    } catch (error) {
      // Silent error handling
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        await fetchNotifications()
      }
    } catch (error) {
      // Silent error handling
    }
  }

  return (
    <header className="fi-topbar sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 lg:px-6">
      <div className="flex items-center gap-4">
        <form className="fi-global-search relative ml-0 flex-1" action="/search" role="search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
            <KwidInput
              type="search"
              name="q"
              placeholder="Поиск"
              className="w-full pl-10"
              autoComplete="off"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3">
          {subscriptionRenewsAt && (
            <Link 
              href={tenantId ? `/manage/${tenantId}/pricing` : '/pricing'}
              className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:flex"
            >
              <Calendar className="h-4 w-4 text-slate-400 dark:text-gray-500" />
              <span>{new Date(subscriptionRenewsAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
            </Link>
          )}
          {!subscriptionRenewsAt && (
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300 sm:flex">
              <Calendar className="h-4 w-4 text-slate-400 dark:text-gray-500" />
              <span>{today}</span>
            </div>
          )}

          <div className="relative">
            <KwidButton
              type="button"
              variant="outline"
              size="sm"
              className="fi-topbar-database-notifications-btn relative h-10 w-10 rounded-full"
              aria-label="Уведомления"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </KwidButton>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Уведомления <span className="text-slate-500 dark:text-gray-400">({notifications.length})</span>
                  </h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <KwidButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="text-xs"
                      >
                        Отметить как прочитанное
                      </KwidButton>
                    )}
                    {notifications.length > 0 && (
                      <KwidButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteAll}
                        className="text-xs"
                      >
                        Удалить
                      </KwidButton>
                    )}
                  </div>
                </div>
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {isLoadingNotifications ? (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">Загрузка...</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">Нет уведомлений</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative rounded-xl border p-3 dark:border-gray-800 ${
                          notification.isRead 
                            ? 'border-slate-100 bg-slate-50 dark:bg-gray-800' 
                            : 'border-slate-200 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <KwidButton
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
                          aria-label="Закрыть уведомление"
                        >
                          <X className="h-4 w-4" />
                        </KwidButton>
                        <p className="pr-6 text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                        {notification.message && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">{notification.message}</p>
                        )}
                        <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400 dark:text-gray-500">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                        {notification.linkUrl && notification.linkText && (
                          <Link
                            href={notification.linkUrl}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                            className="mt-3 inline-flex items-center text-xs font-semibold text-custom-600 hover:underline dark:text-custom-400"
                          >
                            {notification.linkText}
                          </Link>
                        )}
                        {!notification.isRead && !notification.linkUrl && (
                          <KwidButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="mt-2 text-xs"
                          >
                            Отметить как прочитанное
                          </KwidButton>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-full"
            aria-label="Меню пользователя"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold uppercase text-primary-700">
              {formatInitials(userName)}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
