import type { ActivitySeriesPoint } from '@/lib/repositories/agents'

const formatValue = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

interface LineChartCardProps {
  title: string
  subtitle?: string
  data: ActivitySeriesPoint[]
  emptyMessage?: string
}

export const LineChartCard = ({ title, subtitle, data, emptyMessage }: LineChartCardProps) => {
  const hasData = data.length > 1 && data.some((point) => point.value > 0)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {hasData && (
          <div className="text-sm font-semibold text-primary-600">
            {formatValue(data[data.length - 1]?.value ?? 0)}
          </div>
        )}
      </div>

      <div className="mt-6 h-52">
        {hasData ? <Chart data={data} /> : <EmptyState message={emptyMessage} />}
      </div>

      <div className="mt-4 grid grid-flow-col gap-2 text-xs font-medium text-slate-400">
        {data.map((point) => (
          <span key={point.label} className="truncate text-center">
            {point.label}
          </span>
        ))}
      </div>
    </article>
  )
}

const Chart = ({ data }: { data: ActivitySeriesPoint[] }) => {
  const width = 520
  const height = 200
  const padding = 24
  const workingWidth = width - padding * 2
  const workingHeight = height - padding * 2
  const maxValue = Math.max(...data.map((point) => point.value), 1)

  const points = data.map((point, index) => {
    const ratio = data.length > 1 ? index / (data.length - 1) : 0
    const x = padding + ratio * workingWidth
    const y = padding + (1 - point.value / maxValue) * workingHeight
    return `${x},${y}`
  })

  const lastPoint = data[data.length - 1]
  const lastPointIndex = data.length - 1
  const lastPointRatio = data.length > 1 ? lastPointIndex / (data.length - 1) : 0
  const lastPointX = padding + lastPointRatio * workingWidth
  const lastPointY = padding + (1 - lastPoint.value / maxValue) * workingHeight

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>

      <path
        d={`M${padding} ${height - padding} L${points
          .map((point) => point.split(',').map(Number))
          .map(([x, y]) => `${x} ${y}`)
          .join(' L')} L${width - padding} ${height - padding} Z`}
        fill="url(#chart-gradient)"
        opacity={0.3}
      />

      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points.join(' ')}
      />

      <circle cx={lastPointX} cy={lastPointY} r={6} fill="#2563eb" />
      <circle cx={lastPointX} cy={lastPointY} r={10} fill="rgba(37,99,235,0.15)" />
    </svg>
  )
}

const EmptyState = ({ message }: { message?: string }) => (
  <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
    {message ?? 'Недостаточно данных для отображения графика'}
  </div>
)

