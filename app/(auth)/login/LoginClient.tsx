'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export const LoginClient = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!result?.ok) {
      setIsSubmitting(false)
      setError('Неверный email или пароль. Попробуйте ещё раз.')
      return
    }

    window.location.href = '/workspace'
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-2xl font-semibold text-slate-900">Вход</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Введите данные Supabase аккаунта, чтобы продолжить.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          {isSubmitting ? 'Входим...' : 'Войти'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-slate-900 underline">
          Зарегистрируйтесь
        </Link>
      </div>
    </div>
  )
}
