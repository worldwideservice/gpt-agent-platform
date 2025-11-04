/**
 * Structured Logging для Worker
 * Логирование с корреляцией job IDs и контекстом
 */

interface LogContext {
  jobId?: string
  jobName?: string
  orgId?: string
  agentId?: string
  userId?: string
  [key: string]: unknown
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    
    return JSON.stringify({
      timestamp,
      level,
      service: 'worker',
      message,
      ...context,
    })
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context))
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : String(error),
    }
    console.error(this.formatMessage('error', message, errorContext))
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  /**
   * Log job start with correlation ID
   */
  jobStart(jobId: string, jobName: string, data?: unknown): void {
    this.info(`Job started: ${jobName}`, {
      jobId,
      jobName,
      jobData: data,
      event: 'job.start',
    })
  }

  /**
   * Log job completion with duration
   */
  jobComplete(jobId: string, jobName: string, duration: number, result?: unknown): void {
    this.info(`Job completed: ${jobName}`, {
      jobId,
      jobName,
      duration,
      result,
      event: 'job.complete',
    })
  }

  /**
   * Log job failure with error details
   */
  jobFailed(jobId: string, jobName: string, error: Error | unknown, duration?: number): void {
    this.error(`Job failed: ${jobName}`, error, {
      jobId,
      jobName,
      duration,
      event: 'job.failed',
    })
  }

  /**
   * Log Redis connection events
   */
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
}

// Singleton instance
export const logger = new Logger()

