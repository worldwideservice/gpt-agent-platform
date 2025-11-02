'use client'

interface Stat {
  label: string
  value: number | string
  change?: number
  icon?: string
}

interface SimpleDashboardStatsProps {
  stats?: Stat[]
}

export const SimpleDashboardStats = ({ stats = [] }: SimpleDashboardStatsProps) => {
  const defaultStats: Stat[] = [
    { label: 'Ответы ИИ за этот месяц', value: 0 },
    { label: 'Ответы ИИ за последние 7 дней', value: 0 },
    { label: 'Ответы ИИ сегодня', value: 0 },
    { label: 'Агенты', value: 0 }
  ]

  const displayStats = stats.length > 0 ? stats : defaultStats

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          {stat.change !== undefined && (
            <p className={`mt-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

