'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface ConfirmFormProps {
  token: string
}

interface ConfirmResponse {
  success: boolean
  error?: string
}

export const ConfirmForm = ({ token }: ConfirmFormProps) => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }

    startTransition(async () => {
      setError(null)

      try {
        const response = await fetch('/api/auth/reset-password/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password }),
        })

        const payload = (await response.json()) as ConfirmResponse

        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? 'Не удалось сменить пароль')
        }

        setIsSuccess(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось сменить пароль'
        setError(message)
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Новый пароль</h1>
        <p className="mt-2 text-sm text-gray-600">
          Придумайте надёжный пароль для своей учётной записи.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Пароль успешно изменён. Теперь вы можете войти в систему.
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Вернуться ко входу
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Новый пароль
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="passwordConfirm">
              Подтвердите пароль
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Сохранение...' : 'Сохранить пароль'}
          </Button>
        </form>
      )}
    </Card>
  )
}
