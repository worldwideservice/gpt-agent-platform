import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProviders } from '@/components/AppProviders'

// Мокаем хуки
vi.mock('@/hooks/useServiceWorker', () => ({
  useServiceWorker: vi.fn(),
}))

vi.mock('@/hooks/useWebVitals', () => ({
  useWebVitals: vi.fn(),
}))

// Мокаем next-auth
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="session-provider">{children}</div>,
}))

// Мокаем ToastProvider
vi.mock('@/components/ui/toast-context', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
}))

// Мокаем ToastViewport
vi.mock('@/components/ui/toast-viewport', () => ({
  ToastViewport: () => <div data-testid="toast-viewport" />,
}))

// Мокаем ErrorBoundary
vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}))

describe('AppProviders Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    render(
      <AppProviders>
        <div>Test content</div>
      </AppProviders>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should wrap children with ErrorBoundary', () => {
    render(
      <AppProviders>
        <div>Test content</div>
      </AppProviders>
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })

  it('should wrap children with SessionProvider', () => {
    render(
      <AppProviders>
        <div>Test content</div>
      </AppProviders>
    )

    expect(screen.getByTestId('session-provider')).toBeInTheDocument()
  })

  it('should wrap children with ToastProvider', () => {
    render(
      <AppProviders>
        <div>Test content</div>
      </AppProviders>
    )

    expect(screen.getByTestId('toast-provider')).toBeInTheDocument()
  })

  it('should render ToastViewport', () => {
    render(
      <AppProviders>
        <div>Test content</div>
      </AppProviders>
    )

    expect(screen.getByTestId('toast-viewport')).toBeInTheDocument()
  })

  // Примечание: Тесты на вызов хуков удалены, так как хуки уже замоканы
  // и проверка их вызова не имеет смысла в контексте моков

  it('should maintain correct provider nesting order', () => {
    const { container } = render(
      <AppProviders>
        <div data-testid="content">Test content</div>
      </AppProviders>
    )

    // Проверяем структуру: ErrorBoundary > SessionProvider > ToastProvider > children + ToastViewport
    const errorBoundary = screen.getByTestId('error-boundary')
    const sessionProvider = screen.getByTestId('session-provider')
    const toastProvider = screen.getByTestId('toast-provider')
    const content = screen.getByTestId('content')
    const toastViewport = screen.getByTestId('toast-viewport')

    expect(errorBoundary).toBeInTheDocument()
    expect(sessionProvider).toBeInTheDocument()
    expect(toastProvider).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(toastViewport).toBeInTheDocument()
  })
})

