'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showTagline?: boolean
  href?: string
}

export const Logo = ({ className, showTagline = false, href }: LogoProps) => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Слушаем изменения темы
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const logoSrc = isDark ? '/logo_transparent white.png' : '/logo_transparent.png'

  const content = (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Логотип */}
      <div className="relative mb-2">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="TON 18 Logo"
            width={80}
            height={40}
            className="drop-shadow-sm"
            priority
          />
        ) : (
          <div className="w-20 h-10 bg-transparent" />
        )}
      </div>
      
      {/* Текст TON 18 */}
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold tracking-tight text-black dark:text-white">
          TON 18
        </span>
        {showTagline && (
          <span className="text-[10px] font-normal tracking-wider text-black dark:text-white mt-0.5">
            create infinity
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}

// Компактная версия для Sidebar
export const LogoCompact = ({ className, href }: { className?: string; href?: string }) => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Слушаем изменения темы
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const logoSrc = isDark ? '/logo_transparent white.png' : '/logo_transparent.png'

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Компактный логотип */}
      <div className="relative">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="TON 18 Logo"
            width={48}
            height={24}
            className="object-contain"
            priority
          />
        ) : (
          <div className="w-12 h-6 bg-transparent" />
        )}
      </div>
      <span className="text-xl font-bold tracking-tight text-black dark:text-white">
        TON 18
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}

