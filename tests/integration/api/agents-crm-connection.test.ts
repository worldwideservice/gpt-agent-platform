import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

// Mock backend client
vi.mock('@/lib/backend/client', () => ({
  backendFetch: vi.fn(),
}))

describe('API: /api/agents/[id]/crm-connection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/crm-connection', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/crm-connection/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/crm-connection')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return 404 if agent not found', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/crm-connection/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/crm-connection')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })

    it('should return null connection if CRM not connected', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      vi.mocked(backendFetch).mockResolvedValue({
        success: false,
        connection: null,
      } as any)

      const route = await import('@/app/api/agents/[id]/crm-connection/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/crm-connection')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeNull()
    })

    it('should return CRM connection data', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      const mockConnection = {
        id: 'conn-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
        access_token: 'token-123',
        metadata: {
          synced_at: '2024-01-01T00:00:00Z',
        },
      }

      vi.mocked(backendFetch).mockResolvedValue({
        success: true,
        connection: mockConnection,
      } as any)

      const route = await import('@/app/api/agents/[id]/crm-connection/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/crm-connection')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.id).toBe('conn-123')
      expect(data.data.crmType).toBe('kommo')
      expect(data.data.isConnected).toBe(true)
      expect(data.data.domain).toBe('test.kommo.com')
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/crm-connection/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/crm-connection')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось получить подключение CRM')
    })
  })
})
