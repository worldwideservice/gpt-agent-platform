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
      <div className="relative">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="TON 18 Logo"
            width={120}
            height={60}
            className="drop-shadow-sm object-contain"
            priority
          />
        ) : (
          <div className="w-[120px] h-[60px] bg-transparent" />
        )}
      </div>
      
      {/* Tagline только если нужно */}
      {showTagline && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-[10px] font-normal tracking-wider text-black dark:text-white">
            create infinity
          </span>
        </div>
      )}
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
            width={64}
            height={32}
            className="object-contain"
            priority
          />
        ) : (
          <div className="w-16 h-8 bg-transparent" />
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

