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

describe('API: /api/email-templates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/email-templates', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return templates for organization', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockTemplates = [
        {
          id: 'template-1',
          org_id: 'org-123',
          name: 'Welcome Email',
          subject: 'Welcome!',
          html: '<p>Welcome</p>',
        },
        {
          id: 'template-2',
          org_id: 'org-123',
          name: 'Password Reset',
          subject: 'Reset Password',
          html: '<p>Reset</p>',
        },
      ]

      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
          order: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: mockTemplates,
            error: null,
          }).then(resolve)
        })
        return chain
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(createQuery()),
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.templates).toEqual(mockTemplates)
    })

    it('should filter by active_only when requested', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockTemplates = [
        {
          id: 'template-1',
          org_id: 'org-123',
          name: 'Welcome Email',
          is_active: true,
        },
      ]

      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
          order: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: mockTemplates,
            error: null,
          }).then(resolve)
        })
        return chain
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(createQuery()),
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates?active_only=true')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/email-templates', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Template',
          subject: 'Test Subject',
          html: '<p>Test</p>',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create template successfully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockTemplate = {
        id: 'template-123',
        org_id: 'org-123',
        name: 'Test Template',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        created_by: 'user-123',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockTemplate,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Template',
          subject: 'Test Subject',
          html: '<p>Test</p>',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.template).toEqual(mockTemplate)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/email-templates/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates', {
        method: 'POST',
        body: JSON.stringify({
          name: '', // Invalid: empty string
          subject: 'Test Subject',
          html: '<p>Test</p>',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

