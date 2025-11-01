'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'

import { KwidButton, KwidInput } from '@/components/kwid'
import { Card } from '@/components/ui/Card'
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

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Ошибка при регистрации')
        }

        const data = await response.json()

        // Показываем уведомление об успешной регистрации
        pushToast({
          title: 'Регистрация успешна! 🎉',
          description: `Аккаунт "${data.user.email}" создан. Организация "${data.user.name}" готова к работе.`,
          variant: 'success',
        })

        // Небольшая задержка для лучшего UX
        await new Promise(resolve => setTimeout(resolve, 1500))

        // После успешной регистрации перенаправляем на логин
        router.push('/login?registered=true')
      } catch (error) {
        // Логируем ошибку только в development режиме
        if (process.env.NODE_ENV === 'development') {
          console.error('RegisterClient: Error during registration:', error)
        }
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка')
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8 dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-custom-100 text-custom-700 dark:bg-custom-900/30 dark:text-custom-400">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Регистрация в GPT Agent</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Создайте учетную запись для работы с AI-агентами</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <KwidInput
            id="firstName"
            label="Имя"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <KwidInput
            id="lastName"
            label="Фамилия"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>

        <KwidInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <KwidInput
          id="password"
          label="Пароль"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <KwidInput
          id="confirmPassword"
          label="Подтверждение пароля"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <KwidButton type="submit" variant="primary" className="w-full gap-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Создаём аккаунт...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Зарегистрироваться
            </>
          )}
        </KwidButton>
      </form>

      <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Что происходит после регистрации:</p>
        <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-custom-600 dark:text-custom-400">✓</span>
            <span>Создание вашего аккаунта</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-custom-600 dark:text-custom-400">✓</span>
            <span>Создание организации</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-custom-600 dark:text-custom-400">✓</span>
            <span>Уведомление будет сохранено в системе</span>
          </li>
        </ul>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Уже есть аккаунт? </span>
        <Link href="/login" className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">
          Войти
        </Link>
      </div>
    </Card>
  )
}
