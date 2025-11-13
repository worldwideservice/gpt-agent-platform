import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetKnowledgeBaseStats = vi.fn()
const mockGetKnowledgeBaseCategories = vi.fn()
const mockGetKnowledgeBaseArticles = vi.fn()
const mockGetAgentAssetsForOrganization = vi.fn()
const mockListAgents = vi.fn()

vi.mock('@/lib/repositories/knowledge-base', () => ({
  getKnowledgeBaseStats: mockGetKnowledgeBaseStats,
  getKnowledgeBaseCategories: mockGetKnowledgeBaseCategories,
  getKnowledgeBaseArticles: mockGetKnowledgeBaseArticles,
}))

vi.mock('@/lib/repositories/agent-assets', () => ({
  getAgentAssetsForOrganization: mockGetAgentAssetsForOrganization,
}))

vi.mock('@/lib/services/agents', () => ({
  listAgents: mockListAgents,
}))

const { getKnowledgeOverview } = await import('@/lib/services/knowledge')

describe('KnowledgeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('требует идентификатор организации', async () => {
    await expect(getKnowledgeOverview('', {})).rejects.toThrow('Требуется идентификатор организации')
  })

  it('агрегирует данные из всех источников и возвращает агентов', async () => {
    mockGetKnowledgeBaseStats.mockResolvedValueOnce({ categoriesCount: 2 })
    mockGetKnowledgeBaseCategories.mockResolvedValueOnce([{ id: 'cat', name: 'Category' }])
    mockGetKnowledgeBaseArticles.mockResolvedValueOnce([
      { id: 'article-1', title: 'Article 1' },
      { id: 'article-2', title: 'Article 2' },
    ])
    mockGetAgentAssetsForOrganization.mockResolvedValueOnce([{ id: 'asset', createdAt: '2024-01-01' }])
    mockListAgents.mockResolvedValueOnce({ agents: [{ id: 'a1', name: 'Agent 1' }], total: 1 })

    const result = await getKnowledgeOverview('org-1', { articlesLimit: 1, historyLimit: 5 })

    expect(result.stats).toEqual({ categoriesCount: 2 })
    expect(result.categories).toHaveLength(1)
    expect(result.articles).toHaveLength(1)
    expect(result.history).toHaveLength(1)
    expect(result.agentOptions).toEqual([{ id: 'a1', name: 'Agent 1' }])
    expect(mockListAgents).toHaveBeenCalledWith('org-1', { limit: 50 })
    expect(mockGetAgentAssetsForOrganization).toHaveBeenCalledWith('org-1', 5)
  })

  it('использует заглушки при сбоях отдельных источников', async () => {
    mockGetKnowledgeBaseStats.mockRejectedValueOnce(new Error('stats'))
    mockGetKnowledgeBaseCategories.mockResolvedValueOnce([])
    mockGetKnowledgeBaseArticles.mockResolvedValueOnce([])
    mockGetAgentAssetsForOrganization.mockRejectedValueOnce(new Error('assets'))
    mockListAgents.mockResolvedValueOnce({ agents: [], total: 0 })

    const result = await getKnowledgeOverview('org-1')

    expect(result.stats).toBeNull()
    expect(result.categories).toEqual([])
    expect(result.history).toEqual([])
    expect(result.agentOptions).toEqual([])
  })

  it('пропускает загрузку агентов, если опция выключена', async () => {
    mockGetKnowledgeBaseStats.mockResolvedValueOnce(null)
    mockGetKnowledgeBaseCategories.mockResolvedValueOnce([])
    mockGetKnowledgeBaseArticles.mockResolvedValueOnce([])
    mockGetAgentAssetsForOrganization.mockResolvedValueOnce([])

    const result = await getKnowledgeOverview('org-1', { includeAgentOptions: false })

    expect(result.agentOptions).toEqual([])
    expect(mockListAgents).not.toHaveBeenCalled()
  })

  it('оборачивает критические ошибки в пользовательское исключение', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetKnowledgeBaseStats.mockImplementationOnce(() => {
      throw new Error('fatal')
    })

    await expect(getKnowledgeOverview('org-1')).rejects.toThrow('Не удалось загрузить данные базы знаний')
    consoleSpy.mockRestore()
  })
})
