'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast-context'

export const LoginClient = () => {
 const router = useRouter()
 const { push: pushToast } = useToast()
 const { data: session, status } = useSession()
 const [email, setEmail] = useState('founder@example.com')
 const [password, setPassword] = useState('Demo1234!')
 const [rememberMe, setRememberMe] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()

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

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault()

 startTransition(async () => {
 setError(null)

 try {
 // Устанавливаем rememberMe cookie перед signIn
 if (rememberMe) {
 document.cookie = `rememberMe=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
 }

 const result = await signIn('credentials', {
 email,
 password,
 redirect: false,
 })

 if (result?.error) {
 setError('Неверные email или пароль')
 return
 }

 if (result?.ok) {
      // Если rememberMe установлен, вызываем API для установки долгосрочной сессии
      if (rememberMe) {
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

      // Ждем немного, чтобы сессия успела обновиться
      await new Promise(resolve => setTimeout(resolve, 500))

      try {
        // Получаем tenant-id для редиректа
        const redirectResponse = await fetch('/api/auth/get-tenant-redirect', {
          cache: 'no-store',
        })
        
        if (!redirectResponse.ok) {
          throw new Error('Failed to get redirect URL')
        }
        
        const redirectData = await redirectResponse.json()

        if (redirectData.success && redirectData.tenantId) {
          pushToast({
            title: 'Вход выполнен! ✅',
            description: `Добро пожаловать, ${email}!`,
            variant: 'success',
          })
          // Используем router.push вместо window.location.href для лучшей навигации
          router.push(`/manage/${redirectData.tenantId}`)
          router.refresh()
        } else {
          pushToast({
            title: 'Ошибка входа',
            description: redirectData.error || 'Не удалось определить вашу организацию. Попробуйте войти заново.',
            variant: 'error',
          })
        }
      } catch (redirectError) {
        console.error('[LoginClient] Redirect error:', redirectError)
        pushToast({
          title: 'Ошибка входа',
          description: 'Не удалось определить вашу организацию. Попробуйте войти заново.',
          variant: 'error',
        })
      }
      return
    }

 setError('Неверные email или пароль')

 } catch (error) {
 setError(error instanceof Error ? error.message : 'Неверные email или пароль')
 }
 })
 }

 return (
 <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
 <Card className="w-full max-w-md shadow-lg">
 <CardHeader className="space-y-1">
 <CardTitle className="text-2xl font-bold text-center">Вход</CardTitle>
 <CardDescription className="text-center">
 Войдите в свой аккаунт для продолжения
 </CardDescription>
 </CardHeader>
 <CardContent>
 <form className="space-y-4" onSubmit={handleSubmit}>
 <Input
 id="email"
 name="email"
 type="email"
 label="Email"
 autoComplete="email"
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 required
 />

 <Input
 id="password"
 name="password"
 type="password"
 label="Пароль"
 autoComplete="current-password"
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 required
 />

 <div className="flex items-center space-x-2">
 <Checkbox
 id="rememberMe"
 checked={rememberMe}
 onCheckedChange={(checked) => setRememberMe(checked === true)}
 />
 <Label
 htmlFor="rememberMe"
 className="text-sm font-normal cursor-pointer"
 >
 Запомнить меня
 </Label>
 </div>

 {error && (
 <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <Button type="submit" className="w-full" disabled={isPending}>
 {isPending ? 'Входим...' : 'Войти'}
 </Button>
 </form>

 <div className="mt-6 flex items-center justify-between text-sm">
 <Link href="/reset-password/request" className="text-primary hover:underline">
 Забыли пароль?
 </Link>
 <Link href="/register" className="text-primary hover:underline">
 Зарегистрироваться
 </Link>
 </div>

 {process.env.NODE_ENV === 'development' && (
 <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 text-xs">
 <p className="mb-2 font-medium text-gray-900 dark:text-gray-100">Демо данные:</p>
 <p className="text-gray-600 dark:text-gray-400">Email: <span className="font-mono text-gray-900 dark:text-gray-100">founder@example.com</span></p>
 <p className="text-gray-600 dark:text-gray-400">Пароль: <span className="font-mono text-gray-900 dark:text-gray-100">Demo1234!</span></p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 )
}

