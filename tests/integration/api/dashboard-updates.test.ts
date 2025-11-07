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

describe('API: /api/dashboard/updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/dashboard/updates', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/dashboard/updates/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/updates')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return updates from activity_logs', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockActivityLogs = [
        {
          id: 'log-1',
          activity_type: 'agent_created',
          title: 'Agent created',
          description: 'Test agent',
          created_at: '2024-01-01T00:00:00Z',
        },
      ]

      const mockLimit = vi.fn().mockResolvedValue({
        data: mockActivityLogs,
        error: null,
      })
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      
      // Reset call count for this test
      mockFrom.mockClear()

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/dashboard/updates/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/updates')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data[0].color).toBe('green')
    })

    it('should return updates from fallback method if activity_logs table not exists', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // Mock activity_logs query with table not exists error
      const mockLimit1 = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42P01' }, // Table does not exist
      })
      const mockOrder1 = vi.fn().mockReturnValue({ limit: mockLimit1 })
      const mockEq1 = vi.fn().mockReturnValue({ order: mockOrder1 })
      const mockSelect1 = vi.fn().mockReturnValue({ eq: mockEq1 })

      // Mock agents query
      const mockLimit2 = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'agent-1',
            name: 'Test Agent',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        error: null,
      })
      const mockOrder2 = vi.fn().mockReturnValue({ limit: mockLimit2 })
      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder2 })
      const mockSelect2 = vi.fn().mockReturnValue({ eq: mockEq2 })

      // Mock conversations query
      const mockLimit3 = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      })
      const mockOrder3 = vi.fn().mockReturnValue({ limit: mockLimit3 })
      const mockEq3 = vi.fn().mockReturnValue({ order: mockOrder3 })
      const mockSelect3 = vi.fn().mockReturnValue({ eq: mockEq3 })

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'activity_logs') {
          return { select: mockSelect1 }
        }
        if (table === 'agents') {
          return { select: mockSelect2 }
        }
        if (table === 'conversations') {
          return { select: mockSelect3 }
        }
        return { select: vi.fn() }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/dashboard/updates/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/updates')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should respect limit parameter', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      })
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      
      // Reset call count for this test
      mockFrom.mockClear()

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/dashboard/updates/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/updates?limit=10')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockLimit).toHaveBeenCalledWith(10)
    })
  })
})

