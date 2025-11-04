#!/usr/bin/env node

/**
 * Скрипт для проверки работы Worker
 */

const Redis = require('ioredis')
const { Queue } = require('bullmq')

// Поддержка нового формата Upstash (UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN)
// и старого формата (REDIS_URL)
let REDIS_URL = process.env.REDIS_URL

if (!REDIS_URL && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Строим Redis URL из REST URL и Token для Upstash
  // Формат: rediss://default:TOKEN@HOST:6379
  const upstashRestUrl = new URL(process.env.UPSTASH_REDIS_REST_URL)
  const redisHost = upstashRestUrl.hostname
  REDIS_URL = `rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${redisHost}:6379`
  console.log('📝 Используется формат Upstash (из REST URL и Token)')
}

REDIS_URL = REDIS_URL || 'redis://localhost:6379'
const QUEUE_NAME = process.env.JOB_QUEUE_NAME || 'agent-jobs'

async function checkWorker() {
  console.log('🔍 Проверка Worker...')
  console.log(`Redis URL: ${REDIS_URL.substring(0, 30)}...`)
  console.log(`Queue Name: ${QUEUE_NAME}`)

  const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    connectTimeout: 15000,
  })

  const queue = new Queue(QUEUE_NAME, { connection })

  try {
    // Проверка подключения
    await connection.ping()
    console.log('✅ Подключение к Redis успешно')

    // Проверка очереди
    const queueCounts = await queue.getJobCounts()
    console.log('\n📊 Статистика очереди:')
    console.log(`  - Waiting: ${queueCounts.waiting}`)
    console.log(`  - Active: ${queueCounts.active}`)
    console.log(`  - Completed: ${queueCounts.completed}`)
    console.log(`  - Failed: ${queueCounts.failed}`)
    console.log(`  - Delayed: ${queueCounts.delayed}`)

    // Тест добавления задачи
    console.log('\n🧪 Тест добавления задачи...')
    const testJob = await queue.add(
      'test-job',
      { test: true, timestamp: Date.now() },
      {
        removeOnComplete: { age: 60, count: 10 },
        removeOnFail: { age: 60, count: 10 },
      },
    )
    console.log(`✅ Тестовая задача добавлена: ${testJob.id}`)

    // Ожидание обработки (максимум 5 секунд)
    console.log('⏳ Ожидание обработки задачи (5 сек)...')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const job = await testJob.getState()
    console.log(`📦 Статус задачи: ${job}`)

    if (job === 'completed' || job === 'active') {
      console.log('✅ Worker обрабатывает задачи!')
    } else if (job === 'waiting') {
      console.log('⚠️  Задача в очереди, но не обрабатывается')
      console.log('💡 Убедитесь что Worker запущен:')
      console.log('   cd services/worker && npm run dev')
    } else {
      console.log(`⚠️  Неожиданный статус: ${job}`)
    }

    // Удаление тестовой задачи
    await testJob.remove()
    console.log('\n🧹 Тестовая задача удалена')

    await queue.close()
    await connection.quit()

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Ошибка:')
    console.error(error.message)
    console.error('\n💡 Убедитесь что:')
    console.error('1. Redis запущен')
    console.error('2. Worker запущен: cd services/worker && npm run dev')
    console.error('3. Переменные окружения настроены')
    process.exit(1)
  }
}

checkWorker()















