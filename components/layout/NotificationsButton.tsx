'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface NotificationsButtonProps {
  count?: number
  onClick?: () => void
  isActive?: boolean
}

export function NotificationsButton({ count = 0, onClick, isActive = false }: NotificationsButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        'relative h-10 w-10 transition-colors',
        isActive && 'bg-accent'
      )}
      aria-label="Открыть уведомления"
      aria-pressed={isActive}
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span
          className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white"
          aria-label={`${count} непрочитанных уведомлений`}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Button>
  )
}
