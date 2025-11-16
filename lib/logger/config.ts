/**
 * Logger configuration with file rotation
 * Uses pino with optional file output and daily rotation
 */

import type { LoggerOptions, TransportTargetOptions } from 'pino'
import { resolve } from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')

// Enable file logging in production or when explicitly requested
const enableFileLogging = process.env.LOG_TO_FILE === 'true' || isProduction

// Log directory
const logDir = process.env.LOG_DIR || resolve(process.cwd(), 'logs')

/**
 * Base pino configuration
 */
export const pinoConfig: LoggerOptions = {
  level: logLevel,
  base: {
    service: 'gpt-agent-platform',
    environment,
    version: process.env.npm_package_version || '1.0.0',
  },
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'secret',
      'headers.authorization',
      'headers.cookie',
      'req.headers.authorization',
      'req.headers.cookie',
      'access_token',
      'refresh_token',
      '*.password',
      '*.token',
      '*.secret',
    ],
    remove: true, // Remove redacted fields entirely
  },
  formatters: {
    level: (label) => ({ level: label }),
    // Bin bindings: (bindings) => ({
    //   pid: bindings.pid,
    //   host: bindings.hostname,
    //   ...bindings,
    // }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
}

/**
 * Development transport (pretty printing)
 */
const devTransport: TransportTargetOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss.l',
    ignore: 'pid,hostname',
    singleLine: false,
    messageFormat: '{levelLabel} - {msg}',
  },
  level: logLevel,
}

/**
 * Production file transport with daily rotation
 * Note: This requires 'pino/file' or custom implementation
 */
const fileTransports: TransportTargetOptions[] = [
  // All logs
  {
    target: 'pino/file',
    options: {
      destination: `${logDir}/app.log`,
      mkdir: true,
    },
    level: 'info',
  },
  // Error logs only
  {
    target: 'pino/file',
    options: {
      destination: `${logDir}/error.log`,
      mkdir: true,
    },
    level: 'error',
  },
]

/**
 * Get transport configuration based on environment
 */
export function getTransportConfig(): TransportTargetOptions | TransportTargetOptions[] | undefined {
  if (!isProduction) {
    // Development: pretty print to console
    return devTransport
  }

  if (enableFileLogging) {
    // Production with file logging: write to files
    return fileTransports
  }

  // Production without file logging: JSON to stdout (for cloud logging)
  return undefined
}

/**
 * Pino options with transport
 */
export function getPinoOptions(): LoggerOptions {
  const transport = getTransportConfig()

  return {
    ...pinoConfig,
    ...(transport && { transport }),
  }
}

/**
 * Log rotation configuration
 * Used by external tools like logrotate or custom rotation script
 */
export const rotationConfig = {
  // Rotate daily
  frequency: 'daily',

  // Keep logs for 14 days
  maxAge: 14,

  // Maximum log file size (100MB)
  maxSize: '100M',

  // Compress old logs
  compress: true,

  // Log file pattern
  datePattern: 'YYYY-MM-DD',
}

/**
 * Get log directory path
 */
export function getLogDir(): string {
  return logDir
}

/**
 * Check if file logging is enabled
 */
export function isFileLoggingEnabled(): boolean {
  return enableFileLogging
}
