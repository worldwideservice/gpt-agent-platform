import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AppProviders } from '@/components/AppProviders'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'GPT Agent - Trainable virtual employee',
  description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

export default RootLayout

