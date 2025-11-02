import Link from 'next/link'

export const dynamic = 'force-dynamic'

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">AI Agent Platform</h1>
      <p className="max-w-xl text-base text-slate-600">
        Базовая заготовка для новой версии продукта. Доступна авторизация через Supabase и
        интеграция с Kommo CRM, остальной функционал будет добавлен позже.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/register"
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Зарегистрироваться
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
        >
          Войти
        </Link>
      </div>
    </div>
  )
}

export default LandingPage
