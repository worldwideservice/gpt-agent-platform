import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAgentAssets, getAgentAssetById, updateAssetStatus } from '@/lib/repositories/agent-assets'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Agent Assets Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAgentAssets', () => {
    it('should return assets for agent', async () => {
      const mockAssets = [
        {
          id: 'asset-1',
          agent_id: 'agent-123',
          org_id: 'org-123',
          type: 'document',
          source_name: 'test.pdf',
          storage_path: '/path/to/file',
          status: 'completed',
          error: null,
          file_size: 1024,
          mime_type: 'application/pdf',
          chunks_count: 10,
          processing_error: null,
          created_at: '2025-01-26T00:00:00Z',
          processed_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: mockAssets, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentAssets('org-123', 'agent-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('asset-1')
      expect(result[0].agentId).toBe('agent-123')
      expect(result[0].status).toBe('completed')
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // Функция выбрасывает ошибку при error, нужно это проверить
      await expect(getAgentAssets('org-123', 'agent-123')).rejects.toThrow('Не удалось загрузить файлы агента')
    })
  })

  describe('getAgentAssetById', () => {
    it('should return asset by id', async () => {
      const mockAsset = {
        id: 'asset-1',
        agent_id: 'agent-123',
        org_id: 'org-123',
        type: 'document',
        source_name: 'test.pdf',
        storage_path: '/path/to/file',
        status: 'completed',
        error: null,
        file_size: 1024,
        mime_type: 'application/pdf',
        chunks_count: 10,
        processing_error: null,
        created_at: '2025-01-26T00:00:00Z',
        processed_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockAsset, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentAssetById('asset-1', 'org-123', 'agent-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('asset-1')
      expect(result?.status).toBe('completed')
    })

    it('should return null if asset not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentAssetById('asset-1', 'org-123', 'agent-123')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // Функция выбрасывает ошибку при error, нужно это проверить
      await expect(getAgentAssetById('asset-1', 'org-123', 'agent-123')).rejects.toThrow('Не удалось загрузить файл')
    })
  })

  describe('updateAssetStatus', () => {
    it('should update asset status successfully', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await updateAssetStatus('asset-1', 'completed', null, 10)

      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
          chunks_count: 10,
        })
      )
    })

    it('should update asset status with error', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await updateAssetStatus('asset-1', 'failed', 'Processing failed')

      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failed',
          error: 'Processing failed',
        })
      )
    })

    it('should handle update errors', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockResolvedValue({ error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(updateAssetStatus('asset-1', 'completed')).rejects.toThrow()
    })
  })
})

