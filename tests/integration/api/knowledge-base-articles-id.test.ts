import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/knowledge-base', () => ({
  getKnowledgeBaseArticleById: vi.fn(),
  updateKnowledgeBaseArticle: vi.fn(),
  deleteKnowledgeBaseArticle: vi.fn(),
}))

describe('API: /api/knowledge-base/articles/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge-base/articles/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123')
      const params = { id: 'article-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return article by id', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticleById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockArticle = {
        id: 'article-123',
        title: 'Test Article',
        content: 'Test content',
        categoryId: 'category-123',
        isPublished: true,
      }

      vi.mocked(getKnowledgeBaseArticleById).mockResolvedValue(mockArticle as any)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123')
      const params = { id: 'article-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockArticle)
      expect(getKnowledgeBaseArticleById).toHaveBeenCalledWith('article-123', 'org-123')
    })

    it('should return 404 if article not found', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticleById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseArticleById).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123')
      const params = { id: 'article-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Статья не найдена')
    })

    it('should handle errors when getting article', async () => {
      const { auth } = await import('@/auth')
      const { getKnowledgeBaseArticleById } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getKnowledgeBaseArticleById).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123')
      const params = { id: 'article-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить статью')
    })
  })

  describe('PATCH /api/knowledge-base/articles/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'Updated Article',
        }),
      })
      const params = { id: 'article-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update an article', async () => {
      const { auth } = await import('@/auth')
      const { updateKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const updatedArticle = {
        id: 'article-123',
        title: 'Updated Article',
        content: 'Updated content',
        isPublished: true,
      }

      vi.mocked(updateKnowledgeBaseArticle).mockResolvedValue(updatedArticle as any)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'Updated Article',
          content: 'Updated content',
        }),
      })
      const params = { id: 'article-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedArticle)
      expect(updateKnowledgeBaseArticle).toHaveBeenCalledWith(
        'article-123',
        'org-123',
        expect.objectContaining({
          title: 'Updated Article',
          content: 'Updated content',
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

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: '', // Invalid: empty string
        }),
      })
      const params = { id: 'article-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should handle errors when updating article', async () => {
      const { auth } = await import('@/auth')
      const { updateKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(updateKnowledgeBaseArticle).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'Updated Article',
        }),
      })
      const params = { id: 'article-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось обновить статью')
    })
  })

  describe('DELETE /api/knowledge-base/articles/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'DELETE',
      })
      const params = { id: 'article-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete an article', async () => {
      const { auth } = await import('@/auth')
      const { deleteKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteKnowledgeBaseArticle).mockResolvedValue(undefined)

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'DELETE',
      })
      const params = { id: 'article-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteKnowledgeBaseArticle).toHaveBeenCalledWith('article-123', 'org-123')
    })

    it('should handle errors when deleting article', async () => {
      const { auth } = await import('@/auth')
      const { deleteKnowledgeBaseArticle } = await import('@/lib/repositories/knowledge-base')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteKnowledgeBaseArticle).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/knowledge-base/articles/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/knowledge-base/articles/article-123', {
        method: 'DELETE',
      })
      const params = { id: 'article-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось удалить статью')
    })
  })
})

