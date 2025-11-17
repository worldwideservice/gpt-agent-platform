import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import sensible from '@fastify/sensible'
import * as Sentry from '@sentry/node'
import { trace } from '@opentelemetry/api'
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client'

import { envPlugin } from './plugins/env'
import authPlugin from './plugins/auth'
import { registerHealthRoutes } from './routes/health'
import { registerAgentRoutes } from './routes/agents'
import { registerJobRoutes } from './routes/jobs'
import { registerCrmRoutes } from './routes/crm'
import { registerKommoRoutes } from './routes/kommo'

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    transport: process.env.NODE_ENV === 'production' ? undefined : {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l' },
    },
  },
})

declare module 'fastify' {
  interface FastifyRequest {
    metricsStartTime?: bigint
  }
}

const metricsRegistry = new Registry()
metricsRegistry.setDefaultLabels({ service: 'api' })
collectDefaultMetrics({ register: metricsRegistry })

const httpRequestDuration = new Histogram({
  name: 'api_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [metricsRegistry],
})

const httpErrors = new Counter({
  name: 'api_http_errors_total',
  help: 'Total number of HTTP errors by status code',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry],
})

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  })
}

app.decorateRequest('metricsStartTime', 0n as unknown as bigint)

app.addHook('onRequest', (request, _reply, done) => {
  request.metricsStartTime = process.hrtime.bigint()
  done()
})

app.addHook('onResponse', (request, reply, done) => {
  if (request.metricsStartTime) {
    const durationNs = Number(process.hrtime.bigint() - request.metricsStartTime)
    const durationSeconds = durationNs / 1_000_000_000
    const route = request.routeOptions?.url ?? request.routerPath ?? 'unknown'
    const labels = {
      method: request.method,
      route,
      status_code: reply.statusCode.toString(),
    }
    httpRequestDuration.observe(labels, durationSeconds)

    if (reply.statusCode >= 500) {
      httpErrors.inc(labels)
    }
  }
  done()
})

app.addHook('onError', (request, reply, error, done) => {
  app.log.error({ err: error, path: request.url }, 'Unhandled error')

  if (Sentry.getCurrentHub().getClient()) {
    Sentry.captureException(error, {
      tags: {
        service: 'api',
        route: request.routerPath || request.url,
      },
      extra: {
        method: request.method,
        statusCode: reply.statusCode,
      },
    })
  }

  const span = trace.getActiveSpan()
  if (span) {
    span.recordException(error)
    span.setStatus({ code: 2, message: error.message })
  }

  done()
})

app.register(sensible)

// CORS конфигурация - ИСПРАВЛЕНО: только разрешенные домены
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
].filter(Boolean)

app.register(cors, {
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : true, // В dev разрешаем все для удобства
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})

app.register(helmet)
app.register(envPlugin)
app.register(authPlugin) // JWT authentication plugin

// Health routes - БЕЗ аутентификации (для мониторинга)
app.register(async instance => {
  await registerHealthRoutes(instance)
}, { prefix: '/health' })

// Protected API routes - С аутентификацией
app.register(async instance => {
  // Применяем authentication ко ВСЕМ routes в этом контексте
  instance.addHook('onRequest', instance.authenticate)

  await registerAgentRoutes(instance)
}, { prefix: '/agents' })

app.register(async instance => {
  instance.addHook('onRequest', instance.authenticate)

  await registerJobRoutes(instance)
}, { prefix: '/jobs' })

app.register(async instance => {
  instance.addHook('onRequest', instance.authenticate)

  await registerCrmRoutes(instance)
}, { prefix: '/crm' })

app.register(async instance => {
  instance.addHook('onRequest', instance.authenticate)

  await registerKommoRoutes(instance)
}, { prefix: '/kommo' })

app.get('/metrics', async (_request, reply) => {
  reply.header('Content-Type', metricsRegistry.contentType)
  return metricsRegistry.metrics()
})

const port = Number(process.env.PORT || 4000)
const host = process.env.HOST || '0.0.0.0'

async function start() {
  try {
    await app.listen({ port, host })
    app.log.info(`Fastify API listening on http://${host}:${port}`)
  } catch (error) {
    app.log.error({ err: error }, 'Failed to start Fastify API')
    process.exit(1)
  }
}

// ✅ PRODUCTION FIX: Graceful shutdown для корректного завершения
async function shutdown(signal: string) {
  app.log.info(`Received ${signal}, shutting down gracefully...`)

  try {
    // Закрываем Fastify сервер
    await app.close()
    app.log.info('Fastify server closed successfully')

    // Закрываем Sentry соединения
    if (process.env.SENTRY_DSN) {
      await Sentry.close(2000)
    }

    process.exit(0)
  } catch (error) {
    app.log.error({ err: error }, 'Error during graceful shutdown')
    process.exit(1)
  }
}

// Обработчики сигналов для graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Обработка uncaught exceptions
process.on('uncaughtException', (error) => {
  app.log.fatal({ err: error }, 'Uncaught exception')
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error)
  }
  shutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  app.log.fatal({ reason, promise }, 'Unhandled promise rejection')
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(reason)
  }
})

start()
