import type { ActivitySeriesPoint } from '@/lib/repositories/agents'

const formatValue = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

interface BarChartCardProps {
  title: string
  subtitle?: string
  data: ActivitySeriesPoint[]
  emptyMessage?: string
}

export const BarChartCard = ({ title, subtitle, data, emptyMessage }: BarChartCardProps) => {
  const hasData = data.length > 0 && data.some((point) => point.value > 0)
  const maxValue = hasData ? Math.max(...data.map((point) => point.value)) : 1

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      {hasData ? (
        <div className="space-y-4">
          {data.map((point) => {
            const percentage = (point.value / maxValue) * 100

            return (
              <div key={point.label} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-slate-600">{point.label}</div>
                <div className="flex-1">
                  <div className="relative h-8 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-lg bg-primary-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-700">
                      {formatValue(point.value)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          {emptyMessage ?? 'Недостаточно данных для отображения'}
        </div>
      )}
    </article>
  )
}









