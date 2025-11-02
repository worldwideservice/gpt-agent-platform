'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error', error)
  }, [error])

  return (
    <html lang="ru">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="space-y-4 rounded-lg border border-red-200 bg-white p-8 shadow-lg">
            <div>
              <h2 className="text-lg font-semibold text-red-700">Произошла критическая ошибка</h2>
              <p className="mt-2 text-sm text-slate-600">
                {error.message || 'Произошла непредвиденная ошибка'}
              </p>
            </div>
            <button
              onClick={reset}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}














