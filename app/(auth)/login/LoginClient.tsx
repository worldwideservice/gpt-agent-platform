'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { signIn, useSession, getSession } from 'next-auth/react'
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
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(formSchema),
  })

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

          // Ждем, чтобы сессия успела обновиться
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Обновляем сессию на клиенте через getSession
          try {
            await getSession()
          } catch (sessionError) {
            console.error('[LoginClient] Error fetching session:', sessionError)
          }

          // Обновляем роутер
          router.refresh()
          await new Promise(resolve => setTimeout(resolve, 500))

          try {
            // Retry логика для получения tenant-id (до 8 попыток с интервалом 2 секунды)
            // Увеличено количество попыток и время ожидания, так как сессия может обновляться медленно
            let redirectData: { success: boolean; tenantId?: string; error?: string } | null = null
            let lastError: Error | null = null
            const maxRetries = 8
            const retryDelay = 2000 // 2 секунды

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                const redirectResponse = await fetch('/api/auth/get-tenant-redirect', {
                  cache: 'no-store',
                })

                if (!redirectResponse.ok) {
                  throw new Error(`HTTP ${redirectResponse.status}: Failed to get redirect URL`)
                }

                redirectData = await redirectResponse.json()

                if (redirectData?.success && redirectData?.tenantId) {
                  // Успешно получили tenant-id
                  break
                } else if (attempt < maxRetries) {
                  // Обновляем сессию перед следующей попыткой
                  router.refresh()

                  // Ждем дольше для обновления сессии
                  await new Promise(resolve => setTimeout(resolve, retryDelay))

                  // Дополнительно обновляем сессию через getSession
                  try {
                    await getSession()
                  } catch (sessionError) {
                    console.error(`[LoginClient] Session refresh error (attempt ${attempt + 1}):`, sessionError)
                  }
                }
              } catch (fetchError) {
                lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError))
                if (attempt === maxRetries) {
                  // Только логируем финальную ошибку
                  console.error('[LoginClient] All retry attempts failed:', lastError)
                }
                if (attempt < maxRetries) {
                  await new Promise(resolve => setTimeout(resolve, retryDelay))
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

              // Используем window.location.href для гарантированного полного редиректа
              const redirectUrl = `/manage/${redirectData.tenantId}`

              // Небольшая задержка для отображения toast
              await new Promise(resolve => setTimeout(resolve, 300))

              window.location.href = redirectUrl
              return
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

        </div>
      </div>
    </div>
  )
}
