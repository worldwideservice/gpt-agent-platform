import { NextResponse } from 'next/server'

// Force dynamic rendering (uses request.headers)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Cron endpoint для автоматических бэкапов Supabase БД
 * Вызывается Vercel Cron Jobs ежедневно в 2:00
 * 
 * Примечание: Supabase автоматически создает бэкапы на Pro плане
 * Этот endpoint логирует запрос и может использоваться для уведомлений
 */
export async function GET(request: Request) {
  // Проверка авторизации (Vercel Cron Secret)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseProjectRef = process.env.SUPABASE_PROJECT_REF || 'rpzchsgutabxeabbnwas'
    const timestamp = new Date().toISOString()

    // Логируем запрос на бэкап
    console.log(`[Cron Backup] Backup request logged at ${timestamp} for project ${supabaseProjectRef}`)

    // Supabase автоматически создает бэкапы на Pro плане
    // Для Free плана нужно использовать Supabase Dashboard или pg_dump
    // Этот endpoint может использоваться для:
    // 1. Уведомлений о необходимости бэкапа
    // 2. Интеграции с внешними сервисами бэкапов
    // 3. Мониторинга статуса бэкапов

    return NextResponse.json({
      success: true,
      message: 'Backup request logged',
      timestamp,
      projectRef: supabaseProjectRef,
      note: 'Supabase automatically creates backups on Pro plan. For Free plan, use Supabase Dashboard or manual pg_dump.',
    })
  } catch (error: any) {
    console.error('[Cron Backup] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process backup request',
      },
      { status: 500 },
    )
  }
}

