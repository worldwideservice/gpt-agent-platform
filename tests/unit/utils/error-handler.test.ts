import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as Sentry from '@sentry/nextjs'
import * as errorHandler from '@/lib/utils/error-handler'

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
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.VALIDATION)
    })

    it('should classify authentication errors', () => {
      const error = new Error('Unauthorized access')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.AUTHENTICATION)
    })

    it('should classify authorization errors', () => {
      const error = new Error('Forbidden: permission denied')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.AUTHORIZATION)
    })

    it('should classify not found errors', () => {
      const error = new Error('Resource not found')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.NOT_FOUND)
    })

    it('should classify rate limit errors', () => {
      const error = new Error('Rate limit exceeded')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.RATE_LIMIT)
    })

    it('should classify database errors', () => {
      const error = new Error('Database connection failed')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.DATABASE)
    })

    it('should classify external service errors', () => {
      const error = new Error('External API error')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.EXTERNAL_SERVICE)
    })

    it('should default to internal error', () => {
      const error = new Error('Unknown error')
      expect(errorHandler.classifyError(error)).toBe(errorHandler.ErrorType.INTERNAL)
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response with correct status', () => {
      const error = new Error('Validation error')
      const { response, status } = errorHandler.createErrorResponse(error)
      
      expect(response.success).toBe(false)
      expect(response.error).toBe('Validation error')
      expect(status).toBe(400)
    })

    it('should log to Sentry for internal errors', () => {
      const error = new Error('Internal error')
      errorHandler.createErrorResponse(error, { logToSentry: true })
      
      expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.any(Object))
    })

    it('should not log to Sentry if logToSentry is false', () => {
      const error = new Error('Validation error')
      errorHandler.createErrorResponse(error, { logToSentry: false })
      
      expect(Sentry.captureException).not.toHaveBeenCalled()
    })

    it('should include custom code and details', () => {
      const error = new Error('Custom error')
      const { response } = errorHandler.createErrorResponse(error, {
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
      const result = await errorHandler.withErrorHandling(fn)
      
      expect(result).toBe('success')
    })

    it('should throw ApiErrorResponse on error', async () => {
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      await expect(errorHandler.withErrorHandling(fn)).rejects.toThrow(errorHandler.ApiErrorResponse)
    })

    it('should include context in error', async () => {
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      try {
        await errorHandler.withErrorHandling(fn, { code: 'TEST_ERROR' })
      } catch (e) {
        expect(e).toBeInstanceOf(errorHandler.ApiErrorResponse)
        if (e instanceof errorHandler.ApiErrorResponse) {
          expect(e.response.code).toBe('TEST_ERROR')
        }
      }
    })
  })

  describe('ApiErrorResponse', () => {
    it('should create ApiErrorResponse instance', () => {
      const errorResponse = {
        success: false,
        error: 'Test error',
        code: 'TEST_ERROR',
      }
      
      const apiError = new errorHandler.ApiErrorResponse(errorResponse, 400)
      
      expect(apiError).toBeInstanceOf(Error)
      expect(apiError).toBeInstanceOf(errorHandler.ApiErrorResponse)
      expect(apiError.response).toEqual(errorResponse)
      expect(apiError.status).toBe(400)
      expect(apiError.name).toBe('ApiErrorResponse')
      expect(apiError.message).toBe('Test error')
    })
  })

  describe('withGracefulDegradation', () => {
    it('should return result on success', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await errorHandler.withGracefulDegradation(fn, 'fallback')
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalled()
    })

    it('should return fallback on error', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      const result = await errorHandler.withGracefulDegradation(fn, 'fallback')
      
      expect(result).toBe('fallback')
      expect(fn).toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Graceful degradation: operation failed, using fallback',
        error
      )
      
      consoleWarnSpy.mockRestore()
    })

    it('should use custom error message', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      const result = await errorHandler.withGracefulDegradation(fn, 'fallback', 'Custom error message')
      
      expect(result).toBe('fallback')
      expect(consoleWarnSpy).toHaveBeenCalledWith('Custom error message', error)
      
      consoleWarnSpy.mockRestore()
    })

    it('should work with different fallback types', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = new Error('Test error')
      const fn = vi.fn().mockRejectedValue(error)
      
      // Test with number fallback
      const numberResult = await errorHandler.withGracefulDegradation(fn, 42)
      expect(numberResult).toBe(42)
      
      // Test with object fallback
      const objectFallback = { data: 'test' }
      const objectResult = await errorHandler.withGracefulDegradation(fn, objectFallback)
      expect(objectResult).toEqual(objectFallback)
      
      // Test with null fallback
      const nullResult = await errorHandler.withGracefulDegradation(fn, null)
      expect(nullResult).toBeNull()
      
      consoleWarnSpy.mockRestore()
    })
  })
})

