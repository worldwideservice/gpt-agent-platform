'use client'

interface ChannelsSettingsProps {
  agentId?: string
  channels?: Array<{ id: string; name: string; enabled: boolean }>
  onUpdate?: (channels: Array<{ id: string; name: string; enabled: boolean }>) => void
}

export const ChannelsSettings = ({ agentId, channels = [], onUpdate }: ChannelsSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Настройки каналов</h3>
      {channels.length > 0 ? (
        <ul className="space-y-2">
          {channels.map((channel) => (
            <li key={channel.id} className="text-sm text-slate-600 dark:text-gray-300">
              {channel.name} - {channel.enabled ? 'Включен' : 'Выключен'}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 dark:text-gray-500">Каналы не настроены</p>
      )}
    </div>
  )
}

