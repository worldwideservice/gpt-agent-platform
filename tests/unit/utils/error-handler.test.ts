import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createErrorResponse, classifyError, ErrorType, withErrorHandling, ApiErrorResponse } from '@/lib/utils/error-handler'
import * as Sentry from '@sentry/nextjs'

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}))

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('classifyError', () => {
    it('should classify validation errors', () => {
      const error = new Error('Validation error: invalid input')
      expect(classifyError(error)).toBe(ErrorType.VALIDATION)
    })

    it('should classify authentication errors', () => {
      const error = new Error('Unauthorized access')
      expect(classifyError(error)).toBe(ErrorType.AUTHENTICATION)
    })

    it('should classify authorization errors', () => {
      const error = new Error('Forbidden: permission denied')
      expect(classifyError(error)).toBe(ErrorType.AUTHORIZATION)
    })

    it('should classify not found errors', () => {
      const error = new Error('Resource not found')
      expect(classifyError(error)).toBe(ErrorType.NOT_FOUND)
    })

    it('should classify rate limit errors', () => {
      const error = new Error('Rate limit exceeded')
      expect(classifyError(error)).toBe(ErrorType.RATE_LIMIT)
    })

    it('should classify database errors', () => {
      const error = new Error('Database connection failed')
      expect(classifyError(error)).toBe(ErrorType.DATABASE)
    })

    it('should classify external service errors', () => {
      const error = new Error('External API error')
      expect(classifyError(error)).toBe(ErrorType.EXTERNAL_SERVICE)
    })

    it('should default to internal error', () => {
      const error = new Error('Unknown error')
      expect(classifyError(error)).toBe(ErrorType.INTERNAL)
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response with correct status', () => {
      const error = new Error('Validation error')
      const { response, status } = createErrorResponse(error)
      
      expect(response.success).toBe(false)
      expect(response.error).toBe('Validation error')
      expect(status).toBe(400)
    })

    it('should log to Sentry for internal errors', () => {
      const error = new Error('Internal error')
      createErrorResponse(error, { logToSentry: true })
      
      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.any(Object))
    })

    it('should not log to Sentry if logToSentry is false', () => {
      const error = new Error('Validation error')
      createErrorResponse(error, { logToSentry: false })
      
      expect(Sentry.captureException).not.toHaveBeenCalled()
    })

    it('should include custom code and details', () => {
      const error = new Error('Custom error')
      const { response } = createErrorResponse(error, {
        code: 'CUSTOM_ERROR',
        details: { field: 'test' },
      })
      
      expect(response.code).toBe('CUSTOM_ERROR')
      expect(response.details).toEqual({ field: 'test' })
    })
  })

  describe('withErrorHandling', () => {
    it('should return result on success', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await withErrorHandling(fn)
      
      expect(result).toBe('success')
    })

    it('should throw ApiErrorResponse on error', async () => {
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      await expect(withErrorHandling(fn)).rejects.toThrow(ApiErrorResponse)
    })

    it('should include context in error', async () => {
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      try {
        await withErrorHandling(fn, { code: 'TEST_ERROR' })
      } catch (e) {
        expect(e).toBeInstanceOf(ApiErrorResponse)
        if (e instanceof ApiErrorResponse) {
          expect(e.response.code).toBe('TEST_ERROR')
        }
      }
    })
  })
})

