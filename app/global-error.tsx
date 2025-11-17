/**
 * Global Error Handler
 * Catches errors in the root layout
 * Must be a Client Component and include <html> and <body> tags
 */

'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to external error monitoring
    console.error('Global error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <html lang="ru">
      <head>
        <title>Критическая ошибка - GPT Agent Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)',
            padding: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '42rem',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
            role="alert"
            aria-live="assertive"
          >
            {/* Icon */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                role="img"
                aria-label="Иконка критической ошибки"
              >
                <svg
                  style={{ width: '2.5rem', height: '2.5rem', color: '#dc2626' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: '#111827',
              }}
            >
              Критическая ошибка приложения
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '1rem' }}>
              Произошла критическая ошибка. Пожалуйста, обновите страницу или попробуйте позже.
            </p>

            {error.digest && (
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '2rem' }}>
                ID ошибки: <code style={{
                  backgroundColor: '#f3f4f6',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                }}>{error.digest}</code>
              </p>
            )}

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
              role="navigation"
              aria-label="Действия после ошибки"
            >
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Попробовать снова
              </button>
              <a
                href="/"
                style={{
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                На главную
              </a>
            </div>

            {/* Help */}
            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              Если проблема повторяется, обратитесь в{' '}
              <a
                href="/support"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                службу поддержки
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}



































