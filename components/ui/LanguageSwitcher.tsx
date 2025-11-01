'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { KwidButton } from '@/components/kwid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export const LanguageSwitcher = () => {
  // Safe hooks usage with fallback
  let locale = 'ru'
  let router: any = null
  let pathname = '/'
  
  try {
    locale = useLocale()
    router = useRouter()
    pathname = usePathname()
  } catch (error) {
    // If next-intl context is not available, use defaults
    console.warn('LanguageSwitcher: next-intl context not available, using defaults')
  }

  const handleLanguageChange = (newLocale: string) => {
    if (router) {
      try {
        router.replace(pathname, { locale: newLocale })
      } catch (error) {
        console.warn('LanguageSwitcher: Failed to change language', error)
      }
    }
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <KwidButton variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <span className="hidden md:inline">{currentLanguage?.name}</span>
        </KwidButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`gap-2 ${locale === language.code ? 'bg-accent' : ''}`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
