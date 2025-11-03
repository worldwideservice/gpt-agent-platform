'use client'

import { MessageSquare, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui'
import { Switch } from '@/components/ui/switch'

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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Каналы</h2>
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
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-gray-700">Все каналы</p>
          </div>
          <Switch
            checked={allChannelsEnabled}
            onCheckedChange={(checked) => onAllChannelsToggle(checked)}
            disabled={disabled}
          />
        </div>
      </div>

      {!allChannelsEnabled ? (
        hasChannels ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600">Отдельные каналы</h3>
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-700">{channel.name}</p>
                  <p className="text-sm text-gray-500">{channel.type}</p>
                </div>
                <Switch
                  checked={channel.isActive}
                  onCheckedChange={(enabled) => onChannelToggle(channel.id, enabled)}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            Нет данных о каналах. Синхронизируйте интеграцию с CRM.
          </div>
        )
      ) : null}
    </div>
  )
}
