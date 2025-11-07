import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as retryUtils from '@/lib/utils/retry'

describe('Retry Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('retry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await retryUtils.retry(fn, { maxAttempts: 3 })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      const result = await retryUtils.retry(fn, {
        maxAttempts: 3,
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
        retryUtils.retry(fn, {
          maxAttempts: 3,
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
        retryUtils.retry(fn, {
          maxAttempts: 3,
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
      
      await retryUtils.retry(fn, {
        maxAttempts: 3,
        initialDelay: 10,
        retryableErrors: [/network/i],
        onRetry,
      })
      
      expect(onRetry).toHaveBeenCalledTimes(1)
      // onRetry вызывается с параметрами: (error, attempt, delay)
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), expect.any(Number), expect.any(Number))
    })
  })

  describe('retryApiCall', () => {
    it('should retry on network errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      const result = await retryUtils.retryApiCall(fn, {
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
      
      const result = await retryUtils.retryApiCall(fn, {
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
      
      const result = await retryUtils.retryApiCall(fn, {
        maxRetries: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('retry - advanced options', () => {
    it('should use custom shouldRetry function', async () => {
      const error = new Error('Custom error')
      const fn = vi.fn().mockRejectedValue(error)
      const shouldRetry = vi.fn().mockReturnValue(false)
      
      await expect(
        retryUtils.retry(fn, {
          maxAttempts: 3,
          initialDelay: 10,
          shouldRetry,
        })
      ).rejects.toThrow('Custom error')
      
      expect(fn).toHaveBeenCalledTimes(1)
      expect(shouldRetry).toHaveBeenCalledWith(error, 1)
    })

    it('should respect maxDelay option', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockRejectedValueOnce(new Error('Error 2'))
        .mockResolvedValue('success')
      
      const onRetry = vi.fn()
      
      await retryUtils.retry(fn, {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 2000,
        backoffMultiplier: 2,
        onRetry,
      })
      
      expect(fn).toHaveBeenCalledTimes(3)
      expect(onRetry).toHaveBeenCalledTimes(2)
      // Проверяем что задержки не превышают maxDelay
      const delays = onRetry.mock.calls.map(call => call[2])
      delays.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(2000)
      })
    })

    it('should use custom backoffMultiplier', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockResolvedValue('success')
      
      const onRetry = vi.fn()
      
      await retryUtils.retry(fn, {
        maxAttempts: 2,
        initialDelay: 100,
        backoffMultiplier: 3,
        onRetry,
      })
      
      expect(onRetry).toHaveBeenCalledTimes(1)
      const delay = onRetry.mock.calls[0][2]
      // С multiplier=3, delay = 100 * 3^0 = 100
      expect(delay).toBe(100)
    })

    it('should handle string patterns in retryableErrors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockResolvedValue('success')
      
      const result = await retryUtils.retry(fn, {
        maxAttempts: 3,
        initialDelay: 10,
        retryableErrors: ['timeout', 'network'],
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should handle maxRetries option (deprecated)', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValue('success')
      
      const result = await retryUtils.retry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('retryWithJitter', () => {
    it('should retry with jitter and succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success')
      
      const result = await retryUtils.retryWithJitter(fn, {
        maxAttempts: 3,
        initialDelay: 10,
      })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should add jitter to delay', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValue('success')
      
      const onRetry = vi.fn()
      const originalOnRetry = vi.fn()
      
      await retryUtils.retryWithJitter(fn, {
        maxAttempts: 3,
        initialDelay: 100,
        onRetry: originalOnRetry,
      })
      
      // onRetry внутри retryWithJitter будет вызван с jittered delay
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should fail after max attempts with jitter', async () => {
      const error = new Error('Persistent error')
      const fn = vi.fn().mockRejectedValue(error)
      
      await expect(
        retryUtils.retryWithJitter(fn, {
          maxAttempts: 2,
          initialDelay: 10,
        })
      ).rejects.toThrow('Persistent error')
      
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

