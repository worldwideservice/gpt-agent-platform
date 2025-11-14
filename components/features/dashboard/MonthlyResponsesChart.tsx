'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface MonthlyResponsesChartProps {
  data: Array<{
    month: string
    responses: number
  }>
  isLoading?: boolean
}

export function MonthlyResponsesChart({ data, isLoading }: MonthlyResponsesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ответы ИИ за этот месяц</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis
                  dataKey="month"
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  domain={[0, 'auto']}
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="responses"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
