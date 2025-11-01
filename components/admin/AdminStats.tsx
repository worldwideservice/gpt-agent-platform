'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building,
  Bot,
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface AdminStatsProps {
  stats: {
    users: {
      total: number
      byTier: Record<string, number>
      newToday: number
    }
    organizations: {
      total: number
      byTier: Record<string, number>
    }
    agents: {
      total: number
      active: number
    }
    jobs: {
      total: number
      byStatus: Record<string, number>
    }
    usage: {
      tokensLast30Days: number
      requestsLast30Days: number
      sessionsLast30Days: number
    }
  } | null
  onRefresh: () => void
}

const tierColors = {
  free: 'bg-gray-500',
  premium: 'bg-blue-500',
  vip: 'bg-purple-500',
}

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
}

export const AdminStats = ({ stats, onRefresh }: AdminStatsProps) => {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Не удалось загрузить статистику</p>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Обзор системы</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.users.total)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.users.newToday} сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Организации</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations.total}</div>
            <p className="text-xs text-muted-foreground">
              Активных организаций
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Агенты</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agents.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.agents.active} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Задачи</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs.total}</div>
            <p className="text-xs text-muted-foreground">
              Всего выполнено
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Пользователи по тарифам</CardTitle>
            <CardDescription>Распределение пользователей по уровням подписки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.users.byTier).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierColors[tier as keyof typeof tierColors] || 'bg-gray-400'}`}></div>
                  <span className="capitalize">{tier}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Jobs by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Статус задач</CardTitle>
            <CardDescription>Распределение background задач по статусам</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.jobs.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-400'}`}></div>
                  <span className="capitalize">{status}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Использование (последние 30 дней)</CardTitle>
          <CardDescription>Статистика использования платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.usage.tokensLast30Days)}
              </div>
              <p className="text-sm text-muted-foreground">Токенов использовано</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.usage.requestsLast30Days)}
              </div>
              <p className="text-sm text-muted-foreground">API запросов</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.usage.sessionsLast30Days)}
              </div>
              <p className="text-sm text-muted-foreground">Пользовательских сессий</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
