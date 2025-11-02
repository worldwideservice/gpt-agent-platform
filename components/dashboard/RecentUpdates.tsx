'use client'

interface Update {
  id: string
  message: string
  timestamp: string
  color?: 'green' | 'blue' | 'purple' | 'yellow'
}

interface RecentUpdatesProps {
  updates?: Update[]
}

export const RecentUpdates = ({ updates = [] }: RecentUpdatesProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Недавние обновления</h3>
      {updates.length > 0 ? (
        <div className="space-y-3">
          {updates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800">
              <div className={`h-2 w-2 rounded-full mt-2 ${
                update.color === 'green' ? 'bg-green-500' :
                update.color === 'blue' ? 'bg-blue-500' :
                update.color === 'purple' ? 'bg-purple-500' :
                update.color === 'yellow' ? 'bg-yellow-500' :
                'bg-slate-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">{update.message}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{update.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 dark:text-gray-500">
          <p>Пока нет обновлений</p>
        </div>
      )}
    </div>
  )
}

