'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Bell, Search, X, Moon, Sun, Monitor, LogOut, User } from 'lucide-react'

import { KwidButton, KwidInput } from '@/components/kwid'
import { formatTimestamp } from '@/lib/repositories/notifications'
import { useTheme } from '@/contexts/ThemeContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Notification } from '@/lib/repositories/notifications'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
  subscriptionRenewsAt?: string | null
  tenantId?: string
  onSidebarToggle?: () => void
}


export const Header = ({ user, subscriptionRenewsAt, tenantId, onSidebarToggle }: HeaderProps) => {
  const today = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date()).replace(/\//g, '.')

  const userName = user.name ?? 'Пользователь'
  const { theme, setTheme } = useTheme()
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

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/login' })
  }

  const getInitials = (name: string): string => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className="flex h-16 items-center gap-x-4 bg-white px-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 md:px-6 lg:px-8">
      <button
        type="button"
        onClick={onSidebarToggle}
        className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-1.5 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:text-gray-500 dark:hover:text-gray-400"
        title="Раскрыть боковую панель"
        aria-label="Раскрыть боковую панель"
        style={{
          '--c-300': 'var(--gray-300)',
          '--c-400': 'var(--gray-400)',
          '--c-500': 'var(--gray-500)',
          '--c-600': 'var(--gray-600)',
        } as React.CSSProperties}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <span className="sr-only">Раскрыть боковую панель</span>
      </button>

      <form className="relative flex-1" action="/search" role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <KwidInput
            type="search"
            name="q"
            placeholder="Глобальный поиск"
            className="w-full pl-10"
            autoComplete="off"
          />
        </div>
      </form>

      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{today}</div>

      <div className="relative">
        <button
          type="button"
          onClick={toggleNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Открыть уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {notificationsOpen && (
          <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
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

      <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Открыть меню пользователя"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white">
              {getInitials(userName)}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="fi-dropdown-header flex w-full gap-2 p-3 text-sm fi-dropdown-header-color-gray fi-color-gray">
            {userName}
          </div>
          <DropdownMenuSeparator />
          <div className="fi-theme-switcher grid grid-flow-col gap-x-1 p-2">
            <button
              type="button"
              onClick={() => {
                setTheme('light')
                setUserMenuOpen(false)
              }}
              aria-label="Включить светлый режим"
              className={`fi-theme-switcher-btn flex justify-center rounded-md p-2 outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 ${
                theme === 'light'
                  ? 'fi-active bg-gray-50 text-primary-500 dark:bg-white/5 dark:text-primary-400'
                  : 'text-gray-400 hover:text-gray-500 focus-visible:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`}
            >
              <Sun className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark')
                setUserMenuOpen(false)
              }}
              aria-label="Включить темный режим"
              className={`fi-theme-switcher-btn flex justify-center rounded-md p-2 outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 ${
                theme === 'dark'
                  ? 'fi-active bg-gray-50 text-primary-500 dark:bg-white/5 dark:text-primary-400'
                  : 'text-gray-400 hover:text-gray-500 focus-visible:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`}
            >
              <Moon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('system')
                setUserMenuOpen(false)
              }}
              aria-label="Включить системный режим"
              className={`fi-theme-switcher-btn flex justify-center rounded-md p-2 outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 ${
                theme === 'system'
                  ? 'fi-active bg-gray-50 text-primary-500 dark:bg-white/5 dark:text-primary-400'
                  : 'text-gray-400 hover:text-gray-500 focus-visible:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`}
            >
              <Monitor className="h-5 w-5" />
            </button>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="fi-dropdown-list-item flex w-full items-center gap-2 whitespace-nowrap rounded-md p-2 text-sm transition-colors duration-75 outline-none disabled:pointer-events-none disabled:opacity-70 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            <span className="fi-dropdown-list-item-label flex-1 truncate text-start text-gray-700 dark:text-gray-200">
              Выйти
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
