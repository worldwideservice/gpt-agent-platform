'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
 user: {
 name?: string | null
 email?: string | null
 }
 subscriptionRenewsAt?: string | null
 tenantId?: string
 onSidebarToggle?: () => void
}


export const Header = ({ user, tenantId, onSidebarToggle }: HeaderProps) => {
 const userName = user.name ?? 'Пользователь'
 const [userMenuOpen, setUserMenuOpen] = useState(false)

 const handleSignOut = () => {
 void signOut({ callbackUrl: '/login' })
 }

 const getInitials = (name: string): string => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
 }

 return (
 <nav className="flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4">
 {onSidebarToggle && (
 <button
 type="button"
 onClick={onSidebarToggle}
 className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
 aria-label="Меню"
 >
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
 </svg>
 </button>
 )}

 <div className="flex flex-1 items-center justify-end">
 <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
 <DropdownMenuTrigger asChild>
 <button
 type="button"
 className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white text-sm font-semibold"
 aria-label="Меню пользователя"
 >
 {getInitials(userName)}
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-48">
 <div className="px-3 py-2 text-sm font-medium">{userName}</div>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
 <LogOut className="mr-2 h-4 w-4" />
 Выйти
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </nav>
 )
}
