'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, PlayCircle, CreditCard, HelpCircle } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface PublicHeaderProps {
  showNav?: boolean
  alwaysShowAuthButtons?: boolean
}

export function PublicHeader({ showNav = true, alwaysShowAuthButtons = false }: PublicHeaderProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isHomePage = pathname === '/'

  const handleGoToApp = () => {
    setIsRedirecting(true)
    // Router navigation is handled by Link, we just set loading state
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 transition-colors">
      <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/" />
        {showNav && (
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href={isHomePage ? "#features" : "/#features"} 
              className="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#E63946] dark:hover:text-[#E63946] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2"
              aria-label="Перейти к разделу Возможности"
            >
              <Zap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative">
                Возможности
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link 
              href={isHomePage ? "#how-it-works" : "/#how-it-works"} 
              className="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#E63946] dark:hover:text-[#E63946] focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2"
              aria-label="Перейти к разделу Как это работает"
            >
              <PlayCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative">
                Как это работает
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link
              href="/pricing"
              className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2 ${
                pathname === '/pricing'
                  ? 'text-[#E63946] dark:text-[#E63946] bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#E63946] dark:hover:text-[#E63946]'
              }`}
              aria-label="Перейти к разделу Тарифы"
            >
              <CreditCard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative">
                Тарифы
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] transition-all duration-300 ${
                  pathname === '/pricing' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </span>
            </Link>
            <Link
              href="/faq"
              className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2 ${
                pathname === '/faq'
                  ? 'text-[#E63946] dark:text-[#E63946] bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#E63946] dark:hover:text-[#E63946]'
              }`}
              aria-label="Перейти к разделу Частые вопросы"
            >
              <HelpCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="relative">
                FAQ
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] transition-all duration-300 ${
                  pathname === '/faq' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </span>
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {alwaysShowAuthButtons || isHomePage ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Зарегистрироваться</Link>
              </Button>
            </>
          ) : status === 'authenticated' ? (
            <Button 
              variant="ghost" 
              size="sm"
              disabled={isRedirecting}
              asChild
            >
              <Link href="/manage" onClick={handleGoToApp}>
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Переход...
                  </>
                ) : (
                  'Войти'
                )}
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Зарегистрироваться</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

