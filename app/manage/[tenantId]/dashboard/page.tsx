import { Suspense } from 'react'

import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { getDashboardStats } from '@/lib/repositories/agents'
import { getWorkspaceSummary } from '@/lib/repositories/manage-summary'
import { WorkspaceSummaryIntegrationInsights } from '@/components/features/manage/WorkspaceSummaryIntegrationInsights'
import { WorkspaceSummaryKnowledgeInsights } from '@/components/features/manage/WorkspaceSummaryKnowledgeInsights'
import { WebhookActivityCard } from '@/components/features/manage/WebhookActivityCard'
import type { DashboardStats } from '@/types'

interface DashboardPageProps {
  params: {
    tenantId: string
  }
}

const MetricsSkeleton = () => {
  const cards = Array.from({ length: 4 })
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {cards.map((_, index) => (
        <div key={index} className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-950">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase text-primary">Обзор</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Рабочее пространство</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tenant: <span className="font-mono text-xs">{params.tenantId}</span>
        </p>
      </header>

      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Недавние активности</CardTitle>
            <CardDescription>Полная история появится после интеграции с Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            Нет данных. Подключите Kommo и начните общение с клиентами.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Запустите ключевые сценарии платформы.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              Создать агента
            </button>
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              Загрузить знания
            </button>
            <button className="rounded-lg border border-dashed border-primary/40 px-4 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5">
              Подключить Kommo
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const ZERO_STATS: DashboardStats = {
  monthlyResponses: 0,
  monthlyChange: 0,
  weeklyResponses: 0,
  todayResponses: 0,
  totalAgents: 0,
}

async function DashboardMetrics() {
  const session = await auth()
  const organizationId = session?.user?.orgId
  if (!organizationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Недостаточно данных</CardTitle>
          <CardDescription>Авторизуйтесь, чтобы получить доступ к статистике workspace.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 dark:text-gray-300">
          Данные по workspace во главе с Supabase пока отсутствуют.
        </CardContent>
      </Card>
    )
  }

  const [stats, summary] = await Promise.all([
    getDashboardStats(organizationId).catch(() => null),
    getWorkspaceSummary(organizationId).catch(() => null),
  ])

  const statsToDisplay = stats ?? ZERO_STATS

  return (
    <>
      <StatsGrid stats={statsToDisplay} />
      {summary ? (
        <>
          <WorkspaceSummaryKnowledgeInsights summary={summary} />
          <WorkspaceSummaryIntegrationInsights summary={summary} />
          {summary.integrations.webhookHistory && summary.integrations.webhookHistory.length > 0 && (
            <WebhookActivityCard history={summary.integrations.webhookHistory} />
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Статистика недоступна</CardTitle>
            <CardDescription>Проверьте соединение с Supabase и интеграции Kommo.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  )
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <StatCard
        label="Ответов за месяц"
        value={stats.monthlyResponses}
        change={stats.monthlyChange}
        helper="к прошлому месяцу"
      />
      <StatCard label="Ответов за неделю" value={stats.weeklyResponses} helper="Последние 7 дней" />
      <StatCard
        label="Ответов сегодня"
        value={stats.todayResponses}
        change={stats.todayChange}
        helper="к вчерашнему дню"
      />
      <StatCard label="Активные агенты" value={stats.totalAgents} helper="Включены и доступны" />
    </div>
  )
}

function StatCard({
  label,
  value,
  change,
  helper,
}: {
  label: string
  value: number | null | undefined
  change?: number | null
  helper?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{formatNumber(value)}</CardTitle>
      </CardHeader>
      {(helper || typeof change === 'number') && (
        <CardContent className="pt-0 text-xs text-gray-500">
          {typeof change === 'number' ? (
            <span className={`font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {formatChange(change)}
            </span>
          ) : null}
          {helper ? <span className={typeof change === 'number' ? 'ml-2' : ''}>{helper}</span> : null}
        </CardContent>
      )}
    </Card>
  )
}

const formatNumber = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0'
  }

  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value)
}

const formatChange = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0%'
  }

  const absValue = Math.abs(value)
  const formatter = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: absValue < 10 ? 1 : 0,
  })

  const formatted = formatter.format(absValue)

  if (value > 0) {
    return `+${formatted}%`
  }

  if (value < 0) {
    return `-${formatted}%`
  }

  return '0%'
}
