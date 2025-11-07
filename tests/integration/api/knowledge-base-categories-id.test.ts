import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/knowledge-base', () => ({
  getKnowledgeBaseCategoryById: vi.fn(),
  updateKnowledgeBaseCategory: vi.fn(),
  deleteKnowledgeBaseCategory: vi.fn(),
}))

describe('API: /api/knowledge-base/categories/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge-base/categories/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123')
      const params = { id: 'category-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return category by id', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseCategoryById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockCategory = {
        id: 'category-123',
        name: 'Test Category',
        description: 'Test description',
        parentId: null,
        articlesCount: 5,
      }

      vi.mocked(getKnowledgeBaseCategoryById).mockResolvedValue(mockCategory as any)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123')
      const params = { id: 'category-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockCategory)
      expect(getKnowledgeBaseCategoryById).toHaveBeenCalledWith('category-123', 'org-123')
    })

    it('should return 404 if category not found', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseCategoryById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseCategoryById).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123')
      const params = { id: 'category-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Категория не найдена')
    })

    it('should handle errors when getting category', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseCategoryById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseCategoryById).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123')
      const params = { id: 'category-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить категорию')
    })
  })

  describe('PATCH /api/knowledge-base/categories/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Category',
        }),
      })
      const params = { id: 'category-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update a category', async () => {
      const { auth } = await import('@/auth')
      const { updateKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const updatedCategory = {
        id: 'category-123',
        name: 'Updated Category',
        description: 'Updated description',
        parentId: null,
      }

      vi.mocked(updateKnowledgeBaseCategory).mockResolvedValue(updatedCategory as any)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Category',
          description: 'Updated description',
        }),
      })
      const params = { id: 'category-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedCategory)
      expect(updateKnowledgeBaseCategory).toHaveBeenCalledWith(
        'category-123',
        'org-123',
        expect.objectContaining({
          name: 'Updated Category',
          description: 'Updated description',
        }),
      )
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: '', // Invalid: empty string
        }),
      })
      const params = { id: 'category-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should handle errors when updating category', async () => {
      const { auth } = await import('@/auth')
      const { updateKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(updateKnowledgeBaseCategory).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Category',
        }),
      })
      const params = { id: 'category-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось обновить категорию')
    })
  })

  describe('DELETE /api/knowledge-base/categories/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'DELETE',
      })
      const params = { id: 'category-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete a category', async () => {
      const { auth } = await import('@/auth')
      const { deleteKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteKnowledgeBaseCategory).mockResolvedValue(undefined)

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'DELETE',
      })
      const params = { id: 'category-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteKnowledgeBaseCategory).toHaveBeenCalledWith('category-123', 'org-123')
    })

    it('should handle errors when deleting category', async () => {
      const { auth } = await import('@/auth')
      const { deleteKnowledgeBaseCategory } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteKnowledgeBaseCategory).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/categories/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/categories/category-123', {
        method: 'DELETE',
      })
      const params = { id: 'category-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось удалить категорию')
    })
  })
})

