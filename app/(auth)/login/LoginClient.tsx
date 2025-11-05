'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui/toast-context'

export const LoginClient = () => {
 const router = useRouter()
 const { push: pushToast } = useToast()
 const [email, setEmail] = useState('founder@example.com')
 const [password, setPassword] = useState('Demo1234!')
 const [error, setError] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()

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
 <div className="min-h-screen flex items-center justify-center p-4">
 <div className="w-full max-w-md">
 <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>

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

 {error && (
 <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <Button type="submit" className="w-full" disabled={isPending}>
 {isPending ? 'Входим...' : 'Войти'}
 </Button>
 </form>

 <div className="mt-4 flex items-center justify-between text-sm">
 <Link href="/reset-password/request" className="text-blue-600 hover:underline">
 Забыли пароль?
 </Link>
 <Link href="/register" className="text-blue-600 hover:underline">
 Зарегистрироваться
 </Link>
 </div>

 {process.env.NODE_ENV === 'development' && (
 <div className="mt-6 rounded border border-gray-300 bg-gray-50 p-4 text-xs">
 <p className="mb-2 font-medium">Демо данные:</p>
 <p>Email: <span className="font-mono">founder@example.com</span></p>
 <p>Пароль: <span className="font-mono">Demo1234!</span></p>
 </div>
 )}
 </div>
 </div>
 )
}

