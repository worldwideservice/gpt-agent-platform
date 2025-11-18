/**
 * Advanced Analytics Service
 * Time-series data, aggregations, and reporting
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Lazy initialization to avoid build-time errors
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase credentials')
    }

    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

export interface DashboardSummary {
  metric_name: string
  current_value: number
  previous_value: number
  change_percentage: number
}

export interface TimeSeriesData {
  timestamp: string
  value: number
}

export interface TopAgent {
  agent_id: string
  agent_name: string
  metric_value: number
  total_requests: number
}

export interface RetentionData {
  day: number
  users_retained: number
  retention_rate: number
}

/**
 * Get dashboard summary with period-over-period comparison
 */
export async function getDashboardSummary(
  orgId: string,
  startDate?: string,
  endDate?: string
): Promise<DashboardSummary[]> {
  try {
    const { data, error } = await getSupabaseClient().rpc('get_dashboard_summary', {
      p_org_id: orgId,
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Failed to get dashboard summary', { error, orgId })
    throw error
  }
}

/**
 * Get time-series data for charts
 */
export async function getTimeSeriesData(
  orgId: string,
  metric: 'requests' | 'tokens' | 'cost' | 'rating',
  startDate?: string,
  endDate?: string,
  granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<TimeSeriesData[]> {
  try {
    const { data, error } = await getSupabaseClient().rpc('get_time_series_data', {
      p_org_id: orgId,
      p_metric: metric,
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
      p_granularity: granularity,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Failed to get time series data', { error, orgId, metric })
    throw error
  }
}

/**
 * Get top performing agents
 */
export async function getTopAgents(
  orgId: string,
  metric: 'requests' | 'conversions' | 'rating' = 'requests',
  limit: number = 10,
  startDate?: string,
  endDate?: string
): Promise<TopAgent[]> {
  try {
    const { data, error } = await getSupabaseClient().rpc('get_top_agents', {
      p_org_id: orgId,
      p_metric: metric,
      p_limit: limit,
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Failed to get top agents', { error, orgId, metric })
    throw error
  }
}

/**
 * Calculate retention rates
 */
export async function calculateRetention(
  orgId: string,
  cohortDate: string
): Promise<RetentionData[]> {
  try {
    const { data, error } = await getSupabaseClient().rpc('calculate_retention', {
      p_org_id: orgId,
      p_cohort_date: cohortDate,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Failed to calculate retention', { error, orgId, cohortDate })
    throw error
  }
}

/**
 * Track user activity event
 */
export async function trackActivity(
  orgId: string,
  eventType: string,
  metadata?: Record<string, any>,
  userId?: string,
  sessionId?: string,
  agentId?: string
): Promise<void> {
  try {
    const { error } = await getSupabaseClient().from('user_activity').insert({
      org_id: orgId,
      user_id: userId,
      session_id: sessionId,
      event_type: eventType,
      event_metadata: metadata,
      agent_id: agentId,
    })

    if (error) throw error

    logger.debug('Activity tracked', { orgId, eventType })
  } catch (error) {
    logger.error('Failed to track activity', { error, orgId, eventType })
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Export analytics data as CSV
 */
export async function exportAnalytics(
  orgId: string,
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' = 'csv'
): Promise<string> {
  try {
    // Get all analytics data
    const { data, error } = await supabase
      .from('org_analytics')
      .select('*')
      .eq('org_id', orgId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) throw error

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    }

    // Convert to CSV
    if (!data || data.length === 0) {
      return 'No data'
    }

    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]

    for (const row of data) {
      const values = headers.map((header) => {
        const value = (row as any)[header]
        return typeof value === 'string' ? `"${value}"` : value
      })
      csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
  } catch (error) {
    logger.error('Failed to export analytics', { error, orgId })
    throw error
  }
}

/**
 * Get agent comparison data
 */
export async function getAgentComparison(
  orgId: string,
  agentIds: string[],
  startDate: string,
  endDate: string
): Promise<any[]> {
  try {
    const results = []

    for (const agentId of agentIds) {
      const { data, error } = await supabase
        .from('agent_analytics')
        .select('*')
        .eq('org_id', orgId)
        .eq('agent_id', agentId)
        .gte('date', startDate)
        .lte('date', endDate)
        .is('hour', null) // Daily aggregates only

      if (error) throw error

      // Aggregate metrics
      const stats = (data || []).reduce(
        (acc, row) => ({
          total_requests: acc.total_requests + (row.total_requests || 0),
          total_tokens: acc.total_tokens + (row.total_tokens || 0),
          total_cost: acc.total_cost + (row.total_cost_cents || 0) / 100,
          avg_rating:
            acc.ratings.length > 0
              ? acc.ratings.reduce((a, b) => a + b, 0) / acc.ratings.length
              : 0,
          conversions: acc.conversions + (row.conversions || 0),
          ratings: row.avg_rating
            ? [...acc.ratings, row.avg_rating]
            : acc.ratings,
        }),
        {
          total_requests: 0,
          total_tokens: 0,
          total_cost: 0,
          avg_rating: 0,
          conversions: 0,
          ratings: [] as number[],
        }
      )

      results.push({
        agent_id: agentId,
        ...stats,
      })
    }

    return results
  } catch (error) {
    logger.error('Failed to get agent comparison', { error, orgId })
    throw error
  }
}

/**
 * Get real-time metrics (last hour)
 */
export async function getRealtimeMetrics(orgId: string): Promise<any> {
  try {
    const now = new Date()
    const currentHour = now.getHours()
    const today = now.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('org_analytics')
      .select('*')
      .eq('org_id', orgId)
      .eq('date', today)
      .eq('hour', currentHour)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data || {
      total_requests: 0,
      successful_requests: 0,
      failed_requests: 0,
      total_tokens: 0,
      total_cost_cents: 0,
      active_users: 0,
    }
  } catch (error) {
    logger.error('Failed to get realtime metrics', { error, orgId })
    throw error
  }
}
