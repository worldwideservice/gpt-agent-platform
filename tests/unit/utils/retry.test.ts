import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withRetry, retryApiCall } from '@/lib/utils/retry'

describe('Retry Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await withRetry(fn, { maxRetries: 3 })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      const result = await withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
        retryableErrors: [/network/i],
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should fail after max retries', async () => {
      const error = new Error('Network error')
      const fn = vi.fn().mockRejectedValue(error)
      
      await expect(
        withRetry(fn, {
          maxRetries: 3,
          initialDelay: 10,
          retryableErrors: [/network/i],
        })
      ).rejects.toThrow('Network error')
      
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should not retry non-retryable errors', async () => {
      const error = new Error('Validation error')
      const fn = vi.fn().mockRejectedValue(error)
      
      await expect(
        withRetry(fn, {
          maxRetries: 3,
          initialDelay: 10,
          retryableErrors: [/network/i],
        })
      ).rejects.toThrow('Validation error')
      
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call onRetry callback', async () => {
      const onRetry = vi.fn()
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      await withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
        retryableErrors: [/network/i],
        onRetry,
      })
      
      expect(onRetry).toHaveBeenCalledTimes(1)
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error), expect.any(Number))
    })
  })

  describe('retryApiCall', () => {
    it('should retry on network errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      const result = await retryApiCall(fn, {
        maxRetries: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should retry on timeout errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Timeout error'))
        .mockResolvedValue('success')
      
      const result = await retryApiCall(fn, {
        maxRetries: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should retry on 5xx errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockResolvedValue('success')
      
      const result = await retryApiCall(fn, {
        maxRetries: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

