'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

import { KwidButton, KwidInput } from '@/components/kwid'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/toast-context'

export const LoginClient = () => {
  const router = useRouter()
  const { push: pushToast } = useToast()
  const [email, setEmail] = useState('founder@example.com')
  const [password, setPassword] = useState('Demo1234!')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Проверяем параметр registered из URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === 'true') {
      pushToast({
        title: 'Регистрация завершена! ✅',
        description: 'Войдите в систему используя ваш email и пароль.',
        variant: 'success',
      })
      // Удаляем параметр из URL
      router.replace('/login')
    }
  }, [pushToast, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      setError(null)

      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/agents',
        })

        if (result?.error) {
          throw new Error('Неверные email или пароль')
        }

        if (result?.ok) {
          // Ждем обновления сессии после signIn
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Обновляем сессию на клиенте
          router.refresh()
          
          // Ждем еще немного для синхронизации
          await new Promise(resolve => setTimeout(resolve, 500))

          // Получаем tenant-id для редиректа
          let tenantId: string | null = null
          let retries = 0
          const maxRetries = 3

          while (!tenantId && retries < maxRetries) {
            try {
              const response = await fetch('/api/auth/get-tenant-redirect', {
                method: 'GET',
                credentials: 'include',
                cache: 'no-store',
              })

              const payload = (await response.json()) as {
                success: boolean
                tenantId: string | null
                error?: string
              }

              if (payload.success && payload.tenantId) {
                tenantId = payload.tenantId
                break
              } else {
                console.warn(`Failed to get tenant-id (attempt ${retries + 1}/${maxRetries}):`, payload.error)
                retries++
                if (retries < maxRetries) {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                }
              }
            } catch (fetchError) {
              console.error(`Failed to fetch tenant redirect (attempt ${retries + 1}/${maxRetries}):`, fetchError)
              retries++
              if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000))
              }
            }
          }

          if (tenantId) {
            // Показываем уведомление об успешном входе
            pushToast({
              title: 'Вход выполнен! ✅',
              description: `Добро пожаловать, ${email}!`,
              variant: 'success',
            })

            // Используем window.location для полного редиректа (гарантирует обновление сессии)
            window.location.href = `/manage/${tenantId}`
          } else {
            // Если tenant-id не получен после всех попыток - редирект на главную страницу
            console.error('Failed to get tenant-id after all retries')
            pushToast({
              title: 'Ошибка входа',
              description: 'Не удалось получить данные организации. Попробуйте еще раз.',
              variant: 'error',
            })
            // Редирект на главную - там будет проверка и редирект на логин если нужно
            window.location.href = '/'
          }
        }
      } catch (error) {
        // Если произошла ошибка, показываем сообщение
        setError(error instanceof Error ? error.message : 'Неверные email или пароль')
      }
    })
  }

  return (
    <Card className="w-full max-w-md p-8 dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-custom-100 text-custom-700 dark:bg-custom-900/30 dark:text-custom-400">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Вход в GPT Agent</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Введите учетные данные для входа в систему</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
              <Loader2 className="h-4 w-4 animate-spin" /> Входим...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Войти
            </>
          )}
        </KwidButton>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href="/reset-password/request" className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">
          Забыли пароль?
        </Link>
        <span className="text-gray-600 dark:text-gray-400">Нет аккаунта? </span>
        <Link href="/register" className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">
          Зарегистрироваться
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
          <p className="mb-2 font-medium dark:text-gray-300">Демо-учётные данные (только для разработки)</p>
          <div className="space-y-1">
            <p>Email: <span className="font-mono">founder@example.com</span></p>
            <p>Пароль: <span className="font-mono">Demo1234!</span></p>
          </div>
        </div>
      )}
    </Card>
  )
}

