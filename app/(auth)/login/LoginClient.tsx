'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast-context'

const formSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  rememberMe: z.boolean(),
})

export const LoginClient = () => {
  const router = useRouter()
  const { push: pushToast } = useToast()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: process.env.NODE_ENV === 'development' ? 'founder@example.com' : '',
      password: process.env.NODE_ENV === 'development' ? 'Demo1234!' : '',
      rememberMe: false,
    },
    resolver: zodResolver(formSchema),
  })

  // Проверяем, авторизован ли пользователь и есть ли rememberMe
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Проверяем, есть ли rememberMe через API
      fetch('/api/auth/check-session', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.hasRememberMe) {
            // Если есть rememberMe, редиректим на платформу
            fetch('/api/auth/get-tenant-redirect', { cache: 'no-store' })
              .then((res) => res.json())
              .then((redirectData) => {
                if (redirectData.success && redirectData.tenantId) {
                  router.push(`/manage/${redirectData.tenantId}`)
                  router.refresh()
                }
              })
          }
        })
    }
  }, [status, session, router])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === 'true') {
      pushToast({
        title: 'Регистрация завершена! ✅',
        description: 'Войдите в систему используя ваш email и пароль.',
        variant: 'success',
      })
      router.replace('/login')
    }
  }, [pushToast, router])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setError(null)

      try {
        // Устанавливаем rememberMe cookie перед signIn
        if (data.rememberMe) {
          document.cookie = `rememberMe=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        }

        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Неверные email или пароль')
          form.setError('password', { message: 'Неверные email или пароль' })
          return
        }

        if (result?.ok) {
          // Если rememberMe установлен, вызываем API для установки долгосрочной сессии
          if (data.rememberMe) {
            try {
              await fetch('/api/auth/set-remember-me', {
                method: 'POST',
                cache: 'no-store',
              })
            } catch (rememberMeError) {
              console.error('[LoginClient] Failed to set remember me:', rememberMeError)
              // Не блокируем вход, если не удалось установить rememberMe
            }
          }

          // Ждем, чтобы сессия успела обновиться (увеличено до 1000ms)
          console.log('[LoginClient] Waiting for session to update...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Обновляем сессию на клиенте
          console.log('[LoginClient] Refreshing router...')
          router.refresh()
          await new Promise(resolve => setTimeout(resolve, 500))

          try {
            // Retry логика для получения tenant-id (до 5 попыток с интервалом 1.5 секунды)
            let redirectData: { success: boolean; tenantId?: string; error?: string } | null = null
            let lastError: Error | null = null
            const maxRetries = 5
            const retryDelay = 1500 // 1.5 секунды

            console.log(`[LoginClient] Starting tenant-id retrieval with ${maxRetries} retries`)

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                console.log(`[LoginClient] Attempt ${attempt}/${maxRetries}: Fetching tenant-id...`)
                const redirectResponse = await fetch('/api/auth/get-tenant-redirect', {
                  cache: 'no-store',
                })
                
                if (!redirectResponse.ok) {
                  throw new Error(`HTTP ${redirectResponse.status}: Failed to get redirect URL`)
                }
                
                redirectData = await redirectResponse.json()
                console.log(`[LoginClient] Attempt ${attempt} response:`, {
                  success: redirectData?.success,
                  hasTenantId: !!redirectData?.tenantId,
                  error: redirectData?.error,
                })

                if (redirectData?.success && redirectData?.tenantId) {
                  // Успешно получили tenant-id
                  console.log(`[LoginClient] Successfully got tenant-id on attempt ${attempt}`)
                  break
                } else if (attempt < maxRetries) {
                  // Еще есть попытки, ждем перед следующей
                  console.warn(`[LoginClient] Attempt ${attempt} failed, retrying in ${retryDelay}ms...`, {
                    error: redirectData?.error,
                    response: redirectData,
                  })
                  await new Promise(resolve => setTimeout(resolve, retryDelay))
                  // Обновляем сессию перед следующей попыткой
                  console.log(`[LoginClient] Refreshing router before attempt ${attempt + 1}...`)
                  router.refresh()
                  await new Promise(resolve => setTimeout(resolve, 500))
                }
              } catch (fetchError) {
                lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError))
                console.error(`[LoginClient] Attempt ${attempt} error:`, {
                  error: lastError.message,
                  stack: lastError.stack,
                })
                if (attempt < maxRetries) {
                  console.log(`[LoginClient] Retrying in ${retryDelay}ms...`)
                  await new Promise(resolve => setTimeout(resolve, retryDelay))
                  console.log(`[LoginClient] Refreshing router before retry...`)
                  router.refresh()
                  await new Promise(resolve => setTimeout(resolve, 500))
                }
              }
            }

            if (redirectData?.success && redirectData.tenantId) {
              pushToast({
                title: 'Вход выполнен! ✅',
                description: `Добро пожаловать, ${data.email}!`,
                variant: 'success',
              })
              router.push(`/manage/${redirectData.tenantId}`)
              router.refresh()
            } else {
              const errorMessage = redirectData?.error || lastError?.message || 'Не удалось определить вашу организацию'
              console.error('[LoginClient] Failed to get tenant-id after all retries', {
                error: errorMessage,
                redirectData,
                lastError: lastError?.message,
                attempts: maxRetries,
                email: data.email,
              })
              
              // Более детальное сообщение об ошибке
              const detailedError = redirectData?.error 
                ? `Ошибка: ${redirectData.error}. Попробуйте обновить страницу и войти заново.`
                : lastError?.message
                ? `Ошибка сети: ${lastError.message}. Проверьте подключение к интернету.`
                : 'Не удалось определить вашу организацию. Убедитесь, что вы зарегистрированы и ваша учетная запись активна. Если проблема сохраняется, обратитесь в поддержку.'
              
              pushToast({
                title: 'Ошибка входа',
                description: detailedError,
                variant: 'error',
              })
            }
          } catch (redirectError) {
            console.error('[LoginClient] Redirect error:', redirectError)
            const errorMessage = redirectError instanceof Error ? redirectError.message : 'Не удалось определить вашу организацию'
            pushToast({
              title: 'Ошибка входа',
              description: errorMessage || 'Не удалось определить вашу организацию. Попробуйте войти заново.',
              variant: 'error',
            })
          }
          return
        }

        setError('Неверные email или пароль')
        form.setError('password', { message: 'Неверные email или пароль' })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неверные email или пароль'
        setError(errorMessage)
        form.setError('password', { message: errorMessage })
      }
    })
  }

  return (
    <div className="flex items-start justify-center pt-8 w-full">
      <div className="relative max-w-sm w-full border rounded-xl px-8 py-8 shadow-lg/5 dark:shadow-xl bg-gradient-to-b from-muted/50 dark:from-transparent to-card overflow-hidden">
        <div
          className="absolute inset-0 z-0 -top-px -left-px"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 0',
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />

        <div className="relative isolate flex flex-col items-center">
          <p className="text-xl font-semibold tracking-tight">
            Вход в TON 18
          </p>

          <Form {...form}>
            <form
              className="w-full space-y-6 mt-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Пароль"
                        className="w-full"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">
                        Запомнить меня
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {error && (
                <div className="rounded border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Входим...' : 'Войти'}
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5 w-full">
            <Link
              href="/reset-password/request"
              className="text-sm block underline text-muted-foreground text-center"
            >
              Забыли пароль?
            </Link>
            <p className="text-sm text-center">
              Нет аккаунта?{' '}
              <Link href="/register" className="ml-1 underline text-muted-foreground">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 text-xs w-full">
              <p className="mb-2 font-medium text-gray-900 dark:text-gray-100">Демо данные:</p>
              <p className="text-gray-600 dark:text-gray-400">
                Email: <span className="font-mono text-gray-900 dark:text-gray-100">founder@example.com</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Пароль: <span className="font-mono text-gray-900 dark:text-gray-100">Demo1234!</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

