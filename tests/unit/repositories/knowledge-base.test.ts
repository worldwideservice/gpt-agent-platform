import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getKnowledgeBaseCategories,
  getKnowledgeBaseCategoryById,
  createKnowledgeBaseCategory,
  updateKnowledgeBaseCategory,
  deleteKnowledgeBaseCategory,
  getKnowledgeBaseArticles,
  getKnowledgeBaseArticleById,
  createKnowledgeBaseArticle,
  updateKnowledgeBaseArticle,
  deleteKnowledgeBaseArticle,
} from '@/lib/repositories/knowledge-base'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем embeddings
vi.mock('@/lib/services/embeddings', () => ({
  generateEmbeddingsForDocument: vi.fn().mockResolvedValue([
    {
      content: 'Content chunk',
      embedding: [0.1, 0.2, 0.3],
    },
  ]),
}))

describe('Knowledge Base Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getKnowledgeBaseCategories', () => {
    it('should return categories for organization', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          org_id: 'org-123',
          name: 'Category 1',
          description: 'Test',
          parent_id: null,
          sort_order: 1,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      // Первый order возвращает queryChain, второй order возвращает промис с данными
      queryChain.order
        .mockReturnValueOnce(queryChain) // первый order
        .mockResolvedValueOnce({ data: mockCategories, error: null }) // второй order

      // Мокаем запрос для подсчета статей (для каждой категории)
      // getKnowledgeBaseCategories делает Promise.all для каждой категории
      // select('id', { count: 'exact', head: true }) возвращает queryChain, затем .eq().eq()
      const countQueryChain = createMockQuery()
      countQueryChain.select.mockReturnValue(countQueryChain) // select возвращает queryChain
      countQueryChain.eq
        .mockReturnValueOnce(countQueryChain) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ count: 0 }) // второй eq возвращает промис с count

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain) // для categories
        .mockReturnValueOnce(countQueryChain) // для articles count для cat-1 (Promise.all)

      const result = await getKnowledgeBaseCategories('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('cat-1')
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.order
        .mockReturnValueOnce(queryChain) // первый order
        .mockResolvedValueOnce({ data: null, error: { message: 'Database error' } }) // второй order с ошибкой

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(getKnowledgeBaseCategories('org-123')).rejects.toThrow()
    })
  })

  describe('getKnowledgeBaseCategoryById', () => {
    it('should return category by id', async () => {
      const mockCategory = {
        id: 'cat-1',
        org_id: 'org-123',
        name: 'Category 1',
        description: 'Test',
        parent_id: null,
        sort_order: 1,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockCategory, error: null })

      // select('id', { count: 'exact', head: true }) возвращает объект с методами eq
      const countQueryChain = createMockQuery()
      countQueryChain.select.mockReturnValue(countQueryChain) // select возвращает queryChain
      countQueryChain.eq
        .mockReturnValueOnce(countQueryChain) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ count: 5 }) // второй eq возвращает промис с count

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain) // для category (maybeSingle)
        .mockReturnValueOnce(countQueryChain) // для articles count (select().eq().eq())

      const result = await getKnowledgeBaseCategoryById('cat-1', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('cat-1')
    })

    it('should return null if category not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getKnowledgeBaseCategoryById('cat-1', 'org-123')

      expect(result).toBeNull()
    })
  })

  describe('createKnowledgeBaseCategory', () => {
    it('should create category successfully', async () => {
      const mockCategory = {
        id: 'cat-1',
        org_id: 'org-123',
        name: 'New Category',
        description: 'Test',
        parent_id: null,
        sort_order: 1,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockCategory, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createKnowledgeBaseCategory('org-123', {
        name: 'New Category',
        description: 'Test',
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('cat-1')
    })

    it('should throw error if creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        createKnowledgeBaseCategory('org-123', {
          name: 'New Category',
        })
      ).rejects.toThrow()
    })
  })

  describe('updateKnowledgeBaseCategory', () => {
    it('should update category successfully', async () => {
      const mockCategory = {
        id: 'cat-1',
        org_id: 'org-123',
        name: 'Updated Category',
        description: 'Updated',
        parent_id: null,
        sort_order: 1,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockCategory, error: null })

      // select('id', { count: 'exact', head: true }) возвращает объект с методами eq
      const countQueryChain = createMockQuery()
      countQueryChain.select.mockReturnValue(countQueryChain) // select возвращает queryChain
      countQueryChain.eq
        .mockReturnValueOnce(countQueryChain) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ count: 3 }) // второй eq возвращает промис с count

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery) // для update (update().select().single())
        .mockReturnValueOnce(countQueryChain) // для articles count (select().eq().eq())

      const result = await updateKnowledgeBaseCategory('cat-1', 'org-123', {
        name: 'Updated Category',
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Updated Category')
    })
  })

  describe('deleteKnowledgeBaseCategory', () => {
    it('should delete category successfully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает query
        .mockResolvedValueOnce({ error: null }) // второй eq возвращает промис

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteKnowledgeBaseCategory('cat-1', 'org-123')

      expect(deleteQuery.delete).toHaveBeenCalled()
    })

    it('should throw error if delete fails', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает query
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // второй eq возвращает промис с ошибкой

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteKnowledgeBaseCategory('cat-1', 'org-123')).rejects.toThrow()
    })
  })

  describe('getKnowledgeBaseArticles', () => {
    it('should return articles for organization', async () => {
      const mockArticles = [
        {
          id: 'article-1',
          org_id: 'org-123',
          category_id: 'cat-1',
          title: 'Article 1',
          content: 'Content',
          slug: 'article-1',
          is_published: true,
          views_count: 10,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockArticles, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getKnowledgeBaseArticles('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('article-1')
    })

    it('should filter articles by category', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq возвращает queryChain
        .mockReturnValueOnce(queryChain) // второй eq (для category_id) возвращает queryChain
      // order возвращает queryChain, но когда await query, то возвращается промис
      queryChain.order.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getKnowledgeBaseArticles('org-123', 'cat-1')

      expect(queryChain.eq).toHaveBeenCalledWith('category_id', 'cat-1')
    })

    it('should throw error on error', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с ошибкой
      queryChain.then = vi.fn((resolve, reject) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve).catch(reject)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(getKnowledgeBaseArticles('org-123')).rejects.toThrow('Не удалось загрузить статьи')
    })
  })

  describe('getKnowledgeBaseArticleById', () => {
    it('should return article by id', async () => {
      const mockArticle = {
        id: 'article-1',
        org_id: 'org-123',
        category_id: 'cat-1',
        title: 'Article 1',
        content: 'Content',
        slug: 'article-1',
        is_published: true,
        views_count: 10,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockArticle, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getKnowledgeBaseArticleById('article-1', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('article-1')
    })
  })

  describe('createKnowledgeBaseArticle', () => {
    it('should create article successfully', async () => {
      const mockArticle = {
        id: 'article-1',
        org_id: 'org-123',
        category_id: 'cat-1',
        title: 'New Article',
        content: 'Content',
        slug: 'new-article',
        is_published: true,
        views_count: 0,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockArticle, error: null })

      // reindexArticleKnowledge вызывает delete и insert для knowledge_chunks
      // delete().eq() - один eq, возвращает промис
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq.mockResolvedValue({ error: null })

      const chunksInsertQuery = createMockQuery()
      chunksInsertQuery.insert.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для insert article
        .mockReturnValueOnce(deleteQuery) // для delete chunks
        .mockReturnValueOnce(chunksInsertQuery) // для insert chunks

      const result = await createKnowledgeBaseArticle('org-123', {
        title: 'New Article',
        content: 'Content',
        categoryId: 'cat-1',
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('article-1')
    })

    it('should throw error if creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        createKnowledgeBaseArticle('org-123', {
          title: 'New Article',
          content: 'Content',
        })
      ).rejects.toThrow()
    })
  })

  describe('updateKnowledgeBaseArticle', () => {
    it('should update article successfully', async () => {
      const mockArticle = {
        id: 'article-1',
        org_id: 'org-123',
        category_id: 'cat-1',
        title: 'Updated Article',
        content: 'Updated Content',
        slug: 'article-1',
        is_published: true,
        views_count: 10,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockArticle, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      // reindexArticleKnowledge НЕ вызывается, если content не изменен
      const result = await updateKnowledgeBaseArticle('article-1', 'org-123', {
        title: 'Updated Article',
      })

      expect(result).toBeDefined()
      expect(result.title).toBe('Updated Article')
    })

    it('should reindex article when content is updated', async () => {
      const mockArticle = {
        id: 'article-1',
        org_id: 'org-123',
        category_id: 'cat-1',
        title: 'Article 1',
        content: 'Updated Content',
        slug: 'article-1',
        is_published: true,
        views_count: 10,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockArticle, error: null })

      // reindexArticleKnowledge вызывается, когда content изменен
      // delete().eq() - один eq, возвращает промис
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq.mockResolvedValue({ error: null })

      const chunksInsertQuery = createMockQuery()
      chunksInsertQuery.insert.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery) // для update article
        .mockReturnValueOnce(deleteQuery) // для delete chunks
        .mockReturnValueOnce(chunksInsertQuery) // для insert chunks

      const result = await updateKnowledgeBaseArticle('article-1', 'org-123', {
        content: 'Updated Content',
      })

      expect(result).toBeDefined()
      expect(result.content).toBe('Updated Content')
    })
  })

  describe('deleteKnowledgeBaseArticle', () => {
    it('should delete article successfully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает query
        .mockResolvedValueOnce({ error: null }) // второй eq возвращает промис

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteKnowledgeBaseArticle('article-1', 'org-123')

      expect(deleteQuery.delete).toHaveBeenCalled()
    })

    it('should throw error if delete fails', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает query
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // второй eq возвращает промис с ошибкой

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteKnowledgeBaseArticle('article-1', 'org-123')).rejects.toThrow()
    })
  })
})

