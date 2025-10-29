import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react'

const formatNumber = (value: number | string): string => {
  if (typeof value === 'string') {
    return value
  }

  return new Intl.NumberFormat('ru-RU').format(value)
}

const formatChange = (value: number): string => {
  const rounded = Number.parseFloat(value.toFixed(1))
  const prefix = rounded > 0 ? '+' : ''
  return `${prefix}${rounded}%`
}

export interface StatCardProps {
  title: string
  value: number | string
  change?: number
  subtitle?: string
  icon?: LucideIcon
}

export const StatCard = ({ title, value, change, subtitle, icon: Icon }: StatCardProps) => {
  const hasChange = typeof change === 'number'
  const isPositive = (change ?? 0) >= 0

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-slate-900">{formatNumber(value)}</p>
            {hasChange && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
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
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </article>
  )
}
