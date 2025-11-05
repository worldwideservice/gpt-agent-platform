import { redirect } from 'next/navigation'
import { getTenantIdFromSession } from '@/lib/utils/getTenantRedirect'
import { logger } from '@/lib/utils/logger'
import { metrics } from '@/lib/utils/metrics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface RedirectPageProps {
  params: Promise<{ path: string[] }>
}

/**
 * Универсальная redirect страница для обработки старых путей
 * Middleware редиректит на /manage/redirect/[path], эта страница получает tenant-id
 * из сессии и редиректит на правильный путь /manage/[tenantId]/[path]
 * 
 * Performance: Минимизирует время редиректа, использует server-side редирект
 * Security: Проверяет авторизацию перед редиректом
 * UX: Предоставляет loading и error states
 */
const pathMapping: Record<string, string> = {
  'ai-agents': '/ai-agents',
  'knowledge-items': '/knowledge-items',
  'knowledge-categories': '/knowledge-categories',
  'account-settings': '/account-settings',
  'test-chat': '/test-chat',
} as const

export default async function RedirectPage({ params }: RedirectPageProps) {
  const startTime = Date.now()
  const { path } = await params
  const pathKey = path[0] // Получаем первый элемент пути (например, 'ai-agents')
  const fromPath = `/manage/redirect/${pathKey}`
  
  logger.debug('[RedirectPage] Processing redirect', { pathKey })
  
  const targetPath = pathMapping[pathKey]
  
  if (!targetPath) {
    logger.warn('[RedirectPage] Unknown path key', { pathKey, fromPath })
    // Вместо редиректа на /login, показываем not-found
    // Это позволит пользователю увидеть, что страница не найдена
    const { notFound } = await import('next/navigation')
    notFound()
  }
  
  try {
    // Получаем tenant-id из сессии
    const tenantId = await getTenantIdFromSession()
    
    if (!tenantId) {
      logger.warn('[RedirectPage] No tenant-id found in session', { pathKey })
      // Редиректим на логин, если нет сессии
      redirect('/login')
    }
    
    const redirectPath = `/manage/${tenantId}${targetPath}`
    const redirectTime = Date.now() - startTime
    
    // Логируем успешный редирект с метриками
    logger.redirect(fromPath, redirectPath, redirectTime, true, {
      pathKey,
      tenantId: tenantId.substring(0, 8) + '...', // Partial tenantId for logging
    })
    
    // Record metric for monitoring
    metrics.recordRedirect(fromPath, redirectPath, redirectTime, true)
    
    // Редиректим на правильный путь с tenant-id
    redirect(redirectPath)
  } catch (error) {
    const redirectTime = Date.now() - startTime
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    
    logger.redirect(fromPath, '/login', redirectTime, false, {
      pathKey,
      error: errorInstance.message,
    })
    
    // Record error metric
    metrics.recordError('redirect-failed', {
      pathKey,
      errorType: errorInstance.message,
    })
    metrics.recordRedirect(fromPath, '/login', redirectTime, false)
    
    logger.error('[RedirectPage] Error during redirect', errorInstance, {
      pathKey,
      fromPath,
    })
    
    // Редиректим на логин при любой ошибке
    redirect('/login')
  }
}

