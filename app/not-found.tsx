/**
 * Custom 404 Not Found Page
 * Enhanced with better UX and accessibility
 */

'use client'

// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/Card'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
          {/* Illustration */}
          <div className="relative">
            <div className="flex items-center justify-center">
              <span className="text-9xl font-bold text-primary/20" aria-hidden="true">404</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileQuestion
                className="h-24 w-24 text-primary/60"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Страница не найдена
            </h1>
            <p className="text-lg text-muted-foreground">
              К сожалению, запрашиваемая страница не существует или была перемещена.
            </p>
            <p className="text-sm text-muted-foreground">
              Возможно, вы перешли по устаревшей ссылке или URL был введён неверно.
            </p>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row gap-3"
            role="navigation"
            aria-label="Навигация с ошибочной страницы"
          >
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                На главную
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Назад
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/docs">
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Документация
              </Link>
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 w-full rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Нужна помощь?{' '}
              <Link href="/support" className="font-medium text-primary hover:underline">
                Обратитесь в поддержку
              </Link>
              {' '}или посетите{' '}
              <Link href="/faq" className="font-medium text-primary hover:underline">
                раздел FAQ
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

