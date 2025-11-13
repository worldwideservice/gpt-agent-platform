import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react', () => ({
  cache: <T extends (...args: any[]) => any>(fn: T) => fn,
}))

const mockGetDashboardStats = vi.fn()
const mockGetWorkspaceSummary = vi.fn()
const mockListAgents = vi.fn()
const mockGetKnowledgeOverview = vi.fn()
const mockGetIntegrationOverview = vi.fn()

vi.mock('@/lib/repositories/agents', () => ({
  getDashboardStats: mockGetDashboardStats,
}))

vi.mock('@/lib/repositories/manage-summary', () => ({
  getWorkspaceSummary: mockGetWorkspaceSummary,
}))

vi.mock('@/lib/services/agents', () => ({
  listAgents: mockListAgents,
}))

vi.mock('@/lib/services/knowledge', () => ({
  getKnowledgeOverview: mockGetKnowledgeOverview,
}))

vi.mock('@/lib/services/integrations', () => ({
  getIntegrationOverview: mockGetIntegrationOverview,
}))

const {
  loadManageDashboardData,
  loadManageAgentsData,
  loadManageKnowledgeData,
  loadManageIntegrationsData,
} = await import('@/lib/repositories/manage-data')

const summaryMock = {
  agents: { total: 5, active: 4, inactive: 1 },
  knowledge: { categories: 3, publishedArticles: 4, pendingAssets: 2 },
  integrations: {
    kommoConnected: true,
    kommoDomain: 'demo',
    webhookHistory: [],
    webhookSuccessRate: 100,
  },
  knowledgeTimeline: [],
  knowledgeHeatmap: [],
}

describe('manage-data repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('возвращает метрики дашборда и сводку', async () => {
    mockGetDashboardStats.mockResolvedValueOnce({ totalAgents: 5 })
    mockGetWorkspaceSummary.mockResolvedValueOnce(summaryMock)

    const result = await loadManageDashboardData('org-1')

    expect(result.stats.totalAgents).toBe(5)
    expect(result.summary).toEqual(summaryMock)
    expect(result.error).toBeUndefined()
  })

  it('возвращает запасные значения при ошибке', async () => {
    mockGetDashboardStats.mockRejectedValueOnce(new Error('boom'))
    mockGetWorkspaceSummary.mockResolvedValueOnce(summaryMock)

    const result = await loadManageDashboardData('org-1')

    expect(result.stats).toEqual({
      monthlyResponses: 0,
      monthlyChange: 0,
      weeklyResponses: 0,
      todayResponses: 0,
      todayChange: 0,
      totalAgents: 0,
    })
    expect(result.summary).toEqual(summaryMock)
    expect(result.error).toBe('fetchFailed')
  })

  it('подготавливает данные для страницы агентов', async () => {
    mockListAgents.mockResolvedValueOnce({
      agents: [
        { id: 'a1', name: 'Agent', status: 'active', model: 'gpt-4', ownerName: 'Lead', updatedAt: '2024-01-01' },
      ],
      total: 1,
    })
    mockGetWorkspaceSummary.mockResolvedValueOnce(summaryMock)

    const result = await loadManageAgentsData('org-1')

    expect(result.agents).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.summary).toEqual(summaryMock)
    expect(result.error).toBeUndefined()
  })

  it('обрабатывает ошибки загрузки агентов', async () => {
    mockListAgents.mockRejectedValueOnce(new Error('network'))
    mockGetWorkspaceSummary.mockRejectedValueOnce(new Error('fail'))

    const result = await loadManageAgentsData('org-1')

    expect(result.agents).toEqual([])
    expect(result.total).toBe(0)
    expect(result.summary).toBeNull()
    expect(result.error).toBe('fetchFailed')
  })

  it('агрегирует данные для базы знаний и fallback для агентов', async () => {
    mockGetKnowledgeOverview.mockResolvedValueOnce({
      stats: { documents: 2 },
      categories: [{ id: 'cat', name: 'Category' }],
      articles: [{ id: 'art', title: 'Article' }],
      history: [{ id: 'asset', createdAt: '2024-01-01', agentId: 'a1' }],
      agentOptions: [{ id: 'a1', name: 'Agent 1' }],
    })
    mockListAgents.mockRejectedValueOnce(new Error('supabase down'))
    mockGetWorkspaceSummary.mockResolvedValueOnce(summaryMock)

    const result = await loadManageKnowledgeData('org-1')

    expect(result.stats).toEqual({ documents: 2 })
    expect(result.categories).toHaveLength(1)
    expect(result.articles).toHaveLength(1)
    expect(result.history).toHaveLength(1)
    expect(result.agentOptions).toEqual([{ id: 'a1', name: 'Agent 1' }])
    expect(result.summary).toEqual(summaryMock)
    expect(result.error).toBeUndefined()
  })

  it('возвращает пустые данные при ошибке всех источников знаний', async () => {
    mockGetKnowledgeOverview.mockRejectedValueOnce(new Error('no data'))
    mockListAgents.mockRejectedValueOnce(new Error('no agents'))
    mockGetWorkspaceSummary.mockRejectedValueOnce(new Error('no summary'))

    const result = await loadManageKnowledgeData('org-1')

    expect(result.stats).toBeNull()
    expect(result.categories).toEqual([])
    expect(result.articles).toEqual([])
    expect(result.history).toEqual([])
    expect(result.agentOptions).toEqual([])
    expect(result.summary).toBeNull()
    expect(result.error).toBe('fetchFailed')
  })

  it('собирает данные интеграций и игнорирует ошибки', async () => {
    mockGetWorkspaceSummary.mockResolvedValueOnce(summaryMock)
    mockGetIntegrationOverview.mockResolvedValueOnce({ provider: 'kommo', connected: true, connection: {}, credentials: {} })

    const result = await loadManageIntegrationsData('org-1')

    expect(result.summary).toEqual(summaryMock)
    expect(result.integrations).toHaveLength(1)
    expect(result.error).toBeUndefined()
  })

  it('отмечает ошибку интеграций при сбоях', async () => {
    mockGetWorkspaceSummary.mockRejectedValueOnce(new Error('no summary'))
    mockGetIntegrationOverview.mockRejectedValueOnce(new Error('down'))

    const result = await loadManageIntegrationsData('org-1')

    expect(result.summary).toBeNull()
    expect(result.integrations).toEqual([])
    expect(result.error).toBe('fetchFailed')
  })
})
