interface UpdateItem {
  id: string
  message: string
  timestamp: string
  color: 'green' | 'blue' | 'purple' | 'yellow'
}

interface RecentUpdatesProps {
  updates: UpdateItem[]
}

const colorClasses = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
}

export const RecentUpdates = ({ updates }: RecentUpdatesProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-900">Последние обновления</h3>

      {updates.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          Нет обновлений
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, index) => {
            const isLast = index === updates.length - 1

            return (
              <div key={update.id} className={`flex items-start gap-3 ${!isLast ? 'border-b border-slate-100 pb-4' : ''}`}>
                <div className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${colorClasses[update.color]}`} aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{update.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{update.timestamp}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}














