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

describe('API: /api/integrations/kommo/sync/pipelines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/integrations/kommo/sync/pipelines', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/integrations/kommo/sync/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should trigger sync successfully', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(backendFetch).mockResolvedValue({
        ok: true,
      } as any)

      const route = await import('@/app/api/integrations/kommo/sync/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        body: JSON.stringify({
          connectionId: 'conn-123',
          baseDomain: 'test.kommo.com',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(backendFetch).toHaveBeenCalledWith('/crm/sync', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          provider: 'kommo',
          connectionId: 'conn-123',
          baseDomain: 'test.kommo.com',
        }),
      })
    })

    it('should trigger sync without optional parameters', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(backendFetch).mockResolvedValue({
        ok: true,
      } as any)

      const route = await import('@/app/api/integrations/kommo/sync/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(backendFetch).toHaveBeenCalledWith('/crm/sync', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          provider: 'kommo',
          connectionId: undefined,
          baseDomain: undefined,
        }),
      })
    })

    it('should handle invalid JSON gracefully', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/sync/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 500 if backend fetch fails', async () => {
      const { auth } = await import('@/auth')
      const { backendFetch } = await import('@/lib/backend/client')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(backendFetch).mockRejectedValue(new Error('Backend error'))

      const route = await import('@/app/api/integrations/kommo/sync/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/sync/pipelines', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

