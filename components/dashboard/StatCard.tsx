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
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{formatNumber(value)}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {hasChange && (
        <div
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
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
    </article>
  )
}
