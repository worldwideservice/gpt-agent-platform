import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino'
import * as Sentry from '@sentry/nextjs'
import { trace } from '@opentelemetry/api'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  [key: string]: unknown
}

const isProduction = process.env.NODE_ENV === 'production'

const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: { service: 'next-app' },
  redact: ['password', 'token', 'headers.authorization'],
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
  constructor(private readonly logger: PinoLogger) {}

  info(message: string, context?: LogContext): void {
    this.logger.info(context ?? {}, message)
    this.annotateSpan('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context ?? {}, message)
    this.annotateSpan('warn', message, context)
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    const payload = {
      ...context,
      err: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }

    this.logger.error(payload, message)

    if (error instanceof Error && isProduction) {
      Sentry.captureException(error, {
        extra: context,
        tags: { service: 'next-app' },
      })
    }

    this.annotateSpan('error', message, { ...context, error })
  }

  /**
   * Логирует показатели производительности
   */
  performance(operation: string, durationMs: number, context?: LogContext): void {
    const payload = {
      duration: `${durationMs}ms`,
      ...context,
    }

    if (this.isDevelopment) {
      console.debug(`[PERF] ${operation}`, payload)
    } else {
      // В продакшене выводим только ключевую информацию, без лишнего шума
      console.log(`[PERF] ${operation}`, payload)
    }
  }

  /**
   * Логирует с контекстом (для структурированного логирования)
   */
  logWithContext(level: LogLevel, message: string, context: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    }
  debug(message: string, context?: LogContext): void {
    this.logger.debug(context ?? {}, message)
    this.annotateSpan('debug', message, context)
  }

  child(bindings: LogContext): Logger {
    return new Logger(this.logger.child(bindings))
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
