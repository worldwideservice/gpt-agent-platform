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

function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="flex h-full flex-col justify-between p-4">
        {/* Y-axis labels */}
        <div className="flex justify-between">
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        {/* X-axis labels */}
        <div className="flex justify-around">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  )
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
            <ChartSkeleton />
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
                  domain={[0, 20000]}
                  ticks={[0, 5000, 10000, 15000, 20000]}
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
