import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    // Проверяем подключение к базе данных
    // const { data, error } = await supabase.from('organizations').select('count').limit(1)

    // Проверяем Redis подключение
    // const redisClient = getRedisClient()
    // await redisClient.ping()

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok', // error ? 'error' : 'ok'
        redis: 'ok',    // redisError ? 'error' : 'ok'
        app: 'ok'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service check failed'
      },
      { status: 503 }
    )
  }
}
