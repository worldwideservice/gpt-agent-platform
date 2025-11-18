import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as React from 'react'

export const cn = (...inputs: ClassValue[]): string => {
 return twMerge(clsx(inputs))
}

// Logging utility
export enum LogLevel {
 ERROR = 'error',
 WARN = 'warn',
 INFO = 'info',
 DEBUG = 'debug',
}

interface LogContext {
  userId?: string
  orgId?: string
  requestId?: string
  [key: string]: unknown
}

class Logger {
 private context: LogContext = {}

 setContext(context: LogContext) {
 this.context = { ...this.context, ...context }
 }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
 const timestamp = new Date().toISOString()
 const logEntry = {
 timestamp,
 level,
 message,
 context: this.context,
 ...(data && { data }),
 ...(error && {
 error: {
 message: error.message,
 stack: error.stack,
 name: error.name,
 }
 }),
 }

 // In production, you might want to send to a logging service
 if (process.env.NODE_ENV === 'production') {
 // Send to logging service (e.g., Sentry, DataDog, etc.)
 logger.info(JSON.stringify(logEntry))
 } else {
 // Pretty print in development
 const color = {
 [LogLevel.ERROR]: '\x1b[31m', // Red
 [LogLevel.WARN]: '\x1b[33m', // Yellow
 [LogLevel.INFO]: '\x1b[36m', // Cyan
 [LogLevel.DEBUG]: '\x1b[35m', // Magenta
 }[level] || '\x1b[0m'

 logger.info(`${color}[${level.toUpperCase()}] ${timestamp} ${message}\x1b[0m`)
        if (data) logger.info('Data:', data)
 if (error) logger.error('Error:', error)
 }
 }

  error(message: string, error?: Error, data?: unknown) {
 this.log(LogLevel.ERROR, message, data, error)
 }

  warn(message: string, data?: unknown) {
 this.log(LogLevel.WARN, message, data)
 }

  info(message: string, data?: unknown) {
 this.log(LogLevel.INFO, message, data)
 }

  debug(message: string, data?: unknown) {
 this.log(LogLevel.DEBUG, message, data)
 }
}

// Create singleton logger instance
export const logger = new Logger()

// Request logging middleware helper
export const createRequestLogger = (requestId: string) => {
 const requestLogger = new Logger()
 requestLogger.setContext({ requestId })
 return requestLogger
}

// Performance utilities
import { lazy } from 'react'

/**
 * Creates a lazy-loaded component with error boundary
 * @param importFn - Dynamic import function
 * @param fallback - Loading component or null
 * @returns Lazy component with Suspense wrapper
 */
export function createLazyComponent<T extends React.ComponentType<unknown>>(
 importFn: () => Promise<{ default: T }>
) {
 const LazyComponent = lazy(importFn)

 return {
 component: LazyComponent,
 // Note: withSuspense should be used in .tsx files
 LazyComponent,
 }
}

// Memoization helpers
export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
 const key = getKey ? getKey(...args) : JSON.stringify(args)

 if (cache.has(key)) {
 return cache.get(key)!
 }

 const result = fn(...args)
 cache.set(key, result)
 return result
 }) as T
}

export const formatNumber = (value: number | string): string => {
 if (typeof value === 'string') {
 return value
 }

 return new Intl.NumberFormat('ru-RU').format(value)
}

export const slugify = (value: string): string => {
 return value
 .toLowerCase()
 .normalize('NFD')
 .replace(/\p{Diacritic}/gu, '')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/(^-|-$)+/g, '')
}
