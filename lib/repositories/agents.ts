import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { Agent } from '@/types'
import type {
  AgentActivityMetricRow,
  AgentRow,
  DashboardStatsFunctionResult,
  DashboardStatsViewRow,
} from '@/types/supabase'

interface AgentListParams {
  organizationId: string
  search?: string
  status?: Agent['status']
  page?: number
  limit?: number
}

interface AgentListResult {
  agents: Agent[]
  total: number
}

interface ActivitySummaryItem {
  date: string
  messagesCount: number
}

interface ActivitySeriesPoint {
  label: string
  value: number
}

const mapAgentRowToDomain = (row: AgentRow): Agent => {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    model: row.default_model,
    messagesTotal: row.messages_total,
    lastActivityAt: row.last_activity_at,
    ownerName: row.owner_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const fetchActivityMetrics = async (
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  organizationId: string,
  startDate: Date,
): Promise<AgentActivityMetricRow[]> => {
  const { data, error } = await supabase
    .from('agent_activity_metrics')
    .select('activity_date, messages_count')
    .eq('org_id', organizationId)
    .gte('activity_date', startDate.toISOString())
    .order('activity_date', { ascending: true })

  if (error) {
    console.error('Failed to load agent activity metrics', error)
    return []
  }

  return (data as AgentActivityMetricRow[] | null) ?? []
}

export const getAgents = async (params: AgentListParams): Promise<AgentListResult> => {
  const supabase = getSupabaseServiceRoleClient()

  const limit = params.limit ?? 25
  const page = params.page ?? 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('agents')
    .select(
      `id, name, status, default_model, owner_name, messages_total, last_activity_at, created_at, updated_at`,
      { count: 'exact' },
    )
    .eq('org_id', params.organizationId)
    .order('created_at', { ascending: false })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error('Failed to fetch agents from Supabase', error)
    throw new Error('Не удалось загрузить агентов')
  }

  const agents = ((data as AgentRow[] | null) ?? []).map(mapAgentRowToDomain)

  return {
    agents,
    total: count ?? agents.length,
  }
}

export const getDashboardStats = async (
  organizationId: string,
): Promise<import('@/types').DashboardStats> => {
  const supabase = getSupabaseServiceRoleClient()

  const stats = await loadDashboardStatsFromView(supabase, organizationId)

  if (stats) {
    return stats
  }

  const fallbackStats = await loadDashboardStatsFromFunction(supabase, organizationId)

  if (fallbackStats) {
    return fallbackStats
  }

  return await buildDashboardStatsFromAgents(supabase, organizationId)
}

export const getWeeklyActivitySummary = async (
  organizationId: string,
): Promise<ActivitySummaryItem[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const now = new Date()
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  startDate.setUTCDate(startDate.getUTCDate() - 6)

  const metrics = await fetchActivityMetrics(supabase, organizationId, startDate)

  if (metrics.length === 0) {
    return buildEmptyWeeklyActivity(startDate)
  }
  const activityMap: Record<string, number> = {}

  metrics.forEach((metric: AgentActivityMetricRow) => {
    const dateKey = metric.activity_date.slice(0, 10)
    const currentValue = activityMap[dateKey] ?? 0
    activityMap[dateKey] = currentValue + metric.messages_count
  })

  return buildWeeklyActivitySeries(startDate, activityMap)
}

export const getMonthlyResponsesSeries = async (
  organizationId: string,
  months = 6,
): Promise<ActivitySeriesPoint[]> => {
  const appliedMonths = months > 0 ? months : 1
  const supabase = getSupabaseServiceRoleClient()
  const now = new Date()
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (appliedMonths - 1), 1))
  const metrics = await fetchActivityMetrics(supabase, organizationId, startDate)

  const totalsByMonth = new Map<string, number>()

  metrics.forEach((metric) => {
    const activityDate = new Date(metric.activity_date)
    const key = `${activityDate.getUTCFullYear()}-${activityDate.getUTCMonth()}`
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + metric.messages_count)
  })

  const formatter = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })
  const series: ActivitySeriesPoint[] = []

  for (let offset = appliedMonths - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    series.push({
      label: formatter.format(date),
      value: totalsByMonth.get(key) ?? 0,
    })
  }

  return series
}

export const getDailyResponsesSeries = async (
  organizationId: string,
  days = 10,
): Promise<ActivitySeriesPoint[]> => {
  const appliedDays = days > 0 ? days : 1
  const supabase = getSupabaseServiceRoleClient()
  const now = new Date()
  const startDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (appliedDays - 1)),
  )
  const metrics = await fetchActivityMetrics(supabase, organizationId, startDate)

  const totalsByDate = new Map<string, number>()

  metrics.forEach((metric) => {
    const key = new Date(metric.activity_date).toISOString().slice(0, 10)
    totalsByDate.set(key, (totalsByDate.get(key) ?? 0) + metric.messages_count)
  })

  const formatter = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

  const series: ActivitySeriesPoint[] = []

  for (let offset = appliedDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset))
    const key = date.toISOString().slice(0, 10)
    series.push({
      label: formatter.format(date),
      value: totalsByDate.get(key) ?? 0,
    })
  }

  return series
}

const loadDashboardStatsFromView = async (
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  organizationId: string,
): Promise<import('@/types').DashboardStats | null> => {
  const { data, error } = await supabase
    .from('dashboard_kpis')
    .select('monthly_responses, monthly_change, weekly_responses, today_responses')
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (error) {
    console.warn('Dashboard KPI view is not available', error)
    return null
  }

  const row = data as DashboardStatsViewRow | null

  if (!row) {
    return null
  }

  const totalAgents = await countAgents(supabase, organizationId)

  return {
    monthlyResponses: row.monthly_responses,
    monthlyChange: row.monthly_change,
    weeklyResponses: row.weekly_responses,
    todayResponses: row.today_responses,
    totalAgents,
  }
}

const loadDashboardStatsFromFunction = async (
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  organizationId: string,
): Promise<import('@/types').DashboardStats | null> => {
  const { data, error } = await supabase
    .rpc('calculate_dashboard_stats', { organization_uuid: organizationId } as never)
    .single()

  if (error) {
    console.warn('Dashboard stats function is not available', error)
    return null
  }

  const result = data as DashboardStatsFunctionResult | null

  if (!result) {
    return null
  }

  const totalAgents = await countAgents(supabase, organizationId)

  return {
    monthlyResponses: result.monthly_responses,
    monthlyChange: result.monthly_change,
    weeklyResponses: result.weekly_responses,
    todayResponses: result.today_responses,
    totalAgents,
  }
}

const buildDashboardStatsFromAgents = async (
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  organizationId: string,
): Promise<import('@/types').DashboardStats> => {
  const totalAgents = await countAgents(supabase, organizationId)

  const { data, error } = await supabase
    .from('agent_activity_metrics')
    .select('messages_count, activity_date')
    .eq('org_id', organizationId)

  if (error) {
    console.error('Failed to load agent activity metrics', error)
    return {
      monthlyResponses: 0,
      monthlyChange: 0,
      weeklyResponses: 0,
      todayResponses: 0,
      totalAgents,
    }
  }

  const metrics = (data as AgentActivityMetricRow[] | null) ?? []

  if (metrics.length === 0) {
    return {
      monthlyResponses: 0,
      monthlyChange: 0,
      weeklyResponses: 0,
      todayResponses: 0,
      totalAgents,
    }
  }

  const now = new Date()
  const startOfWeek = startOfISOWeek(now)
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  let weeklyResponses = 0
  let monthlyResponses = 0
  let todayResponses = 0

  metrics.forEach((metric) => {
    const activityDate = new Date(metric.activity_date)

    if (activityDate >= startOfWeek) {
      weeklyResponses += metric.messages_count
    }

    if (activityDate >= startOfMonth) {
      monthlyResponses += metric.messages_count
    }

    if (isSameUTCDate(activityDate, now)) {
      todayResponses += metric.messages_count
    }
  })

  const previousMonthResponses = calculatePreviousMonthTotal(metrics, now)
  const monthlyChange = calculatePercentageChange(previousMonthResponses, monthlyResponses)

  return {
    monthlyResponses,
    monthlyChange,
    weeklyResponses,
    todayResponses,
    totalAgents,
  }
}

const countAgents = async (
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
  organizationId: string,
): Promise<number> => {
  const { count, error } = await supabase
    .from('agents')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', organizationId)

  if (error) {
    console.error('Failed to count agents', error)
    return 0
  }

  return count ?? 0
}

const startOfISOWeek = (date: Date): Date => {
  const clone = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = clone.getUTCDay() || 7
  if (day !== 1) {
    clone.setUTCDate(clone.getUTCDate() - (day - 1))
  }
  return clone
}

const isSameUTCDate = (left: Date, right: Date): boolean => {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  )
}

const calculatePreviousMonthTotal = (
  metrics: { activity_date: string; messages_count: number }[],
  reference: Date,
): number => {
  const previousMonth = reference.getUTCMonth() === 0 ? 11 : reference.getUTCMonth() - 1
  const previousYear = previousMonth === 11 ? reference.getUTCFullYear() - 1 : reference.getUTCFullYear()

  return metrics.reduce((total, metric) => {
    const date = new Date(metric.activity_date)

    if (date.getUTCFullYear() === previousYear && date.getUTCMonth() === previousMonth) {
      return total + metric.messages_count
    }

    return total
  }, 0)
}

const calculatePercentageChange = (previousValue: number, currentValue: number): number => {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100
  }

  const difference = currentValue - previousValue
  return (difference / previousValue) * 100
}

const buildEmptyWeeklyActivity = (startDate: Date): ActivitySummaryItem[] => {
  return buildWeeklyActivitySeries(startDate, {})
}

const buildWeeklyActivitySeries = (
  startDate: Date,
  activityMap: Record<string, number>,
): ActivitySummaryItem[] => {
  const series: ActivitySummaryItem[] = []

  for (let index = 0; index < 7; index += 1) {
    const currentDate = new Date(startDate)
    currentDate.setUTCDate(startDate.getUTCDate() + index)

    const dateKey = currentDate.toISOString().slice(0, 10)
    const messagesCount = activityMap[dateKey] ?? 0

    series.push({
      date: dateKey,
      messagesCount,
    })
  }

  return series
}

export type { AgentListParams, AgentListResult, ActivitySummaryItem, ActivitySeriesPoint }
