import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/knowledge-base', () => ({
  getKnowledgeBaseCategories: vi.fn(),
  createKnowledgeBaseCategory: vi.fn(),
}))

describe('API: /api/knowledge-base/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge-base/categories', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return list of categories', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseCategories } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockCategories = [
        {
          id: 'category-1',
          name: 'Category 1',
          description: 'Description 1',
          articlesCount: 5,
        },
        {
          id: 'category-2',
          name: 'Category 2',
          description: null,
          articlesCount: 3,
        },
      ]

      vi.mocked(getKnowledgeBaseCategories).mockResolvedValue(mockCategories as any)

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockCategories)
      expect(getKnowledgeBaseCategories).toHaveBeenCalledWith('org-123')
    })

    it('should handle errors when getting categories', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseCategories } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseCategories).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/knowledge-base/categories', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Category',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create a new category', async () => {
      const { auth } = await import('@/auth')
      const { createKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const newCategory = {
        id: 'category-123',
        name: 'New Category',
        description: 'Category description',
        parentId: null,
      }

      vi.mocked(createKnowledgeBaseCategory).mockResolvedValue(newCategory as any)

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Category',
          description: 'Category description',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(newCategory)
      expect(createKnowledgeBaseCategory).toHaveBeenCalledWith('org-123', {
        name: 'New Category',
        description: 'Category description',
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

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required name field
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle errors when creating category', async () => {
      const { auth } = await import('@/auth')
      const { createKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createKnowledgeBaseCategory).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/categories/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Category',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

