/**
 * Application Error Boundary
 * Catches runtime errors and displays user-friendly error page
 * Enhanced with logging, accessibility, and better UX
 */

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logger } from '@/lib/logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service
    logger.error('Application error caught by error boundary', {
      error: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
          {/* Icon */}
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
            role="img"
            aria-label="Иконка ошибки"
          >
            <AlertTriangle
              className="h-10 w-10 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Что-то пошло не так
            </h1>
            <p className="text-lg text-muted-foreground">
              Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз.
            </p>

            {/* Development Error Details */}
            {isDevelopment && (
              <div
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left dark:border-red-900 dark:bg-red-900/10"
                role="alert"
              >
                <p className="mb-2 font-mono text-sm font-semibold text-red-900 dark:text-red-400">
                  Детали ошибки (только в разработке):
                </p>
                <p className="font-mono text-xs text-red-800 dark:text-red-300 break-words">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 font-mono text-xs text-red-600 dark:text-red-400">
                    ID ошибки: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Production Error ID */}
            {!isDevelopment && error.digest && (
              <p className="text-sm text-muted-foreground">
                ID ошибки: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{error.digest}</code>
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            className="flex flex-wrap items-center justify-center gap-3"
            role="navigation"
            aria-label="Действия после ошибки"
          >
            <Button onClick={reset} size="lg">
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Попробовать снова
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                На главную
              </a>
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 w-full rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Если проблема повторяется,{' '}
              <a href="/support" className="font-medium text-primary hover:underline">
                обратитесь в поддержку
              </a>
              {error.digest && (
                <span> и укажите ID ошибки: <code className="font-mono text-xs">{error.digest}</code></span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



































