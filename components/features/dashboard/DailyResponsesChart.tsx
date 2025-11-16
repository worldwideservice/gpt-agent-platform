'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface DailyResponsesChartProps {
  data: Array<{
    day: string
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DailyResponsesChart({ data, isLoading }: DailyResponsesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ответы ИИ за день</CardTitle>
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
                  dataKey="day"
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 600]}
                  ticks={[0, 200, 400, 600]}
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
