/**
 * Универсальный retry механизм с exponential backoff
 * Используется для надежных вызовов внешних API
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  retryableErrors?: Array<string | RegExp>
  onRetry?: (attempt: number, error: Error, delay: number) => void
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'retryableErrors' | 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 секунда
  maxDelay: 30000, // 30 секунд
  backoffMultiplier: 2,
}

/**
 * Проверяет, является ли ошибка retryable
 */
function isRetryableError(error: unknown, retryableErrors?: Array<string | RegExp>): boolean {
  if (!retryableErrors || retryableErrors.length === 0) {
    // По умолчанию retry для сетевых ошибок и 5xx
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      return (
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('econnreset') ||
        errorMessage.includes('etimedout')
      )
    }
    return false
  }

  const errorString = error instanceof Error ? error.message : String(error)

  return retryableErrors.some((pattern) => {
    if (typeof pattern === 'string') {
      return errorString.includes(pattern)
    }
    return pattern.test(errorString)
  })
}

/**
 * Вычисляет задержку для следующей попытки (exponential backoff)
 */
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'retryableErrors' | 'onRetry'>>): number {
  const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1)
  return Math.min(delay, options.maxDelay)
}

/**
 * Выполняет функцию с retry механизмом
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  let lastError: Error | unknown

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Если это последняя попытка или ошибка не retryable - выбрасываем
      if (attempt >= opts.maxRetries || !isRetryableError(error, opts.retryableErrors)) {
        throw error
      }

      // Вычисляем задержку
      const delay = calculateDelay(attempt, opts)

      // Вызываем callback если есть
      if (opts.onRetry && error instanceof Error) {
        opts.onRetry(attempt, error, delay)
      }

      // Логируем retry
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[retry] Attempt ${attempt}/${opts.maxRetries} failed, retrying in ${delay}ms:`,
          error instanceof Error ? error.message : String(error)
        )
      }

      // Ждем перед следующей попыткой
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Не должно быть достигнуто, но TypeScript требует
  throw lastError
}

/**
 * Специализированный retry для API вызовов
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    retryableErrors: [
      /network/i,
      /timeout/i,
      /econnrefused/i,
      /econnreset/i,
      /etimedout/i,
      /503/i,
      /502/i,
      /500/i,
    ],
    ...options,
  })
}

