/**
 * Sentry Integration для Worker
 * Автоматическое отслеживание ошибок и производительности
 */

import * as Sentry from '@sentry/node'
import { env } from './env'

let isInitialized = false

/**
 * Инициализация Sentry для мониторинга Worker
 */
export function initSentry() {
  if (isInitialized) {
    return
  }

  // Если SENTRY_DSN не настроен, пропускаем инициализацию
  if (!env.SENTRY_DSN) {
    console.log('[sentry] SENTRY_DSN not configured, skipping Sentry initialization')
    return
  }

  try {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV || 'production',
      tracesSampleRate: 1.0, // 100% для Worker (критично для мониторинга)
      profilesSampleRate: 0.1, // 10% для profiling (оптимизация производительности)
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
      ],
      // Настройки для Worker сервиса
      serverName: 'worker',
      release: process.env.RAILWAY_GIT_COMMIT_SHA || 'unknown',
      // Отслеживать только ошибки и performance issues
      beforeSend(event, hint) {
        // Фильтруем слишком частые ошибки одного типа
        if (event.exception) {
          const error = hint.originalException
          if (error instanceof Error) {
            // Известные ошибки, которые не критичны
            if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
              return null // Не отправляем в Sentry
            }
          }
        }
        return event
      },
    })

    isInitialized = true
    console.log('[sentry] Sentry initialized successfully')
  } catch (error) {
    console.error('[sentry] Failed to initialize Sentry:', error)
  }
}

/**
 * Обертка для отслеживания выполнения job в Sentry
 */
export function trackJob<T>(
  jobName: string,
  jobId: string,
  jobData: unknown,
  handler: () => Promise<T>,
): Promise<T> {
  const startTime = Date.now()
  
  return Sentry.startSpan(
    {
      name: `worker.job.${jobName}`,
      op: 'worker.job',
      attributes: {
        'job.id': jobId,
        'job.name': jobName,
      },
    },
    async (span) => {
      try {
        const result = await handler()
        const duration = Date.now() - startTime
        
        span?.setStatus({ code: 1, message: 'ok' }) // OK status
        span?.setAttribute('duration', duration)
        
        // Отправляем метрику в Sentry для успешных jobs
        trackMetric('worker.job.duration', duration, {
          jobType: jobName,
          status: 'completed',
        })
        trackCounter('worker.job.completed', 1, {
          jobType: jobName,
        })
        
        return result
      } catch (error) {
        const duration = Date.now() - startTime
        
        span?.setStatus({ code: 2, message: 'error' }) // Error status
        span?.setAttribute('duration', duration)
        span?.setAttribute('error', true)
        
        // Отправляем метрику в Sentry для неудачных jobs
        trackMetric('worker.job.duration', duration, {
          jobType: jobName,
          status: 'failed',
        })
        trackCounter('worker.job.failed', 1, {
          jobType: jobName,
        })
        
        Sentry.captureException(error, {
          tags: {
            jobType: jobName,
            jobId: jobId,
            component: 'worker',
          },
          extra: {
            jobData: jobData,
            jobName: jobName,
            jobId: jobId,
            duration: duration,
          },
          level: 'error',
        })
        throw error
      }
    },
  )
}

/**
 * Отправить метрику в Sentry
 */
export function trackMetric(name: string, value: number, tags?: Record<string, string>) {
  if (!isInitialized) {
    return
  }

  Sentry.metrics.distribution(name, value, {
    tags: tags || {},
    unit: 'millisecond',
  })
}

/**
 * Отправить счетчик в Sentry
 */
export function trackCounter(name: string, increment: number = 1, tags?: Record<string, string>) {
  if (!isInitialized) {
    return
  }

  Sentry.metrics.increment(name, increment, {
    tags: tags || {},
  })
}

export { Sentry }

