import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import {
  getCachedAgent,
  setCachedAgent,
  invalidateAgentCache,
  getCachedDashboardStats,
  setCachedDashboardStats,
  getCachedAgentsList,
  setCachedAgentsList,
  getCachedActivityMetrics,
  setCachedActivityMetrics,
  invalidateAgentsListCache,
} from '@/lib/utils/cache'
import { logger } from '@/lib/utils/logger'

import type { Agent, AgentSettings } from '@/types'
import type {
 AgentActivityMetricRow,
 AgentRow,
 DashboardStatsFunctionResult,
 DashboardStatsViewRow,
} from '@/types/supabase'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

/**
 * Задача 4.1: Advanced Filters для агентов
 * Добавлены фильтры по модели и дате создания
 */
export interface AgentListParams {
  organizationId: string
  search?: string
  status?: Agent['status']
  page?: number
  limit?: number
  model?: string
  dateFrom?: Date
  dateTo?: Date
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

const AGENT_SELECT_FIELDS = `
 id,
 name,
 status,
 default_model,
 owner_name,
 messages_total,
 last_activity_at,
 created_at,
 updated_at,
 temperature,
 max_tokens,
 response_delay_seconds,
 instructions,
 settings
`

const parseAgentSettings = (raw: unknown): AgentSettings => {
 if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
 return {}
 }

 const value = raw as Record<string, unknown>
 const settings: AgentSettings = {}

 if (typeof value.language === 'string') {
 settings.language = value.language
 }

 if (typeof value.welcomeMessage === 'string') {
 settings.welcomeMessage = value.welcomeMessage
 }

 if (typeof value.description === 'string') {
 settings.description = value.description
 }

 if (typeof value.presencePenalty === 'number') {
 settings.presencePenalty = value.presencePenalty
 }

 if (typeof value.frequencyPenalty === 'number') {
 settings.frequencyPenalty = value.frequencyPenalty
 }

 if (Array.isArray(value.defaultChannels)) {
 settings.defaultChannels = value.defaultChannels.filter((item): item is string => typeof item === 'string')
 }

 if (typeof value.knowledgeBaseAllCategories === 'boolean') {
 settings.knowledgeBaseAllCategories = value.knowledgeBaseAllCategories
 }

 if (typeof value.createTaskOnNotFound === 'boolean') {
 settings.createTaskOnNotFound = value.createTaskOnNotFound
 }

 if (typeof value.notFoundMessage === 'string') {
 settings.notFoundMessage = value.notFoundMessage
 }

 return settings
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
 temperature: Number(row.temperature ?? 0.7),
 maxTokens: Number(row.max_tokens ?? 2048),
 responseDelaySeconds: Number(row.response_delay_seconds ?? 0),
 instructions: row.instructions ?? null,
 settings: parseAgentSettings(row.settings),
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
 logger.error('Failed to load agent activity metrics', { organizationId, error })
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
 .select(AGENT_SELECT_FIELDS, { count: 'exact' })
 .eq('org_id', params.organizationId)
 .order('created_at', { ascending: false })

 if (params.status) {
 query = query.eq('status', params.status)
 }

 if (params.search) {
 query = query.ilike('name', `%${params.search}%`)
 }

 // Задача 4.1: Advanced Filters
 if (params.model) {
 query = query.eq('default_model', params.model)
 }

 if (params.dateFrom) {
 query = query.gte('created_at', params.dateFrom.toISOString())
 }

 if (params.dateTo) {
 query = query.lte('created_at', params.dateTo.toISOString())
 }

 const { data, count, error } = await query.range(from, to)

 if (error) {
 logger.error('Failed to fetch agents from Supabase', { organizationId, error })
 throw new Error('Не удалось загрузить агентов')
 }

 const agents = ((data as AgentRow[] | null) ?? []).map(mapAgentRowToDomain)

 return {
 agents,
 total: count ?? agents.length,
 }
}

/**
 * Задача 4.4: Добавлено кэширование dashboard stats (TTL 60 секунд)
 */
export const getDashboardStats = async (
  organizationId: string,
): Promise<import('@/types').DashboardStats> => {
  if (isDemoEnvironment()) {
    return {
      monthlyResponses: 420,
      monthlyChange: 12,
      weeklyResponses: 108,
      todayResponses: 16,
      todayChange: 4,
      totalAgents: 3,
    }
  }

  // Проверяем кэш
  const cached = await getCachedDashboardStats(organizationId)
  if (cached) {
    return cached
  }

  const supabase = getSupabaseServiceRoleClient()

  const stats = await loadDashboardStatsFromView(supabase, organizationId)

  if (stats) {
    await setCachedDashboardStats(organizationId, stats).catch(() => {
      // Игнорируем ошибки кэширования
    })
    return stats
 }

 const fallbackStats = await loadDashboardStatsFromFunction(supabase, organizationId)

 if (fallbackStats) {
    await setCachedDashboardStats(organizationId, fallbackStats).catch(() => {
      // Игнорируем ошибки кэширования
    })
    return fallbackStats
 }

 const builtStats = await buildDashboardStatsFromAgents(supabase, organizationId)
 await setCachedDashboardStats(organizationId, builtStats).catch(() => {
   // Игнорируем ошибки кэширования
 })
 return builtStats
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

export const getWeeklyBarChartData = async (
 organizationId: string,
): Promise<ActivitySeriesPoint[]> => {
 const supabase = getSupabaseServiceRoleClient()
 const now = new Date()
 const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6))
 
 const metrics = await fetchActivityMetrics(supabase, organizationId, startDate)

 const totalsByDate = new Map<string, number>()

 metrics.forEach((metric) => {
 const key = new Date(metric.activity_date).toISOString().slice(0, 10)
 totalsByDate.set(key, (totalsByDate.get(key) ?? 0) + metric.messages_count)
 })

 const dayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' })
 const series: ActivitySeriesPoint[] = []

 for (let offset = 6; offset >= 0; offset -= 1) {
 const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset))
 const key = date.toISOString().slice(0, 10)
 const dayName = dayFormatter.format(date)
 const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)
 
 series.push({
 label: capitalizedDayName,
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
 logger.warn('Dashboard KPI view is not available', { organizationId, error })
 return null
 }

 const row = data as DashboardStatsViewRow | null

 if (!row) {
 return null
 }

 const totalAgents = await countAgents(supabase, organizationId)

 // Получаем todayChange из view или вычисляем (если есть поле today_change)
 const todayChange = (row as any).today_change ?? 0

 return {
 monthlyResponses: row.monthly_responses,
 monthlyChange: row.monthly_change,
 weeklyResponses: row.weekly_responses,
 todayResponses: row.today_responses,
 todayChange,
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
 logger.warn('Dashboard stats function is not available', { organizationId, error })
 return null
 }

 const result = data as DashboardStatsFunctionResult | null

 if (!result) {
 return null
 }

 const totalAgents = await countAgents(supabase, organizationId)

 // Получаем todayChange из функции или вычисляем
 const todayChange = (result as any).today_change ?? 0

 return {
 monthlyResponses: result.monthly_responses,
 monthlyChange: result.monthly_change,
 weeklyResponses: result.weekly_responses,
 todayResponses: result.today_responses,
 todayChange,
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
 logger.error('Failed to load agent activity metrics', { organizationId, error })
 return {
 monthlyResponses: 0,
 monthlyChange: 0,
 weeklyResponses: 0,
 todayResponses: 0,
 todayChange: 0,
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
 todayChange: 0,
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

 // Расчет изменения для "Today's AI Responses" vs yesterday
 const yesterday = new Date(now)
 yesterday.setUTCDate(yesterday.getUTCDate() - 1)
 let yesterdayResponses = 0

 metrics.forEach((metric) => {
 const activityDate = new Date(metric.activity_date)
 if (isSameUTCDate(activityDate, yesterday)) {
 yesterdayResponses += metric.messages_count
 }
 })

 const todayChange = calculatePercentageChange(yesterdayResponses, todayResponses)

 return {
 monthlyResponses,
 monthlyChange,
 weeklyResponses,
 todayResponses,
 todayChange, // Добавляем изменение для "Today's AI Responses"
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
 logger.error('Failed to count agents', { organizationId, error })
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

export const getAgentById = async (
  agentId: string,
  organizationId: string,
): Promise<Agent | null> => {
  // Пытаемся получить из кэша
  const cached = await getCachedAgent(agentId, organizationId)
  if (cached) {
    return cached
  }

  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agents')
    .select(AGENT_SELECT_FIELDS)
    .eq('id', agentId)
    .eq('org_id', organizationId)
    .maybeSingle()

  if (error) {
    logger.error('Failed to fetch agent from Supabase', { agentId, organizationId, error })
    throw new Error('Не удалось загрузить агента')
  }

  if (!data) {
    return null
  }

  const agent = mapAgentRowToDomain(data as AgentRow)
  
  // Сохраняем в кэш (TTL 10 минут)
  await setCachedAgent(agentId, organizationId, agent, 600).catch(() => {
    // Игнорируем ошибки кэширования
  })

  return agent
}

export const updateAgentStatus = async (
 agentId: string,
 organizationId: string,
 status: Agent['status'],
): Promise<Agent> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agents')
 .update({ status, updated_at: new Date().toISOString() })
 .eq('id', agentId)
 .eq('org_id', organizationId)
 .select(AGENT_SELECT_FIELDS)
 .single()

 if (error) {
 logger.error('Failed to update agent status', { agentId, organizationId, status, error })
 throw new Error('Не удалось обновить статус агента')
 }

 if (!data) {
 throw new Error('Агент не найден')
 }

 return mapAgentRowToDomain(data as AgentRow)
}

export const createAgent = async (
 organizationId: string,
 agentData: {
 name: string
 status?: Agent['status']
 model?: string
 instructions?: string
 temperature?: number
 maxTokens?: number
 responseDelaySeconds?: number
 settings?: AgentSettings
 },
): Promise<Agent> => {
 const supabase = getSupabaseServiceRoleClient()

 const insertPayload = {
 org_id: organizationId,
 name: agentData.name,
 status: agentData.status ?? 'draft',
 default_model: agentData.model ?? null,
 instructions: agentData.instructions ?? null,
 system_prompt: agentData.instructions ?? null,
 temperature: agentData.temperature ?? 0.7,
 max_tokens: agentData.maxTokens ?? 2048,
 response_delay_seconds: agentData.responseDelaySeconds ?? 0,
 settings: agentData.settings ?? {},
 }

 const { data, error } = await supabase
 .from('agents')
 .insert(insertPayload)
 .select(AGENT_SELECT_FIELDS)
 .single()

 if (error) {
 logger.error('Failed to create agent', { organizationId, name: agentData.name, error })
 throw new Error('Не удалось создать агента')
 }

  if (!data) {
    throw new Error('Не удалось создать агента')
  }

  const agent = mapAgentRowToDomain(data as AgentRow)
  
  // Инвалидируем кэш при создании агента
  await invalidateAgentCache(agent.id, organizationId).catch(() => {
    // Игнорируем ошибки кэширования
  })

  return agent
}

export const updateAgent = async (
 agentId: string,
 organizationId: string,
 agentData: {
 name?: string
 status?: Agent['status']
 model?: string
 instructions?: string
 temperature?: number
 maxTokens?: number
 responseDelaySeconds?: number
 settings?: AgentSettings
 },
): Promise<Agent> => {
 const supabase = getSupabaseServiceRoleClient()

 const updatePayload: Record<string, unknown> = {
 updated_at: new Date().toISOString(),
 }

 if (agentData.name !== undefined) {
 updatePayload.name = agentData.name
 }

 if (agentData.status !== undefined) {
 updatePayload.status = agentData.status
 }

 if (agentData.model !== undefined) {
 updatePayload.default_model = agentData.model
 }

 if (agentData.instructions !== undefined) {
 updatePayload.instructions = agentData.instructions
 updatePayload.system_prompt = agentData.instructions
 }

 if (agentData.temperature !== undefined) {
 updatePayload.temperature = agentData.temperature
 }

 if (agentData.maxTokens !== undefined) {
 updatePayload.max_tokens = agentData.maxTokens
 }

 if (agentData.responseDelaySeconds !== undefined) {
 updatePayload.response_delay_seconds = agentData.responseDelaySeconds
 }

 if (agentData.settings !== undefined) {
 updatePayload.settings = agentData.settings
 }

 const { data, error } = await supabase
 .from('agents')
 .update(updatePayload)
 .eq('id', agentId)
 .eq('org_id', organizationId)
 .select(AGENT_SELECT_FIELDS)
 .single()

 if (error) {
 logger.error('Failed to update agent', { agentId, organizationId, error })
 throw new Error('Не удалось обновить агента')
 }

 if (!data) {
 throw new Error('Агент не найден')
 }

 return mapAgentRowToDomain(data as AgentRow)
}

export const deleteAgent = async (agentId: string, organizationId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('agents')
 .delete()
 .eq('id', agentId)
 .eq('org_id', organizationId)

 if (error) {
 logger.error('Failed to delete agent', { agentId, organizationId, error })
 throw new Error('Не удалось удалить агента')
 }
}

export type { AgentListParams, AgentListResult, ActivitySummaryItem, ActivitySeriesPoint }
