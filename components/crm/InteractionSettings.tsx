'use client'

import { MessageSquare } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface InteractionSettingsProps {
  checkBeforeSending: boolean
  onCheckBeforeSendingToggle: (enabled: boolean) => void
}

export const InteractionSettings = ({
  checkBeforeSending,
  onCheckBeforeSendingToggle
}: InteractionSettingsProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
      <div className="mb-4 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Взаимодействие</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-700">Проверять перед отправкой</p>
          <p className="text-sm text-gray-500">
            Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки.
          </p>
        </div>
        <Switch
          checked={checkBeforeSending}
          onCheckedChange={onCheckBeforeSendingToggle}
        />
      </div>
    </div>
  )
}
