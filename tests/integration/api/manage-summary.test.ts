import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/manage-summary', () => ({
  getWorkspaceSummary: vi.fn(),
  createDemoWorkspaceSummary: vi.fn(),
}))

describe('API: /api/manage/[tenantId]/summary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Очищаем env переменные
    delete process.env.DEMO_MODE
    delete process.env.E2E_ONBOARDING_FAKE
    delete process.env.PLAYWRIGHT_DEMO_MODE
  })

  afterEach(() => {
    delete process.env.DEMO_MODE
    delete process.env.E2E_ONBOARDING_FAKE
    delete process.env.PLAYWRIGHT_DEMO_MODE
  })

  describe('GET /api/manage/[tenantId]/summary', () => {
    it('должен вернуть 401 если не авторизован (не demo mode)', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('должен вернуть 403 если tenantId не совпадает с orgId', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-456',
          email: 'test@example.com',
        },
      } as any)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Доступ запрещён')
    })

    it('должен вернуть summary для авторизованного пользователя', async () => {
      const { auth } = await import('@/auth')
      const { getWorkspaceSummary } = await import('@/lib/repositories/manage-summary')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const mockSummary = {
        agents: {
          total: 5,
          active: 3,
          inactive: 2,
        },
        knowledge: {
          categories: 3,
          publishedArticles: 10,
          pendingAssets: 2,
        },
        integrations: {
          kommoConnected: true,
          kommoDomain: 'example.kommo.com',
          webhookSuccessRate: 95,
        },
        knowledgeTimeline: [],
        knowledgeHeatmap: [],
      }

      vi.mocked(getWorkspaceSummary).mockResolvedValue(mockSummary)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSummary)
      expect(getWorkspaceSummary).toHaveBeenCalledWith('org-123')
    })

    it('должен вернуть 500 при ошибке загрузки summary', async () => {
      const { auth } = await import('@/auth')
      const { getWorkspaceSummary } = await import('@/lib/repositories/manage-summary')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getWorkspaceSummary).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить сводку рабочего пространства')
    })

    it('должен вернуть demo данные в DEMO_MODE=1', async () => {
      process.env.DEMO_MODE = '1'

      const { auth } = await import('@/auth')
      const { createDemoWorkspaceSummary } = await import('@/lib/repositories/manage-summary')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const mockDemoSummary = {
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
          webhookSuccessRate: 50,
        },
        knowledgeTimeline: [],
        knowledgeHeatmap: [],
      }

      vi.mocked(createDemoWorkspaceSummary).mockReturnValue(mockDemoSummary as any)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockDemoSummary)
      expect(createDemoWorkspaceSummary).toHaveBeenCalledWith('org-123')
    })

    it('должен вернуть demo данные в E2E_ONBOARDING_FAKE=true', async () => {
      process.env.E2E_ONBOARDING_FAKE = 'true'

      const { auth } = await import('@/auth')
      const { createDemoWorkspaceSummary } = await import('@/lib/repositories/manage-summary')

      vi.mocked(auth).mockResolvedValue(null)

      const mockDemoSummary = {
        agents: { total: 3, active: 3, inactive: 0 },
        knowledge: { categories: 2, publishedArticles: 5, pendingAssets: 1 },
        integrations: { kommoConnected: true, kommoDomain: 'demo.kommo.com', webhookSuccessRate: 50 },
        knowledgeTimeline: [],
        knowledgeHeatmap: [],
      }

      vi.mocked(createDemoWorkspaceSummary).mockReturnValue(mockDemoSummary as any)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/org-123/summary')

      const response = await route.GET(request, { params: { tenantId: 'org-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('должен использовать params.tenantId если нет session в demo mode', async () => {
      process.env.DEMO_MODE = '1'

      const { auth } = await import('@/auth')
      const { createDemoWorkspaceSummary } = await import('@/lib/repositories/manage-summary')

      vi.mocked(auth).mockResolvedValue(null)
      vi.mocked(createDemoWorkspaceSummary).mockReturnValue({} as any)

      const route = await import('@/app/api/manage/[tenantId]/summary/route')
      const request = new NextRequest('http://localhost:3000/api/manage/tenant-456/summary')

      await route.GET(request, { params: { tenantId: 'tenant-456' } })

      expect(createDemoWorkspaceSummary).toHaveBeenCalledWith('tenant-456')
    })
  })
})
