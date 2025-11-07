import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock KommoAPI
const mockKommoApiInstance = {
  getUsers: vi.fn(),
  getPipelines: vi.fn(),
  getLeadsStats: vi.fn(),
  getBaseUrl: vi.fn(),
}

vi.mock('@/lib/crm/kommo', () => ({
  KommoAPI: class MockKommoAPI {
    constructor() {
      return mockKommoApiInstance
    }
  },
}))

// Mock kommo-test config
vi.mock('@/lib/env/kommo-test', () => ({
  evaluateKommoTestConfig: vi.fn(),
}))

describe('API: /api/test-kommo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/test-kommo', () => {
    it('should return 503 if test is not enabled', async () => {
      const { evaluateKommoTestConfig } = await import('@/lib/env/kommo-test')
      vi.mocked(evaluateKommoTestConfig).mockReturnValue({
        enabled: false,
        message: 'Kommo test is disabled',
        status: 503,
      } as any)

      const route = await import('@/app/api/test-kommo/route')
      const request = new NextRequest('http://localhost:3000/api/test-kommo')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Kommo test is disabled')
      expect(data.details).toContain('KOMMO_TEST_ENABLED')
    })

    it('should return 400 if required config is missing', async () => {
      const { evaluateKommoTestConfig } = await import('@/lib/env/kommo-test')
      vi.mocked(evaluateKommoTestConfig).mockReturnValue({
        enabled: false,
        message: 'Missing required configuration',
        missing: ['KOMMO_DOMAIN', 'KOMMO_CLIENT_ID'],
        status: 400,
      } as any)

      const route = await import('@/app/api/test-kommo/route')
      const request = new NextRequest('http://localhost:3000/api/test-kommo')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.missing).toEqual(['KOMMO_DOMAIN', 'KOMMO_CLIENT_ID'])
    })

    it('should run Kommo API test successfully', async () => {
      const { evaluateKommoTestConfig } = await import('@/lib/env/kommo-test')

      const mockConfig = {
        domain: 'test.kommo.com',
        clientId: 'client-123',
        clientSecret: 'secret-123',
      }

      vi.mocked(evaluateKommoTestConfig).mockReturnValue({
        enabled: true,
        config: mockConfig,
      } as any)

      const mockUsers = [{ id: 1, name: 'User 1' }]
      const mockPipelines = [{ id: 1, name: 'Pipeline 1' }]
      const mockStats = { total: 100 }

      mockKommoApiInstance.getUsers.mockResolvedValue(mockUsers)
      mockKommoApiInstance.getPipelines.mockResolvedValue(mockPipelines)
      mockKommoApiInstance.getLeadsStats.mockResolvedValue(mockStats)
      mockKommoApiInstance.getBaseUrl.mockReturnValue('https://test.kommo.com')

      const route = await import('@/app/api/test-kommo/route')
      const request = new NextRequest('http://localhost:3000/api/test-kommo')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Kommo API test completed successfully.')
      expect(data.data.usersCount).toBe(1)
      expect(data.data.pipelinesCount).toBe(1)
      expect(data.data.stats).toEqual(mockStats)
    })

    it('should handle API errors gracefully', async () => {
      const { evaluateKommoTestConfig } = await import('@/lib/env/kommo-test')

      const mockConfig = {
        domain: 'test.kommo.com',
        clientId: 'client-123',
        clientSecret: 'secret-123',
      }

      vi.mocked(evaluateKommoTestConfig).mockReturnValue({
        enabled: true,
        config: mockConfig,
      } as any)

      mockKommoApiInstance.getUsers.mockRejectedValue(new Error('API connection failed'))
      mockKommoApiInstance.getBaseUrl.mockReturnValue('https://test.kommo.com')

      const route = await import('@/app/api/test-kommo/route')
      const request = new NextRequest('http://localhost:3000/api/test-kommo')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('API connection failed')
    })
  })
})

