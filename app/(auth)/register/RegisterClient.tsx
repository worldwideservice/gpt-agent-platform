'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui/toast-context'

export const RegisterClient = () => {
 const router = useRouter()
 const { push: pushToast } = useToast()
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [confirmPassword, setConfirmPassword] = useState('')
 const [firstName, setFirstName] = useState('')
 const [lastName, setLastName] = useState('')
 const [organizationName, setOrganizationName] = useState('')
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
 organizationName: organizationName.trim() || undefined,
 }),
 })

 if (!response.ok) {
 const data = await response.json()
 throw new Error(data.error || 'Ошибка при регистрации')
 }

 const data = await response.json()

 pushToast({
 title: 'Регистрация успешна! 🎉',
 description: `Аккаунт "${data.user.email}" создан.`,
 variant: 'success',
 })

 await new Promise(resolve => setTimeout(resolve, 1500))

 router.push('/login?registered=true')
 } catch (error) {
 if (process.env.NODE_ENV === 'development') {
 console.error('RegisterClient: Error during registration:', error)
 }
 setError(error instanceof Error ? error.message : 'Неизвестная ошибка')
 }
 })
 }

 return (
 <div className="min-h-screen flex items-center justify-center p-4">
 <div className="w-full max-w-md">
 <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

 <form className="space-y-4" onSubmit={handleSubmit}>
 <div className="grid grid-cols-2 gap-4">
 <Input
 id="firstName"
 label="Имя"
 type="text"
 autoComplete="given-name"
 value={firstName}
 onChange={(event) => setFirstName(event.target.value)}
 required
 />
 <Input
 id="lastName"
 label="Фамилия"
 type="text"
 autoComplete="family-name"
 value={lastName}
 onChange={(event) => setLastName(event.target.value)}
 required
 />
 </div>

 <Input
 id="email"
 label="Email"
 type="email"
 autoComplete="email"
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 required
 />

 <Input
 id="organizationName"
 label="Название организации (необязательно)"
 type="text"
 autoComplete="organization"
 value={organizationName}
 onChange={(event) => setOrganizationName(event.target.value)}
 />

 <Input
 id="password"
 label="Пароль"
 type="password"
 autoComplete="new-password"
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 required
 />

 <Input
 id="confirmPassword"
 label="Подтверждение пароля"
 type="password"
 autoComplete="new-password"
 value={confirmPassword}
 onChange={(event) => setConfirmPassword(event.target.value)}
 required
 />

 {error && (
 <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <Button type="submit" className="w-full" disabled={isPending}>
 {isPending ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
 </Button>
 </form>

 <div className="mt-4 text-center text-sm">
 <span className="text-gray-600">Уже есть аккаунт? </span>
 <Link href="/login" className="text-blue-600 hover:underline">
 Войти
 </Link>
 </div>
 </div>
 </div>
 )
}
