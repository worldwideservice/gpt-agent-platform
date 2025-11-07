import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock backend client
vi.mock('@/lib/backend/client', () => ({
  backendFetch: vi.fn(),
}))

describe('API: /api/integrations/kommo/status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/integrations/kommo/status', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/integrations/kommo/status/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/status')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return status successfully', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockStatus = {
        success: true,
        status: {
          provider: 'kommo',
          credentialsConfigured: true,
          connectionConfigured: true,
          connection: {
            id: 'connection-123',
            baseDomain: 'test.kommo.com',
          },
          credentials: {
            clientId: 'client-id-123',
          },
          sync: {
            lastSyncAt: '2024-01-01T00:00:00Z',
          },
        },
      }

      vi.mocked(backendFetch).mockResolvedValue(mockStatus)

      const route = await import('@/app/api/integrations/kommo/status/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/status')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.status.provider).toBe('kommo')
      expect(data.status.credentialsConfigured).toBe(true)
      expect(backendFetch).toHaveBeenCalledWith('/crm/status', {
        method: 'GET',
        searchParams: {
          orgId: 'org-123',
          provider: 'kommo',
        },
      })
    })

    it('should handle backend fetch errors', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(backendFetch).mockRejectedValue(new Error('Backend error'))

      const route = await import('@/app/api/integrations/kommo/status/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/status')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось получить статус подключения Kommo')
    })

    it('should return error status from backend', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockErrorResponse = {
        success: false,
        error: 'Connection not found',
      }

      vi.mocked(backendFetch).mockResolvedValue(mockErrorResponse)

      const route = await import('@/app/api/integrations/kommo/status/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/status')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Connection not found')
    })
  })
})

