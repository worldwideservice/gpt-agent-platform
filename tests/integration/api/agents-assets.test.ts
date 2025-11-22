import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: vi.fn(),
}))

describe('API: /api/agents/[id]/assets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/assets', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/assets/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return agent assets', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const mockAssets = [
        {
          id: 'asset-1',
          agent_id: 'agent-123',
          type: 'file',
          storage_path: 'agents/org-123/agent-123/file.pdf',
        },
      ]

      const mockOrder = vi.fn().mockResolvedValue({
        data: mockAssets,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/assets/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('POST /api/agents/[id]/assets', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/assets/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets', {
        method: 'POST',
        body: JSON.stringify({
          type: 'image',
          url: 'https://example.com/image.jpg',
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should upload asset file', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { getSupabaseServerClient } = await import('@/lib/supabase/server')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      // Mock file upload to Supabase Storage
      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: 'agents/org-123/agent-123/file.pdf' },
        error: null,
      })
      const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockFromStorage = vi.fn().mockReturnValue({ upload: mockUpload, remove: mockRemove })

      // Mock getSupabaseServerClient to return client with storage
      const mockSupabaseClient = {
        storage: {
          from: mockFromStorage,
        },
      }

      // getSupabaseServerClient is not async, it returns the client directly
      vi.mocked(getSupabaseServerClient).mockReturnValue(mockSupabaseClient as any)

      // Mock asset record creation
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'asset-123',
          agent_id: 'agent-123',
          storage_path: 'agents/org-123/agent-123/file.pdf',
          source_name: 'test.pdf',
          file_size: 11,
          mime_type: 'application/pdf',
          status: 'pending',
        },
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom2 = vi.fn().mockReturnValue({ insert: mockInsert })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom2,
      } as any)

      // Mock backend fetch for job queue
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as any)

      // Create FormData with file
      const formData = new FormData()
      const fileContent = new Blob(['test content'], { type: 'application/pdf' })
      const file = new File([fileContent], 'test.pdf', { type: 'application/pdf' })
      formData.append('file', file)
      
      // Mock file.arrayBuffer() for the route
      file.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(11))

      const route = await import('@/app/api/agents/[id]/assets/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets', {
        method: 'POST',
        body: formData,
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should return 400 if no file provided', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const formData = new FormData()

      const route = await import('@/app/api/agents/[id]/assets/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets', {
        method: 'POST',
        body: formData,
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

