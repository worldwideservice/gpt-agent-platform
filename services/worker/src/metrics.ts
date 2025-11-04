/**
 * Worker Metrics Collection
 * Отслеживание метрик для мониторинга Worker
 */

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

  /**
   * Инициализация метрик Worker
   */
  init(queueName: string, concurrency: number) {
    this.metrics.worker.queueName = queueName
    this.metrics.worker.concurrency = concurrency
    this.metrics.worker.uptime = process.uptime()
  }

  /**
   * Отметить начало обработки job
   */
  jobStarted(jobId: string, jobName: string) {
    this.metrics.jobs.total++
    this.metrics.jobs.processing++
    this.jobStartTimes.set(jobId, Date.now())

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

    if (error) {
      console.error(`[metrics] Job ${jobId} (${jobName}) failed:`, error.message)
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
  }

  /**
   * Обновить статус отключения Redis
   */
  redisDisconnected() {
    this.metrics.redis.connected = false
  }

  /**
   * Зарегистрировать ошибку Redis
   */
  redisError(error: Error) {
    this.metrics.redis.connected = false
    this.metrics.redis.lastError = error.message
  }

  /**
   * Увеличить счетчик попыток переподключения
   */
  redisReconnectAttempt() {
    this.metrics.redis.reconnectAttempts++
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
    const m = this.getMetrics()
    const lines: string[] = []

    // Worker метрики
    lines.push(`# HELP worker_uptime_seconds Worker uptime in seconds`)
    lines.push(`# TYPE worker_uptime_seconds gauge`)
    lines.push(`worker_uptime_seconds ${m.worker.uptime}`)

    lines.push(`# HELP worker_jobs_total Total number of jobs processed`)
    lines.push(`# TYPE worker_jobs_total counter`)
    lines.push(`worker_jobs_total ${m.jobs.total}`)

    lines.push(`# HELP worker_jobs_completed Total number of completed jobs`)
    lines.push(`# TYPE worker_jobs_completed counter`)
    lines.push(`worker_jobs_completed ${m.jobs.completed}`)

    lines.push(`# HELP worker_jobs_failed Total number of failed jobs`)
    lines.push(`# TYPE worker_jobs_failed counter`)
    lines.push(`worker_jobs_failed ${m.jobs.failed}`)

    lines.push(`# HELP worker_jobs_processing Current number of jobs being processed`)
    lines.push(`# TYPE worker_jobs_processing gauge`)
    lines.push(`worker_jobs_processing ${m.jobs.processing}`)

    lines.push(`# HELP worker_redis_connected Redis connection status`)
    lines.push(`# TYPE worker_redis_connected gauge`)
    lines.push(`worker_redis_connected ${m.redis.connected ? 1 : 0}`)

    lines.push(`# HELP worker_avg_processing_time_ms Average job processing time in milliseconds`)
    lines.push(`# TYPE worker_avg_processing_time_ms gauge`)
    lines.push(`worker_avg_processing_time_ms ${m.performance.avgProcessingTime}`)

    // Метрики по типам jobs
    for (const [jobType, stats] of Object.entries(m.jobs.byType)) {
      lines.push(`# HELP worker_jobs_by_type_${jobType}_completed Completed jobs of type ${jobType}`)
      lines.push(`# TYPE worker_jobs_by_type_${jobType}_completed counter`)
      lines.push(`worker_jobs_by_type_${jobType}_completed ${stats.completed}`)

      lines.push(`# HELP worker_jobs_by_type_${jobType}_failed Failed jobs of type ${jobType}`)
      lines.push(`# TYPE worker_jobs_by_type_${jobType}_failed counter`)
      lines.push(`worker_jobs_by_type_${jobType}_failed ${stats.failed}`)

      lines.push(`# HELP worker_jobs_by_type_${jobType}_avg_time_ms Average processing time for ${jobType} in milliseconds`)
      lines.push(`# TYPE worker_jobs_by_type_${jobType}_avg_time_ms gauge`)
      lines.push(`worker_jobs_by_type_${jobType}_avg_time_ms ${stats.avgTime}`)
    }

    return lines.join('\n')
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

