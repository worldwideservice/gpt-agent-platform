import { Calendar, Bell } from 'lucide-react'

import { SignOutButton } from '@/components/auth/SignOutButton'
import { auth } from '@/auth'

export const Header = async () => {
  const session = await auth()
  const today = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())

  const userName = session?.user?.name ?? 'Пользователь'
  const userEmail = session?.user?.email ?? '—'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-900">GPT Агент</h1>
          <p className="text-xs text-gray-500">Trainable virtual employee</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">{today}</span>
          </div>

          <button
            type="button"
            className="relative rounded-full p-2 text-gray-600 transition-colors hover:text-gray-900"
            aria-label="Уведомления"
          >
            <Bell className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
