#!/usr/bin/env node

/**
 * Скрипт для проверки подключения к Redis
 */

const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

async function checkRedis() {
  console.log('🔍 Проверка подключения к Redis...')
  console.log(`URL: ${REDIS_URL}`)

  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        return null // Не повторять
      }
      return Math.min(times * 50, 2000)
    },
  })

  try {
    // Проверка подключения
    const pong = await redis.ping()
    console.log('✅ Подключение к Redis успешно:', pong)

    // Проверка информации
    const info = await redis.info('server')
    console.log('\n📊 Информация о Redis сервере:')
    console.log(info.split('\n').slice(0, 5).join('\n'))

    // Тест записи/чтения
    await redis.set('test:connection', 'ok', 'EX', 5)
    const value = await redis.get('test:connection')
    console.log('\n✅ Тест записи/чтения:', value)

    // Проверка очереди
    const queueName = process.env.JOB_QUEUE_NAME || 'agent-jobs'
    const queueKey = `bull:${queueName}:meta`
    const queueExists = await redis.exists(queueKey)
    console.log(`\n📦 Очередь "${queueName}":`, queueExists ? 'существует' : 'будет создана при первом использовании')

    console.log('\n✅ Redis готов к использованию!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Ошибка подключения к Redis:')
    console.error(error.message)
    console.error('\n💡 Убедитесь что:')
    console.error('1. Redis запущен: redis-server')
    console.error('2. REDIS_URL корректный:', REDIS_URL)
    process.exit(1)
  } finally {
    await redis.quit()
  }
}

checkRedis()














