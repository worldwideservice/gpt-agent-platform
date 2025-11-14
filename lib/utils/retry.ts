import { logger } from '@/lib/utils/logger'

/**
 * Retry utility with exponential backoff
 * 
 * Provides professional retry mechanism for async operations
 * with configurable attempts, delays, and error handling.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number
  /** @deprecated Use maxAttempts instead - Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number
  /** Maximum delay in milliseconds (default: 10000) */
  maxDelay?: number
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number
  /** Array of regex patterns or strings to match retryable errors */
  retryableErrors?: (RegExp | string)[]
  /** Function to determine if error should be retried (default: retry all) */
  shouldRetry?: (error: unknown, attempt: number) => boolean
  /** Callback before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delay: number) => void
}

/**
 * Calculates delay for exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt)
  return Math.min(delay, maxDelay)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retries an async function with exponential backoff
 * 
 * @example
 * ```ts
 * const result = await retry(
 *   () => fetch('/api/data'),
 *   {
 *     maxAttempts: 3,
 *     initialDelay: 1000,
 *     onRetry: (error, attempt, delay) => {
 *       logger.info(`Retry ${attempt} after ${delay}ms`)
 *     }
 *   }
 * )
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  // Support both maxAttempts and maxRetries for backward compatibility
  const maxAttempts = options.maxAttempts ?? options.maxRetries ?? 3
  
  const {
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    retryableErrors,
    shouldRetry,
    onRetry,
  } = options

  // Create default shouldRetry if retryableErrors is provided
  const defaultShouldRetry = retryableErrors
    ? (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return retryableErrors.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(errorMessage)
          }
          return errorMessage.toLowerCase().includes(pattern.toLowerCase())
        })
      }
    : () => true

  const shouldRetryFn = shouldRetry || defaultShouldRetry

  let lastError: unknown
  let attempt = 0

  while (attempt < maxAttempts) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      attempt++

      // Check if we should retry
      if (attempt >= maxAttempts || !shouldRetryFn(error, attempt)) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = calculateDelay(
        attempt - 1,
        initialDelay,
        maxDelay,
        backoffMultiplier
      )

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(error, attempt, delay)
      }

      // Wait before retrying
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Retries with jitter (randomized delay) to prevent thundering herd
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const jitterOptions = {
    ...options,
    onRetry: async (error: unknown, attempt: number, delay: number) => {
      // Add random jitter (±20%)
      const jitter = delay * 0.2 * (Math.random() * 2 - 1)
      const jitteredDelay = Math.max(0, delay + jitter)
      
      await sleep(jitteredDelay)
      options.onRetry?.(error, attempt, jitteredDelay)
    },
  }

  return retry(fn, jitterOptions)
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use retry() instead
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return retry(fn, options)
}
