"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SearchIcon, BellIcon, LayersIcon, XIcon, BellOffIcon } from "@/components/icons"

export function HeaderV0() {
  const params = useParams()
  const tenantId = params?.tenantId as string
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  return (
    <>
      <header className="flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="text-xl font-semibold text-gray-900">GPT Агент</div>

        <div className="flex items-center gap-4">
          <div className="relative w-[280px]">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Поиск" className="pl-9 bg-gray-50 border-gray-200 text-sm" />
          </div>

          <Button variant="destructive" className="gap-2 bg-red-500 hover:bg-red-600 text-white" size="sm">
            <LayersIcon className="h-4 w-4" />
            30.10.2025
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <BellIcon className="h-5 w-5 text-gray-600" />
            </Button>
            {notificationCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full bg-red-600 px-1.5 text-[10px] border-0 hover:bg-red-600">
                {notificationCount}
              </Badge>
            )}
          </div>

          <Avatar className="h-8 w-8 bg-gray-900">
            <AvatarFallback className="bg-gray-900 text-white text-sm font-medium">А</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {showNotifications && (
        <div className="fixed right-0 top-0 z-50 h-full w-96 border-l border-gray-200 bg-white shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Уведомления</h3>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <BellOffIcon className="mb-4 h-12 w-12 text-gray-300" />
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Нет уведомлений</h4>
              <p className="text-sm text-gray-500">Пожалуйста, проверьте позже</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

