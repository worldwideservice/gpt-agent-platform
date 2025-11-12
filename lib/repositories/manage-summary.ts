import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { getDashboardStats } from '@/lib/repositories/agents'
import { getKnowledgeBaseStats } from '@/lib/repositories/knowledge-base'

export interface WorkspaceSummary {
  agents: {
    total: number
    active: number
    inactive: number
  }
  knowledge: {
    categories: number
    publishedArticles: number
    pendingAssets: number
  }
  integrations: {
    kommoConnected: boolean
    kommoDomain?: string | null
    lastWebhookEvent?: {
      id: string
      eventType: string
      status: string
      error?: string | null
      createdAt?: string | null
    }
    webhookHistory?: Array<{
      id: string
      eventType: string
      status: string
      createdAt?: string | null
    }>
    webhookSuccessRate: number
  }
  knowledgeTimeline: Array<{
    date: string
    count: number
    pending: number
  }>
  knowledgeHeatmap: Array<{
    date: string
    count: number
    pending: number
    intensity: number
  }>
}

export const getWorkspaceSummary = async (organizationId: string): Promise<WorkspaceSummary> => {
  const supabase = getSupabaseServiceRoleClient()

  const [
    dashboardStats,
    knowledgeStats,
    crmData,
    webhookLatestResult,
    webhookHistoryResult,
    agentAssetsResult,
  ] = await Promise.all([
    getDashboardStats(organizationId).catch(() => null),
    getKnowledgeBaseStats(organizationId).catch(() => ({
      categoriesCount: 0,
      publishedArticlesCount: 0,
      pendingAssetsCount: 0,
    })),
    getCrmConnectionData(organizationId),
    supabase
      .from('webhook_events')
      .select('id, event_type, status, error, created_at')
      .eq('org_id', organizationId)
      .eq('provider', 'kommo')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('webhook_events')
      .select('id, event_type, status, created_at')
      .eq('org_id', organizationId)
      .eq('provider', 'kommo')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('agent_assets')
      .select('created_at, status')
      .eq('org_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const totalAgents = dashboardStats?.totalAgents ?? 0
  const lastWebhook = (webhookLatestResult.data ?? [])[0]
  const webhookHistory = (webhookHistoryResult.data ?? []).slice(0, 5)

  const dayMs = 1000 * 60 * 60 * 24
  const today = new Date()
  const threshold = new Date(today.getTime() - dayMs * 7)
  const timelineMap = new Map<string, { count: number; pending: number }>()

  for (const asset of agentAssetsResult.data ?? []) {
    const createdAt = asset.created_at ? new Date(asset.created_at) : null
    if (!createdAt || createdAt < threshold) continue
    const day = createdAt.toISOString().split('T')[0]
    const entry = timelineMap.get(day) ?? { count: 0, pending: 0 }
    entry.count += 1
    if (asset.status === 'pending' || asset.status === 'processing') {
      entry.pending += 1
    }
    timelineMap.set(day, entry)
  }

  const knowledgeTimeline = Array.from(timelineMap.entries())
    .map(([date, { count, pending }]) => ({ date, count, pending }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
  const maxCount = Math.max(...knowledgeTimeline.map((entry) => entry.count), 1)
  const knowledgeHeatmap = knowledgeTimeline
    .slice()
    .reverse()
    .map((entry) => ({
      ...entry,
      intensity: Math.round((entry.count / maxCount) * 100),
    }))

  const webhookSuccessRate =
    webhookHistory.length === 0
      ? 100
      : Math.round(
          (webhookHistory.filter((event) => event.status?.toLowerCase() === 'processed').length / webhookHistory.length) *
            100,
        )

  return {
    agents: {
      total: totalAgents,
      active: dashboardStats?.totalAgents ?? 0,
      inactive: Math.max(totalAgents - (dashboardStats?.totalAgents ?? 0), 0),
    },
    knowledge: {
      categories: knowledgeStats.categoriesCount,
      publishedArticles: knowledgeStats.publishedArticlesCount,
      pendingAssets: knowledgeStats.pendingAssetsCount,
    },
    integrations: {
      kommoConnected: Boolean(crmData.connection),
      kommoDomain: crmData.connection?.base_domain ?? null,
      lastWebhookEvent: lastWebhook
        ? {
            id: lastWebhook.id,
            eventType: lastWebhook.event_type,
            status: lastWebhook.status,
            error: lastWebhook.error ?? null,
            createdAt: lastWebhook.created_at ?? null,
          }
        : undefined,
      webhookHistory: webhookHistory.map((event) => ({
        id: event.id,
        eventType: event.event_type,
        status: event.status,
        createdAt: event.created_at ?? null,
      })),
      webhookSuccessRate,
    },
    knowledgeTimeline,
    knowledgeHeatmap,
  }
}
