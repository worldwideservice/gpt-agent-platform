'use client'

interface InteractionSettingsProps {
  agentId?: string
  settings?: Record<string, unknown>
  onUpdate?: (settings: Record<string, unknown>) => void
}

export const InteractionSettings = ({ agentId, settings = {}, onUpdate }: InteractionSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Настройки взаимодействия</h3>
      <p className="text-sm text-slate-500 dark:text-gray-400">Настройки будут доступны в следующей версии</p>
    </div>
  )
}

