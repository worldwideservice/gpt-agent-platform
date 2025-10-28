'use client'

import { MessageSquare } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'

interface InteractionSettingsProps {
  checkBeforeSending: boolean
  onCheckBeforeSendingToggle: (enabled: boolean) => void
}

export const InteractionSettings = ({
  checkBeforeSending,
  onCheckBeforeSendingToggle
}: InteractionSettingsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Взаимодействие</h2>
      </div>

      <Toggle
        checked={checkBeforeSending}
        onChange={onCheckBeforeSendingToggle}
        label="Проверять перед отправкой"
        description="Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки."
      />
    </div>
  )
}

