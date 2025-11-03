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
 <article className="fi-section rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 transition-shadow hover:shadow-lg">
 <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 {title}
 </h3>
 </header>
 <div className="fi-section-content p-6">
 <div className="h-52">
 {hasData ? <Chart data={data} /> : <EmptyState message={emptyMessage} />}
 </div>
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
 <stop offset="0%" stopColor="rgba(2,132,199,0.35)" />
 <stop offset="100%" stopColor="rgba(2,132,199,0)" />
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
 stroke="rgb(2,132,199)"
 strokeWidth={3}
 strokeLinejoin="round"
 strokeLinecap="round"
 points={points.join(' ')}
 />

 <circle cx={lastPointX} cy={lastPointY} r={6} fill="rgb(2,132,199)" />
 <circle cx={lastPointX} cy={lastPointY} r={10} fill="rgba(2,132,199,0.15)" />
 </svg>
 )
}

const EmptyState = ({ message }: { message?: string }) => (
 <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
 {message ?? 'Недостаточно данных для отображения графика'}
 </div>
)

