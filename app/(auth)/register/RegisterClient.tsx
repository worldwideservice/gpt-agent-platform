'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface RegisterState {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  organizationName: string
}

export const RegisterClient = () => {
  const router = useRouter()
  const [form, setForm] = useState<RegisterState>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        organizationName: form.organizationName.trim() || undefined,
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setIsSubmitting(false)
      setError(payload?.error || 'Не удалось создать аккаунт.')
      return
    }

    router.push('/login')
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-2xl font-semibold text-slate-900">Регистрация</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Создайте учётную запись, чтобы подключить Supabase и Kommo CRM.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Имя
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Фамилия
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Организация (опционально)
          <input
            name="organizationName"
            value={form.organizationName}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Пароль
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Подтверждение пароля
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-slate-900 underline">
          Войти
        </Link>
      </div>
    </div>
  )
}
