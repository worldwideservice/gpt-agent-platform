import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock global fetch
global.fetch = vi.fn()

describe('API: /api/integrations/kommo/oauth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/integrations/kommo/oauth/callback', () => {
    it('should return 400 if error parameter is present', async () => {
      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?error=access_denied&error_description=User%20denied%20access&code=test-code&state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('access_denied')
      expect(data.description).toBe('User denied access')
    })

    it('should return 400 if code is missing', async () => {
      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      // Missing code parameter - will fail Zod validation
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      // Will fail Zod validation because code is required
      expect(data.error).toBeDefined()
    })

    it('should exchange code for tokens successfully', async () => {
      const mockTokens = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
        expires_in: 3600,
        token_type: 'Bearer',
        base_domain: 'test.kommo.com',
        account_id: 'account-123',
      }

      const mockResponse = {
        ok: true,
        json: async () => mockTokens,
      } as Response

      vi.mocked(global.fetch).mockResolvedValue(mockResponse)

      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?code=auth-code-123&state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.access_token).toBe('access-token-123')
      expect(data.refresh_token).toBe('refresh-token-123')
      expect(data.base_domain).toBe('test.kommo.com')
      expect(global.fetch).toHaveBeenCalled()
    })

    it('should return 400 if token exchange fails', async () => {
      const mockErrorResponse = {
        error: 'invalid_grant',
        error_description: 'Invalid authorization code',
      }

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        json: async () => mockErrorResponse,
      } as Response)

      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?code=invalid-code&state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      // Error can be from error_description, error, or default message
      expect(data.error).toBeDefined()
    })

    it('should return 400 if token response has no access_token', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          refresh_token: 'refresh-token-123',
          // Missing access_token
        }),
      } as Response)

      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?code=auth-code-123&state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })

    it('should handle invalid query parameters', async () => {
      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid request parameters')
    })

    it('should handle fetch errors', async () => {
      // Mock fetch to throw an error (not a ZodError)
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

      const route = await import('@/app/api/integrations/kommo/oauth/callback/route')
      const request = new NextRequest('http://localhost:3000/api/integrations/kommo/oauth/callback?code=auth-code-123&state=test-state')

      const response = await route.GET(request)
      const data = await response.json()

      // Network errors should return 500, not 400
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })
})

