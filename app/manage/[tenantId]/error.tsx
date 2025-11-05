'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Home, RefreshCw, LogIn } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * Error boundary для manage layout
 * Обрабатывает ошибки при загрузке страниц управления
 */
export default function ManageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Логируем ошибку
    console.error('[ManageError] Layout error:', error)
  }, [error])

  const handleGoToLogin = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  // Проверяем, является ли ошибка проблемой авторизации
  const isAuthError = 
    error.message?.includes('session') ||
    error.message?.includes('auth') ||
    error.message?.includes('tenant') ||
    error.message?.includes('organization')

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
            {isAuthError ? 'Требуется авторизация' : 'Ошибка загрузки'}
          </h1>
          <p className="text-muted-foreground">
            {isAuthError
              ? 'Для доступа к этой странице необходимо войти в систему.'
              : 'Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте снова.'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthError ? (
            <>
              <Button onClick={handleGoToLogin} variant="default" className="gap-2">
                <LogIn className="h-4 w-4" />
                Войти
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                На главную
              </Button>
            </>
          ) : (
            <>
              <Button onClick={reset} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Попробовать снова
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                На главную
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Если проблема повторяется, пожалуйста, свяжитесь с поддержкой.
        </p>
      </div>
    </div>
  )
}

