/**
 * Централизованная система логирования
 * Согласно Context7 best practices: console.log должен быть защищен проверкой NODE_ENV
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

/**
 * Безопасный логгер для разработки и продакшена
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Логирует сообщение только в development режиме
   */
  log(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, ...args)
    }
  }

  /**
   * Логирует информационное сообщение
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args)
    }
  }

  /**
   * Логирует предупреждение (всегда видно)
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args)
    // В продакшене можно отправлять в Sentry
    if (this.isProduction) {
      // TODO: Интеграция с Sentry для warnings
    }
  }

  /**
   * Логирует ошибку (всегда видно)
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error || '', context || '')
    
    // В продакшене отправляем в Sentry
    if (this.isProduction && error) {
      // TODO: Интеграция с Sentry
      // Sentry.captureException(error, { extra: context })
    }
  }

  /**
   * Логирует отладочное сообщение только в development
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args)
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

    switch (level) {
      case 'log':
      case 'info':
        if (this.isDevelopment) {
          console.log(`[${level.toUpperCase()}] ${message}`, logEntry)
        }
        break
      case 'warn':
        console.warn(`[WARN] ${message}`, logEntry)
        break
      case 'error':
        console.error(`[ERROR] ${message}`, logEntry)
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`[DEBUG] ${message}`, logEntry)
        }
        break
    }
  }
}

// Экспортируем singleton экземпляр
export const logger = new Logger()

// Экспортируем типы для использования в других файлах
export type { LogLevel, LogContext }
