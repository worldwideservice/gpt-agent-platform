import { redirect } from 'next/navigation'
import { Activity, Bot, Calendar, MessageSquare } from 'lucide-react'

import { StatCard } from '@/components/dashboard/StatCard'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'
import { getAgents, getDashboardStats, getWeeklyActivitySummary } from '@/lib/repositories/agents'
import { cn, formatNumber } from '@/lib/utils'

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

  const [stats, weeklyActivity, agentList] = await Promise.all([
    getDashboardStats(orgId),
    getWeeklyActivitySummary(orgId),
    getAgents({ organizationId: orgId, limit: 4, page: 1 }),
  ])

  const activityMaxValue = weeklyActivity.reduce((max, item) => {
    return item.messagesCount > max ? item.messagesCount : max
  }, 0)

  const formattedActivity = weeklyActivity.map((item) => {
    return {
      label: formatWeekday(item.date),
      value: item.messagesCount,
    }
  })

  const recentAgents = agentList.agents

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          icon={Calendar}
        />

        <StatCard
          title="Ответы ИИ сегодня"
          value={stats.todayResponses}
          icon={Activity}
        />

        <StatCard
          title="Агенты"
          value={stats.totalAgents}
          subtitle="Всего агентов"
          icon={Bot}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Активность за последние 7 дней</h3>
          <div className="space-y-3">
            {formattedActivity.length === 0 && (
              <p className="text-sm text-gray-500">Недостаточно данных для отображения активности</p>
            )}
            {formattedActivity.map((item) => {
              return (
                <div key={item.label} className="flex items-center space-x-4">
                  <span className="w-32 text-sm font-medium capitalize text-gray-600">{item.label}</span>
                  <progress
                    value={item.value}
                    max={activityMaxValue || 1}
                    className="h-2 flex-1 rounded-full bg-gray-100 [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:bg-primary-600 [&::-moz-progress-bar]:bg-primary-600"
                    aria-label={`Количество сообщений ${item.label}`}
                  />
                  <span className="w-16 text-right text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Последние обновления</h3>
          <div className="space-y-4">
            {recentAgents.length === 0 && <p className="text-sm text-gray-500">Агенты ещё не созданы</p>}
            {recentAgents.map((agent, index) => {
              const isLast = index === recentAgents.length - 1

              return (
                <div
                  key={agent.id}
                  className={cn('flex items-start space-x-3', !isLast && 'border-b border-gray-100 pb-4')}
                >
                  <div className="mt-2 h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Агент «{agent.name}» {agent.status === 'active' ? 'активирован' : 'обновлён'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Изменён {formatRelativeDate(agent.updatedAt)} · Сообщений: {formatNumber(agent.messagesTotal)} · Модель:{' '}
                      {agent.model ?? 'не указана'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const formatWeekday = (isoDate: string): string => {
  const formatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' })
  const date = new Date(`${isoDate}T00:00:00Z`)
  return formatter.format(date)
}

const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'неизвестно'
  }

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) {
    return 'только что'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} мин назад`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} ч назад`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays} дн назад`
  }

  return date.toLocaleDateString('ru-RU')
}

export default DashboardPage
