'use client'

import { useState } from 'react'
import { MessageSquare, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'

import type { UniversalChannel } from '@/types/crm'

interface ChannelsSettingsProps {
  channels: UniversalChannel[]
  allChannelsEnabled: boolean
  onAllChannelsToggle: (enabled: boolean) => void
  onChannelToggle: (channelId: string, enabled: boolean) => void
  onSync: () => Promise<void>
}

export const ChannelsSettings = ({ 
  channels, 
  allChannelsEnabled, 
  onAllChannelsToggle, 
  onChannelToggle,
  onSync 
}: ChannelsSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSync = async () => {
    setIsLoading(true)
    try {
      await onSync()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Каналы</h2>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Синхронизировать настройки CRM
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Выберите каналы, в которых агент может отвечать
      </p>

      {/* All Channels Toggle */}
      <div className="mb-6">
        <Toggle
          checked={allChannelsEnabled}
          onChange={onAllChannelsToggle}
          label="Все каналы"
          description="Агент будет работать во всех доступных каналах"
        />
      </div>

      {/* Individual Channels */}
      {!allChannelsEnabled && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Выберите каналы:</h3>
          {channels.map((channel) => (
            <Toggle
              key={channel.id}
              checked={channel.isActive}
              onChange={(enabled) => onChannelToggle(channel.id, enabled)}
              label={channel.name}
              description={`${channel.type} канал`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

