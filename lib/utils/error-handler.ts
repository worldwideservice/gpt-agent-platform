/**
 * Единый обработчик ошибок для API endpoints
 * Обеспечивает консистентный формат ответов и логирование
 */

import * as Sentry from '@sentry/nextjs'

import { recordApiError } from '@/lib/monitoring/metrics'

export interface ApiError {
  success: false
  error: string
  code?: string
  details?: unknown
  timestamp: string
}

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  timestamp: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

/**
 * Классификация ошибок для правильной обработки
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  DATABASE = 'DATABASE_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * Определяет тип ошибки
 */
export function classifyError(error: unknown): ErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION
    }

    if (message.includes('unauthorized') || message.includes('auth')) {
      return ErrorType.AUTHENTICATION
    }

    if (message.includes('forbidden') || message.includes('permission')) {
      return ErrorType.AUTHORIZATION
    }

    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND
    }

    if (message.includes('rate limit') || message.includes('429')) {
      return ErrorType.RATE_LIMIT
    }

    if (message.includes('database') || message.includes('sql')) {
      return ErrorType.DATABASE
    }

    if (message.includes('external') || message.includes('api')) {
      return ErrorType.EXTERNAL_SERVICE
    }
  }

  return ErrorType.INTERNAL
}

/**
 * Получает HTTP статус код для типа ошибки
 */
function getHttpStatus(errorType: ErrorType): number {
  switch (errorType) {
    case ErrorType.VALIDATION:
      return 400
    case ErrorType.AUTHENTICATION:
      return 401
    case ErrorType.AUTHORIZATION:
      return 403
    case ErrorType.NOT_FOUND:
      return 404
    case ErrorType.RATE_LIMIT:
      return 429
    case ErrorType.EXTERNAL_SERVICE:
    case ErrorType.DATABASE:
    case ErrorType.INTERNAL:
    default:
      return 500
  }
}

/**
 * Создает стандартизированный ответ об ошибке
 */
export function createErrorResponse(
  error: unknown,
  context?: {
    code?: string
    details?: unknown
    logToSentry?: boolean
    route?: string
    method?: string
  }
): { response: ApiError; status: number } {
  let errorType = classifyError(error)
  
  // Если явно указан код валидации, используем его для определения статуса
  if (context?.code === 'VALIDATION_ERROR' || context?.code === ErrorType.VALIDATION) {
    errorType = ErrorType.VALIDATION
  }
  
  const message = error instanceof Error ? error.message : String(error)
  const status = getHttpStatus(errorType)

  const errorResponse: ApiError = {
    success: false,
    error: message,
    code: context?.code || errorType,
    details: context?.details,
    timestamp: new Date().toISOString(),
  }

  // Логируем в Sentry только для критичных ошибок
  if (context?.logToSentry !== false && (errorType === ErrorType.INTERNAL || errorType === ErrorType.EXTERNAL_SERVICE)) {
    Sentry.captureException(error, {
      tags: {
        error_type: errorType,
        error_code: context?.code,
      },
      extra: {
        details: context?.details,
      },
    })
  }

  // Логируем в консоль для разработки
  if (process.env.NODE_ENV === 'development') {
    console.error(`[error-handler] ${errorType}:`, error)
  }

  if (context?.route && context?.method && status >= 500) {
    recordApiError({
      route: context.route,
      method: context.method,
      statusCode: status,
    })
  }

  return { response: errorResponse, status }
}

/**
 * Оборачивает асинхронную функцию с обработкой ошибок
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: {
    code?: string
    logToSentry?: boolean
  }
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const { response, status } = createErrorResponse(error, context)
    throw new ApiErrorResponse(response, status)
  }
}

/**
 * Кастомный класс ошибки для API ответов
 */
export class ApiErrorResponse extends Error {
  constructor(
    public response: ApiError,
    public status: number
  ) {
    super(response.error)
    this.name = 'ApiErrorResponse'
  }
}

/**
 * Graceful degradation - выполняет функцию, но не выбрасывает ошибку
 * Полезно для некритичных операций (логирование, метрики)
 */
export async function withGracefulDegradation<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.warn(
      errorMessage || 'Graceful degradation: operation failed, using fallback',
      error
    )
    return fallback
  }
}

