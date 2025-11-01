'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export const LoginClient = () => {
  const router = useRouter()
  const [email, setEmail] = useState('founder@example.com')
  const [password, setPassword] = useState('Demo1234!')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      setError(null)

      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/agents',
      })

      if (result?.error) {
        setError('Неверные email или пароль')
        return
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Вход в GPT Agent</h1>
        <p className="mt-2 text-sm text-gray-600">Введите учетные данные администратора организации</p>
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

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
            Пароль
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Входим...
            </>
          ) : (
            'Войти'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <Link href="/reset-password/request" className="text-primary-600 hover:text-primary-700">
          Забыли пароль?
        </Link>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Нет аккаунта? </span>
        <Link href="/register" className="text-primary-600 hover:text-primary-700">
          Зарегистрироваться
        </Link>
      </div>

      <div className="mt-6 rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
        <p className="font-medium">Демо-учётные данные</p>
        <p>Email: founder@example.com</p>
        <p>Пароль: Demo1234!</p>
      </div>
    </Card>
  )
}

