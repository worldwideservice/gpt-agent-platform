/**
 * Сервис расширенной аналитики
 * Сбор метрик, генерация отчетов и экспорт данных
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface AnalyticsMetric {
 id: string
 org_id: string
 metric_type: string
 value: number
 dimensions: Record<string, any>
 timestamp: string
 metadata: Record<string, any>
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
 data: Record<string, any>
 generated_at: string
 metadata: Record<string, any>
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
 dimensions: Record<string, any> = {},
 metadata: Record<string, any> = {},
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
 dimensions?: Record<string, any>,
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
 .then(result => result.data || []),

 // Статистика сообщений
 supabase
 .from('conversation_messages')
 .select('id, conversation_id, role, created_at')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())
 .then(result => result.data || []),

 // Статистика токенов
 supabase
 .from('message_tokens')
 .select('conversation_id, tokens_used, created_at')
 .eq('org_id', orgId)
 .gte('created_at', startDate.toISOString())
 .lte('created_at', endDate.toISOString())
 .then(result => result.data || []),

 // Метрики производительности
 getMetrics(orgId, ['response_time', 'resolution_time', 'satisfaction'], startDate, endDate),
 ])

 // Обрабатываем данные агентов
 const agents = agentsResult.data ?? []
 const activeAgents = agents.filter((agent: any) => agent.is_active)

 // Обрабатываем данные токенов
 const totalTokensUsed = tokens.reduce((sum: number, record: any) => sum + (record.tokens_used || 0), 0)

 // Обрабатываем метрики производительности
 const performanceMetrics = performanceData

 // Вычисляем среднее время ответа
 const responseTimes = performanceMetrics
 .filter(m => m.metric_type === 'response_time')
 .map(m => m.value)
 const averageResponseTime = responseTimes.length > 0
 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
 : 0

 // Вычисляем уровень удовлетворенности
 const satisfactionScores = performanceMetrics
 .filter(m => m.metric_type === 'satisfaction')
 .map(m => m.value)
 const customerSatisfaction = satisfactionScores.length > 0
 ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
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
 ? (conversations.filter((c: any) => c.status === 'completed').length / conversations.length) * 100
 : 0,
 topPerformingAgents,
 usageByPeriod,
 performanceMetrics: {
 averageFirstResponseTime: averageResponseTime,
 averageResolutionTime: 0, // TODO: реализовать
 customerSatisfaction,
 automationRate: 0, // TODO: реализовать
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

 return (data ?? []).map((agent: any) => ({
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

 return (data ?? []).map((record: any) => ({
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
 let reportData: Record<string, any> = {}

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
): Promise<Record<string, any>> => {
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
): Promise<Record<string, any>> => {
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
): Promise<Record<string, any>> => {
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
): Promise<Record<string, any>> => {
 // Получаем данные из биллинга
 const { getUsageStats } = await import('./billing')
 const usageStats = await getUsageStats(orgId, startDate, endDate)

 return {
 usage: usageStats,
 revenue: {
 // TODO: рассчитать доход на основе использования и тарифов
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
 data: Record<string, any>,
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
const convertToCSV = (data: Record<string, any>): string => {
 const rows: string[] = []

 const flattenObject = (obj: any, prefix = ''): Array<[string, any]> => {
 const result: Array<[string, any]> = []

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


