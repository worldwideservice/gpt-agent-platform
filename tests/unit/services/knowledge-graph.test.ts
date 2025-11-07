import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  extractKnowledgeFromText,
  saveEntities,
  saveRelationships,
  getRelatedEntities,
} from '@/lib/services/knowledge-graph'

// Мокаем Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    upsert: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    in: vi.fn(() => query),
    or: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(),
  }
  
  // Делаем query thenable для поддержки .then() и async/await
  query.then = vi.fn((resolve) => {
    const resolvedResult = result || { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  
  query.catch = vi.fn((reject) => {
    return Promise.resolve(result || { data: [], error: null }).catch(reject)
  })
  
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем LLM
vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn().mockResolvedValue({
    content: JSON.stringify({
      entities: [
        { type: 'person', name: 'John Doe', confidence: 0.9 },
        { type: 'organization', name: 'Acme Corp', confidence: 0.8 },
      ],
      relationships: [
        { source: 'John Doe', target: 'Acme Corp', type: 'works_for', confidence: 0.9 },
      ],
    }),
  }),
}))

describe('Knowledge Graph Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractKnowledgeFromText', () => {
    it('should extract entities and relationships from text', async () => {
      const result = await extractKnowledgeFromText('org-123', 'John Doe works at Acme Corp')

      expect(result).toBeDefined()
      expect(result.entities).toBeDefined()
      expect(result.relationships).toBeDefined()
      expect(result.entities.length).toBeGreaterThan(0)
      expect(result.relationships.length).toBeGreaterThan(0)
    })

    it('should handle empty text', async () => {
      const result = await extractKnowledgeFromText('org-123', '')

      expect(result).toBeDefined()
      expect(result.entities).toBeDefined()
      expect(result.relationships).toBeDefined()
    })

    it('should handle LLM errors gracefully', async () => {
      const { generateChatResponse } = await import('@/lib/services/llm')
      vi.mocked(generateChatResponse).mockRejectedValueOnce(new Error('LLM error'))

      const result = await extractKnowledgeFromText('org-123', 'Some text')

      expect(result).toBeDefined()
      expect(result.entities).toEqual([])
      expect(result.relationships).toEqual([])
    })
  })

  describe('saveEntities', () => {
    it('should save entities successfully', async () => {
      // Мокаем запрос для проверки существующих сущностей
      const checkQuery = createMockQuery({ data: [], error: null })
      
      // Мокаем insert запрос с полной цепочкой
      const selectQuery = createMockQuery({ data: { id: 'entity-1' }, error: null })
      selectQuery.single = vi.fn().mockResolvedValue({ data: { id: 'entity-1' }, error: null })
      
      const insertQuery = createMockQuery({ data: { id: 'entity-1' }, error: null })
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select = vi.fn().mockReturnValue(selectQuery)

      // Мокаем update запрос (если сущность существует)
      const updateQuery = createMockQuery({ data: null, error: null })
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockReturnValue(updateQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(checkQuery) // для проверки существующих
        .mockReturnValueOnce(insertQuery) // для insert новой сущности

      const result = await saveEntities('org-123', [
        {
          type: 'person',
          name: 'John Doe',
          value: 'John Doe',
          confidence: 0.9,
        },
      ])

      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty entities array', async () => {
      const result = await saveEntities('org-123', [])

      expect(result).toEqual([])
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      // Мокаем запрос для проверки существующих сущностей
      const checkQuery = createMockQuery({ data: [], error: null })
      
      // Мокаем insert запрос с ошибкой
      const selectQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      selectQuery.single = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
      
      const insertQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select = vi.fn().mockReturnValue(selectQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(checkQuery) // для проверки существующих
        .mockReturnValueOnce(insertQuery) // для insert с ошибкой

      const result = await saveEntities('org-123', [
        {
          type: 'person',
          name: 'John Doe',
        },
      ])

      expect(result).toEqual([])
    })
  })

  describe('saveRelationships', () => {
    it('should save relationships successfully', async () => {
      // saveRelationships использует upsert, а не insert
      const upsertQuery = createMockQuery({ data: null, error: null })
      upsertQuery.upsert = vi.fn().mockReturnValue(upsertQuery)

      mockSupabaseClient.from.mockReturnValue(upsertQuery)

      // saveRelationships требует Map с entityNameToId
      const entityNameToId = new Map<string, string>()
      entityNameToId.set('entity-1', 'entity-id-1')
      entityNameToId.set('entity-2', 'entity-id-2')

      await saveRelationships('org-123', [
        {
          source: 'entity-1',
          target: 'entity-2',
          type: 'works_for',
          confidence: 0.9,
        },
      ], entityNameToId)

      expect(upsertQuery.upsert).toHaveBeenCalled()
    })

    it('should handle empty relationships array', async () => {
      await saveRelationships('org-123', [], new Map())

      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      // saveRelationships использует upsert
      const upsertQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      upsertQuery.upsert = vi.fn().mockReturnValue(upsertQuery)

      mockSupabaseClient.from.mockReturnValue(upsertQuery)

      const entityNameToId = new Map<string, string>()
      entityNameToId.set('entity-1', 'entity-id-1')
      entityNameToId.set('entity-2', 'entity-id-2')

      // Функция не должна выбросить ошибку, даже если upsert не удался
      await expect(saveRelationships('org-123', [
        {
          source: 'entity-1',
          target: 'entity-2',
          type: 'works_for',
        },
      ], entityNameToId)).resolves.not.toThrow()
    })
  })

  describe('getRelatedEntities', () => {
    it('should get related entities', async () => {
      const mockEntities = [
        {
          id: 'entity-1',
          org_id: 'org-123',
          entity_type: 'person',
          entity_name: 'John Doe',
        },
      ]

      const mockRelationships = [
        {
          source_entity_id: 'entity-1',
          target_entity_id: 'entity-2',
          relationship_type: 'works_for',
          knowledge_graph_entities: {
            id: 'entity-2',
            entity_name: 'Acme Corp',
            entity_type: 'organization',
          },
        },
      ]

      // getRelatedEntities делает два запроса: сначала entities, потом relationships
      const entitiesQuery = createMockQuery({ data: mockEntities, error: null })
      const relationshipsQuery = createMockQuery({ data: mockRelationships, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(entitiesQuery) // для получения entities
        .mockReturnValueOnce(relationshipsQuery) // для получения relationships

      // getRelatedEntities принимает массив entityNames, а не один entityId
      const result = await getRelatedEntities('org-123', ['John Doe'])

      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return empty array if no related entities', async () => {
      const entitiesQuery = createMockQuery({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(entitiesQuery)

      // getRelatedEntities принимает массив entityNames
      const result = await getRelatedEntities('org-123', ['entity-1'])

      expect(result).toEqual([])
    })

    it('should handle database errors', async () => {
      const entitiesQuery = createMockQuery({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(entitiesQuery)

      // getRelatedEntities принимает массив entityNames
      const result = await getRelatedEntities('org-123', ['entity-1'])

      expect(result).toEqual([])
    })
  })
})

