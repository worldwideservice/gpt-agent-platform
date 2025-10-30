import { redirect } from 'next/navigation'
import { Bot, CalendarCheck2, MessageSquare, Sparkles } from 'lucide-react'

import { BarChartCard } from '@/components/dashboard/BarChartCard'
import { LineChartCard } from '@/components/dashboard/LineChartCard'
import { RecentUpdates } from '@/components/dashboard/RecentUpdates'
import { StatCard } from '@/components/dashboard/StatCard'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'
import {
  getDashboardStats,
  getWeeklyBarChartData,
  getMonthlyResponsesSeries,
  getDailyResponsesSeries,
} from '@/lib/repositories/agents'

const DashboardPage = async () => {
  // Демо режим для локального тестирования
  const isDemoMode = process.env.NODE_ENV === 'development' ||
    process.env.DEMO_MODE === 'true'

  let orgId: string

  if (isDemoMode) {
    // В демо режиме используем фиктивный orgId
    orgId = 'demo-org-123'
  } else {
    const session = await auth()
    if (!session?.user?.orgId) {
      redirect('/login')
    }
    orgId = session.user.orgId
  }

  // В демо режиме пропускаем проверку onboarding
  if (!isDemoMode) {
    const onboardingState = await getOnboardingState(orgId)
    if (!onboardingState.isCompleted) {
      redirect('/onboarding')
    }
  }

  const [stats, weeklyBarData, monthlyData, dailyData] = await Promise.all([
    getDashboardStats(orgId),
    getWeeklyBarChartData(orgId),
    getMonthlyResponsesSeries(orgId, 6),
    getDailyResponsesSeries(orgId, 14),
  ])

  // Пока нет реальных обновлений - используем пустой массив
  // TODO: Реализовать получение реальных обновлений из БД/уведомлений
  const recentUpdates: Array<{
    id: string
    message: string
    timestamp: string
    color: 'green' | 'blue' | 'purple' | 'yellow'
  }> = []

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ответы ИИ за этот месяц"
          value={stats.monthlyResponses}
          change={stats.monthlyChange}
          subtitle="к прошлому месяцу"
          icon={MessageSquare}
        />

        <StatCard
          title="Ответы ИИ за последние 7 дней"
          value={stats.weeklyResponses}
          subtitle="Последние 7 дней"
          icon={CalendarCheck2}
        />

        <StatCard
          title="Ответы ИИ сегодня"
          value={stats.todayResponses}
          icon={Sparkles}
        />

        <StatCard
          title="Агенты"
          value={stats.totalAgents}
          subtitle="Всего агентов"
          icon={Bot}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChartCard
          title="Ответы ИИ за этот месяц"
          data={monthlyData}
        />
        <LineChartCard
          title="Ответы ИИ за день"
          data={dailyData}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Активность за последние 7 дней"
          data={weeklyBarData}
        />
        <RecentUpdates updates={recentUpdates} />
      </section>
    </div>
  )
}

export default DashboardPage
