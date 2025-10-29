'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
  variant?: 'icon' | 'button'
}

export const SignOutButton = ({ variant = 'icon' }: SignOutButtonProps) => {
  const handleSignOut = () => {
    void signOut({ callbackUrl: '/login' })
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Выход
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700"
      aria-label="Выйти"
    >
      <LogOut className="h-5 w-5" />
    </button>
  )
}






