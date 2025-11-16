'use client'

import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Bell,
  UserPlus,
  RefreshCw,
  MessageCircle,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    action_url?: string | null
    is_read: boolean
    created_at: string
  }
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Компонент для отображения одного уведомления
 * Следует дизайну KWID с иконками в зависимости от типа
 */
export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  // Выбираем иконку в зависимости от типа уведомления
  const Icon = useMemo(() => {
    switch (notification.type) {
      case 'lead_new':
        return Bell
      case 'lead_assigned':
        return UserPlus
      case 'lead_status_changed':
        return RefreshCw
      case 'message_new':
        return MessageCircle
      case 'system_alert':
        return AlertTriangle
      case 'integration_error':
        return AlertCircle
      default:
        return Bell
    }
  }, [notification.type])

  // Цвет иконки в зависимости от типа
  const iconColor = useMemo(() => {
    switch (notification.type) {
      case 'lead_new':
        return 'text-blue-500'
      case 'lead_assigned':
        return 'text-green-500'
      case 'lead_status_changed':
        return 'text-purple-500'
      case 'message_new':
        return 'text-indigo-500'
      case 'system_alert':
        return 'text-yellow-500'
      case 'integration_error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }, [notification.type])

  // Форматируем время создания
  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(notification.created_at), {
      addSuffix: true,
      locale: ru,
    })
  }, [notification.created_at])

  // Обработчик клика на уведомление
  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id)
    }
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  // Обработчик удаления
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(notification.id)
  }

  return (
    <div
      className={cn(
        'group relative flex gap-3 p-4 transition-colors hover:bg-gray-50',
        !notification.is_read && 'bg-blue-50/50',
        notification.action_url && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {/* Индикатор непрочитанного */}
      {!notification.is_read && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
      )}

      {/* Иконка */}
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
          notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
        )}
      >
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>

      {/* Контент */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              notification.is_read ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'
            )}
          >
            {notification.title}
          </p>

          {/* Кнопка удаления */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleDelete}
            aria-label="Удалить уведомление"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        <p className="text-sm text-gray-600">{notification.message}</p>

        <p className="text-xs text-gray-400">{timeAgo}</p>
      </div>
    </div>
  )
}
