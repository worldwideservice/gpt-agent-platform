'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui'
import { logger } from '@/lib/utils'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to logger
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })

    // Call custom onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({
      errorInfo,
    })
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleRetry = (): void => {
    this.resetError()
  }

  handleGoHome = (): void => {
    window.location.href = '/'
  }

  handleReportError = async (): void => {
    const { error, errorInfo } = this.state

    if (!error) return

    const errorReport = `
Error: ${error.message}

Stack Trace:
${error.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `.trim()

    try {
      await navigator.clipboard.writeText(errorReport)
      alert('Информация об ошибке скопирована в буфер обмена')
    } catch (err) {
      console.error('Failed to copy error report:', err)
      alert('Не удалось скопировать информацию об ошибке')
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Render custom fallback if provided
      if (fallback) {
        return fallback
      }

      const isDevelopment = process.env.NODE_ENV === 'development'

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Что-то пошло не так
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Произошла неожиданная ошибка. Пожалуйста, попробуйте еще раз или вернитесь на главную страницу.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={this.handleRetry} variant="default" className="w-full">
                Попробовать снова
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                На главную
              </Button>
              <Button onClick={this.handleReportError} variant="ghost" className="w-full">
                Сообщить об ошибке
              </Button>
            </div>

            {isDevelopment && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                <h3 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                  Информация для разработчиков
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-red-800 dark:text-red-200">Ошибка:</strong>
                    <pre className="mt-1 overflow-x-auto text-xs text-red-700 dark:text-red-300">
                      {error.message}
                    </pre>
                  </div>
                  {error.stack && (
                    <div>
                      <strong className="text-red-800 dark:text-red-200">Stack trace:</strong>
                      <pre className="mt-1 overflow-x-auto text-xs text-red-700 dark:text-red-300">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong className="text-red-800 dark:text-red-200">Component stack:</strong>
                      <pre className="mt-1 overflow-x-auto text-xs text-red-700 dark:text-red-300">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    return children
  }
}
