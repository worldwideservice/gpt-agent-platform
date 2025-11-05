/**
 * Professional Logging System
 * 
 * Provides structured logging with different levels and automatic
 * filtering for production environments.
 * 
 * Features:
 * - Environment-aware logging (dev vs production)
 * - Structured log format
 * - Integration with Sentry for error tracking
 * - Performance logging
 * - Security: no sensitive data in production logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
  environment: string
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Sanitizes sensitive data from log context
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apiKey',
      'authorization',
      'cookie',
      'session',
    ]

    const sanitized = { ...context }
    
    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]'
      }
    }

    return sanitized
  }

  /**
   * Formats log entry for consistent output
   */
  private formatLog(entry: LogEntry): string {
    const { level, message, context, timestamp, error } = entry
    
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    
    if (context && Object.keys(context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(context)}`
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`
      }
    }
    
    return logMessage
  }

  /**
   * Sends error to Sentry if available
   */
  private sendToSentry(level: LogLevel, message: string, error?: Error, context?: LogContext) {
    if (!this.isProduction) return
    if (typeof window === 'undefined') return
    if (!(window as any).Sentry) return

    try {
      const Sentry = (window as any).Sentry
      
      if (error) {
        Sentry.captureException(error, {
          level,
          tags: context,
          extra: this.sanitizeContext(context),
        })
      } else {
        Sentry.captureMessage(message, {
          level,
          tags: context,
          extra: this.sanitizeContext(context),
        })
      }
    } catch (err) {
      // Fail silently - don't break app if Sentry fails
      console.error('[Logger] Failed to send to Sentry:', err)
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    // In production, only log warnings and errors
    if (this.isProduction && (level === 'debug' || level === 'info')) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      error,
    }

    const formattedLog = this.formatLog(entry)

    // Use appropriate console method
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog)
        }
        break
      case 'info':
        if (this.isDevelopment) {
          console.info(formattedLog)
        }
        break
      case 'warn':
        console.warn(formattedLog)
        break
      case 'error':
        console.error(formattedLog)
        this.sendToSentry(level, message, error, context)
        break
    }
  }

  /**
   * Debug level logs (development only)
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  /**
   * Info level logs (development only)
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Warning level logs (all environments)
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Error level logs (all environments, sent to Sentry in production)
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error)
  }

  /**
   * Performance logging with timing
   */
  performance(operation: string, duration: number, context?: LogContext): void {
    const perfContext = {
      ...context,
      duration: `${duration}ms`,
      operation,
    }

    if (duration > 1000) {
      this.warn(`Slow operation detected: ${operation}`, perfContext)
    } else if (this.isDevelopment) {
      this.debug(`Performance: ${operation}`, perfContext)
    }
  }

  /**
   * Security event logging
   */
  security(event: string, context?: LogContext): void {
    this.warn(`[SECURITY] ${event}`, this.sanitizeContext(context))
    // Always send security events to monitoring
    if (this.isProduction && typeof window !== 'undefined' && (window as any).Sentry) {
      this.sendToSentry('warn', `[SECURITY] ${event}`, undefined, context)
    }
  }

  /**
   * Redirect logging with metrics
   */
  redirect(from: string, to: string, duration: number, success: boolean, context?: LogContext): void {
    const redirectContext = {
      ...context,
      from,
      to,
      duration: `${duration}ms`,
      success,
    }

    if (success) {
      if (duration > 200) {
        this.warn(`Slow redirect: ${from} → ${to}`, redirectContext)
      } else if (this.isDevelopment) {
        this.debug(`Redirect: ${from} → ${to}`, redirectContext)
      }
    } else {
      this.error(`Redirect failed: ${from} → ${to}`, undefined, redirectContext)
    }
  }
}

// Singleton instance
export const logger = new Logger()

// Convenience exports
export const log = logger
export default logger

