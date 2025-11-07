import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/organization/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/organization/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/organization/settings/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return organization settings', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockOrg = {
        settings: {
          stopOnHumanReply: true,
        },
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockOrg,
        error: null,
      })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/organization/settings/route')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.settings).toEqual(mockOrg.settings)
    })
  })

  describe('PATCH /api/organization/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/organization/settings/route')
      const request = new NextRequest('http://localhost:3000/api/organization/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          stopOnHumanReply: true,
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update organization settings', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockCurrentOrg = {
        settings: {},
      }

      const mockUpdatedOrg = {
        settings: {
          stopOnHumanReply: true,
        },
      }

      // First call: select current settings
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: mockCurrentOrg,
        error: null,
      })
      const mockEq1 = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockSelect1 = vi.fn().mockReturnValue({ eq: mockEq1 })

      // Second call: update and select
      const mockSingle2 = vi.fn().mockResolvedValue({
        data: mockUpdatedOrg,
        error: null,
      })
      const mockSelect2 = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockEq2 = vi.fn().mockReturnValue({ select: mockSelect2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq2 })

      let callCount = 0
      const mockFrom = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect1 }
        }
        return { update: mockUpdate }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/organization/settings/route')
      const request = new NextRequest('http://localhost:3000/api/organization/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          stopOnHumanReply: true,
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.settings.stopOnHumanReply).toBe(true)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/organization/settings/route')
      const request = new NextRequest('http://localhost:3000/api/organization/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          stopOnHumanReply: 'not-a-boolean', // Invalid data
        }),
      })
      const response = await route.PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

