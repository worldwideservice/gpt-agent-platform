/**
 * Prometheus Metrics Endpoint для Next.js Application
 *
 * Собирает метрики:
 * - HTTP requests (duration, count, errors)
 * - Next.js specific metrics
 * - Custom business metrics
 *
 * Endpoint: GET /api/metrics
 * Format: Prometheus text format
 */

import { NextRequest, NextResponse } from 'next/server'
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client'

// Инициализируем сборщик дефолтных метрик (только один раз)
let metricsInitialized = false

if (!metricsInitialized) {
  // Регистрируем дефолтные метрики (CPU, memory, event loop, etc.)
  collectDefaultMetrics({
    register,
    prefix: 'nextjs_',
    labels: { app: 'gpt-agent-platform' }
  })

  metricsInitialized = true
}

// Custom метрики для Next.js приложения

// HTTP Request Duration
export const httpRequestDuration = new Histogram({
  name: 'nextjs_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
})

// HTTP Request Counter
export const httpRequestTotal = new Counter({
  name: 'nextjs_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

// HTTP Errors Counter
export const httpErrorsTotal = new Counter({
  name: 'nextjs_http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code', 'error_type'],
  registers: [register],
})

/**
 * GET /api/metrics
 * Возвращает метрики в формате Prometheus
 */
export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации для метрик (опционально)
    const authHeader = request.headers.get('authorization')
    const metricsToken = process.env.METRICS_AUTH_TOKEN

    // Если в env настроен токен - требуем его
    if (metricsToken && authHeader !== `Bearer ${metricsToken}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Собираем метрики
    const metrics = await register.metrics()

    // Возвращаем в Prometheus формате
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error collecting metrics:', error)

    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
