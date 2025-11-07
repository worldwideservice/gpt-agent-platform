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

describe('API: /api/integrations/kommo/credentials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/integrations/kommo/credentials', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/integrations/kommo/credentials/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/credentials', {
        method: 'POST',
        body: JSON.stringify({
          clientId: 'client-123',
          clientSecret: 'secret-123',
          redirectUri: 'https://example.com/callback',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should save credentials successfully', async () => {
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

      const route = await import('@/app/api/integrations/kommo/credentials/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/credentials', {
        method: 'POST',
        body: JSON.stringify({
          clientId: 'client-123',
          clientSecret: 'secret-123',
          redirectUri: 'https://example.com/callback',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(backendFetch).toHaveBeenCalledWith('/crm/credentials', {
        method: 'POST',
        body: JSON.stringify({
          orgId: 'org-123',
          provider: 'kommo',
          clientId: 'client-123',
          clientSecret: 'secret-123',
          redirectUri: 'https://example.com/callback',
        }),
      })
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/integrations/kommo/credentials/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/credentials', {
        method: 'POST',
        body: JSON.stringify({
          clientId: '', // Invalid: empty string
          clientSecret: 'secret-123',
          redirectUri: 'not-a-url', // Invalid: not a URL
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
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

      const route = await import('@/app/api/integrations/kommo/credentials/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/credentials', {
        method: 'POST',
        body: JSON.stringify({
          clientId: 'client-123',
          clientSecret: 'secret-123',
          redirectUri: 'https://example.com/callback',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

