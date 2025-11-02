import { redirect } from 'next/navigation'

import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

const WorkspacePage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center sm:px-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold sm:text-4xl">Рабочее пространство</h1>
        <p className="max-w-xl text-base text-slate-600">
          Вы вошли в систему как <span className="font-medium text-slate-900">{session.user.email}</span>. Эта страница
          пока пустая — можно начинать строить продукт.
        </p>
      </div>
    </div>
  )
}

export default WorkspacePage
