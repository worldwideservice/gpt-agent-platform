'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * Error boundary для redirect страницы
 * Обрабатывает ошибки при получении tenant-id или выполнении редиректа
 */
export default function RedirectError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error using professional logger
    const logError = async () => {
      const { logger } = await import('@/lib/utils/logger')
      logger.error('[RedirectError] Redirect failed', error, {
        component: 'RedirectPage',
        errorType: 'redirect_failure',
        digest: error.digest,
      })
    }
    
    logError()
  }, [error])

  const handleGoToLogin = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Ошибка при переходе
          </h1>
          <p className="text-muted-foreground">
            Не удалось перейти на платформу. Пожалуйста, попробуйте войти снова.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-muted-foreground mt-2">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </Button>
          <Button onClick={handleGoToLogin} variant="outline" className="gap-2">
            Войти
          </Button>
          <Button onClick={handleGoHome} variant="ghost" className="gap-2">
            <Home className="h-4 w-4" />
            На главную
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Если проблема повторяется, пожалуйста, свяжитесь с поддержкой.
        </p>
      </div>
    </div>
  )
}

