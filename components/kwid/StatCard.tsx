import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'

const formatNumber = (value: number | string): string => {
  if (typeof value === 'string') {
    return value
  }
  return new Intl.NumberFormat('en-US').format(value)
}

const formatChange = (value: number): string => {
  const rounded = Number.parseFloat(value.toFixed(1))
  const prefix = rounded > 0 ? '+' : ''
  return `${prefix}${rounded}%`
}

export interface KwidStatCardProps {
  title: string
  value: number | string
  change?: number
  subtitle?: string
  icon?: LucideIcon
  description?: string
}

/**
 * StatCard компонент реплика Kwid стиля
 * Использует классы из Filament UI: fi-wi-stats-overview-stat
 */
export const KwidStatCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  description,
  icon: Icon 
}: KwidStatCardProps) => {
  const hasChange = typeof change === 'number'
  const isPositive = (change ?? 0) >= 0

  return (
    <article className="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {formatNumber(value)}
            </p>
            {hasChange && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{formatChange(change ?? 0)}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {description && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-custom-50 text-custom-600 dark:bg-custom-900/20 dark:text-custom-400">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  )
}

