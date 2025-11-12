import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client'

interface ApiTimer {
  end: (options: { statusCode: number }) => void
}

interface MetricsExports {
  registry: Registry
  startApiTimer: (options: { route: string; method: string }) => ApiTimer
  recordApiError: (options: { route: string; method: string; statusCode: number }) => void
}

declare global {
  // eslint-disable-next-line no-var
  var __NEXT_PROM_METRICS__: MetricsExports | undefined
}

const metrics = globalThis.__NEXT_PROM_METRICS__ ?? createMetrics()

function createMetrics(): MetricsExports {
  const registry = new Registry()
  collectDefaultMetrics({ register: registry, prefix: 'next_app_' })

  const requestDuration = new Histogram({
    name: 'next_api_request_duration_seconds',
    help: 'Duration of Next.js API requests in seconds',
    labelNames: ['route', 'method', 'status_code'],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [registry],
  })

  const errorCounter = new Counter({
    name: 'next_api_request_errors_total',
    help: 'Total number of Next.js API errors',
    labelNames: ['route', 'method', 'status_code'],
    registers: [registry],
  })

  const startApiTimer = ({ route, method }: { route: string; method: string }): ApiTimer => {
    const end = requestDuration.startTimer({ route, method })
    return {
      end: ({ statusCode }: { statusCode: number }) => {
        end({ status_code: statusCode })
      },
    }
  }

  const recordApiError = ({ route, method, statusCode }: { route: string; method: string; statusCode: number }) => {
    errorCounter.inc({ route, method, status_code: statusCode })
  }

  return { registry, startApiTimer, recordApiError }
}

if (!globalThis.__NEXT_PROM_METRICS__) {
  globalThis.__NEXT_PROM_METRICS__ = metrics
}

export const registry = metrics.registry
export const startApiTimer = metrics.startApiTimer
export const recordApiError = metrics.recordApiError
