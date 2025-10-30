'use client'

import { MessageSquare, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'

interface ChannelItem {
  id: string
  name: string
  type: string
  isActive: boolean
}

interface ChannelsSettingsProps {
  channels: ChannelItem[]
  allChannelsEnabled: boolean
  onAllChannelsToggle: (enabled: boolean) => void
  onChannelToggle: (channelId: string, enabled: boolean) => void
  onSync: () => Promise<void>
  isSyncing?: boolean
  disabled?: boolean
}

export const ChannelsSettings = ({
  channels,
  allChannelsEnabled,
  onAllChannelsToggle,
  onChannelToggle,
  onSync,
  isSyncing = false,
  disabled = false,
}: ChannelsSettingsProps) => {
  const handleSync = async () => {
    if (disabled) {
      return
    }

    await onSync()
  }

  const hasChannels = channels.length > 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-900">Каналы</h2>
        </div>
        <Button
          onClick={handleSync}
          disabled={disabled || isSyncing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          Синхронизировать настройки CRM
        </Button>
      </div>

      <p className="mb-6 text-sm text-gray-600">
        Выберите каналы, в которых агент может отвечать
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Все каналы</label>
          <button
            onClick={() => onAllChannelsToggle(!allChannelsEnabled)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              allChannelsEnabled ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                allChannelsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {!allChannelsEnabled ? (
        hasChannels ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-600">Доступные каналы</h3>
            {channels.map((channel) => (
              <Toggle
                key={channel.id}
                checked={channel.isActive}
                onChange={(enabled) => onChannelToggle(channel.id, enabled)}
                label={channel.name}
                description={`Тип: ${channel.type}`}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Нет данных о каналах. Синхронизируйте интеграцию с CRM.
          </div>
        )
      ) : null}
    </div>
  )
}

