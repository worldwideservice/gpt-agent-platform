'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/Button'

interface AgentsErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

const AgentsError = ({ error, reset }: AgentsErrorBoundaryProps) => {
  useEffect(() => {
    console.error('Agents page error', error)
  }, [error])

  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      <div>
        <h2 className="text-lg font-semibold">Произошла ошибка загрузки агентов</h2>
        <p className="mt-2 text-sm">
          Попробуйте обновить страницу или повторите попытку позже. Если ошибка повторяется, обратитесь к администратору.
        </p>
      </div>
      <Button variant="danger" onClick={reset} className="w-fit">
        Попробовать снова
      </Button>
    </div>
  )
}

export default AgentsError
