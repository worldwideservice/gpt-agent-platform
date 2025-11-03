'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, CalendarCheck2, Sparkles, Bot } from 'lucide-react'

import { StatCard } from '@/components/dashboard/StatCard'
import { LineChartCard } from '@/components/dashboard/LineChartCard'
import { BarChartCard } from '@/components/dashboard/BarChartCard'
import { RecentUpdates } from '@/components/dashboard/RecentUpdates'
import type { DashboardStats } from '@/types'
import type { ActivitySeriesPoint } from '@/lib/repositories/agents'

interface UpdateItem {
  id: string
  message: string
  timestamp: string
  color: 'green' | 'blue' | 'purple' | 'yellow'
}

export const DashboardClient = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<ActivitySeriesPoint[]>([])
  const [dailyData, setDailyData] = useState<ActivitySeriesPoint[]>([])
  const [weeklyData, setWeeklyData] = useState<ActivitySeriesPoint[]>([])
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Загружаем статистику
        const statsResponse = await fetch('/api/dashboard')
        if (!statsResponse.ok) {
          throw new Error('Не удалось загрузить статистику')
        }
        const statsResult = await statsResponse.json()
        if (statsResult.success) {
          setStats(statsResult.data)
        }

        // Загружаем данные графиков параллельно
        const [monthlyRes, dailyRes, weeklyRes] = await Promise.all([
          fetch('/api/dashboard/charts?type=monthly'),
          fetch('/api/dashboard/charts?type=daily'),
          fetch('/api/dashboard/charts?type=weekly'),
        ])

        if (monthlyRes.ok) {
          const monthlyResult = await monthlyRes.json()
          if (monthlyResult.success) {
            setMonthlyData(monthlyResult.data)
          }
        }

        if (dailyRes.ok) {
          const dailyResult = await dailyRes.json()
          if (dailyResult.success) {
            setDailyData(dailyResult.data)
          }
        }

        if (weeklyRes.ok) {
          const weeklyResult = await weeklyRes.json()
          if (weeklyResult.success) {
            setWeeklyData(weeklyResult.data)
          }
        }

        // Загружаем обновления
        const updatesResponse = await fetch('/api/dashboard/updates')
        if (updatesResponse.ok) {
          const updatesResult = await updatesResponse.json()
          if (updatesResult.success) {
            setUpdates(updatesResult.data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Ошибка загрузки Dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const defaultStats: DashboardStats = {
    monthlyResponses: 0,
    monthlyChange: 0,
    weeklyResponses: 0,
    todayResponses: 0,
    todayChange: 0,
    totalAgents: 0,
  }

  const displayStats = stats ?? defaultStats

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="mt-2 text-gray-600">Обзор активности ваших AI-агентов</p>
      </div>

      {/* Статистические карточки */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ответы ИИ за этот месяц"
          value={displayStats.monthlyResponses}
          change={displayStats.monthlyChange}
          icon={MessageSquare}
        />
        <StatCard
          title="Ответы ИИ за последние 7 дней"
          value={displayStats.weeklyResponses}
          subtitle="Последние 7 дней"
          icon={CalendarCheck2}
        />
        <StatCard
          title="Ответы ИИ сегодня"
          value={displayStats.todayResponses}
          change={displayStats.todayChange}
          icon={Sparkles}
        />
        <StatCard
          title="Агенты"
          value={displayStats.totalAgents}
          subtitle="Всего агентов"
          icon={Bot}
        />
      </div>

      {/* Графики */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <LineChartCard
          title="Ответы ИИ за этот месяц"
          data={monthlyData}
          emptyMessage="Нет данных за этот период"
        />
        <LineChartCard
          title="Ответы ИИ за день"
          subtitle="Последние 14 дней"
          data={dailyData}
          emptyMessage="Нет данных за этот период"
        />
      </div>

      <div className="mb-8">
        <BarChartCard
          title="Активность за последние 7 дней"
          data={weeklyData}
          emptyMessage="Нет данных за этот период"
        />
      </div>

      {/* Недавние обновления */}
      <div>
        <RecentUpdates updates={updates} />
      </div>
    </div>
  )
}

