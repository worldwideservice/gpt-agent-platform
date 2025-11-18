/**
 * Enhanced Logger with AsyncLocalStorage support
 * Extends the existing Pino logger with automatic request context
 */

import pino, { type Logger as PinoLogger } from 'pino'
import { getPinoOptions } from './config'
import { getRequestContext, getRequestId, type RequestContext } from './async-storage'
import * as Sentry from '@sentry/nextjs'
import { trace } from '@opentelemetry/api'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  [key: string]: unknown
  requestId?: string
  userId?: string
  orgId?: string
  sessionId?: string
  traceId?: string
  spanId?: string
}

const isProduction = process.env.NODE_ENV === 'production'
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'

// Lazy initialization to avoid build-time errors
let baseLogger: PinoLogger | null = null

function getBaseLogger(): PinoLogger {
  if (!baseLogger) {
    try {
      baseLogger = pino(getPinoOptions())
    } catch (error) {
      // Fallback to simple console logger if pino fails during build
      baseLogger = {
        info: (...args: any[]) => console.log('[INFO]', ...args),
        warn: (...args: any[]) => console.warn('[WARN]', ...args),
        error: (...args: any[]) => console.error('[ERROR]', ...args),
        debug: (...args: any[]) => console.log('[DEBUG]', ...args),
        trace: (...args: any[]) => console.log('[TRACE]', ...args),
        fatal: (...args: any[]) => console.error('[FATAL]', ...args),
        child: () => getBaseLogger(),
      } as any
    }
  }
  return baseLogger
}

/**
 * Enhanced Logger class with AsyncLocalStorage support
 */
class EnhancedLogger {
  constructor(private readonly logger: PinoLogger) {}

  /**
   * Enrich context with request data from AsyncLocalStorage
   */
  private enrichContext(context?: LogContext): LogContext {
    const requestContext = getRequestContext()
    const span = trace.getActiveSpan()
    const spanContext = span?.spanContext()

    return {
      ...context,
      requestId: context?.requestId || requestContext?.requestId || getRequestId(),
      userId: context?.userId || requestContext?.userId,
      orgId: context?.orgId || requestContext?.orgId,
      path: requestContext?.path,
      method: requestContext?.method,
      ip: requestContext?.ip,
      traceId: spanContext?.traceId || context?.traceId,
      spanId: spanContext?.spanId || context?.spanId,
    }
  }

  /**
   * Annotate OpenTelemetry span with log event
   */
  private annotateSpan(level: LogLevel, message: string, context?: LogContext): void {
    const span = trace.getActiveSpan()
    if (span) {
      span.addEvent(`log.${level}`, {
        message,
        ...(context ?? {}),
      })
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    this.logger.info(enrichedContext, message)
    this.annotateSpan('info', message, enrichedContext)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    this.logger.warn(enrichedContext, message)
    this.annotateSpan('warn', message, enrichedContext)
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)

    const payload = {
      ...enrichedContext,
      err: error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
            // @ts-expect-error - code may exist on some errors
            code: error.code,
          }
        : error,
    }

    this.logger.error(payload, message)

    // Send to Sentry in production
    if (error instanceof Error && isProduction) {
      Sentry.captureException(error, {
        extra: enrichedContext,
        tags: {
          service: 'gpt-agent-platform',
          environment,
          requestId: enrichedContext.requestId,
        },
      })
    }

    this.annotateSpan('error', message, { ...enrichedContext, error })
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    this.logger.debug(enrichedContext, message)
    this.annotateSpan('debug', message, enrichedContext)
  }

  /**
   * Log trace message
   */
  trace(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    this.logger.trace(enrichedContext, message)
    this.annotateSpan('trace', message, enrichedContext)
  }

  /**
   * Log fatal error
   */
  fatal(message: string, error?: unknown, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)

    const payload = {
      ...enrichedContext,
      err: error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
    }

    this.logger.fatal(payload, message)

    // Send to Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: 'fatal',
        extra: enrichedContext,
        tags: {
          service: 'gpt-agent-platform',
          environment,
          requestId: enrichedContext.requestId,
        },
      })
    }

    this.annotateSpan('fatal', message, { ...enrichedContext, error })
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, durationMs: number, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)

    this.logger.info(
      {
        ...enrichedContext,
        performance: {
          operation,
          duration: durationMs,
        },
      },
      `Performance: ${operation} - ${durationMs}ms`
    )

    // Annotate span
    const span = trace.getActiveSpan()
    if (span) {
      span.addEvent('performance', {
        operation,
        duration: durationMs,
        ...enrichedContext,
      })
    }
  }

  /**
   * Create child logger with additional context
   */
  child(bindings: LogContext): EnhancedLogger {
    const childLogger = this.logger?.child?.(bindings) || this.logger
    return new EnhancedLogger(childLogger)
  }

  /**
   * Log HTTP request (convenience method)
   */
  request(method: string, path: string, statusCode: number, durationMs: number, context?: LogContext): void {
    const enrichedContext = this.enrichContext({
      ...context,
      method,
      path,
      statusCode,
      duration: durationMs,
    })

    this.logger.info(
      enrichedContext,
      `${method} ${path} ${statusCode} - ${durationMs}ms`
    )
  }

  /**
   * Log HTTP error response
   */
  requestError(
    method: string,
    path: string,
    statusCode: number,
    error: Error,
    context?: LogContext
  ): void {
    this.error(
      `${method} ${path} ${statusCode} - ${error.message}`,
      error,
      {
        ...context,
        method,
        path,
        statusCode,
      }
    )
  }
}

// Export singleton instance with lazy initialization
export const logger = new EnhancedLogger(getBaseLogger())

// Export types and utilities
export * from './async-storage'
export * from './config'
export type { LogContext, LogLevel }
