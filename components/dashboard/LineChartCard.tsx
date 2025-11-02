'use client'

interface DataPoint {
  label: string
  value: number
}

interface LineChartCardProps {
  title: string
  data?: DataPoint[]
}

export const LineChartCard = ({ title, data = [] }: LineChartCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-500 rounded-t"
                style={{ height: `${Math.max((point.value / Math.max(...data.map(d => d.value))) * 100, 10)}%` }}
              />
              <span className="text-xs text-slate-500 mt-2 dark:text-gray-400">{point.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-slate-400 dark:text-gray-500">
          <p>Нет данных для отображения</p>
        </div>
      )}
    </div>
  )
}

