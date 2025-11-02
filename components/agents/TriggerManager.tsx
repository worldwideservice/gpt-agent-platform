'use client'

interface TriggerManagerProps {
  agentId?: string
  triggers?: Array<{ id: string; name: string; type: string }>
  onUpdate?: (triggers: Array<{ id: string; name: string; type: string }>) => void
}

export const TriggerManager = ({ agentId, triggers = [], onUpdate }: TriggerManagerProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Триггеры агента</h3>
      {triggers.length > 0 ? (
        <ul className="space-y-2">
          {triggers.map((trigger) => (
            <li key={trigger.id} className="text-sm text-slate-600 dark:text-gray-300">
              {trigger.name} ({trigger.type})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 dark:text-gray-500">Триггеры не настроены</p>
      )}
    </div>
  )
}

