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

describe('API: /api/kommo/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/kommo/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return settings if found', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSettings = {
        id: 'settings-123',
        org_id: 'org-123',
        crm_type: 'kommo',
        config: {
          domain: 'test.kommo.com',
          client_id: 'client-123',
        },
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockSettings,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.settings).toEqual(mockSettings)
    })

    it('should return null if settings not found', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.settings).toBe(null)
    })
  })

  describe('POST /api/kommo/settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings', {
        method: 'POST',
        body: JSON.stringify({
          domain: 'test.kommo.com',
          client_id: 'client-123',
          client_secret: 'secret-123',
          access_token: 'token-123',
          redirect_uri: 'https://example.com/callback',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should save settings successfully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockNewSettings = {
        id: 'settings-123',
        org_id: 'org-123',
        crm_type: 'kommo',
        config: {
          domain: 'test.kommo.com',
          client_id: 'client-123',
          client_secret: 'secret-123',
          access_token: 'token-123',
          redirect_uri: 'https://example.com/callback',
        },
      }

      // Mock for delete
      const mockDeleteResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2Delete = vi.fn().mockReturnValue({ delete: mockDeleteResult })
      const mockEq1Delete = vi.fn().mockReturnValue({ eq: mockEq2Delete })
      const mockDeleteMethod = vi.fn().mockReturnValue({ eq: mockEq1Delete })

      // Mock for insert
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockNewSettings,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })

      const mockFrom = vi.fn().mockReturnValue({
        delete: mockDeleteMethod,
        insert: mockInsert,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings', {
        method: 'POST',
        body: JSON.stringify({
          domain: 'test.kommo.com',
          client_id: 'client-123',
          client_secret: 'secret-123',
          access_token: 'token-123',
          redirect_uri: 'https://example.com/callback',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.settings).toEqual(mockNewSettings)
      expect(data.message).toBe('Настройки Kommo сохранены успешно')
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/kommo/settings/route')
      const request = new NextRequest('http://localhost:3000/api/kommo/settings', {
        method: 'POST',
        body: JSON.stringify({
          domain: '', // Invalid: empty string
          client_id: 'client-123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })
  })
})

