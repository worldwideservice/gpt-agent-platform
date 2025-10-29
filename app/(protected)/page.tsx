import { redirect } from 'next/navigation'
import { Bot, CalendarCheck2, MessageSquare, Sparkles } from 'lucide-react'

import { LineChartCard } from '@/components/dashboard/LineChartCard'
import { StatCard } from '@/components/dashboard/StatCard'
import { ClientMarker } from '@/components/system/ClientMarker'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'
import {
  getDashboardStats,
  getDailyResponsesSeries,
  getMonthlyResponsesSeries,
} from '@/lib/repositories/agents'

const DashboardPage = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const orgId = session.user.orgId

  const onboardingState = await getOnboardingState(orgId)

  if (!onboardingState.isCompleted) {
    redirect('/onboarding')
  }

  const [stats, monthlySeries, dailySeries] = await Promise.all([
    getDashboardStats(orgId),
    getMonthlyResponsesSeries(orgId, 6),
    getDailyResponsesSeries(orgId, 10),
  ])

  return (
    <div className="space-y-8">
      <ClientMarker />
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ответы ИИ за этот месяц"
          value={stats.monthlyResponses}
          change={stats.monthlyChange}
          subtitle="По сравнению с прошлым месяцем"
          icon={MessageSquare}
        />

        <StatCard
          title="Ответы ИИ за последние 7 дней"
          value={stats.weeklyResponses}
          subtitle="Обновляется ежедневно"
          icon={CalendarCheck2}
        />

        <StatCard
          title="Ответы ИИ сегодня"
          value={stats.todayResponses}
          subtitle="С начала суток"
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
          subtitle="Последние 6 месяцев"
          data={monthlySeries}
        />
        <LineChartCard
          title="Ответы ИИ за день"
          subtitle="Последние 10 дней"
          data={dailySeries}
        />
      </section>
    </div>
  )
}

export default DashboardPage
