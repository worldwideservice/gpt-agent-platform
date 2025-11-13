'use client'

import { X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from '@/components/ui'

interface Notification {
  id: string
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionLabel?: string
  actionHref?: string
}

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: Notification[]
  onMarkAllRead?: () => void
  onDeleteAll?: () => void
  onDeleteOne?: (id: string) => void
}

export function NotificationsPanel({
  open,
  onOpenChange,
  notifications,
  onMarkAllRead,
  onDeleteAll,
  onDeleteOne,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              Уведомления
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
          </div>

          <div className="flex items-center gap-4 pt-2 text-sm">
            {onMarkAllRead && unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="font-medium text-primary hover:underline"
              >
                Отметить как прочитанное
              </button>
            )}
            {onDeleteAll && notifications.length > 0 && (
              <button
                onClick={onDeleteAll}
                className="font-medium text-rose-500 hover:underline"
              >
                Удалить
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500">
              Нет уведомлений
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="relative rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">
                    {notification.title}
                  </h3>
                  {onDeleteOne && (
                    <button
                      onClick={() => onDeleteOne(notification.id)}
                      className="flex-shrink-0 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Удалить уведомление"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>

                <p className="mb-1 text-xs text-gray-500">
                  {formatTimestamp(notification.timestamp)}
                </p>

                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {notification.description}
                </p>

                {notification.actionLabel && notification.actionHref && (
                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    <a href={notification.actionHref}>
                      {notification.actionLabel}
                    </a>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
