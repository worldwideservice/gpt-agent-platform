'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toast-context'

export const RegisterClient = () => {
  const router = useRouter()
  const { push: pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    startTransition(async () => {
      setError(null)

      try {
        console.log('RegisterClient: Starting registration...')
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        })

        console.log('RegisterClient: Response status:', response.status)

        if (!response.ok) {
          const data = await response.json()
          console.log('RegisterClient: Error response:', data)
          throw new Error(data.error || 'Ошибка при регистрации')
        }

        const data = await response.json()
        console.log('RegisterClient: Success response:', data)

        // Показываем уведомление об успешной регистрации
        console.log('RegisterClient: Showing toast...')
        alert('Регистрация успешна! Перенаправляем на страницу входа...')
        pushToast({
          title: 'Регистрация успешна!',
          description: 'Ваша учетная запись создана. Теперь вы можете войти в систему.',
          variant: 'success',
        })

        // После успешной регистрации перенаправляем на логин
        console.log('RegisterClient: Redirecting to login...')
        router.push('/login')
      } catch (error) {
        console.error('RegisterClient: Error during registration:', error)
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка')
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Регистрация в GPT Agent</h1>
        <p className="mt-2 text-sm text-gray-600">Создайте учетную запись для работы с AI-агентами</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="firstName">
              Имя
            </label>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="lastName">
              Фамилия
            </label>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            Подтверждение пароля
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Регистрируемся...
            </>
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Уже есть аккаунт? </span>
        <Link href="/login" className="text-primary-600 hover:text-primary-700">
          Войти
        </Link>
      </div>
    </Card>
  )
}
