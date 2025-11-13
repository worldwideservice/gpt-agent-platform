'use client'

import { LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui'
import { useTheme } from '@/lib/providers/theme-provider'

interface UserMenuProps {
  userName?: string
  userEmail?: string
  userImage?: string
}

export function UserMenu({ userName = 'Admin', userEmail, userImage }: UserMenuProps) {
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const userInitials = userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full" aria-label="Меню пользователя">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userImage} alt={`Аватар ${userName}`} />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {userInitials || 'A'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            {userEmail && <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Тема оформления</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Светлая</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Тёмная</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={theme === 'system' ? 'bg-accent' : ''}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Системная</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-rose-600 focus:text-rose-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
