import type { DashboardStats } from '@/types'

interface SimpleDashboardStatsProps {
 stats: DashboardStats
}

const formatNumber = (value: number | string): string => {
 if (typeof value === 'string') {
 return value
 }
 return new Intl.NumberFormat('ru-RU').format(value)
}

const formatChange = (value: number): string => {
 const rounded = Number.parseFloat(value.toFixed(1))
 return `${rounded}%`
}

export const SimpleDashboardStats = ({ stats }: SimpleDashboardStatsProps) => {
 return (
 <section className="flex flex-col gap-y-8 py-8">
 <div className="fi-wi-stats-overview-stats-ctn grid gap-6 md:grid-cols-2 xl:grid-cols-4">
 {/* Ответы ИИ за этот месяц */}
 <div className="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
 <div className="grid gap-y-2">
 <div className="flex items-center gap-x-2">
 <span className="text-sm font-medium text-gray-700">
 Ответы ИИ за этот месяц
 </span>
 </div>
 <div className="fi-wi-stats-overview-stat-value text-3xl font-semibold tracking-tight text-gray-950">
 {formatNumber(stats.monthlyResponses)}
 </div>
 {typeof stats.monthlyChange === 'number' && (
 <div className="flex items-center gap-x-1">
 <span
 className={`fi-wi-stats-overview-stat-description text-sm fi-color-custom ${
 stats.monthlyChange >= 0
 ? 'text-custom-600'
 : 'text-red-600'
 }`}
 style={
 stats.monthlyChange >= 0
 ? ({
 '--c-400': 'var(--sky-400)',
 '--c-600': 'var(--sky-600)',
 } as React.CSSProperties)
 : ({
 '--c-400': 'var(--red-400)',
 '--c-600': 'var(--red-600)',
 } as React.CSSProperties)
 }
 >
 {stats.monthlyChange >= 0 ? '+' : ''}
 {formatChange(stats.monthlyChange)} к прошлому месяцу
 </span>
 </div>
 )}
 </div>
 </div>

 {/* Ответы ИИ за последние 7 дней */}
 <div className="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
 <div className="grid gap-y-2">
 <div className="flex items-center gap-x-2">
 <span className="text-sm font-medium text-gray-700">
 Ответы ИИ за последние 7 дней
 </span>
 </div>
 <div className="fi-wi-stats-overview-stat-value text-3xl font-semibold tracking-tight text-gray-950">
 {formatNumber(stats.weeklyResponses)}
 </div>
 <div className="flex items-center gap-x-1">
 <span className="text-sm text-gray-500">
 Последние 7 дней
 </span>
 </div>
 </div>
 </div>

 {/* Ответы ИИ сегодня */}
 <div className="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
 <div className="grid gap-y-2">
 <div className="flex items-center gap-x-2">
 <span className="text-sm font-medium text-gray-700">
 Ответы ИИ сегодня
 </span>
 </div>
 <div className="fi-wi-stats-overview-stat-value text-3xl font-semibold tracking-tight text-gray-950">
 {formatNumber(stats.todayResponses)}
 </div>
 {typeof stats.todayChange === 'number' && (
 <div className="flex items-center gap-x-1">
 <span
 className={`fi-wi-stats-overview-stat-description text-sm fi-color-custom ${
 stats.todayChange >= 0
 ? 'text-custom-600'
 : 'text-red-600'
 }`}
 style={
 stats.todayChange >= 0
 ? ({
 '--c-400': 'var(--sky-400)',
 '--c-600': 'var(--sky-600)',
 } as React.CSSProperties)
 : ({
 '--c-400': 'var(--red-400)',
 '--c-600': 'var(--red-600)',
 } as React.CSSProperties)
 }
 >
 {stats.todayChange >= 0 ? '+' : ''}
 {formatChange(stats.todayChange)} к вчерашнему дню
 </span>
 </div>
 )}
 </div>
 </div>

 {/* Агенты */}
 <div className="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
 <div className="grid gap-y-2">
 <div className="flex items-center gap-x-2">
 <span className="text-sm font-medium text-gray-700">
 Агенты
 </span>
 </div>
 <div className="fi-wi-stats-overview-stat-value text-3xl font-semibold tracking-tight text-gray-950">
 {formatNumber(stats.totalAgents)}
 </div>
 <div className="flex items-center gap-x-1">
 <span className="text-sm text-gray-500">
 Всего агентов
 </span>
 </div>
 </div>
 </div>
 </div>
 </section>
 )
}

