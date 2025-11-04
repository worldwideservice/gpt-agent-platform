/**
 * Job Retry Configuration
 * Стандартные настройки retry для всех типов jobs
 */

import type { JobsOptions } from 'bullmq'

/**
 * Стандартные настройки retry для всех jobs
 * Exponential backoff: 2s, 4s, 8s, 16s, 32s
 */
export const DEFAULT_JOB_RETRY_OPTIONS: JobsOptions = {
  attempts: 5, // 5 попыток
  backoff: {
    type: 'exponential',
    delay: 2000, // Начальная задержка 2 секунды
  },
  removeOnComplete: {
    count: 1000, // Хранить последние 1000 успешных jobs
    age: 24 * 3600, // 24 часа
  },
  removeOnFail: {
    count: 5000, // Хранить последние 5000 неудачных jobs
    age: 7 * 24 * 3600, // 7 дней
  },
}

/**
 * Настройки retry для критических jobs (например, отправка сообщений в CRM)
 * Больше попыток и более агрессивный retry
 */
export const CRITICAL_JOB_RETRY_OPTIONS: JobsOptions = {
  attempts: 10, // 10 попыток для критических jobs
  backoff: {
    type: 'exponential',
    delay: 1000, // Начальная задержка 1 секунда (быстрее retry)
  },
  removeOnComplete: {
    count: 2000, // Хранить больше успешных jobs для критических операций
    age: 48 * 3600, // 48 часов
  },
  removeOnFail: {
    count: 10000, // Хранить больше неудачных jobs для анализа
    age: 14 * 24 * 3600, // 14 дней
  },
}

/**
 * Настройки retry для быстрых jobs (например, обновление статуса)
 * Меньше попыток, так как job может быть быстро пересоздан
 */
export const FAST_JOB_RETRY_OPTIONS: JobsOptions = {
  attempts: 3, // 3 попытки для быстрых jobs
  backoff: {
    type: 'exponential',
    delay: 1000, // Начальная задержка 1 секунда
  },
  removeOnComplete: {
    count: 500, // Меньше хранить успешных jobs
    age: 12 * 3600, // 12 часов
  },
  removeOnFail: {
    count: 1000, // Меньше хранить неудачных jobs
    age: 3 * 24 * 3600, // 3 дня
  },
}

/**
 * Настройки retry для долгих jobs (например, обработка больших файлов)
 * Больше попыток и более длинные задержки
 */
export const LONG_JOB_RETRY_OPTIONS: JobsOptions = {
  attempts: 3, // 3 попытки (но с большими задержками)
  backoff: {
    type: 'exponential',
    delay: 10000, // Начальная задержка 10 секунд
  },
  removeOnComplete: {
    count: 500,
    age: 24 * 3600,
  },
  removeOnFail: {
    count: 2000,
    age: 7 * 24 * 3600,
  },
  // Job timeout для долгих jobs (30 минут)
  timeout: 30 * 60 * 1000,
}

/**
 * Получить настройки retry для конкретного типа job
 */
export function getJobRetryOptions(jobName: string): JobsOptions {
  // Критические jobs (отправка сообщений, синхронизация с CRM)
  if (
    jobName.includes('kommo:') ||
    jobName.includes('crm:') ||
    jobName.includes('send-message') ||
    jobName.includes('sync')
  ) {
    return CRITICAL_JOB_RETRY_OPTIONS
  }

  // Быстрые jobs (обновление статуса, логирование)
  if (
    jobName.includes('status') ||
    jobName.includes('log') ||
    jobName.includes('update')
  ) {
    return FAST_JOB_RETRY_OPTIONS
  }

  // Долгие jobs (обработка файлов, большие вычисления)
  if (
    jobName.includes('process-asset') ||
    jobName.includes('extract-knowledge') ||
    jobName.includes('bulk') ||
    jobName.includes('heavy')
  ) {
    return LONG_JOB_RETRY_OPTIONS
  }

  // Стандартные настройки для всех остальных jobs
  return DEFAULT_JOB_RETRY_OPTIONS
}

