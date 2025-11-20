import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
// Removed agent dependencies - will be reimplemented for new architecture
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

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export const createDemoWorkspaceSummary = (_organizationId: string): WorkspaceSummary => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const timestamp = now.toISOString()

  return {
    agents: {
      total: 3,
      active: 3,
      inactive: 0,
    },
    knowledge: {
      categories: 2,
      publishedArticles: 5,
      pendingAssets: 1,
    },
    integrations: {
      kommoConnected: true,
      kommoDomain: 'demo.kommo.com',
      lastWebhookEvent: {
        id: 'demo-webhook-event',
        eventType: 'demo.event.processed',
        status: 'processed',
        createdAt: timestamp,
        error: null,
      },
      webhookHistory: [
        {
          id: 'demo-webhook-1',
          eventType: 'demo.event.processed',
          status: 'processed',
          createdAt: timestamp,
        },
        {
          id: 'demo-webhook-2',
          eventType: 'demo.event.failed',
          status: 'failed',
          createdAt: timestamp,
        },
      ],
      webhookSuccessRate: 50,
    },
    knowledgeTimeline: [
      {
        date: today,
        count: 2,
        pending: 1,
      },
    ],
    knowledgeHeatmap: [
      {
        date: today,
        count: 2,
        pending: 1,
        intensity: 100,
      },
    ],
  }
}

export const getWorkspaceSummary = async (organizationId: string): Promise<WorkspaceSummary> => {
  if (isDemoEnvironment()) {
    return createDemoWorkspaceSummary(organizationId)
  }

  const supabase = getSupabaseServiceRoleClient()

  const [
    knowledgeStats,
    crmData,
    webhookLatestResult,
    webhookHistoryResult,
    documentsResult,
  ] = await Promise.all([
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
      .from('documents')
      .select('created_at, status')
      .eq('org_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const lastWebhook = (webhookLatestResult.data ?? [])[0]
  const webhookHistory = (webhookHistoryResult.data ?? []).slice(0, 5)

  const dayMs = 1000 * 60 * 60 * 24
  const today = new Date()
  const threshold = new Date(today.getTime() - dayMs * 7)
  const timelineMap = new Map<string, { count: number; pending: number }>()

  for (const doc of documentsResult.data ?? []) {
    const createdAt = doc.created_at ? new Date(doc.created_at) : null
    if (!createdAt || createdAt < threshold) continue
    const day = createdAt.toISOString().split('T')[0]
    const entry = timelineMap.get(day) ?? { count: 0, pending: 0 }
    entry.count += 1
    if (doc.status === 'pending' || doc.status === 'processing') {
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
      total: 0,
      active: 0,
      inactive: 0,
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
