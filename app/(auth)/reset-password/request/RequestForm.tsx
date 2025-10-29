'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface ResetResponse {
  success: boolean
  error?: string
}

export const RequestForm = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      setError(null)
      setIsSuccess(false)

      try {
        const response = await fetch('/api/auth/reset-password/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const payload = (await response.json()) as ResetResponse

        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? 'Не удалось отправить ссылку для сброса')
        }

        setIsSuccess(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось отправить ссылку для сброса'
        setError(message)
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Сброс пароля</h1>
        <p className="mt-2 text-sm text-gray-600">
          Введите email аккаунта, и мы отправим ссылку для сброса пароля.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {isSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Если указанный email зарегистрирован, мы отправили инструкцию по сбросу пароля.
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Отправка...' : 'Отправить ссылку'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Вспомнили пароль?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700">
          Вернуться ко входу
        </Link>
      </div>
    </Card>
  )
}
