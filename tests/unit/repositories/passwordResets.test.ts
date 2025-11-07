import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createPasswordReset,
  findValidPasswordResetByToken,
  markPasswordResetAsUsed,
} from '@/lib/repositories/passwordResets'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    is: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Password Resets Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createPasswordReset', () => {
    it('should create password reset token', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.is.mockResolvedValue({ error: null })

      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(deleteQuery) // для delete старых токенов
        .mockReturnValueOnce(insertQuery) // для insert нового токена

      const result = await createPasswordReset('user-123')

      expect(result).toBeDefined()
      expect(result.token).toBeDefined()
      expect(result.expiresAt).toBeDefined()
      expect(result.token).toHaveLength(64) // 32 bytes = 64 hex chars
    })

    it('should create password reset with custom TTL', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.is.mockResolvedValue({ error: null })

      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(deleteQuery)
        .mockReturnValueOnce(insertQuery)

      const result = await createPasswordReset('user-123', 120)

      expect(result).toBeDefined()
      const expiresAt = new Date(result.expiresAt)
      const now = new Date()
      const diffMinutes = (expiresAt.getTime() - now.getTime()) / (1000 * 60)
      expect(diffMinutes).toBeCloseTo(120, 0)
    })

    it('should throw error if insert fails', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.is.mockResolvedValue({ error: null })

      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: { message: 'Database error' } })

      mockSupabaseClient.from
        .mockReturnValueOnce(deleteQuery)
        .mockReturnValueOnce(insertQuery)

      await expect(createPasswordReset('user-123')).rejects.toThrow()
    })
  })

  describe('findValidPasswordResetByToken', () => {
    it('should find valid password reset token', async () => {
      const mockReset = {
        id: 'reset-1',
        user_id: 'user-123',
        token_hash: 'hash',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used_at: null,
        created_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockReset, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findValidPasswordResetByToken('valid-token')

      expect(result).toBeDefined()
      expect(result?.id).toBe('reset-1')
      expect(result?.user_id).toBe('user-123')
    })

    it('should return null if token not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findValidPasswordResetByToken('invalid-token')

      expect(result).toBeNull()
    })

    it('should return null if token expired', async () => {
      const mockReset = {
        id: 'reset-1',
        user_id: 'user-123',
        token_hash: 'hash',
        expires_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // expired
        used_at: null,
        created_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockReset, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findValidPasswordResetByToken('expired-token')

      expect(result).toBeNull()
    })

    it('should return null if token already used', async () => {
      const mockReset = {
        id: 'reset-1',
        user_id: 'user-123',
        token_hash: 'hash',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used_at: '2025-01-26T00:00:00Z', // already used
        created_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockReset, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findValidPasswordResetByToken('used-token')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(findValidPasswordResetByToken('token')).rejects.toThrow('Database error')
    })
  })

  describe('markPasswordResetAsUsed', () => {
    it('should mark password reset as used', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.is.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery) // для update
        .mockReturnValueOnce(deleteQuery) // для delete

      await markPasswordResetAsUsed('reset-1', 'user-123')

      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          used_at: expect.any(String),
        })
      )
      expect(updateQuery.eq).toHaveBeenCalledWith('id', 'reset-1')
    })

    it('should handle update errors', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockResolvedValue({ error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(markPasswordResetAsUsed('reset-1', 'user-123')).rejects.toThrow()
    })
  })
})

