import { createServer, IncomingMessage, ServerResponse } from 'http'
import type { Redis } from 'ioredis'
import { metrics } from './metrics'

const PORT = process.env.PORT || 3001

let redisConnection: Redis | null = null

export function setRedisConnection(connection: Redis) {
  redisConnection = connection
}

/**
 * Проверка подключения к Redis
 */
async function checkRedisConnection(): Promise<{ connected: boolean; error?: string }> {
  if (!redisConnection) {
    return { connected: false, error: 'Redis connection not initialized' }
  }

  try {
    // Простая проверка - попытка выполнить команду PING
    const result = await redisConnection.ping()
    return { connected: result === 'PONG' }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Health check endpoint
 * Возвращает статус Worker и проверяет подключение к Redis
 */
async function handleHealthCheck(res: ServerResponse) {
  const redisStatus = await checkRedisConnection()
  const m = metrics.getMetrics()

  const health = {
    status: redisStatus.connected ? 'ok' : 'degraded',
    service: 'worker',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    redis: {
      connected: redisStatus.connected,
      error: redisStatus.error || null,
    },
    worker: {
      concurrency: m.worker.concurrency,
      queueName: m.worker.queueName,
      jobsProcessing: m.jobs.processing,
    },
  }

  const statusCode = redisStatus.connected ? 200 : 503
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(health, null, 2))
}

/**
 * Metrics endpoint
 * Возвращает детальные метрики Worker в JSON формате
 */
function handleMetrics(res: ServerResponse) {
  const m = metrics.getMetrics()

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(m, null, 2))
}

/**
 * Prometheus metrics endpoint
 * Возвращает метрики в формате Prometheus
 */
function handlePrometheusMetrics(res: ServerResponse) {
  try {
    const prometheusMetrics = metrics.getPrometheusMetrics()

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(prometheusMetrics)
  } catch (error) {
    console.error('[health] Error getting Prometheus metrics:', error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end(`# Error getting metrics: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function startHealthServer() {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.url === '/health') {
        await handleHealthCheck(res)
      } else if (req.url === '/metrics') {
        handleMetrics(res)
      } else if (req.url === '/metrics/prometheus') {
        handlePrometheusMetrics(res)
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not Found' }))
      }
    } catch (error) {
      console.error('[health] Error handling request:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      )
    }
  })

  server.listen(PORT, () => {
    console.log(`[worker] Health check server listening on port ${PORT}`)
    console.log(`[worker] Health endpoint: http://localhost:${PORT}/health`)
    console.log(`[worker] Metrics endpoint: http://localhost:${PORT}/metrics`)
    console.log(`[worker] Prometheus metrics: http://localhost:${PORT}/metrics/prometheus`)
  })

  return server
}


