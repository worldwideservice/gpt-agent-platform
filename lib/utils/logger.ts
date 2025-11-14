import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino'
import * as Sentry from '@sentry/nextjs'
import { trace } from '@opentelemetry/api'
import { randomUUID } from 'crypto'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  [key: string]: unknown
  correlationId?: string
  requestId?: string
  userId?: string
  sessionId?: string
  traceId?: string
  spanId?: string
}

export interface StructuredLogEntry {
  timestamp: string
  level: LogLevel
  message: string
  service: string
  environment: string
  correlationId?: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
    name: string
    code?: string
  }
  performance?: {
    duration: number
    operation: string
  }
}

const isProduction = process.env.NODE_ENV === 'production'
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'

// Log sampling rate for production (0.0 to 1.0)
// Sample 10% of debug logs in production to reduce noise
const PRODUCTION_DEBUG_SAMPLE_RATE = parseFloat(process.env.LOG_SAMPLE_RATE || '0.1')

const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: {
    service: 'next-app',
    environment,
    version: process.env.npm_package_version || '1.0.0',
  },
  redact: ['password', 'token', 'headers.authorization', 'apiKey', 'secret'],
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      },
}

const baseLogger: PinoLogger = pino(pinoOptions)

class Logger {
  private readonly isDevelopment = !isProduction
  private correlationId?: string

  constructor(
    private readonly logger: PinoLogger,
    correlationId?: string
  ) {
    this.correlationId = correlationId
  }

  /**
   * Set correlation ID for all subsequent logs
   */
  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId
  }

  /**
   * Get current correlation ID
   */
  getCorrelationId(): string | undefined {
    return this.correlationId
  }

  /**
   * Generate a new correlation ID
   */
  generateCorrelationId(): string {
    const correlationId = randomUUID()
    this.correlationId = correlationId
    return correlationId
  }

  /**
   * Enrich context with correlation ID and trace information
   */
  private enrichContext(context?: LogContext): LogContext {
    const span = trace.getActiveSpan()
    const spanContext = span?.spanContext()

    return {
      ...context,
      correlationId: this.correlationId || context?.correlationId,
      traceId: spanContext?.traceId || context?.traceId,
      spanId: spanContext?.spanId || context?.spanId,
    }
  }

  /**
   * Check if log should be sampled (for production debug logs)
   */
  private shouldSample(level: LogLevel): boolean {
    // Always log info, warn, error, fatal
    if (level !== 'debug' && level !== 'trace') {
      return true
    }

    // In development, log everything
    if (this.isDevelopment) {
      return true
    }

    // In production, sample debug/trace logs
    return Math.random() < PRODUCTION_DEBUG_SAMPLE_RATE
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldSample('info')) return

    const enrichedContext = this.enrichContext(context)
    this.logger.info(enrichedContext, message)
    this.annotateSpan('info', message, enrichedContext)
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldSample('warn')) return

    const enrichedContext = this.enrichContext(context)
    this.logger.warn(enrichedContext, message)
    this.annotateSpan('warn', message, enrichedContext)
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    if (!this.shouldSample('error')) return

    const enrichedContext = this.enrichContext(context)
    const payload = {
      ...enrichedContext,
      err: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        // @ts-expect-error - error.code may exist on some errors
        code: error.code,
      } : error,
    }

    this.logger.error(payload, message)

    // Send errors to Sentry in production
    if (error instanceof Error && isProduction) {
      Sentry.captureException(error, {
        extra: enrichedContext,
        tags: {
          service: 'next-app',
          environment,
          correlationId: this.correlationId,
        },
      })
    }

    this.annotateSpan('error', message, { ...enrichedContext, error })
  }

  /**
   * Логирует показатели производительности
   */
  performance(operation: string, durationMs: number, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    const payload: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Performance: ${operation}`,
      service: 'next-app',
      environment,
      correlationId: this.correlationId,
      context: enrichedContext,
      performance: {
        duration: durationMs,
        operation,
      },
    }

    this.logger.info(payload, `Performance: ${operation} - ${durationMs}ms`)

    // Annotate span with performance data
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
   * Логирует с контекстом (для структурированного логирования)
   */
  logWithContext(level: LogLevel, message: string, context: LogContext): void {
    if (!this.shouldSample(level)) return

    const enrichedContext = this.enrichContext(context)
    const logEntry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'next-app',
      environment,
      correlationId: this.correlationId,
      context: enrichedContext,
    }

    // Log using appropriate pino level
    this.logger[level](logEntry, message)

    // Annotate span
    this.annotateSpan(level, message, enrichedContext)
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldSample('debug')) return

    const enrichedContext = this.enrichContext(context)
    this.logger.debug(enrichedContext, message)
    this.annotateSpan('debug', message, enrichedContext)
  }

  trace(message: string, context?: LogContext): void {
    if (!this.shouldSample('trace')) return

    const enrichedContext = this.enrichContext(context)
    this.logger.trace(enrichedContext, message)
    this.annotateSpan('trace', message, enrichedContext)
  }

  fatal(message: string, error?: unknown, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context)
    const payload = {
      ...enrichedContext,
      err: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }

    this.logger.fatal(payload, message)

    // Send fatal errors to Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: 'fatal',
        extra: enrichedContext,
        tags: {
          service: 'next-app',
          environment,
          correlationId: this.correlationId,
        },
      })
    }

    this.annotateSpan('fatal', message, { ...enrichedContext, error })
  }

  /**
   * Create a child logger with additional context
   */
  child(bindings: LogContext): Logger {
    const childLogger = this.logger.child(bindings)
    return new Logger(childLogger, this.correlationId)
  }

  /**
   * Create a logger with correlation ID
   */
  withCorrelationId(correlationId: string): Logger {
    const childLogger = this.logger.child({ correlationId })
    return new Logger(childLogger, correlationId)
  }

  private annotateSpan(level: LogLevel, message: string, context?: LogContext): void {
    const span = trace.getActiveSpan()
    if (span) {
      span.addEvent(`log.${level}`, {
        message,
        ...(context ?? {}),
      })
    }
  }
}

export const logger = new Logger(baseLogger)

/**
 * Create a logger with correlation ID from request headers
 */
export function createLoggerFromRequest(request: Request): Logger {
  // Try to get correlation ID from headers
  const correlationId =
    request.headers.get('x-correlation-id') ||
    request.headers.get('x-request-id') ||
    randomUUID()

  return logger.withCorrelationId(correlationId)
}

/**
 * Helper to create correlation ID header
 */
export function createCorrelationIdHeader(correlationId?: string): Record<string, string> {
  const id = correlationId || randomUUID()
  return {
    'x-correlation-id': id,
    'x-request-id': id,
  }
}

/**
 * Middleware helper to extract or generate correlation ID
 */
export function getOrCreateCorrelationId(request: Request): string {
  return (
    request.headers.get('x-correlation-id') ||
    request.headers.get('x-request-id') ||
    randomUUID()
  )
}
