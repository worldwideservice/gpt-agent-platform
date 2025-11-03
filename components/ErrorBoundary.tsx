'use client'

import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

import { Button } from '@/components/ui'
import { logger } from '@/lib/utils'

interface ErrorBoundaryProps {
 children: ReactNode
 fallback?: ReactNode
 onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
 hasError: boolean
 error?: Error
 errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props)
 this.state = { hasError: false }
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 return {
 hasError: true,
 error,
 }
 }

 componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 // Log error with structured logging
 logger.error('ErrorBoundary caught an error', error, {
 componentStack: errorInfo.componentStack,
 errorBoundary: 'main',
 userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
 url: typeof window !== 'undefined' ? window.location.href : 'server',
 })

 this.setState({
 error,
 errorInfo,
 })

 // Call custom error handler
 this.props.onError?.(error, errorInfo)

 // Send to error monitoring (if available)
 if (typeof window !== 'undefined' && (window as any).Sentry) {
 ;(window as any).Sentry.captureException(error, {
 contexts: {
 react: {
 componentStack: errorInfo.componentStack,
 },
 },
 })
 }
 }

 handleRetry = () => {
 this.setState({ hasError: false, error: undefined, errorInfo: undefined })
 }

 handleGoHome = () => {
 window.location.href = '/'
 }

 handleReportError = () => {
 if (this.state.error && this.state.errorInfo) {
 // Copy error details to clipboard for reporting
 const errorReport = {
 message: this.state.error.message,
 stack: this.state.error.stack,
 componentStack: this.state.errorInfo.componentStack,
 userAgent: navigator.userAgent,
 url: window.location.href,
 timestamp: new Date().toISOString(),
 }

 navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
 .then(() => {
 alert('Информация об ошибке скопирована в буфер обмена. Пожалуйста, отправьте её разработчикам.')
 })
 .catch(() => {
 alert('Не удалось скопировать информацию об ошибке. Пожалуйста, сделайте скриншот страницы.')
 })
 }
 }

 render() {
 if (this.state.hasError) {
 if (this.props.fallback) {
 return this.props.fallback
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
 Что-то пошло не так
 </h1>
 <p className="text-muted-foreground">
 Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
 </p>
 </div>

 {process.env.NODE_ENV === 'development' && this.state.error && (
 <div className="bg-muted p-4 rounded-lg text-left">
 <h3 className="font-medium text-foreground mb-2">Информация для разработчиков:</h3>
 <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
 {this.state.error.toString()}
 {this.state.errorInfo?.componentStack}
 </pre>
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <Button onClick={this.handleRetry} variant="default" className="gap-2">
 <RefreshCw className="h-4 w-4" />
 Попробовать снова
 </Button>
 <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
 <Home className="h-4 w-4" />
 На главную
 </Button>
 {this.state.error && (
 <Button
 onClick={() => this.handleReportError()}
 variant="secondary"
 className="gap-2"
 >
 <Bug className="h-4 w-4" />
 Сообщить об ошибке
 </Button>
 )}
 </div>

 <p className="text-xs text-muted-foreground">
 Если проблема persists, пожалуйста, свяжитесь с поддержкой.
 </p>
 </div>
 </div>
 )
 }

 return this.props.children
 }
}

// Hook for functional components
export const useErrorHandler = () => {
 return (error: Error, errorInfo?: { componentStack?: string }) => {
 console.error('Error caught by useErrorHandler:', error, errorInfo)

 // Send to error monitoring
 if (typeof window !== 'undefined' && (window as any).Sentry) {
 ;(window as any).Sentry.captureException(error, {
 contexts: errorInfo ? {
 react: {
 componentStack: errorInfo.componentStack,
 },
 } : undefined,
 })
 }
 }
}
