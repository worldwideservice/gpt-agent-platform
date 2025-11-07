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

describe('API: /api/email-templates/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/email-templates/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123')
      const params = { id: 'template-123' }

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return template by id', async () => {
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
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockTemplate,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123')
      const params = { id: 'template-123' }

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.template).toEqual(mockTemplate)
    })

    it('should return 404 if template not found', async () => {
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

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123')
      const params = { id: 'template-123' }

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /api/email-templates/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Template' }),
      })
      const params = { id: 'template-123' }

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update template successfully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUpdatedTemplate = {
        id: 'template-123',
        org_id: 'org-123',
        name: 'Updated Template',
        subject: 'Updated Subject',
        html: '<p>Updated</p>',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockUpdatedTemplate,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq2 = vi.fn().mockReturnValue({ select: mockSelect })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Template' }),
      })
      const params = { id: 'template-123' }

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.template).toEqual(mockUpdatedTemplate)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123', {
        method: 'PUT',
        body: JSON.stringify({ name: '' }), // Invalid: empty string
      })
      const params = { id: 'template-123' }

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/email-templates/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123', {
        method: 'DELETE',
      })
      const params = { id: 'template-123' }

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete template successfully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockDeleteResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ delete: mockDeleteResult })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDeleteMethod = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDeleteMethod })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/email-templates/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/email-templates/template-123', {
        method: 'DELETE',
      })
      const params = { id: 'template-123' }

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Шаблон удален успешно')
    })
  })
})

