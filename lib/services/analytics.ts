/**
 * Сервис расширенной аналитики
 * Сбор метрик, генерация отчетов и экспорт данных
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Внутренние типы для данных из Supabase
interface AgentData {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

interface ConversationData {
  id: string
  agent_id: string
  created_at: string
  updated_at: string
  status: string
  channel?: string
}

interface MessageData {
  id: string
  conversation_id: string
  role: string
  created_at: string
}

interface TokenData {
  conversation_id: string
  tokens_used: number
  created_at: string
}

interface TopAgentData {
  agent_id: string
  name: string
  conversations_count: number
  messages_count: number
  tokens_used: number
}

interface UsageByPeriodData {
  period: string
  conversations: number
  messages: number
  tokens: number
}

export interface AnalyticsMetric {
 id: string
 org_id: string
 metric_type: string
 value: number
 dimensions: Record<string, unknown>
 timestamp: string
 metadata: Record<string, unknown>
}

export interface AnalyticsReport {
 id: string
 org_id: string
 report_type: 'usage' | 'performance' | 'engagement' | 'revenue'
 title: string
 description?: string
 date_range: {
 start: string
 end: string
 }
 data: Record<string, unknown>
 generated_at: string
 metadata: Record<string, unknown>
}

export interface DashboardStats {
 totalAgents: number
 activeAgents: number
 totalConversations: number
 totalMessages: number
 totalTokensUsed: number
 averageResponseTime: number
 successRate: number
 topPerformingAgents: Array<{
 agentId: string
 name: string
 conversationsCount: number
 messagesCount: number
 tokensUsed: number
 }>
 usageByPeriod: Array<{
 period: string
 conversations: number
 messages: number
 tokens: number
 }>
 performanceMetrics: {
 averageFirstResponseTime: number
 averageResolutionTime: number
 customerSatisfaction: number
 automationRate: number
 }
 channelBreakdown: Array<{
 channel: string
 conversations: number
 messages: number
 }>
}

/**
 * Записывает метрику аналитики
 */
export const recordMetric = async (
 orgId: string,
 metricType: string,
 value: number,
 dimensions: Record<string, unknown> = {},
 metadata: Record<string, unknown> = {},
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const { error } = await supabase
 .from('analytics_metrics')
 .insert({
 org_id: orgId,
 metric_type: metricType,
 value,
 dimensions,
 metadata,
 })

 return !error
 } catch (error) {
 console.error('Error recording metric', error)
 return false
 }
}

/**
 * Получает метрики за период
 */
export const getMetrics = async (
 orgId: string,
 metricTypes: string[],
 startDate: Date,
 endDate: Date,
 dimensions?: Record<string, unknown>,
): Promise<AnalyticsMetric[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('analytics_metrics')
 .select('*')
 .eq('org_id', orgId)
 .in('metric_type', metricTypes)
 .gte('timestamp', startDate.toISOString())
 .lte('timestamp', endDate.toISOString())
 .order('timestamp', { ascending: true })

 if (dimensions) {
 // Фильтрация по измерениям (простая версия)
 Object.entries(dimensions).forEach(([key, value]) => {
 query = query.eq(`dimensions->>${key}`, value)
 })
 }

 const { data, error } = await query

 if (error) {
 console.error('Error getting metrics', error)
 return []
 }

 return data ?? []
}

/**
 * Генерирует статистику дашборда
 */
export const generateDashboardStats = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<DashboardStats> => {
 const supabase = getSupabaseServiceRoleClient()

 // Параллельно получаем все необходимые данные
 const [
 agentsResult,
 conversations,
 messages,
 tokens,
 performanceData,
 ] = await Promise.all([
 // Статистика агентов
 supabase
 .from('agents')
 .select('id, name, is_active, created_at')
 .eq('org_id', orgId),

 // Статистика разговоров
 supabase
 .from('agent_conversations')
 .select('id, agent_id, created_at, updated_at, status')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())
 .then((result: { data: ConversationData[] | null }) => (result.data || []) as ConversationData[]),

 // Статистика сообщений
 supabase
 .from('conversation_messages')
 .select('id, conversation_id, role, created_at')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())
 .then((result: { data: MessageData[] | null }) => (result.data || []) as MessageData[]),

 // Статистика токенов
 supabase
 .from('message_tokens')
 .select('conversation_id, tokens_used, created_at')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())
 .then((result: { data: TokenData[] | null }) => (result.data || []) as TokenData[]),

 // Метрики производительности
 getMetrics(orgId, ['response_time', 'resolution_time', 'satisfaction'], startDate, endDate),
 ])

 // Обрабатываем данные агентов
 const agents = (agentsResult.data ?? []) as AgentData[]
 const activeAgents = agents.filter(agent => agent.is_active)

 // Обрабатываем данные токенов
 const totalTokensUsed = tokens.reduce((sum: number, record: TokenData) => sum + (record.tokens_used || 0), 0)

 // Обрабатываем метрики производительности
 const performanceMetrics = performanceData

 // Вычисляем среднее время ответа
 const responseTimes = performanceMetrics
 .filter((m: AnalyticsMetric) => m.metric_type === 'response_time')
 .map((m: AnalyticsMetric) => m.value)
 const averageResponseTime = responseTimes.length > 0
 ? responseTimes.reduce((sum: number, time: number) => sum + time, 0) / responseTimes.length
 : 0

 // Вычисляем уровень удовлетворенности
 const satisfactionScores = performanceMetrics
 .filter((m: AnalyticsMetric) => m.metric_type === 'satisfaction')
 .map((m: AnalyticsMetric) => m.value)
 const customerSatisfaction = satisfactionScores.length > 0
 ? satisfactionScores.reduce((sum: number, score: number) => sum + score, 0) / satisfactionScores.length
 : 0

 // Вычисляем среднее время разрешения (resolution time)
 const completedConversations = conversations.filter((c: ConversationData) => c.status === 'completed' || c.status === 'resolved')
 const resolutionTimes = completedConversations
 .filter((c: ConversationData) => c.created_at && c.updated_at)
 .map((c: ConversationData) => {
 const start = new Date(c.created_at).getTime()
 const end = new Date(c.updated_at).getTime()
 return (end - start) / 1000 // конвертируем в секунды
 })
 const averageResolutionTime = resolutionTimes.length > 0
 ? resolutionTimes.reduce((sum: number, time: number) => sum + time, 0) / resolutionTimes.length
 : 0

 // Вычисляем уровень автоматизации (automation rate)
 // Разговор считается автоматизированным, если в нем не было вмешательства человека (operator/human messages)
 const conversationIds = conversations.map((c: ConversationData) => c.id)
 const conversationsWithHumanIntervention = new Set(
 messages
 .filter((m: MessageData) => conversationIds.includes(m.conversation_id) && (m.role === 'operator' || m.role === 'human'))
 .map((m: MessageData) => m.conversation_id)
 )
 const fullyAutomatedConversations = conversations.length - conversationsWithHumanIntervention.size
 const automationRate = conversations.length > 0
 ? (fullyAutomatedConversations / conversations.length) * 100
 : 0

 // Получаем топ агентов
 const topPerformingAgents = await getTopPerformingAgents(orgId, startDate, endDate, 5)

 // Получаем использование по периодам
 const usageByPeriod = await getUsageByPeriod(orgId, startDate, endDate)

 // Получаем распределение по каналам
 const channelBreakdown = await getChannelBreakdown(orgId, startDate, endDate)

 return {
 totalAgents: agents.length,
 activeAgents: activeAgents.length,
 totalConversations: conversations.length,
 totalMessages: messages.length,
 totalTokensUsed,
 averageResponseTime,
 successRate: conversations.length > 0
 ? (conversations.filter((c: ConversationData) => c.status === 'completed').length / conversations.length) * 100
 : 0,
 topPerformingAgents,
 usageByPeriod,
 performanceMetrics: {
 averageFirstResponseTime: averageResponseTime,
 averageResolutionTime,
 customerSatisfaction,
 automationRate,
 },
 channelBreakdown,
 }
}

/**
 * Получает топ агентов по производительности
 */
const getTopPerformingAgents = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
 limit: number,
): Promise<DashboardStats['topPerformingAgents']> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .rpc('get_top_agents_performance', {
 p_org_id: orgId,
 p_start_date: startDate.toISOString(),
 p_end_date: endDate.toISOString(),
 p_limit: limit,
 })

 if (error) {
 console.error('Error getting top performing agents', error)
 return []
 }

 return ((data ?? []) as TopAgentData[]).map(agent => ({
 agentId: agent.agent_id,
 name: agent.name,
 conversationsCount: agent.conversations_count,
 messagesCount: agent.messages_count,
 tokensUsed: agent.tokens_used,
 }))
}

/**
 * Получает использование по периодам
 */
const getUsageByPeriod = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<DashboardStats['usageByPeriod']> => {
 const supabase = getSupabaseServiceRoleClient()

 // Группируем по дням
 const { data, error } = await supabase
 .rpc('get_usage_by_period', {
 p_org_id: orgId,
 p_start_date: startDate.toISOString(),
 p_end_date: endDate.toISOString(),
 p_period: 'day',
 })

 if (error) {
 console.error('Error getting usage by period', error)
 return []
 }

 return ((data ?? []) as UsageByPeriodData[]).map(record => ({
 period: record.period,
 conversations: record.conversations,
 messages: record.messages,
 tokens: record.tokens,
 }))
}

/**
 * Получает распределение по каналам
 */
const getChannelBreakdown = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<DashboardStats['channelBreakdown']> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_conversations')
 .select('channel')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())

 if (error) {
 console.error('Error getting channel breakdown', error)
 return []
 }

 // Группируем данные вручную
 const channelStats = new Map<string, { conversations: number; messages: number }>()

 for (const record of data ?? []) {
 const channel = record.channel || 'unknown'
 if (!channelStats.has(channel)) {
 channelStats.set(channel, { conversations: 0, messages: 0 })
 }
 const stats = channelStats.get(channel)!
 stats.conversations++
 // Для сообщений нужно будет отдельный запрос или расчет
 }

 return Array.from(channelStats.entries()).map(([channel, stats]) => ({
 channel,
 conversations: stats.conversations,
 messages: stats.messages,
 }))
}

/**
 * Генерирует отчет аналитики
 */
export const generateAnalyticsReport = async (
 orgId: string,
 reportType: AnalyticsReport['report_type'],
 startDate: Date,
 endDate: Date,
 title?: string,
 description?: string,
): Promise<AnalyticsReport | null> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 let reportData: Record<string, unknown> = {}

 switch (reportType) {
 case 'usage':
 reportData = await generateUsageReport(orgId, startDate, endDate)
 break
 case 'performance':
 reportData = await generatePerformanceReport(orgId, startDate, endDate)
 break
 case 'engagement':
 reportData = await generateEngagementReport(orgId, startDate, endDate)
 break
 case 'revenue':
 reportData = await generateRevenueReport(orgId, startDate, endDate)
 break
 }

 const report: Omit<AnalyticsReport, 'id'> = {
 org_id: orgId,
 report_type: reportType,
 title: title || getDefaultReportTitle(reportType),
 description,
 date_range: {
 start: startDate.toISOString(),
 end: endDate.toISOString(),
 },
 data: reportData,
 generated_at: new Date().toISOString(),
 metadata: {},
 }

 const { data, error } = await supabase
 .from('analytics_reports')
 .insert(report)
 .select('id')
 .single()

 if (error) {
 console.error('Error saving analytics report', error)
 return null
 }

 return { ...report, id: data.id }
 } catch (error) {
 console.error('Error generating analytics report', error)
 return null
 }
}

/**
 * Генерирует отчет по использованию
 */
const generateUsageReport = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<Record<string, unknown>> => {
 const dashboardStats = await generateDashboardStats(orgId, startDate, endDate)

 return {
 summary: {
 totalConversations: dashboardStats.totalConversations,
 totalMessages: dashboardStats.totalMessages,
 totalTokensUsed: dashboardStats.totalTokensUsed,
 averageResponseTime: dashboardStats.averageResponseTime,
 },
 agents: dashboardStats.topPerformingAgents,
 usageByPeriod: dashboardStats.usageByPeriod,
 channels: dashboardStats.channelBreakdown,
 }
}

/**
 * Генерирует отчет по производительности
 */
const generatePerformanceReport = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<Record<string, unknown>> => {
 const dashboardStats = await generateDashboardStats(orgId, startDate, endDate)

 return {
 metrics: dashboardStats.performanceMetrics,
 successRate: dashboardStats.successRate,
 responseTimes: await getMetrics(orgId, ['response_time'], startDate, endDate),
 resolutionTimes: await getMetrics(orgId, ['resolution_time'], startDate, endDate),
 }
}

/**
 * Генерирует отчет по вовлеченности
 */
const generateEngagementReport = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<Record<string, unknown>> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: engagementData } = await supabase
 .rpc('calculate_engagement_metrics', {
 p_org_id: orgId,
 p_start_date: startDate.toISOString(),
 p_end_date: endDate.toISOString(),
 })

 return {
 engagement: engagementData,
 conversationsByDay: await getUsageByPeriod(orgId, startDate, endDate),
 }
}

/**
 * Генерирует отчет по доходам
 */
const generateRevenueReport = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
): Promise<Record<string, unknown>> => {
 // Получаем данные из биллинга
 const { getUsageStats, getOrganizationSubscription, getBillingPlans } = await import('./billing')
 const usageStats = await getUsageStats(orgId, startDate, endDate)
 const subscription = await getOrganizationSubscription(orgId)

 // Рассчитываем доход
 let totalRevenue = 0
 let subscriptionRevenue = 0
 let overageCharges: Record<string, number> = {}

 if (subscription && subscription.status === 'active') {
 // Получаем план подписки
 const plans = await getBillingPlans()
 const plan = plans.find(p => p.id === subscription.plan_id)

 if (plan) {
 // Рассчитываем базовую стоимость подписки за период
 const periodStartMs = new Date(subscription.current_period_start).getTime()
 const periodEndMs = new Date(subscription.current_period_end).getTime()
 const reportStartMs = startDate.getTime()
 const reportEndMs = endDate.getTime()

 // Вычисляем долю периода подписки, покрываемую отчетом
 const overlapStart = Math.max(periodStartMs, reportStartMs)
 const overlapEnd = Math.min(periodEndMs, reportEndMs)
 const overlapDays = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24))
 const totalPeriodDays = (periodEndMs - periodStartMs) / (1000 * 60 * 60 * 24)

 // Пропорциональная стоимость подписки
 const planCost = plan.price_cents / 100 // конвертируем центы в основную валюту
 subscriptionRevenue = overlapDays > 0 ? (planCost * overlapDays) / totalPeriodDays : 0

 // Рассчитываем доп. charges за превышение лимитов (если есть)
 // Примерные цены за превышение (можно настроить):
 const overagePricing: Record<string, number> = {
 'ai_messages': 0.002, // $0.002 за сообщение
 'ai_tokens': 0.00001, // $0.00001 за токен
 'storage': 0.10, // $0.10 за GB
 }

 Object.entries(usageStats).forEach(([resourceType, usage]) => {
 const limit = plan.limits[resourceType as keyof typeof plan.limits] || 0
 if (usage > limit) {
 const overage = usage - limit
 const pricePerUnit = overagePricing[resourceType] || 0
 overageCharges[resourceType] = overage * pricePerUnit
 }
 })
 }
 }

 const totalOverage = Object.values(overageCharges).reduce((sum, charge) => sum + charge, 0)
 totalRevenue = subscriptionRevenue + totalOverage

 return {
 usage: usageStats,
 revenue: {
 total: parseFloat(totalRevenue.toFixed(2)),
 subscription: parseFloat(subscriptionRevenue.toFixed(2)),
 overage: parseFloat(totalOverage.toFixed(2)),
 overageDetails: Object.fromEntries(
 Object.entries(overageCharges).map(([key, value]) => [key, parseFloat(value.toFixed(2))])
 ),
 currency: subscription?.metadata?.currency || 'USD',
 period: {
 start: startDate.toISOString(),
 end: endDate.toISOString(),
 },
 },
 }
}

/**
 * Получает отчеты аналитики
 */
export const getAnalyticsReports = async (
 orgId: string,
 reportType?: AnalyticsReport['report_type'],
 limit = 50,
): Promise<AnalyticsReport[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('analytics_reports')
 .select('*')
 .eq('org_id', orgId)
 .order('generated_at', { ascending: false })
 .limit(limit)

 if (reportType) {
 query = query.eq('report_type', reportType)
 }

 const { data, error } = await query

 if (error) {
 console.error('Error getting analytics reports', error)
 return []
 }

 return data ?? []
}

/**
 * Экспортирует данные аналитики в различных форматах
 */
export const exportAnalyticsData = async (
 orgId: string,
 exportType: 'csv' | 'json' | 'pdf',
 data: Record<string, unknown>,
): Promise<string | null> => {
 try {
 switch (exportType) {
 case 'json':
 return JSON.stringify(data, null, 2)

 case 'csv':
 return convertToCSV(data)

 case 'pdf':
 // TODO: реализовать генерацию PDF
 return null

 default:
 return null
 }
 } catch (error) {
 console.error('Error exporting analytics data', error)
 return null
 }
}

/**
 * Преобразует данные в CSV
 */
const convertToCSV = (data: Record<string, unknown>): string => {
 const rows: string[] = []

 const flattenObject = (obj: unknown, prefix = ''): Array<[string, unknown]> => {
 const result: Array<[string, unknown]> = []

 if (typeof obj !== 'object' || obj === null) {
 return [[prefix, obj]]
 }

 for (const [key, value] of Object.entries(obj)) {
 const fullKey = prefix ? `${prefix}.${key}` : key

 if (Array.isArray(value)) {
 value.forEach((item, index) => {
 if (typeof item === 'object' && item !== null) {
 result.push(...flattenObject(item, `${fullKey}[${index}]`))
 } else {
 result.push([`${fullKey}[${index}]`, item])
 }
 })
 } else if (typeof value === 'object' && value !== null) {
 result.push(...flattenObject(value, fullKey))
 } else {
 result.push([fullKey, value])
 }
 }

 return result
 }

 const flattened = flattenObject(data)
 const headers = [...new Set(flattened.map(([key]) => key))]

 rows.push(headers.join(','))

 // Для простых экспортов создаем одну строку
 const values = headers.map(header => {
 const entry = flattened.find(([key]) => key === header)
 const value = entry ? entry[1] : ''
 return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
 })

 rows.push(values.join(','))

 return rows.join('\n')
}

/**
 * Получает заголовок отчета по умолчанию
 */
const getDefaultReportTitle = (reportType: AnalyticsReport['report_type']): string => {
 const titles = {
 usage: 'Отчет по использованию',
 performance: 'Отчет по производительности',
 engagement: 'Отчет по вовлеченности',
 revenue: 'Отчет по доходам',
 }

 return titles[reportType] || 'Аналитический отчет'
}


