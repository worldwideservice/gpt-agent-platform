import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

import { Card, CardBody } from '@/components/ui/Card'
import { formatNumber, formatPercent } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  change?: number
  subtitle?: string
  icon?: LucideIcon
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon: Icon 
}: StatCardProps) => {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
                {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {formatPercent(change)}
                </span>
                <span className="text-sm text-gray-500">к прошлому месяцу</span>
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

