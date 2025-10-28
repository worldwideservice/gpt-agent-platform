import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: number | string
  change?: number
  subtitle?: string
  icon?: LucideIcon
}

export const StatCard = ({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
}: StatCardProps) => {
  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">{formatNumber(value)}</p>
            {change && (
              <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
      
      {/* Mini chart/indicator */}
      {change && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                change >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
