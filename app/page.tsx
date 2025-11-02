import Link from 'next/link'

export const dynamic = 'force-dynamic'

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">AI Agent Platform</h1>
      <p className="max-w-xl text-base text-slate-600">
        Минимальная заготовка нового проекта. Авторизуйтесь, чтобы перейти в рабочую область и начинать
        строить функциональность с нуля.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Войти
      </Link>
    </div>
  )
}

export default LandingPage
