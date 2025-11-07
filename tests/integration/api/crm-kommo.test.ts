import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock KommoAPI - create a shared instance that all tests can use
const mockKommoInstance = {
  getPipelines: vi.fn(),
  getUsers: vi.fn(),
  getLead: vi.fn(),
  getContact: vi.fn(),
  createLead: vi.fn(),
  updateLead: vi.fn(),
  createContact: vi.fn(),
  updateContact: vi.fn(),
  addNoteToLead: vi.fn(),
  searchLeads: vi.fn(),
  searchContacts: vi.fn(),
}

// Create a mock class that returns our mock instance
class MockKommoAPI {
  constructor() {
    return mockKommoInstance
  }
}

vi.mock('@/lib/crm/kommo', () => ({
  KommoAPI: MockKommoAPI,
}))

describe('API: /api/crm/kommo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset all mock implementations
    vi.mocked(mockKommoInstance.getPipelines).mockReset()
    vi.mocked(mockKommoInstance.getUsers).mockReset()
    vi.mocked(mockKommoInstance.getLead).mockReset()
    vi.mocked(mockKommoInstance.getContact).mockReset()
    vi.mocked(mockKommoInstance.createLead).mockReset()
  })

  describe('GET /api/crm/kommo', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=pipelines')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should get pipelines', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockPipelines = [
        { id: 1, name: 'Pipeline 1' },
        { id: 2, name: 'Pipeline 2' },
      ]

      vi.mocked(mockKommoInstance.getPipelines).mockResolvedValue(mockPipelines)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=pipelines')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockPipelines)
      expect(mockKommoInstance.getPipelines).toHaveBeenCalled()
    })

    it('should get users', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ]

      vi.mocked(mockKommoInstance.getUsers).mockResolvedValue(mockUsers)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=users')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUsers)
    })

    it('should get lead by id', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockLead = {
        id: 123,
        name: 'Test Lead',
        price: 1000,
      }

      vi.mocked(mockKommoInstance.getLead).mockResolvedValue(mockLead)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=lead&id=123')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockLead)
      expect(mockKommoInstance.getLead).toHaveBeenCalledWith(123)
    })

    it('should return 400 if lead id is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=lead')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for invalid action', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo?action=invalid')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/crm/kommo', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_lead',
          data: { name: 'Test Lead' },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create a lead', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockLead = {
        id: 123,
        name: 'Test Lead',
      }

      vi.mocked(mockKommoInstance.createLead).mockResolvedValue(mockLead)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_lead',
          data: { name: 'Test Lead' },
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockLead)
      expect(mockKommoInstance.createLead).toHaveBeenCalled()
    })

    it('should return 400 if lead name is missing', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // For error cases, KommoAPI will be called but we don't need to mock methods

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_lead',
          data: {}, // Missing name
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo', {
        method: 'POST',
        body: JSON.stringify({
          // Missing action and data
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for invalid action', async () => {
      const { auth } = await import('@/auth')
      const { KommoAPI } = await import('@/lib/crm/kommo')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // For error cases, KommoAPI will be called but we don't need to mock methods

      const route = await import('@/app/api/crm/kommo/route')
      const request = new NextRequest('http://localhost:3000/api/crm/kommo', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalid_action',
          data: {},
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

