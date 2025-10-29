import { redirect } from 'next/navigation'
import { Bot, CalendarCheck2, MessageSquare, Sparkles } from 'lucide-react'

import { BarChartCard } from '@/components/dashboard/BarChartCard'
import { RecentUpdates } from '@/components/dashboard/RecentUpdates'
import { StatCard } from '@/components/dashboard/StatCard'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'
import {
  getDashboardStats,
  getWeeklyBarChartData,
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

  const [stats, weeklyBarData] = await Promise.all([
    getDashboardStats(orgId),
    getWeeklyBarChartData(orgId),
  ])

  const recentUpdates = [
    {
      id: '1',
      message: 'Агент "Консультант" активирован',
      timestamp: '2 часа назад',
      color: 'green' as const,
    },
    {
      id: '2',
      message: 'Добавлена новая интеграция с Kommo CRM',
      timestamp: '5 часов назад',
      color: 'blue' as const,
    },
    {
      id: '3',
      message: 'База знаний обновлена: +15 статей',
      timestamp: '1 день назад',
      color: 'purple' as const,
    },
    {
      id: '4',
      message: 'Создан новый агент "Поддержка"',
      timestamp: '2 дня назад',
      color: 'yellow' as const,
    },
  ]

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
