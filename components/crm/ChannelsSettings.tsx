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
          Обновить из CRM
        </Button>
      </div>

      <p className="mb-6 text-sm text-slate-500">Выберите каналы, где агент может отвечать клиентам.</p>

      <div className="mb-6">
        <Toggle
          checked={allChannelsEnabled}
          onChange={onAllChannelsToggle}
          label="Использовать все каналы"
          description="Если отключить — выберите конкретные каналы ниже"
          disabled={disabled}
        />
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

