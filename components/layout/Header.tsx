'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell, Calendar, LogOut, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'

import { SignOutButton } from '@/components/auth/SignOutButton'
import { formatTimestamp } from '@/lib/repositories/notifications'

import type { Notification } from '@/lib/repositories/notifications'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
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

export const Header = ({ user }: HeaderProps) => {
  const today = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date())

  const userName = user.name ?? 'Пользователь'
  const userEmail = user.email ?? '—'
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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
      console.error('Failed to fetch notifications', error)
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
    setUserMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev)
    setNotificationsOpen(false)
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
      console.error('Failed to mark all as read', error)
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
      console.error('Failed to delete all notifications', error)
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
      console.error('Failed to delete notification', error)
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
      console.error('Failed to mark as read', error)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-4">
        {/* Лого слева как в KWID */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-semibold text-white">WW</div>
            <div>
              <p className="text-base font-semibold text-slate-900">GPT Агент</p>
              <p className="-mt-0.5 text-[11px] leading-none text-slate-500">Trainable virtual employee</p>
            </div>
          </Link>
        </div>

        {/* Поиск по центру */}
        <form className="relative ml-0 flex-1" action="/search" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            placeholder="Поиск"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            autoComplete="off"
          />
        </form>

        {/* Правая часть: дата, уведомления, пользователь */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 sm:flex">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{today}</span>
          </div>

          <div className="relative">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-600"
              aria-label="Уведомления"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              {(unreadCount > 0 || process.env.NODE_ENV === 'development') && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {(process.env.NODE_ENV === 'development' ? 137 : unreadCount) > 99
                    ? '99+'
                    : process.env.NODE_ENV === 'development'
                      ? 137
                      : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Уведомления <span className="text-slate-500">({notifications.length})</span>
                  </h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-primary-600 hover:underline"
                      >
                        Отметить как прочитанное
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDeleteAll}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {isLoadingNotifications ? (
                    <div className="py-8 text-center text-sm text-slate-500">Загрузка...</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">Нет уведомлений</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative rounded-xl border p-3 ${
                          notification.isRead ? 'border-slate-100 bg-slate-50' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="absolute right-2 top-2 text-slate-400 transition-colors hover:text-slate-600"
                          aria-label="Закрыть уведомление"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="pr-6 text-sm font-semibold text-slate-900">{notification.title}</p>
                        {notification.message && (
                          <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                        )}
                        <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                        {notification.linkUrl && notification.linkText && (
                          <Link
                            href={notification.linkUrl}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                            className="mt-3 inline-flex items-center text-xs font-semibold text-primary-600 hover:underline"
                          >
                            {notification.linkText}
                          </Link>
                        )}
                        {!notification.isRead && !notification.linkUrl && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="mt-2 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Отметить как прочитанное
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold uppercase text-primary-700">
              {formatInitials(userName)}
            </div>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-600"
                aria-label="Меню пользователя"
                onClick={toggleUserMenu}
              >
                <Menu className="h-5 w-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    onClick={() => undefined}
                  >
                    <LogOut className="h-4 w-4" /> Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
