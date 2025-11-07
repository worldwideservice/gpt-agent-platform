import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('API: /api/test-login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear environment variables
    delete process.env.SUPABASE_DEFAULT_ORGANIZATION_ID
  })

  describe('GET /api/test-login', () => {
    it('should return test user successfully', async () => {
      const route = await import('@/app/api/test-login/route')
      const request = new NextRequest('http://localhost:3000/api/test-login')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user.email).toBe('founder@example.com')
      expect(data.user.name).toBe('Demo Founder')
      expect(data.user.id).toBe('00000000-0000-4000-8000-0000000000ff')
      expect(data.message).toBe('Test login successful')
    })

    it('should use default organization ID from env', async () => {
      process.env.SUPABASE_DEFAULT_ORGANIZATION_ID = 'custom-org-id'

      const route = await import('@/app/api/test-login/route')
      const request = new NextRequest('http://localhost:3000/api/test-login')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user.orgId).toBe('custom-org-id')
    })

    it('should use fallback organization ID if env var is not set', async () => {
      const route = await import('@/app/api/test-login/route')
      const request = new NextRequest('http://localhost:3000/api/test-login')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user.orgId).toBe('550e8400-e29b-41d4-a716-446655440000')
    })
  })
})

