/**
 * Worker Metrics Collection
 * Отслеживание метрик для мониторинга Worker
 */

import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client'
import { logger } from './lib/logger'

interface Metrics {
  jobs: {
    total: number
    completed: number
    failed: number
    processing: number
    byType: Record<string, { completed: number; failed: number; totalTime: number; avgTime: number }>
  }
  redis: {
    connected: boolean
    lastError: string | null
    reconnectAttempts: number
  }
  worker: {
    uptime: number
    concurrency: number
    queueName: string
  }
  performance: {
    avgProcessingTime: number
    maxProcessingTime: number
    minProcessingTime: number
  }
}

class MetricsCollector {
  private metrics: Metrics = {
    jobs: {
      total: 0,
      completed: 0,
      failed: 0,
      processing: 0,
      byType: {},
    },
    redis: {
      connected: false,
      lastError: null,
      reconnectAttempts: 0,
    },
    worker: {
      uptime: 0,
      concurrency: 0,
      queueName: '',
    },
    performance: {
      avgProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: Infinity,
    },
  }

  private jobStartTimes: Map<string, number> = new Map()
  private processingTimes: number[] = []
  private registry = new Registry()
  private jobDurationHistogram = new Histogram({
    name: 'worker_job_duration_seconds',
    help: 'Duration of processed jobs in seconds',
    labelNames: ['job_name'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
    registers: [this.registry],
  })
  private jobCompletedCounter = new Counter({
    name: 'worker_jobs_completed_total',
    help: 'Total completed jobs',
    labelNames: ['job_name'],
    registers: [this.registry],
  })
  private jobFailedCounter = new Counter({
    name: 'worker_jobs_failed_total',
    help: 'Total failed jobs',
    labelNames: ['job_name'],
    registers: [this.registry],
  })
  private jobInFlightGauge = new Gauge({
    name: 'worker_jobs_in_flight',
    help: 'Number of jobs currently being processed',
    registers: [this.registry],
  })
  private redisConnectedGauge = new Gauge({
    name: 'worker_redis_connected',
    help: 'Redis connection status (1 = connected)',
    registers: [this.registry],
  })
  private redisReconnectCounter = new Counter({
    name: 'worker_redis_reconnect_total',
    help: 'Number of Redis reconnect attempts',
    registers: [this.registry],
  })
  private jobDurationTimers: Map<string, () => void> = new Map()

  /**
   * Инициализация метрик Worker
   */
  init(queueName: string, concurrency: number) {
    this.metrics.worker.queueName = queueName
    this.metrics.worker.concurrency = concurrency
    this.metrics.worker.uptime = process.uptime()
    collectDefaultMetrics({ register: this.registry, prefix: 'worker_' })
  }

  /**
   * Отметить начало обработки job
   */
  jobStarted(jobId: string, jobName: string) {
    this.metrics.jobs.total++
    this.metrics.jobs.processing++
    this.jobStartTimes.set(jobId, Date.now())
    this.jobInFlightGauge.inc()
    this.jobDurationTimers.set(jobId, this.jobDurationHistogram.startTimer({ job_name: jobName }))

    if (!this.metrics.jobs.byType[jobName]) {
      this.metrics.jobs.byType[jobName] = {
        completed: 0,
        failed: 0,
        totalTime: 0,
        avgTime: 0,
      }
    }
  }

  /**
   * Отметить успешное завершение job
   */
  jobCompleted(jobId: string, jobName: string) {
    const startTime = this.jobStartTimes.get(jobId)
    if (startTime) {
      const processingTime = Date.now() - startTime
      this.processingTimes.push(processingTime)
      this.updatePerformanceMetrics(processingTime)

      if (this.metrics.jobs.byType[jobName]) {
        this.metrics.jobs.byType[jobName].completed++
        this.metrics.jobs.byType[jobName].totalTime += processingTime
        this.metrics.jobs.byType[jobName].avgTime =
          this.metrics.jobs.byType[jobName].totalTime /
          (this.metrics.jobs.byType[jobName].completed + this.metrics.jobs.byType[jobName].failed)
      }

      this.jobStartTimes.delete(jobId)
    }

    this.metrics.jobs.completed++
    this.metrics.jobs.processing = Math.max(0, this.metrics.jobs.processing - 1)
    this.jobCompletedCounter.inc({ job_name: jobName })
    this.jobInFlightGauge.dec()
    const timer = this.jobDurationTimers.get(jobId)
    timer?.()
    this.jobDurationTimers.delete(jobId)
  }

  /**
   * Отметить ошибку при обработке job
   */
  jobFailed(jobId: string, jobName: string, error?: Error) {
    const startTime = this.jobStartTimes.get(jobId)
    if (startTime) {
      const processingTime = Date.now() - startTime
      this.processingTimes.push(processingTime)
      this.updatePerformanceMetrics(processingTime)

      if (this.metrics.jobs.byType[jobName]) {
        this.metrics.jobs.byType[jobName].failed++
        this.metrics.jobs.byType[jobName].totalTime += processingTime
        this.metrics.jobs.byType[jobName].avgTime =
          this.metrics.jobs.byType[jobName].totalTime /
          (this.metrics.jobs.byType[jobName].completed + this.metrics.jobs.byType[jobName].failed)
      }

      this.jobStartTimes.delete(jobId)
    }

    this.metrics.jobs.failed++
    this.metrics.jobs.processing = Math.max(0, this.metrics.jobs.processing - 1)
    this.jobFailedCounter.inc({ job_name: jobName })
    this.jobInFlightGauge.dec()
    const timer = this.jobDurationTimers.get(jobId)
    timer?.()
    this.jobDurationTimers.delete(jobId)

    if (error) {
      logger.debug(`Job ${jobId} (${jobName}) failed`, {
        event: 'metrics.job.failed',
        jobId,
        jobName,
        errorMessage: error.message,
      })
    }
  }

  /**
   * Обновить метрики производительности
   */
  private updatePerformanceMetrics(processingTime: number) {
    // Храним только последние 1000 времен обработки
    if (this.processingTimes.length > 1000) {
      this.processingTimes.shift()
    }

    this.metrics.performance.maxProcessingTime = Math.max(
      this.metrics.performance.maxProcessingTime,
      processingTime,
    )
    this.metrics.performance.minProcessingTime = Math.min(
      this.metrics.performance.minProcessingTime,
      processingTime,
    )

    // Пересчитываем среднее время обработки
    const sum = this.processingTimes.reduce((a, b) => a + b, 0)
    this.metrics.performance.avgProcessingTime = sum / this.processingTimes.length
  }

  /**
   * Обновить статус Redis подключения
   */
  redisConnected() {
    this.metrics.redis.connected = true
    this.metrics.redis.lastError = null
    this.redisConnectedGauge.set(1)
  }

  /**
   * Обновить статус отключения Redis
   */
  redisDisconnected() {
    this.metrics.redis.connected = false
    this.redisConnectedGauge.set(0)
  }

  /**
   * Зарегистрировать ошибку Redis
   */
  redisError(error: Error) {
    this.metrics.redis.connected = false
    this.metrics.redis.lastError = error.message
    this.redisConnectedGauge.set(0)
  }

  /**
   * Увеличить счетчик попыток переподключения
   */
  redisReconnectAttempt() {
    this.metrics.redis.reconnectAttempts++
    this.redisReconnectCounter.inc()
  }

  /**
   * Получить текущие метрики
   */
  getMetrics(): Metrics {
    return {
      ...this.metrics,
      worker: {
        ...this.metrics.worker,
        uptime: process.uptime(),
      },
      performance: {
        ...this.metrics.performance,
        minProcessingTime:
          this.metrics.performance.minProcessingTime === Infinity
            ? 0
            : this.metrics.performance.minProcessingTime,
      },
    }
  }

  /**
   * Получить метрики в формате Prometheus (опционально)
   */
  getPrometheusMetrics(): string {
    const uptimeGauge = new Gauge({
      name: 'worker_uptime_seconds',
      help: 'Worker uptime in seconds',
      registers: [this.registry],
    })
    uptimeGauge.set(process.uptime())

    const metricsSnapshot = this.registry.metrics()
    this.registry.removeSingleMetric('worker_uptime_seconds')
    return metricsSnapshot
  }

  /**
   * Сброс метрик (для тестирования)
   */
  reset() {
    this.metrics = {
      jobs: {
        total: 0,
        completed: 0,
        failed: 0,
        processing: 0,
        byType: {},
      },
      redis: {
        connected: false,
        lastError: null,
        reconnectAttempts: 0,
      },
      worker: {
        uptime: 0,
        concurrency: 0,
        queueName: '',
      },
      performance: {
        avgProcessingTime: 0,
        maxProcessingTime: 0,
        minProcessingTime: Infinity,
      },
    }
    this.jobStartTimes.clear()
    this.processingTimes = []
  }
}

// Singleton instance
export const metrics = new MetricsCollector()

