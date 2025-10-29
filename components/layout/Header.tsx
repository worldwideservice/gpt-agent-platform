'use client'

import { useState } from 'react'
import { Bell, Calendar, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'

import { SignOutButton } from '@/components/auth/SignOutButton'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

type Notification = {
  id: string
  title: string
  description: string
  timestamp: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    description: 'Ответы ИИ отключены, вы достигли месячного лимита в 15000 ответов.',
    timestamp: '21 минуту назад',
  },
  {
    id: '2',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    description: 'Ответы ИИ отключены, вы достигли месячного лимита в 15000 ответов.',
    timestamp: '46 минут назад',
  },
  {
    id: '3',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    description: 'Ответы ИИ отключены, вы достигли месячного лимита в 15000 ответов.',
    timestamp: '1 час назад',
  },
]

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
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())

  const userName = user.name ?? 'Пользователь'
  const userEmail = user.email ?? '—'
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev)
    setUserMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev)
    setNotificationsOpen(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form className="relative w-full md:max-w-md" action="/search" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            placeholder="Поиск"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            autoComplete="off"
          />
        </form>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 sm:flex">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{today}</span>
          </div>

          <button
            type="button"
            onClick={handleThemeToggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-600"
            aria-label="Сменить тему"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-600"
              aria-label="Уведомления"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {mockNotifications.length}
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Уведомления</h3>
                  <button type="button" className="text-xs font-medium text-primary-600 hover:underline">
                    Отметить как прочитанное
                  </button>
                </div>
                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className="rounded-xl border border-slate-100 p-3">
                      <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{notification.description}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                        {notification.timestamp}
                      </p>
                      <button type="button" className="mt-3 inline-flex items-center text-xs font-semibold text-primary-600">
                        Обновить план
                      </button>
                    </div>
                  ))}
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
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => undefined}
                  >
                    <Sun className="h-4 w-4" /> Светлая тема
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => undefined}
                  >
                    <Moon className="h-4 w-4" /> Тёмная тема
                  </button>
                  <div className="border-t border-slate-100" />
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
