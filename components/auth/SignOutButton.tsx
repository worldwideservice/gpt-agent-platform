'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

import { KwidButton } from '@/components/kwid'

interface SignOutButtonProps {
  variant?: 'icon' | 'button'
}

export const SignOutButton = ({ variant = 'button' }: SignOutButtonProps) => {
  const handleSignOut = () => {
    void signOut({ callbackUrl: '/login' })
  }

  if (variant === 'button') {
    return (
      <KwidButton
        type="button"
        onClick={handleSignOut}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Выход
      </KwidButton>
    )
  }

  return (
    <KwidButton
      type="button"
      onClick={handleSignOut}
      variant="primary"
      size="sm"
      className="h-10 w-10 rounded-full"
      aria-label="Выйти"
    >
      <LogOut className="h-5 w-5" />
    </KwidButton>
  )
}






