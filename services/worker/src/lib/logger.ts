import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino'
import { trace } from '@opentelemetry/api'
import { Sentry } from './sentry'

interface LogContext {
  jobId?: string
  jobName?: string
  orgId?: string
  agentId?: string
  userId?: string
  [key: string]: unknown
}

const isProduction = process.env.NODE_ENV === 'production'

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: { service: 'worker' },
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
        },
      },
}

const baseLogger: PinoLogger = pino(options)

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

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const payload = {
      ...context,
      err: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }

    this.logger.error(payload, message)

    if (error instanceof Error) {
      Sentry.captureException(error, { extra: context })
    }

    this.annotateSpan('error', message, { ...context, error })
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context ?? {}, message)
    this.annotateSpan('debug', message, context)
  }

  jobStart(jobId: string, jobName: string, data?: unknown): void {
    this.info(`Job started: ${jobName}`, {
      jobId,
      jobName,
      jobData: data,
      event: 'job.start',
    })
  }

  jobComplete(jobId: string, jobName: string, duration: number, result?: unknown): void {
    this.info(`Job completed: ${jobName}`, {
      jobId,
      jobName,
      duration,
      result,
      event: 'job.complete',
    })
  }

  jobFailed(jobId: string, jobName: string, error: Error | unknown, duration?: number): void {
    this.error(`Job failed: ${jobName}`, error, {
      jobId,
      jobName,
      duration,
      event: 'job.failed',
    })
  }

  redisConnect(): void {
    this.info('Redis connected', {
      event: 'redis.connect',
    })
  }

  redisDisconnect(): void {
    this.warn('Redis disconnected', {
      event: 'redis.disconnect',
    })
  }

  redisError(error: Error): void {
    this.error('Redis error', error, {
      event: 'redis.error',
    })
  }

  redisReconnectAttempt(attempt: number): void {
    this.warn(`Redis reconnecting (attempt ${attempt})`, {
      event: 'redis.reconnect',
      attempt,
    })
  }

  private annotateSpan(level: string, message: string, context?: LogContext): void {
    const span = trace.getActiveSpan()
    span?.addEvent(`worker.log.${level}`, {
      message,
      ...(context ?? {}),
    })
  }
}

export const logger = new Logger(baseLogger)

