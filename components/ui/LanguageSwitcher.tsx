'use client'

import { KwidButton } from '@/components/kwid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { usePathname } from 'next/navigation'

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export const LanguageSwitcher = () => {
  // Use default locale since next-intl is temporarily disabled
  const locale = 'ru'
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Language switching temporarily disabled
    // Will be re-enabled when next-intl is fully configured
    console.log('Language change requested:', newLocale)
    // TODO: Re-enable when next-intl is configured
    // router.replace(pathname, { locale: newLocale })
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
